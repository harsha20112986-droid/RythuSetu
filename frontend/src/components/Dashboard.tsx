import { useState, useEffect, type ReactNode } from "react";
import {
  Radio,
  PhoneCall,
  Bot,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Sprout,
  Landmark,
  Calculator,
  Edit3,
  Building2,
  FlaskConical,
  MapPin,
  Clock,
  Calendar,
  Warehouse,
  TrendingUp,
  Truck,
  Tractor,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { type Farmer, type ClimateData, type BroadcastAlert, API_BASE } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardProps {
  farmer: Farmer;
  onEdit: () => void;
  onSchemes: () => void;
  onBenefits: () => void;
  onLoss: () => void;
  onOpenAssistant: () => void;
  onDoctor: () => void;
  onOpenIvr: () => void;
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

// ─── Quick Action Card ────────────────────────────────────────────────────────

function QuickCard({
  icon,
  label,
  iconBg,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  iconBg: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
    >
      <div className={`size-12 rounded-2xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">{label}</span>
    </button>
  );
}

// ─── Stat Hero Card ───────────────────────────────────────────────────────────

function HeroStatCard({
  badge,
  value,
  sub,
  gradient,
  icon,
  onClick,
}: {
  badge: string;
  value: string;
  sub: string;
  gradient: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 min-w-[140px] rounded-2xl ${gradient} text-white p-4 text-left shadow-md overflow-hidden group hover:brightness-110 transition cursor-pointer`}
    >
      <div className="absolute right-3 top-3 opacity-30 group-hover:opacity-50 transition">{icon}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{badge}</div>
      <div className="text-2xl font-black leading-tight">{value}</div>
      <div className="text-[11px] opacity-80 mt-0.5">{sub}</div>
      <ChevronRight className="absolute bottom-3 right-3 size-3.5 opacity-60" />
    </button>
  );
}

// ─── Recent Update Row ────────────────────────────────────────────────────────

function UpdateRow({
  icon,
  iconBg,
  title,
  time,
  onClick,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer group text-left"
    >
      <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 truncate">{title}</div>
        <div className="text-[11px] text-slate-400">{time}</div>
      </div>
      <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-600 shrink-0 transition" />
    </button>
  );
}

// ─── Toolkit Card (full detail cards below quick actions) ─────────────────────

function ToolkitCard({
  icon,
  iconBg,
  title,
  desc,
  btnLabel,
  btnColor,
  onClick,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  btnLabel: string;
  btnColor: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className={`size-11 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <h3 className="mt-3 text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
      <button
        onClick={onClick}
        className={`mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer ${btnColor}`}
      >
        {btnLabel}
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Metric Tile ──────────────────────────────────────────────────────────────

function MetricTile({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function Dashboard({
  farmer,
  onEdit,
  onSchemes,
  onBenefits,
  onLoss,
  onOpenAssistant,
  onDoctor,
  onOpenIvr,
  onMandi,
  onFertilizer,
  onRecommendation,
  onStorage,
  onFactory,
  onNearby,
  onMachinery,
  onHarvestShield,
  onSeedVerify,
  onKhata,
  onActionCenter,
}: DashboardProps) {
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const greeting =
    farmer.form.language === "Telugu"
      ? `నమస్కారం, ${farmer.form.name}!`
      : farmer.form.language === "Hindi"
        ? `नमस्ते, ${farmer.form.name}!`
        : `Welcome, ${farmer.form.name}!`;

  return (
    <div className="flex flex-col min-h-full">
      {/* ─── Broadcast Alert Banner ───────────────────────────────────────── */}
      {relevantAlert && (
        <div className="mx-4 lg:mx-6 mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <div className="size-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <Radio className="size-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-900 bg-red-200/80 px-2 py-0.5 rounded-full">
                🏛️ Advisory • {relevantAlert.issued_by}
              </span>
              <span className="text-[11px] text-red-600 font-bold">{relevantAlert.timestamp}</span>
            </div>
            <h3 className="text-sm font-black text-red-950 mt-0.5">{relevantAlert.title}</h3>
            <p className="text-xs text-red-900/90 mt-0.5 line-clamp-2">{relevantAlert.advisory}</p>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 lg:p-6 space-y-5">

        {/* ── Welcome Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900">{greeting}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Let's grow together 🌱</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={fetchTelemetry}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition cursor-pointer shadow-sm"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-sm"
            >
              <Edit3 className="size-3.5" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* ── Hero Stat Cards (Current Crop / Weather / Market Price) ── */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {/* Current Crop card */}
          <HeroStatCard
            badge="Current Crop"
            value={farmer.form.crop}
            sub={loading ? "Loading…" : risk === "High" ? "⚠️ High Risk" : risk === "Moderate" ? "⚡ Moderate Risk" : "✅ Healthy"}
            gradient="bg-gradient-to-br from-emerald-500 to-green-700"
            icon={<Sprout className="size-10" />}
            onClick={onRecommendation}
          />
          {/* Weather card */}
          <HeroStatCard
            badge="Weather"
            value={
              loading
                ? "..."
                : error
                  ? "N/A"
                  : `${climate?.current.temperature_c ?? "--"}°C`
            }
            sub={
              loading
                ? "Fetching..."
                : error
                  ? "Unavailable"
                  : climate?.current.condition_text ?? "Fair Weather"
            }
            gradient="bg-gradient-to-br from-sky-400 to-blue-600"
            icon={<CloudRain className="size-10" />}
            onClick={fetchTelemetry}
          />
          {/* Market Price card */}
          <HeroStatCard
            badge="Market Price"
            value={`₹${climate ? "2,320" : "--"}/q`}
            sub={
              climate
                ? "↑ +2.5% vs last week"
                : loading
                  ? "Loading..."
                  : "Check Mandi"
            }
            gradient="bg-gradient-to-br from-amber-400 to-orange-600"
            icon={<TrendingUp className="size-10" />}
            onClick={onMandi}
          />
        </div>

        {/* ── Profile meta chips ── */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: `🌾 ${farmer.form.crop}` },
            { label: `📐 ${farmer.form.land_area_acres} Acres` },
            { label: `📅 ${farmer.form.season}` },
            { label: `📍 ${farmer.form.district}, ${farmer.form.state}` },
          ].map((chip) => (
            <span key={chip.label} className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              {chip.label}
            </span>
          ))}
          {!loading && !error && (
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${riskBadge.bg}`}>
              {riskBadge.label}
            </span>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-sm font-black text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
            <QuickCard
              label="Crop Advisory"
              icon={<Sprout className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-100"
              onClick={onRecommendation}
            />
            <QuickCard
              label="Market Prices"
              icon={<TrendingUp className="size-5 text-amber-700" />}
              iconBg="bg-amber-100"
              onClick={onMandi}
            />
            <QuickCard
              label="Schemes"
              icon={<Landmark className="size-5 text-indigo-700" />}
              iconBg="bg-indigo-100"
              onClick={onSchemes}
            />
            <QuickCard
              label="Crop Loss"
              icon={<ShieldAlert className="size-5 text-rose-700" />}
              iconBg="bg-rose-100"
              onClick={onLoss}
            />
            <QuickCard
              label="Crop Doctor"
              icon={<Stethoscope className="size-5 text-teal-700" />}
              iconBg="bg-teal-100"
              onClick={onDoctor}
            />
            <QuickCard
              label="Machinery"
              icon={<Tractor className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              onClick={onMachinery}
            />
            <QuickCard
              label="Storage"
              icon={<Warehouse className="size-5 text-sky-700" />}
              iconBg="bg-sky-100"
              onClick={onStorage}
            />
            <QuickCard
              label="Agri Khata"
              icon={<Calculator className="size-5 text-violet-700" />}
              iconBg="bg-violet-100"
              onClick={onKhata}
            />
          </div>
        </div>

        {/* ── Recent Updates ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Recent Updates</h2>
            <button onClick={onMandi} className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
              View all →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            <UpdateRow
              icon={<TrendingUp className="size-4 text-amber-600" />}
              iconBg="bg-amber-50"
              title={`New mandi prices available for ${farmer.form.crop}`}
              time={`Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              onClick={onMandi}
            />
            {!loading && !error && climate && (
              <UpdateRow
                icon={<CloudRain className="size-4 text-sky-600" />}
                iconBg="bg-sky-50"
                title={`Weather: ${climate.current.condition_text ?? "Fair"} — ${climate.current.temperature_c}°C in ${farmer.form.district}`}
                time="Live update"
                onClick={fetchTelemetry}
              />
            )}
            <UpdateRow
              icon={<Landmark className="size-4 text-indigo-600" />}
              iconBg="bg-indigo-50"
              title="PM-KISAN: Check eligibility and apply via official portal"
              time="Scheme Navigator updated"
              onClick={onSchemes}
            />
            {onActionCenter && (
              <UpdateRow
                icon={<ShieldCheck className="size-4 text-emerald-600" />}
                iconBg="bg-emerald-50"
                title="Official Action Center: Track PMFBY reference numbers"
                time="Action Center ready"
                onClick={onActionCenter}
              />
            )}
          </div>
          <div className="h-2" />
        </div>

        {/* ── Live Weather Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CloudRain className="size-4 text-sky-600" />
              <span className="text-sm font-black text-slate-900">Live Meteorological Station</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            {!loading && !error && (
              <span className={`rounded-full px-3 py-1 text-xs font-black border ${riskBadge.bg}`}>
                {riskBadge.label}
              </span>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-3 py-6 justify-center text-slate-500">
              <RefreshCw className="size-5 animate-spin text-emerald-600" />
              <span className="text-sm">Fetching weather data…</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2 text-xs text-red-700">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {climate && !loading && !error && (
            <div className="space-y-4">
              {/* Primary weather strip */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-5 text-white shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-sky-100 uppercase tracking-wider mb-1">
                      Current Observation • {climate.current.time ? new Date(climate.current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live"}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black">{climate.current.temperature_c}°C</span>
                      <span className="text-3xl" title={climate.current.condition_text}>{climate.current.icon || "⛅"}</span>
                    </div>
                    <div className="mt-1 text-base font-bold text-sky-100">
                      {climate.current.condition_text || "Fair"}{" "}
                      <span className="text-sm font-normal text-sky-200">(Feels {climate.current.apparent_temperature_c}°C)</span>
                    </div>
                    <div className="mt-1 text-xs text-sky-100 flex gap-3">
                      <span>Max: <strong>{climate.today_forecast.max_temperature_c}°C</strong></span>
                      <span>•</span>
                      <span>Rain: <strong>{climate.today_forecast.rain_probability_percent}%</strong></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-sky-200 border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0">
                    <div className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-white/20">
                      <MapPin className="size-3 text-sky-200" />
                      {climate.location.name}
                    </div>
                    <p>Humidity: <strong className="text-white">{climate.current.humidity_percent}%</strong></p>
                    <p>Wind: <strong className="text-white">{climate.current.wind_speed_kmh} km/h</strong></p>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast Strip */}
              {climate.hourly_forecast && climate.hourly_forecast.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-sky-600" /> Hourly Forecast</span>
                    <span className="text-[10px] text-slate-400">Scroll →</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {climate.hourly_forecast.map((h, idx) => (
                      <div
                        key={idx}
                        className="shrink-0 w-16 flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200/80 text-center"
                      >
                        <span className="text-[10px] font-bold text-slate-600">{idx === 0 ? "Now" : h.time}</span>
                        <span className="text-xl my-1">{h.icon}</span>
                        <span className="text-xs font-black text-slate-900">{h.temperature_c}°</span>
                        {h.rain_probability_percent > 0 ? (
                          <span className="mt-0.5 text-[9px] font-bold text-sky-700 bg-sky-50 px-1 rounded-full">
                            💧{h.rain_probability_percent}%
                          </span>
                        ) : (
                          <span className="mt-0.5 text-[9px] text-slate-300">0%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3-Day Forecast */}
              {climate.daily_forecast && climate.daily_forecast.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                    <Calendar className="size-3.5 text-indigo-600" /> 3-Day Outlook
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {climate.daily_forecast.map((day, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-black text-slate-900 block">{day.day_name}</span>
                            <span className="text-[10px] text-slate-500">{day.date}</span>
                          </div>
                          <span className="text-xl">{day.icon}</span>
                        </div>
                        <div className="mt-2 text-xs flex items-center justify-between">
                          <span className="text-slate-600 font-semibold">{day.condition_text}</span>
                          <span className="font-black text-slate-900">{day.min_temperature_c}° – {day.max_temperature_c}°C</span>
                        </div>
                        <div className="mt-1 text-[10px] text-sky-800 bg-sky-50 px-2 py-1 rounded-lg flex justify-between">
                          <span>Rain: <strong>{day.rain_probability_percent}%</strong></span>
                          <span>{day.precipitation_sum_mm}mm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metric Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <MetricTile icon={<Thermometer className="size-4 text-amber-500" />} label="Temperature" value={`${climate.current.temperature_c}°C`} sub={`Feels ${climate.current.apparent_temperature_c}°C`} />
                <MetricTile icon={<CloudRain className="size-4 text-sky-500" />} label="Rain Prob." value={`${climate.today_forecast.rain_probability_percent}%`} sub="Today's chance" />
                <MetricTile icon={<Droplets className="size-4 text-blue-500" />} label="Precipitation" value={`${climate.today_forecast.precipitation_sum_mm}mm`} sub="Total volume" />
                <MetricTile icon={<Droplets className="size-4 text-emerald-500" />} label="Humidity" value={`${climate.current.humidity_percent}%`} sub="Relative air" />
                <MetricTile icon={<Wind className="size-4 text-indigo-500" />} label="Wind Speed" value={`${climate.current.wind_speed_kmh}km/h`} sub="Average flow" />
                <MetricTile icon={<Wind className="size-4 text-rose-500" />} label="Max Gust" value={`${climate.today_forecast.max_wind_gust_kmh}km/h`} sub="Peak burst" />
              </div>

              {/* Rain bar */}
              <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-3">
                <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
                  <span className="flex items-center gap-1.5"><CloudRain className="size-3.5 text-sky-600" /> Precipitation Likelihood</span>
                  <span>{climate.today_forecast.rain_probability_percent}%</span>
                </div>
                <div className="w-full bg-sky-200/60 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, climate.today_forecast.rain_probability_percent)}%` }} />
                </div>
              </div>

              {/* Agro advisory */}
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sprout className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950">Agro-Advisory ({farmer.form.crop})</h4>
                    <p className="mt-1 text-xs text-emerald-900 font-semibold leading-relaxed">{climate.risk.suggested_action}</p>
                    {climate.risk.factors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {climate.risk.factors.map((f, idx) => (
                          <span key={idx} className="rounded-lg bg-white border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">• {f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Full Toolkit Grid ── */}
        <div>
          <h2 className="text-sm font-black text-slate-900 mb-3">Farmer Toolkit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ToolkitCard
              icon={<Landmark className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              title="Scheme Navigator"
              desc={`Match potential Central & State schemes for ${farmer.form.state}. Check eligibility criteria and apply via official portals.`}
              btnLabel="Explore Schemes"
              btnColor="bg-emerald-700 hover:bg-emerald-800"
              onClick={onSchemes}
            />
            <ToolkitCard
              icon={<Calculator className="size-5 text-amber-700" />}
              iconBg="bg-amber-50 border border-amber-200"
              title="Benefit Estimator"
              desc={`Simulate annual assistance math based on your ${farmer.form.land_area_acres} acres with transparent formulas.`}
              btnLabel="Calculate Payouts"
              btnColor="bg-amber-600 hover:bg-amber-700"
              onClick={onBenefits}
            />
            <ToolkitCard
              icon={<ShieldAlert className="size-5 text-rose-700" />}
              iconBg="bg-rose-50 border border-rose-200"
              title="Crop Loss Assistant"
              desc="Prepare statutory 72-hour PMFBY intimation dossiers, check completeness, and route to official helplines (14447)."
              btnLabel="Prepare Loss Pack"
              btnColor="bg-rose-600 hover:bg-rose-700"
              onClick={onLoss}
            />
            {onActionCenter && (
              <ToolkitCard
                icon={<ShieldCheck className="size-5 text-indigo-700" />}
                iconBg="bg-indigo-50 border border-indigo-200"
                title="Official Action Center"
                desc="Track statutory deadlines, official portals (PMFBY, PM-KISAN) and manage self-recorded claim reference numbers."
                btnLabel="Open Action Center"
                btnColor="bg-indigo-700 hover:bg-indigo-800"
                onClick={onActionCenter}
              />
            )}
            <ToolkitCard
              icon={<Stethoscope className="size-5 text-teal-700" />}
              iconBg="bg-teal-50 border border-teal-200"
              title="AI Crop Doctor"
              desc="Upload leaf photos for automated pathology diagnosis, severity %, organic remedies and PMFBY insurance coverage."
              btnLabel="Scan Crop Leaf"
              btnColor="bg-teal-700 hover:bg-teal-800"
              onClick={onDoctor}
            />
            <ToolkitCard
              icon={<PhoneCall className="size-5 text-indigo-700" />}
              iconBg="bg-indigo-50 border border-indigo-200"
              title="1800 Kisan Hotline"
              desc="Interactive voice phone hotline for farmers without smartphone or internet access (Telugu, Hindi, English)."
              btnLabel="Simulate Phone Call"
              btnColor="bg-indigo-700 hover:bg-indigo-800"
              onClick={onOpenIvr}
            />
            <ToolkitCard
              icon={<Building2 className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              title="Mandi Market Rates"
              desc={`Live e-NAM market arrivals across APMC yards, modal rate spreads against official MSP and Sell vs Hold advisories.`}
              btnLabel="View Mandi Rates"
              btnColor="bg-emerald-800 hover:bg-emerald-900"
              onClick={onMandi}
            />
            <ToolkitCard
              icon={<FlaskConical className="size-5 text-teal-700" />}
              iconBg="bg-teal-50 border border-teal-200"
              title="Fertilizer Dosage NPK"
              desc={`Calculate exact split dosages of Urea, DAP, and Potash tailored to your soil type and ${farmer.form.land_area_acres} acres.`}
              btnLabel="Optimize Dosage"
              btnColor="bg-teal-700 hover:bg-teal-800"
              onClick={onFertilizer}
            />
            <ToolkitCard
              icon={<TrendingUp className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              title="Crop Recommendation"
              desc="Find the most profitable crops to sow based on soil type, water source and district with full POP & pesticide schedules."
              btnLabel="Explore Crop Advisory"
              btnColor="bg-emerald-700 hover:bg-emerald-800"
              onClick={onRecommendation}
            />
            <ToolkitCard
              icon={<Warehouse className="size-5 text-cyan-700" />}
              iconBg="bg-cyan-50 border border-cyan-200"
              title="AC Godowns & Cold Chains"
              desc="Preserve chilli, cotton and turmeric in CWC/private AC godowns. Access e-NWR pledge loans up to 75%."
              btnLabel="Book Storage Bay"
              btnColor="bg-cyan-700 hover:bg-cyan-800"
              onClick={onStorage}
            />
            <ToolkitCard
              icon={<Truck className="size-5 text-amber-700" />}
              iconBg="bg-amber-50 border border-amber-200"
              title="Rythu Direct (Factory Link)"
              desc="Sell directly to ginning mills, modern rice mills and spice exporters at premium rates with 0% broker deductions."
              btnLabel="Direct Mill Contracts"
              btnColor="bg-amber-600 hover:bg-amber-700"
              onClick={onFactory}
            />
            <ToolkitCard
              icon={<MapPin className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              title="Nearby Mandis, Mills & Godowns"
              desc={`Find verified APMC yards, direct cotton/paddy mills and AC cold storages sorted by distance from ${farmer.form.district}.`}
              btnLabel="Explore Nearby Hub 📍"
              btnColor="bg-emerald-800 hover:bg-emerald-900"
              onClick={onNearby}
            />
            <ToolkitCard
              icon={<Tractor className="size-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border border-emerald-200"
              title="Farm Machinery & Drones"
              desc="Rent 45HP tractors, 10L foliar spray drones (@ ₹380/acre) and track harvesters at official CHC rates."
              btnLabel="Rent Machinery & Drones"
              btnColor="bg-emerald-700 hover:bg-emerald-800"
              onClick={onMachinery}
            />
            <ToolkitCard
              icon={<CloudRain className="size-5 text-amber-700" />}
              iconBg="bg-amber-50 border border-amber-200"
              title="Harvest Weather Shield"
              desc="36-hour rain danger forecast for drying yards (కల్లాలు) and directory of nearby heavy tarpaulin sheet rentals."
              btnLabel="Drying Yard Shield"
              btnColor="bg-amber-600 hover:bg-amber-700"
              onClick={onHarvestShield}
            />
            <ToolkitCard
              icon={<ShieldCheck className="size-5 text-teal-700" />}
              iconBg="bg-teal-50 border border-teal-200"
              title="Seed Batch Authenticity"
              desc="Verify pouch lot numbers against APSCA/TSSOCA registries. Check lab germination % and file grievances."
              btnLabel="Verify Seed Lot"
              btnColor="bg-teal-700 hover:bg-teal-800"
              onClick={onSeedVerify}
            />
            <ToolkitCard
              icon={<Calculator className="size-5 text-indigo-700" />}
              iconBg="bg-indigo-50 border border-indigo-200"
              title="Digital Agri Khata"
              desc="Input field expenses to compute true cultivation cost per acre and breakeven selling price to prevent distress sales."
              btnLabel="Breakeven Calculator"
              btnColor="bg-indigo-700 hover:bg-indigo-800"
              onClick={onKhata}
            />
          </div>
        </div>

        {/* ── Krishi AI Assistant Banner ── */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="size-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                Multilingual Voice & Text Assistant
              </span>
              <h3 className="text-base font-black mt-0.5">Need instant clarity on rules or weather?</h3>
              <p className="text-xs text-emerald-200/90">
                Ask Krishi Assistant in English, తెలుగు, or हिन्दी with speech recognition.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAssistant}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition shrink-0 cursor-pointer"
          >
            <Bot className="size-4" />
            <span>Launch Krishi Assistant</span>
          </button>
        </div>

        {/* Bottom spacer for mobile bottom nav */}
        <div className="h-4 sm:h-2" />
      </div>
    </div>
  );
}