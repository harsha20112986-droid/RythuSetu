import {
  LayoutDashboard,
  User,
  CloudRain,
  Sprout,
  TrendingUp,
  Landmark,
  ShieldAlert,
  Tractor,
  Warehouse,
  Calculator,
  HeadphonesIcon,
  LogOut,
  LogIn,
  X,
  Languages,
  Stethoscope,
  Truck,
  MapPin,
  FlaskConical,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { Page, Farmer, AuthUser } from "../types";

export interface NavItemConfig {
  id: Page | "weather";
  label: string;
  teluguLabel: string;
  icon: React.ElementType;
  badge?: string;
  isWeather?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "dashboard", label: "Dashboard", teluguLabel: "డాష్‌బోర్డ్", icon: LayoutDashboard },
  { id: "onboarding", label: "Farm Profile", teluguLabel: "రైతు ప్రొఫైల్", icon: User },
  { id: "weather", label: "Weather Radar", teluguLabel: "వాతావరణం", icon: CloudRain, isWeather: true },
  { id: "recommendation", label: "Crop Advisory", teluguLabel: "పంట సలహాలు", icon: Sprout },
  { id: "doctor", label: "Crop Doctor", teluguLabel: "పంట డాక్టర్", icon: Stethoscope, badge: "AI" },
  { id: "mandi", label: "Market Prices", teluguLabel: "మార్కెట్ రేట్లు", icon: TrendingUp },
  { id: "schemes", label: "Schemes", teluguLabel: "సంక్షేమ పథకాలు", icon: Landmark },
  { id: "loss", label: "Crop Loss", teluguLabel: "పంట నష్టం (PMFBY)", icon: ShieldAlert },
  { id: "machinery", label: "Machinery", teluguLabel: "యంత్రాల అద్దె", icon: Tractor },
  { id: "storage", label: "Storage", teluguLabel: "కోల్డ్ స్టోరేజ్", icon: Warehouse },
  { id: "factory", label: "Direct Market", teluguLabel: "ఫ్యాక్టరీ అమ్మకాలు", icon: Truck },
  { id: "nearby", label: "Agro Hub", teluguLabel: "సమీప కేంద్రాలు", icon: MapPin },
  { id: "fertilizer", label: "Fertilizer", teluguLabel: "ఎరువుల మోతాదు", icon: FlaskConical },
  { id: "khata", label: "Agri Khata", teluguLabel: "డిజిటల్ ఖాటా", icon: Calculator },
  { id: "action-center", label: "Support & Action", teluguLabel: "అధికారిక సేవలు", icon: HeadphonesIcon },
];

