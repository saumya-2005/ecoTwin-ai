
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  Building2,
  Search,
  Grid,
  List,
  Sun,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const emptyForm = {
  name: '',
  code: '',
  category: 'Academic',
  areaSqFt: '',
  occupantCapacity: '',
  floors: '',
  yearBuilt: '',
  zone: '',
  solarCapacityKw: '',
  hvacEfficiencyRating: 'B+',
  baselineMonthlyElectricityKwh: '',
  baselineMonthlyWaterLiters: '',
};

export default function BuildingsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBuildingModal, setActiveBuildingModal] = useState<any | null>(null);
  const [rawBuildings, setRawBuildings] = useState<any[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);

  // Add Building form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canManageBuildings = user?.role === 'Admin' || user?.role === 'Staff';

  const loadBuildings = () => {
    setLoadingBuildings(true);
    api
      .get('/buildings')
      .then((res) => {
        if (res.data && res.data.success) {
          setRawBuildings(res.data.data || []);
        }
      })
      .catch((err) => console.error('Failed to fetch buildings:', err))
      .finally(() => setLoadingBuildings(false));
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  // Map MongoDB fields to the shape the UI expects
  const buildings = rawBuildings.map((b: any) => ({
    id: b._id,
    name: b.name,
    code: b.code,
    category: b.category || 'Academic',
    areaSqFt: b.areaSqFt || 0,
    occupantCapacity: b.occupantCapacity || 0,
    floors: b.floors || 1,
    yearBuilt: b.yearBuilt || 2020,
    status: b.status || 'Green',
    score: b.sustainabilityScore || 85,
    solarKw: b.solarCapacityKw || 0,
    // Fixed: model field is hvacEfficiencyRating, not hvacRating
    hvacRating: b.hvacEfficiencyRating || 'N/A',
    elecKwh: b.baselineMonthlyElectricityKwh
      ? Number(b.baselineMonthlyElectricityKwh).toLocaleString()
      : '0',
    waterLiters: b.baselineMonthlyWaterLiters
      ? Number(b.baselineMonthlyWaterLiters).toLocaleString()
      : '0',
    // Fixed: zone lives under location.zone in the schema, not a top-level field
    zone: b.location?.zone || '—',
  }));

  const filtered = buildings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.code.trim()) {
      setFormError('Building name and code are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        category: form.category,
        areaSqFt: Number(form.areaSqFt) || 0,
        occupantCapacity: Number(form.occupantCapacity) || 0,
        floors: Number(form.floors) || 1,
        yearBuilt: Number(form.yearBuilt) || new Date().getFullYear(),
        location: { zone: form.zone.trim() || 'Unassigned' },
        status: 'Green',
        solarCapacityKw: Number(form.solarCapacityKw) || 0,
        hvacEfficiencyRating: form.hvacEfficiencyRating,
        baselineMonthlyElectricityKwh: Number(form.baselineMonthlyElectricityKwh) || 0,
        baselineMonthlyWaterLiters: Number(form.baselineMonthlyWaterLiters) || 0,
      };

      const res = await api.post('/buildings', payload);

      if (res.data && res.data.success) {
        setShowAddModal(false);
        setForm(emptyForm);
        loadBuildings(); // refresh list from real DB
      } else {
        setFormError(res.data?.message || 'Failed to create building.');
      }
    } catch (err: any) {
      console.error('Create building error:', err);
      setFormError(
        err.response?.data?.message ||
        (err.response?.status === 401 || err.response?.status === 403
          ? 'You do not have permission to add buildings (Admin/Staff only).'
          : 'Failed to create building. Please try again.')
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Smart Campus Buildings Register"
          description="Facility health ratings, HVAC specifications, solar array capacities, and telemetry"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Controls Header */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by building name or code (e.g., SIC-01)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2">
              {['All', 'Academic', 'Research', 'Administrative', 'Residential'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Building Button - only Admin/Staff can create */}
            {canManageBuildings && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Add Building
              </button>
            )}
          </div>

          {loadingBuildings ? (
            <div className="glass-panel p-16 rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Loading buildings from database...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Building2 className="w-8 h-8" />
              <p className="text-sm font-semibold">No buildings found.</p>
              {canManageBuildings && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Add your first building &rarr;
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setActiveBuildingModal(b)}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 glass-card-hover cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                        {b.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${b.status === 'Green'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                      >
                        ● {b.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-3 truncate">{b.name}</h3>
                    <span className="text-xs text-slate-400">{b.category} • {b.zone}</span>

                    <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Sustainability Index</span>
                        <span className="text-xl font-extrabold text-emerald-400">{b.score}<span className="text-xs text-slate-400 font-normal">/100</span></span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Solar Array</span>
                        <span className="text-base font-bold text-white flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-400" /> {b.solarKw} kW
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{b.areaSqFt.toLocaleString()} sq ft</span>
                    <span className="text-emerald-400 font-semibold">Inspect Telemetry &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Building Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Area (Sq Ft)</th>
                    <th className="py-3 px-4">Solar Output</th>
                    <th className="py-3 px-4">Health Rating</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{b.code}</td>
                      <td className="py-3 px-4 font-bold text-white">{b.name}</td>
                      <td className="py-3 px-4 text-slate-300">{b.category}</td>
                      <td className="py-3 px-4 text-slate-300">{b.areaSqFt.toLocaleString()}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">{b.solarKw} kW</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${b.status === 'Green'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                        >
                          {b.status} ({b.score}/100)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveBuildingModal(b)}
                          className="text-xs font-semibold text-emerald-400 hover:underline"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Building Details Modal */}
          {activeBuildingModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-slate-700 shadow-2xl relative space-y-6">
                <button
                  onClick={() => setActiveBuildingModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    {activeBuildingModal.code}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{activeBuildingModal.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{activeBuildingModal.category} • Zone: {activeBuildingModal.zone}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Sustainability Score</span>
                    <span className="text-2xl font-black text-emerald-400">{activeBuildingModal.score}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">HVAC Rating</span>
                    <span className="text-2xl font-black text-white">{activeBuildingModal.hvacRating}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Monthly Electricity</span>
                    <span className="text-sm font-bold text-slate-200">{activeBuildingModal.elecKwh} kWh</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Monthly Water</span>
                    <span className="text-sm font-bold text-slate-200">{activeBuildingModal.waterLiters} L</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Area:</span>
                    <span className="font-semibold text-white">{activeBuildingModal.areaSqFt.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Occupancy Capacity:</span>
                    <span className="font-semibold text-white">{activeBuildingModal.occupantCapacity} persons</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Solar Roof Capacity:</span>
                    <span className="font-semibold text-amber-400">{activeBuildingModal.solarKw} kW</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveBuildingModal(null)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Done Inspecting
                </button>
              </div>
            </div>
          )}

          {/* Add Building Modal - real form, calls POST /api/buildings */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
              <div className="glass-panel max-w-2xl w-full p-8 rounded-3xl border border-slate-700 shadow-2xl relative space-y-5 my-8">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setForm(emptyForm);
                    setFormError(null);
                  }}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" /> Add New Building
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Register a real building — this is saved directly to the database</p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {formError}
                  </div>
                )}

                <form onSubmit={handleCreateBuilding} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Building Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="e.g. Main Academic Block"
                        required
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Building Code *</label>
                      <input
                        type="text"
                        value={form.code}
                        onChange={(e) => handleFormChange('code', e.target.value)}
                        placeholder="e.g. MAB-01"
                        required
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => handleFormChange('category', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Research">Research</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Residential">Residential</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zone / Location</label>
                      <input
                        type="text"
                        value={form.zone}
                        onChange={(e) => handleFormChange('zone', e.target.value)}
                        placeholder="e.g. North Campus"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Area (sq ft)</label>
                      <input
                        type="number"
                        value={form.areaSqFt}
                        onChange={(e) => handleFormChange('areaSqFt', e.target.value)}
                        placeholder="50000"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Occupant Capacity</label>
                      <input
                        type="number"
                        value={form.occupantCapacity}
                        onChange={(e) => handleFormChange('occupantCapacity', e.target.value)}
                        placeholder="500"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Floors</label>
                      <input
                        type="number"
                        value={form.floors}
                        onChange={(e) => handleFormChange('floors', e.target.value)}
                        placeholder="4"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year Built</label>
                      <input
                        type="number"
                        value={form.yearBuilt}
                        onChange={(e) => handleFormChange('yearBuilt', e.target.value)}
                        placeholder="2020"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Solar Capacity (kW)</label>
                      <input
                        type="number"
                        value={form.solarCapacityKw}
                        onChange={(e) => handleFormChange('solarCapacityKw', e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">HVAC Rating</label>
                      <select
                        value={form.hvacEfficiencyRating}
                        onChange={(e) => handleFormChange('hvacEfficiencyRating', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      >
                        {['A++', 'A+', 'A', 'B+', 'B', 'C'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Baseline Monthly Electricity (kWh)
                      </label>
                      <input
                        type="number"
                        value={form.baselineMonthlyElectricityKwh}
                        onChange={(e) => handleFormChange('baselineMonthlyElectricityKwh', e.target.value)}
                        placeholder="From past utility bills, if known"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Baseline Monthly Water (Liters)
                      </label>
                      <input
                        type="number"
                        value={form.baselineMonthlyWaterLiters}
                        onChange={(e) => handleFormChange('baselineMonthlyWaterLiters', e.target.value)}
                        placeholder="From past utility bills, if known"
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Save Building
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
