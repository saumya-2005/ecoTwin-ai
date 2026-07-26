'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <div>
          <span className="text-4xl font-black text-emerald-400 font-mono">404</span>
          <h1 className="text-xl font-bold text-white mt-2">Node Route Not Found</h1>
          <p className="text-xs text-slate-400 mt-2">
            The requested sustainability telemetry node or page does not exist.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sustainability Dashboard
        </Link>
      </div>
    </div>
  );
}
