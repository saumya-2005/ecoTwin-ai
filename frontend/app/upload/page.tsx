
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  PlusCircle,
  Save,
  Loader2,
  XCircle
} from 'lucide-react';
import api from '@/lib/api';

interface Building {
  _id: string;
  name: string;
  code: string;
}

export default function DataUploadPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null);

  // Buildings loaded from the real database for the manual form dropdown
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  // Manual Form State - no pre-filled fake values, starts empty
  const [manualBuildingId, setManualBuildingId] = useState('');
  const [elec, setElec] = useState('');
  const [water, setWater] = useState('');
  const [waste, setWaste] = useState('');
  const [manualSaving, setManualSaving] = useState(false);
  const [manualSaved, setManualSaved] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  useEffect(() => {
    const loadBuildings = async () => {
      setBuildingsLoading(true);
      try {
        const res = await api.get('/buildings');
        const list = res.data?.buildings || res.data?.data || res.data || [];
        setBuildings(list);
        if (list.length > 0) setManualBuildingId(list[0]._id);
      } catch (err) {
        console.error('Failed to load buildings:', err);
      } finally {
        setBuildingsLoading(false);
      }
    };
    loadBuildings();
  }, []);

  const handleRealUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setUploadStatus(`Uploading ${file.name}...`);
    setParsedPreview(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/sustainability/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.success) {
        setUploadStatus(
          `Saved ${res.data.insertedCount} real telemetry entries from ${file.name} into the database.`
        );
        // Preview shows the actual saved records returned by the backend, not fake rows
        setParsedPreview(res.data.sample || []);
      } else {
        setUploadError(res.data?.message || 'Upload failed for an unknown reason.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(
        err.response?.data?.message || 'Upload failed. Check that your file has Electricity/Water/Waste columns.'
      );
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    if (!manualBuildingId) {
      setManualError('Please select a building.');
      return;
    }
    if (!elec || !water || !waste) {
      setManualError('Please fill in all three readings.');
      return;
    }

    setManualSaving(true);
    try {
      const res = await api.post('/sustainability/manual', {
        buildingId: manualBuildingId,
        electricityKwh: Number(elec),
        waterLiters: Number(water),
        wasteKg: Number(waste),
      });

      if (res.data && res.data.success) {
        setManualSaved(true);
        setElec('');
        setWater('');
        setWaste('');
        setTimeout(() => setManualSaved(false), 3000);
      } else {
        setManualError(res.data?.message || 'Failed to save reading.');
      }
    } catch (err: any) {
      console.error('Manual entry error:', err);
      setManualError(err.response?.data?.message || 'Failed to save reading. Please try again.');
    } finally {
      setManualSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Sustainability Data Ingestion"
          description="Upload CSV/Excel telemetry files or input manual meter readings with schema validation"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Tab Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'upload'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                : 'glass-panel text-slate-400 border-slate-800 hover:text-white'
                }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>CSV / Excel Upload</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'manual'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                : 'glass-panel text-slate-400 border-slate-800 hover:text-white'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manual Entry Form</span>
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-6">
              {/* Drag & Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (uploading) return;
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleRealUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`glass-panel p-12 rounded-3xl border-2 border-dashed text-center transition-all ${dragActive
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-slate-800 hover:border-emerald-500/40'
                  }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-emerald-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">Drag and drop your CSV or XLSX file here</h3>
                <p className="text-xs text-slate-400 mt-1">
                  File must contain Electricity, Water, and Waste columns (and a Building column, matched by name or code)
                </p>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <label className={`cursor-pointer px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleRealUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  <a
                    href="/sample-schema.csv"
                    download
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Download Sample Schema
                  </a>
                </div>
              </div>

              {uploadStatus && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {uploadStatus}
                </div>
              )}

              {uploadError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {uploadError}
                </div>
              )}

              {/* Data Preview Table - shows real saved records returned from backend */}
              {parsedPreview && parsedPreview.length > 0 && (
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Saved Records (Preview)
                      </h3>
                      <p className="text-xs text-slate-400">First few records now stored in MongoDB</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                          <th className="py-3 px-4">Electricity (kWh)</th>
                          <th className="py-3 px-4">Water (L)</th>
                          <th className="py-3 px-4">Waste (kg)</th>
                          <th className="py-3 px-4">Carbon (kg)</th>
                          <th className="py-3 px-4">AI Anomaly Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                        {parsedPreview.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/40">
                            <td className="py-3 px-4 text-slate-200">{Number(row.electricityKwh).toLocaleString()}</td>
                            <td className="py-3 px-4 text-slate-200">{Number(row.waterLiters).toLocaleString()}</td>
                            <td className="py-3 px-4 text-slate-200">{row.wasteKg}</td>
                            <td className="py-3 px-4 text-slate-200">{row.carbonKg}</td>
                            <td className="py-3 px-4">
                              {!row.isAnomaly ? (
                                <span className="text-slate-400">Normal</span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 w-max">
                                  <AlertTriangle className="w-3 h-3" /> {row.anomalyReason || 'Anomaly'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Manual Form */
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-2xl">
              <h3 className="text-base font-bold text-white mb-1">Manual Telemetry Entry</h3>
              <p className="text-xs text-slate-400 mb-6">Record single point utility meter readings</p>

              {manualSaved && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                  ✓ Meter reading saved to the database.
                </div>
              )}

              {manualError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300">
                  {manualError}
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Building</label>
                  <select
                    value={manualBuildingId}
                    onChange={(e) => setManualBuildingId(e.target.value)}
                    disabled={buildingsLoading || buildings.length === 0}
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {buildingsLoading && <option>Loading buildings...</option>}
                    {!buildingsLoading && buildings.length === 0 && (
                      <option>No buildings found - add one in Buildings Management first</option>
                    )}
                    {buildings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Electricity (kWh)</label>
                    <input
                      type="number"
                      value={elec}
                      onChange={(e) => setElec(e.target.value)}
                      placeholder="e.g. 5400"
                      required
                      className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Water (Liters)</label>
                    <input
                      type="number"
                      value={water}
                      onChange={(e) => setWater(e.target.value)}
                      placeholder="e.g. 14200"
                      required
                      className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Waste (kg)</label>
                    <input
                      type="number"
                      value={waste}
                      onChange={(e) => setWaste(e.target.value)}
                      placeholder="e.g. 340"
                      required
                      className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={manualSaving}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {manualSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Reading into Database
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
