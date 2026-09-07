import { useState } from "react";
import { Lock, User, ShieldCheck, ArrowRight, X, AlertCircle, UserPlus, LogIn } from "lucide-react";
import { type AuthUser, type Farmer, API_BASE } from "../types";

export function LoginModal({
  open,
  onClose,
  onLoginSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, farmerProfile?: Farmer) => void;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Sign In state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Registration state
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regRole, setRegRole] = useState<"farmer" | "admin">("farmer");
  const [regState, setRegState] = useState("Telangana");
  const [regDistrict, setRegDistrict] = useState("Warangal");
  const [regMandal, setRegMandal] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regCrop, setRegCrop] = useState("Cotton");
  const [regSeason] = useState("Kharif");
  const [regAcres, setRegAcres] = useState("3.0");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

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

      onLoginSuccess(data.user, farmerObj);
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError("Please fill in your name, username, and password.");
      return;
    }

    setLoading(true);
    setError("");

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      localStorage.setItem("rythusetu_user", JSON.stringify(data.user));
      if (data.access_token) {
        localStorage.setItem("rythusetu_token", data.access_token);
      }

      // Build farmer object
      let farmerObj: Farmer | undefined = undefined;
      if (data.user.role === "farmer") {
        farmerObj = {
          id: data.user.farmer_profile_id || 1,
          form: {
            name: regName.trim(),
            language: "English",
            state: regState,
            district: regDistrict,
            mandal: regMandal.trim(),
            village: regVillage.trim(),
            crop: regCrop,
            season: regSeason,
            land_area_acres: regAcres,
          },
        };
        localStorage.setItem("rythusetu_farmer", JSON.stringify(farmerObj));
      }

      onLoginSuccess(data.user, farmerObj);
      onClose();
    } catch (err: any) {
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
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
                    placeholder="Your legal name"
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
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Warangal">Warangal</option>
                    <option value="Karimnagar">Karimnagar</option>
                    <option value="Khammam">Khammam</option>
                    <option value="Nizamabad">Nizamabad</option>
                    <option value="Anantapur">Anantapur</option>
                    <option value="Guntur">Guntur</option>
                  </select>
                </div>
              </div>

              {regRole === "farmer" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mandal
                      </label>
                      <input
                        type="text"
                        value={regMandal}
                        onChange={(e) => setRegMandal(e.target.value)}
                        placeholder="e.g. Geesugonda"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Village
                      </label>
                      <input
                        type="text"
                        value={regVillage}
                        onChange={(e) => setRegVillage(e.target.value)}
                        placeholder="e.g. Dharmaram"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Crop
                      </label>
                      <select
                        value={regCrop}
                        onChange={(e) => setRegCrop(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Cotton">Cotton</option>
                        <option value="Paddy / Rice">Paddy / Rice</option>
                        <option value="Groundnut">Groundnut</option>
                        <option value="Maize">Maize</option>
                        <option value="Red Chilli">Red Chilli</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Land Area (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        value={regAcres}
                        onChange={(e) => setRegAcres(e.target.value)}
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
