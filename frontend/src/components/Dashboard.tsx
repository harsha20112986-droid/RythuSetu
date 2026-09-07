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
  Sparkles,
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
} from "lucide-react";
import { type Farmer, type ClimateData, type BroadcastAlert, API_BASE } from "../types";

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
}: {
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
}) {
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

      if (!response.ok) {
        throw new Error(body?.detail || "Unable to load weather telemetry");
      }

      setClimate(body as ClimateData);

      if (alertsRes && alertsRes.ok) {
        const alertsData = await alertsRes.json().catch(() => null);
        if (alertsData && alertsData.alerts) {
          setAlerts(alertsData.alerts);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load weather telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [
    farmer.form.state,
    farmer.form.district,
    farmer.form.crop,
    farmer.form.season,
  ]);

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
        : `Namaste, ${farmer.form.name}!`;

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      {/* Official Government Advisory Banner from MAO */}
      {relevantAlert && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50/90 p-4 sm:p-5 shadow-sm flex items-start gap-4 animate-in slide-in-from-top duration-300">
          <div className="size-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Radio className="size-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-900 bg-red-200/80 px-2.5 py-0.5 rounded-full">
                🏛️ Official Department Advisory • {relevantAlert.issued_by}
              </span>
              <span className="text-[11px] text-red-600 font-bold">{relevantAlert.timestamp}</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-red-950 mt-1">
              {relevantAlert.title}
            </h3>
            <p className="text-xs text-red-900/90 mt-1 leading-relaxed">
              {relevantAlert.advisory}
            </p>
          </div>
        </div>
      )}

      {/* 1. Profile Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md mb-2">
            <Sparkles className="size-3 text-amber-300" />
            <span>Active Farm Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">{greeting}</h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100">
            Real-time advisory and support tailored for your {farmer.form.crop} farm in {farmer.form.district}, {farmer.form.state}.
          </p>

          {/* Profile metadata chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-xl bg-white/15 px-3 py-1 font-semibold text-white">
              Crop: {farmer.form.crop}
            </span>
            <span className="rounded-xl bg-white/15 px-3 py-1 font-semibold text-white">
              Land: {farmer.form.land_area_acres} Acres
            </span>
            <span className="rounded-xl bg-white/15 px-3 py-1 font-semibold text-white">
              Season: {farmer.form.season}
            </span>
            <span className="rounded-xl bg-white/15 px-3 py-1 font-semibold text-white">
              Location: {farmer.form.district}, {farmer.form.state}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white transition backdrop-blur-md cursor-pointer"
          >
            <Edit3 className="size-3.5" />
            <span>Edit Farm Details</span>
          </button>

          <button
            onClick={fetchTelemetry}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 px-4 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-700" : "text-emerald-900"}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. Live Weather Station Card */}
      <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <CloudRain className="size-4" />
                Live Meteorological Station
              </span>
              <span className="size-1 rounded-full bg-slate-300"></span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time Satellite Radar
              </span>
              {climate?.location && (
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" />
                  {climate.location.latitude.toFixed(2)}°N, {climate.location.longitude.toFixed(2)}°E
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {loading
                ? "Connecting to Weather Radar..."
                : error
                  ? "Weather Telemetry Unavailable"
                  : `${risk} Risk Index (${climate?.risk.score}/10)`}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {climate
                ? `Hyper-local telemetry for ${climate.location.name}, ${farmer.form.state}.`
                : "Fetching local meteorological metrics..."}
            </p>
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`rounded-full px-3.5 py-1.5 text-xs font-black border ${riskBadge.bg}`}>
                {riskBadge.label}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="size-6 animate-spin text-emerald-600" />
            <span className="text-sm font-medium">Fetching real-time district telemetry & computing agro-risk...</span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {climate && !loading && !error && (
          <div className="mt-6 space-y-6">
            {/* Google Weather Style Primary Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-6 sm:p-7 text-white shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-100 uppercase tracking-wider mb-1">
                    <span>Current Observation</span>
                    <span>•</span>
                    <span>{climate.current.time ? new Date(climate.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight">
                      {climate.current.temperature_c}°C
                    </span>
                    <span className="text-3xl sm:text-4xl" title={climate.current.condition_text || "Weather"}>
                      {climate.current.icon || "⛅"}
                    </span>
                  </div>
                  <div className="mt-2 text-lg font-bold text-sky-100 flex items-center gap-2">
                    <span>{climate.current.condition_text || "Fair Weather"}</span>
                    <span className="text-sm font-normal text-sky-200">
                      (Feels like {climate.current.apparent_temperature_c}°C)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-sky-100 font-medium flex items-center gap-3">
                    {climate.today_forecast.min_temperature_c !== undefined && (
                      <span>Min: <strong className="text-white">{climate.today_forecast.min_temperature_c}°C</strong></span>
                    )}
                    <span>Max: <strong className="text-white">{climate.today_forecast.max_temperature_c}°C</strong></span>
                    <span>•</span>
                    <span>Rain Chance: <strong className="text-white">{climate.today_forecast.rain_probability_percent}%</strong></span>
                  </div>
                </div>

                <div className="sm:text-right flex flex-col sm:items-end justify-center border-t sm:border-t-0 border-white/20 pt-4 sm:pt-0">
                  <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                    <MapPin className="size-3.5 text-sky-200" />
                    <span>{climate.location.name}</span>
                  </div>
                  <div className="mt-2 text-xs text-sky-200 space-y-0.5">
                    <p>Humidity: <strong className="text-white">{climate.current.humidity_percent}%</strong></p>
                    <p>Wind: <strong className="text-white">{climate.current.wind_speed_kmh} km/h</strong></p>
                    {climate.today_forecast.sunrise && (
                      <p className="text-[11px] opacity-80">
                        Sunrise {new Date(climate.today_forecast.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sunset {new Date(climate.today_forecast.sunset || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next 12 Hours Forecast Strip (Google Weather Style) */}
            {climate.hourly_forecast && climate.hourly_forecast.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-900">
                    <Clock className="size-3.5 text-sky-600" />
                    Hourly Forecast (Next 12 Hours)
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Scroll horizontally →</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {climate.hourly_forecast.map((h, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 w-20 flex flex-col items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center transition hover:border-sky-300 hover:shadow-xs"
                    >
                      <span className="text-[11px] font-bold text-slate-600">{idx === 0 ? "Now" : h.time}</span>
                      <span className="text-2xl my-1.5" title={h.condition_text}>
                        {h.icon}
                      </span>
                      <span className="text-xs font-black text-slate-900">{h.temperature_c}°</span>
                      {h.rain_probability_percent > 0 ? (
                        <span className="mt-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-full">
                          💧{h.rain_probability_percent}%
                        </span>
                      ) : (
                        <span className="mt-1 text-[10px] text-slate-400">0%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-Day Forecast Cards */}
            {climate.daily_forecast && climate.daily_forecast.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
                  <Calendar className="size-3.5 text-indigo-600" />
                  3-Day Outlook & Rainfall Probability
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {climate.daily_forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-900 block">{day.day_name}</span>
                          <span className="text-[11px] text-slate-500">{day.date}</span>
                        </div>
                        <span className="text-2xl" title={day.condition_text}>{day.icon}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600 font-semibold">{day.condition_text}</span>
                          <span className="font-black text-slate-900">
                            {day.min_temperature_c}° - {day.max_temperature_c}°C
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-sky-800 bg-sky-50/80 px-2.5 py-1 rounded-lg">
                          <span>Rain Chance: <strong>{day.rain_probability_percent}%</strong></span>
                          <span>Precip: <strong>{day.precipitation_sum_mm} mm</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metric Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricTile
                icon={<Thermometer className="size-4 text-amber-500" />}
                label="Temperature"
                value={`${climate.current.temperature_c}°C`}
                sub={`Feels ${climate.current.apparent_temperature_c}°C`}
              />
              <MetricTile
                icon={<CloudRain className="size-4 text-sky-500" />}
                label="Rain Probability"
                value={`${climate.today_forecast.rain_probability_percent}%`}
                sub="Today's chance"
              />
              <MetricTile
                icon={<Droplets className="size-4 text-blue-500" />}
                label="Precipitation"
                value={`${climate.today_forecast.precipitation_sum_mm} mm`}
                sub="Total volume"
              />
              <MetricTile
                icon={<Droplets className="size-4 text-emerald-500" />}
                label="Humidity"
                value={`${climate.current.humidity_percent}%`}
                sub="Relative air"
              />
              <MetricTile
                icon={<Wind className="size-4 text-indigo-500" />}
                label="Wind Speed"
                value={`${climate.current.wind_speed_kmh} km/h`}
                sub="Average flow"
              />
              <MetricTile
                icon={<Wind className="size-4 text-rose-500" />}
                label="Max Gust"
                value={`${climate.today_forecast.max_wind_gust_kmh} km/h`}
                sub="Peak burst"
              />
            </div>

            {/* Rain Probability Visual Bar */}
            <div className="rounded-2xl bg-sky-50/70 border border-sky-100 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="size-3.5 text-sky-600" />
                  Precipitation Likelihood Indicator
                </span>
                <span>{climate.today_forecast.rain_probability_percent}%</span>
              </div>
              <div className="w-full bg-sky-200/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, climate.today_forecast.rain_probability_percent)}%` }}
                />
              </div>
            </div>

            {/* Agro-Advisory Action Box */}
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shrink-0">
                  <Sprout className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950">
                    Agro-Advisory Recommendation ({farmer.form.crop})
                  </h4>
                  <p className="mt-1 text-xs text-emerald-900 font-semibold leading-relaxed">
                    {climate.risk.suggested_action}
                  </p>

                  {climate.risk.factors.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {climate.risk.factors.map((f, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-white border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
                        >
                          • {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Farmer Action Toolkit */}
      <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {/* Card 1: Schemes */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Landmark className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Government Schemes</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Explore matched Central and State schemes for {farmer.form.state} including PM-KISAN, Rythu Bharosa, and PMFBY.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onSchemes}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Browse Matched Schemes</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Benefits */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <Calculator className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Benefit Estimator</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Simulate annual assistance math based on your {farmer.form.land_area_acres} acres with transparent formulas.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onBenefits}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Calculate Payouts</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Crop Loss */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
              <ShieldAlert className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Crop Loss Desk</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Report weather or pest damage within the 72-hour PMFBY insurance intimation window and attach photos.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onLoss}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Report Damage</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
        {/* Card 4: AI Crop Doctor */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-700">
              <Sprout className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">AI Crop Doctor</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Upload leaf photos for automated pathology diagnosis, severity %, organic remedies, and PMFBY insurance coverage.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onDoctor}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Scan Crop Leaf</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 5: Toll-Free Helpline */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <PhoneCall className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">1800 Kisan Hotline</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Interactive voice phone hotline for farmers without smartphone or internet access (Telugu, Hindi, English).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenIvr}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Simulate Phone Call</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 6: Live Mandi & APMC Rates */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Building2 className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Mandi Market Rates</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Live e-NAM market arrivals across APMC yards, modal rate spreads against official MSP, and Sell vs Hold advisories.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onMandi}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>View Mandi Rates</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 7: Soil Health & Fertilizer Dosage */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-700">
              <FlaskConical className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Fertilizer Dosage NPK</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Calculate exact split dosages of Urea, DAP, and Potash tailored to your soil type and {farmer.form.land_area_acres} acres.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onFertilizer}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Optimize Dosage</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 8: Smart Crop Recommendation & POP */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <TrendingUp className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Crop Recommendation</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Find the most profitable crops to sow based on soil type, water source, and district with full POP & pesticide schedules.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onRecommendation}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Explore Crop Advisory</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 9: Cold Storages & AC Godowns */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700">
              <Warehouse className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">AC Godowns & Cold Chains</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Preserve chilli, cotton, and turmeric in CWC/private AC godowns. Access e-NWR pledge loans up to 75% to prevent distress selling.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onStorage}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Book Storage Bay</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card 10: Rythu Direct (Farm-to-Factory Zero Broker) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="grid size-12 place-items-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <Truck className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Rythu Direct (Factory Link)</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Sell directly to ginning mills, modern rice mills, and spice exporters at premium rates with 0% broker deductions and instant gate passes.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onFactory}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <span>Direct Mill Contracts</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Krishi AI Assistant Banner */}
      <div className="mt-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-green-950 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/10 text-white shrink-0">
            <Bot className="size-7 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
              Multilingual Voice & Text Assistant
            </span>
            <h3 className="text-xl font-black">Need instant clarity on rules or weather?</h3>
            <p className="text-xs text-emerald-200/90 mt-1">
              Ask Krishi Assistant in English, {"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"}, or {"\u0939\u093F\u0928\u094D\u0926\u0940"} with speech recognition.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-md transition shrink-0 cursor-pointer"
        >
          <Bot className="size-4" />
          <span>Launch Krishi Assistant</span>
        </button>
      </div>
    </section>
  );
}

function MetricTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}