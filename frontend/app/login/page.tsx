'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Leaf, ArrowRight, Shield, KeyRound, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    const emailMap: Record<UserRole, string> = {
      Admin: 'admin@ecotwin.ai',
      Staff: 'staff@ecotwin.ai',
      Viewer: 'viewer@ecotwin.ai',
    };
    const demoEmail = emailMap[role];
    setEmail(demoEmail);
    setSelectedRole(role);
    // Demo accounts use 'password123' as the seeded password
    login(demoEmail, 'password123').then((success) => {
      if (success) router.push('/dashboard');
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6 bg-grid-pattern relative">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">EcoTwin AI</span>
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Sign in to Platform</h1>
          <p className="text-xs text-slate-400 mt-1">Access AI sustainability intelligence & Digital Twin</p>
        </div>

        {/* Quick Demo One-Click Logins */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block text-center mb-2">
            ⚡ Quick Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['Admin', 'Staff', 'Viewer'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleQuickDemo(r)}
                className="py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-slate-200 transition-all flex flex-col items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Authorization</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Admin', 'Staff', 'Viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedRole === r
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-400 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
