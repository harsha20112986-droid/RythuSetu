import { useState, useEffect } from "react";
import {
  CloudRain,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Layers,
} from "lucide-react";
import {
  type Farmer,
  type HarvestShieldData,
  API_BASE,
  ALL_STATES,
  getDistrictsForState,
} from "../types";

export function HarvestShield({
  farmer,
  onBack,
  language = "English",
}: {
  farmer: Farmer | null;
  onBack: () => void;
  language?: string;
}) {
  const [selectedState, setSelectedState] = useState(farmer?.form.state || "Andhra Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState(farmer?.form.district || "Guntur");
  const [selectedCrop, setSelectedCrop] = useState(farmer?.form.crop || "Red Chilli");
  const [shieldData, setShieldData] = useState<HarvestShieldData | null>(null);
  const [loading, setLoading] = useState(false);

  const isTelugu = language === "Telugu";
  const districts = getDistrictsForState(selectedState);

  const fetchHarvestShield = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        district: selectedDistrict,
        crop: selectedCrop,
      });
      const res = await fetch(`${API_BASE}/weather/harvest-shield?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setShieldData(data);
      }
    } catch (e) {
      console.error("Failed to fetch harvest shield data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestShield();
  }, [selectedDistrict, selectedCrop]);

  const isHighDanger = (shieldData?.risk_score || 0) >= 60;
  const isModerate = (shieldData?.risk_score || 0) >= 35 && (shieldData?.risk_score || 0) < 60;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-amber-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isTelugu ? "హోమ్‌కు తిరిగి వెళ్ళండి" : "Back to Home"}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <CloudRain className="w-3.5 h-3.5" />
          {isTelugu ? "కల్లం పంట రక్షణ & టార్పాలిన్ హెచ్చరిక" : "Drying Yard Weather Defense"}
        </span>
      </div>

      {/* Hero Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl shadow-xl text-white relative overflow-hidden transition-all ${
          isHighDanger
            ? "bg-gradient-to-r from-red-800 via-amber-800 to-red-950"
            : isModerate
            ? "bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900"
            : "bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950"
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
            {isHighDanger ? (
              <ShieldAlert className="w-4 h-4 text-amber-300" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            )}
            <span>
              {isTelugu ? "కల్లం (ఓపెన్ యార్డ్) రక్షణ వ్యవస్థ" : "Kallam (Open Yard) Crop Moisture Shield"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isTelugu
              ? "అకాల వర్షాల నుంచి ఆరబెట్టిన మిరప, ధాన్యం కాపాడుకోండి"
              : "Protect Harvested Crops from Unseasonal Rains & Mold"}
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            {isTelugu
              ? "కల్లాల్లో ఆరబెట్టిన ఎర్ర మిరప, వరి, పత్తి తడిస్తే రంగుమారి ధర 50% పడిపోతుంది. రాబోయే వర్ష సూచనను గమనించి టార్పాలిన్ పట్టాలతో సిద్ధంగా ఉండండి."
              : "Rain moisture on drying chillies or paddy destroys quality, sparks aflatoxin fungus, and slashes market rates. Get real-time rain risk & rent nearby waterproof tarpaulins."}
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-gray-600 uppercase">
              {isTelugu ? "ప్రాంతం" : "Location"}:
            </span>
          </div>

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              const newDists = getDistrictsForState(e.target.value);
              setSelectedDistrict(newDists[0] || "");
            }}
            className="text-sm font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
          >
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-sm font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            {isTelugu ? "ఆరబెడుతున్న పంట" : "Drying Crop"}:
          </span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-sm font-bold text-amber-900 border border-amber-300 bg-amber-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500"
          >
            <option value="Red Chilli">Red Chilli (ఎర్ర మిరప)</option>
            <option value="Paddy / Rice">Paddy / Rice (వరి ధాన్యం)</option>
            <option value="Cotton">Cotton (పత్తి)</option>
            <option value="Turmeric">Turmeric (పసుపు కొమ్ములు)</option>
            <option value="Maize">Maize (మొక్కజొన్న)</option>
          </select>
        </div>
      </div>

      {/* Main Advisory & Danger Card */}
      {loading ? (
        <div className="py-16 text-center text-gray-500">
          <Clock className="w-8 h-8 animate-spin mx-auto text-amber-600 mb-2" />
          <p>{isTelugu ? "వాతావరణ రాడార్ సమాచారం పరిశీలిస్తోంది..." : "Scanning weather radar for drying yards..."}</p>
        </div>
      ) : shieldData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Gauge Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  {isTelugu ? "కల్లం వర్ష ప్రమాద సూచిక" : "Drying Yard Moisture Hazard"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {shieldData.risk_score} / 100
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      isHighDanger
                        ? "bg-red-100 text-red-800"
                        : isModerate
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {shieldData.risk_level}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHighDanger ? "bg-red-600" : isModerate ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${shieldData.risk_score}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{isTelugu ? "ఎండబెట్టే అనుకూల సమయం" : "Optimal Sun Drying Hours"}:</span>
                  <span className="font-bold text-gray-900">{shieldData.recommended_drying_hours}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isTelugu ? "లక్ష్యిత తేమ శాతం" : "Safe Moisture Target"}:</span>
                  <span className="font-bold text-gray-900">{shieldData.critical_moisture_target}</span>
                </div>
              </div>
            </div>

            {/* Bilingual Emergency Advisory */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-base sm:text-lg">
                  {isTelugu ? "ప్రత్యక్ష హెచ్చరిక & సలహా" : "Real-time Protective Action Advisory"}
                </span>
              </div>

              {/* Telugu Card */}
              <div className="p-3.5 bg-amber-50/80 border-l-4 border-amber-600 rounded-r-xl text-sm font-medium text-amber-950 leading-relaxed">
                <span className="font-bold block text-xs text-amber-800 mb-1">తెలుగు సూచన:</span>
                {shieldData.advisory_te}
              </div>

              {/* English Card */}
              <div className="p-3.5 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl text-sm text-blue-950 leading-relaxed">
                <span className="font-bold block text-xs text-blue-800 mb-1">English Note:</span>
                {shieldData.advisory_en}
              </div>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>
                {isTelugu ? "కల్లంలో పంట భద్రతకు 4 బంగారు సూత్రాలు" : "4-Step Drying Yard Defense Protocol"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shieldData.protection_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2 hover:bg-emerald-50/40 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Tarpaulin Centers & Poly Sheets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-700" />
                  <span>
                    {isTelugu
                      ? "సమీప టార్పాలిన్ పట్టాల అద్దె & విక్రయ కేంద్రాలు"
                      : "Nearby Tarpaulin Waterproof Sheet Suppliers & Rental Banks"}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  {isTelugu
                    ? "వర్షం రాకముందే కిరాయికి తీసుకోండి లేదా సబ్సిడీతో కొనుగోలు చేయండి"
                    : "Rent heavy 200+ GSM tarpaulins per day or purchase government-certified sheets"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shieldData.tarpaulin_centers.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 text-base leading-snug">
                        {isTelugu && center.telugu_name ? center.telugu_name : center.supplier_name}
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        {center.distance_km} km
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{center.location}</span>
                    </p>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[11px]">
                          {isTelugu ? "రోజువారీ అద్దె" : "Daily Rental"}:
                        </span>
                        <span className="font-extrabold text-amber-900 text-sm">
                          ₹{center.rental_per_day_inr} / day
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">
                          {isTelugu ? "కొనుగోలు ధర" : "Purchase Price"}:
                        </span>
                        <span className="font-bold text-gray-900 text-sm">
                          ₹{center.purchase_price_inr}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-medium text-gray-700 block">
                        {isTelugu ? "అందుబాటులో ఉన్న కొలతలు" : "Available Sizes"}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {center.available_sizes.map((sz, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      {center.stock_status}
                    </div>
                  </div>

                  <a
                    href={`tel:${center.phone}`}
                    className="w-full mt-3 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isTelugu ? "పట్టాల కోసం ఫోన్ చేయండి" : "Call Tarpaulin Center"}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
