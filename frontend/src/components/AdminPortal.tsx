import { useState, useEffect } from "react";
import {
  Users,
  FileCheck2,
  AlertTriangle,
  IndianRupee,
  RefreshCw,
  CheckCircle2,
  Radio,
  Send,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  type AuthUser,
  type AdminStats,
  type AdminClaimItem,
  type BroadcastAlert,
  API_BASE,
} from "../types";

export function AdminPortal({
  user,
  onSwitchToFarmerView,
}: {
  user: AuthUser;
  onSwitchToFarmerView: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"claims" | "directory" | "broadcasts">("claims");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [claims, setClaims] = useState<AdminClaimItem[]>([]);
  const [registeredFarmers, setRegisteredFarmers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimFilter, setClaimFilter] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  // Broadcast dispatch form state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastCrop, setBroadcastCrop] = useState("Cotton");
  const [broadcastSeverity, setBroadcastSeverity] = useState<"high" | "moderate" | "critical">("high");
  const [broadcastAdvisory, setBroadcastAdvisory] = useState("");
  const [dispatching, setDispatching] = useState(false);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, claimsRes, alertsRes, farmersRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard-stats`),
        fetch(`${API_BASE}/admin/all-claims`),
        fetch(`${API_BASE}/admin/broadcast-alerts`),
        fetch(`${API_BASE}/admin/farmers`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (claimsRes.ok) {
        const claimsData = await claimsRes.json();
        setClaims(claimsData.claims || []);
      }
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }
      if (farmersRes && farmersRes.ok) {
        const farmersData = await farmersRes.json();
        setRegisteredFarmers(farmersData.farmers || []);
      }
    } catch (e) {
      console.error("Failed to load admin telemetry", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleClaimAction = async (claimId: string, action: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/claims/${claimId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, officer_note: `Action executed by ${user.name}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || `Claim ${claimId} successfully updated to stage ${data.claim.current_stage}.`);
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to update claim", e);
    }
  };

  const handleDispatchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastAdvisory) return;

    setDispatching(true);
    try {
      const res = await fetch(`${API_BASE}/admin/broadcast-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          severity: broadcastSeverity,
          target_crop: broadcastCrop,
          district: user.district || "Warangal",
          advisory: broadcastAdvisory,
          issued_by: `${user.name} (${user.designation})`,
        }),
      });
      if (res.ok) {
        setActionMessage(`Emergency broadcast "${broadcastTitle}" dispatched successfully!`);
        setBroadcastTitle("");
        setBroadcastAdvisory("");
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to dispatch broadcast", e);
    } finally {
      setDispatching(false);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === "pending") return c.current_stage === 1;
    if (claimFilter === "inspected") return c.current_stage === 2;
    if (claimFilter === "approved") return c.current_stage === 3;
    if (claimFilter === "disbursed") return c.current_stage === 4;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Officer Authority Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 lg:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-indigo-800/40">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 size-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-3xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                  Government Command Desk
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  {user.district || "Warangal"} District Administration
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight mt-1">
                {user.name}
              </h1>
              <p className="text-xs text-indigo-200/90 font-medium mt-0.5">
                {user.designation || "Mandal Agriculture Officer"} • Department of Agriculture & Farmers' Welfare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Sync Data
            </button>
            <button
              onClick={onSwitchToFarmerView}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>🌾 Preview Farmer View</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Aggregate Metric Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Onboarded Farmers</span>
              <Users className="size-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {stats.total_farmers.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Active across {stats.active_districts} Mandals
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Pending Inspections</span>
              <AlertTriangle className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {stats.pending_verification}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Require field verification
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Claims Approved</span>
              <FileCheck2 className="size-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {stats.approved_claims}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {stats.dbt_disbursed} DBT Payouts Issued
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Total Relief Disbursed</span>
              <IndianRupee className="size-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-800 mt-2">
              ₹{(stats.total_relief_amount / 100000).toFixed(2)} L
            </div>
            <p className="text-[11px] text-teal-600 font-bold mt-1">
              Direct to Aadhaar bank accounts
            </p>
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("claims")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer ${
            activeTab === "claims"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="size-4" />
          PMFBY Claims Verification Desk ({claims.length})
        </button>

        <button
          onClick={() => setActiveTab("broadcasts")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer ${
            activeTab === "broadcasts"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Radio className="size-4 text-red-500" />
          Emergency Alert Dispatcher ({alerts.length})
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer ${
            activeTab === "directory"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="size-4" />
          District Farmer Registry
        </button>
      </div>

      {/* TAB 1: CLAIMS APPROVAL DESK */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by Stage:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All Claims" },
                  { id: "pending", label: "Stage 1: Pending" },
                  { id: "inspected", label: "Stage 2: Inspected" },
                  { id: "approved", label: "Stage 3: Approved" },
                  { id: "disbursed", label: "Stage 4: Disbursed" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setClaimFilter(item.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                      claimFilter === item.id
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredClaims.length} of {claims.length} claims
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No claims found matching the current filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.claim_id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Photo Thumbnail */}
                      <div
                        onClick={() => setSelectedPhoto(claim.evidence_photo)}
                        className="relative size-16 rounded-xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 cursor-pointer group"
                        title="Click to view full evidence photo"
                      >
                        <img
                          src={claim.evidence_photo}
                          alt="Evidence"
                          className="size-full object-cover group-hover:scale-110 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[10px] text-white font-bold">
                          Inspect
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-indigo-950">
                            {claim.claim_id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {claim.farmer_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({claim.village}, {claim.district})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 flex-wrap">
                          <span>
                            Crop: <strong className="text-slate-900">{claim.crop_name}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Cause: <strong className="text-slate-900">{claim.loss_cause}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Damage: <strong className="text-red-600">{claim.loss_percentage}%</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Valuation: <strong className="text-emerald-700">₹{claim.estimated_loss_inr.toLocaleString()}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              claim.current_stage === 4
                                ? "bg-teal-100 text-teal-900"
                                : claim.current_stage === 3
                                ? "bg-emerald-100 text-emerald-900"
                                : claim.current_stage === 2
                                ? "bg-amber-100 text-amber-900"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            Stage {claim.current_stage}: {claim.stage_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Filed {claim.filed_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Official Decision Actions */}
                    <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0">
                      {claim.current_stage === 1 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "verify")}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Mark Field Inspected
                        </button>
                      )}

                      {claim.current_stage === 2 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "approve")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Approve for DBT
                        </button>
                      )}

                      {claim.current_stage === 3 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "disburse")}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Disburse Direct Benefit Transfer
                        </button>
                      )}

                      {claim.current_stage === 4 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                          <CheckCircle2 className="size-4 text-teal-600" />
                          <span>Disbursed to Bank</span>
                        </div>
                      )}

                      {claim.current_stage < 4 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "reject")}
                          className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                          title="Reject or mark claim ineligible"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMERGENCY BROADCAST DISPATCHER */}
      {activeTab === "broadcasts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <Radio className="size-5 animate-pulse" />
              <h3 className="text-base font-black text-slate-900">
                Dispatch District Advisory
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Send an urgent advisory or weather warning directly to registered farmers in {user.district}.
            </p>

            <form onSubmit={handleDispatchBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advisory Headline
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Unseasonal Hailstorm Warning"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Crop
                  </label>
                  <select
                    value={broadcastCrop}
                    onChange={(e) => setBroadcastCrop(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Paddy / Rice">Paddy / Rice</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Maize">Maize</option>
                    <option value="All Crops">All Crops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={broadcastSeverity}
                    onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="critical">Critical (Red)</option>
                    <option value="high">High (Amber)</option>
                    <option value="moderate">Moderate (Yellow)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advisory Guidelines & Next Steps
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastAdvisory}
                  onChange={(e) => setBroadcastAdvisory(e.target.value)}
                  placeholder="e.g. Clear drainage channels immediately to prevent waterlogging. Harvest mature bolls before 18:00 IST."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={dispatching}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="size-3.5" />
                {dispatching ? "Broadcasting..." : "Dispatch to All Farmers"}
              </button>
            </form>
          </div>

          {/* Active Broadcasts Feed */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-black text-slate-800">
              Active Broadcasts in {user.district} ({alerts.length})
            </h3>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border ${
                  alert.severity === "critical"
                    ? "bg-red-50/70 border-red-200"
                    : alert.severity === "high"
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-blue-50/70 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      alert.severity === "critical"
                        ? "bg-red-200 text-red-900"
                        : alert.severity === "high"
                        ? "bg-amber-200 text-amber-900"
                        : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    {alert.severity} Alert
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {alert.timestamp}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-2">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {alert.advisory}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Target: <strong>{alert.target_crop}</strong> ({alert.district})</span>
                  <span>Issued: {alert.issued_by}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISTRICT REGISTRY */}
      {activeTab === "directory" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Registered Smallholders — {user.district} Mandal
              </h3>
              <p className="text-xs text-slate-500">
                Direct registry of farmers onboarded to the RythuSetu state data bridge
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
              {registeredFarmers.length} Registered Smallholders
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Farmer Name</th>
                  <th className="py-3 px-4">Village / Mandal</th>
                  <th className="py-3 px-4">Land Area</th>
                  <th className="py-3 px-4">Primary Crop</th>
                  <th className="py-3 px-4">Active Schemes</th>
                  <th className="py-3 px-4">PMFBY Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registeredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No farmers registered in this mandal registry yet.
                    </td>
                  </tr>
                ) : (
                  registeredFarmers.map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="size-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                          {f.name.charAt(0).toUpperCase()}
                        </span>
                        {f.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{f.village || f.mandal}, {f.district}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{f.land_area_acres} Acres</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">{f.season} {f.crop}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          PM-KISAN + PMFBY
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          Registered ({f.created_at})
                        </span>
                      </td>
                    </tr>
                  ))
                )}
</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Photo Inspection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold">Crop Damage Physical Evidence Audit</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhoto}
                alt="Audit Evidence"
                className="w-full max-h-[500px] object-contain rounded-xl bg-slate-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
