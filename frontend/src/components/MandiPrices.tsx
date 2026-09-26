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
} from "lucide-react";
import { type Farmer, type MandiData, API_BASE } from "../types";

type SortOption = "price_high" | "price_low" | "arrival_high" | "name_az";

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

  // Sort & Filter State
  const [sortBy, setSortBy] = useState<SortOption>("price_high");
  const [searchMarket, setSearchMarket] = useState("");
  const [selectedVarietyFilter, setSelectedVarietyFilter] = useState<string>("All");

  const fetchPrices = async (crop: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/mandi/prices?crop=${encodeURIComponent(crop)}`);
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

  useEffect(() => {
    fetchPrices(selectedCrop);
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

      {/* Clean, Simple Hero Header (Designed for Low Literacy Farmers) */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full border border-emerald-600/50 mb-2">
              <Sparkles className="size-3 text-amber-300" />
              Live e-NAM APMC Rates • ఆంధ్రప్రదేశ్ &amp; తెలంగాణ
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {activeCropObj.emoji} {activeCropObj.name} ({activeCropObj.telugu}) Market Rates
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Exact prices for every seed breed &amp; variety. Updated live today.
            </p>
          </div>

          <button
            onClick={() => fetchPrices(selectedCrop)}
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

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Main Big Numbers (Instant clarity for farmers) */}
      {mandiData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Highest Price */}
          <div className="bg-emerald-50/80 rounded-3xl p-5 border border-emerald-300 shadow-xs">
            <span className="text-[11px] font-black uppercase text-emerald-900 flex items-center gap-1.5">
              <Award className="size-4 text-emerald-700" />
              Highest Rate Today (గరిష్ట ధర)
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
              Minimum guaranteed floor at government centers
            </p>
          </div>

          {/* Market Spread */}
          <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-300 shadow-xs">
            <span className="text-[11px] font-black uppercase text-amber-900 flex items-center gap-1.5">
              <TrendingUp className="size-4 text-amber-700" />
              Extra Farmer Profit (లాభం)
            </span>
            <div className="text-3xl font-black text-amber-950 mt-1">
              +₹{Math.max(0, mandiData.msp_difference_inr).toLocaleString()}
              <span className="text-xs font-bold text-amber-800"> above MSP</span>
            </div>
            <p className="text-xs text-amber-900 font-bold mt-1">
              Private traders &amp; exporters paying premium
            </p>
          </div>
        </div>
      )}

      {/* Variety & Seed Breed Leaderboard (High to Low) - As Requested by User */}
      {mandiData?.varieties && mandiData.varieties.length > 0 && (
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

          {/* Visual Variety Cards Grid */}
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
                        {profitOverMsp >= 0 ? `+₹${profitOverMsp} /qtl` : `-₹${Math.abs(profitOverMsp)}`}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {v.variety}
                    </h3>
                    <p className="text-xs font-extrabold text-emerald-800 mt-0.5">
                      {v.telugu_name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {v.key_trait}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Yard Rate</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{v.modal_price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">/qtl</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-700 bg-white border border-emerald-300 px-2 py-1 rounded-xl">
                      {isSelected ? "✓ Selected" : "Tap to View"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Sort Controls */}
      <div className="mb-4 bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchMarket}
            onChange={(e) => setSearchMarket(e.target.value)}
            placeholder="Search yard, variety, or Telugu name..."
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

      {/* Market Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
          <span>Showing {sortedMarkets.length} Verified Market Yards &amp; Tenders</span>
          <span>e-NAM Live • {mandiData?.timestamp}</span>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-slate-600 flex flex-col items-center gap-3">
            <RefreshCw className="size-8 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold">Connecting to e-NAM market arrivals...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedMarkets.map((m, idx) => {
            const mspDiff = mandiData ? m.modal_price - mandiData.govt_msp_inr : 0;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Status Tag */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-slate-900 text-base">
                          {m.mandi_name}
                        </span>
                      </div>
                      <p className="text-xs font-black text-emerald-800 mt-0.5">
                        {m.variety} {m.telugu_name ? `• ${m.telugu_name}` : ""}
                      </p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase shrink-0 ${
                      mspDiff >= 0 ? "bg-emerald-100 text-emerald-950" : "bg-red-100 text-red-950"
                    }`}>
                      {mspDiff >= 0 ? "🟢 BEST TO SELL" : "🔴 HOLD / CLAIM"}
                    </div>
                  </div>

                  {/* Big Rupee Number */}
                  <div className="my-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Today's Modal Rate</span>
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
                      💡 <strong>Trait:</strong> {m.key_trait}
                    </p>
                  )}
                </div>

                {/* Footer with Recommendation & Arrival */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <Truck className="size-3.5 text-slate-400" />
                      Arrival: {m.arrival_quintals} Quintals
                    </span>
                    <span>{m.verified_date}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{m.recommendation}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      mspDiff >= 0 ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}>
                      {mspDiff >= 0 ? `+₹${mspDiff} over MSP` : "Sell at PPC"}
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
