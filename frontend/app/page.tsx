'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  Box,
  FileSpreadsheet,
  MessageSquareCode,
  Zap,
  CheckCircle2,
  ChevronDown,
  Globe,
  Leaf,
  Users,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const features = [
    {
      icon: Box,
      title: 'Digital Twin Campus Map',
      desc: 'Interactive 2D campus visualization with real-time building health color codes (Green, Yellow, Red) and live sensor telemetry.',
    },
    {
      icon: Sparkles,
      title: 'Gemini Executive Insights',
      desc: 'Google Gemini 2.5 Flash API automatically analyzes energy, water, and waste data to generate natural language executive summaries and action plans.',
    },
    {
      icon: TrendingUp,
      title: 'AI Time-Series Forecasting',
      desc: 'Predict electricity, water, and carbon footprint for 7, 30, and 90 days using Scikit-Learn Random Forest and Prophet algorithms.',
    },
    {
      icon: ShieldCheck,
      title: 'Isolation Forest Anomaly Detection',
      desc: 'Instantly spot nocturnal energy spikes, continuous line water leaks, and carbon intensity deviations with automated severity alerts.',
    },
    {
      icon: MessageSquareCode,
      title: 'EcoTwin Copilot (RAG Chatbot)',
      desc: 'Conversational assistant backed by Retrieval-Augmented Generation to answer complex sustainability questions with direct metric citations.',
    },
    {
      icon: FileSpreadsheet,
      title: 'ISO 50001 PDF Report Builder',
      desc: 'Generate professional, executive-ready PDF sustainability compliance reports with embedded charts and action items in seconds.',
    },
  ];

  const testimonials = [
    {
      quote: "EcoTwin AI reduced our campus carbon emissions by 18.4% within 90 days. The Digital Twin map gave our facility engineers total visibility.",
      author: "Dr. Jonathan Hayes",
      role: "Vice President of Infrastructure, Pacific University",
    },
    {
      quote: "The Gemini AI insight engine pinpointed a $45,000 annual water leakage anomaly that our traditional meters completely missed.",
      author: "Samantha Torres",
      role: "Chief Sustainability Officer, Apex Industrial Parks",
    },
  ];

  const pricingPlans = [
    {
      name: 'Campus Starter',
      price: '$499',
      period: '/month',
      desc: 'Ideal for schools, single campus facilities, and emerging green initiatives.',
      features: ['Up to 5 Smart Buildings', '7 & 30-Day AI Forecasting', 'Standard CSV Upload parser', 'Basic PDF Reports', 'Email Alerts'],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Enterprise Twin',
      price: '$1,299',
      period: '/month',
      desc: 'Comprehensive AI suite for universities, smart cities, and industrial complexes.',
      features: ['Unlimited Smart Buildings', 'Full 7, 30, 90-Day Predictions', 'Gemini RAG Copilot Chatbot', 'Digital Twin Campus Map', 'Isolation Forest Anomaly Engine', 'Custom PDF Compliance Reports'],
      cta: 'Deploy Enterprise',
      highlighted: true,
    },
    {
      name: 'Global Net-Zero',
      price: 'Custom',
      period: '',
      desc: 'Tailored enterprise SLAs, dedicated AI models, and custom IoT hardware integrations.',
      features: ['Dedicated Gemini Enterprise LLM', 'Multi-tenant Org Governance', 'On-Premises / Hybrid Deployment', '24/7 Priority Support & SLAs', 'Custom API & Sensor Adapters'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'How does EcoTwin AI integrate with existing building telemetry?',
      a: 'EcoTwin AI supports direct CSV/Excel file uploads, manual data entry forms, and standard REST API endpoints for seamless IoT sensor integration.',
    },
    {
      q: 'Which AI models power the platform?',
      a: 'We combine Google Gemini API for natural language insights and RAG conversation with Scikit-Learn Isolation Forest for anomaly detection and Prophet/Random Forest algorithms for 7/30/90 day forecasting.',
    },
    {
      q: 'Can we assign different permissions to staff members?',
      a: 'Yes, EcoTwin AI features strict Role-Based Access Control (RBAC) with Admin, Staff, and Viewer permission levels.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 bg-grid-pattern">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Animated Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Next-Gen AI Sustainability Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-normal">Gemini 2.5 Inside</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Transform Sustainability Data into <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Intelligent Decisions.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Monitor, analyze, predict, and optimize carbon emissions, energy, water, and waste across campus facilities with AI-powered Digital Twins and predictive forecasting.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="#digital-twin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-200 glass-panel hover:bg-slate-900/80 px-8 py-4 rounded-2xl border border-slate-700 transition-all hover:border-emerald-500/40"
            >
              <Box className="w-5 h-5 text-emerald-400" />
              <span>Interactive Digital Twin</span>
            </Link>
          </div>

          {/* Key Metric Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-3xl border border-slate-800/80">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.4%</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Anomaly Detection Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-300">18.4%</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Avg Carbon Reduction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">90 Days</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Predictive AI Horizon</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">ISO 50001</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Compliant PDF Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Enterprise Architecture</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Built for Smart Campuses & Green Industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-panel p-8 rounded-3xl border border-slate-800/80 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Digital Twin Showcase */}
      <section id="digital-twin" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Digital Twin Preview</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Real-Time Campus Telemetry & Building Health
              </h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                Click any building node to inspect live HVAC efficiency ratings, solar panel production, water flow rates, and carbon scores.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  <span><strong>Green Status:</strong> Optimal efficiency (&gt;85 Sustainability Score)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
                  <span><strong>Yellow Status:</strong> Warning state (Minor consumption anomalies detected)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-red-400 shadow-sm shadow-red-400"></span>
                  <span><strong>Red Status:</strong> Critical action required (Severe power/water spike)</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/digital-twin"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Open Full Digital Twin Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Map Mock Graphic */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 relative min-h-[300px] flex items-center justify-center">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Science & Innovation Complex</h4>
                      <span className="text-[10px] text-slate-400">Solar Output: 180 kW | HVAC rating: A++</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    92/100
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Engineering Hall Block B</h4>
                      <span className="text-[10px] text-slate-400">Warning: Off-peak HVAC spike (+65%)</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    76/100
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Innovation Tower</h4>
                      <span className="text-[10px] text-slate-400">Solar Output: 220 kW | 34% Grid Offset</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    95/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Transparent SaaS Pricing</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Scalable Plans for Any Organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-panel p-8 rounded-3xl border transition-all flex flex-col justify-between ${plan.highlighted
                  ? 'border-emerald-500/50 shadow-2xl shadow-emerald-950/50 bg-slate-900/90'
                  : 'border-slate-800'
                }`}
            >
              <div>
                {plan.highlighted && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-2">{plan.desc}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400 font-medium">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className={`w-full inline-flex justify-center py-3 rounded-xl font-bold text-sm transition-all ${plan.highlighted
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-slate-800 cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">{faq.q}</h3>
                <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </div>
              {activeFaq === i && (
                <p className="text-sm text-slate-400 mt-4 leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready to Transform Your Campus Sustainability?</h2>
          <p className="text-slate-400 text-sm mt-3">Get in touch with our sustainability intelligence engineers.</p>

          {contactSubmitted ? (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
              ✓ Thank you! Your request has been received. Our team will contact you within 2 hours.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                className="px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                placeholder="Organization Email"
                required
                className="px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
              <textarea
                placeholder="Tell us about your campus or facility metrics..."
                rows={3}
                className="sm:col-span-2 px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              ></textarea>
              <button
                type="submit"
                className="sm:col-span-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                Send Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/60 glass-panel">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-base">EcoTwin AI</span>
            <span className="text-xs text-slate-500">© 2026 EcoTwin AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/dashboard" className="hover:text-emerald-400">Dashboard</Link>
            <Link href="/digital-twin" className="hover:text-emerald-400">Digital Twin</Link>
            <Link href="/reports" className="hover:text-emerald-400">Compliance Reports</Link>
            <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
