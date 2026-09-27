import { useState, useEffect } from "react";
import {
  ArrowRight,
  CloudRain,
  Landmark,
  Sprout,
  Sliders,
  Camera,
  TrendingUp,
  Warehouse,
  Truck,
  Tractor,
  Layers,
  Award,
  Play,
  Globe,
  Bell,
  Search,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { type Farmer, type Page, API_BASE, REGIONAL_PROFILES } from "../types";

export function Home({
  farmer,
  onStart,
  onDashboard,
  onSelectPreset,
  onNavigate,
  language = "English",
  onOpenLogin,
  onOpenIvr,
}: {
  farmer: Farmer | null;
  onStart: () => void;
  onDashboard: () => void;
  onSelectPreset: (f: Farmer) => void;
  onNavigate: (page: Page) => void;
  language?: string;
  onOpenLogin?: () => void;
  onOpenIvr?: () => void;
}) {
  const [teaserAcres, setTeaserAcres] = useState<number>(5.2);
  const [tickerItems, setTickerItems] = useState<Array<{ label: string; price: string; market: string; change: string }>>([
    { label: "Paddy", price: "₹2,320/q", market: "Guntur Market", change: "▲ +2.5%" },
    { label: "Maize", price: "₹2,225/q", market: "Nizamabad Hub", change: "▲ +1.8%" },
    { label: "Tur", price: "₹7,550/q", market: "Khammam Yard", change: "▲ +0.9%" },
  ]);
  const [activeCategory, setActiveCategory] = useState<"all" | "intel" | "market" | "schemes" | "services">("all");

  useEffect(() => {
    let isMounted = true;
    async function loadTicker() {
      try {
        const cropsToFetch = ["Paddy / Rice", "Cotton", "Red Chilli", "Turmeric"];
        const results = await Promise.allSettled(
          cropsToFetch.map(c => fetch(`${API_BASE}/mandi/prices?crop=${encodeURIComponent(c)}`).then(r => r.ok ? r.json() : null))
        );
        if (!isMounted) return;

        const items: Array<{ label: string; price: string; market: string; change: string }> = [];
        for (const res of results) {
          if (res.status === "fulfilled" && res.value) {
            const data = res.value;
            if (data.markets && data.markets.length > 0) {
              const top = data.markets[0];
              items.push({
                label: data.crop,
                price: `₹${top.modal_price.toLocaleString()}/q`,
                market: top.market_hub || top.mandi_name,
                change: top.price_trend === "bullish" ? "+2.5%" : top.price_trend === "bearish" ? "-1.2%" : "+0.5%",
              });
            }
          }
        }
        if (items.length > 0) {
          setTickerItems(items);
        } else {
          // Fallback realistic APMC values
          setTickerItems([
            { label: "Paddy (Common)", price: "₹2,320/q", market: "Guntur Market", change: "+2.5%" },
            { label: "Cotton", price: "₹7,850/q", market: "Warangal APMC", change: "+1.8%" },
            { label: "Red Chilli", price: "₹19,500/q", market: "Khammam Yard", change: "+3.2%" },
            { label: "Maize", price: "₹2,225/q", market: "Nizamabad Hub", change: "+1.1%" },
          ]);
        }
      } catch {
        if (isMounted) {
          setTickerItems([
            { label: "Paddy (Common)", price: "₹2,320/q", market: "Guntur Market", change: "+2.5%" },
            { label: "Cotton", price: "₹7,850/q", market: "Warangal APMC", change: "+1.8%" },
            { label: "Red Chilli", price: "₹19,500/q", market: "Khammam Yard", change: "+3.2%" },
          ]);
        }
      }
    }
    loadTicker();
    return () => { isMounted = false; };
  }, []);

  const estimatedTelangana = 6000 + Math.round(teaserAcres * 12000);
  const estimatedAP = 6000 + Math.round(teaserAcres * 7500);

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 select-none overflow-x-hidden font-sans">
      {/* ── Top Navigation Bar (Reference Design) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
          >
            <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Sprout className="size-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-emerald-950 font-sans block leading-none">
                RythuSetu
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block mt-1">
                AgriTech Intelligence
              </span>
            </div>
          </button>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <button
              onClick={() => onNavigate("home")}
              className="text-emerald-800 font-extrabold hover:text-emerald-900 cursor-pointer"
            >
              Home
            </button>
            <a
              href="#features"
              className="hover:text-emerald-800 transition cursor-pointer"
            >
              Features
            </a>
            <button
              onClick={() => onNavigate("organizations")}
              className="hover:text-emerald-800 transition cursor-pointer"
            >
              For Organizations
            </button>
            <button
              onClick={() => onNavigate("pricing")}
              className="hover:text-emerald-800 transition cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate("action-center")}
              className="hover:text-emerald-800 transition cursor-pointer"
            >
              Support
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <Globe className="size-3.5 text-slate-500" />
              <span>{language === "Telugu" ? "తెలుగు" : language === "Hindi" ? "हिन्दी" : "EN"}</span>
            </div>

            {/* Login / Profile button */}
            <button
              onClick={onOpenLogin || onStart}
              className="px-4 py-2 text-xs font-black text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Login
            </button>

            {/* Primary Get Started Button */}
            <button
              onClick={farmer ? onDashboard : onStart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{farmer ? "Dashboard" : "Get Started"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section with Agricultural Landscape & Floating Cards ── */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#eef7ee] via-[#f3f9f3] to-white">
        {/* Soft Background Rays */}
        <div className="absolute top-0 right-1/4 size-[500px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 size-[400px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-300/80 text-emerald-800 text-xs font-bold shadow-xs backdrop-blur-xs">
                <Sprout className="size-3.5 text-emerald-600" />
                <span>Digital Agriculture for a Stronger Tomorrow</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#134e2a] tracking-tight leading-[1.05]">
                RythuSetu
              </h1>

              {/* Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug">
                One Digital Platform for Smarter Farming & Farmer Services
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Empowering farmers, FPOs and agricultural organizations with technology, information and services in one platform.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenIvr || onStart}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#0a3818] hover:bg-[#062911] text-white text-sm font-black shadow-lg shadow-emerald-950/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="size-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="size-3 text-white fill-white ml-0.5" />
                  </div>
                  <span>Request a 10-Minute Demo</span>
                </button>

                <button
                  onClick={farmer ? onDashboard : onStart}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#f4ece1] hover:bg-[#eae0d2] text-[#3d2f1f] text-sm font-black border border-[#d9ccb9] transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>{farmer ? "Open Farm Dashboard" : "Get Started"}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div className="pt-4 flex items-center gap-2 flex-wrap text-xs text-slate-500 font-semibold">
                <span className="text-slate-400">1-Click Regional Demo:</span>
                {REGIONAL_PROFILES.map((p) => (
                  <button
                    key={p.farmer.id}
                    onClick={() => onSelectPreset(p.farmer)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 transition cursor-pointer text-slate-700 shadow-2xs"
                  >
                    🧑‍🌾 {p.label} ({p.farmer.form.crop})
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Right Visual: Farmer & 4 Live Floating Glass Cards */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-emerald-100 to-green-200 aspect-[4/3] flex items-center justify-center">
                {/* Farmer Image Backdrop */}
                <img
                  src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1000&q=80"
                  alt="Indian farmer holding smartphone in agricultural field"
                  className="w-full h-full object-cover brightness-105 contrast-105"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Card 1: Live Weather (Top Left) */}
                <div className="absolute top-4 left-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-white/80 animate-float max-w-[210px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌤️</span>
                    <div>
                      <div className="text-xs font-black text-slate-900">28°C • Guntur, AP</div>
                      <div className="text-[10px] text-slate-500">Partly Cloudy</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-1">
                    Good conditions for crop growth
                  </div>
                </div>

                {/* Floating Card 2: Crop Health (Bottom Left) */}
                <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-white/80 max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <div>
                      <div className="text-xs font-black text-slate-900">Paddy</div>
                      <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                        🟢 Healthy
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Good crop condition • Keep monitoring
                  </div>
                </div>

                {/* Floating Card 3: Mandi Price (Top Right) */}
                <div className="absolute top-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-white/80 text-right max-w-[190px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mandi Price</div>
                  <div className="text-base font-black text-slate-900">₹2,320 / q</div>
                  <div className="text-[10px] text-slate-500">Paddy (Common) • Guntur</div>
                  <div className="text-[10px] font-black text-emerald-700 mt-0.5">▲ +2.5% vs last week</div>
                </div>

                {/* Floating Card 4: New Schemes Available (Bottom Right) */}
                <div
                  onClick={() => onNavigate("schemes")}
                  className="absolute bottom-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-white/80 cursor-pointer hover:bg-emerald-50 transition max-w-[200px]"
                >
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <span>📄</span> New Schemes
                    </span>
                    <ChevronRight className="size-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Explore government schemes you are eligible for
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Live Interactive Dashboard Showcase (Matches Tablet in Reference) ── */}
      <section className="py-12 lg:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Live Product Experience
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Designed for Speed, Accuracy, and Ease of Use
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Explore the exact dashboard your farmers and field teams will use every day.
            </p>
          </div>

          {/* Modern Tablet Shell Frame */}
          <div className="rounded-[32px] p-3 sm:p-5 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-2xl border-4 border-slate-700/60 max-w-6xl mx-auto">
            {/* Tablet Inner Screen */}
            <div className="bg-slate-50 rounded-[24px] overflow-hidden border border-slate-200 shadow-inner">
              {/* Dashboard Internal Header */}
              <div className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                    <Sprout className="size-4" />
                  </div>
                  <span className="text-base font-black text-slate-900 hidden sm:inline">RythuSetu</span>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-500">
                    <Search className="size-3.5 text-slate-400" />
                    <span>Search for crops, schemes, markets...</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Bell className="size-4" />
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-[#0a3818] text-white flex items-center justify-center text-xs font-black">
                      HV
                    </div>
                    <span className="text-xs font-bold text-slate-800 hidden md:inline">Harsha Farmer</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content Inside Mockup */}
              <div className="p-4 sm:p-6 space-y-5">
                {/* Greeting Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>👋</span> Good Morning, Farmer!
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Let's grow together for a better tomorrow.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
                      <MapPin className="size-3.5 text-emerald-700" />
                      Guntur, Andhra Pradesh
                    </span>
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                      🌤️ 28°C Partly Cloudy
                    </span>
                  </div>
                </div>

                {/* 8 Feature Cards Row (Exactly matching the reference image) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                  {[
                    { label: "My Crop", sub: "Manage crops", icon: Sprout, color: "text-emerald-700 bg-emerald-50", page: "onboarding" },
                    { label: "Weather", sub: "Latest weather", icon: CloudRain, color: "text-sky-700 bg-sky-50", page: "dashboard" },
                    { label: "Market Prices", sub: "Mandi prices", icon: TrendingUp, color: "text-amber-700 bg-amber-50", page: "mandi" },
                    { label: "Crop Doctor", sub: "AI leaf scanner", icon: Camera, color: "text-teal-700 bg-teal-50", page: "doctor" },
                    { label: "Schemes", sub: "Eligible subsidies", icon: Landmark, color: "text-indigo-700 bg-indigo-50", page: "schemes" },
                    { label: "Crop Loss", sub: "Report damage", icon: ShieldAlert, color: "text-rose-700 bg-rose-50", page: "loss" },
                    { label: "Machinery", sub: "Rent tractors", icon: Tractor, color: "text-emerald-800 bg-emerald-50", page: "machinery" },
                    { label: "Storage", sub: "AC godowns", icon: Warehouse, color: "text-blue-700 bg-blue-50", page: "storage" },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => onNavigate(card.page as Page)}
                        className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition text-left cursor-pointer group"
                      >
                        <div className={`size-9 rounded-xl flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="size-4.5" />
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-2 leading-tight">{card.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{card.sub}</div>
                      </button>
                    );
                  })}
                </div>

                {/* 3-Column Core Analytics Grid */}
                <div className="grid lg:grid-cols-12 gap-5">
                  {/* Left Column: My Farm Overview */}
                  <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900">
                      <span>My Farm Overview</span>
                      <button onClick={onStart} className="text-[11px] text-emerald-700 hover:underline">
                        Edit Area →
                      </button>
                    </div>

                    {/* Satellite Field View */}
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-slate-200 shadow-inner">
                      <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                        alt="Aerial farm land view"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none" />
                      <div className="absolute top-2 left-2 bg-emerald-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                        <MapPin className="size-3 text-emerald-400" />
                        Guntur, AP • Survey #142/B
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[10px] text-slate-500">Total Area</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">5.2 Acres</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[10px] text-slate-500">Current Crop</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">🌾 Paddy</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[10px] text-slate-500">Growth Stage</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">Tillering</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                        <span>Cycle Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-600 h-2 rounded-full w-[65%]" />
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Market Price Trends */}
                  <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900">
                      <span>Market Price Trends</span>
                      <div className="flex gap-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold">1M</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">3M</span>
                      </div>
                    </div>

                    {/* SVG Curve Chart */}
                    <div className="relative pt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                        <span>₹2,400</span>
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                          Peak: ₹2,320 (Sep 24)
                        </span>
                      </div>
                      <svg viewBox="0 0 300 100" className="w-full h-24 stroke-emerald-600 fill-emerald-50/60">
                        <path
                          d="M 0,80 Q 50,60 100,65 T 200,45 T 270,30 T 300,20 L 300,100 L 0,100 Z"
                        />
                        <path
                          d="M 0,80 Q 50,60 100,65 T 200,45 T 270,30 T 300,20"
                          fill="none"
                          strokeWidth="2.5"
                        />
                        <circle cx="270" cy="30" r="4" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Aug 27</span>
                        <span>Sep 03</span>
                        <span>Sep 10</span>
                        <span>Sep 17</span>
                        <span>Sep 24</span>
                      </div>
                    </div>

                    {/* Ticker pills below chart (Dynamic APMC data) */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                      {tickerItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-center">
                          <div className="font-bold text-slate-800">{item.label}</div>
                          <div className="font-black text-emerald-900">{item.price} <span className="text-[9px] text-emerald-700">{item.change}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: 5-Day Weather & Recent Updates */}
                  <div className="lg:col-span-3 space-y-3">
                    {/* 5-Day Strip */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                      <div className="text-xs font-black text-slate-900 mb-2">Weather Forecast</div>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {[
                          { day: "Today", temp: "28°", icon: "🌤️", rain: "0%" },
                          { day: "Mon", temp: "29°", icon: "☀️", rain: "0%" },
                          { day: "Tue", temp: "30°", icon: "☀️", rain: "0%" },
                          { day: "Wed", temp: "27°", icon: "🌧️", rain: "60%" },
                          { day: "Thu", temp: "26°", icon: "⛈️", rain: "70%" },
                        ].map((d, i) => (
                          <div key={i} className="p-1 rounded-xl bg-slate-50">
                            <div className="text-[9px] font-bold text-slate-500">{d.day}</div>
                            <div className="text-sm my-0.5">{d.icon}</div>
                            <div className="text-[10px] font-black text-slate-900">{d.temp}</div>
                            <div className="text-[8px] text-sky-700">{d.rain}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Updates */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                      <div className="text-xs font-black text-slate-900 mb-2">Recent Updates</div>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">New market rates uploaded (10:00 AM)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate">Weather rain alert in Guntur mandals</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                          <span className="truncate">Rythu Bharosa matching live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Four Feature Pillars Ribbon (Exact Bottom Strip from Reference) ── */}
      <section className="bg-[#0a3818] text-white py-12 border-t border-emerald-900/60 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Sprout className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Better Information</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">Data-driven farming decisions</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Layers className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Easier Services</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">Access all services in one platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Higher Productivity</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">Plan better and reduce costs</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Award className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Stronger Communities</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">Empowering farmers together</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Interactive Land Support Calculator ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-green-950 p-8 sm:p-10 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Sliders className="size-3.5" />
                  Instant Annual Payout Calculator
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black">
                  How much annual support can your farm receive?
                </h3>
                <p className="mt-2 text-sm text-emerald-200/90 leading-relaxed">
                  Adjust your land acreage below to preview estimated annual assistance under verified schemes for Telangana and Andhra Pradesh.
                </p>

                {/* Slider */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Farm Land Area:</span>
                    <span className="text-amber-400 text-xl font-black">{teaserAcres} Acres</span>
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
                    ₹{estimatedTelangana.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    PM-KISAN (₹6k) + Rythu Bharosa (₹{(teaserAcres * 12000).toLocaleString("en-IN")})
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-md">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                    Andhra Pradesh Estimate
                  </span>
                  <p className="mt-2 text-3xl font-black text-white">
                    ₹{estimatedAP.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    PM-KISAN (₹6k) + YSR Rythu Bharosa (₹{(teaserAcres * 7500).toLocaleString("en-IN")})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Full Agricultural Toolkit Grid (With Interactive Category Filter) ── */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                Modular Capabilities
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Complete End-to-End AgriTech Toolkit
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                13 integrated decision support engines for farmers, FPOs, and field officers.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[
                { id: "all" as const, label: "All 13 Modules" },
                { id: "intel" as const, label: "🌾 Intelligence" },
                { id: "market" as const, label: "📈 Market & Mills" },
                { id: "schemes" as const, label: "🏛️ Govt Schemes" },
                { id: "services" as const, label: "🚜 Farm Services" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat.id ? "bg-emerald-800 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card: Weather */}
            {(activeCategory === "all" || activeCategory === "intel") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <CloudRain className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">Weather Radar & Alerts</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Hourly district rainfall probability, heat indices, and cyclone hazard scoring from Open-Meteo & IMD.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Radar View</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Crop Doctor */}
            {(activeCategory === "all" || activeCategory === "intel") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Camera className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">AI Crop Doctor</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Leaf pathology scanning via phone camera or text symptoms with certified chemical & organic treatments.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("doctor")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Scan Leaf</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Mandi */}
            {(activeCategory === "all" || activeCategory === "market") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">APMC Mandi Intelligence</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Daily mandi arrivals sorted High-to-Low, modal price spreads vs MSP, and Sell vs Hold advisories.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("mandi")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View Mandi Prices</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Direct Factory */}
            {(activeCategory === "all" || activeCategory === "market") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Truck className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">Rythu Direct (Mills)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sell directly to ginning mills & modern rice mills with zero broker deductions and digital gate passes.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("factory")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Direct Contracts</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Schemes */}
            {(activeCategory === "all" || activeCategory === "schemes") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Landmark className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">Scheme Navigator</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    State & Central government subsidy eligibility screening with required document checklists.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("schemes")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Browse Schemes</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Crop Loss */}
            {(activeCategory === "all" || activeCategory === "schemes") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <ShieldAlert className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">PMFBY 72h Crop Loss</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Prepare statutory 72-hour intimation dossiers with survey numbers, photo proof, and helpline routing.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("loss")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Prepare Dossier</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Machinery */}
            {(activeCategory === "all" || activeCategory === "services") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Tractor className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">Machinery & Spray Drones</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Rent tractors, 10L foliar spray drones (@ ₹380/acre), and harvesters from verified CHC hubs.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("machinery")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Rent Hub</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Card: Cold Storage */}
            {(activeCategory === "all" || activeCategory === "services") && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <Warehouse className="size-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">AC Cold Storage Bays</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    WDRA accredited godown bay reservation with 75% e-NWR pledge loans to eliminate distress sales.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("storage")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Storage</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Sprout className="size-3.5" />
            </div>
            <span className="font-black text-slate-900">RythuSetu</span>
            <span>• One Digital Platform for Smarter Farming & Farmer Services</span>
          </div>
          <div className="flex gap-4 font-semibold text-slate-600">
            <button onClick={() => onNavigate("privacy")} className="hover:text-emerald-800">Privacy Policy</button>
            <button onClick={() => onNavigate("terms")} className="hover:text-emerald-800">Terms of Service</button>
            <button onClick={() => onNavigate("pricing")} className="hover:text-emerald-800">Commercial Packages</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
