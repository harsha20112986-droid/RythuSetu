import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Sparkles,
  Sprout,
  Layers,
  Bug,
  FlaskConical,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  type Farmer,
  type CropRecommendationItem,
  API_BASE,
  ALL_STATES,
  getDistrictsForState,
} from "../types";

export function CropRecommendation({
  farmer,
  onBack,
  onApplyCrop,
}: {
  farmer: Farmer | null;
  onBack: () => void;
  onApplyCrop?: (cropName: string) => void;
}) {
  const [state, setState] = useState(farmer?.form.state || "Telangana");
  const [district, setDistrict] = useState(farmer?.form.district || "Warangal");
  const [soilType, setSoilType] = useState("Black Cotton Clay");
  const [season, setSeason] = useState(farmer?.form.season || "Kharif");
  const [waterSource, setWaterSource] = useState("Borewell / Semi-irrigated");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>([]);
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const availableDistricts = getDistrictsForState(state);

  const handleStateChange = (nextState: string) => {
    setState(nextState);
    const dists = getDistrictsForState(nextState);
    setDistrict(dists[0] || "");
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/crops/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          district,
          soil_type: soilType,
          season,
          water_source: waterSource,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to compute recommendations");
      setRecommendations(data.recommendations || []);
      if (data.recommendations && data.recommendations.length > 0) {
        setExpandedCrop(data.recommendations[0].crop_name);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load crop recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-black text-emerald-800">
          <Sparkles className="size-3.5 text-emerald-600" />
          Agronomic Intelligence AI
        </span>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-6 sm:p-10 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
            Precision Crop Advisory
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">
            Scientific Crop Recommendation & Package of Practices
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Matches your soil characteristics, water availability, and season with high-yield crops.
            Provides scientific N:P:K fertilizer split schedules, CIBRC approved pest/disease sprays, and projected net profits per acre.
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Layers className="size-4 text-emerald-600" />
            Farm Agro-Climatic Parameters
          </h2>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            <span>Recalculate Best Crops</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* State */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">District ({availableDistricts.length})</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              <option value="Black Cotton Clay">Black Cotton Clay</option>
              <option value="Red Sandy Loam">Red Sandy Loam</option>
              <option value="Alluvial Loam">Alluvial Loam</option>
              <option value="Laterite / Red Gravelly">Laterite / Red Gravelly</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              <option value="Kharif">Kharif (Monsoon / June - Oct)</option>
              <option value="Rabi">Rabi (Winter / Nov - Feb)</option>
              <option value="Summer">Summer / Zaid (March - May)</option>
            </select>
          </div>

          {/* Water Source */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Irrigation Supply</label>
            <select
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              <option value="Canal / Borewell assured">Canal / Assured Irrigation</option>
              <option value="Borewell / Semi-irrigated">Borewell / Semi-irrigated</option>
              <option value="Rainfed Dryland">Rainfed Dryland (Low Water)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-8 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold">Analyzing soil profile, agro-climatic zone, and economic yield potential...</span>
        </div>
      )}

      {/* Results List */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Ranked Recommended Crops ({recommendations.length} Evaluated)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Sorted by highest agronomic match & profitability</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((item, idx) => {
              const isExpanded = expandedCrop === item.crop_name;
              return (
                <div
                  key={item.crop_name}
                  className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Summary Strip */}
                  <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-lg shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-xl font-black text-slate-900">{item.crop_name}</h4>
                          <span className="text-sm font-bold text-emerald-700">({item.telugu_name})</span>
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                          <span>{item.duration_days}</span>
                          <span>•</span>
                          <span>Water: {item.min_water}</span>
                        </p>
                      </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Expected Yield</span>
                        <span className="text-xs font-black text-slate-900">{item.expected_yield_qtl_acre}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Market Rate</span>
                        <span className="text-xs font-black text-slate-900">₹{item.avg_market_price_qtl.toLocaleString()}/Qtl</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Cultivation Cost</span>
                        <span className="text-xs font-black text-slate-700">₹{item.cultivation_cost_acre.toLocaleString()}/acre</span>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <span className="text-[10px] uppercase font-black text-emerald-700 block">Est. Net Profit</span>
                        <span className="text-sm font-black text-emerald-900">₹{item.estimated_net_profit_acre.toLocaleString()}/ac</span>
                      </div>
                    </div>

                    {/* Expand Toggle */}
                    <div className="flex items-center gap-2">
                      {onApplyCrop && (
                        <button
                          type="button"
                          onClick={() => onApplyCrop(item.crop_name)}
                          className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Select for My Farm
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedCrop(isExpanded ? null : item.crop_name)}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                        title={isExpanded ? "Collapse Details" : "View Package of Practices"}
                      >
                        {isExpanded ? <ChevronUp className="size-4.5" /> : <ChevronDown className="size-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Package of Practices (POP) */}
                  {isExpanded && (
                    <div className="p-6 sm:p-8 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      {/* Match Reasons */}
                      <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                        <h5 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          Agronomic Suitability Highlights
                        </h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-emerald-800">
                          {item.match_reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fertilizer Protocol Grid */}
                      <div>
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                          <FlaskConical className="size-4 text-amber-600" />
                          Scientific Fertilizer Split Schedule (N:P:K per acre)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {Object.entries(item.fertilizer_protocol).map(([stage, dose]) => (
                            <div key={stage} className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3.5">
                              <span className="text-[11px] font-black uppercase tracking-wide text-amber-900 block mb-1">
                                {stage.replace(/_/g, " ")}
                              </span>
                              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                                {dose}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pest & Disease Management Guide */}
                      <div>
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                          <Bug className="size-4 text-rose-600" />
                          Pest & Disease Prevention: CIBRC Chemical & Bio-Control Sprays
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {item.pest_management.map((pm, pidx) => (
                            <div key={pidx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                              <span className="text-xs font-black text-rose-950 block mb-1">
                                {pm.pest_or_disease}
                              </span>
                              <p className="text-[11px] text-slate-600 font-medium mb-3 italic">
                                Symptoms: {pm.symptoms}
                              </p>
                              <div className="space-y-2 border-t border-slate-100 pt-2.5">
                                <div className="text-xs">
                                  <span className="text-[10px] font-extrabold text-rose-700 uppercase block">CIBRC Chemical Spray</span>
                                  <span className="text-[11px] font-bold text-slate-900">{pm.chemical_spray}</span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Organic Bio-Control</span>
                                  <span className="text-[11px] font-bold text-emerald-900">{pm.organic_spray}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intercrop Guidance */}
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 text-xs text-indigo-950 font-semibold">
                          <Sprout className="size-4 text-indigo-600 shrink-0" />
                          <span>Recommended Intercrop Strategy: <strong>{item.intercrop_suitability}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
