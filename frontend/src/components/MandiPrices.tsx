import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  RefreshCw,
  Building2,
  AlertCircle,
  Truck,
  ShieldCheck,
  ArrowUpDown,
  Search,
  ArrowLeft,
  Sparkles,
  Award,
  Calendar,
  BarChart3,
  GitCompare,
} from "lucide-react";
import {
  type Farmer,
  type MandiData,
  type MandiHistoryItem,
  type MandiComparisonItem,
  type MandiTrendData,
  API_BASE,
} from "../types";
import { DataSourceBadge } from "./DataSourceBadge";

type SortOption = "price_high" | "price_low" | "arrival_high" | "name_az";
type ActiveView = "varieties" | "markets" | "history" | "compare";

interface CropQuickOption {
  id: string;
  name: string;
  telugu: string;
  emoji: string;
}

const CROPS: CropQuickOption[] = [
  { id: "Red Chilli", name: "Red Chilli", telugu: "మిరప", emoji: "🌶️" },
  { id: "Cotton", name: "Cotton", telugu: "పత్తి", emoji: "🌾" },
  { id: "Paddy / Rice", name: "Paddy / Rice", telugu: "వరి", emoji: "🍚" },
  { id: "Turmeric", name: "Turmeric", telugu: "పసుపు", emoji: "🟡" },
  { id: "Groundnut", name: "Groundnut", telugu: "వేరుశనగ", emoji: "🥜" },
  { id: "Maize", name: "Maize", telugu: "మొక్కజొన్న", emoji: "🌽" },
  { id: "Pigeon Pea / Red Gram (Tur)", name: "Red Gram", telugu: "కందులు", emoji: "🥣" },
];

