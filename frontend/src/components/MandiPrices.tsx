import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  IndianRupee,
  RefreshCw,
  Building2,
  Calendar,
  AlertCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { type Farmer, type MandiData, API_BASE } from "../types";

export function MandiPrices({
  farmer,
  onBack,
}: {
  farmer: Farmer | null;
  onBack: () => void;
}) {
  const [selectedCrop, setSelectedCrop] = useState<string>(farmer?.form.crop || "Cotton");
  const [mandiData, setMandiData] = useState<MandiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrices = async (crop: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/mandi/prices?crop=${encodeURIComponent(crop)}`);
      if (!res.ok) throw new Error("Unable to fetch market arrivals");
      const data = await res.json();
      setMandiData(data);
    } catch (e: any) {
      setError(e.message || "Failed to load market intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(selectedCrop);
  }, [selectedCrop]);

  const availableCrops = ["Cotton", "Paddy / Rice", "Groundnut", "Maize", "Red Chilli"];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-6 lg:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md mb-2">
              <Building2 className="size-3.5" />
              <span>e-NAM & State APMC Mandi Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Live Mandi & Market Rates
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Real-time APMC arrivals, Minimum Support Price (MSP) price floors, and algorithmic Sell vs Hold advisories for Telangana & Andhra Pradesh.
            </p>
          </div>

          <button
            onClick={() => fetchPrices(selectedCrop)}
            disabled={loading}
            className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live Rates</span>
          </button>
        </div>

        {/* Crop Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-white/15">
          {availableCrops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCrop === c
                  ? "bg-white text-emerald-950 shadow-md scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      {mandiData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Government MSP Floor</span>
              <ShieldCheck className="size-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              ₹{mandiData.govt_msp_inr.toLocaleString()}
              <span className="text-xs font-medium text-slate-500"> / Quintal</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Minimum Support Price guaranteed at Procurement Centres
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Average APMC Modal Rate</span>
              <IndianRupee className="size-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-800 mt-2">
              ₹{mandiData.average_modal_price.toLocaleString()}
              <span className="text-xs font-medium text-slate-500"> / Quintal</span>
            </div>
            <p className="text-[11px] text-teal-600 font-bold mt-1">
              Weighted average across active regional yards
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Market vs MSP Spread</span>
              {mandiData.msp_difference_inr >= 0 ? (
                <TrendingUp className="size-4 text-emerald-600" />
              ) : (
                <TrendingDown className="size-4 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-black mt-2 ${
              mandiData.msp_difference_inr >= 0 ? "text-emerald-700" : "text-red-600"
            }`}>
              {mandiData.msp_difference_inr >= 0 ? "+" : ""}₹{mandiData.msp_difference_inr.toLocaleString()}
              <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {mandiData.msp_status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {mandiData.msp_difference_inr >= 0
                ? "Private millers paying premium over official MSP"
                : "Farmers advised to sell at official PPC centers"}
            </p>
          </div>
        </div>
      )}

      {/* Mandi Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">
            Active Regional Mandis & APMC Yards ({mandiData?.markets.length || 0})
          </h2>
          <span className="text-xs text-slate-500">
            Source: e-NAM Data Feed • Verified {mandiData?.timestamp}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mandiData?.markets.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-base">
                      {m.mandi_name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({m.district}, {m.state})
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    Variety: {m.variety}
                  </p>
                </div>

                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  m.price_trend === "bullish"
                    ? "bg-emerald-100 text-emerald-900"
                    : m.price_trend === "bearish"
                    ? "bg-red-100 text-red-900"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {m.price_trend === "bullish" ? (
                    <TrendingUp className="size-3.5 text-emerald-600" />
                  ) : m.price_trend === "bearish" ? (
                    <TrendingDown className="size-3.5 text-red-600" />
                  ) : (
                    <Minus className="size-3.5 text-slate-500" />
                  )}
                  <span>{m.trend_percent}% {m.price_trend}</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Min Price</span>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">₹{m.min_price}</div>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-emerald-800 font-black uppercase">Modal (Most Sold)</span>
                  <div className="text-sm font-black text-emerald-950 mt-0.5">₹{m.modal_price}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Max Price</span>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">₹{m.max_price}</div>
                </div>
              </div>

              {/* Arrivals & Advisory */}
              <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <Truck className="size-3.5 text-slate-400" />
                  <span>Today's Arrival: <strong>{m.arrival_quintals} Quintals</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="size-3" />
                  <span>{m.verified_date}</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 font-medium">
                <strong className="font-bold text-emerald-950">Action Advisory: </strong>
                {m.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
