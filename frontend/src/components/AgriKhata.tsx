import { useState, useEffect } from "react";
import {
  Calculator,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  RefreshCw,
} from "lucide-react";
import {
  type Farmer,
  type KhataTemplate,
  type KhataCalculation,
  API_BASE,
} from "../types";

export function AgriKhata({
  farmer,
  onBack,
  language = "English",
}: {
  farmer: Farmer | null;
  onBack: () => void;
  language?: string;
}) {
  const [selectedCrop, setSelectedCrop] = useState(farmer?.form.crop || "Red Chilli");
  const [acres, setAcres] = useState<number>(
    farmer?.form.land_area_acres ? parseFloat(farmer.form.land_area_acres) || 1.0 : 1.0
  );
  const [template, setTemplate] = useState<KhataTemplate | null>(null);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [yieldPerAcre, setYieldPerAcre] = useState<number>(20.0);
  const [offeredPrice, setOfferedPrice] = useState<number>(18500);
  const [calculation, setCalculation] = useState<KhataCalculation | null>(null);

  const isTelugu = language === "Telugu";

  // Expense display labels mapping
  const expenseLabels: Record<string, { en: string; te: string }> = {
    land_preparation: { en: "Land Preparation & Plowing", te: "దుక్కి & ట్రాక్టర్ ఖర్చు" },
    seed_nursery: { en: "Seeds & Nursery Raising", te: "విత్తనాలు & నారు పెంపకం" },
    fertilizers: { en: "Fertilizers (DAP, Urea, Potash)", te: "రసాయన ఎరువులు (NPK)" },
    pesticides_plant_protection: { en: "Pesticides & Foliar Sprays", te: "పురుగు మందుల పిచికారీ" },
    irrigation_electricity: { en: "Irrigation & Motor Electricity", te: "నీటిపారుదల & కరెంటు" },
    weeding_intercultural: { en: "Weeding & Intercultural Labor", te: "కలుపు తీత & కూలీలు" },
    harvesting_picking_labor: { en: "Harvesting & Picking Labor", te: "కోత & పంట ఏరివేత కూలీలు" },
    post_harvest_drying_bags: { en: "Drying Yard & Gunny Bags", te: "కల్లం ఆరబెట్టుడు & గోతాలు" },
    transport_to_mandi: { en: "Transport to Mandi / Yard", te: "మార్కెట్ రవాణా ఖర్చు" },
  };

  const loadTemplate = async (crop: string) => {
    try {
      const res = await fetch(`${API_BASE}/khata/template?crop=${encodeURIComponent(crop)}`);
      if (res.ok) {
        const data: KhataTemplate = await res.json();
        setTemplate(data);
        setExpenses(data.expenses || {});
        setYieldPerAcre(data.default_yield_quintals || 20.0);
        setOfferedPrice(data.standard_market_price_inr || 15000);
      }
    } catch (e) {
      console.error("Failed to load khata template", e);
    }
  };

  useEffect(() => {
    loadTemplate(selectedCrop);
  }, [selectedCrop]);

  const runCalculation = async () => {
    try {
      const res = await fetch(`${API_BASE}/khata/calculate-breakeven`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          acres: acres,
          expenses: expenses,
          expected_yield_quintals: yieldPerAcre,
          expected_market_price_per_qtl: offeredPrice,
        }),
      });

      if (res.ok) {
        const data: KhataCalculation = await res.json();
        setCalculation(data);
      }
    } catch (err) {
      console.error("Calculation failed", err);
    }
  };

  useEffect(() => {
    if (Object.keys(expenses).length > 0) {
      runCalculation();
    }
  }, [expenses, acres, yieldPerAcre, offeredPrice]);

  const handleExpenseChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setExpenses((prev) => ({
      ...prev,
      [key]: num,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isTelugu ? "హోమ్‌కు తిరిగి వెళ్ళండి" : "Back to Home"}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <Calculator className="w-3.5 h-3.5" />
          {isTelugu ? "డిజిటల్ వ్యవసాయ ఖాటా & గిట్టుబాటు ధర" : "Digital Khata & Breakeven Guard"}
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{isTelugu ? "రైతు ఆర్థిక రక్షణ కవచం" : "Anti-Distress Sale Advisory"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isTelugu
            ? "మీ పంట అసలు ఖర్చు ఎంత? ఎంత ధరకు అమ్మాలి?"
            : "Know Your True Cultivation Cost & Breakeven Selling Price"}
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          {isTelugu
            ? "దళారులు ఇచ్చే తక్కువ ధరకు అమ్మి మోసపోకండి. విత్తనాలు, ఎరువులు, కూలీలు కలిపి ఎకరాకు ఎంత ఖర్చయిందో లెక్కించి, నష్టం రాకుండా కనీస విక్రయ ధరను తెలుసుకోండి."
            : "Middlemen often buy produce below cultivation costs during peak harvest. Input your field expenses to discover your exact breakeven price per quintal and minimum fair target price."}
        </p>
      </div>

      {/* Inputs Configuration Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            {isTelugu ? "పంటను ఎంచుకోండి" : "Crop Selected"}
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Red Chilli">Red Chilli (తేజా / బైదగి మిరప)</option>
            <option value="Cotton">BT Cotton (పత్తి)</option>
            <option value="Paddy">Paddy / Rice (వరి)</option>
            <option value="Maize">Maize (మొక్కజొన్న)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            {isTelugu ? "సాగు భూమి (ఎకరాలు)" : "Cultivated Area (Acres)"}
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={acres}
            onChange={(e) => setAcres(parseFloat(e.target.value) || 1.0)}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            {isTelugu ? "ఎకరాకు ఆశించిన దిగుబడి (క్వింటాళ్లు)" : "Expected Yield (Qtl / Acre)"}
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            value={yieldPerAcre}
            onChange={(e) => setYieldPerAcre(parseFloat(e.target.value) || 10.0)}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Granular Expense Ledger (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <span>
                  {isTelugu ? "ఎకరా ఖర్చుల పట్టిక (సవరించవచ్చు)" : "Field Expense Breakdown (1 Acre Basis)"}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                {isTelugu ? "మీ వాస్తవ ఖర్చులను ఇక్కడ మార్చవచ్చు" : "Pre-filled with AP/TS field norms. Edit to match your actual expenses."}
              </p>
            </div>
            <button
              onClick={() => loadTemplate(selectedCrop)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isTelugu ? "యథావిధిగా ఉంచు" : "Reset Default"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(expenses).map(([key, val]) => {
              const labelObj = expenseLabels[key] || { en: key, te: key };
              const displayLabel = isTelugu ? labelObj.te : labelObj.en;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-emerald-50/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1">
                    {displayLabel}
                  </span>
                  <div className="relative w-32 sm:w-40">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 text-right focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Cultivation Cost Pill */}
          {calculation && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2 mt-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase block">
                  {isTelugu ? `మొత్తం సాగు పెట్టుబడి (${acres} ఎకరాలు)` : `Total Cultivation Expense (${acres} Acres)`}
                </span>
                <span className="text-2xl font-black text-emerald-900">
                  ₹{calculation.total_cost.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">
                  {isTelugu ? "ఎకరాకు సగటు ఖర్చు" : "Cost per Acre"}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  ₹{calculation.cost_per_acre.toLocaleString()} / acre
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Breakeven & Distress Sale Simulator (Right col) */}
        {calculation && (
          <div className="space-y-6">
            {/* Breakeven Price Card */}
            <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 shadow-md space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
                {isTelugu ? "కనీస ఉత్పత్తి ఖర్చు (బ్రేక్-ఈవెన్)" : "Production Cost (Breakeven Price)"}
              </span>

              <div className="bg-emerald-900 text-white p-4 rounded-xl text-center shadow-inner">
                <span className="text-xs text-emerald-300 block mb-0.5">
                  {isTelugu ? "ఈ ధర కంటే తక్కువకు ఎట్టిపరిస్థితుల్లో అమ్మవద్దు" : "NEVER SELL BELOW THIS BENCHMARK"}
                </span>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-yellow-300">
                  ₹{calculation.breakeven_per_qtl.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-200 block mt-1">
                  / quintal ({isTelugu ? "క్వింటాలుకు" : "per quintal"})
                </span>
              </div>

              {/* Recommended Fair Price */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    {isTelugu ? "స్వామినాథన్ ఫార్ములా న్యాయమైన ధర" : "Fair Target Price (C2 + 50%)"}:
                  </span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{calculation.fair_target_price_per_qtl.toLocaleString()} / qtl
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>{isTelugu ? "మొత్తం దిగుబడి" : "Total Expected Yield"}:</span>
                  <span className="font-bold text-gray-800">{calculation.total_yield_quintals} quintals</span>
                </div>
              </div>

              {/* Distress Sale Simulator Box */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  {isTelugu
                    ? "దళారి / వ్యాపారి ఇచ్చిన ధరను నమోదు చేయండి:"
                    : "Enter Trader's Offered Price per Quintal:"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-xl text-base font-extrabold text-gray-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                {/* Profit / Distress Verdict */}
                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    calculation.is_distress_loss
                      ? "bg-red-50 border-red-400 text-red-950"
                      : "bg-emerald-50 border-emerald-400 text-emerald-950"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm mb-1">
                    {calculation.is_distress_loss ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    <span>{calculation.status_label}</span>
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {calculation.action_guidance}
                  </p>

                  <div className="mt-3 pt-2 border-t border-gray-200/60 flex justify-between items-center text-xs">
                    <span className="font-semibold">
                      {calculation.is_distress_loss
                        ? isTelugu
                          ? "నికర నష్టం"
                          : "Net Loss"
                        : isTelugu
                        ? "నికర లాభం"
                        : "Net Profit"}
                      :
                    </span>
                    <span
                      className={`text-sm font-black ${
                        calculation.is_distress_loss ? "text-red-700" : "text-emerald-800"
                      }`}
                    >
                      {calculation.net_profit >= 0 ? "+" : ""}
                      ₹{calculation.net_profit.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Storage Suggestion if in Distress */}
                {calculation.is_distress_loss && template?.storage_alternative && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-amber-800">
                      <Building2 className="w-3.5 h-3.5" />
                      {isTelugu ? "ప్రత్యామ్నాయ భద్రపరిచే మార్గం" : "Storage & Loan Alternative"}:
                    </span>
                    <p className="leading-snug">{template.storage_alternative}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Telugu Specific Guidance Box */}
      {template?.advisory_te && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-sm font-medium text-emerald-950 flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-xs text-emerald-900 mb-0.5">
              రైతు సోదరులకు సూచన:
            </span>
            <p>{template.advisory_te}</p>
          </div>
        </div>
      )}
    </div>
  );
}