export function MandiPrices({
  farmer,
  onBack,
}: {
  farmer: Farmer | null;
  onBack: () => void;
}) {
  const [selectedCrop, setSelectedCrop] = useState<string>(farmer?.form.crop || "Red Chilli");
  const [mandiData, setMandiData] = useState<MandiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<ActiveView>("varieties");

  // History & Comparison data
  const [historyData, setHistoryData] = useState<MandiHistoryItem[]>([]);
  const [comparisonData, setComparisonData] = useState<MandiComparisonItem[]>([]);
  const [trendData, setTrendData] = useState<MandiTrendData | null>(null);
  const [_loadingExtras, setLoadingExtras] = useState(false);

  // Sort & Filter State
  const [sortBy, setSortBy] = useState<SortOption>("price_high");
  const [searchMarket, setSearchMarket] = useState("");
  const [selectedVarietyFilter, setSelectedVarietyFilter] = useState<string>("All");

  const fetchPrices = async (crop: string) => {
    setLoading(true);
    setError("");
    try {
      const distParam = farmer?.form?.district ? `&district=${encodeURIComponent(farmer.form.district)}` : "";
      const res = await fetch(`${API_BASE}/mandi/prices?crop=${encodeURIComponent(crop)}${distParam}`);
      if (!res.ok) throw new Error("Unable to fetch market arrivals");
      const data = await res.json();
      setMandiData(data);
      setSelectedVarietyFilter("All");
    } catch (e: any) {
      setError(e.message || "Failed to load market intelligence");
    } finally {
      setLoading(false);
    }
  };

  const fetchExtras = async (crop: string) => {
    setLoadingExtras(true);
    try {
      const distParam = farmer?.form?.district ? `&district=${encodeURIComponent(farmer.form.district)}` : "";
      const [histRes, compRes, trendRes] = await Promise.all([
        fetch(`${API_BASE}/mandi/history?crop=${encodeURIComponent(crop)}${distParam}&days=30`),
        fetch(`${API_BASE}/mandi/compare?crop=${encodeURIComponent(crop)}`),
        fetch(`${API_BASE}/mandi/trend?crop=${encodeURIComponent(crop)}${distParam}&days=7`),
      ]);

      if (histRes.ok) {
        const histJson = await histRes.json();
        setHistoryData(histJson.history || []);
      }
      if (compRes.ok) {
        const compJson = await compRes.json();
        setComparisonData(compJson.markets || []);
      }
      if (trendRes.ok) {
        const trendJson = await trendRes.json();
        setTrendData(trendJson);
      }
    } catch (e) {
      console.error("Failed to load supplementary mandi analytics", e);
    } finally {
      setLoadingExtras(false);
    }
  };

  useEffect(() => {
    fetchPrices(selectedCrop);
    fetchExtras(selectedCrop);
  }, [selectedCrop]);

  // Filter & Sort Markets
  const sortedMarkets = useMemo(() => {
    if (!mandiData?.markets) return [];
    let list = [...mandiData.markets];

    // Filter by variety if chosen
    if (selectedVarietyFilter !== "All") {
      list = list.filter((m) => m.variety.toLowerCase().includes(selectedVarietyFilter.toLowerCase()));
    }

    // Filter by search query
    const q = searchMarket.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.mandi_name.toLowerCase().includes(q) ||
          m.variety.toLowerCase().includes(q) ||
          (m.telugu_name && m.telugu_name.toLowerCase().includes(q)) ||
          m.district.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price_high":
        list.sort((a, b) => b.modal_price - a.modal_price);
        break;
      case "price_low":
        list.sort((a, b) => a.modal_price - b.modal_price);
        break;
      case "arrival_high":
        list.sort((a, b) => b.arrival_quintals - a.arrival_quintals);
        break;
      case "name_az":
        list.sort((a, b) => a.mandi_name.localeCompare(b.mandi_name));
        break;
    }

    return list;
  }, [mandiData, sortBy, searchMarket, selectedVarietyFilter]);

  const activeCropObj = CROPS.find((c) => c.id === selectedCrop) || CROPS[0];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>← Back to Dashboard / వెనుకకు</span>
      </button>

      {/* Clean, Simple Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full border border-emerald-600/50 mb-2">
              <Sparkles className="size-3 text-amber-300" />
              Daily APMC Mandi Market Prices • ఆంధ్రప్రదేశ్ &amp; తెలంగాణ
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {activeCropObj.emoji} {activeCropObj.name} ({activeCropObj.telugu}) Market Rates
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Authoritative APMC daily auction records and statutory MSP benchmarks. Updated per official government arrivals.
            </p>
          </div>

          <button
            onClick={() => {
              fetchPrices(selectedCrop);
              fetchExtras(selectedCrop);
            }}
            disabled={loading}
            className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-700" : ""}`} />
            <span>Refresh Prices (తాజా ధరలు)</span>
          </button>
        </div>

        {/* Big Touch-Friendly Crop Selector */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-white/15 pt-4">
          {CROPS.map((c) => {
            const isSelected = selectedCrop === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? "bg-white text-emerald-950 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <span className="text-base">{c.emoji}</span>
                <span>{c.name}</span>
                <span className="text-[11px] opacity-80">({c.telugu})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Authoritative Data Source & Freshness Provenance Banner */}
      {mandiData && (
        <div className="mb-6">
          <DataSourceBadge
            status={mandiData.data_source_status}
            freshness={mandiData.freshness}
            marketDate={mandiData.market_date}
            lastSyncTimestamp={mandiData.last_sync_timestamp}
            sourceUrl={mandiData.source_url}
          />
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Main Metric Cards */}
      {mandiData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Highest Session Price */}
          <div className="bg-emerald-50/80 rounded-3xl p-5 border border-emerald-300 shadow-xs">
            <span className="text-[11px] font-black uppercase text-emerald-900 flex items-center gap-1.5">
              <Award className="size-4 text-emerald-700" />
              Highest Session Rate (గరిష్ట ధర)
            </span>
            <div className="text-3xl font-black text-emerald-950 mt-1">
              ₹{mandiData.highest_price?.toLocaleString() || mandiData.average_modal_price.toLocaleString()}
              <span className="text-xs font-bold text-emerald-800"> / Quintal</span>
            </div>
            <p className="text-xs text-emerald-900 font-extrabold mt-1 truncate">
              {mandiData.highest_variety || "Top Grade"}
            </p>
          </div>

          {/* Government MSP Guarantee */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-sky-700" />
              Govt Support Price (ప్రభుత్వ మద్దతు ధర)
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ₹{mandiData.govt_msp_inr.toLocaleString()}
              <span className="text-xs font-bold text-slate-500"> / Quintal</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {mandiData.msp_source || "CACP Statutory Minimum Support Floor (Kharif/Rabi)"}
            </p>
          </div>

          {/* Difference vs MSP */}
          <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-300 shadow-xs">
            <span className="text-[11px] font-black uppercase text-amber-900 flex items-center gap-1.5">
              <TrendingUp className="size-4 text-amber-700" />
              Difference vs MSP (మద్దతు ధరతో తేడా)
            </span>
            <div className="text-3xl font-black text-amber-950 mt-1">
              {mandiData.msp_difference_inr >= 0 ? "+" : ""}
              ₹{mandiData.msp_difference_inr.toLocaleString()}
              <span className="text-xs font-bold text-amber-800"> vs MSP</span>
            </div>
            <p className="text-[11px] text-amber-900 font-semibold mt-1 leading-snug">
              Gross spot price spread. (Modal price is gross auction bid before transport, cleaning, &amp; packing).
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs for Mandi Intelligence */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveView("varieties")}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeView === "varieties"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>🏆</span>
          <span>Varieties &amp; Breeds (రకాలు)</span>
        </button>

        <button
          onClick={() => setActiveView("markets")}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeView === "markets"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Building2 className="size-3.5" />
          <span>APMC Yards (మార్కెట్ యార్డులు)</span>
        </button>

        <button
          onClick={() => setActiveView("compare")}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeView === "compare"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <GitCompare className="size-3.5" />
          <span>Regional Market Comparison ({comparisonData.length})</span>
        </button>

        <button
          onClick={() => setActiveView("history")}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeView === "history"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <BarChart3 className="size-3.5" />
          <span>Price Trends &amp; History ({historyData.length} entries)</span>
        </button>
      </div>

      {/* VIEW 1: VARIETIES & BREEDS */}
      {activeView === "varieties" && mandiData?.varieties && (
        <div className="mb-6 rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🏆</span>
                <span>{activeCropObj.name} Varieties &amp; Breeds (విత్తన రకాల ధరలు)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ranked from <strong>Highest Price to Lowest</strong>. Tap any variety to filter:
              </p>
            </div>
            {selectedVarietyFilter !== "All" && (
              <button
                onClick={() => setSelectedVarietyFilter("All")}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Clear Filter (Show All Varieties)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mandiData.varieties.map((v, idx) => {
              const isSelected = selectedVarietyFilter === v.variety.split("/")[0].trim();
              const profitOverMsp = v.modal_price - mandiData.govt_msp_inr;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const shortName = v.variety.split("/")[0].trim();
                    setSelectedVarietyFilter(isSelected ? "All" : shortName);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/30 shadow-md"
                      : "border-slate-200 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-300 shadow-2xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black text-emerald-900 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                        #{idx + 1} • {v.grade_tag.split("•")[0]}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        profitOverMsp >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {profitOverMsp >= 0 ? `+₹${profitOverMsp} vs MSP` : `-₹${Math.abs(profitOverMsp)}`}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {v.variety}
                    </h3>
                    {v.telugu_name && (
                      <p className="text-xs font-extrabold text-emerald-800 mt-0.5">
                        {v.telugu_name}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {v.key_trait}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Modal Rate</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{v.modal_price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">/qtl</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-700 bg-white border border-emerald-300 px-2 py-1 rounded-xl">
                      {isSelected ? "✓ Selected" : "Filter Yard"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: APMC YARDS & AUCTIONS */}
      {activeView === "markets" && (
        <div>
          {/* Search & Sort Controls */}
          <div className="mb-4 bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchMarket}
                onChange={(e) => setSearchMarket(e.target.value)}
                placeholder="Search yard, variety, or district..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="size-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs font-black border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="price_high">Price: High → Low (అత్యధిక ధర)</option>
                <option value="price_low">Price: Low → High (తక్కువ ధర)</option>
                <option value="arrival_high">Arrival Volume (రాబడులు)</option>
                <option value="name_az">Mandi Name (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedMarkets.map((m, idx) => {
              const mspDiff = mandiData ? m.modal_price - mandiData.govt_msp_inr : 0;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-black text-slate-900 text-base">
                          {m.mandi_name}
                        </span>
                        <p className="text-xs font-black text-emerald-800 mt-0.5">
                          {m.variety} {m.telugu_name ? `• ${m.telugu_name}` : ""}
                        </p>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          {m.district}, {m.state}
                        </p>
                      </div>

                      <div className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase shrink-0 ${
                        mspDiff >= 0 ? "bg-emerald-100 text-emerald-950" : "bg-red-100 text-red-950"
                      }`}>
                        {mspDiff >= 0 ? "Trading Above MSP" : "Below MSP"}
                      </div>
                    </div>

                    <div className="my-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Session Modal Rate</span>
                        <div className="text-2xl font-black text-emerald-950">
                          ₹{m.modal_price.toLocaleString()}
                          <span className="text-xs font-bold text-slate-600"> / Quintal</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Range</span>
                        <span className="text-xs font-bold text-slate-800">
                          ₹{m.min_price.toLocaleString()} - ₹{m.max_price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {m.key_trait && (
                      <p className="text-xs text-slate-600 font-medium">
                        💡 <strong>Details:</strong> {m.key_trait}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Truck className="size-3.5 text-slate-400" />
                        Arrivals: {m.arrival_quintals} Quintals
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="size-3 text-slate-400" />
                        Session: {m.effective_date || m.verified_date || "Recent"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>{m.recommendation}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        mspDiff >= 0 ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                      }`}>
                        {mspDiff >= 0 ? `+₹${mspDiff} vs MSP` : `${mspDiff} vs MSP`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && sortedMarkets.length === 0 && (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
              <Building2 className="size-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No market listings found matching your search.</p>
              <button
                onClick={() => {
                  setSearchMarket("");
                  setSelectedVarietyFilter("All");
                }}
                className="mt-3 text-xs font-black text-emerald-700 hover:underline cursor-pointer"
              >
                Reset Filters (అన్ని రకాలు చూపించు)
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: REGIONAL COMPARISON */}
      {activeView === "compare" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Regional APMC Yard Price Comparison — {activeCropObj.name}
              </h3>
              <p className="text-xs text-slate-500">
                Yards ranked highest to lowest by latest recorded modal trading price
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              {comparisonData.length} Yards Tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Market Yard</th>
                  <th className="py-3 px-4">District / State</th>
                  <th className="py-3 px-4">Variety</th>
                  <th className="py-3 px-4">Session Date</th>
                  <th className="py-3 px-4">Price Range (₹/qtl)</th>
                  <th className="py-3 px-4">Modal Price (₹/qtl)</th>
                  <th className="py-3 px-4">Diff vs MSP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No market comparison data currently available for {activeCropObj.name}.
                    </td>
                  </tr>
                ) : (
                  comparisonData.map((row, idx) => {
                    const diff = mandiData ? row.modal_price - mandiData.govt_msp_inr : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-black text-slate-900">{row.market}</td>
                        <td className="py-3 px-4 text-slate-600">{row.district}, {row.state}</td>
                        <td className="py-3 px-4 font-bold text-emerald-800">{row.variety}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{row.arrival_date}</td>
                        <td className="py-3 px-4 text-slate-600">₹{row.min_price.toLocaleString()} - ₹{row.max_price.toLocaleString()}</td>
                        <td className="py-3 px-4 font-black text-base text-slate-900">₹{row.modal_price.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            diff >= 0 ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                          }`}>
                            {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: PRICE HISTORY & TRENDS */}
      {activeView === "history" && (
        <div className="space-y-4">
          {/* Trend Summary Card */}
          {trendData && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Recent Price Movement (7 Sessions)
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{trendData.latest_modal.toLocaleString()} / Quintal
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${
                      trendData.trend === "UP"
                        ? "bg-emerald-100 text-emerald-800"
                        : trendData.trend === "DOWN"
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      {trendData.trend === "UP" ? "▲ Shift Up" : trendData.trend === "DOWN" ? "▼ Shift Down" : "▬ Stable"}
                      ({trendData.percentage_change}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Previous session modal rate: ₹{trendData.previous_modal.toLocaleString()} / Quintal (Net shift: ₹{trendData.absolute_change})
                  </p>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div><strong>Observations:</strong> {trendData.observations_count} recorded lots</div>
                  <div><strong>Latest Session:</strong> {trendData.latest_arrival_date || "Recent"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Chronological Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">
                Daily APMC Arrival &amp; Price History — {activeCropObj.name}
              </h3>
              <span className="text-xs text-slate-500 font-bold">Past 30 Days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Arrival Date</th>
                    <th className="py-3 px-4">Market Yard</th>
                    <th className="py-3 px-4">Variety</th>
                    <th className="py-3 px-4">Min Price</th>
                    <th className="py-3 px-4">Max Price</th>
                    <th className="py-3 px-4">Modal Price</th>
                    <th className="py-3 px-4">Volume (MT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No historical daily price points recorded yet for {activeCropObj.name}.
                      </td>
                    </tr>
                  ) : (
                    historyData.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{h.arrival_date}</td>
                        <td className="py-3 px-4 text-slate-700">{h.market}</td>
                        <td className="py-3 px-4 font-bold text-emerald-800">{h.variety}</td>
                        <td className="py-3 px-4 text-slate-600">₹{h.min_price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-600">₹{h.max_price.toLocaleString()}</td>
                        <td className="py-3 px-4 font-black text-slate-900">₹{h.modal_price.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{h.arrival_quantity} MT</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Legal Disclaimer Notice */}
      <div className="mt-8 rounded-3xl bg-slate-50 border border-slate-200 p-5 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <ShieldCheck className="size-4 text-emerald-700 shrink-0" />
          <span>Statutory Minimum Support Price &amp; APMC Auction Terms</span>
        </div>
        <p className="leading-relaxed">
          Statutory Minimum Support Price (MSP) is guaranteed by the Government of India at designated procurement centers (PPCs operated by FCI, CCI, MARKFED, and Civil Supplies) for FAQ-standard produce. APMC yard quotes reflect daily wholesale spot auction bids and fluctuate with moisture content, variety purity, and yard arrivals. Modal rates reflect gross auction sale prices and are not guaranteed net farmer margins.
        </p>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition cursor-pointer"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
