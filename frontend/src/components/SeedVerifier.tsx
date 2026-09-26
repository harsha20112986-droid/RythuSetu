import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Building,
  FileText,
} from "lucide-react";
import {
  type Farmer,
  type SeedVerificationResult,
  type SeedGrievanceRecord,
  API_BASE,
} from "../types";

export function SeedVerifier({
  farmer,
  onBack,
  language = "English",
}: {
  farmer: Farmer | null;
  onBack: () => void;
  language?: string;
}) {
  const [lotInput, setLotInput] = useState("SYNG-CHL-2609-5531");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedVerificationResult | null>(null);

  // Grievance Modal State
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [seedBrand, setSeedBrand] = useState("");
  const [failurePercent, setFailurePercent] = useState<number>(80);
  const [notes, setNotes] = useState("");
  const [filing, setFiling] = useState(false);
  const [filedRecord, setFiledRecord] = useState<SeedGrievanceRecord | null>(null);

  const isTelugu = language === "Telugu";

  const handleVerify = async (lotToTest?: string) => {
    const lot = (lotToTest || lotInput).trim();
    if (!lot) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seeds/verify-batch?lot_number=${encodeURIComponent(lot)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Verification failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setFiling(true);
    try {
      const res = await fetch(`${API_BASE}/seeds/report-spurious`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmer?.form.name || "Cultivator",
          phone: "9848012345",
          village: farmer?.form.village || "Local Village",
          district: farmer?.form.district || "Guntur",
          dealer_name: dealerName || "Local Fertilizer & Seed Shop",
          seed_brand: seedBrand || result?.lot_number || "Unlabeled Seeds",
          lot_number: result?.lot_number || lotInput,
          germination_failed_percent: Number(failurePercent) || 75,
          notes: notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFiledRecord(data);
        setShowGrievanceModal(false);
      }
    } catch (err) {
      console.error("Failed to file complaint", err);
    } finally {
      setFiling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
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
          <ShieldCheck className="w-3.5 h-3.5" />
          {isTelugu ? "విత్తన ధృవీకరణ & నకిలీ నిరోధక సెల్" : "Govt Seed Certification Cross-Check"}
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-teal-300" />
          <span>{isTelugu ? "నకిలీ విత్తనాలపై నిఘా" : "Seed & Fertilizer Authenticity Verifier"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isTelugu
            ? "విత్తన ప్యాకెట్ లాట్ నంబర్ తనిఖీ చేయండి"
            : "Verify Seed Lot Codes Before Sowing"}
        </h1>
        <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          {isTelugu
            ? "నకిలీ విత్తనాలు వాడటం వల్ల మొలక శాతం రాక రైతులు లక్షలాది రూపాయలు నష్టపోతున్నారు. మీ విత్తన ప్యాకెట్ పై ముద్రించిన లాట్ నంబర్‌ను ఇక్కడ సరిచూసుకోండి."
            : "Counterfeit seeds cause severe germination failure and ruined seasons. Enter the certified batch/lot code from your seed pouch to verify testing, purity, and validity."}
        </p>
      </div>

      {/* Complaint Filed Success Banner */}
      {filedRecord && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-md space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span>
              {isTelugu ? "ఫిర్యాదు వ్యవసాయ అధికారి (MAO) వద్ద నమోదైంది!" : "Grievance Lodged with Mandal Agriculture Officer (MAO)"}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-sm grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-xs text-gray-500 block">{isTelugu ? "ఫిర్యాదు ఐడీ" : "Complaint ID"}</span>
              <span className="font-mono font-bold text-emerald-700">{filedRecord.complaint_id}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">{isTelugu ? "డీలర్ పేరు" : "Dealer Reported"}</span>
              <span className="font-semibold text-gray-900">{filedRecord.dealer_name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">{isTelugu ? "చట్టపరమైన చర్య" : "Legal Action"}</span>
              <span className="text-xs text-gray-700 font-medium">{filedRecord.resolution_timeline}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Sample Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <label className="block text-sm font-bold text-gray-900">
          {isTelugu
            ? "విత్తన ప్యాకెట్‌పై ఉన్న లాట్ నంబర్ (Lot No.) నమోదు చేయండి:"
            : "Enter Seed Batch / Lot Number from Pouch Label:"}
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={lotInput}
              onChange={(e) => setLotInput(e.target.value.toUpperCase())}
              placeholder="e.g. SYNG-CHL-2609-5531 or NUZ-COT-2608-7201"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl text-base font-mono uppercase tracking-wide focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || !lotInput.trim()}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{isTelugu ? "తనిఖీ చేస్తోంది..." : "Checking..."}</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>{isTelugu ? "ప్రామాణికత తనిఖీ చేయండి" : "Verify Authenticity"}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            {isTelugu ? "ఉదాహరణ లాట్ నంబర్లు (పరీక్షించడానికి క్లిక్ చేయండి):" : "Sample Verified Lot Codes (Click to test):"}
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setLotInput("SYNG-CHL-2609-5531");
                handleVerify("SYNG-CHL-2609-5531");
              }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-medium hover:bg-emerald-100"
            >
              🌶️ Syngenta 5531 Chilli (Genuine)
            </button>
            <button
              onClick={() => {
                setLotInput("NUZ-COT-2608-7201");
                handleVerify("NUZ-COT-2608-7201");
              }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-medium hover:bg-emerald-100"
            >
              🌱 Nuziveedu Cotton (Genuine)
            </button>
            <button
              onClick={() => {
                setLotInput("TSSDC-PAD-2607-1010");
                handleVerify("TSSDC-PAD-2607-1010");
              }}
              className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-lg font-medium hover:bg-teal-100"
            >
              🌾 Telangana Sona (Govt Foundation)
            </button>
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  setLotInput("SPURIOUS-9999-FAKE");
                  handleVerify("SPURIOUS-9999-FAKE");
                }}
                className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-300 rounded-lg font-medium hover:bg-red-100"
              >
                ⚠️ Counterfeit / Spurious Simulation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className="animate-fade-in space-y-4">
          {result.is_genuine && result.batch_data ? (
            /* GENUINE RESULT CARD */
            <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                      {result.batch_data.authenticity_status}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900">
                      {isTelugu && result.batch_data.telugu_name
                        ? result.batch_data.telugu_name
                        : result.batch_data.brand_name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">Lot: {result.batch_data.lot_number}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">{isTelugu ? "ధృవీకరణ సంస్థ" : "Certified By"}</span>
                  <span className="text-xs font-bold text-gray-800">{result.batch_data.state_registry}</span>
                </div>
              </div>

              {/* Lab Quality Test Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-emerald-800 block font-medium">
                    {isTelugu ? "పరీక్షించిన మొలక శాతం" : "Tested Germination"}
                  </span>
                  <span className="text-2xl font-black text-emerald-800">
                    {result.batch_data.germination_tested_percent}%
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    (Govt Min: {result.batch_data.min_germination_standard}%)
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-gray-600 block font-medium">
                    {isTelugu ? "భౌతిక స్వచ్ఛత" : "Physical Purity"}
                  </span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    {result.batch_data.physical_purity_percent}%
                  </span>
                  <span className="text-[11px] text-gray-500 block">Weed Seed Free</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-gray-600 block font-medium">
                    {isTelugu ? "రసాయన విత్తన శుద్ధి" : "Chemical Treatment"}
                  </span>
                  <span className="text-xs font-bold text-gray-800 block mt-1 leading-snug">
                    {result.batch_data.treated_chemical}
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-center">
                  <span className="text-xs text-gray-600 block font-medium">
                    {isTelugu ? "గడువు తేదీ" : "Valid Until"}
                  </span>
                  <span className="text-sm font-bold text-gray-900 block mt-1">
                    {result.batch_data.valid_until}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Active Batch</span>
                </div>
              </div>

              {/* Producer & Field Advisory */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-800">
                    Producer: {result.batch_data.producer} ({result.batch_data.producer_license})
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-1 text-gray-700">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{isTelugu ? "రైతు సూచన" : "Farmer Sowing Note"}:</strong> {result.batch_data.advisory}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* COUNTERFEIT / UNKNOWN RESULT CARD */
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-200 text-red-900">
                    {result.authenticity_status}
                  </span>
                  <h3 className="text-xl font-extrabold text-red-900">
                    {result.warning_title || "Caution: Unregistered Seed Batch"}
                  </h3>
                  <p className="text-xs text-red-700 font-mono">Input Lot: {result.lot_number}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-red-200 text-sm text-gray-800 space-y-2 leading-relaxed">
                <p>
                  <strong>{isTelugu ? "ప్రమాద హెచ్చరిక" : "Danger"}</strong>:{" "}
                  {result.warning_details}
                </p>
                <p className="text-red-700 font-medium text-xs">
                  {result.action_required}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowGrievanceModal(true)}
                  className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {isTelugu
                      ? "వ్యవసాయ అధికారికి (MAO) నకిలీ విత్తన ఫిర్యాదు చేయండి"
                      : "File Spurious Seed Grievance with Agri Dept"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Spurious Seed Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-xl text-gray-900">
                  {isTelugu ? "నకిలీ విత్తనాల అధికారిక ఫిర్యాదు" : "File Spurious Seed Complaint (Seeds Act)"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Submitted to Mandal Agriculture Officer (MAO) for sample testing.
                </p>
              </div>
              <button
                onClick={() => setShowGrievanceModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFileComplaint} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTelugu ? "దుకాణం / డీలర్ పేరు" : "Fertilizer / Seed Dealer Name & Village"}
                </label>
                <input
                  type="text"
                  required
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  placeholder="e.g. Sri Balaji Agro Traders, Chilakaluripet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isTelugu ? "విత్తన బ్రాండ్ పేరు" : "Seed Brand Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={seedBrand}
                    onChange={(e) => setSeedBrand(e.target.value)}
                    placeholder="e.g. Hot Chilli Hybrid"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isTelugu ? "లాట్ నంబర్" : "Lot Code"}
                  </label>
                  <input
                    type="text"
                    value={lotInput}
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTelugu ? "మొలకెత్తని శాతం (%)" : "Germination Failure Rate (%)"}
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  required
                  value={failurePercent}
                  onChange={(e) => setFailurePercent(parseFloat(e.target.value) || 50)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTelugu ? "నష్ట వివరాలు / సూచనలు" : "Loss Description / Bill Details"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sowed in 2 acres nursery bed on 10th Sep, less than 20% sprouted. Dealer refused replacement."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100"
                >
                  {isTelugu ? "రద్దు" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={filing}
                  className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {filing
                    ? isTelugu
                      ? "సమర్పిస్తోంది..."
                      : "Submitting..."
                    : isTelugu
                    ? "ఫిర్యాదు నమోదు చేయండి"
                    : "Submit to MAO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
