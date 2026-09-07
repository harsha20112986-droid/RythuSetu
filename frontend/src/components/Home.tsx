import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  CloudRain,
  Landmark,
  Bot,
  Sprout,
  FileCheck2,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { type Farmer } from "../types";

export function Home({
  farmer,
  onStart,
  onDashboard,
  onSelectPreset: _onSelectPreset,
  onNavigate,
}: {
  farmer: Farmer | null;
  onStart: () => void;
  onDashboard: () => void;
  onSelectPreset: (f: Farmer) => void;
  onNavigate: (page: "schemes" | "benefits" | "loss") => void;
}) {
  const [teaserAcres, setTeaserAcres] = useState<number>(3.5);

  const estimatedTelangana = 6000 + Math.round(teaserAcres * 12000);
  const estimatedAP = 6000 + Math.round(teaserAcres * 7500);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-white py-16 lg:py-24">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-10 right-1/4 size-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 size-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur-md mb-6 shadow-sm">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>AI-Powered Farmer Support</span>
              <span className="text-emerald-500">•</span>
              <span>Andhra Pradesh & Telangana</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Clarity in Climate, Schemes & Crop Protection.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl font-normal">
              RythuSetu connects hyper-local weather telemetry, verified government assistance rules, and explainable AI guidance to help farmers make the right decisions every season.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={farmer ? onDashboard : onStart}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 transition transform active:scale-95 cursor-pointer"
              >
                <span>{farmer ? "Open My Dashboard" : "Set Up Farm Profile"}</span>
                <ArrowRight className="size-4" />
              </button>

              <a
                href="#features"
                className="rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition cursor-pointer"
              >
                Explore Capabilities
              </a>
            </div>

            </div>


          {/* Hero Right Card: Live Snapshot Desk */}
          <div className="relative">
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/70 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                    <Sprout className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Intelligence Desk</h3>
                    <p className="text-[11px] text-emerald-300">Deterministic Rules + Real-Time Telemetry</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              </div>

              {/* Sample simulated tiles */}
              <div className="mt-5 space-y-3">
                {/* Weather Card */}
                <div className="rounded-2xl bg-slate-900/80 border border-emerald-700/40 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
                      <CloudRain className="size-3.5 text-sky-400" />
                      Weather Risk Model (Warangal)
                    </span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-bold text-[10px]">
                      Open-Meteo Live
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-black text-white">
                        28.5{"\u00B0"}C
                      </p>
                      <p className="text-xs text-slate-300">71% Rain Probability Today</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
                        Low Heat Stress
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schemes Card */}
                <div className="rounded-2xl bg-slate-900/80 border border-emerald-700/40 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
                      <Landmark className="size-3.5 text-amber-400" />
                      Matched Government Support
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold">Verified Data</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-white">
                    Rythu Bharosa + PM-KISAN
                  </p>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Estimated support up to <span className="text-amber-300 font-bold">{"\u20B9"}48,000 / year</span> for 3.5 acres
                  </p>
                </div>

                {/* Assistant Card */}
                <div className="rounded-2xl bg-slate-900/80 border border-emerald-700/40 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
                      <Bot className="size-3.5 text-emerald-400" />
                      Multilingual Krishi AI
                    </span>
                    <span className="text-xs text-emerald-300 font-medium">
                      English • {"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"} • {"\u0939\u093F\u0928\u094D\u0926\u0940"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    Voice & text assistant grounded strictly in verified scheme documents and local weather data.
                  </p>
                </div>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => onStart()}
                  className="w-full rounded-2xl bg-white text-emerald-950 font-bold py-2.5 text-xs hover:bg-emerald-50 transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sprout className="size-3.5 text-emerald-600" />
                  Register Your Farm Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Stats Ribbon */}
      <section className="border-y border-emerald-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-900">{"\u20B9"}12,000</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Per Acre State Support</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-900">{"\u20B9"}6,000</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">PM-KISAN Annual Base</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-900">72 Hours</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">PMFBY Claim Window</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-900">3 Languages</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                English, {"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"} & {"\u0939\u093F\u0928\u094D\u0926\u0940"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities Section */}
      <section id="features" className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
              <Sprout className="size-3.5" />
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">
              One platform for every critical farm decision.
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Transparent, deterministic rules paired with real-time telemetry to protect your crop and maximize your eligible government support.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Climate */}
            <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <CloudRain className="size-6" />
                  </div>
                  <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[9px] font-extrabold text-sky-800 uppercase tracking-wider">
                    Open-Meteo
                  </span>
                </div>

                <h3 className="mt-5 font-black text-xl text-slate-900">Live Climate Risk</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Real-time weather telemetry for your district with instant heat, rain, and wind hazard scoring.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-sky-600 shrink-0" />
                    <span>Hourly rain probability & heat index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-sky-600 shrink-0" />
                    <span>Crop-specific agro-advisories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-sky-600 shrink-0" />
                    <span>Wind gust & cyclone warnings</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={farmer ? onDashboard : onStart}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  <span>Check Weather Radar</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </article>

            {/* Card 2: Schemes */}
            <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-green-600" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <FileCheck2 className="size-6" />
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    Verified Rules
                  </span>
                </div>

                <h3 className="mt-5 font-black text-xl text-slate-900">Scheme Finder</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Matches PM-KISAN, Rythu Bharosa, and PMFBY to your specific crop, state, and season.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>100% deterministic eligibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>State & Central scheme coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Direct links to official govt portals</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate("schemes")}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  <span>Browse Schemes</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </article>

            {/* Card 3: Benefits */}
            <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <Calculator className="size-6" />
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">
                    Interactive Math
                  </span>
                </div>

                <h3 className="mt-5 font-black text-xl text-slate-900">Benefit Estimator</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Interactive land-area slider calculates potential annual payouts with transparent formula breakups.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-amber-600 shrink-0" />
                    <span>Simulate from 0.5 to 20+ acres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-amber-600 shrink-0" />
                    <span>Transparent mathematical breakdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-amber-600 shrink-0" />
                    <span>Zero guesswork in financial numbers</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate("benefits")}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  <span>Simulate Payouts</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </article>

            {/* Card 4: Crop Loss */}
            <article className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 to-red-600" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <AlertTriangle className="size-6" />
                  </div>
                  <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[9px] font-extrabold text-rose-800 uppercase tracking-wider">
                    72h Claim Alert
                  </span>
                </div>

                <h3 className="mt-5 font-black text-xl text-slate-900">Crop Loss Desk</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Guided workflow to document crop damage, attach photographic evidence, and track claim deadlines.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-rose-600 shrink-0" />
                    <span>72-hour PMFBY intimation alert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-rose-600 shrink-0" />
                    <span>Upload field photo evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-rose-600 shrink-0" />
                    <span>Direct insurance helpline guidance</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate("loss")}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  <span>File Loss Notice</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Payout Simulator Teaser */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-green-950 p-8 sm:p-10 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Sliders className="size-3.5" />
                  Instant Calculation Engine
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black">
                  How much annual support can your farm receive?
                </h3>
                <p className="mt-2 text-sm text-emerald-200/90 leading-relaxed">
                  Slide your land area below to preview estimated annual assistance under verified schemes for Telangana and Andhra Pradesh.
                </p>

                {/* Slider */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Farm Land Area:</span>
                    <span className="text-amber-400 text-lg">{teaserAcres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={teaserAcres}
                    onChange={(e) => setTeaserAcres(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1 Acre</span>
                    <span>3 Acres</span>
                    <span>5 Acres</span>
                    <span>7 Acres</span>
                    <span>10 Acres</span>
                  </div>
                </div>
              </div>

              {/* Calculated Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-md">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                    Telangana Estimate
                  </span>
                  <p className="mt-2 text-3xl font-black text-white">
                    {"\u20B9"}{estimatedTelangana.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    PM-KISAN ({"\u20B9"}6k) + Rythu Bharosa ({"\u20B9"}{(teaserAcres * 12000).toLocaleString("en-IN")})
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-md">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                    Andhra Pradesh Estimate
                  </span>
                  <p className="mt-2 text-3xl font-black text-white">
                    {"\u20B9"}{estimatedAP.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    PM-KISAN ({"\u20B9"}6k) + YSR Rythu Bharosa ({"\u20B9"}{(teaserAcres * 7500).toLocaleString("en-IN")})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Guardrails & Privacy */}
      <section className="py-14 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 text-white shadow-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 mb-3">
              <ShieldCheck className="size-4" />
              Product Guardrails & Privacy
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              Rules & Verification First. AI for Explanation.
            </h3>
            <p className="mt-3 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Unlike generic chatbots, RythuSetu strictly uses deterministic rule engines for eligibility and financial math. The AI is used purely as an explainer and multilingual translator, ensuring zero hallucinations in government schemes or calculations.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero sensitive identity (Aadhaar/PAN) required for guidance</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct links to official government and insurance portals</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Clearly distinguished informational estimates from official claims</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
