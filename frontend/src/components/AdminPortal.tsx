import { useState, useEffect, useMemo } from "react";
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
  Search,
  Phone,
  Shield,
  Clock,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import {
  type AuthUser,
  type AdminStats,
  type AdminClaimItem,
  type AdminUserItem,
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
  const [activeTab, setActiveTab] = useState<"claims" | "users" | "directory" | "broadcasts">("claims");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [claims, setClaims] = useState<AdminClaimItem[]>([]);
  const [registeredFarmers, setRegisteredFarmers] = useState<any[]>([]);
  const [userAccounts, setUserAccounts] = useState<AdminUserItem[]>([]);
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimFilter, setClaimFilter] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  // User Accounts Filter state
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "farmer" | "admin">("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "online" | "offline">("all");

  // Broadcast dispatch form state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastCrop, setBroadcastCrop] = useState("Cotton");
  const [broadcastSeverity, setBroadcastSeverity] = useState<"high" | "moderate" | "critical">("high");
  const [broadcastAdvisory, setBroadcastAdvisory] = useState("");
  const [dispatching, setDispatching] = useState(false);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, claimsRes, alertsRes, farmersRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard-stats`),
        fetch(`${API_BASE}/admin/all-claims`),
        fetch(`${API_BASE}/admin/broadcast-alerts`),
        fetch(`${API_BASE}/admin/farmers`),
        fetch(`${API_BASE}/admin/users`).catch(() => null),
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

      // Process User Accounts (combining backend + local storage for instant sync)
      let serverUsers: AdminUserItem[] = [];
      if (usersRes && usersRes.ok) {
        const uData = await usersRes.json();
        serverUsers = uData.users || [];
      }

      const localUsers: any[] = JSON.parse(localStorage.getItem("rythusetu_registered_users") || "[]");
      const userMap = new Map<string, AdminUserItem>();

      // Put server users first
      serverUsers.forEach((u) => {
        userMap.set(u.username.toLowerCase(), u);
      });

      // Merge local users
      localUsers.forEach((lu: any, idx: number) => {
        const key = (lu.username || "").toLowerCase();
        if (!userMap.has(key)) {
          userMap.set(key, {
            id: 2000 + idx,
            username: lu.username,
            name: lu.name,
            role: lu.role || "farmer",
            phone: lu.phone || "Not registered",
            designation: lu.role === "admin" ? "Mandal Agriculture Officer" : "Registered Smallholder",
            district: lu.district || "Warangal",
            state: lu.state || "Telangana",
            created_at: lu.registeredAt ? new Date(lu.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recently",
            last_login_at: lu.lastLoginAt ? new Date(lu.lastLoginAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", Today" : "Active Now",
            is_online: true,
            status: "Online Now 🟢",
            farmer_profile: {
              crop: lu.crop || "Cotton",
              land_area_acres: parseFloat(lu.land_area_acres) || 2.0,
              village: lu.village || "",
              mandal: lu.mandal || "",
              season: lu.season || "Kharif",
            },
          });
        }
      });

      // Also ensure current admin user is represented
      if (!userMap.has(user.username.toLowerCase())) {
        userMap.set(user.username.toLowerCase(), {
          id: 1,
          username: user.username,
          name: user.name,
          role: user.role,
          phone: user.phone || "+91 98480 12345",
          designation: user.designation || "Mandal Agriculture Officer",
          district: user.district || "Warangal",
          state: user.state || "Telangana",
          created_at: "Platform Launch",
          last_login_at: "Active Now",
          is_online: true,
          status: "Online Now 🟢",
        });
      }

      setUserAccounts(Array.from(userMap.values()));
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
    if (!broadcastTitle.trim() || !broadcastAdvisory.trim()) return;

    try {
      setDispatching(true);
      const res = await fetch(`${API_BASE}/admin/broadcast-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          district: user.district,
          severity: broadcastSeverity,
          target_crop: broadcastCrop,
          advisory: broadcastAdvisory.trim(),
          issued_by: `${user.name} (${user.designation || "Mandal Officer"})`,
        }),
      });
      if (res.ok) {
        setActionMessage("Emergency Alert dispatched successfully across district farmers!");
        setBroadcastTitle("");
        setBroadcastAdvisory("");
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to dispatch alert", e);
    } finally {
      setDispatching(false);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === "all") return true;
    if (claimFilter === "stage1") return c.current_stage === 1;
    if (claimFilter === "stage2") return c.current_stage === 2;
    if (claimFilter === "stage3") return c.current_stage === 3;
    if (claimFilter === "disbursed") return c.current_stage === 4;
    return true;
  });

  // Filtered user accounts
  const filteredUserAccounts = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    const cleanDigits = userSearch.replace(/\D/g, "");

    return userAccounts.filter((u) => {
      // Role match
      if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;

      // Status match
      if (userStatusFilter === "online" && !u.is_online) return false;
      if (userStatusFilter === "offline" && u.is_online) return false;

      // Search query
      if (!q) return true;

      const matchName = u.name.toLowerCase().includes(q);
      const matchUsername = u.username.toLowerCase().includes(q);
      const uDigits = u.phone ? u.phone.replace(/\D/g, "") : "";
      const matchPhone = (cleanDigits.length >= 3 && uDigits.includes(cleanDigits)) || u.phone.toLowerCase().includes(q);
      const matchDistrict = u.district.toLowerCase().includes(q);

      return matchName || matchUsername || matchPhone || matchDistrict;
    });
  }, [userAccounts, userSearch, userRoleFilter, userStatusFilter]);

  const onlineUsersCount = userAccounts.filter((u) => u.is_online).length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                State Agriculture Command Desk
              </span>
              <span className="text-xs text-indigo-200">
                Department of Agriculture & Farmers Welfare
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1">
              {user.designation || "Mandal Agriculture Extension Officer"} • {user.district} District ({user.state})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh Telemetry</span>
            </button>

            <button
              onClick={onSwitchToFarmerView}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer"
            >
              <span>Switch to Farmer View</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Aggregate Metrics Header */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Registered Accounts</span>
              <Users className="size-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {userAccounts.length > 0 ? userAccounts.length : stats.total_farmers.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {onlineUsersCount} Active / Online Now
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
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("claims")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "claims"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>PMFBY Claims Desk ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="size-4 text-emerald-600" />
          <span>Registered User Accounts ({userAccounts.length})</span>
          {onlineUsersCount > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black rounded-full bg-emerald-100 text-emerald-800">
              {onlineUsersCount} Online
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("broadcasts")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "broadcasts"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Radio className="size-4 text-red-500" />
          <span>Emergency Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "directory"
              ? "border-indigo-600 text-indigo-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sprout className="size-4 text-emerald-600" />
          <span>District Farmer Profiles</span>
        </button>
      </div>

      {/* TAB 1: CLAIMS APPROVAL DESK */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by Stage:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Claims" },
                { id: "stage1", label: "Stage 1: Awaiting Inspection" },
                { id: "stage2", label: "Stage 2: Approved for DBT" },
                { id: "stage3", label: "Stage 3: Ready to Disburse" },
                { id: "disbursed", label: "Stage 4: Disbursed" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setClaimFilter(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    claimFilter === f.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              <FileCheck2 className="size-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-800">No claims match this filter</p>
              <p className="text-xs text-slate-400 mt-1">All farmer intimations have been processed</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.claim_id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {claim.evidence_photo ? (
                        <img
                          src={claim.evidence_photo}
                          alt="Evidence"
                          onClick={() => setSelectedPhoto(claim.evidence_photo)}
                          className="size-16 sm:size-20 rounded-2xl object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-90 transition"
                          title="Click to zoom evidence"
                        />
                      ) : (
                        <div className="size-16 sm:size-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <AlertTriangle className="size-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                            {claim.claim_id}
                          </span>
                          <span className="font-black text-sm text-slate-900">
                            {claim.farmer_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            • {claim.village}, {claim.district}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>Crop: <strong className="text-slate-800">{claim.crop_name}</strong></span>
                          <span>Cause: <strong className="text-red-700">{claim.loss_cause}</strong></span>
                          <span>Loss: <strong className="text-slate-800">{claim.loss_percentage}%</strong></span>
                          <span>Est. Loss: <strong className="text-emerald-700 font-mono">₹{claim.estimated_loss_inr.toLocaleString()}</strong></span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              claim.current_stage === 4
                                ? "bg-teal-100 text-teal-800"
                                : claim.current_stage === 3
                                ? "bg-emerald-100 text-emerald-800"
                                : claim.current_stage === 2
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-amber-100 text-amber-800"
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

      {/* TAB 2: REGISTERED USER ACCOUNTS & LIVE LOGINS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by Name, @username, or Phone..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Cultivators Only</option>
                <option value="admin">Officers Only</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="all">All Activity</option>
                <option value="online">Online / Active Now 🟢</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Registered Cultivators & Officer Accounts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live database registry tracking authenticated sessions, mobile credentials, and farm linkages
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
                {filteredUserAccounts.length} Accounts Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User Name & Handle</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Registered Phone</th>
                    <th className="py-3 px-4">District / State</th>
                    <th className="py-3 px-4">Farm Profile</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUserAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="size-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">No user accounts found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try clearing search or filter terms</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUserAccounts.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className={`relative size-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 ${
                            u.role === "admin" ? "bg-indigo-700" : "bg-emerald-700"
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                            {u.is_online && (
                              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 leading-tight">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-indigo-100 text-indigo-900"
                              : "bg-emerald-100 text-emerald-900"
                          }`}>
                            {u.role === "admin" ? <Shield className="size-3" /> : <Sprout className="size-3" />}
                            {u.role === "admin" ? "Officer (MAO)" : "Cultivator"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                          {u.phone && u.phone !== "Not registered" ? (
                            <a
                              href={`tel:${u.phone}`}
                              className="inline-flex items-center gap-1 hover:text-emerald-700 hover:underline"
                            >
                              <Phone className="size-3 text-slate-400" />
                              <span>{u.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Not added</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {u.district}, {u.state}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {u.farmer_profile ? (
                            <div className="leading-tight">
                              <span className="font-bold text-emerald-800">{u.farmer_profile.crop}</span>
                              <span className="text-[11px] text-slate-400"> ({u.farmer_profile.land_area_acres} ac)</span>
                              <div className="text-[10px] text-slate-400">{u.farmer_profile.village || u.farmer_profile.mandal}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Command Desk Officer</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            <span>{u.last_login_at || "Just now"}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            u.is_online
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300/80"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            <span className={`size-1.5 rounded-full ${u.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                            <span>{u.is_online ? "Logged In 🟢" : "Offline"}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY BROADCAST DISPATCHER */}
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
                    <option value="high">High Alert</option>
                    <option value="critical">Critical / Emergency</option>
                    <option value="moderate">Moderate Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advisory Content & Protective Steps
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastAdvisory}
                  onChange={(e) => setBroadcastAdvisory(e.target.value)}
                  placeholder="e.g. Advise spraying Copper Oxychloride immediately to prevent pest infestation..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={dispatching}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span>{dispatching ? "Broadcasting..." : "Dispatch Alert to All District Farmers"}</span>
              </button>
            </form>
          </div>

          {/* Active Dispatches */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Active Broadcast Logs ({alerts.length})
            </h3>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border transition shadow-xs ${
                  alert.severity === "critical"
                    ? "bg-red-50/70 border-red-200"
                    : alert.severity === "high"
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      alert.severity === "critical"
                        ? "bg-red-600 text-white"
                        : alert.severity === "high"
                        ? "bg-amber-600 text-white"
                        : "bg-slate-600 text-white"
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

      {/* TAB 4: DISTRICT FARMER DIRECTORY */}
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
    </section>
  );
}
