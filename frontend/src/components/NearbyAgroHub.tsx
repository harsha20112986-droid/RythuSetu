import { useState, useEffect, useMemo } from "react";
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
  Search,
  ArrowUpDown,
  Filter,
  Globe2,
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
import { FacilityRatingBadge, getFacilityRating } from "./FacilityRatingWidget";

type ViewScope = "district_only" | "statewide" | "all_states";
type SortOption = "distance_asc" | "rating_desc" | "price_low" | "price_high";

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
  const [maxDistance, setMaxDistance] = useState<number>(200);

  // User requested: District Only vs Whole State toggle
  const [viewScope, setViewScope] = useState<ViewScope>("district_only");
  const [sortBy, setSortBy] = useState<SortOption>("distance_asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingRefresh, setRatingRefresh] = useState(0);

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

  // Filter and sort mills
  const filteredMills = useMemo(() => {
    if (!data?.nearby_mills) return [];
    let list = [...data.nearby_mills];

    if (viewScope === "district_only") {
      list = list.filter((m) => m.district.toLowerCase() === district.toLowerCase() || m.distance_km <= 35);
    } else if (viewScope === "statewide") {
      list = list.filter((m) => m.state.toLowerCase() === state.toLowerCase());
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.crop.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "distance_asc":
        list.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case "rating_desc":
        list.sort((a, b) => getFacilityRating(b.id).rating - getFacilityRating(a.id).rating);
        break;
      case "price_high":
        list.sort((a, b) => b.direct_offer_price_qtl - a.direct_offer_price_qtl);
        break;
      case "price_low":
        list.sort((a, b) => a.direct_offer_price_qtl - b.direct_offer_price_qtl);
        break;
    }

    return list;
  }, [data?.nearby_mills, viewScope, district, state, searchTerm, sortBy, ratingRefresh]);

  // Filter and sort mandis
  const filteredMandis = useMemo(() => {
    if (!data?.nearby_mandis) return [];
    let list = [...data.nearby_mandis];

    if (viewScope === "district_only") {
      list = list.filter((m) => m.district.toLowerCase() === district.toLowerCase() || m.distance_km <= 35);
    } else if (viewScope === "statewide") {
      list = list.filter((m) => m.state.toLowerCase() === state.toLowerCase());
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.district.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "distance_asc":
        list.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case "rating_desc":
        list.sort((a, b) => getFacilityRating(b.id).rating - getFacilityRating(a.id).rating);
        break;
      case "price_high":
        list.sort((a, b) => b.daily_arrivals_qtl - a.daily_arrivals_qtl);
        break;
      case "price_low":
        list.sort((a, b) => a.daily_arrivals_qtl - b.daily_arrivals_qtl);
        break;
    }

    return list;
  }, [data?.nearby_mandis, viewScope, district, state, searchTerm, sortBy, ratingRefresh]);

  // Filter and sort godowns
  const filteredGodowns = useMemo(() => {
    if (!data?.nearby_cold_storages) return [];
    let list = [...data.nearby_cold_storages];

    if (viewScope === "district_only") {
      list = list.filter((g) => g.district.toLowerCase() === district.toLowerCase() || g.distance_km <= 35);
    } else if (viewScope === "statewide") {
      list = list.filter((g) => g.state.toLowerCase() === state.toLowerCase());
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((g) => g.name.toLowerCase().includes(q) || g.location.toLowerCase().includes(q) || g.district.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "distance_asc":
        list.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case "rating_desc":
        list.sort((a, b) => getFacilityRating(b.id).rating - getFacilityRating(a.id).rating);
        break;
      case "price_low":
        list.sort((a, b) => a.monthly_rent_per_bag - b.monthly_rent_per_bag);
        break;
      case "price_high":
        list.sort((a, b) => b.monthly_rent_per_bag - a.monthly_rent_per_bag);
        break;
    }

    return list;
  }, [data?.nearby_cold_storages, viewScope, district, state, searchTerm, sortBy, ratingRefresh]);

  const totalFilteredCount = filteredMills.length + filteredMandis.length + filteredGodowns.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 animate-in fade-in duration-300">
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

        {/* Dynamic Location Controls */}
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
            <span className="text-emerald-200">Search Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-emerald-950/80 text-white rounded-xl px-2.5 py-1 font-bold border border-emerald-500/40 outline-none cursor-pointer"
            >
              <option value={25} className="bg-slate-900">Within 25 km</option>
              <option value={50} className="bg-slate-900">Within 50 km</option>
              <option value={100} className="bg-slate-900">Within 100 km</option>
              <option value={200} className="bg-slate-900">Within 200 km (Whole Region)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scope Mode Toggle Bar (User Request: Show Guntur only by default vs Whole State on demand) */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1">
              <Filter className="size-3.5" />
              Scope:
            </span>

            <button
              type="button"
              onClick={() => setViewScope("district_only")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewScope === "district_only"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <MapPin className="size-3.5" />
              <span>Nearby ({district} Only)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewScope("statewide")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewScope === "statewide"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Globe2 className="size-3.5" />
              <span>Entire State ({state})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewScope("all_states")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewScope === "all_states"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>All AP &amp; Telangana</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown className="size-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-bold border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="distance_asc">Nearest First (km)</option>
              <option value="rating_desc">⭐ People's Rating (Highest)</option>
              <option value="price_high">Price: High → Low</option>
              <option value="price_low">Price: Low → High</option>
            </select>
          </div>
        </div>

        {/* Search bar inside scope */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by facility name, town, or crop..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            {viewScope === "district_only" ? (
              <span>
                Showing <strong>{totalFilteredCount}</strong> locations inside {district}
              </span>
            ) : (
              <span>
                Showing <strong>{totalFilteredCount}</strong> locations across {viewScope === "statewide" ? state : "AP & Telangana"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scope Helpful Banner if district has low results */}
      {viewScope === "district_only" && totalFilteredCount <= 1 && !loading && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>
              Showing {totalFilteredCount} facility directly inside {district}. Want to explore all mills, mandis, and godowns across {state}?
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewScope("statewide")}
            className="px-3 py-1 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition cursor-pointer shrink-0"
          >
            Show All in {state}
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === "all"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t.nearbyAllTab} ({totalFilteredCount})
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
          <span>{t.nearbyMillsTab} ({filteredMills.length})</span>
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
          <span>{t.nearbyMandisTab} ({filteredMandis.length})</span>
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
          <span>{t.nearbyGodownsTab} ({filteredGodowns.length})</span>
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

      {!loading && (
        <div className="mt-6 space-y-8">
          {/* SECTION 1: DIRECT PURCHASE MILLS & FACTORIES */}
          {(activeTab === "all" || activeTab === "mills") && filteredMills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-amber-100 text-amber-800">
                    <Truck className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Direct Processing Mills (Zero Broker)
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
                {filteredMills.map((mill) => (
                  <MillCard
                    key={mill.id}
                    mill={mill}
                    onPass={onNavigateToFactory}
                    onRated={() => setRatingRefresh((r) => r + 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: APMC AUCTION MANDIS */}
          {(activeTab === "all" || activeTab === "mandis") && filteredMandis.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-sky-100 text-sky-800">
                    <Building2 className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      APMC Market Yards &amp; e-NAM Corridors
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
                {filteredMandis.map((mandi) => (
                  <MandiCard
                    key={mandi.id}
                    mandi={mandi}
                    onViewRates={onNavigateToMandi}
                    onRated={() => setRatingRefresh((r) => r + 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: AC GODOWNS & COLD STORAGES */}
          {(activeTab === "all" || activeTab === "godowns") && filteredGodowns.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-xl bg-teal-100 text-teal-800">
                    <Warehouse className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Climate-Controlled AC Godowns &amp; Cold Stores
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
                {filteredGodowns.map((godown) => (
                  <GodownCard
                    key={godown.id}
                    godown={godown}
                    onBook={onNavigateToStorage}
                    onRated={() => setRatingRefresh((r) => r + 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {totalFilteredCount === 0 && !loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <Building2 className="size-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Facilities in this Scope</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No facilities found in {district} matching your filters. Switch to "Entire State" to see all options across {state}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setViewScope("statewide");
                  setSearchTerm("");
                }}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-800 transition"
              >
                View All in {state}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MillCard({
  mill,
  onPass,
  onRated,
}: {
  mill: NearbyMillItem;
  onPass: () => void;
  onRated?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-amber-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between">
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
            {mill.district}, {mill.state}
          </span>
        </div>

        <h3 className="mt-2 text-base font-black text-slate-900 leading-tight">
          {mill.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{mill.location}</span>
        </p>

        {/* Rating Badge */}
        <div className="mt-2">
          <FacilityRatingBadge
            facilityId={mill.id}
            facilityName={mill.name}
            onRated={onRated}
          />
        </div>

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

function MandiCard({
  mandi,
  onViewRates,
  onRated,
}: {
  mandi: NearbyMandiItem;
  onViewRates: () => void;
  onRated?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-400 transition flex flex-col justify-between">
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
              e-NAM Market
            </span>
          )}
        </div>

        <h3 className="mt-2 text-base font-black text-slate-900 leading-tight">
          {mandi.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{mandi.location} ({mandi.district})</span>
        </p>

        {/* Rating Badge */}
        <div className="mt-2">
          <FacilityRatingBadge
            facilityId={mandi.id}
            facilityName={mandi.name}
            onRated={onRated}
          />
        </div>

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

function GodownCard({
  godown,
  onBook,
  onRated,
}: {
  godown: NearbyGodownItem;
  onBook: () => void;
  onRated?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-teal-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-400 transition flex flex-col justify-between">
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
          <span>{godown.location} ({godown.district})</span>
        </p>

        {/* Rating Badge */}
        <div className="mt-2">
          <FacilityRatingBadge
            facilityId={godown.id}
            facilityName={godown.name}
            onRated={onRated}
          />
        </div>

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
          <span>Reserve Bay &amp; e-NWR Pledge Token</span>
        </button>
      </div>
    </div>
  );
}
