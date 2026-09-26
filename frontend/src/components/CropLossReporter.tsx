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
  FileCheck2,
  Copy,
  Check,
  Printer,
  X,
  ShieldCheck,
  ExternalLink,
  Save,
} from "lucide-react";
import { type Farmer, type LossReport, type ClaimPacket, damageTypes, API_BASE } from "../types";

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
  const [surveyNumber, setSurveyNumber] = useState(farmer.form.khata_survey_no || "");
  const [mandal, setMandal] = useState(farmer.form.mandal || "");
  const [village, setVillage] = useState(farmer.form.village || "");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<LossReport[]>([]);
  const [claimPack, setClaimPack] = useState<ClaimPacket | null>(null);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Self-status state for recording official references
  const [activeReportForRef, setActiveReportForRef] = useState<number | null>(null);
  const [selfRefInput, setSelfRefInput] = useState("");
  const [selfStatusInput, setSelfStatusInput] = useState("SUBMITTED_OFFICIAL");
  const [selfNotesInput, setSelfNotesInput] = useState("");
  const [savingSelfStatus, setSavingSelfStatus] = useState(false);

  const handleValidateCompleteness = async () => {
    setValidating(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/claims/validate-completeness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmer.id,
          crop: farmer.form.crop,
          damage_type: damageType,
          loss_date: lossDate,
          affected_area_acres: parseFloat(area) || 1.0,
          damage_percent: parseFloat(percent) || 50.0,
          survey_number: surveyNumber,
          village: village,
          has_photo_evidence: Boolean(file),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Validation failed");
      }
      setValidationResult(data);
    } catch (err: any) {
      setError(err.message || "Could not validate dossier completeness");
    } finally {
      setValidating(false);
    }
  };

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
      if (surveyNumber) body.append("survey_number", surveyNumber);
      if (mandal) body.append("mandal", mandal);
      if (village) body.append("village", village);

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

      setMessage(
        "Crop loss intimation dossier prepared successfully! Proceed to the official PMFBY portal (pmfby.gov.in) or call 14447 to complete your statutory filing."
      );
      if (result?.preparation_pack) {
        setClaimPack(result.preparation_pack);
      }
      setDescription("");
      handleFileChange(null);
      loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit loss report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSelfStatus = async (reportId: number) => {
    if (!selfRefInput.trim()) return;
    setSavingSelfStatus(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/claims/${reportId}/self-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmer.id,
          official_reference_number: selfRefInput.trim(),
          farmer_self_status: selfStatusInput,
          farmer_notes: selfNotesInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Failed to save official reference number");
      }
      setMessage("Official reference number and status updated in your records!");
      setActiveReportForRef(null);
      setSelfRefInput("");
      setSelfNotesInput("");
      loadReports();
      setTimeout(() => setMessage(""), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to update self-status");
    } finally {
      setSavingSelfStatus(false);
    }
  };

  const percentNum = parseInt(percent) || 0;
  const severityBadge =
    percentNum >= 60
      ? { label: "Severe Damage", color: "bg-red-50 text-red-800 border-red-200" }
      : percentNum >= 33
        ? { label: "Substantial Damage (PMFBY Threshold)", color: "bg-amber-50 text-amber-900 border-amber-200" }
        : { label: "Localized Minor Damage", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
              Statutory 72-Hour PMFBY Requirement
            </span>
            <h2 className="mt-1 text-xl font-black text-rose-950">
              PMFBY Crop Loss Intimation Assistant
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-rose-800 leading-relaxed">
              Under Pradhan Mantri Fasal Bima Yojana (PMFBY), post-harvest or localized calamity loss (hail, landslide, inundation) must be reported within <strong>72 hours</strong> directly to your insurance company or official government channels.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>Open PMFBY Portal (pmfby.gov.in)</span>
                <ExternalLink className="size-3.5" />
              </a>

              <a
                href="tel:14447"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-300 hover:bg-rose-100/50 text-rose-950 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
              >
                <PhoneCall className="size-3.5 text-rose-700" />
                <span>Call Kisan Insurance Helpline: 14447</span>
              </a>
            </div>

            <div className="mt-3 text-[11px] text-rose-700/90 font-medium">
              RythuSetu prepares your validated intimation pack for submission to the official channels above.
            </div>
          </div>
        </div>
      </div>

      {/* Main Preparation Form */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
            <Sprout className="size-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Crop Loss Preparation Dossier</h1>
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
          {/* Cause of Damage */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">Peril / Cause of Damage</label>
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
              <span className="mb-2 block text-xs font-bold text-slate-700">Date of Incident *</span>
              <input
                type="date"
                value={lossDate}
                onChange={(e) => setLossDate(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Affected Area (Acres) *</span>
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

          {/* Survey, Village, Mandal details for PMFBY accuracy */}
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Survey / Khata No.</span>
              <input
                type="text"
                placeholder="e.g., 142/2A"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Village</span>
              <input
                type="text"
                placeholder="e.g., Duggondi"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Mandal / Tehsil</span>
              <input
                type="text"
                placeholder="e.g., Narsampet"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600"
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
              placeholder="Describe standing water, hail damage, lodging, or pest symptoms..."
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </label>

          {/* Photo Evidence Upload */}
          <div>
            <span className="mb-2 block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="size-4 text-emerald-700" />
              Upload Field Photo Evidence (Recommended for Insurance Survey)
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
                <span className="text-xs font-bold text-slate-700">Click to attach photo evidence</span>
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

          {/* Completeness Pre-Validation & Submit Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleValidateCompleteness}
                disabled={validating}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 font-bold py-3 px-4 text-xs transition cursor-pointer"
              >
                <FileCheck2 className="size-4 text-indigo-700" />
                <span>{validating ? "Checking Completeness..." : "Check Dossier Completeness"}</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 py-3.5 px-6 text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <span>{submitting ? "Preparing Dossier..." : "Prepare Crop Loss Intimation Pack"}</span>
              </button>
            </div>

            {/* Completeness Feedback Card */}
            {validationResult && (
              <div
                className={`rounded-2xl p-4 border text-xs space-y-2 ${
                  validationResult.is_complete
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-amber-50 border-amber-200 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black">
                    {validationResult.is_complete ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-600" />
                    )}
                    <span>
                      Dossier Completeness Score: {validationResult.completeness_score}% (
                      {validationResult.is_complete ? "Ready for Official Filing" : "Information Missing"}
                      )
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase">
                    Window Status: {validationResult.statutory_window_status}
                  </span>
                </div>

                {validationResult.missing_fields?.length > 0 && (
                  <p className="text-[11px] text-amber-800">
                    <strong>Recommended to add before filing:</strong> {validationResult.missing_fields.join(", ")}
                  </p>
                )}

                {validationResult.recommendations?.length > 0 && (
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-700">
                    {validationResult.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Official Government Claim Packet & Reference Slip Generator */}
      <div className="mt-8 rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <FileCheck2 className="size-3.5 text-emerald-700" />
              <span>Standardized Dossier Formatter</span>
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              Generate PMFBY Intimation Preparation Pack
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Generates a standardized farmer dossier with Scale of Finance calculation, required documents checklist, and official portal filing links.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneratePack}
            disabled={generatingPack}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 text-xs shadow-sm transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            <FileCheck2 className="size-4" />
            <span>{generatingPack ? "Generating Dossier..." : "Generate Preparation Pack"}</span>
          </button>
        </div>

        {claimPack && (
          <div className="mt-6 space-y-6">
            {/* Dossier Summary Banner */}
            <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    RythuSetu Preparation Dossier • Internal Reference
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
                    <span className="text-xs text-slate-500 font-bold block">Estimated Eligible Calculation:</span>
                    <span className="text-2xl font-black text-emerald-800">
                      {"\u20B9"}{claimPack.financial_valuation.estimated_eligible_payout.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => setPrintModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Print Dossier for Filing</span>
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
                  <span className="text-slate-400 block font-medium">Location</span>
                  <span className="font-bold text-slate-800">{claimPack.farmer.village}, {claimPack.farmer.mandal}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Damage Assessed</span>
                  <span className="font-bold text-rose-700">{claimPack.crop_details.damage_percent}% ({claimPack.crop_details.affected_acres} ac)</span>
                </div>
              </div>
            </div>

            {/* Official Action Center Card directly below preparation pack */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-indigo-700" />
                <h3 className="text-sm font-black text-indigo-950">
                  Next Official Steps: Submit to Authorized Portals
                </h3>
              </div>
              <p className="text-xs text-indigo-900/90 leading-relaxed">
                Take the details above and file your official intimation through any of these official channels:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 text-xs transition cursor-pointer"
                >
                  <span>Submit on PMFBY Portal (pmfby.gov.in)</span>
                  <ExternalLink className="size-3.5" />
                </a>

                <a
                  href="tel:14447"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-indigo-300 text-indigo-950 font-bold px-4 py-2 text-xs transition cursor-pointer"
                >
                  <PhoneCall className="size-3.5 text-indigo-700" />
                  <span>Call Helpline: 14447</span>
                </a>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-2">
                Mandatory Physical Submission Documents Checklist:
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

      {/* Recorded Loss Reports History & Self-Tracking */}
      <div className="mt-10">
        <h2 className="text-xl font-black text-slate-900 mb-4">Your Recorded Intimation Dossiers</h2>

        {loading && (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500">
            <RefreshCw className="size-5 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Loading existing records...</span>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No crop loss incidents recorded for this profile yet.
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((rep) => {
              const isEditingRef = activeReportForRef === rep.id;
              return (
                <div
                  key={rep.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rep.crop} - {rep.damage_type}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {rep.affected_area_acres} Acres ({rep.damage_percent}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Occurred on {rep.loss_date} • Recorded {rep.submitted_at.slice(0, 10)}
                        {rep.survey_number && ` • Survey #${rep.survey_number}`}
                        {rep.village && ` • ${rep.village}, ${rep.mandal}`}
                      </p>
                      {rep.description && (
                        <p className="text-xs text-slate-700 mt-1.5 italic">"{rep.description}"</p>
                      )}
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-800">
                        {rep.status}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">{rep.next_step}</p>
                    </div>
                  </div>

                  {/* Self-Tracking & Official Reference Section */}
                  <div className="border-t border-slate-100 pt-3 bg-slate-50/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl">
                    {rep.official_reference_number && !isEditingRef ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Your Official Claim Ref:
                            </span>
                            <span className="font-mono text-xs font-bold bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-900">
                              {rep.official_reference_number}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Self-tracked status: <strong>{rep.farmer_self_status || "SUBMITTED_OFFICIAL"}</strong>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Official Status Unavailable — Check official portal for live government claim determination.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveReportForRef(rep.id);
                            setSelfRefInput(rep.official_reference_number || "");
                            setSelfStatusInput(rep.farmer_self_status || "SUBMITTED_OFFICIAL");
                            setSelfNotesInput(rep.farmer_notes || "");
                          }}
                          className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer transition"
                        >
                          Update Status
                        </button>
                      </div>
                    ) : isEditingRef ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-slate-700">
                            Save Official Claim Reference ID
                          </span>
                          <button
                            onClick={() => setActiveReportForRef(null)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Official Reference Number (from PMFBY / CSC)"
                            value={selfRefInput}
                            onChange={(e) => setSelfRefInput(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600 font-mono"
                          />
                          <select
                            value={selfStatusInput}
                            onChange={(e) => setSelfStatusInput(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600"
                          >
                            <option value="SUBMITTED_OFFICIAL">Submitted to Official Portal</option>
                            <option value="UNDER_SURVEY">Under Official Joint Survey</option>
                            <option value="SETTLED">Settled / Benefit Credited</option>
                            <option value="REJECTED">Rejected / Needs Rectification</option>
                          </select>
                        </div>

                        <input
                          type="text"
                          placeholder="Personal notes (e.g. MeeSeva receipt number, surveyor phone)"
                          value={selfNotesInput}
                          onChange={(e) => setSelfNotesInput(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600"
                        />

                        <button
                          type="button"
                          onClick={() => handleSaveSelfStatus(rep.id)}
                          disabled={savingSelfStatus || !selfRefInput.trim()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 text-xs transition cursor-pointer disabled:opacity-50"
                        >
                          <Save className="size-3.5" />
                          <span>{savingSelfStatus ? "Saving..." : "Save Reference Number"}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          Filed on the PMFBY portal or at MeeSeva? Save your reference number to track it here.
                        </span>
                        <button
                          onClick={() => {
                            setActiveReportForRef(rep.id);
                            setSelfRefInput("");
                            setSelfStatusInput("SUBMITTED_OFFICIAL");
                            setSelfNotesInput("");
                          }}
                          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-300 text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          + Record Official Reference
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                <span className="text-xs font-bold uppercase tracking-wider">RythuSetu Crop Loss Preparation Pack</span>
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
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500">
                  RythuSetu Agricultural Preparatory Intelligence
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">
                  Crop Loss Intimation Preparation Dossier
                </h1>
                <p className="text-xs font-sans font-semibold text-slate-700 mt-0.5">
                  Standardized Dossier for Farmer Filing at PMFBY Portal (pmfby.gov.in) or MeeSeva / CSC Kiosk
                </p>
                <div className="mt-2 inline-block font-mono text-xs font-black bg-slate-100 border border-slate-300 px-3 py-1 rounded">
                  Internal Pack Ref: {claimPack.reference_number} • Date: {claimPack.generated_at}
                </div>
              </div>

              {/* Farmer and Farm Khata Information */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    1. Cultivator Particulars
                  </h3>
                  <p><strong>Name of Farmer:</strong> {claimPack.farmer.name}</p>
                  <p><strong>Village / Mandal:</strong> {claimPack.farmer.village}, {claimPack.farmer.mandal}</p>
                  <p><strong>District / State:</strong> {claimPack.farmer.district}, {claimPack.farmer.state}</p>
                  <p><strong>Self-Reported e-KYC:</strong> <span className="text-emerald-700 font-bold">{claimPack.farmer.aadhaar_ekyc_status}</span></p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    2. Land & Crop Details
                  </h3>
                  <p><strong>Khata / Survey Number:</strong> {claimPack.farmer.khata_survey_no}</p>
                  <p><strong>Insured Crop:</strong> {claimPack.crop_details.crop} ({claimPack.crop_details.season})</p>
                  <p><strong>Total Land Area:</strong> {claimPack.crop_details.total_land_acres} Acres</p>
                  <p><strong>Preparation Pack Generator:</strong> RythuSetu Intelligence Engine</p>
                </div>
              </div>

              {/* Damage and Valuation Assessment */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    3. Damage Intimation Particulars
                  </h3>
                  <p><strong>Incident Date:</strong> {claimPack.crop_details.incident_date}</p>
                  <p><strong>Cause of Damage:</strong> {claimPack.crop_details.damage_type}</p>
                  <p><strong>Affected Area:</strong> {claimPack.crop_details.affected_acres} Acres</p>
                  <p><strong>Estimated Damage:</strong> <strong className="text-red-600">{claimPack.crop_details.damage_percent}%</strong></p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 mb-1">
                    4. Scale of Finance Reference Computation
                  </h3>
                  <p><strong>Scale of Finance:</strong> ₹{claimPack.financial_valuation.scale_of_finance_per_acre.toLocaleString()} / Acre</p>
                  <p><strong>Estimated Reference Loss:</strong></p>
                  <p className="text-lg font-black text-emerald-800 mt-1">
                    ₹{claimPack.financial_valuation.estimated_eligible_payout.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-500">Subject to official joint surveyor inspection and PMFBY rules.</p>
                </div>
              </div>

              {/* Documents Checklist & Evidence Container */}
              <div className="text-xs font-sans space-y-2 border-b border-slate-200 pb-4">
                <h3 className="font-bold text-slate-900 uppercase text-[10px] text-slate-500">
                  5. Physical Submission Checklist for CSC / MeeSeva
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

              {/* Clear Independent Platform Disclaimer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans space-y-1">
                <p className="font-bold text-slate-800">Important Disclaimer:</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  This document is an independent preparatory reference pack generated by RythuSetu to assist the cultivator in organizing data for filing under PMFBY. RythuSetu is not a government agency, insurer, or claim adjudicator. Final eligibility and settlement are determined exclusively by the authorized insurance company and the Department of Agriculture.
                </p>
              </div>

              <div className="text-[10px] text-slate-400 text-center font-sans">
                For official claim status, visit pmfby.gov.in or contact the Kisan Call Centre at 14447.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
