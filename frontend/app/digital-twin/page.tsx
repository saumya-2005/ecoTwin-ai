'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  Box,
  Sun,
  Zap,
  Droplets,
  ShieldCheck,
  Building2,
  X,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '@/lib/api';

// Slot-based SVG positions for up to 8 buildings (backend has no coordinate data)
const SLOT_POSITIONS = [
  { x: 250, y: 180 },
  { x: 520, y: 240 },
  { x: 340, y: 380 },
  { x: 680, y: 410 },
  { x: 760, y: 160 },
  { x: 150, y: 350 },
  { x: 600, y: 100 },
  { x: 450, y: 300 },
];

export default function DigitalTwinPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/buildings')
      .then((res) => {
        if (res.data && res.data.success) {
          setBuildings(res.data.data || []);
        }
      })
      .catch((err) => console.error('Failed to fetch buildings:', err))
      .finally(() => setLoading(false));
  }, []);

  // Merge real building data with slot-based SVG positions
  const mappedBuildings = buildings.map((b: any, i: number) => ({
    id: b._id,
    name: b.name,
    code: b.code,
    x: SLOT_POSITIONS[i % SLOT_POSITIONS.length].x,
    y: SLOT_POSITIONS[i % SLOT_POSITIONS.length].y,
    status: b.status || 'Green',
    score: b.sustainabilityScore || 85,
    solarKw: b.solarCapacityKw || 0,
    hvac: b.hvacRating ? `${b.hvacRating} (Rated)` : 'N/A',
    waterFlow: b.baselineMonthlyWaterLiters
      ? `${Math.round(b.baselineMonthlyWaterLiters / 43200)} L/min (est.)`
      : 'N/A',
    occupants: b.occupantCapacity || 0,
  }));

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="Campus Digital Twin Interactive Map"
          description="Click campus nodes to inspect live IoT telemetry, solar arrays, and building health ratings"
        />

        <div className="px-8 mt-6 space-y-6">
          {/* Legend Banner */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <span className="font-semibold text-slate-300">Live Status Legend:</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Green (Optimal &gt;85)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Yellow (Warning State)
              </span>
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Red (Critical Action Needed)
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {loading ? 'Loading...' : `${mappedBuildings.length} Active Campus Nodes Synchronized`}
            </span>
          </div>

          {/* Interactive Map View Canvas */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden min-h-[500px] flex items-center justify-center">
            {/* SVG Interactive Map Background */}
            <svg className="w-full h-[480px] text-slate-800" viewBox="0 0 900 500">
              {/* Campus Grid Pathways */}
              <line x1="100" y1="250" x2="850" y2="250" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="450" y1="50" x2="450" y2="450" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="450" cy="250" r="180" stroke="#1e293b" strokeWidth="1" fill="none" />

              {/* Building Nodes */}
              {mappedBuildings.map((b) => {
                const isSelected = selectedBuilding?.id === b.id;
                const ringColor =
                  b.status === 'Green' ? '#10b981' : b.status === 'Red' ? '#f87171' : '#f59e0b';

                return (
                  <g
                    key={b.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedBuilding(b)}
                  >
                    {/* Glowing outer aura */}
                    <circle cx={b.x} cy={b.y} r={isSelected ? "32" : "24"} fill={ringColor} fillOpacity={0.15} />
                    <circle cx={b.x} cy={b.y} r="16" fill="#0f172a" stroke={ringColor} strokeWidth="3" />
                    <circle cx={b.x} cy={b.y} r="6" fill={ringColor} />

                    {/* Node Label */}
                    <text x={b.x} y={b.y - 30} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                      {b.code}
                    </text>
                    <text x={b.x} y={b.y + 35} textAnchor="middle" fill="#94a3b8" fontSize="10">
                      {b.score}/100
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Empty state */}
            {!loading && mappedBuildings.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                No buildings found in database. Add buildings to populate the map.
              </div>
            )}

            {/* Instruction Overlay */}
            {!selectedBuilding && mappedBuildings.length > 0 && (
              <div className="absolute bottom-6 left-6 p-3 rounded-xl glass-panel text-xs text-slate-300 border border-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Click any building node on the campus grid to inspect telemetry drawer
              </div>
            )}

            {/* Building Telemetry Drawer Popup */}
            {selectedBuilding && (
              <div className="absolute right-6 top-6 bottom-6 w-80 glass-panel p-6 rounded-2xl border border-slate-700 shadow-2xl z-20 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {selectedBuilding.code}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{selectedBuilding.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedBuilding(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Sustainability Health Score</span>
                  <span className="text-3xl font-black text-emerald-400">{selectedBuilding.score}<span className="text-xs text-slate-400 font-normal">/100</span></span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Array Production:
                    </span>
                    <span className="font-bold text-white text-sm">{selectedBuilding.solarKw} kW</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> HVAC Efficiency Status:
                    </span>
                    <span className="font-bold text-white">{selectedBuilding.hvac}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Live Water Flow Rate:
                    </span>
                    <span className="font-bold text-white">{selectedBuilding.waterFlow}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
