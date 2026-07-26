
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  UploadCloud,
  Sparkles,
  TrendingUp,
  Calculator,
  Box,
  FileSpreadsheet,
  MessageSquareCode,
  User,
  ShieldAlert,
  Leaf,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Smart Buildings', href: '/buildings', icon: Building2 },
    { name: 'Data Ingestion', href: '/upload', icon: UploadCloud },
    { name: 'AI Insights', href: '/insights', icon: Sparkles, badge: 'Gemini 2.5' },
    { name: 'AI Forecasting', href: '/predictions', icon: TrendingUp },
    { name: 'Carbon Calculator', href: '/calculator', icon: Calculator },
    { name: 'Digital Twin', href: '/digital-twin', icon: Box, badge: 'Interactive' },
    { name: 'Reports Engine', href: '/reports', icon: FileSpreadsheet },
    { name: 'EcoTwin Copilot', href: '/chat', icon: MessageSquareCode, badge: 'AI RAG' },
    { name: 'Profile & Preferences', href: '/settings', icon: User },
    { name: 'Admin Console', href: '/admin', icon: ShieldAlert, adminOnly: true },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-slate-800/60 flex flex-col justify-between z-40">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/40 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                EcoTwin <span className="text-emerald-400 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
              </span>
              <span className="text-[9px] text-slate-400 tracking-wider font-semibold">SUSTAINABILITY OS</span>
            </div>
          </Link>
        </div>

        {/*
          Real Active Role display - read only.
          The old Role Selector Pill let anyone click Admin/Staff/Viewer and
          instantly change their displayed role client-side, with zero backend
          involvement. That was a fake control, not a real permission system.
          Actual role changes now happen only through the real
          PUT /api/admin/users/:id/role endpoint in the Admin Console.
        */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Signed in as:
          </span>
          <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
            {user?.role || '—'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'Admin') return null;

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs">
              {user?.name ? user.name.charAt(0) : 'E'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
