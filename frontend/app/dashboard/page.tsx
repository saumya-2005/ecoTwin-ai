'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import api from '@/lib/api';
import {
  Zap,
  Droplets,
  Trash2,
  Leaf,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Building2,
  FileSpreadsheet,
  Box,
  ShieldCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  // Real Database Metrics State
  const [totals, setTotals] = useState({
    totalElectricity: 0,
    totalWater: 0,
    totalWaste: 0,
    totalCarbonKg: 0,
    totalCarbonTons: 0,
    totalSolar: 0,
    sustainabilityScore: 85,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [recentAnomalies, setRecentAnomalies] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('Analyzing MongoDB telemetry data...');

  // Fetch real data from REST API backend
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/sustainability/dashboard?timeframe=${timeframe}`);
      if (res.data && res.data.success) {
        if (res.data.totals) setTotals(res.data.totals);
        if (res.data.chartData) setChartData(res.data.chartData);
        if (res.data.buildings) setBuildings(res.data.buildings);
        if (res.data.recentAnomalies) setRecentAnomalies(res.data.recentAnomalies);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  useEffect(() => {
    // Generate AI Summary from real totals
    if (totals.totalElectricity > 0) {
      setAiSummary(
        `Campus operations recorded ${totals.totalElectricity.toLocaleString()} kWh electricity and ${totals.totalWater.toLocaleString()} L water consumption across ${buildings.length} facilities, achieving an average ${totals.sustainabilityScore}/100 Sustainability Score.`
      );
    }
  }, [totals, buildings]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Sustainability Command Center"
          description="Real-time campus telemetry, AI insights, and net-zero score"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Top KPI Ribbon (Database Totals) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Electricity Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Electricity</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">
                  {totals.totalElectricity.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                  kWh
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Live Database Total</span>
            </div>

            {/* Water Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Water</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">
                  {totals.totalWater.toLocaleString()}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-0.5">
                  Liters
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Live Database Total</span>
            </div>

            {/* Carbon Emissions Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Net Carbon</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">
                  {totals.totalCarbonTons.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                  Tons CO2e
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">GHG Calculated Metric</span>
            </div>

            {/* Waste Recycled */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Waste</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">
                  {totals.totalWaste.toLocaleString()}
                </span>
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  kg
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Live Database Total</span>
            </div>

            {/* Campus Sustainability Score */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-slate-900 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Sustainability Index</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-400">{totals.sustainabilityScore}</span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  {totals.sustainabilityScore >= 80 ? 'GREEN' : 'YELLOW'}
                </span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium block mt-1">Real-time MongoDB Avg</span>
            </div>
          </div>

          {/* Real-time Solar & Energy Grid Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chart Telemetry */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Real-time Consumption Telemetry
                  </h3>
                  <p className="text-xs text-slate-400">Electricity load vs Solar generation directly from MongoDB</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['7d', '30d', '90d'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                        timeframe === t
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
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
                      <Area type="monotone" dataKey="electricity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#elecGrad)" name="Electricity (kWh)" />
                      <Area type="monotone" dataKey="solar" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" name="Solar (kWh)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    No telemetry data found in MongoDB. Upload CSV/Excel to populate.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & AI Summary */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 inline-block mb-3">
                  Database AI Snapshot
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Database Executive Summary
                </h3>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  "{aiSummary}"
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Quick Platform Actions</span>
                <Link
                  href="/insights"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Run Full Gemini Analysis
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/upload"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Upload CSV/Excel Telemetry
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/reports"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export PDF Compliance Audit
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Building Health Leaderboard (MongoDB Data) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Campus Buildings Telemetry
                </h3>
                <p className="text-xs text-slate-400">Live sustainability rating stored in MongoDB</p>
              </div>
              <Link href="/buildings" className="text-xs text-emerald-400 font-semibold hover:underline">
                View All Buildings &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {buildings.map((b: any) => (
                <div key={b.code || b._id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{b.code}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        b.status === 'Green'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {b.status || 'Green'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2 truncate">{b.name}</h4>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl font-extrabold text-emerald-400">{b.sustainabilityScore || 85}<span className="text-xs text-slate-400 font-normal">/100</span></span>
                    <span className="text-[11px] text-slate-300 font-medium">{(b.baselineMonthlyElectricityKwh || 45000).toLocaleString()} kWh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
