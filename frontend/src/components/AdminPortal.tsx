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
  Warehouse,
  Truck,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<"claims" | "storage" | "factory" | "users" | "directory" | "broadcasts" | "mandi">("claims");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [claims, setClaims] = useState<AdminClaimItem[]>([]);
  const [storageBookings, setStorageBookings] = useState<any[]>([]);
  const [factoryPasses, setFactoryPasses] = useState<any[]>([]);
  const [registeredFarmers, setRegisteredFarmers] = useState<any[]>([]);
  const [userAccounts, setUserAccounts] = useState<AdminUserItem[]>([]);
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [mandiPrices, setMandiPrices] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimFilter, setClaimFilter] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  // Mandi Admin state
  const [mandiCropFilter, setMandiCropFilter] = useState<string>("All");
  const [mandiSearch, setMandiSearch] = useState<string>("");
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editModalValue, setEditModalValue] = useState<string>("");
  const [showAddMandiModal, setShowAddMandiModal] = useState<boolean>(false);
  const [newMandiCrop, setNewMandiCrop] = useState<string>("Cotton");
  const [newMandiVariety, setNewMandiVariety] = useState<string>("");
  const [newMandiMarket, setNewMandiMarket] = useState<string>("");
  const [newMandiDistrict, setNewMandiDistrict] = useState<string>("Warangal");
  const [newMandiMinPrice, setNewMandiMinPrice] = useState<string>("");
  const [newMandiMaxPrice, setNewMandiMaxPrice] = useState<string>("");
  const [newMandiModalPrice, setNewMandiModalPrice] = useState<string>("");
  const [newMandiArrivals, setNewMandiArrivals] = useState<string>("150");
  const [newMandiTeluguName, setNewMandiTeluguName] = useState<string>("");
  const [newMandiGradeTag, setNewMandiGradeTag] = useState<string>("APMC Daily Arrival");
  const [savingMandi, setSavingMandi] = useState<boolean>(false);
  const [syncingMandi, setSyncingMandi] = useState<boolean>(false);
  const [ingestionStatus, setIngestionStatus] = useState<any>(null);

  // User Accounts Filter state
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "online" | "offline">("all");

  // Broadcast dispatch form state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastCrop, setBroadcastCrop] = useState("Cotton");
  const [broadcastSeverity, setBroadcastSeverity] = useState<"high" | "moderate" | "critical">("high");
  const [broadcastAdvisory, setBroadcastAdvisory] = useState("");
  const [dispatching, setDispatching] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("rythusetu_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const headers = getAuthHeaders();
      const [statsRes, claimsRes, alertsRes, farmersRes, usersRes, storageRes, factoryRes, mandiRes, ingestionRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard-stats`, { headers }),
        fetch(`${API_BASE}/admin/all-claims`, { headers }),
        fetch(`${API_BASE}/admin/broadcast-alerts`, { headers }),
        fetch(`${API_BASE}/admin/farmers`, { headers }),
        fetch(`${API_BASE}/admin/users`, { headers }).catch(() => null),
        fetch(`${API_BASE}/storage/bookings`, { headers }).catch(() => null),
        fetch(`${API_BASE}/direct-market/passes`, { headers }).catch(() => null),
        fetch(`${API_BASE}/admin/mandi/prices`, { headers }).catch(() => null),
        fetch(`${API_BASE}/admin/mandi/ingestion-status`, { headers }).catch(() => null),
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
      if (storageRes && storageRes.ok) {
        const sData = await storageRes.json();
        setStorageBookings(sData.bookings || []);
      }
      if (factoryRes && factoryRes.ok) {
        const fData = await factoryRes.json();
        setFactoryPasses(fData.passes || []);
      }

      // Process authentic User Accounts from database
      if (usersRes && usersRes.ok) {
        const uData = await usersRes.json();
        setUserAccounts(uData.users || []);
      }

      // Process authentic Mandi Prices from database
      if (mandiRes && mandiRes.ok) {
        const mData = await mandiRes.json();
        setMandiPrices(mData.prices || []);
      }

      // Process Mandi Ingestion Status from database
      if (ingestionRes && ingestionRes.ok) {
        const ingData = await ingestionRes.json();
        setIngestionStatus(ingData);
      }
    } catch (e) {
      console.error("Failed to load admin telemetry", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTriggerMandiSync = async () => {
    try {
      setSyncingMandi(true);
      const res = await fetch(`${API_BASE}/admin/mandi/sync`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || `Upstream sync completed with status: ${data.status}`);
      } else {
        setActionMessage(data.detail || "Upstream sync failed.");
      }
      fetchAdminData();
      setTimeout(() => setActionMessage(""), 5000);
    } catch (e: any) {
      setActionMessage(e.message || "Failed to trigger mandi sync");
    } finally {
      setSyncingMandi(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleClaimAction = async (claimId: string, action: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/claims/${claimId}/update`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action,
          verifier_note: `Action executed by ${user.name}`,
          officer_note: `Action executed by ${user.name}`,
        }),
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          district: user.district,
          severity: broadcastSeverity,
          target_crop: broadcastCrop,
          advisory: broadcastAdvisory.trim(),
          issued_by: `${user.name} (${user.designation || "Operations Desk Lead"})`,
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

  const handleUpdateStorageStatus = async (token: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/storage/bookings/${token}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionMessage(`Storage Token ${token} status updated to: ${newStatus}`);
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to update storage booking status", e);
    }
  };

  const handleUpdatePassStatus = async (passNumber: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/direct-market/passes/${passNumber}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionMessage(`Delivery Pass ${passNumber} status updated to: ${newStatus}`);
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to update delivery pass status", e);
    }
  };

  const handleUpdateMandiPrice = async (priceId: number) => {
    const val = parseFloat(editModalValue);
    if (!val || val <= 0) return;
    try {
      const res = await fetch(`${API_BASE}/admin/mandi/prices/${priceId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ modal_price: val }),
      });
      if (res.ok) {
        setActionMessage(`Market price record #${priceId} updated & verified.`);
        setEditingPriceId(null);
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to update mandi price", e);
    }
  };

  const handleExpireMandiPrice = async (priceId: number) => {
    if (!confirm("Are you sure you want to mark this mandi price record as expired?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/mandi/prices/${priceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setActionMessage(`Market price record #${priceId} marked as EXPIRED.`);
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to expire mandi price", e);
    }
  };

  const handleCreateMandiPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMandiVariety || !newMandiMarket || !newMandiModalPrice) return;
    setSavingMandi(true);
    try {
      const res = await fetch(`${API_BASE}/admin/mandi/prices`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          crop: newMandiCrop,
          variety: newMandiVariety,
          market: newMandiMarket,
          district: newMandiDistrict,
          min_price: parseFloat(newMandiMinPrice) || parseFloat(newMandiModalPrice) * 0.95,
          max_price: parseFloat(newMandiMaxPrice) || parseFloat(newMandiModalPrice) * 1.05,
          modal_price: parseFloat(newMandiModalPrice),
          arrival_quantity_qtl: parseFloat(newMandiArrivals) || 100,
          telugu_name: newMandiTeluguName || undefined,
          grade_tag: newMandiGradeTag || undefined,
        }),
      });
      if (res.ok) {
        setActionMessage(`Published new verified APMC price record for ${newMandiCrop}.`);
        setShowAddMandiModal(false);
        setNewMandiVariety("");
        setNewMandiMarket("");
        setNewMandiModalPrice("");
        setNewMandiMinPrice("");
        setNewMandiMaxPrice("");
        setNewMandiTeluguName("");
        fetchAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Failed to add mandi price", e);
    } finally {
      setSavingMandi(false);
    }
  };

  const filteredMandiPrices = useMemo(() => {
    let list = [...mandiPrices];
    if (mandiCropFilter !== "All") {
      list = list.filter((m) => m.crop.toLowerCase().includes(mandiCropFilter.toLowerCase()));
    }
    const q = mandiSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.market.toLowerCase().includes(q) ||
          m.variety.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          (m.telugu_name && m.telugu_name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [mandiPrices, mandiCropFilter, mandiSearch]);

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
                RythuSetu Operations &amp; Verification Desk
              </span>
              <span className="text-xs text-indigo-200">
                Data Quality, Moderation &amp; Internal Platform Operations
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1">
              {user.designation || "Operations &amp; Data Verification Lead"} • {user.district} District ({user.state})
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
              <span>Pending Reviews</span>
              <AlertTriangle className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {stats.pending_verification}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Require completeness review
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Dossiers Verified Complete</span>
              <FileCheck2 className="size-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {stats.approved_claims}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {stats.dbt_disbursed} Ready for Official Filing
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Estimated Valuation Tracked</span>
              <IndianRupee className="size-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-800 mt-2">
              ₹{(stats.total_relief_amount / 100000).toFixed(2)} L
            </div>
            <p className="text-[11px] text-teal-600 font-bold mt-1">
              Self-reported &amp; tracked claims
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
          <span>Crop Loss Review Desk ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("storage")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "storage"
              ? "border-sky-600 text-sky-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Warehouse className="size-4 text-sky-600" />
          <span>AC Godown Bookings ({storageBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("factory")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "factory"
              ? "border-emerald-600 text-emerald-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="size-4 text-emerald-600" />
          <span>Factory Passes ({factoryPasses.length})</span>
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
          onClick={() => setActiveTab("mandi")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === "mandi"
              ? "border-emerald-600 text-emerald-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="size-4 text-emerald-600" />
          <span>APMC Mandi Rates ({mandiPrices.length})</span>
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

      {/* TAB 1: CROP LOSS PREPARATION & VERIFICATION DESK */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by Stage:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Intimations" },
                { id: "stage1", label: "Stage 1: Awaiting Review" },
                { id: "stage2", label: "Stage 2: Completeness Verified" },
                { id: "stage3", label: "Stage 3: Preparation Ready" },
                { id: "disbursed", label: "Stage 4: Forwarded to Official Portal" },
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

                    {/* Internal Review Actions */}
                    <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0">
                      {claim.current_stage === 1 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "verify")}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Verify Completeness
                        </button>
                      )}

                      {claim.current_stage === 2 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "approve")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Confirm Pack Ready
                        </button>
                      )}

                      {claim.current_stage === 3 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "disburse")}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Mark Forwarded to Official Portal
                        </button>
                      )}

                      {claim.current_stage === 4 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                          <CheckCircle2 className="size-4 text-teal-600" />
                          <span>Forwarded to Official Portal</span>
                        </div>
                      )}

                      {claim.current_stage < 4 && (
                        <button
                          onClick={() => handleClaimAction(claim.claim_id, "reject")}
                          className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                          title="Flag dossier as incomplete or inconsistent"
                        >
                          Flag Incomplete
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

      {/* TAB: AC GODOWN & STORAGE BOOKING DESK */}
      {activeTab === "storage" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Warehouse className="size-3.5" />
                    Storage & Godown Oversight
                  </span>
                  <span className="text-xs text-slate-500">WDRA Verified AC Warehouses</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Farmer Produce Reservation Bookings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct inward intake requests from farmers reserving space to prevent distress selling.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl">
                  {storageBookings.length} Active Reservations
                </span>
              </div>
            </div>

            {storageBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Warehouse className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">No warehouse bookings registered yet</p>
                <p className="text-xs text-slate-400 mt-1">Bookings submitted by farmers will appear here for manager clearance.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {storageBookings.map((b: any) => (
                  <div
                    key={b.booking_token}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-sky-300 transition shadow-xs"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                            {b.booking_token}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            {b.booking_status || "Approved by Owner"}
                          </span>
                          {b.enwr_pledge_loan_eligible && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                              e-NWR 75% Pledge Eligible
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-slate-900 mt-2">
                          {b.facility_name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {b.location || b.district}, {b.district}, {b.state}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <div className="text-xs text-slate-400">Monthly Rent Est.</div>
                        <div className="text-lg font-black text-slate-900">
                          ₹{b.monthly_rent_inr?.toLocaleString("en-IN") || "--"}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          Duration: {b.duration_months} Months (Total ₹{b.total_estimated_rent_inr?.toLocaleString("en-IN") || "--"})
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Farmer Contact</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{b.farmer_name}</span>
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold mt-1"
                        >
                          <Phone className="size-3" />
                          <span>{b.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Produce Deposited</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{b.commodity}</span>
                        <span className="text-slate-600 block mt-0.5 font-semibold">
                          {b.bags_count} Bags (approx. {(b.bags_count * 0.5).toFixed(1)} Qtl)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Facility Manager In-Charge</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{b.manager_name || "Warehouse Manager"}</span>
                        <a
                          href={`tel:${b.manager_phone}`}
                          className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-bold mt-1"
                        >
                          <Phone className="size-3" />
                          <span>{b.manager_phone || "+91 94401 22849"}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Gate Inward Status</span>
                        <span className="font-bold text-emerald-800 block mt-0.5">
                          🟢 Entry Authorized
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Bay #04 (Section C)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        <span>Registered: {b.created_at || "Recent"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStorageStatus(b.booking_token, "Bay Allotted & Entry Approved")}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-300 hover:bg-sky-100 text-xs font-bold transition cursor-pointer"
                        >
                          Allot Bay
                        </button>
                        <button
                          onClick={() => handleUpdateStorageStatus(b.booking_token, "Goods Deposited (Weighbridge In)")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          Clear Weighbridge & Deposit
                        </button>
                        <button
                          onClick={() => handleUpdateStorageStatus(b.booking_token, "Discharged / Gate Pass Closed")}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
                        >
                          Release / Gate Out
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: FACTORY DIRECT GATE PASSES DESK */}
      {activeTab === "factory" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="size-3.5" />
                    Zero-Broker Factory Gate Desk
                  </span>
                  <span className="text-xs text-slate-500">Corporate Processing Plants & Mills</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Direct Factory Delivery Passes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified delivery authorizations bypassing middlemen with direct weighbridge and instant bank settlement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  {factoryPasses.length} Active Gate Passes
                </span>
              </div>
            </div>

            {factoryPasses.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Truck className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">No factory delivery passes generated yet</p>
                <p className="text-xs text-slate-400 mt-1">Delivery passes issued to farmers will be displayed here for gate verification.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {factoryPasses.map((p: any) => (
                  <div
                    key={p.pass_number}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-emerald-300 transition shadow-xs"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black bg-emerald-950 text-white px-2.5 py-1 rounded-lg">
                            {p.pass_number}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            {p.status || "Gate Entry Approved"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            Saved ₹{p.broker_commission_saved_inr?.toLocaleString("en-IN")} Commission
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mt-2">
                          {p.factory_name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {p.factory_location || p.factory_district}, {p.factory_district}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <div className="text-xs text-slate-400">Agreed Factory Purchase Rate</div>
                        <div className="text-xl font-black text-emerald-700">
                          ₹{p.agreed_rate_per_qtl?.toLocaleString("en-IN")}/qtl
                        </div>
                        <div className="text-[11px] font-bold text-slate-600">
                          Total Value: ₹{p.total_estimated_payout_inr?.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Farmer & Origin</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{p.farmer_name}</span>
                        <span className="text-slate-600 block">{p.origin_village || "Village"}, {p.origin_district}</span>
                        <a
                          href={`tel:${p.phone}`}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold mt-1"
                        >
                          <Phone className="size-3" />
                          <span>{p.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Crop & Quantity</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{p.crop}</span>
                        <span className="font-mono font-bold text-emerald-800 block mt-0.5">
                          {p.allocated_quantity_qtl} Quintals
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Sourcing Desk</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{p.procurement_manager || p.procurement_officer || "Procurement Manager"}</span>
                        <a
                          href={`tel:${p.officer_phone || p.contact_phone || "+918632294810"}`}
                          className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-bold mt-1"
                        >
                          <Phone className="size-3" />
                          <span>{p.contact_phone || p.officer_phone || "+91 863 229 4810"}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Delivery Slot</span>
                        <span className="font-bold text-slate-900 block mt-0.5">
                          📅 {p.delivery_date || "Today"}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                          Priority Gate 1 Entry
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        <span>Issued: {p.generated_at || "Recent"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdatePassStatus(p.pass_number, "Gate Entry Cleared")}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
                        >
                          Clear Gate Entry
                        </button>
                        <button
                          onClick={() => handleUpdatePassStatus(p.pass_number, "Weighbridge & Quality Cleared")}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-300 hover:bg-sky-100 text-xs font-bold transition cursor-pointer"
                        >
                          Verify Weighbridge & Lab
                        </button>
                        <button
                          onClick={() => handleUpdatePassStatus(p.pass_number, "Unloaded & Payment Credited (Direct Bank)")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          Confirm Unload & Credit DBT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Cultivators Only</option>
                <option value="data_verifier">Data Verifiers</option>
                <option value="support_agent">Support Agents</option>
                <option value="admin">Administrators</option>
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
                  Registered Cultivators &amp; Operations Accounts
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
                            u.role === "admin" || u.role === "super_admin"
                              ? "bg-indigo-100 text-indigo-900"
                              : u.role === "data_verifier"
                                ? "bg-amber-100 text-amber-900"
                                : u.role === "support_agent"
                                  ? "bg-sky-100 text-sky-900"
                                  : "bg-emerald-100 text-emerald-900"
                          }`}>
                            {u.role === "admin" || u.role === "super_admin" ? (
                              <Shield className="size-3" />
                            ) : u.role === "data_verifier" ? (
                              <FileCheck2 className="size-3" />
                            ) : (
                              <Sprout className="size-3" />
                            )}
                            {u.role === "admin"
                              ? "Admin"
                              : u.role === "super_admin"
                                ? "Super Admin"
                                : u.role === "data_verifier"
                                  ? "Data Verifier"
                                  : u.role === "support_agent"
                                    ? "Support Agent"
                                    : "Cultivator"}
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
                            <span className="text-slate-400 text-[11px]">Operations &amp; Support Staff</span>
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

      {/* TAB: APMC MANDI RATES DESK */}
      {activeTab === "mandi" && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Data Quality &amp; Market Benchmarking Desk
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  APMC Mandi Benchmark Registry &amp; Spot Rates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update daily modal benchmarks, verify arrival lots, or publish new APMC yard arrivals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddMandiModal(true)}
                  className="px-4 py-2 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Plus className="size-4" />
                  <span>Publish New Mandi Entry</span>
                </button>
              </div>
            </div>

            {/* Market Data Pipeline & Ingestion Telemetry Card */}
            <div className="mb-6 rounded-2xl bg-slate-900 text-white p-5 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Truck className="size-4" />
                    </span>
                    <h4 className="text-sm font-black text-white">
                      Government OGD / AGMARKNET Ingestion Pipeline
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Automated Pipeline
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Endpoint: <code className="text-slate-300">api.data.gov.in/resource/9ef84268...</code> • SSRF Protected Egress
                  </p>
                </div>

                <button
                  onClick={handleTriggerMandiSync}
                  disabled={syncingMandi}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                >
                  <RefreshCw className={`size-3.5 ${syncingMandi ? "animate-spin text-white" : ""}`} />
                  <span>{syncingMandi ? "Syncing Upstream..." : "Trigger Ingestion Sync"}</span>
                </button>
              </div>

              {ingestionStatus?.latest_run && (
                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Last Status</span>
                    <span className={`font-black text-xs ${
                      ingestionStatus.latest_run.status === "SUCCESS" ? "text-emerald-400" :
                      ingestionStatus.latest_run.status === "OFFLINE_UNCONFIGURED" ? "text-sky-300" :
                      "text-amber-400"
                    }`}>
                      {ingestionStatus.latest_run.status}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Records Received</span>
                    <span className="font-black text-white">{ingestionStatus.latest_run.records_received}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Records Upserted</span>
                    <span className="font-black text-emerald-400">{ingestionStatus.latest_run.records_inserted + ingestionStatus.latest_run.records_updated}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Completed At</span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {ingestionStatus.latest_run.completed_at ? ingestionStatus.latest_run.completed_at.slice(0, 16).replace("T", " ") : "Recent"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  placeholder="Search market yard, crop, variety..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">Crop:</span>
                {["All", "Cotton", "Red Chilli", "Paddy / Rice", "Turmeric", "Groundnut", "Maize"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setMandiCropFilter(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                      mandiCropFilter === c
                        ? "bg-emerald-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandi Price Registry Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Market Yard / District</th>
                    <th className="py-3 px-4">Crop &amp; Variety</th>
                    <th className="py-3 px-4">Modal Price (₹/qtl)</th>
                    <th className="py-3 px-4">Trading Range</th>
                    <th className="py-3 px-4">Daily Arrivals</th>
                    <th className="py-3 px-4">Last Verified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMandiPrices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No mandi records match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMandiPrices.map((m: any) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{m.market}</div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {m.district}, {m.state}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-emerald-950 block">{m.variety}</span>
                          <span className="text-[11px] text-slate-500">
                            {m.crop} {m.telugu_name ? `• ${m.telugu_name}` : ""}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {editingPriceId === m.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editModalValue}
                                onChange={(e) => setEditModalValue(e.target.value)}
                                className="w-24 px-2 py-1 border border-emerald-500 rounded-lg text-xs font-black"
                              />
                              <button
                                onClick={() => handleUpdateMandiPrice(m.id)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="font-mono font-black text-sm text-slate-900">
                              ₹{m.modal_price?.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          ₹{m.min_price?.toLocaleString()} - ₹{m.max_price?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {m.arrival_quantity_qtl || 150} qtl
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            {m.verification_status || "VERIFIED"}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <span>{m.last_verified_at || m.effective_date}</span>
                            {m.source_url && (
                              <a
                                href={m.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:text-emerald-950 inline-flex items-center"
                                title="Open e-NAM Feed Source"
                              >
                                <ExternalLink className="size-2.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPriceId(m.id);
                                setEditModalValue(String(m.modal_price));
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Edit Modal Price"
                            >
                              <Edit3 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleExpireMandiPrice(m.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Expire / Soft-delete Record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
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

      {/* Publish New Mandi Entry Modal */}
      {showAddMandiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-black text-slate-900">Publish Verified APMC Rate</h4>
                <p className="text-xs text-slate-500">Official Agriculture Extension entry for AP &amp; Telangana</p>
              </div>
              <button
                onClick={() => setShowAddMandiModal(false)}
                className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMandiPrice} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Crop</label>
                  <select
                    value={newMandiCrop}
                    onChange={(e) => setNewMandiCrop(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold bg-white"
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Red Chilli">Red Chilli</option>
                    <option value="Paddy / Rice">Paddy / Rice</option>
                    <option value="Turmeric">Turmeric</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Maize">Maize</option>
                    <option value="Pigeon Pea / Red Gram (Tur)">Red Gram (Tur)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">District</label>
                  <input
                    type="text"
                    value={newMandiDistrict}
                    onChange={(e) => setNewMandiDistrict(e.target.value)}
                    required
                    placeholder="e.g. Warangal / Guntur"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Variety / Breed</label>
                <input
                  type="text"
                  value={newMandiVariety}
                  onChange={(e) => setNewMandiVariety(e.target.value)}
                  required
                  placeholder="e.g. Teja / S17 or Basmati 1121"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Market Yard Hub</label>
                <input
                  type="text"
                  value={newMandiMarket}
                  onChange={(e) => setNewMandiMarket(e.target.value)}
                  required
                  placeholder="e.g. Warangal Enumamula Yard or Guntur Yard"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    value={newMandiMinPrice}
                    onChange={(e) => setNewMandiMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Modal Price (₹)</label>
                  <input
                    type="number"
                    value={newMandiModalPrice}
                    onChange={(e) => setNewMandiModalPrice(e.target.value)}
                    required
                    placeholder="Today's Modal"
                    className="w-full p-2 border border-slate-200 rounded-xl font-black text-emerald-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    value={newMandiMaxPrice}
                    onChange={(e) => setNewMandiMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Arrivals (Quintals)</label>
                  <input
                    type="number"
                    value={newMandiArrivals}
                    onChange={(e) => setNewMandiArrivals(e.target.value)}
                    placeholder="150"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Grade Tag</label>
                  <input
                    type="text"
                    value={newMandiGradeTag}
                    onChange={(e) => setNewMandiGradeTag(e.target.value)}
                    placeholder="e.g. Deluxe Export Grade"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Telugu Name (Optional)</label>
                <input
                  type="text"
                  value={newMandiTeluguName}
                  onChange={(e) => setNewMandiTeluguName(e.target.value)}
                  placeholder="తెలుగు పేరు"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMandiModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMandi}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black cursor-pointer shadow-xs"
                >
                  {savingMandi ? "Publishing..." : "Publish to Farmers"}
                </button>
              </div>
            </form>
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
