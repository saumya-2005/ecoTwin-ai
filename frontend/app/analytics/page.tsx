
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import api from '@/lib/api';
import {
  BarChart3,
  PieChart as PieIcon,
  Zap,
  Droplets,
  Trash2,
  Leaf,
  Filter,
  Inbox
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<'electricity' | 'water' | 'carbon' | 'waste'>('electricity');
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('30d');

  const [trendData, setTrendData] = useState<any[]>([]);
  const [scopeData, setScopeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/sustainability?timeframe=${selectedRange}`);
      if (res.data && res.data.success) {
        const records = res.data.data || [];
        const totals = res.data.totals || {};
        setRecordCount(records.length);

        // Aggregate trend data by date - real records only
        const dateMap: Record<string, { date: string; electricity: number; water: number; carbon: number; waste: number }> = {};
        records.forEach((r: any) => {
          const dateStr = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dateMap[dateStr]) {
            dateMap[dateStr] = { date: dateStr, electricity: 0, water: 0, carbon: 0, waste: 0 };
          }
          dateMap[dateStr].electricity += r.electricityKwh || 0;
          dateMap[dateStr].water += r.waterLiters || 0;
          dateMap[dateStr].carbon += r.carbonKg || 0;
          dateMap[dateStr].waste += r.wasteKg || 0;
        });

        // No fallback fake data - if empty, stays empty and UI shows an empty state
        setTrendData(Object.values(dateMap));

        // Scope emissions - only real totals, no fake defaults
        setScopeData([
          { name: 'Scope 1 (Direct Fuel & Gas)', value: totals.scope1 || 0, color: '#f59e0b' },
          { name: 'Scope 2 (Grid Electricity)', value: totals.scope2 || 0, color: '#10b981' },
          { name: 'Scope 3 (Waste & Travel)', value: totals.scope3 || 0, color: '#06b6d4' },
        ]);
      } else {
        setError('Server returned an unexpected response.');
      }
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError('Could not load analytics data. Please check your connection or try again.');
      setTrendData([]);
      setScopeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);

  const hasScopeData = scopeData.some((s) => s.value > 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Sustainability Analytics"
          description="In-depth multi-dimensional metric breakdown and scope emissions from real telemetry data"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-400" /> Focus Metric:
              </span>
              {[
                { id: 'electricity', label: 'Electricity (kWh)', icon: Zap },
                { id: 'water', label: 'Water (L)', icon: Droplets },
                { id: 'carbon', label: 'Carbon (CO2e)', icon: Leaf },
                { id: 'waste', label: 'Waste (kg)', icon: Trash2 },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMetric(m.id as any)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${selectedMetric === m.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRange(r)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${selectedRange === r
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-300">
              {error}
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Historical Telemetry Trend
                </h3>
                <span className="text-xs text-slate-400 font-mono">{recordCount} records loaded</span>
              </div>

              <div className="h-72 w-full pt-4">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading real data...</div>
                ) : trendData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Inbox className="w-8 h-8" />
                    <p className="text-xs font-semibold">No telemetry data yet for this period.</p>
                    <p className="text-[11px] text-slate-600">Upload data from the Data Upload page to see trends here.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey={selectedMetric} fill="#10b981" radius={[6, 6, 0, 0]} name={selectedMetric.toUpperCase()} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-emerald-400" /> GHG Protocol Scope Split
                </h3>
                <p className="text-xs text-slate-400 mt-1">Calculated from real database records</p>
              </div>

              <div className="h-56 w-full my-2">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading...</div>
                ) : !hasScopeData ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Inbox className="w-8 h-8" />
                    <p className="text-xs font-semibold text-center">No emissions data yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={scopeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                        {scopeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {scopeData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                      {s.name}
                    </span>
                    <span className="font-bold text-white">{(s.value / 1000).toFixed(1)} t</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*
            Hourly Load Heatmap Matrix removed.
            The previous version showed static hardcoded Low/Medium/High/Peak values
            that had no connection to any backend endpoint - it was pure decoration.
            Re-add this once /api/sustainability/heatmap (or similar) exists and
            returns real hour-by-day aggregates.
          */}
        </div>
      </main>
    </div>
  );
}

