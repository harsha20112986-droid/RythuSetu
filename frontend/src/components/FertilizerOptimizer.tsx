import { useState, useEffect } from "react";
import {
  FlaskConical,
  Sprout,
  Package,
  Layers,
  Leaf,
  CheckCircle2,
  Info,
} from "lucide-react";
import { type Farmer, type FertilizerPlan, API_BASE } from "../types";

export function FertilizerOptimizer({
  farmer,
  onBack,
}: {
  farmer: Farmer | null;
  onBack: () => void;
}) {
  const [crop, setCrop] = useState(farmer?.form.crop || "Cotton");
  const [soilType, setSoilType] = useState("Black Cotton Clay");
  const [acres, setAcres] = useState(farmer?.form.land_area_acres || "3.5");
  const [plan, setPlan] = useState<FertilizerPlan | null>(null);
  const [_loading, setLoading] = useState(false);

  const calculatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/soil/fertilizer-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          soil_type: soilType,
          land_area_acres: Number(acres) || 3.5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePlan();
  }, [crop, soilType, acres]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 p-6 lg:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-teal-800/40">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-300 backdrop-blur-md mb-2">
          <FlaskConical className="size-3.5" />
          <span>Scientific Nutrient Management System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Soil Health & Smart Fertilizer Dosage Optimizer
        </h1>
        <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
          Calculate the exact N:P:K split dosage (Urea, DAP, Potash) for your land to prevent fertilizer wastage, reduce input costs, and protect soil biodiversity.
        </p>
      </div>

      {/* Input Parameters Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-8">
        <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="size-4 text-emerald-700" />
          Farm Parameters & Soil Classification
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cultivated Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Cotton">Cotton</option>
              <option value="Paddy / Rice">Paddy / Rice</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Black Cotton Clay">Black Cotton Clay (Deep Regur)</option>
              <option value="Red Sandy Loam">Red Sandy Loam (Chaluka)</option>
              <option value="Alluvial Loam">Alluvial Loam</option>
              <option value="Laterite / Red Gravelly">Laterite / Red Gravelly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cultivated Land Area (Acres)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Bag Requirement Summary */}
      {plan && (
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Package className="size-4.5 text-emerald-700" />
              Total Fertilizer Bag Requirements for {plan.acres} Acres
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Urea (46% N)</span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {plan.total_bag_requirements.urea_45kg_bags}
                </div>
                <span className="text-xs font-bold text-slate-500">Bags (45 kg each)</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-bold text-slate-500 uppercase">DAP (18:46:0)</span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {plan.total_bag_requirements.dap_50kg_bags}
                </div>
                <span className="text-xs font-bold text-slate-500">Bags (50 kg each)</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-bold text-slate-500 uppercase">MOP Potash (60% K)</span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {plan.total_bag_requirements.mop_potash_50kg_bags}
                </div>
                <span className="text-xs font-bold text-slate-500">Bags (50 kg each)</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Zinc Sulphate</span>
                <div className="text-3xl font-black text-teal-900 mt-1">
                  {plan.total_bag_requirements.zinc_sulphate_kg}
                </div>
                <span className="text-xs font-bold text-slate-500">kg (Micronutrient)</span>
              </div>
            </div>
          </div>

          {/* Split Application Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Sprout className="size-4.5 text-emerald-700" />
              Stage-by-Stage Split Application Schedule
            </h2>

            <div className="space-y-4">
              {plan.growth_stages_schedule.map((stage, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="size-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-black text-slate-900">
                        {stage.stage_name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                      Timing: {stage.timing}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Urea Dose</span>
                      <div className="text-sm font-black text-slate-900">{stage.urea_kg} kg</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">DAP Dose</span>
                      <div className="text-sm font-black text-slate-900">{stage.dap_kg} kg</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">MOP Potash</span>
                      <div className="text-sm font-black text-slate-900">{stage.mop_potash_kg} kg</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Additives:</strong> {stage.micronutrients}
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    <strong className="text-emerald-950">Agronomy Tip:</strong> {stage.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Organic Soil Amendments & Caution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200">
              <h3 className="text-sm font-black text-emerald-950 mb-3 flex items-center gap-2">
                <Leaf className="size-4 text-emerald-700" />
                Organic Amendments & Bio-Fertilizers
              </h3>
              <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed">
                {plan.organic_alternatives.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200">
              <h3 className="text-sm font-black text-amber-950 mb-3 flex items-center gap-2">
                <Info className="size-4 text-amber-700" />
                Soil Type Specific Advisory ({plan.soil_type})
              </h3>
              <div className="space-y-2 text-xs text-amber-900 leading-relaxed">
                <p><strong>Moisture Retention:</strong> {plan.soil_profile.retention}</p>
                <p><strong>Internal Drainage:</strong> {plan.soil_profile.drainage}</p>
                <p><strong>Organic Carbon Level:</strong> {plan.soil_profile.organic_carbon}</p>
                <p><strong>Soil pH Index:</strong> {plan.soil_profile.ph_range}</p>
                <p className="pt-2 border-t border-amber-200 font-bold text-amber-950">
                  ⚠️ {plan.soil_profile.caution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
