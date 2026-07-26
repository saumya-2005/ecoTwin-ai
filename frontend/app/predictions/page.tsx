

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  Leaf,
  Sliders,
  Calendar,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import api from '@/lib/api';

export default function PredictionsPage() {
  const [metric, setMetric] = useState<'Electricity' | 'Water' | 'Carbon' | 'Waste'>('Electricity');
  const [horizon, setHorizon] = useState<7 | 30 | 90>(30);
  const [solarScenario, setSolarScenario] = useState(false);
  const [thermalScenario, setThermalScenario] = useState(false);

  const [rawForecast, setRawForecast] = useState<{ date: string; predictedValue: number; lowerBound: number; upperBound: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real forecast from backend whenever metric or horizon changes
  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await api.get('/predictions', {
          params: { metric, timeframeDays: horizon },
        });
        if (res.data && res.data.success && res.data.prediction) {
          setRawForecast(res.data.prediction.forecast || []);
        }
      } catch (err) {
        console.error('Failed to load predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [metric, horizon]);

  // Apply what-if scenario multipliers on top of real predicted data (same logic as before)
  const chartData = useMemo(() => {
    const reductionFactor = (solarScenario ? 0.12 : 0) + (thermalScenario ? 0.08 : 0);
    const factor = 1 - reductionFactor;

    return rawForecast.map((point) => {
      const dateObj = new Date(point.date);
      const dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: dayLabel,
        predictedValue: Math.round(point.predictedValue * factor),
        lowerBound: Math.round(point.lowerBound * factor),
        upperBound: Math.round(point.upperBound * factor),
      };
    });
  }, [rawForecast, solarScenario, thermalScenario]);

  const totalPredicted = chartData.reduce((acc, curr) => acc + curr.predictedValue, 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="AI Time-Series Predictive Forecasting"
          description="Prophet & Random Forest ensemble predictions for 7, 30, and 90-day horizon with confidence bounds"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Metric Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Target Metric:</span>
              {[
                { id: 'Electricity', icon: Zap },
                { id: 'Water', icon: Droplets },
                { id: 'Carbon', icon: Leaf },
                { id: 'Waste', icon: Trash2 },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMetric(m.id as any)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${metric === m.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Horizon Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {([7, 30, 90] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${horizon === h
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {h} Days Horizon
                </button>
              ))}
            </div>
          </div>

          {/* Main Forecast Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> {horizon}-Day {metric} Projections
                </h3>
                <p className="text-xs text-slate-400">Shaded area represents 95% Bayesian Confidence Interval</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Projected Total</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {loading ? '...' : totalPredicted.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="#10b981" fillOpacity={0.15} name="Upper Bound (95% CI)" />
                  <Area type="monotone" dataKey="predictedValue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#predGrad)" name="AI Predicted Value" />
                  <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="transparent" name="Lower Bound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Simulator Toggles */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-emerald-400" /> What-If Intervention Simulator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSolarScenario(!solarScenario)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${solarScenario
                  ? 'bg-emerald-500/20 border-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Expand Rooftop Solar Array (+20%)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Simulates 12% additional daytime grid offset</p>
                </div>
                <input type="checkbox" checked={solarScenario} readOnly className="w-4 h-4 accent-emerald-500" />
              </div>

              <div
                onClick={() => setThermalScenario(!thermalScenario)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${thermalScenario
                  ? 'bg-emerald-500/20 border-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Implement -2°C HVAC Thermal Setback</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Simulates 8% peak chiller energy drop</p>
                </div>
                <input type="checkbox" checked={thermalScenario} readOnly className="w-4 h-4 accent-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}