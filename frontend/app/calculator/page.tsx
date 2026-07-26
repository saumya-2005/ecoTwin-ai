
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  Calculator,
  Leaf,
  Trees,
  Car,
  Award,
  Zap,
  Flame,
  Plane,
  Trash2,
  Download,
  RotateCcw
} from 'lucide-react';
import api from '@/lib/api';

export default function CarbonCalculatorPage() {
  const [elecKwh, setElecKwh] = useState(15000);
  const [gasTherms, setGasTherms] = useState(400);
  const [dieselLiters, setDieselLiters] = useState(600);
  const [wasteKg, setWasteKg] = useState(1200);
  const [airKm, setAirKm] = useState(3500);
  const [carKm, setCarKm] = useState(8000);

  // Real backend-calculated result (replaces local math)
  const [result, setResult] = useState({
    totalCarbonKg: 0,
    totalCarbonMetricTons: 0,
    scopeBreakdown: { scope1: 0, scope2: 0, scope3: 0 },
    equivalencies: { treesNeeded: 0, carMilesDriven: 0 },
    rating: '',
  });
  const [calculating, setCalculating] = useState(false);

  // Debounced call to backend whenever any input changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setCalculating(true);
      try {
        const res = await api.post('/calculator/calculate', {
          electricityKwh: elecKwh,
          naturalGasTherms: gasTherms,
          dieselLiters: dieselLiters,
          wasteKg: wasteKg,
          airTravelKm: airKm,
          carTravelKm: carKm,
        });

        if (res.data && res.data.success) {
          setResult(res.data.result);
        }
      } catch (err) {
        console.error('Carbon calculation failed:', err);
      } finally {
        setCalculating(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [elecKwh, gasTherms, dieselLiters, wasteKg, airKm, carKm]);

  const handleReset = () => {
    setElecKwh(15000);
    setGasTherms(400);
    setDieselLiters(600);
    setWasteKg(1200);
    setAirKm(3500);
    setCarKm(8000);
  };

  const totalTons = result.totalCarbonMetricTons.toFixed(2);
  const scope1Tons = (result.scopeBreakdown.scope1 / 1000).toFixed(2);
  const scope2Tons = (result.scopeBreakdown.scope2 / 1000).toFixed(2);
  const scope3Tons = (result.scopeBreakdown.scope3 / 1000).toFixed(2);
  const treesNeeded = result.equivalencies.treesNeeded;
  const carMiles = result.equivalencies.carMilesDriven;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen pb-16">
        <Header
          title="GHG Protocol Carbon Footprint Calculator"
          description="Simulate Scope 1, Scope 2, and Scope 3 emissions with tree absorption equivalencies"
        />

        <div className="px-8 mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" /> Operational Emission Inputs
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
              </div>

              <div className="space-y-5">
                {/* Electricity */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Grid Electricity (Scope 2)
                    </span>
                    <span className="text-emerald-400 font-mono">{elecKwh.toLocaleString()} kWh</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={elecKwh}
                    onChange={(e) => setElecKwh(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Natural Gas */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> Natural Gas (Scope 1)
                    </span>
                    <span className="text-emerald-400 font-mono">{gasTherms.toLocaleString()} Therms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={gasTherms}
                    onChange={(e) => setGasTherms(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Waste */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-purple-400" /> Landfill Waste (Scope 3)
                    </span>
                    <span className="text-emerald-400 font-mono">{wasteKg.toLocaleString()} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={wasteKg}
                    onChange={(e) => setWasteKg(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Air Travel */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-cyan-400" /> Business Air Travel (Scope 3)
                    </span>
                    <span className="text-emerald-400 font-mono">{airKm.toLocaleString()} Km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={airKm}
                    onChange={(e) => setAirKm(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 to-emerald-950/20 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 inline-block mb-3">
                  Net CO2e Result {calculating && '(updating...)'}
                </span>

                <div className="text-center py-4">
                  <span className="text-5xl font-black text-white">{totalTons}</span>
                  <span className="text-sm font-semibold text-slate-400 block mt-1">Metric Tons CO2e</span>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Scope 1 (Direct):</span>
                    <span className="font-bold text-amber-400">{scope1Tons} t</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Scope 2 (Electricity):</span>
                    <span className="font-bold text-emerald-400">{scope2Tons} t</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Scope 3 (Value Chain):</span>
                    <span className="font-bold text-cyan-400">{scope3Tons} t</span>
                  </div>
                </div>

                {/* Equivalencies Box */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <Trees className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">{treesNeeded.toLocaleString()} Trees</span>
                      <span className="text-[10px] text-slate-400">Required mature trees to offset annually</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                    <Car className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">{carMiles.toLocaleString()} Miles</span>
                      <span className="text-[10px] text-slate-400">Equivalent passenger car distance driven</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Certificate compliance badge generated!')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" /> Download Compliance Badge
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}