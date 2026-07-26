
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, RefreshCw, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
  createdAt: string;
}

function timeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Header({ title, description }: { title: string; description?: string }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        setAlerts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s so new anomaly notifications appear without manual refresh
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, read: true } : a)));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {description && <p className="text-xs text-slate-400 font-normal">{description}</p>}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Real-time System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Telemetry Stream Online</span>
        </div>

        {/* Global Search Bar */}
        {/* <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search buildings, metrics, or AI reports..."
            className="pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
          />
        </div> */}

        {/* Notifications Dropdown */}
        {/* <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" /> Notifications & Alerts
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>

              <div className="space-y-2.5 mt-3 max-h-64 overflow-y-auto">
                {loadingAlerts && (
                  <p className="text-[11px] text-slate-400 text-center py-3">Loading notifications...</p>
                )}

                {!loadingAlerts && alerts.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center py-3">No notifications yet.</p>
                )}

                {alerts.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => !a.read && handleMarkOneRead(a._id)}
                    className={`p-2.5 rounded-xl bg-slate-900/60 border transition-colors cursor-pointer ${a.read ? 'border-slate-800/80 opacity-60' : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        {a.severity === 'critical' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        ) : a.severity === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {a.title}
                      </span>
                      <span className="text-[9px] text-slate-500">{timeAgo(a.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-5">{a.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleMarkAllRead}
                className="w-full text-center text-[11px] text-emerald-400 font-medium mt-3 pt-2 border-t border-slate-800 hover:text-emerald-300"
              >
                Mark All as Read
              </button>
            </div>
          )} */}
        {/* </div> */}
      </div>
    </header>
  );
}