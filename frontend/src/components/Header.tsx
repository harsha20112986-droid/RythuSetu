import { Languages, Sprout, Phone, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { type Page, type Farmer, type AuthUser } from "../types";

export function Header({
  page,
  setPage,
  farmer,
  language,
  setLanguage,
  onOpenIvr,
  currentUser,
  onOpenLogin,
  onLogout,
  onRequestFarmProfile,
}: {
  page: Page;
  setPage: (p: Page) => void;
  farmer: Farmer | null;
  language: string;
  setLanguage: (l: string) => void;
  onOpenIvr: () => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onRequestFarmProfile?: () => void;
}) {
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/90 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => setPage(isAdmin ? "admin" : "home")}
          className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className={`relative grid size-10 place-items-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105 ${
            isAdmin
              ? "bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 shadow-indigo-900/20"
              : "bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 shadow-emerald-800/20"
          }`}>
            {isAdmin ? <ShieldCheck className="size-5.5 text-indigo-100" /> : <Sprout className="size-5.5 text-emerald-100" />}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isAdmin ? "bg-indigo-400" : "bg-emerald-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-white ${
                isAdmin ? "bg-indigo-500" : "bg-emerald-500"
              }`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">RythuSetu</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                isAdmin
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-emerald-100/80 text-emerald-800"
              }`}>
                {isAdmin ? "Officer Portal" : "Krishi AI"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              {isAdmin ? "Government Command Desk" : "AI Bridge to Farmer Support"}
            </p>
          </div>
        </button>

        {/* Center Nav - Role-specific */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-inner overflow-x-auto max-w-xl">
          {isAdmin ? (
            /* Admin Officer Navigation */
            <>
              <button
                onClick={() => setPage("admin")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  page === "admin"
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🏛️ Officer Command Desk
              </button>
              <button
                onClick={() => setPage("home")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  page === "home"
                    ? "bg-white text-indigo-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Platform Home
              </button>
            </>
          ) : (
            /* Farmer Navigation */
            <>
              <button
                onClick={() => setPage("home")}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  page === "home"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </button>

              {farmer ? (
                <>
                  <button
                    onClick={() => setPage("dashboard")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "dashboard"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setPage("mandi")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "mandi"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mandi Rates
                  </button>
                  <button
                    onClick={() => setPage("fertilizer")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "fertilizer"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Fertilizer NPK
                  </button>
                  <button
                    onClick={() => setPage("schemes")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "schemes"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Schemes
                  </button>
                  <button
                    onClick={() => setPage("benefits")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "benefits"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Benefits
                  </button>
                  <button
                    onClick={() => setPage("doctor")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "doctor"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Crop Doctor
                  </button>
                  <button
                    onClick={() => setPage("loss")}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      page === "loss"
                        ? "bg-white text-emerald-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    PMFBY Claims
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (onRequestFarmProfile) {
                      onRequestFarmProfile();
                    } else if (!currentUser) {
                      onOpenLogin();
                    } else {
                      setPage("onboarding");
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    page === "onboarding"
                      ? "bg-white text-emerald-950 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Set Up Farm Profile
                </button>
              )}
            </>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Toll-free Helpline Button (For farmers) */}
          {!isAdmin && (
            <button
              onClick={onOpenIvr}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
              title="1800 Kisan Helpline Simulator"
            >
              <Phone className="size-3.5 text-emerald-600 animate-pulse" />
              <span>1800 Helpline</span>
            </button>
          )}

          {/* Multilingual Selector */}
          <div className="hidden sm:flex items-center bg-slate-100/90 rounded-2xl p-0.5 border border-slate-200/80 shadow-inner">
            <Languages className="size-3.5 text-slate-500 ml-1.5 mr-1 shrink-0" />
            <button
              onClick={() => setLanguage("English")}
              className={`px-2 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                language === "English"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("Telugu")}
              className={`px-2 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                language === "Telugu"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"}
            </button>
            <button
              onClick={() => setLanguage("Hindi")}
              className={`px-2 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                language === "Hindi"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {"\u0939\u093F\u0928\u094D\u0926\u0940"}
            </button>
          </div>

          {/* User Authentication Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 border text-xs font-bold shadow-2xs ${
                isAdmin
                  ? "bg-indigo-50 border-indigo-200 text-indigo-950"
                  : "bg-emerald-50/90 border-emerald-200 text-emerald-950"
              }`}>
                <div className={`size-6 rounded-full text-white flex items-center justify-center text-[10px] font-black ${
                  isAdmin ? "bg-indigo-700" : "bg-emerald-700"
                }`}>
                  {isAdmin ? "A" : currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <div className="font-bold truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[9px] text-slate-500 font-normal">
                    {isAdmin ? "Officer" : "Cultivator"}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="size-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 flex items-center justify-center transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
              >
                <LogIn className="size-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
