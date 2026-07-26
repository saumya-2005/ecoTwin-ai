'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              EcoTwin <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-medium">SUSTAINABILITY INTELLIGENCE</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
          <Link href="#digital-twin" className="hover:text-emerald-400 transition-colors">Digital Twin</Link>
          <Link href="#ai-engine" className="hover:text-emerald-400 transition-colors">AI Intelligence</Link>
          <Link href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          {/* <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link> */}
        </div>
      </div>
    </header>
  );
}
