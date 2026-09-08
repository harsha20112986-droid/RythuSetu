import { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Warehouse,
  Truck,
  Phone,
  Navigation,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  FileCheck2,
  Coins,
} from "lucide-react";
import {
  type Farmer,
  type NearbyHubData,
  type NearbyMandiItem,
  type NearbyMillItem,
  type NearbyGodownItem,
  API_BASE,
  ALL_STATES,
  getDistrictsForState,
} from "../types";
import { getTranslation } from "../utils/translations";

export function NearbyAgroHub({
  farmer,
  onBack,
  onNavigateToMandi,
  onNavigateToStorage,
  onNavigateToFactory,
  language = "English",
}: {
  farmer: Farmer | null;
  onBack: () => void;
  onNavigateToMandi: () => void;
  onNavigateToStorage: () => void;
  onNavigateToFactory: () => void;
  language?: string;
}) {
  const t = getTranslation(language);
  const [state, setState] = useState(farmer?.form.state || "Andhra Pradesh");
  const [district, setDistrict] = useState(farmer?.form.district || "Guntur");
  const [crop, setCrop] = useState(farmer?.form.crop || "Red Chilli");
  const [activeTab, setActiveTab] = useState<"all" | "mills" | "mandis" | "godowns">("all");
  const [maxDistance, setMaxDistance] = useState<number>(100);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<NearbyHubData | null>(null);

  const availableDistricts = getDistrictsForState(state);

  const fetchNearbyData = async (st: string, dt: string, cr: string, dist: number) => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/nearby/hub?state=${encodeURIComponent(st)}&district=${encodeURIComponent(dt)}&crop=${encodeURIComponent(cr)}&max_distance_km=${dist}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch nearby infrastructure data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error connecting to location engine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyData(state, district, crop, maxDistance);
  }, [state, district, crop, maxDistance]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
            <Sparkles className="size-3.5 text-amber-300" />
            Hyperlocal Infrastructure Intelligence
          </span>
          <span className="size-1 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-200">Google Maps + Official APMC/WDRA Verification</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-black">
          {t.nearbyHeading}
        </h1>
        <p className="mt-2 text-sm text-emerald-100 max-w-3xl leading-relaxed">
          {t.nearbySubtitle}
        </p>

        {/* Dynamic Location Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md text-xs">
          <span className="font-bold text-emerald-300 flex items-center gap-1">
            <MapPin className="size-3.5" />
            Your Farm Hub:
          </span>
          <select
            value={state}
            onChange={(e) => {
              const nextState = e.target.value;
              setState(nextState);
              const nextDistricts = getDistrictsForState(nextState);
              if (nextDistricts[0]) setDistrict(nextDistricts[0]);
            }}
            className="bg-emerald-950/80 text-white rounded-xl px-2.5 py-1 font-bold border border-emerald-500/40 outline-none cursor-pointer"
          >
            {ALL_STATES.map((st) => (
              <option key={st} value={st} className="bg-slate-900">
                {st}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-emerald-950/80 text-white rounded-xl px-2.5 py-1 font-bold border border-emerald-500/40 outline-none cursor-pointer"
          >
            {availableDistricts.map((d) => (
              <option key={d} value={d} className="bg-slate-900">
                {d}
              </option>
            ))}
          </select>

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="bg-emerald-950/80 text-white rounded-xl px-2.5 py-1 font-bold border border-emerald-500/40 outline-none cursor-pointer"
          >
            {["Red Chilli", "Cotton", "Paddy / Rice", "Turmeric", "Maize", "Groundnut"].map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                Crop: {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-emerald-200">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-emerald-950/80 text-white rounded-xl px-2.5 py-1 font-bold border border-emerald-500/40 outline-none cursor-pointer"
            >
              <option value={25} className="bg-slate-900">Within 25 km</option>
              <option value={50} className="bg-slate-900">Within 50 km</option>
              <option value={100} className="bg-slate-900">Within 100 km</option>
              <option value={200} className="bg-slate-900">Within 200 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      {data?.summary && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Nearest Mandi */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-sky-800">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-sky-600" />
                Nearest APMC Mandi
              </span>
              {data.summary.nearest_mandi && (
                <span className="rounded-full bg-sky-200/80 text-sky-950 px-2 py-0.5 text-[10px]">
                  {data.summary.nearest_mandi.distance_km} km away
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-black text-slate-900 leading-tight truncate">
              {data.summary.nearest_mandi?.name || "Regional APMC Yard"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {data.summary.nearest_mandi?.location || "Market Corridor"}
            </p>
          </div>

          {/* Nearest Direct Mill */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Truck className="size-4 text-amber-600" />
                Nearest Direct Mill (Zero Broker)
              </span>
              {data.summary.nearest_mill && (
                <span className="rounded-full bg-amber-200/80 text-amber-950 px-2 py-0.5 text-[10px]">
                  {data.summary.nearest_mill.distance_km} km away
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-black text-slate-900 leading-tight truncate">
              {data.summary.nearest_mill?.name || "Processing Complex"}
            </p>
            <p className="text-[11px] text-emerald-800 font-bold mt-1 truncate">
              {data.summary.nearest_mill ? `Offers ₹${data.summary.nearest_mill.direct_offer_price_qtl}/qtl (+₹${data.summary.nearest_mill.extra_profit_per_qtl} bonus)` : "Zero Broker Savings"}
            </p>
          </div>

          {/* Nearest Cold Storage */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Warehouse className="size-4 text-teal-600" />
                Nearest AC Godown
              </span>
              {data.summary.nearest_cold_storage && (
                <span className="rounded-full bg-teal-200/80 text-teal-950 px-2 py-0.5 text-[10px]">
                  {data.summary.nearest_cold_storage.distance_km} km away
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-black text-slate-900 leading-tight truncate">
              {data.summary.nearest_cold_storage?.name || "CWC/SWC Cold Storage"}
            </p>
            <p className="text-[11px] text-teal-800 font-bold mt-1 truncate">
              {data.summary.nearest_cold_storage ? `Rent: ₹${data.summary.nearest_cold_storage.monthly_rent_per_bag}/bag • 75% e-NWR Loan` : "e-NWR Accredited"}
            </p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === "all"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t.nearbyAllTab} ({((data?.nearby_mandis.length || 0) + (data?.nearby_mills.length || 0) + (data?.nearby_cold_storages.length || 0))})
        </button>

        <button
          onClick={() => setActiveTab("mills")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "mills"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Truck className="size-3.5" />
          <span>{t.nearbyMillsTab} ({data?.nearby_mills.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("mandis")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "mandis"
              ? "bg-sky-700 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 className="size-3.5" />
          <span>{t.nearbyMandisTab} ({data?.nearby_mandis.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("godowns")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "godowns"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Warehouse className="size-3.5" />
          <span>{t.nearbyGodownsTab} ({data?.nearby_cold_storages.length || 0})</span>
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center">
          <RefreshCw className="size-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-sm font-bold">Scanning nearest agricultural infrastructure for {district}...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && data && (
        <div className="mt-6 space-y-8">
          {/* SECTION 1: DIRECT PURCHASE MILLS & FACTORIES */}
          {(activeTab === "all" || activeTab === "mills") && data.nearby_mills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-amber-100 text-amber-800">
                    <Truck className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Nearby Direct Processing Mills (Zero Broker)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Bypass middlemen commission agents. Sell directly at factory gate at guaranteed rates.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToFactory}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Open Full Mill Registry</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.nearby_mills.map((mill) => (
                  <MillCard key={mill.id} mill={mill} onPass={onNavigateToFactory} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: APMC AUCTION MANDIS */}
          {(activeTab === "all" || activeTab === "mandis") && data.nearby_mandis.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-sky-100 text-sky-800">
                    <Building2 className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Nearby APMC Market Yards & e-NAM Corridors
                    </h2>
                    <p className="text-xs text-slate-500">
                      Regulated auction platforms with certified digital weighbridges and electronic trade slips.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToMandi}
                  className="text-xs font-bold text-sky-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View Today's Mandi Rates</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.nearby_mandis.map((mandi) => (
                  <MandiCard key={mandi.id} mandi={mandi} onViewRates={onNavigateToMandi} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: AC GODOWNS & COLD STORAGES */}
          {(activeTab === "all" || activeTab === "godowns") && data.nearby_cold_storages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-teal-100 text-teal-800">
                    <Warehouse className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Nearby Climate-Controlled AC Godowns & Cold Stores
                    </h2>
                    <p className="text-xs text-slate-500">
                      Preserve harvested chilli, turmeric, and cotton. Access e-NWR bank loans up to 75% value.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToStorage}
                  className="text-xs font-bold text-teal-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Book Cold Storage Bay</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.nearby_cold_storages.map((godown) => (
                  <GodownCard key={godown.id} godown={godown} onBook={onNavigateToStorage} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MillCard({ mill, onPass }: { mill: NearbyMillItem; onPass: () => void }) {
  return (
    <div className="rounded-3xl border border-amber-200/90 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
            mill.distance_km < 15
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-amber-100 text-amber-900"
          }`}>
            📍 {mill.distance_km} km away
          </span>
          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[140px]">
            {mill.category}
          </span>
        </div>

        <h3 className="mt-2 text-base font-black text-slate-900 leading-tight">
          {mill.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{mill.location}</span>
        </p>

        {/* Pricing Comparison Box */}
        <div className="mt-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-amber-900">Direct Purchase Offer:</span>
            <span className="text-base font-black text-amber-950">
              ₹{mill.direct_offer_price_qtl.toLocaleString("en-IN")}/qtl
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Mandi Benchmark: ₹{mill.mandi_benchmark_price_qtl.toLocaleString("en-IN")}</span>
            <span className="text-emerald-700 font-extrabold bg-white px-2 py-0.5 rounded-md border border-emerald-300">
              +₹{mill.extra_profit_per_qtl} extra
            </span>
          </div>
          <p className="mt-1.5 text-[10px] text-emerald-900 font-semibold border-t border-amber-200/60 pt-1">
            ✓ {mill.broker_commission_saved}
          </p>
        </div>

        <p className="mt-2 text-[11px] text-slate-600 line-clamp-2">
          <strong>Specs:</strong> {mill.quality_specs}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <a
            href={mill.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 text-xs font-bold transition"
            title="Open in Google Maps"
          >
            <Navigation className="size-3.5 text-sky-600" />
            <span>Google Maps</span>
          </a>

          <a
            href={`tel:${mill.phone}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 text-xs font-bold transition"
            title="Call Procurement Desk"
          >
            <Phone className="size-3.5 text-emerald-600" />
            <span>Call</span>
          </a>
        </div>

        <button
          onClick={onPass}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
        >
          <FileCheck2 className="size-3.5" />
          <span>Get Factory Entry Delivery Pass</span>
        </button>
      </div>
    </div>
  );
}

function MandiCard({ mandi, onViewRates }: { mandi: NearbyMandiItem; onViewRates: () => void }) {
  return (
    <div className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
            mandi.distance_km < 15
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-sky-100 text-sky-900"
          }`}>
            📍 {mandi.distance_km} km away
          </span>
          {mandi.enam_enabled && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              e-NAM Live
            </span>
          )}
        </div>

        <h3 className="mt-2 text-base font-black text-slate-900 leading-tight">
          {mandi.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{mandi.location}</span>
        </p>

        <div className="mt-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Daily Arrivals:</span>
            <span className="font-bold text-slate-900">{mandi.daily_arrivals_qtl.toLocaleString("en-IN")} Quintals</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Auction Hours:</span>
            <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]">{mandi.timing}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Weighbridge:</span>
            <span className="font-semibold text-emerald-800 text-[10px]">{mandi.weighbridge_type}</span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {mandi.major_commodities.map((c, i) => (
            <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <a
            href={mandi.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 text-xs font-bold transition"
            title="Open in Google Maps"
          >
            <Navigation className="size-3.5 text-sky-600" />
            <span>Google Maps</span>
          </a>

          <a
            href={`tel:${mandi.phone}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 text-xs font-bold transition"
            title="Call APMC Helpdesk"
          >
            <Phone className="size-3.5 text-emerald-600" />
            <span>Call</span>
          </a>
        </div>

        <button
          onClick={onViewRates}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
        >
          <Coins className="size-3.5" />
          <span>View Today's e-NAM Auction Rates</span>
        </button>
      </div>
    </div>
  );
}

function GodownCard({ godown, onBook }: { godown: NearbyGodownItem; onBook: () => void }) {
  return (
    <div className="rounded-3xl border border-teal-200/90 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
            godown.distance_km < 15
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-teal-100 text-teal-900"
          }`}>
            📍 {godown.distance_km} km away
          </span>
          {godown.enwr_pledge_loan && (
            <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
              75% e-NWR Loan
            </span>
          )}
        </div>

        <h3 className="mt-2 text-base font-black text-slate-900 leading-tight">
          {godown.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{godown.location}</span>
        </p>

        <div className="mt-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Monthly Rent:</span>
            <span className="font-black text-teal-950 text-sm">₹{godown.monthly_rent_per_bag} / bag</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Free Space:</span>
            <span className="font-bold text-emerald-800">{godown.available_space_mt.toLocaleString("en-IN")} MT / {godown.capacity_mt.toLocaleString("en-IN")} MT</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Climate Control:</span>
            <span className="font-semibold text-slate-800 text-[11px]">{godown.temp_range} • {godown.humidity_rh}</span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {godown.commodities.map((c, i) => (
            <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <a
            href={godown.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 text-xs font-bold transition"
            title="Open in Google Maps"
          >
            <Navigation className="size-3.5 text-sky-600" />
            <span>Google Maps</span>
          </a>

          <a
            href={`tel:${godown.phone}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 text-xs font-bold transition"
            title="Call Warehouse In-Charge"
          >
            <Phone className="size-3.5 text-emerald-600" />
            <span>Call</span>
          </a>
        </div>

        <button
          onClick={onBook}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
        >
          <ShieldCheck className="size-3.5" />
          <span>Reserve Bay & e-NWR Pledge Token</span>
        </button>
      </div>
    </div>
  );
}
