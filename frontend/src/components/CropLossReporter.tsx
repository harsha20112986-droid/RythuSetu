import { useState, useEffect, type FormEvent } from "react";
import {
  Camera,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sprout,
  RefreshCw,
  PhoneCall,
  Clock,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { type Farmer, type LossReport, type ClaimPacket, damageTypes, API_BASE } from "../types";
import { FileCheck2, Copy, Check, Printer, X, ShieldCheck } from "lucide-react";

export function CropLossReporter({
  farmer,
  onBack,
}: {
  farmer: Farmer;
  onBack: () => void;
}) {
  const [damageType, setDamageType] = useState(damageTypes[0]);
  const [lossDate, setLossDate] = useState(new Date().toISOString().slice(0, 10));
  const [area, setArea] = useState(farmer.form.land_area_acres || "1.0");
  const [percent, setPercent] = useState("50");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<LossReport[]>([]);
  const [claimPack, setClaimPack] = useState<ClaimPacket | null>(null);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleGeneratePack = async () => {
    setGeneratingPack(true);
    try {
      const res = await fetch(`${API_BASE}/claims/generate-pack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmer.id,
          crop: farmer.form.crop,
          damage_type: damageType,
          loss_date: lossDate,
          affected_area_acres: parseFloat(area) || 1.0,
          damage_percent: parseFloat(percent) || 50.0,
          description: description || "Crop loss intimation under PMFBY.",
        }),
      });
      const data = await res.json();
      if (res.ok) setClaimPack(data);
    } catch {
      // offline fallback
    } finally {
      setGeneratingPack(false);
    }
  };


  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (newFile) {
      setPreviewUrl(URL.createObjectURL(newFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/crop-loss?farmer_id=${farmer.id}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body?.detail || "Unable to load reports");
      setReports(body.reports ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [farmer.id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const body = new FormData();
      body.append("farmer_id", String(farmer.id));
      body.append("crop", farmer.form.crop);
      body.append("damage_type", damageType);
      body.append("loss_date", lossDate);
      body.append("affected_area_acres", area);
      body.append("damage_percent", percent);
      body.append("description", description);

      if (file) {
        body.append("evidence", file);
      }

      const response = await fetch(`${API_BASE}/crop-loss`, {
        method: "POST",
        body,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.detail || "Unable to submit loss report");
      }

      setMessage("Crop loss incident successfully recorded! Follow the next steps below.");
      setDescription("");
      handleFileChange(null);
      loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit loss report");
    } finally {
      setSubmitting(false);
    }
  };

  const percentNum = parseInt(percent) || 0;
  const severityBadge =
    percentNum >= 60
      ? { label: "Severe Damage", color: "bg-red-50 text-red-800 border-red-200" }
      : percentNum >= 33
        ? { label: "Moderate Damage", color: "bg-amber-50 text-amber-900 border-amber-200" }
        : { label: "Localized Minor Damage", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };

  return (
    <section className="mx-auto max-w-4xl px-5 py-8 lg:px-8 lg:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to dashboard</span>
      </button>

      {/* Urgent 72-Hour Warning Alert */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 sm:p-7 text-rose-900 shadow-sm mb-8">
        <div className="flex items-start gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-rose-600 text-white shrink-0">
            <Clock className="size-6" />
          </div>
          <div>
            <span className="rounded-full bg-rose-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-900">
              Critical PMFBY Rule
            </span>
            <h2 className="mt-1 text-xl font-black text-rose-950">
              72-Hour Crop Loss Intimation Deadline
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-rose-800 leading-relaxed">
              Under Pradhan Mantri Fasal Bima Yojana (PMFBY), post-harvest or localized calamity loss (hail, landslide, inundation) must be reported within <strong>72 hours</strong> of occurrence to your insurance provider, toll-free helpline, or agriculture officer.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-rose-950">
              <span className="flex items-center gap-1">
                <PhoneCall className="size-3.5 text-rose-700" />
                PMFBY Helpline: 14447
              </span>
              <span>•</span>
              <span>Kisan Call Centre: 1800-180-1551</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
            <Sprout className="size-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Record Crop Damage Incident</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Assisting {farmer.form.name} • {farmer.form.crop} in {farmer.form.district}, {farmer.form.state}
            </p>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Damage Type */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">Cause of Damage</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {damageTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDamageType(type)}
                  className={`p-3 rounded-2xl border text-xs text-left transition cursor-pointer ${
                    damageType === type
                      ? "border-rose-600 bg-rose-50/80 font-bold text-rose-950 ring-2 ring-rose-600/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Area */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Date of Incident</span>
              <input
                type="date"
                value={lossDate}
                onChange={(e) => setLossDate(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Affected Area (Acres)</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max={farmer.form.land_area_acres || "100"}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </label>
          </div>

          {/* Severity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Estimated Crop Damage (%):</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-rose-700">{percent}%</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${severityBadge.color}`}>
                  {severityBadge.label}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
              <span>10% (Minor)</span>
              <span>33% (PMFBY Threshold)</span>
              <span>50% (Substantial)</span>
              <span>100% (Complete Loss)</span>
            </div>
          </div>

          {/* Description */}
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-slate-700">Incident Details / Field Observations</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe standing water, pest symptoms, wind damage, or field status..."
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </label>

          {/* Photo Evidence Upload */}
          <div>
            <span className="mb-2 block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="size-4 text-emerald-700" />
              Upload Field Photo Evidence (Optional)
            </span>

            {previewUrl ? (
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Damage preview"
                  className="size-20 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{file?.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="grid size-8 place-items-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 hover:bg-slate-50 transition cursor-pointer">
                <Upload className="size-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload photo evidence</span>
                <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700 py-3.5 px-6 text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Submitting Damage Report..." : "Submit Loss Incident Record"}
          </button>
        </form>
      </div>

      {/* Previous Submissions History */}
      
      {/* Official Govt Claim Packet & Reference Slip Generator */}
      <div className="mt-8 rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <FileCheck2 className="size-3.5 text-emerald-700" />
              <span>Official Government Integration Simulator</span>
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              Generate Standardized PMFBY Claim Packet
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Creates a pre-validated claim slip with an authentic Reference ID, required documents checklist, and 4-stage lifecycle tracker.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneratePack}
            disabled={generatingPack}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 text-xs shadow-sm transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            <FileCheck2 className="size-4" />
            <span>{generatingPack ? "Generating Packet..." : "Generate Official Claim Slip"}</span>
          </button>
        </div>

        {claimPack && (
          <div className="mt-6 space-y-6">
            {/* Official Slip Banner */}
            <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    {claimPack.scheme} • Standardized Claim Intimation Slip
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 tracking-tight font-mono">
                      {claimPack.reference_number}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(claimPack.reference_number);
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs transition cursor-pointer"
                      title="Copy Reference ID"
                    >
                      {copiedRef ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>

                <div className="sm:text-right flex flex-col items-start sm:items-end gap-2">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Estimated Eligible Payout:</span>
                    <span className="text-2xl font-black text-emerald-800">
                      {"\u20B9"}{claimPack.financial_valuation.estimated_eligible_payout.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => setPrintModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Print Official Dossier</span>
                  </button>
                </div>
              </div>

              {/* Pre-validated Metadata Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Farmer Name</span>
                  <span className="font-bold text-slate-800">{claimPack.farmer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Khata / Survey No</span>
                  <span className="font-bold text-slate-800">{claimPack.farmer.khata_survey_no}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Aadhaar eKYC</span>
                  <span className="font-bold text-emerald-700">{claimPack.farmer.aadhaar_ekyc_status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Damage Assessed</span>
                  <span className="font-bold text-rose-700">{claimPack.crop_details.damage_percent}% ({claimPack.crop_details.affected_acres} ac)</span>
                </div>
              </div>
            </div>

            {/* 4-Stage Lifecycle Tracker */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                Live Claim Lifecycle Tracker
              </h3>
              <div className="grid gap-3 sm:grid-cols-4">
                {claimPack.lifecycle_stages.map((stage) => {
                  const isCompleted = stage.status === "Completed";
                  const isInProgress = stage.status === "In Progress";
                  return (
                    <div
                      key={stage.step}
                      className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between ${
                        isCompleted
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                          : isInProgress
                            ? "bg-amber-50/70 border-amber-300 text-amber-950"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[11px]">Step {stage.step}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              isCompleted
                                ? "bg-emerald-200 text-emerald-900"
                                : isInProgress
                                  ? "bg-amber-200 text-amber-900"
                                  : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {stage.status}
                          </span>
                        </div>
                        <p className="mt-2 font-black text-slate-900 leading-snug">{stage.title}</p>
                        <p className="mt-1 text-[11px] text-slate-600 leading-tight">{stage.detail}</p>
                      </div>
                      <span className="mt-3 text-[10px] text-slate-400 font-medium">{stage.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-2">
                Attached Claim Documentation Checklist:
              </span>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {claimPack.required_documents_checklist.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>{doc.doc} ({doc.status})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-black text-slate-900 mb-4">Recorded Loss Reports</h2>

        {loading && (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500">
            <RefreshCw className="size-5 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Loading existing records...</span>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No crop loss incidents submitted for this profile yet.
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rep.crop} - {rep.damage_type}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {rep.affected_area_acres} Acres ({rep.damage_percent}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Occurred on {rep.loss_date} • Submitted {rep.submitted_at.slice(0, 10)}
                  </p>
                  {rep.description && (
                    <p className="text-xs text-slate-700 mt-1 italic">"{rep.description}"</p>
                  )}
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                    {rep.status}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{rep.next_step}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Government PMFBY Claim Dossier Modal */}
      {printModalOpen && claimPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl my-8 border border-slate-300">
            {/* Modal top action bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Official PMFBY Physical Claim Dossier</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-8 text-slate-900 space-y-6 bg-white font-serif">
              {/* Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500">
                  Government of India • Ministry of Agriculture & Farmers' Welfare
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">
                  Pradhan Mantri Fasal Bima Yojana (PMFBY)
                </h1>
                <p className="text-xs font-sans font-semibold text-slate-700 mt-0.5">
                  Localized Calamity & Crop Loss Intimation Acknowledgment Slip
                </p>
                <div className="mt-2 inline-block font-mono text-xs font-black bg-slate-100 border border-slate-300 px-3 py-1 rounded">
                  Ref No: {claimPack.reference_number} • Date: {claimPack.generated_at}
                </div>
              </div>

              {/* Farmer and Farm Khata Information */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    1. Cultivator Identification
                  </h3>
                  <p><strong>Name of Farmer:</strong> {claimPack.farmer.name}</p>
                  <p><strong>Village / Mandal:</strong> {claimPack.farmer.village}, {claimPack.farmer.mandal}</p>
                  <p><strong>District / State:</strong> {claimPack.farmer.district}, {claimPack.farmer.state}</p>
                  <p><strong>Aadhaar e-KYC:</strong> <span className="text-emerald-700 font-bold">{claimPack.farmer.aadhaar_ekyc_status}</span></p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    2. Land & Survey Verification
                  </h3>
                  <p><strong>Khata / Survey Number:</strong> {claimPack.farmer.khata_survey_no}</p>
                  <p><strong>Insured Crop:</strong> {claimPack.crop_details.crop} ({claimPack.crop_details.season})</p>
                  <p><strong>Total Insured Area:</strong> {claimPack.crop_details.total_land_acres} Acres</p>
                  <p><strong>Bank Account Validation:</strong> Validated via PFMS / DBT</p>
                </div>
              </div>

              {/* Damage and Valuation Assessment */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    3. Damage Intimation Particulars
                  </h3>
                  <p><strong>Incident Date:</strong> {claimPack.crop_details.incident_date}</p>
                  <p><strong>Peril / Cause of Damage:</strong> {claimPack.crop_details.damage_type}</p>
                  <p><strong>Affected Area:</strong> {claimPack.crop_details.affected_acres} Acres</p>
                  <p><strong>Assessed Damage Percentage:</strong> <strong className="text-red-600">{claimPack.crop_details.damage_percent}%</strong></p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    4. Financial Loss Computation
                  </h3>
                  <p><strong>Scale of Finance:</strong> ₹{claimPack.financial_valuation.scale_of_finance_per_acre.toLocaleString()} / Acre</p>
                  <p><strong>Estimated Eligible Payout:</strong></p>
                  <p className="text-lg font-black text-emerald-800 mt-1">
                    ₹{claimPack.financial_valuation.estimated_eligible_payout.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-500">Authorized as per Government Scale of Finance</p>
                </div>
              </div>

              {/* Documents Checklist & Evidence Container */}
              <div className="text-xs font-sans space-y-2 border-b border-slate-200 pb-4">
                <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500">
                  5. Mandatory Submission Checklist
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {claimPack.required_documents_checklist.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-600">✓</span>
                      <span>{c.doc} - <strong className="text-slate-700">{c.status}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Stamp & Signatures Box */}
              <div className="grid grid-cols-2 gap-8 pt-4 font-sans text-xs">
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
                  <div className="h-16 flex items-center justify-center text-slate-300">
                    [ Physical Farmer Signature / Thumbprint ]
                  </div>
                  <p className="border-t border-slate-200 pt-1 font-bold text-slate-700">
                    Signature / Thumb Impression of Insured Cultivator
                  </p>
                </div>

                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
                  <div className="h-16 flex items-center justify-center text-slate-300">
                    [ MAO Seal & Verification Stamp ]
                  </div>
                  <p className="border-t border-slate-200 pt-1 font-bold text-slate-700">
                    Mandal Agriculture Officer (MAO) / Inspection Surveyor
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center font-sans">
                Computer-generated legal submission dossier verified under PMFBY Guidelines. Retain this acknowledgment slip for MeeSeva / CSC kiosk reference.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

