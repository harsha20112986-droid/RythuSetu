import { useState, useEffect } from "react";
import {
  Radio,
  Bot,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Sprout,
  Landmark,
  Calculator,
  Edit3,
  FlaskConical,
  MapPin,
  Warehouse,
  TrendingUp,
  Tractor,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { type Farmer, type ClimateData, type BroadcastAlert, API_BASE } from "../types";

interface DashboardProps {
  farmer: Farmer;
  onEdit: () => void;
  onSchemes: () => void;
  onBenefits: () => void;
  onLoss: () => void;
  onOpenAssistant: () => void;
  onDoctor: () => void;
  onOpenIvr?: () => void;
  onMandi: () => void;
  onFertilizer: () => void;
  onRecommendation?: () => void;
  onStorage?: () => void;
  onFactory?: () => void;
  onNearby?: () => void;
  onMachinery?: () => void;
  onHarvestShield?: () => void;
  onSeedVerify?: () => void;
  onKhata?: () => void;
  onActionCenter?: () => void;
}

export function Dashboard({
  farmer,
  onEdit,
  onSchemes,
  onBenefits,
  onLoss,
  onOpenAssistant,
  onDoctor,
  onMandi,
  onFertilizer,
  onStorage,
  onMachinery,
  onKhata,
  onActionCenter,
}: DashboardProps) {
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendRange, setTrendRange] = useState<"7D" | "1M" | "3M">("1M");
  const [selectedCrop, setSelectedCrop] = useState<string>(farmer.form.crop || "Paddy");

  const fetchTelemetry = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        state: farmer.form.state,
        district: farmer.form.district,
        crop: farmer.form.crop,
        season: farmer.form.season,
      });
      const [response, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/climate/risk?${query.toString()}`),
        fetch(`${API_BASE}/admin/broadcast-alerts`).catch(() => null),
      ]);
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.detail || "Unable to load weather telemetry");
      setClimate(body as ClimateData);
      if (alertsRes && alertsRes.ok) {
        const alertsData = await alertsRes.json().catch(() => null);
        if (alertsData?.alerts) setAlerts(alertsData.alerts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load weather telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [farmer.form.state, farmer.form.district, farmer.form.crop, farmer.form.season]);

  const scrollToWeather = () => {
    const el = document.getElementById("weather-station");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const relevantAlert = alerts.find(
    (a) =>
      (a.district.toLowerCase() === farmer.form.district.toLowerCase() ||
        a.district.toLowerCase() === "all" ||
        a.district.toLowerCase() === "statewide") &&
      (a.target_crop.toLowerCase() === farmer.form.crop.toLowerCase() ||
        a.target_crop.toLowerCase().includes("all"))
  ) || alerts[0];

  const risk = climate?.risk.level ?? "Normal";
  const riskBadge =
    risk === "High"
      ? { bg: "bg-red-50 text-red-800 border-red-200", label: "High Risk Alert" }
      : risk === "Moderate"
        ? { bg: "bg-amber-50 text-amber-900 border-amber-200", label: "Moderate Attention" }
        : { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", label: "Stable Conditions" };

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const greeting =
    farmer.form.language === "Telugu"
      ? `నమస్కారం, ${farmer.form.name}!`
      : farmer.form.language === "Hindi"
        ? `नमस्ते, ${farmer.form.name}!`
        : `${timeGreeting}, ${farmer.form.name || "Farmer"}!`;

  return (
    <div className="flex flex-col min-h-full space-y-6 p-4 sm:p-6 lg:p-8 bg-[#f8faf8]">
      {/* ── Official Government Advisory Banner from MAO ── */}
      {relevantAlert && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-xs flex items-start gap-3.5 animate-in slide-in-from-top duration-300">
          <div className="size-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Radio className="size-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-900 bg-red-200/80 px-2.5 py-0.5 rounded-full">
                🏛️ Department Advisory • {relevantAlert.issued_by}
              </span>
              <span className="text-[11px] text-red-600 font-bold">{relevantAlert.timestamp}</span>
            </div>
            <h3 className="text-sm font-black text-red-950 mt-1">{relevantAlert.title}</h3>
            <p className="text-xs text-red-900/90 mt-0.5 leading-relaxed">{relevantAlert.advisory}</p>
          </div>
        </div>
      )}

      {/* ── 1. Top Greeting Row (Matches Reference Design) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <span>👋</span> {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Let's grow together for a better tomorrow 🌱
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Location Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <MapPin className="size-3.5 text-emerald-700" />
            <span>{farmer.form.district}, {farmer.form.state}</span>
          </div>

          {/* Weather Chip */}
          <button
            onClick={scrollToWeather}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200/80 transition cursor-pointer"
          >
            <span>🌤️ {climate?.current.temperature_c ?? 28}°C {climate?.current.condition_text ?? "Partly Cloudy"}</span>
            <span className="text-emerald-700 font-black text-[11px]">View Details →</span>
          </button>

          {/* Quick Edit */}
          <button
            onClick={onEdit}
            className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            title="Edit Farm Profile"
          >
            <Edit3 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. Horizontal Row of 8 Feature Service Cards (Reference Design) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "My Crop", sub: "Manage farm", icon: Sprout, color: "text-emerald-700 bg-emerald-50 border-emerald-200", onClick: onEdit },
          { label: "Weather", sub: "Latest updates", icon: CloudRain, color: "text-sky-700 bg-sky-50 border-sky-200", onClick: scrollToWeather },
          { label: "Market Prices", sub: "Mandi rates", icon: TrendingUp, color: "text-amber-700 bg-amber-50 border-amber-200", onClick: onMandi },
          { label: "Crop Doctor", sub: "AI disease check", icon: Stethoscope, color: "text-teal-700 bg-teal-50 border-teal-200", onClick: onDoctor },
          { label: "Schemes", sub: "Govt subsidies", icon: Landmark, color: "text-indigo-700 bg-indigo-50 border-indigo-200", onClick: onSchemes },
          { label: "Crop Loss", sub: "72h PMFBY", icon: ShieldAlert, color: "text-rose-700 bg-rose-50 border-rose-200", onClick: onLoss },
          { label: "Machinery", sub: "Rent tractors", icon: Tractor, color: "text-emerald-800 bg-emerald-50 border-emerald-200", onClick: onMachinery },
          { label: "Storage", sub: "AC godowns", icon: Warehouse, color: "text-blue-700 bg-blue-50 border-blue-200", onClick: onStorage },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition text-left cursor-pointer group flex flex-col justify-between"
            >
              <div className={`size-10 rounded-2xl flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="size-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-black text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{item.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 3. Core 3-Column Intelligence Grid (Reference Design Desktop) ── */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* ── Column 1: My Farm Overview (4 Cols) ── */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Sprout className="size-4 text-emerald-700" />
                My Farm Overview
              </span>
              <button
                onClick={onEdit}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="size-3" />
              </button>
            </div>

            {/* Satellite Field Graphic */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200 mt-3 shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80"
                alt="Satellite field boundaries"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-emerald-950/20 pointer-events-none" />

              {/* Boundary Overlay Simulated Marker */}
              <div className="absolute top-2.5 left-2.5 bg-emerald-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                <MapPin className="size-3 text-emerald-400" />
                <span>{farmer.form.district}, AP • {farmer.form.village || "Active Cadastral"}</span>
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                <span>🛰️ GPS Calibrated</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-2">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-semibold">Total Area</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {farmer.form.land_area_acres || "5.2"} Acres
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-semibold">Current Crop</div>
                <div className="text-sm font-black text-slate-900 mt-0.5 truncate">
                  🌾 {farmer.form.crop || "Paddy"}
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-semibold">Growth Stage</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  Tillering
                </div>
              </div>
            </div>
          </div>

          {/* Growth Stage Progress Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Crop Season Progress ({farmer.form.season})</span>
              <span className="text-emerald-700 font-black">65%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2.5 rounded-full w-[65%]" />
            </div>
          </div>
        </div>

        {/* ── Column 2: Market Price Trends (5 Cols) ── */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-700" />
                <span className="text-sm font-black text-slate-900">Market Price Trends</span>
              </div>
              <button
                onClick={onMandi}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All Mandis</span>
                <ChevronRight className="size-3" />
              </button>
            </div>

            {/* Dropdown & Time Range Filter */}
            <div className="flex items-center justify-between gap-2 mt-3">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-emerald-600"
              >
                <option value="Paddy">Paddy (Common)</option>
                <option value="Cotton">Cotton (DCH-32)</option>
                <option value="Red Chilli">Red Chilli (Teja)</option>
                <option value="Maize">Maize (Hybrid)</option>
                <option value="Turmeric">Turmeric (Finger)</option>
              </select>

              <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[10px] font-black">
                {(["7D", "1M", "3M"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      trendRange === r ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Curve Chart (Matching Reference) */}
            <div className="relative pt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>₹2,400</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Peak Rate: ₹2,320 / qtl (Sep 24)
                </span>
              </div>

              <svg viewBox="0 0 350 110" className="w-full h-28 stroke-emerald-600 fill-emerald-50/70">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,90 Q 60,75 120,70 T 220,50 T 300,32 T 350,22 L 350,110 L 0,110 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0,90 Q 60,75 120,70 T 220,50 T 300,32 T 350,22"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="32" r="5" fill="#047857" stroke="#ffffff" strokeWidth="2.5" />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>Aug 27</span>
                <span>Sep 03</span>
                <span>Sep 10</span>
                <span>Sep 17</span>
                <span>Sep 24</span>
              </div>
            </div>
          </div>

          {/* 3 Real Comparison Pills */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center">
              <div className="text-[10px] text-slate-600 font-bold">Paddy</div>
              <div className="text-xs font-black text-emerald-900 mt-0.5">₹2,320/q</div>
              <div className="text-[9px] text-emerald-700 font-bold">▲ +2.5%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-600 font-bold">Maize</div>
              <div className="text-xs font-black text-slate-900 mt-0.5">₹2,225/q</div>
              <div className="text-[9px] text-emerald-600 font-bold">▲ +1.8%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-600 font-bold">Tur</div>
              <div className="text-xs font-black text-slate-900 mt-0.5">₹7,550/q</div>
              <div className="text-[9px] text-emerald-600 font-bold">▲ +0.9%</div>
            </div>
          </div>
        </div>

        {/* ── Column 3: 5-Day Weather & Recent Updates (3 Cols) ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* 5-Day Forecast Strip */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-black text-slate-900 mb-2.5 pb-1.5 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <CloudRain className="size-3.5 text-sky-600" />
                Weather Forecast
              </span>
              <button onClick={scrollToWeather} className="text-[10px] text-emerald-700 hover:underline">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { day: "Today", temp: "28°", icon: "🌤️", rain: "0%" },
                { day: "Mon", temp: "29°", icon: "☀️", rain: "0%" },
                { day: "Tue", temp: "30°", icon: "☀️", rain: "0%" },
                { day: "Wed", temp: "27°", icon: "🌧️", rain: "60%" },
                { day: "Thu", temp: "26°", icon: "⛈️", rain: "70%" },
              ].map((d, i) => (
                <div key={i} className="p-1 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-500">{d.day}</div>
                  <div className="text-base my-0.5">{d.icon}</div>
                  <div className="text-[11px] font-black text-slate-900">{d.temp}</div>
                  <div className="text-[8px] text-sky-700 font-bold">{d.rain}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-black text-slate-900 mb-2.5 pb-1.5 border-b border-slate-100">
              <span>Recent Updates</span>
              <span className="text-[10px] text-emerald-700 font-bold">Real-Time</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div
                onClick={onMandi}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition"
              >
                <div className="size-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="size-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 leading-tight">New market prices available</div>
                  <div className="text-[10px] text-slate-400">Today, 10:00 AM</div>
                </div>
              </div>

              <div
                onClick={scrollToWeather}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition"
              >
                <div className="size-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="size-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 leading-tight">Weather rain alert in your area</div>
                  <div className="text-[10px] text-slate-400">Today, 08:30 AM</div>
                </div>
              </div>

              <div
                onClick={onSchemes}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition"
              >
                <div className="size-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Landmark className="size-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 leading-tight">New scheme matches found</div>
                  <div className="text-[10px] text-slate-400">Yesterday, 05:20 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Full Live Meteorological Station ── */}
      <div id="weather-station" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CloudRain className="size-5 text-sky-600" />
            <h3 className="text-base font-black text-slate-900">Live Meteorological Doppler Station</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Radar Connected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!loading && !error && (
              <span className={`rounded-full px-3 py-1 text-xs font-black border ${riskBadge.bg}`}>
                {riskBadge.label}
              </span>
            )}
            <button
              onClick={fetchTelemetry}
              disabled={loading}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Refresh Radar"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {climate && (
          <div className="space-y-4">
            {/* Primary weather gradient strip */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-6 text-white shadow-md">
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-sky-100 uppercase tracking-wider mb-1">
                    Current Observation • {climate.current.time ? new Date(climate.current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live"}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black">{climate.current.temperature_c}°C</span>
                    <span className="text-3xl">{climate.current.icon || "⛅"}</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-sky-100">
                    {climate.current.condition_text || "Fair"}{" "}
                    <span className="text-sm font-normal text-sky-200">(Feels {climate.current.apparent_temperature_c}°C)</span>
                  </div>
                </div>

                <div className="text-xs text-sky-100 space-y-1 sm:text-right border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0">
                  <p>District: <strong className="text-white">{climate.location.name}</strong></p>
                  <p>Humidity: <strong className="text-white">{climate.current.humidity_percent}%</strong></p>
                  <p>Wind Speed: <strong className="text-white">{climate.current.wind_speed_kmh} km/h</strong></p>
                  <p>Today Rain Chance: <strong className="text-white">{climate.today_forecast.rain_probability_percent}%</strong></p>
                </div>
              </div>
            </div>

            {/* Agro Advisory box */}
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 flex items-start gap-3">
              <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sprout className="size-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  Agro-Advisory Recommendation ({farmer.form.crop})
                </h4>
                <p className="text-xs text-emerald-900 font-semibold mt-0.5 leading-relaxed">
                  {climate.risk.suggested_action}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Official Action Center Banner (If Available) ── */}
      {onActionCenter && (
        <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                Statutory Tracking
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">Official Action Center</h3>
              <p className="text-xs text-slate-600">
                Track PMFBY 72-hour deadlines, official government portals, and manage your personal claim reference numbers.
              </p>
            </div>
          </div>
          <button
            onClick={onActionCenter}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <span>Open Action Center</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}

      {/* ── 6. Full Agricultural Toolkit Cards ── */}
      <div>
        <h2 className="text-base font-black text-slate-900 mb-4">Complete Agricultural Toolkit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Landmark className="size-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-3">Scheme Navigator</h3>
              <p className="text-xs text-slate-500 mt-1">State and central welfare subsidies with document checklists.</p>
            </div>
            <button onClick={onSchemes} className="mt-4 w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1">
              <span>Explore Schemes</span><ArrowRight className="size-3" />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Calculator className="size-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-3">Benefit Estimator</h3>
              <p className="text-xs text-slate-500 mt-1">Simulate annual financial assistance math for your acres.</p>
            </div>
            <button onClick={onBenefits} className="mt-4 w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1">
              <span>Calculate Math</span><ArrowRight className="size-3" />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <FlaskConical className="size-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-3">Fertilizer Dosage NPK</h3>
              <p className="text-xs text-slate-500 mt-1">Urea, DAP, and Potash bag splits based on your soil type.</p>
            </div>
            <button onClick={onFertilizer} className="mt-4 w-full py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1">
              <span>Optimize Dosage</span><ArrowRight className="size-3" />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Calculator className="size-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-3">Digital Agri Khata</h3>
              <p className="text-xs text-slate-500 mt-1">Field expense tracker & breakeven price calculator per quintal.</p>
            </div>
            <button onClick={onKhata} className="mt-4 w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1">
              <span>Open Khata</span><ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 7. Krishi AI Assistant Banner ── */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Bot className="size-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              Multilingual Voice & Text Assistant
            </span>
            <h3 className="text-base font-black mt-0.5">Need instant clarity on rules or weather?</h3>
            <p className="text-xs text-emerald-200/80">
              Ask Krishi Assistant in English, తెలుగు, or हिन्दी with voice recognition.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition shrink-0 cursor-pointer"
        >
          <Bot className="size-4" />
          <span>Launch Krishi Assistant</span>
        </button>
      </div>
    </div>
  );
}