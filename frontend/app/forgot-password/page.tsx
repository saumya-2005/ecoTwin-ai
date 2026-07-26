'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">EcoTwin AI</span>
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Reset Password</h1>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email address to reset</p>
        </div>

        {submitted ? (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <p className="text-sm font-semibold text-emerald-300">
              ✓ Reset link sent! Please check your inbox at <span className="underline">{email}</span>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold mt-4 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecotwin.ai"
                className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs">
          <Link href="/login" className="text-slate-400 hover:text-white flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
