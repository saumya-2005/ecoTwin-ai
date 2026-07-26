
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  FileText
} from 'lucide-react';
import api from '@/lib/api';

interface PastReport {
  _id: string;
  title: string;
  reportType: string;
  createdAt: string;
  fileSizeBytes?: number;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Executive Summary');
  const [loading, setLoading] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const [pastReports, setPastReports] = useState<PastReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const fetchPastReports = async () => {
    setReportsLoading(true);
    try {
      const res = await api.get('/reports');
      if (res.data && res.data.success) {
        setPastReports(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load past reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchPastReports();
  }, []);

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        '/reports/generate',
        { title: `EcoTwin ${reportType} Report`, reportType },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EcoTwin_Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      setGeneratedSuccess(true);
      fetchPastReports();
    } catch (e: any) {
      console.error('Report generation failed:', e);
      alert(
        e.response?.data
          ? 'Report generation failed. Check backend console for details.'
          : e.message || 'Report generation failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Professional PDF Compliance Report Builder"
          description="Generate ISO 50001 compliant sustainability reports with embedded telemetry charts and AI action items"
        />

        <div className="px-8 mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Builder Form */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Report Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize fields and building telemetry scope</p>
              </div>

              {generatedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Professional PDF Report generated and downloaded to your browser!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Report Type Standard</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Executive Summary">Executive Summary (Board Level)</option>
                    <option value="Carbon Accounting">Carbon Accounting (Scope 1, 2, 3)</option>
                    <option value="Energy Efficiency">Energy Efficiency & Solar Audit</option>
                    <option value="Water & Waste Audit">Water & Waste Reclamation Audit</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2026-06-01"
                      className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date</label>
                    <input
                      type="date"
                      defaultValue="2026-06-30"
                      className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Included Campus Buildings</label>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <input type="checkbox" defaultChecked className="accent-emerald-500" /> Science & Innovation Complex
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <input type="checkbox" defaultChecked className="accent-emerald-500" /> Engineering Hall
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <input type="checkbox" defaultChecked className="accent-emerald-500" /> Innovation Tower
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <input type="checkbox" defaultChecked className="accent-emerald-500" /> Student Union & Dining
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGeneratePDF}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{loading ? 'Compiling PDF Vector Graphics...' : 'Generate & Download PDF Report'}</span>
              </button>
            </div>

            {/* Past Generated Reports List */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-emerald-400" /> Generated PDF Archive
                </h3>

                <div className="space-y-3">
                  {reportsLoading && (
                    <p className="text-xs text-slate-400">Loading report history...</p>
                  )}

                  {!reportsLoading && pastReports.length === 0 && (
                    <p className="text-xs text-slate-400">No reports generated yet.</p>
                  )}

                  {pastReports.map((r) => (
                    <div key={r._id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{formatDate(r.createdAt)}</span>
                        <span className="font-mono text-emerald-400">{formatSize(r.fileSizeBytes)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 text-center">
                <span className="text-[11px] text-slate-400">All reports formatted under ISO 50001 Standards</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}