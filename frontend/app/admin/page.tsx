'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  ShieldAlert,
  Users,
  Building2,
  Activity,
  CheckCircle2,
  Database,
  Cpu,
  Server
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminPanelPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalBuildings: number;
    dbStatus: string;
    aiServiceStatus: string;
  }>({
    totalUsers: 0,
    totalBuildings: 0,
    dbStatus: 'Connecting...',
    aiServiceStatus: 'Loading...',
  });
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Fetch real users from backend
    api
      .get('/admin/users')
      .then((res) => {
        if (res.data && res.data.success) {
          setUsersList(res.data.users || []);
        }
      })
      .catch((err) => console.error('Failed to fetch users:', err))
      .finally(() => setLoadingUsers(false));

    // Fetch real system stats
    api
      .get('/admin/stats')
      .then((res) => {
        if (res.data && res.data.success) {
          setStats({
            totalUsers: res.data.stats.totalUsers,
            totalBuildings: res.data.stats.totalBuildings,
            dbStatus: res.data.stats.dbStatus || 'Connected',
            aiServiceStatus: res.data.stats.aiServiceStatus || 'Operational',
          });
        }
      })
      .catch((err) => console.error('Failed to fetch admin stats:', err));
  }, []);

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    // Optimistic update
    setUsersList((prev) =>
      prev.map((u) => (u._id === id || u.id === id ? { ...u, role: newRole } : u))
    );
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="EcoTwin Platform Admin Console"
          description="Manage organization access, user roles, building telemetry, and AI infrastructure"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* System Telemetry Health Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block uppercase">System Users</span>
              <span className="text-2xl font-black text-white mt-1">
                {loadingUsers ? '—' : `${stats.totalUsers} Active`}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">RBAC Enforced</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Monitored Buildings</span>
              <span className="text-2xl font-black text-emerald-400 mt-1">
                {stats.totalBuildings > 0 ? `${stats.totalBuildings} Nodes` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">100% Telemetry Online</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Database Status</span>
              <span className="text-2xl font-black text-teal-300 mt-1">MongoDB</span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">{stats.dbStatus}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block uppercase">AI Model Engine</span>
              <span className="text-2xl font-black text-amber-400 mt-1">Gemini 2.5</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">
                {stats.aiServiceStatus.length > 30
                  ? stats.aiServiceStatus.slice(0, 30) + '...'
                  : stats.aiServiceStatus}
              </span>
            </div>
          </div>

          {/* User Management Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> User Role &amp; Permission Control
              </h3>
              <span className="text-xs text-slate-400 font-mono">Admin Privileges Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                  {usersList.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                      <td className="py-3 px-4 text-slate-300">{u.organization}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                            u.role === 'Admin'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : u.role === 'Staff'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id || u.id, e.target.value as UserRole)}
                          className="bg-slate-900 text-xs text-slate-200 border border-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Staff">Staff</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!loadingUsers && usersList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-center text-slate-500">
                        No users found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
