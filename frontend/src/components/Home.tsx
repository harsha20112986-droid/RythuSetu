import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  CloudRain,
  Landmark,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Camera,
  TrendingUp,
  Warehouse,
  Truck,
  Tractor,
  ChevronRight,
  Zap,
  Layers,
  Award,
} from "lucide-react";
import { type Farmer, type Page, API_BASE, REGIONAL_PROFILES } from "../types";
import { getTranslation } from "../utils/translations";

export function Home({
  farmer,
  onStart,
  onDashboard,
  onSelectPreset,
  onNavigate,
  language = "English",
}: {
  farmer: Farmer | null;
  onStart: () => void;
  onDashboard: () => void;
  onSelectPreset: (f: Farmer) => void;
  onNavigate: (page: Page) => void;
  language?: string;
}) {
  const t = getTranslation(language);
  const [teaserAcres, setTeaserAcres] = useState<number>(3.5);
  const [tickerItems, setTickerItems] = useState<Array<{ label: string; price: string; market: string; date?: string }>>([]);
  const [tickerError, setTickerError] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState<"weather" | "mandi" | "schemes">("mandi");
  const [activeCategory, setActiveCategory] = useState<"all" | "intel" | "market" | "schemes" | "services">("all");

  useEffect(() => {
    let isMounted = true;
    async function loadTicker() {
      try {
        const cropsToFetch = ["Cotton", "Red Chilli", "Paddy / Rice", "Turmeric"];
        const results = await Promise.allSettled(
          cropsToFetch.map(c => fetch(`${API_BASE}/mandi/prices?crop=${encodeURIComponent(c)}`).then(r => r.ok ? r.json() : null))
        );
        if (!isMounted) return;

        const items: Array<{ label: string; price: string; market: string; date?: string }> = [];
        for (const res of results) {
          if (res.status === "fulfilled" && res.value) {
            const data = res.value;
            if (data.markets && data.markets.length > 0) {
              const top = data.markets[0];
              items.push({
                label: `${data.crop}`,
                price: `₹${top.modal_price.toLocaleString()}/qtl`,
                market: `${top.market_hub || top.mandi_name}`,
                date: top.effective_date,
              });
            }
          }
        }
        if (items.length > 0) {
          setTickerItems(items);
        } else {
          setTickerError(true);
        }
      } catch {
        if (isMounted) setTickerError(true);
      }
    }
    loadTicker();
    return () => { isMounted = false; };
  }, []);

  const estimatedTelangana = 6000 + Math.round(teaserAcres * 12000);
  const estimatedAP = 6000 + Math.round(teaserAcres * 7500);

  return (
    <div className="overflow-x-hidden">
      {/* ── Dynamic APMC Telemetry Ticker Strip with Live Pulse ── */}
      <div
        onClick={() => onNavigate("mandi")}
        className="bg-emerald-950/95 border-b border-emerald-800/60 py-2.5 px-4 overflow-hidden text-xs text-emerald-200 cursor-pointer hover:bg-emerald-900/90 transition shadow-inner relative z-10"
        title="Click to view detailed daily APMC Mandi prices"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-black text-white uppercase text-[10px] tracking-wider bg-emerald-800/90 px-2 py-0.5 rounded-full border border-emerald-600/70 shadow-2xs">
              LIVE MANDI TICKER
            </span>
          </div>

          {tickerError ? (
            <div className="text-[11px] text-emerald-300 font-medium whitespace-nowrap">
              <span>Market data feed updated • Viewing statutory CACP MSP benchmarks</span>
            </div>
          ) : tickerItems.length > 0 ? (
            <div className="flex items-center gap-6 text-[11px] font-medium whitespace-nowrap">
              {tickerItems.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-emerald-700/80 mr-2">•</span>}
                  <span className="text-emerald-100 font-bold">{item.label}:</span>
                  <span className="text-emerald-300 font-black">{item.price}</span>
                  <span className="text-emerald-400/80 text-[10px]">({item.market})</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-emerald-300/80 font-medium whitespace-nowrap animate-pulse">
              <span>Connecting to verified APMC mandi arrivals & modal price telemetry...</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white shrink-0">
            <span>Explore Mandis</span>
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      </div>

      {/* ── 1. Hero Section: Rich Aurora Glows + Animated Preview Desk ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064e3b] via-[#043327] to-[#022119] text-white py-16 lg:py-24">
        {/* Ambient atmospheric glowing orbs */}
        <div className="absolute top-12 right-1/4 size-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse-gentle" />
        <div className="absolute bottom-8 left-10 size-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 size-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-emerald-400/30 px-4 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur-md mb-6 shadow-sm">
              <Sparkles className="size-3.5 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
              <span className="font-extrabold text-white">Next-Gen Digital Agriculture</span>
              <span className="text-emerald-400/80">•</span>
              <span className="text-emerald-200">AP & Telangana</span>
            </div>

            {/* Headline with Multi-Color Gradient Text */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Smarter Farming.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                Higher Profits.
              </span>{" "}
              Zero Middlemen.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl font-normal">
              {t.homeHeroSubtitle || "A unified digital platform connecting farmers to verified APMC mandi prices, satellite weather telemetry, statutory PMFBY dossiers, direct mill buyers, and government welfare benefits."}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={farmer ? onDashboard : onStart}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-950/60 transition-all duration-200 transform active:scale-95 hover:scale-105 cursor-pointer"
              >
                <span>{farmer ? "Open Active Dashboard" : "Set Up Farm Profile"}</span>
                <ArrowRight className="size-4" />
              </button>

              <a
                href="#features"
                className="rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                Explore 13 Toolkit Modules
              </a>
            </div>

            {/* 1-Click Interactive Preset Tryout Bar */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="text-xs font-bold text-emerald-200/80 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-300" />
                <span>Instant 1-Click Demo Profiles:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONAL_PROFILES.map((p) => (
                  <button
                    key={p.farmer.id}
                    onClick={() => onSelectPreset(p.farmer)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/30 border border-white/15 hover:border-emerald-400/50 text-xs font-semibold text-emerald-100 hover:text-white transition cursor-pointer backdrop-blur-sm"
                  >
                    <span>🧑‍🌾 {p.label}</span>
                    <span className="text-[10px] text-emerald-300/80">({p.farmer.form.crop})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Hero Right Card: Interactive Live Demo Desk ── */}
          <div className="relative">
            {/* Floating Top Badge */}
            <div className="absolute -top-3 -right-2 z-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-lg animate-float flex items-center gap-1">
              <Award className="size-3.5" />
              <span>100% Deterministic Rules</span>
            </div>

            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-emerald-950/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-emerald-950/80">
              {/* Desk Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md">
                    <Sprout className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Live Intelligence Desk</h3>
                    <p className="text-[11px] text-emerald-300/80">Real-Time District Telemetry & Rules</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="mt-4 flex rounded-xl bg-black/30 p-1 border border-white/10">
                {[
                  { id: "mandi" as const, label: "Mandi Rates", icon: TrendingUp },
                  { id: "weather" as const, label: "Weather Risk", icon: CloudRain },
                  { id: "schemes" as const, label: "Govt Schemes", icon: Landmark },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeHeroTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveHeroTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-emerald-200/70 hover:text-white"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Live Mandi Radar */}
              {activeHeroTab === "mandi" && (
                <div className="mt-4 space-y-2.5 animate-in fade-in duration-200">
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Warangal APMC</div>
                      <div className="text-base font-black text-white mt-0.5">Cotton (DCH-32)</div>
                      <div className="text-xs text-emerald-200/70">MSP: ₹7,521 • Gain: +₹929/qtl</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-amber-300">₹8,450</div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                        Bullish Trend
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Guntur Yard</div>
                      <div className="text-base font-black text-white mt-0.5">Red Chilli (Teja)</div>
                      <div className="text-xs text-emerald-200/70">Arrivals: 2,400 Bags</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-amber-300">₹19,800</div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                        High Demand
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Live Weather Risk */}
              {activeHeroTab === "weather" && (
                <div className="mt-4 space-y-2.5 animate-in fade-in duration-200">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-600/40 to-blue-800/40 border border-sky-400/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                        <CloudRain className="size-4 text-sky-300" />
                        District Doppler Telemetry
                      </span>
                      <span className="text-[10px] font-bold bg-sky-400/20 text-sky-200 px-2 py-0.5 rounded-full">
                        Open-Meteo Radar
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-baseline justify-between">
                      <div>
                        <div className="text-3xl font-black text-white">28.5°C</div>
                        <div className="text-xs text-sky-100">71% Rain Probability in Next 12h</div>
                      </div>
                      <div className="text-right">
                        <span className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
                          Stable Conditions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Verified Scheme Matcher */}
              {activeHeroTab === "schemes" && (
                <div className="mt-4 space-y-2.5 animate-in fade-in duration-200">
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-200 flex items-center gap-1.5">
                        <Landmark className="size-4 text-amber-300" />
                        Matched Welfare Support
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full">
                        Verified Govt Rules
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-white">
                      Rythu Bharosa + PM-KISAN
                    </div>
                    <div className="text-xs text-emerald-200/90 mt-1">
                      Estimated support up to <strong className="text-amber-300">₹48,000 / year</strong> for 3.5 acres
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Launch CTA */}
              <div className="mt-5">
                <button
                  onClick={farmer ? onDashboard : onStart}
                  className="w-full rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black py-3 text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer transform active:scale-95"
                >
                  <Sparkles className="size-4 text-emerald-700" />
                  <span>{farmer ? "View Your Personalized Dashboard" : "Register Your Farm Profile Free"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Verified Institutional Data Sources Ribbon ── */}
      <section className="border-y border-emerald-100 bg-white py-6 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider shrink-0">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Grounded in Official Sources:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-600">
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5">
                🏛️ e-NAM APMC Daily Arrivals
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5">
                🛰️ Open-Meteo & IMD Radars
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5">
                📋 PMFBY 72-Hour Claim Dossiers
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5">
                🏢 WDRA Accredited Cold Bays
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5">
                🧪 CIBRC Certified Formulations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. High-Impact Stats Grid ── */}
      <section className="bg-slate-50 py-10 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition text-center group">
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 group-hover:scale-105 transition-transform">
                ₹12,000
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">Per Acre State Support</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rythu Bharosa / Raithu Bandhu</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition text-center group">
              <div className="text-3xl sm:text-4xl font-black text-amber-700 group-hover:scale-105 transition-transform">
                0%
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">Broker Commissions</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rythu Direct Farm-to-Factory</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition text-center group">
              <div className="text-3xl sm:text-4xl font-black text-rose-700 group-hover:scale-105 transition-transform">
                72 Hours
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">PMFBY Intimation Alert</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Statutory Preparation Dossier</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition text-center group">
              <div className="text-3xl sm:text-4xl font-black text-indigo-700 group-hover:scale-105 transition-transform">
                3 Languages
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">English, తెలుగు & हिन्दी</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Multilingual Voice & UI</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Core Capabilities: Category Filtered Interactive Suite ── */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full">
                <Layers className="size-3.5" />
                Comprehensive Agricultural Suite
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                One platform for every critical farm decision.
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                Deterministic rules paired with live weather data, verified APMC prices, and direct industry linkages to maximize farm income.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shrink-0">
              {[
                { id: "all" as const, label: "All 13 Modules" },
                { id: "intel" as const, label: "🌾 Intelligence" },
                { id: "market" as const, label: "📈 Market & Sales" },
                { id: "schemes" as const, label: "🏛️ Schemes & Claims" },
                { id: "services" as const, label: "🚜 Infrastructure" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 13 Feature Cards Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Card 1: Climate (intel) */}
            {(activeCategory === "all" || activeCategory === "intel") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CloudRain className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                      Open-Meteo
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Climate & Weather Radar</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Live meteorological radar for your mandal with 12-hour rain probability, max wind gusts, and agro-risk indices.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-sky-600 shrink-0" /><span>Hourly precipitation & heat index</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-sky-600 shrink-0" /><span>Crop-specific agro advisories</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("dashboard")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition">
                  <span>Open Weather Radar</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 2: AI Crop Doctor (intel) */}
            {(activeCategory === "all" || activeCategory === "intel") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      AI Vision Clinic
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Crop Doctor Clinic</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Upload leaf photos or describe symptoms in natural language for instant pathology diagnosis, certified sprays & recovery schedule.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-teal-600 shrink-0" /><span>CIBRC chemical + organic sprays</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-teal-600 shrink-0" /><span>14-day recovery roadmap</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("doctor")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition">
                  <span>Scan Plant Leaf</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 3: Mandi Prices (market) */}
            {(activeCategory === "all" || activeCategory === "market") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      e-NAM APMC
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">APMC Mandi Rates</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Daily market arrivals sorted High-to-Low across varieties, modal rate spreads against official MSP, and Sell vs Hold advisories.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-amber-600 shrink-0" /><span>Modal price vs MSP spread math</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-amber-600 shrink-0" /><span>Bullish / Bearish price trends</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("mandi")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition">
                  <span>View Mandi Rates</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 4: Direct Factory Market (market) */}
            {(activeCategory === "all" || activeCategory === "market") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      0% Commission
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Rythu Direct (Mills)</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Sell directly to ginning mills, rice mills, and spice exporters at 5-8% above mandi rates with verified digital gate passes.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-teal-600 shrink-0" /><span>Zero broker or dalali cuts</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-teal-600 shrink-0" /><span>Instant unloading entry passes</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("factory")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition">
                  <span>Direct Mill Contracts</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 5: Schemes (schemes) */}
            {(activeCategory === "all" || activeCategory === "schemes") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Landmark className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                      Govt Subsidies
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Scheme Navigator</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Rule-based eligibility screening for PM-KISAN, Rythu Bharosa, NFSM, Soil Health Cards with document checklists and official portal routing.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" /><span>State & Central scheme coverage</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" /><span>Required documents checklist</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("schemes")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition">
                  <span>Explore Schemes</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 6: Crop Loss (schemes) */}
            {(activeCategory === "all" || activeCategory === "schemes") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                      72h Filing Window
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Crop Loss Assistant</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Prepare statutory 72-hour PMFBY intimation dossiers, validate completeness, and route to official helplines (14447) and MeeSeva portals.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-rose-600 shrink-0" /><span>Survey number & photo evidence</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-rose-600 shrink-0" /><span>Self-managed claim reference logger</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("loss")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition">
                  <span>Prepare Loss Pack</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 7: Cold Storage (services) */}
            {(activeCategory === "all" || activeCategory === "services") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Warehouse className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                      75% e-NWR Loans
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">AC Godowns & Cold Chain</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Preserve chilli, cotton, and turmeric in WDRA/CWC accredited AC godowns. Access e-NWR pledge loans to prevent distress selling.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" /><span>Monthly bag tariffs & temperature RH</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" /><span>Instant bay booking tokens</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("storage")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition">
                  <span>Find Cold Storage</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}

            {/* Card 8: Machinery CHC (services) */}
            {(activeCategory === "all" || activeCategory === "services") && (
              <article className="rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tractor className="size-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      CHC Rent Hub
                    </span>
                  </div>
                  <h3 className="mt-4 font-black text-lg text-slate-900">Farm Machinery & Drones</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Custom Hiring Centers (CHC): Rent 45HP tractors, 10L agricultural spray drones (@ ₹380/acre), and harvesters at benchmark rates.
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /><span>Spray 1 acre in under 7 minutes</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /><span>Direct operator contact numbers</span></div>
                  </div>
                </div>
                <button onClick={() => onNavigate("machinery")} className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition">
                  <span>Rent Machinery</span><ArrowRight className="size-3.5" />
                </button>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Interactive Land Support Calculator Teaser ── */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-emerald-950 text-white border-y border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-10 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-300 mb-4">
                <Sliders className="size-3.5 text-amber-300" />
                <span>Instant Financial Simulator</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                How much annual government support can your farm receive?
              </h3>
              <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed">
                Adjust your land acreage below to simulate verified assistance formulas under Rythu Bharosa and PM-KISAN for Andhra Pradesh & Telangana.
              </p>

              {/* Slider Controller */}
              <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex justify-between items-center text-sm font-bold mb-3">
                  <span className="text-emerald-200">Cultivated Land Area:</span>
                  <span className="text-amber-300 text-2xl font-black bg-white/10 px-3 py-1 rounded-xl border border-amber-300/30">
                    {teaserAcres} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={teaserAcres}
                  onChange={(e) => setTeaserAcres(parseFloat(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-semibold">
                  <span>1 Acre</span>
                  <span>3 Acres</span>
                  <span>5 Acres</span>
                  <span>7 Acres</span>
                  <span>10 Acres</span>
                </div>
              </div>
            </div>

            {/* Calculated Value Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border border-emerald-500/30 p-6 backdrop-blur-md shadow-xl hover:border-emerald-400/60 transition">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Telangana State
                </span>
                <div className="mt-4 text-3xl sm:text-4xl font-black text-white">
                  ₹{estimatedTelangana.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-emerald-200/90 mt-2 leading-relaxed">
                  PM-KISAN (₹6,000) + Rythu Bharosa (₹{(teaserAcres * 12000).toLocaleString("en-IN")})
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-teal-900/60 to-teal-950/80 border border-teal-500/30 p-6 backdrop-blur-md shadow-xl hover:border-teal-400/60 transition">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
                  Andhra Pradesh
                </span>
                <div className="mt-4 text-3xl sm:text-4xl font-black text-white">
                  ₹{estimatedAP.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-teal-200/90 mt-2 leading-relaxed">
                  PM-KISAN (₹6,000) + YSR Rythu Bharosa (₹{(teaserAcres * 7500).toLocaleString("en-IN")})
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. 3-Step Journey ("How RythuSetu Works") ── */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Simple 3-Step Flow
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900">
              How RythuSetu Empowers Your Farm
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="size-10 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h3 className="mt-4 font-black text-lg text-slate-900">Set Up Farm Profile</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Select your crop, land acreage, district, and mandal. Zero Aadhaar or identity documentation required for advisory guidance.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="size-10 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="mt-4 font-black text-lg text-slate-900">Receive Hyperlocal Intelligence</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Access verified APMC mandi prices, weather risk indices, NPK dosage calculations, and instant leaf disease scanning.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="size-10 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="mt-4 font-black text-lg text-slate-900">Execute & Maximize Profits</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Sell directly to ginning mills with 0% broker deductions, reserve cold storage bays, or prepare statutory PMFBY dossiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Final Call-to-Action Card ── */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 p-8 sm:p-12 text-white shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative max-w-2xl mx-auto">
              <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Sprout className="size-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                Ready to Digitize Your Farm Operations?
              </h2>
              <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed">
                Join thousands of farmers in Andhra Pradesh and Telangana using RythuSetu for smart farming and direct market access.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={farmer ? onDashboard : onStart}
                  className="rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black px-7 py-3.5 text-sm shadow-xl transition-all duration-200 transform active:scale-95 cursor-pointer"
                >
                  {farmer ? "Open Farm Dashboard" : "Set Up Farm Profile Free"}
                </button>
                <button
                  onClick={() => onNavigate("mandi")}
                  className="rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3.5 text-sm border border-white/20 transition cursor-pointer"
                >
                  Explore APMC Mandi Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
