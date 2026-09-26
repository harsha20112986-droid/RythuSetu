import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  FileCheck2,
  Info,
  Save,
} from "lucide-react";
import { type Farmer, type ActionCenterItem, API_BASE } from "../types";

export function OfficialActionCenter({
  farmer,
  onBack,
  onNavigateToLoss,
  onNavigateToSchemes,
}: {
  farmer: Farmer;
  onBack: () => void;
  onNavigateToLoss?: () => void;
  onNavigateToSchemes?: () => void;
}) {
  const [items, setItems] = useState<ActionCenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Editing state for reference numbers
  const [activeEditKey, setActiveEditKey] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState("");
  const [selfStatus, setSelfStatus] = useState("SUBMITTED_OFFICIAL");
  const [notes, setNotes] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadActionItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/action-center/items?farmer_id=${farmer.id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Unable to load action items");
      }
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch action center items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActionItems();
  }, [farmer.id]);

  const handleSaveReference = async (actionKey: string, category: string, title: string) => {
    if (!refNumber.trim()) return;
    setSavingKey(actionKey);
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_BASE}/action-center/save-reference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmer.id,
          action_key: actionKey,
          category,
          title,
          official_reference_number: refNumber.trim(),
          farmer_self_status: selfStatus,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Failed to save reference number");
      }
      setSuccessMsg(`Reference saved for ${title}!`);
      setActiveEditKey(null);
      setRefNumber("");
      setNotes("");
      loadActionItems();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Could not save reference number");
    } finally {
      setSavingKey(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter === "all") return true;
    return item.category === categoryFilter;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUBMITTED_OFFICIAL":
        return { label: "Submitted to Official Portal", color: "bg-blue-50 text-blue-800 border-blue-200" };
      case "UNDER_SURVEY":
        return { label: "Under Official Joint Survey", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "SETTLED":
        return { label: "Settled / Benefit Credited", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "REJECTED":
        return { label: "Rejected / Needs Rectification", color: "bg-red-50 text-red-800 border-red-200" };
      default:
        return { label: "Action Pending / Not Filed", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Official Action & Tracking Center
          </span>
          <span className="text-xs text-indigo-200">
            {farmer.form.name} • {farmer.form.district}, {farmer.form.state}
          </span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-black">
          Prepare, Act & Track Official Filings
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
          RythuSetu helps you prepare complete dossiers, meet statutory deadlines, and follow official steps. All formal approvals and claim disbursements occur directly through official government portals and authorized authorities.
        </p>

        {/* Clear Role Separation Disclaimer */}
        <div className="mt-5 rounded-2xl bg-indigo-900/60 border border-indigo-500/40 p-4 text-xs text-indigo-100 flex items-start gap-3">
          <Info className="size-5 text-indigo-300 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">Truthful Platform Disclosure:</p>
            <p className="text-indigo-200/90 leading-relaxed">
              RythuSetu is an independent preparatory tool. We do not approve claims, sanction subsidies, or act as government officers. Always retain your official acknowledgment receipt from the authorized portal or CSC kiosk.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Action Items" },
            { id: "crop_loss", label: "Crop Loss (PMFBY)" },
            { id: "scheme", label: "Government Schemes" },
            { id: "procurement", label: "Direct Procurement" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={loadActionItems}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          <span>Refresh Checklist</span>
        </button>
      </div>

      {/* Items List */}
      {loading && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <RefreshCw className="size-6 animate-spin mx-auto text-indigo-600 mb-2" />
          <span className="text-sm font-medium">Loading statutory action items & checklists...</span>
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <FileCheck2 className="size-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-sm text-slate-700">No pending action items in this category.</p>
          <p className="text-xs text-slate-400 mt-1">Check back whenever you file a crop loss intimation or apply for schemes.</p>
        </div>
      )}

      {!loading && filteredItems.length > 0 && (
        <div className="mt-6 space-y-6">
          {filteredItems.map((item) => {
            const itemKey = item.action_key || item.action_id;
            const isEditing = activeEditKey === itemKey;
            const selfStatusVal = item.farmer_self_status || item.self_tracked_status || "";
            const statusInfo = getStatusLabel(selfStatusVal);
            const portalUrl = item.official_portal_url || item.official_url;
            const refNum = item.official_reference_number || item.application_reference_number || null;
            const itemDisclaimer = item.disclaimer || item.verification_warning || "";

            return (
              <article
                key={itemKey}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition"
              >
                {/* Header row: category, organization, deadline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-800">
                      {item.official_organization}
                    </span>
                    {item.deadline && (
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-800 flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>Deadline: {item.deadline}</span>
                      </span>
                    )}
                  </div>

                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold border self-start sm:self-auto ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                  <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Preparation Checklist */}
                {item.preparation_checklist && item.preparation_checklist.length > 0 && (
                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-2.5 flex items-center gap-1.5">
                      <FileCheck2 className="size-3.5 text-indigo-600" />
                      Preparation Dossier Checklist:
                    </span>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {item.preparation_checklist.map((step: any, idx: number) => {
                        const stepText = typeof step === "string" ? step : step?.label || JSON.stringify(step);
                        return (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{stepText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Action Links & Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-xs shadow-xs transition cursor-pointer"
                  >
                    <span>{item.user_action_label || "Open Official Portal"}</span>
                    <ExternalLink className="size-3.5" />
                  </a>

                  {item.helpline && (
                    <a
                      href={`tel:${item.helpline.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 font-bold px-4 py-2.5 text-xs transition cursor-pointer"
                    >
                      <PhoneCall className="size-3.5 text-indigo-600" />
                      <span>Helpline: {item.helpline}</span>
                    </a>
                  )}

                  {item.category === "crop_loss" && onNavigateToLoss && (
                    <button
                      onClick={onNavigateToLoss}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-bold px-4 py-2.5 text-xs transition cursor-pointer"
                    >
                      <FileCheck2 className="size-3.5 text-emerald-700" />
                      <span>Prepare Loss Dossier</span>
                    </button>
                  )}

                  {item.category === "scheme" && onNavigateToSchemes && (
                    <button
                      onClick={onNavigateToSchemes}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-bold px-4 py-2.5 text-xs transition cursor-pointer"
                    >
                      <FileCheck2 className="size-3.5 text-emerald-700" />
                      <span>View Scheme Details</span>
                    </button>
                  )}
                </div>

                {/* Reference Number Self-Management Section */}
                <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  {refNum && !isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          Self-Recorded Official Reference ID
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-sm font-black text-slate-900 bg-white border border-slate-300 px-2.5 py-0.5 rounded-lg">
                            {refNum}
                          </span>
                          <span className="text-xs text-slate-500 italic">
                            (Self-managed record)
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-slate-600 mt-1 italic">Notes: {item.notes}</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">
                          Official status unavailable — Check official portal for real-time government adjudication.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveEditKey(itemKey);
                          setRefNumber(refNum || "");
                          setSelfStatus(selfStatusVal || "SUBMITTED_OFFICIAL");
                          setNotes(item.notes || "");
                        }}
                        className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
                      >
                        Update Record
                      </button>
                    </div>
                  ) : isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-700">
                          Record Official Acknowledgment
                        </span>
                        <button
                          onClick={() => setActiveEditKey(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-[11px] font-bold text-slate-600 block mb-1">
                            Official Application / Intimation Ref No *
                          </span>
                          <input
                            type="text"
                            placeholder="e.g., PMFBY/2026/TG/984210"
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600 font-mono"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[11px] font-bold text-slate-600 block mb-1">
                            Self-Tracked Status
                          </span>
                          <select
                            value={selfStatus}
                            onChange={(e) => setSelfStatus(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600"
                          >
                            <option value="SUBMITTED_OFFICIAL">Submitted to Official Portal</option>
                            <option value="UNDER_SURVEY">Under Official Joint Survey</option>
                            <option value="SETTLED">Settled / Benefit Credited</option>
                            <option value="REJECTED">Rejected / Needs Rectification</option>
                          </select>
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Personal Notes (e.g., MeeSeva receipt no, surveyor visit date)
                        </span>
                        <input
                          type="text"
                          placeholder="e.g., Filed at Warangal MeeSeva Center counter 3"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-600"
                        />
                      </label>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveReference(itemKey, item.category, item.title)}
                          disabled={savingKey === itemKey || !refNumber.trim()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                        >
                          <Save className="size-3.5" />
                          <span>{savingKey === itemKey ? "Saving..." : "Save Reference Number"}</span>
                        </button>

                        <span className="text-[11px] text-slate-500">
                          Stored for your personal tracking only.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">
                          Have you already filed this on the official portal?
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Save your official acknowledgment / claim reference number here to keep track of your timeline.
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveEditKey(itemKey);
                          setRefNumber("");
                          setSelfStatus("SUBMITTED_OFFICIAL");
                          setNotes("");
                        }}
                        className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-700 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                      >
                        + Add Official Reference
                      </button>
                    </div>
                  )}

                  {/* Truthful Status Warning */}
                  <div className="mt-3 text-[10px] text-slate-400 leading-tight">
                    {itemDisclaimer}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
