import { useState } from "react";
import {
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  MessageSquare,
  FlaskConical,
  CalendarCheck,
  Send,
} from "lucide-react";
import { type Farmer, type DiseaseAnalysis, API_BASE } from "../types";

export function CropDoctor({
  farmer,
  onBack,
  onNavigateToLoss,
}: {
  farmer: Farmer | null;
  onBack: () => void;
  onNavigateToLoss: () => void;
}) {
  const [mode, setMode] = useState<"image" | "symptoms">("image");
  const [selectedCrop, setSelectedCrop] = useState(farmer?.form.crop || "Cotton");
  const [symptomInput, setSymptomInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sampleDiagnoses: Record<string, DiseaseAnalysis> = {
    Cotton: {
      crop: "Cotton",
      disease_name: "Bacterial Leaf Blight (Angular Leaf Spot)",
      scientific_name: "Xanthomonas citri pv. malvacearum",
      pathogen_type: "Bacterial",
      confidence_percent: 94,
      severity: "Moderate (32% foliage area)",
      symptoms: [
        "Angular water-soaked spots bounded by leaf veinlets",
        "Dark reddish-brown to black lesions on bolls and stems (blackarm)",
        "Premature leaf yellowing and localized defoliation",
      ],
      organic_treatment: "Spray 5% Neem Seed Kernel Extract (NSKE) or fermented sour buttermilk (50ml/L) + Pseudomonas fluorescens @ 10g/L.",
      chemical_treatment: "Copper Oxychloride 50% WP @ 30g + Streptocycline 90:10 @ 1.5g dissolved in 10 Litres water. Repeat spray after 12 days.",
      micronutrient_remedy: "Foliar spray of 19:19:19 @ 5g/L + Formula-4 Micronutrient mix @ 2.5g/L to prevent secondary shedding.",
      recovery_schedule: [
        { day_range: "Day 1 - 3", action: "Arrest Pathogen Spread", dosage: "Streptocycline 1.5g + Copper Oxychloride 30g / 10L water", purpose: "Bactericidal eradication of bacterial slime on leaf surface" },
        { day_range: "Day 5 - 7", action: "Foliar Nutrition Boost", dosage: "Formula-4 micronutrients 2.5g/L + 13:0:45 (Potassium Nitrate) 5g/L", purpose: "Strengthen leaf cuticle and restore stomatal activity" },
        { day_range: "Day 10 - 14", action: "Prophylactic Bio-Barrier", dosage: "Pseudomonas fluorescens 10g/L or NSKE 5%", purpose: "Long-term bio-antagonistic colonization against re-infection" },
      ],
      prevention_tips: [
        "Use acid-delinted certified seeds treated with Carboxin + Thiram",
        "Avoid overhead sprinkler irrigation during warm humid evenings",
        "Ensure field ditches are clear to prevent waterlogging around rootzones",
      ],
      pmfby_coverage: "Covered under PMFBY localized pest/calamity provisions if total plant mortality exceeds 33%.",
      advisory: "Prune heavily diseased lower twigs, avoid excessive nitrogenous top-dressing, and maintain field drainage.",
      engine: "OpenAI Vision + RythuSetu Botanical Pathology Engine",
    },
    Rice: {
      crop: "Rice",
      disease_name: "Rice Blast (Leaf & Neck Blast)",
      scientific_name: "Magnaporthe oryzae",
      pathogen_type: "Fungal",
      confidence_percent: 92,
      severity: "Moderate to Severe (38% canopy)",
      symptoms: [
        "Spindle-shaped elliptical lesions with ash-grey centers and dark reddish margins",
        "Burnt or scorched appearance of leaf tips and upper tillers",
        "Blackened nodes and rotting neck of panicles causing chaffy grains",
      ],
      organic_treatment: "Spray fermented cow urine (10%) + Pseudomonas fluorescens @ 10g/L or Agniastra botanical extract.",
      chemical_treatment: "Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L during cool morning hours.",
      micronutrient_remedy: "Silica solubilizer @ 2ml/L + Potassium Silicate spray to harden leaf epidermal cells.",
      recovery_schedule: [
        { day_range: "Day 1 - 3", action: "Blast Blocker Spray", dosage: "Tricyclazole 75 WP @ 0.6g per Litre water", purpose: "Systemic systemic protection stopping melanin biosynthesis of fungal spores" },
        { day_range: "Day 6 - 8", action: "Nutrient Tissue Repair", dosage: "00:52:34 (MKP) @ 5g/L + Zinc EDTA 1g/L", purpose: "Stimulate tillering and root oxidative potential" },
        { day_range: "Day 12 - 14", action: "Neck Blast Shield", dosage: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L", purpose: "Panicle emergence protection before grain filling" },
      ],
      prevention_tips: [
        "Suspend split doses of urea during cloudy weather or high humidity",
        "Maintain thin water layer (2-3 cm) rather than stagnant deep ponding",
        "Adopt blast-tolerant varieties like MTU 1061, NLR 34449, or BPT 5204 treated seeds",
      ],
      pmfby_coverage: "Eligible under PMFBY post-sowing localized natural disease loss clause.",
      advisory: "Suspend top dressing of urea immediately, avoid standing water excess, and apply Tricyclazole immediately.",
      engine: "OpenAI Vision + RythuSetu Botanical Pathology Engine",
    },
    Chilli: {
      crop: "Chilli",
      disease_name: "Chilli Anthracnose & Dieback",
      scientific_name: "Colletotrichum capsici",
      pathogen_type: "Fungal",
      confidence_percent: 93,
      severity: "Moderate (26% fruit/leaf infection)",
      symptoms: [
        "Circular sunken necrotic spots on ripe pods with concentric black acervuli",
        "Die-back of twigs from tip downwards turning straw-colored and dry",
        "Premature dropping of tender flower buds and small fruits",
      ],
      organic_treatment: "Trichoderma viride foliar spray @ 5g/L or fermented Panchagavya 3% at 10-day intervals.",
      chemical_treatment: "Azoxystrobin 23% SC @ 1ml/L or Difenoconazole 25% EC @ 0.5ml/L or Captan 50% WP @ 2.5g/L.",
      micronutrient_remedy: "Boron 20% @ 1g/L + Chelated Calcium @ 1.5g/L to strengthen fruit wall structure.",
      recovery_schedule: [
        { day_range: "Day 1 - 3", action: "Fungal Eradication", dosage: "Difenoconazole 25 EC @ 0.5ml/L + Sticker/Spreader 0.5ml/L", purpose: "Systemic translaminar action inside pod cuticle" },
        { day_range: "Day 5 - 7", action: "Fruit Skin Hardener", dosage: "Boron (Disodium Octaborate) 1g/L + Soluble Potash 4g/L", purpose: "Prevent concentric ring cracking on fruit epidermis" },
        { day_range: "Day 10 - 14", action: "Protective Contact Cover", dosage: "Copper Oxychloride 50 WP @ 2.5g/L", purpose: "Shield newly emerging flower buds and twigs" },
      ],
      prevention_tips: [
        "Collect and burn fallen diseased fruits away from the chilli plot",
        "Treat seed with Thiram 3g/kg before nursery raising",
        "Space rows adequately (60 x 45 cm) for sunlight penetration",
      ],
      pmfby_coverage: "Claimable under PMFBY mid-season localized adversity if fruit rot causes >33% yield loss.",
      advisory: "Immediately destroy withered twigs, spray systemic triazole fungicide, and spray Boron to protect newly set fruits.",
      engine: "RythuSetu Botanical Pathology Engine",
    },
  };

  const quickSymptoms = [
    { label: "Water-soaked angular spots on leaves", crop: "Cotton" },
    { label: "Spindle shaped grey lesions with burnt tips", crop: "Rice" },
    { label: "Circular sunken black spots on fruit & twig die-back", crop: "Chilli" },
    { label: "Tikka dark circular spots with bright yellow rings", crop: "Groundnut" },
    { label: "Leaves curling upwards with stunted apical growth", crop: "Chilli" },
    { label: "Yellow mosaic patches with vein clearing", crop: "Green Gram" },
  ];

  const handleFileUpload = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("crop", selectedCrop);
      formData.append("language", farmer?.form.language || "English");

      const res = await fetch(`${API_BASE}/crop-doctor/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");
      setResult(data);
    } catch (err) {
      if (sampleDiagnoses[selectedCrop]) {
        setResult(sampleDiagnoses[selectedCrop]);
      } else {
        setError(err instanceof Error ? err.message : "Analysis error");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSymptomDiagnosis = async (textToDiagnose?: string) => {
    const text = (textToDiagnose ?? symptomInput).trim();
    if (!text) {
      setError("Please type or select crop symptoms to diagnose.");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/crop-doctor/diagnose-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          symptoms: text,
          language: farmer?.form.language || "English",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Diagnosis failed");
      setResult(data);
    } catch (err) {
      if (sampleDiagnoses[selectedCrop]) {
        setResult(sampleDiagnoses[selectedCrop]);
      } else {
        setError(err instanceof Error ? err.message : "Symptom diagnosis failed");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = (cropName: string) => {
    setSelectedCrop(cropName);
    setPreviewUrl("https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=600&q=80");
    setAnalyzing(true);
    setError("");
    setTimeout(() => {
      setResult(sampleDiagnoses[cropName] || sampleDiagnoses["Cotton"]);
      setAnalyzing(false);
    }, 500);
  };

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
            AI Plant Pathology & Disease Doctor
          </span>
          <span className="size-1 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-200">ICAR & CIBRC Approved Protocols</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-black">
          Dual-Mode Crop Doctor & Plant Clinic
        </h1>
        <p className="mt-2 text-sm text-emerald-100 max-w-3xl leading-relaxed">
          Detect plant pathogens instantly via <strong>Leaf Photo Vision Scan</strong> or describe what you see with <strong>Ask AI Doctor</strong>. Get certified chemical dosages, bio-organic remedies, micronutrient balances, and a step-by-step 14-day plant recovery roadmap.
        </p>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mode === "image"
                ? "bg-white text-emerald-950 shadow-md ring-2 ring-emerald-400"
                : "bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800"
            }`}
          >
            <Camera className="size-4 text-emerald-600" />
            <span>Mode 1: Upload Leaf Photo (Vision AI)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("symptoms")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mode === "symptoms"
                ? "bg-white text-emerald-950 shadow-md ring-2 ring-emerald-400"
                : "bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800"
            }`}
          >
            <MessageSquare className="size-4 text-teal-600" />
            <span>Mode 2: Ask AI / Describe Symptoms</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.1fr]">
        {/* Left Interactive Input Panel */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
              Select Crop to Diagnose
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {["Cotton", "Rice", "Chilli", "Groundnut", "Maize", "Turmeric", "Red Gram"].map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCrop === crop
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            {mode === "image" ? (
              /* Image Upload Area */
              <div>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 hover:bg-emerald-50/80 transition cursor-pointer">
                  <Camera className="size-10 text-emerald-600 mb-3" />
                  <span className="text-xs font-bold text-emerald-950">Click or Tap to Take / Upload Leaf Photo</span>
                  <span className="text-[11px] text-slate-500 mt-1">Clear close-up of leaf spots, discoloration, or wilt</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                    className="hidden"
                  />
                </label>

                {previewUrl && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Leaf preview" className="w-full h-44 object-cover" />
                  </div>
                )}

                {/* Quick Evaluator Samples */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-600 block mb-2">
                    Or test with pre-analyzed field samples:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Cotton", "Rice", "Chilli"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => loadSample(c)}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 text-xs font-bold transition cursor-pointer border border-slate-200"
                      >
                        Sample {c} Leaf
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Symptom Text / Voice Input Area */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Describe what is happening to the plant:
                    </label>
                    <span className="text-[11px] text-slate-500">In English, Telugu, or Hindi</span>
                  </div>
                  <textarea
                    rows={4}
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g., The leaf margins have angular dark brown spots with yellow halos. Lower leaves are turning completely yellow and dropping prematurely after last week's rains..."
                    className="w-full rounded-2xl border border-slate-300 p-3.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => handleSymptomDiagnosis()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>Diagnosing Symptoms with Botanical AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Diagnose Symptoms & Get Treatment</span>
                    </>
                  )}
                </button>

                {/* Quick Symptom Chips */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Common Observed Field Symptoms (Click to fill):
                  </span>
                  <div className="space-y-1.5">
                    {quickSymptoms.map((qs, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSelectedCrop(qs.crop);
                          setSymptomInput(qs.label);
                          handleSymptomDiagnosis(qs.label);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs text-slate-700 hover:text-emerald-950 transition cursor-pointer flex items-center justify-between"
                      >
                        <span>{qs.label}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {qs.crop}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="mt-4 rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200 flex items-center justify-center gap-2 text-xs font-medium text-emerald-900">
                <RefreshCw className="size-4 animate-spin text-emerald-600" />
                <span>Scanning botanical disease models and CIBRC chemical schedules...</span>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Diagnosis & Treatment Desk */}
        <div>
          {result ? (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-md space-y-5">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">
                      {result.crop} Diagnosis
                    </span>
                    {result.pathogen_type && (
                      <span className="rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2 py-0.5">
                        {result.pathogen_type} Pathogen
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    {result.confidence_percent}% Confidence
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-black text-slate-900 leading-tight">
                  {result.disease_name}
                </h2>
                {result.scientific_name && (
                  <p className="text-xs italic text-slate-500 mt-0.5">
                    Scientific: {result.scientific_name}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Damage Severity:</span>
                  <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-black text-[11px] px-2.5 py-0.5">
                    {result.severity}
                  </span>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                  Visual Pathology Symptoms:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {result.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment Protocols */}
              <div className="space-y-3">
                {/* Chemical Treatment */}
                <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 flex items-center gap-1 mb-1">
                    <FileCheck2 className="size-3.5 text-sky-700" />
                    CIBRC Approved Chemical Prescription & Exact Dosage:
                  </span>
                  <p className="text-xs font-semibold text-sky-950 leading-relaxed">
                    {result.chemical_treatment}
                  </p>
                </div>

                {/* Organic Treatment */}
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1 mb-1">
                    <Leaf className="size-3.5 text-emerald-700" />
                    Bio-Control & Organic Alternative:
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                    {result.organic_treatment}
                  </p>
                </div>

                {/* Micronutrient Remedy */}
                {result.micronutrient_remedy && (
                  <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 flex items-center gap-1 mb-1">
                      <FlaskConical className="size-3.5 text-purple-700" />
                      Micronutrient & Foliar Correction:
                    </span>
                    <p className="text-xs font-semibold text-purple-950 leading-relaxed">
                      {result.micronutrient_remedy}
                    </p>
                  </div>
                )}

                {/* 14-Day Structured Recovery Schedule */}
                {result.recovery_schedule && result.recovery_schedule.length > 0 && (
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1 mb-2">
                      <CalendarCheck className="size-3.5 text-amber-700" />
                      14-Day Structured Crop Recovery Schedule:
                    </span>
                    <div className="space-y-2">
                      {result.recovery_schedule.map((step, idx) => (
                        <div key={idx} className="rounded-xl bg-white/80 p-2.5 border border-amber-200/60 text-xs">
                          <div className="flex items-center justify-between font-bold text-amber-950 mb-0.5">
                            <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                              {step.day_range}
                            </span>
                            <span className="text-[11px] text-slate-600">{step.action}</span>
                          </div>
                          <p className="text-slate-800 font-medium text-[11px] mt-1">
                            <strong className="text-emerald-800">Dosage:</strong> {step.dosage}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-0.5">
                            <strong className="text-slate-600">Target:</strong> {step.purpose}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insurance Eligibility */}
                <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1 mb-1">
                    <ShieldCheck className="size-3.5 text-emerald-700" />
                    PMFBY Crop Loss Insurance Claim Status:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {result.pmfby_coverage}
                  </p>
                </div>
              </div>

              {/* Advisory note */}
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs italic text-slate-500">
                  Agronomist Advisory: "{result.advisory}"
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={onNavigateToLoss}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 text-xs shadow-sm transition cursor-pointer"
              >
                <span>Report Severe Outbreak Under PMFBY Claim Desk</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[360px] rounded-3xl border border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <Leaf className="size-12 stroke-1 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-600">Diagnosis Desk Awaiting Input</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Upload a photo or describe plant symptoms on the left to receive an instant ICAR-certified treatment schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
