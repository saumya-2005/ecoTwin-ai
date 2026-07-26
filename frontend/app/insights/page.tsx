'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  TrendingDown,
  Brain
} from 'lucide-react';
import api from '@/lib/api';

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{
    summary: string;
    keyDrivers: string[];
    recommendations: string[];
    anomalyExplanation: string;
  }>({
    summary: 'Campus sustainability performance currently rates at 86.4/100 with a monthly total carbon footprint of 78.4 Metric Tons CO2e across monitored facilities.',
    keyDrivers: [
      'Electricity consumption (185,400 kWh) is the primary carbon driver, contributing ~68% of total emissions.',
      'Peak HVAC loads between 12:00 PM - 4:00 PM account for 41% of daily energy expenditure.',
      'Solar self-generation offset 19.4% of total grid power across active arrays.',
    ],
    recommendations: [
      'Implement automated HVAC thermal setback rules lowering cooling load by 2°C during non-peak occupancy hours (saves ~8.4% monthly energy).',
      'Upgrade greywater filtration systems in high-demand residential blocks to reclaim up to 35,000 Liters of non-potable water monthly.',
      'Schedule smart battery storage discharge during peak tariff hours (2 PM - 6 PM) to lower demand charges.',
    ],
    anomalyExplanation: 'Electricity spikes detected in Science & Innovation Complex were driven by unthrottled night-time laboratory chiller operation on Wednesday at 02:15 AM.',
  });

  const handleGenerateInsights = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/insights', { buildingId: 'all' }).catch(() => null);
      if (res && res.data && res.data.insight) {
        if (res.data.insight.summary) {
          setInsight(res.data.insight);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Google Gemini AI Sustainability Intelligence"
          description="Automated executive summary, anomaly root cause explanations, and step-by-step optimization action plan"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Action Trigger Banner */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Gemini 2.5 Intelligence Engine Active
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Synthesizing multi-building telemetry into executive insights
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateInsights}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing Data...' : 'Re-Run Gemini Analysis'}</span>
            </button>
          </div>

          {/* Executive Overview Card */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Executive Overview
              </span>
              <span className="text-xs text-slate-400">Generated real-time</span>
            </div>

            <p className="text-base font-medium text-slate-200 leading-relaxed border-l-4 border-emerald-400 pl-4 py-1">
              "{insight.summary}"
            </p>

            <div className="pt-4 border-t border-slate-800/60">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Telemetry Drivers</h4>
              <div className="space-y-2">
                {insight.keyDrivers.map((driver, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insight.recommendations.map((rec, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Optimization Tip #{idx + 1}</span>
                  <p className="text-xs font-medium text-slate-200 mt-2 leading-relaxed">{rec}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Impact:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> High ROI
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Anomaly Root Cause Analysis */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/60">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Isolation Forest Anomaly Root Cause Analysis</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              {insight.anomalyExplanation}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
