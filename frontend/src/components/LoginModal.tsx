import { useState, useEffect } from "react";
import { Lock, User, ShieldCheck, ArrowRight, X, AlertCircle, UserPlus, LogIn } from "lucide-react";
import {
  type AuthUser,
  type Farmer,
  API_BASE,
  ALL_STATES,
  getDistrictsForState,
  getMandalsForDistrict,
  getVillagesForMandal,
  EXHAUSTIVE_CROPS,
  type CropCategory,
} from "../types";

export function LoginModal({
  open,
  onClose,
  onLoginSuccess,
  notice,
  initialTab = "login",
}: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, farmerProfile?: Farmer) => void;
  notice?: string;
  initialTab?: "login" | "register";
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);
  
  // Sign In state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Registration state
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regRole, setRegRole] = useState<"farmer" | "admin">("farmer");
  const [regState, setRegState] = useState("Telangana");
  const [regDistrict, setRegDistrict] = useState(() => getDistrictsForState("Telangana")[0] || "Warangal");
  const [regMandal, setRegMandal] = useState(() => getMandalsForDistrict("Telangana", "Warangal")[0] || "");
  const [regVillage, setRegVillage] = useState(() => getVillagesForMandal("Telangana", "Warangal", getMandalsForDistrict("Telangana", "Warangal")[0] || "")[0] || "");
  const [customMandal, setCustomMandal] = useState(false);
  const [customVillage, setCustomVillage] = useState(false);
  const [regCrop, setRegCrop] = useState("Cotton");
  const [regSeason] = useState("Kharif");
  const [regAcres, setRegAcres] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const availableDistricts = getDistrictsForState(regState);
  const availableMandals = getMandalsForDistrict(regState, regDistrict);
  const availableVillages = getVillagesForMandal(regState, regDistrict, regMandal);

  const handleStateChange = (nextState: string) => {
    setRegState(nextState);
    const dists = getDistrictsForState(nextState);
    const firstDist = dists[0] || "";
    setRegDistrict(firstDist);
    const mandals = getMandalsForDistrict(nextState, firstDist);
    const firstMandal = mandals[0] || "";
    setRegMandal(firstMandal);
    const villages = getVillagesForMandal(nextState, firstDist, firstMandal);
    setRegVillage(villages[0] || "");
    setCustomMandal(false);
    setCustomVillage(false);
  };

  const handleDistrictChange = (nextDist: string) => {
    setRegDistrict(nextDist);
    const mandals = getMandalsForDistrict(regState, nextDist);
    const firstMandal = mandals[0] || "";
    setRegMandal(firstMandal);
    const villages = getVillagesForMandal(regState, nextDist, firstMandal);
    setRegVillage(villages[0] || "");
    setCustomMandal(false);
    setCustomVillage(false);
  };

  const handleMandalChange = (nextMandal: string) => {
    if (nextMandal === "__custom__") {
      setCustomMandal(true);
      setRegMandal("");
      setRegVillage("");
      return;
    }
    setCustomMandal(false);
    setRegMandal(nextMandal);
    const villages = getVillagesForMandal(regState, regDistrict, nextMandal);
    setRegVillage(villages[0] || "");
    setCustomVillage(false);
  };

  const handleVillageChange = (nextVillage: string) => {
    if (nextVillage === "__custom__") {
      setCustomVillage(true);
      setRegVillage("");
      return;
    }
    setCustomVillage(false);
    setRegVillage(nextVillage);
  };

  // Group exhaustive crops by category
  const cropsByCategory = EXHAUSTIVE_CROPS.reduce((acc, crop) => {
    if (!acc[crop.category]) acc[crop.category] = [];
    acc[crop.category].push(crop);
    return acc;
  }, {} as Record<CropCategory, typeof EXHAUSTIVE_CROPS>);

  const cropCategories = Object.keys(cropsByCategory) as CropCategory[];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUser = username.trim();
    const rawPw = password.trim();

    if (!rawUser || !rawPw) {
      setError("Please enter your username, full name, or mobile number and password.");
      return;
    }

    setLoading(true);
    setError("");

    // 1. Try Backend API Authentication
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: rawUser, password: rawPw }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("rythusetu_user", JSON.stringify(data.user));
        if (data.access_token) {
          localStorage.setItem("rythusetu_token", data.access_token);
        }

        // If farmer, fetch their profile if linked
        let farmerObj: Farmer | undefined = undefined;
        if (data.user.role === "farmer" && data.user.farmer_profile_id) {
          try {
            const fRes = await fetch(`${API_BASE}/farmers/${data.user.farmer_profile_id}`);
            if (fRes.ok) {
              const fData = await fRes.json();
              farmerObj = { id: fData.id, form: fData };
              localStorage.setItem("rythusetu_farmer", JSON.stringify(farmerObj));
            }
          } catch {
            // ignore
          }
        }

        // Update local session registry
        const savedUsers = JSON.parse(localStorage.getItem("rythusetu_registered_users") || "[]");
        const idx = savedUsers.findIndex((u: any) => 
          u.username?.toLowerCase() === rawUser.toLowerCase() ||
          u.name?.toLowerCase() === rawUser.toLowerCase() ||
          (rawUser.replace(/\D/g, "").length >= 7 && u.phone?.replace(/\D/g, "").endsWith(rawUser.replace(/\D/g, "").slice(-10)))
        );
        if (idx !== -1) {
          savedUsers[idx].lastLoginAt = new Date().toISOString();
          localStorage.setItem("rythusetu_registered_users", JSON.stringify(savedUsers));
        }

        onLoginSuccess(data.user, farmerObj);
        onClose();
        return;
      }
    } catch {
      // Backend may be sleeping or cold-starting; proceed to client-side resilient auth
    }

    // 2. Client-Side Resilient Local Store Authentication
    // Ensures a farmer who registered is never locked out due to cold starts or database restarts
    const savedUsers = JSON.parse(localStorage.getItem("rythusetu_registered_users") || "[]");
    const normInput = rawUser.toLowerCase();
    const cleanDigits = rawUser.replace(/\D/g, "");

    const matchedLocalUser = savedUsers.find((u: any) => {
      const matchUsername = u.username?.toLowerCase() === normInput;
      const matchName = u.name?.toLowerCase() === normInput;
      const uDigits = u.phone ? u.phone.replace(/\D/g, "") : "";
      const matchPhone = cleanDigits.length >= 7 && uDigits && (uDigits.endsWith(cleanDigits.slice(-10)) || cleanDigits.endsWith(uDigits.slice(-10)));
      const matchPw = (u.password || "").trim() === rawPw;
      return (matchUsername || matchName || matchPhone) && matchPw;
    });

    if (matchedLocalUser) {
      matchedLocalUser.lastLoginAt = new Date().toISOString();
      localStorage.setItem("rythusetu_registered_users", JSON.stringify(savedUsers));

      const authUser: AuthUser = {
        username: matchedLocalUser.username,
        name: matchedLocalUser.name,
        role: matchedLocalUser.role || "farmer",
        phone: matchedLocalUser.phone || "",
        designation: matchedLocalUser.role === "admin" ? "Mandal Agriculture Officer" : "Registered Smallholder",
        district: matchedLocalUser.district || "Warangal",
        state: matchedLocalUser.state || "Telangana",
        last_login_at: new Date().toLocaleString(),
        is_online: true,
      };

      let farmerObj: Farmer | undefined = undefined;
      if (authUser.role === "farmer") {
        farmerObj = {
          id: matchedLocalUser.farmer_profile_id || 1,
          form: {
            name: matchedLocalUser.name,
            language: "English",
            state: matchedLocalUser.state || "Telangana",
            district: matchedLocalUser.district || "Warangal",
            mandal: matchedLocalUser.mandal || "",
            village: matchedLocalUser.village || "",
            crop: matchedLocalUser.crop || "Cotton",
            season: matchedLocalUser.season || "Kharif",
            land_area_acres: matchedLocalUser.land_area_acres || "2.0",
          },
        };
        localStorage.setItem("rythusetu_farmer", JSON.stringify(farmerObj));
      }

      localStorage.setItem("rythusetu_user", JSON.stringify(authUser));

      // Attempt background re-sync to backend if container was restored
      fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: matchedLocalUser.name,
          username: matchedLocalUser.username,
          password: matchedLocalUser.password,
          role: matchedLocalUser.role || "farmer",
          state: matchedLocalUser.state,
          district: matchedLocalUser.district,
          mandal: matchedLocalUser.mandal || "",
          village: matchedLocalUser.village || "",
          crop: matchedLocalUser.crop || "Cotton",
          season: matchedLocalUser.season || "Kharif",
          land_area_acres: parseFloat(matchedLocalUser.land_area_acres) || 2.0,
          phone: matchedLocalUser.phone || "",
        }),
      }).catch(() => {});

      setLoading(false);
      onLoginSuccess(authUser, farmerObj);
      onClose();
      return;
    }

    // 3. Fallback for default Admin and Farmer test accounts
    if (normInput === "admin" && rawPw === "admin123") {
      const adminUser: AuthUser = {
        username: "admin",
        name: "Agriculture Extension Officer",
        role: "admin",
        phone: "+91 98480 12345",
        designation: "Mandal Agriculture Officer (MAO)",
        district: "Warangal",
        state: "Telangana",
        is_online: true,
      };
      localStorage.setItem("rythusetu_user", JSON.stringify(adminUser));
      setLoading(false);
      onLoginSuccess(adminUser, undefined);
      onClose();
      return;
    }

    if ((normInput === "farmer" || normInput === "demo") && rawPw === "farmer123") {
      const farmerUser: AuthUser = {
        username: "farmer",
        name: "Kishan Rao",
        role: "farmer",
        phone: "+91 98480 22338",
        designation: "Registered Smallholder",
        district: "Warangal",
        state: "Telangana",
        is_online: true,
      };
      const fObj: Farmer = {
        id: 101,
        form: {
          name: "Kishan Rao",
          language: "Telugu",
          state: "Telangana",
          district: "Warangal",
          mandal: "Narsampet",
          village: "Chennaraopet",
          crop: "Cotton",
          season: "Kharif",
          land_area_acres: "3.5",
        },
      };
      localStorage.setItem("rythusetu_user", JSON.stringify(farmerUser));
      localStorage.setItem("rythusetu_farmer", JSON.stringify(fObj));
      setLoading(false);
      onLoginSuccess(farmerUser, fObj);
      onClose();
      return;
    }

    setLoading(false);
    setError("Invalid credentials. Please verify your username, full name, or registered mobile number and password.");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError("Please fill in your name, username, and password.");
      return;
    }

    setLoading(true);
    setError("");

    const newRegistrationPayload = {
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword.trim(),
      role: regRole,
      state: regState,
      district: regDistrict,
      mandal: regMandal.trim(),
      village: regVillage.trim(),
      crop: regCrop,
      season: regSeason,
      land_area_acres: regAcres || "2.0",
      phone: regPhone.trim(),
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // 1. Save immediately to Local Store
    const savedUsers = JSON.parse(localStorage.getItem("rythusetu_registered_users") || "[]");
    const existingIdx = savedUsers.findIndex((u: any) => u.username?.toLowerCase() === regUsername.trim().toLowerCase());
    if (existingIdx !== -1) {
      savedUsers[existingIdx] = newRegistrationPayload;
    } else {
      savedUsers.push(newRegistrationPayload);
    }
    localStorage.setItem("rythusetu_registered_users", JSON.stringify(savedUsers));

    // 2. Transmit to Backend API
    let serverUser: AuthUser | null = null;
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          username: regUsername.trim(),
          password: regPassword.trim(),
          role: regRole,
          state: regState,
          district: regDistrict,
          mandal: regMandal.trim(),
          village: regVillage.trim(),
          crop: regCrop,
          season: regSeason,
          land_area_acres: parseFloat(regAcres) || 2.0,
          phone: regPhone.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        serverUser = data.user;
        if (data.access_token) {
          localStorage.setItem("rythusetu_token", data.access_token);
        }
      }
    } catch {
      // Backend temporarily offline; proceed with resilient registration
    }

    const activeUser: AuthUser = serverUser || {
      username: regUsername.trim(),
      name: regName.trim(),
      role: regRole,
      phone: regPhone.trim(),
      designation: regRole === "admin" ? "Mandal Agriculture Officer" : "Registered Smallholder",
      district: regDistrict,
      state: regState,
      last_login_at: new Date().toLocaleString(),
      is_online: true,
    };

    localStorage.setItem("rythusetu_user", JSON.stringify(activeUser));

    // Build farmer object
    let farmerObj: Farmer | undefined = undefined;
    if (activeUser.role === "farmer") {
      farmerObj = {
        id: activeUser.farmer_profile_id || 1,
        form: {
          name: regName.trim(),
          language: "English",
          state: regState,
          district: regDistrict,
          mandal: regMandal.trim(),
          village: regVillage.trim(),
          crop: regCrop,
          season: regSeason,
          land_area_acres: regAcres || "2.0",
        },
      };
      localStorage.setItem("rythusetu_farmer", JSON.stringify(farmerObj));
    }

    setLoading(false);
    onLoginSuccess(activeUser, farmerObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="size-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">RythuSetu Access Portal</h2>
              <p className="text-xs text-emerald-200">Secure Sign In & Account Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab switcher: Only Sign In and Register */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3">
          <button
            onClick={() => { setActiveTab("login"); setError(""); }}
            className={`flex items-center gap-2 pb-3 px-6 font-bold text-xs border-b-2 transition cursor-pointer ${
              activeTab === "login"
                ? "border-emerald-600 text-emerald-950 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="size-4" />
            Sign In
          </button>

          <button
            onClick={() => { setActiveTab("register"); setError(""); }}
            className={`flex items-center gap-2 pb-3 px-6 font-bold text-xs border-b-2 transition cursor-pointer ${
              activeTab === "register"
                ? "border-emerald-600 text-emerald-950 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="size-4" />
            Register New Account
          </button>
        </div>

        <div className="p-6">
          {notice && (
            <div className="mb-4 flex items-center gap-2.5 rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-amber-900 text-xs font-semibold">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 border border-red-200 text-red-700 text-xs font-semibold">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username or Registered Phone
                </label>
                <div className="relative">
                  <User className="size-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Sign In"}
                <ArrowRight className="size-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab("register"); setError(""); }}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  New to RythuSetu? Create a free farmer or officer account →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="farmer">Cultivator / Farmer</option>
                    <option value="admin">Agriculture Officer (MAO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Krishna Rao"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Desired username"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98480 XXXXX"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                  >
                    {ALL_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District ({availableDistricts.length})
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {regRole === "farmer" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Mandal
                        </label>
                        {!customMandal && (
                          <button
                            type="button"
                            onClick={() => setCustomMandal(true)}
                            className="text-[10px] text-emerald-600 hover:underline font-semibold cursor-pointer"
                          >
                            + Custom
                          </button>
                        )}
                      </div>
                      {!customMandal ? (
                        <select
                          value={regMandal}
                          onChange={(e) => handleMandalChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                        >
                          <option value="">-- Select Mandal --</option>
                          {availableMandals.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                          <option value="__custom__">+ Other / Enter Custom</option>
                        </select>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            value={regMandal}
                            onChange={(e) => setRegMandal(e.target.value)}
                            placeholder="Mandal name"
                            className="w-full px-3 py-2 text-xs border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCustomMandal(false);
                              if (availableMandals.length > 0) handleMandalChange(availableMandals[0]);
                            }}
                            className="absolute right-2 top-2 text-[10px] text-slate-500 hover:text-emerald-700"
                          >
                            List
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Village
                        </label>
                        {!customVillage && (
                          <button
                            type="button"
                            onClick={() => setCustomVillage(true)}
                            className="text-[10px] text-emerald-600 hover:underline font-semibold cursor-pointer"
                          >
                            + Custom
                          </button>
                        )}
                      </div>
                      {!customVillage ? (
                        <select
                          value={regVillage}
                          onChange={(e) => handleVillageChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                        >
                          <option value="">-- Select Village --</option>
                          {availableVillages.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                          <option value="__custom__">+ Other / Enter Custom</option>
                        </select>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            value={regVillage}
                            onChange={(e) => setRegVillage(e.target.value)}
                            placeholder="Village name"
                            className="w-full px-3 py-2 text-xs border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCustomVillage(false);
                              if (availableVillages.length > 0) setRegVillage(availableVillages[0]);
                            }}
                            className="absolute right-2 top-2 text-[10px] text-slate-500 hover:text-emerald-700"
                          >
                            List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Crop ({EXHAUSTIVE_CROPS.length} Crops)
                      </label>
                      <select
                        value={regCrop}
                        onChange={(e) => setRegCrop(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                      >
                        {cropCategories.map((cat) => (
                          <optgroup key={cat} label={cat}>
                            {cropsByCategory[cat]?.map((c) => (
                              <option key={c.key} value={c.name}>
                                {c.name} ({c.teluguName})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Land Area (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={regAcres}
                        onChange={(e) => setRegAcres(e.target.value)}
                        placeholder="e.g. 3.5"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set account password"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="size-4" />
                <span>{loading ? "Creating Account..." : "Create Registered Account"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