export function Sidebar({
  page,
  setPage,
  farmer,
  currentUser,
  language,
  setLanguage,
  onOpenLogin,
  onLogout,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  setMobileOpen,
}: {
  page: Page;
  setPage: (p: Page) => void;
  farmer: Farmer | null;
  currentUser: AuthUser | null;
  language: string;
  setLanguage: (l: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const isStaff =
    currentUser?.role === "admin" ||
    currentUser?.role === "data_verifier" ||
    currentUser?.role === "support_agent" ||
    currentUser?.role === "super_admin";

  const handleNavigate = (item: NavItemConfig) => {
    if (item.isWeather) {
      if (page !== "dashboard") {
        setPage("dashboard");
      }
      setTimeout(() => {
        const el = document.getElementById("weather-station");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      setMobileOpen(false);
      return;
    }

    const id = item.id as Page;
    if (id === "onboarding" && !farmer && !currentUser) {
      onOpenLogin();
    } else if (
      (id === "schemes" || id === "loss" || id === "benefits") &&
      !currentUser
    ) {
      onOpenLogin();
    } else if (id === "dashboard" && !farmer) {
      setPage("onboarding");
    } else {
      setPage(id);
    }
    setMobileOpen(false);
  };

  const cycleLanguage = () => {
    if (language === "English") setLanguage("Telugu");
    else if (language === "Telugu") setLanguage("Hindi");
    else setLanguage("English");
  };

  const getLanguageLabel = () => {
    if (language === "Telugu") return "తెలుగు";
    if (language === "Hindi") return "हिन्दी";
    return "English";
  };

  const getLanguageShortCode = () => {
    if (language === "Telugu") return "తె";
    if (language === "Hindi") return "हि";
    return "EN";
  };

  // Content for the Sidebar (reused in desktop sticky and mobile drawer)
  const renderSidebarBody = (isDrawer = false) => {
    const isThin = collapsed && !isDrawer;

    return (
      <div className="flex flex-col h-full select-none">
        {/* ── Brand Header ── */}
        <div className={`flex items-center ${isThin ? "justify-center px-2 py-4" : "justify-between px-4 py-4"} border-b border-emerald-800/40 shrink-0`}>
          <button
            onClick={() => setPage(isStaff ? "admin" : "home")}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
            title="RythuSetu Home"
          >
            <div className="relative size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="size-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-[#064e3b] bg-emerald-400"></span>
              </span>
            </div>
            {!isThin && (
              <div className="text-left">
                <div className="text-lg font-black text-white tracking-tight leading-tight flex items-center gap-1.5">
                  RythuSetu
                  {isStaff && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Ops
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-200/70 font-medium">
                  Smart Digital Agriculture
                </div>
              </div>
            )}
          </button>

          {/* Toggle button inside sidebar (expanded desktop or mobile close) */}
          {!isThin && !isDrawer && (
            <button
              onClick={onToggleCollapse}
              className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Collapse Sidebar (Ctrl+B)"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose className="size-4.5" />
            </button>
          )}

          {isDrawer && (
            <button
              onClick={() => setMobileOpen(false)}
              className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="size-4.5" />
            </button>
          )}
        </div>

        {/* ── Thin Mode Quick Expand Button ── */}
        {isThin && (
          <div className="pt-2 pb-1 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="size-9 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Expand Sidebar (Ctrl+B)"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          </div>
        )}

        {/* ── Navigation Items ── */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.isWeather
              ? false
              : page === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavigate(item)}
                  className={`w-full flex items-center transition-all duration-150 rounded-xl cursor-pointer ${
                    isThin
                      ? "justify-center size-11 mx-auto"
                      : "gap-3 px-3 py-2.5 text-left"
                  } ${
                    isActive
                      ? "bg-white/20 text-white font-extrabold shadow-xs"
                      : "text-emerald-100/80 hover:bg-white/10 hover:text-white font-medium"
                  }`}
                  aria-label={item.label}
                >
                  <Icon
                    className={`size-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-emerald-200/80 group-hover:text-white"
                    }`}
                  />

                  {!isThin && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="truncate">
                        <span className="text-sm leading-tight block truncate">
                          {item.label}
                        </span>
                        {language === "Telugu" && (
                          <span className="text-[10px] text-emerald-200/60 block truncate font-normal">
                            {item.teluguLabel}
                          </span>
                        )}
                      </div>
                      {item.badge && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Floating Tooltip in Thin/Collapsed Mode */}
                {isThin && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 border border-slate-700/50 flex items-center gap-2">
                    <span>{item.label}</span>
                    {language === "Telugu" && (
                      <span className="text-[10px] text-emerald-300 font-normal">({item.teluguLabel})</span>
                    )}
                    {item.badge && (
                      <span className="px-1 py-0.5 rounded text-[8px] bg-emerald-500 text-slate-950 font-black">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Language Switcher ── */}
        <div className={`border-t border-emerald-800/40 shrink-0 ${isThin ? "p-2 flex justify-center" : "px-3 py-2.5"}`}>
          {isThin ? (
            <div className="relative group">
              <button
                onClick={cycleLanguage}
                className="size-10 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white flex items-center justify-center font-bold text-xs transition cursor-pointer border border-emerald-700/30"
                title={`Language: ${getLanguageLabel()} (Click to change)`}
                aria-label="Change Language"
              >
                {getLanguageShortCode()}
              </button>
              {/* Tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all">
                Language: {getLanguageLabel()}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-black/20 p-1 flex items-center gap-1 border border-white/10">
              <Languages className="size-3.5 text-emerald-200/70 ml-1.5 shrink-0" />
              {[
                { id: "English", label: "EN" },
                { id: "Telugu", label: "తెలుగు" },
                { id: "Hindi", label: "हिन्दी" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    language === l.id
                      ? "bg-white text-emerald-950 shadow-xs"
                      : "text-emerald-100/70 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── User Account Footer ── */}
        <div className={`border-t border-emerald-800/40 bg-black/10 shrink-0 ${isThin ? "p-2 flex justify-center" : "p-3"}`}>
          {currentUser ? (
            isThin ? (
              <div className="relative group">
                <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center text-xs font-black shadow-sm ring-1 ring-white/20 cursor-default">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                {/* Tooltip with user info & logout */}
                <div className="absolute left-full bottom-2 ml-3 p-3 bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto border border-slate-700/60 min-w-[140px]">
                  <div className="font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-300 capitalize">{currentUser.role.replace("_", " ")}</div>
                  <button
                    onClick={onLogout}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-[11px] font-bold transition cursor-pointer"
                  >
                    <LogOut className="size-3" />
                    <span>Sign Out</span>
                  </button>
                  <div className="absolute bottom-4 -left-1 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2.5 bg-white/10 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center text-xs font-black shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-emerald-200/70 capitalize truncate">
                      {currentUser.role.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="size-7 rounded-lg bg-white/10 hover:bg-red-500/30 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            )
          ) : isThin ? (
            <div className="relative group">
              <button
                onClick={onOpenLogin}
                className="size-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
                title="Sign In / Register"
              >
                <LogIn className="size-4" />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all">
                Sign In / Register
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer shadow-2xs border border-white/10"
            >
              <LogIn className="size-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ─── Desktop & Tablet Sticky Sidebar ─── */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-gradient-to-b from-[#064e3b] via-[#043d2e] to-[#022c22] h-screen sticky top-0 overflow-hidden shadow-2xl transition-all duration-300 ease-in-out border-r border-emerald-900/60 z-30 ${
          collapsed ? "w-18" : "w-60 lg:w-64"
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* ─── Mobile Slide-in Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer container */}
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-gradient-to-b from-[#064e3b] via-[#043d2e] to-[#022c22] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {renderSidebarBody(true)}
          </div>
        </div>
      )}
    </>
  );
}
