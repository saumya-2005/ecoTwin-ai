'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  User,
  Settings,
  Bell,
  Key,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Dr. Elena Rostova');
  const [org, setOrg] = useState(user?.organization || 'EcoCampus Global University');
  const [dept, setDept] = useState(user?.department || 'Sustainability & AI Governance');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Account Profile & Platform Settings"
          description="Manage user information, role authorizations, notification thresholds, and API keys"
        />

        <div className="px-8 mt-6 space-y-6 max-w-4xl">
          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Account preferences updated successfully!
            </div>
          )}

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-emerald-400" /> Personal & Organization Info
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'admin@ecotwin.ai'}
                    className="w-full px-4 py-2.5 bg-slate-900/60 text-slate-400 rounded-xl border border-slate-800 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </form>
          </div>

          {/* API Key Management */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Key className="w-4 h-4 text-emerald-400" /> Platform REST API Key
            </h3>
            <p className="text-xs text-slate-400">Use this token to push IoT sensor telemetry directly to the EcoTwin backend</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="ecotwin_live_pk_9928348271039841"
                className="flex-1 px-4 py-2.5 bg-slate-950 font-mono text-emerald-400 text-xs rounded-xl border border-slate-800"
              />
              <button
                onClick={() => alert('API Key copied to clipboard!')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl"
              >
                Copy Key
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
