import { useState } from "react";
import {
  Sprout,
  Phone,
  ShieldCheck,
  LogIn,
  LogOut,
  Menu,
  X,
  Languages,
  Home as HomeIcon,
  LayoutDashboard,
  Stethoscope,
  TrendingUp,
  Warehouse,
  Truck,
  MapPin,
  Landmark,
  FileCheck2,
  FlaskConical,
  ChevronRight,
  User,
  Sparkles,
  Tractor,
  CloudRain,
  Calculator,
} from "lucide-react";
import type { Page, Farmer, AuthUser } from "../types";
import { getTranslation } from "../utils/translations";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = currentUser?.role === "admin";
  const t = getTranslation(language);

  const navigateTo = (targetPage: Page) => {
    setPage(targetPage);
    setDrawerOpen(false);
  };

  const navMenuItems = [
    {
      id: "doctor" as Page,
      title: t.cropDoctor,
      teluguTitle: "పంట డాక్టర్ (తెగుళ్లు & పురుగు మందులు)",
      subtitle: "AI pest & disease scanning, packaging images & chemical formulas",
      icon: Stethoscope,
      color: "emerald",
      badge: "AI Vision",
    },
    {
      id: "recommendation" as Page,
      title: t.cropAdvisory,
      teluguTitle: "పంట సలహాలు (విత్తనాలు & POP)",
      subtitle: "Scientific POP protocols, seed varieties & crop matching",
      icon: Sprout,
      color: "green",
      badge: "High Yield",
    },
    {
      id: "mandi" as Page,
      title: t.mandiRates,
      teluguTitle: "మార్కెట్ రేట్లు (జాతులు & రకాలు)",
      subtitle: "Latest available APMC market rates sorted High-to-Low across varieties",
      icon: TrendingUp,
      color: "amber",
      badge: "High-to-Low",
    },
    {
      id: "storage" as Page,
      title: t.acGodowns,
      teluguTitle: "ఏసీ కోల్డ్ స్టోరేజ్ & గోదాములు",
      subtitle: "WDRA accredited warehouses, bay booking & 75% e-NWR loans",
      icon: Warehouse,
      color: "sky",
      badge: "Zero Distress Sale",
    },
    {
      id: "factory" as Page,
      title: t.directMills,
      teluguTitle: "ఫ్యాక్టరీ ప్రత్యక్ష కొనుగోలు",
      subtitle: "Sell directly to processing plants & mills with zero broker cuts",
      icon: Truck,
      color: "teal",
      badge: "Zero Brokerage",
    },
    {
      id: "nearby" as Page,
      title: t.nearbyHub,
      teluguTitle: "సమీప మార్కెట్లు & మిల్లులు",
      subtitle: "Hyperlocal APMC mandis, mills & godowns within 50 km",
      icon: MapPin,
      color: "rose",
      badge: "Hyperlocal",
    },
    {
      id: "schemes" as Page,
      title: t.schemes,
      teluguTitle: "ప్రభుత్వ సంక్షేమ పథకాలు",
      subtitle: "PM-KISAN, Rythu Bharosa, subsidized seeds & solar pumps",
      icon: Landmark,
      color: "indigo",
      badge: "Govt Subsidies",
    },
    {
      id: "loss" as Page,
      title: t.pmfby,
      teluguTitle: "PMFBY పంట నష్ట పరిహారం",
      subtitle: "72-hour geo-tagged crop loss reporting & DBT payout tracking",
      icon: FileCheck2,
      color: "red",
      badge: "72hr DBT",
    },
    {
      id: "fertilizer" as Page,
      title: "Fertilizer Optimizer",
      teluguTitle: "ఎరువుల మోతాదు కాలిక్యులేటర్",
      subtitle: "Scientific N:P:K split dosages, brand packshots & bag counts",
      icon: FlaskConical,
      color: "blue",
      badge: "NPK Ratio",
    },
    {
      id: "machinery" as Page,
      title: t.machineryRental,
      teluguTitle: "వ్యవసాయ యంత్రాలు & డ్రోన్లు",
      subtitle: "Custom Hiring Centers (CHC): Tractors, 10L spray drones & harvesters",
      icon: Tractor,
      color: "emerald",
      badge: "Rent Hub",
    },
    {
      id: "harvest-shield" as Page,
      title: t.harvestShield,
      teluguTitle: "కల్లం రక్షణ & టార్పాలిన్లు",
      subtitle: "Open drying yard rain alert & nearby heavy tarpaulin sheet rental banks",
      icon: CloudRain,
      color: "amber",
      badge: "Rain Shield",
    },
    {
      id: "seed-verify" as Page,
      title: t.seedVerifier,
      teluguTitle: "విత్తన ప్రామాణికత & నకిలీ నిరోధం",
      subtitle: "APSCA/TSSOCA lot code cross-check & anti-spurious seed grievance cell",
      icon: ShieldCheck,
      color: "teal",
      badge: "Anti-Spurious",
    },
    {
      id: "khata" as Page,
      title: t.agriKhata,
      teluguTitle: "డిజిటల్ ఖాటా & గిట్టుబాటు ధర",
      subtitle: "Cultivation cost per acre, breakeven price/qtl & anti-distress sale guard",
      icon: Calculator,
      color: "indigo",
      badge: "Breakeven Guard",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-emerald-100/90 bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          {/* 1. LEFT CORNER: Logo and Branding */}
          <button
            onClick={() => setPage(isAdmin ? "admin" : "home")}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer shrink-0"
          >
            <div
              className={`relative grid size-10 place-items-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105 ${
                isAdmin
                  ? "bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 shadow-indigo-900/20"
                  : "bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 shadow-emerald-800/20"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="size-5.5 text-indigo-100" />
              ) : (
                <Sprout className="size-5.5 text-emerald-100" />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAdmin ? "bg-indigo-400" : "bg-emerald-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 border-2 border-white ${
                    isAdmin ? "bg-indigo-500" : "bg-emerald-500"
                  }`}
                ></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  {t.appName}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isAdmin
                      ? "bg-indigo-100 text-indigo-900"
                      : "bg-emerald-100/90 text-emerald-800"
                  }`}
                >
                  {isAdmin ? t.officerPortal : t.krishiAi}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                {isAdmin ? t.adminTagline : t.tagline}
              </p>
            </div>
          </button>

          {/* 2. CENTER: Main Navigation — ONLY 2 items (Home & Dashboard) */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setPage("home")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    page === "home"
                      ? "bg-white text-indigo-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <HomeIcon className="size-3.5" />
                  <span>{t.platformHome}</span>
                </button>
                <button
                  onClick={() => setPage("admin")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    page === "admin"
                      ? "bg-indigo-700 text-white shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  <span>{t.officerDesk}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setPage("home")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    page === "home"
                      ? "bg-white text-emerald-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <HomeIcon className="size-3.5 text-emerald-600" />
                  <span>{t.home}</span>
                </button>

                <button
                  onClick={() => {
                    if (farmer || currentUser) {
                      setPage("dashboard");
                    } else if (onRequestFarmProfile) {
                      onRequestFarmProfile();
                    } else {
                      setPage("onboarding");
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    page === "dashboard" || page === "onboarding"
                      ? "bg-white text-emerald-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="size-3.5 text-emerald-600" />
                  <span>{t.dashboard}</span>
                </button>
              </>
            )}
          </nav>

          {/* 3. RIGHT CORNER: Helpline & 3-Line Menu Drawer Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toll-Free 1800 Kisan Helpline Button */}
            <button
              onClick={onOpenIvr}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 text-xs font-black text-emerald-900 transition cursor-pointer shadow-2xs group"
              title="Kisan Call Center: 1800-180-1551 (Toll Free)"
            >
              <div className="relative flex items-center justify-center size-5 rounded-full bg-emerald-600 text-white">
                <Phone className="size-3 animate-pulse" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                  1800 Helpline
                </div>
                <div className="text-[11px] font-black text-emerald-950 hidden sm:block">
                  1800-180-1551
                </div>
              </div>
            </button>

            {/* 3-Line Menu (Hamburger) Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex items-center justify-center size-10 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition cursor-pointer shadow-xs focus:outline-none"
              title="Open Services & User Menu"
              aria-label="Navigation Menu"
            >
              <Menu className="size-5" />
              {currentUser && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 4. SLIDE-OVER DRAWER (The 3-line Menu containing All Features & User Account) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                    <Sprout className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      RythuSetu Menu & Services
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      All agricultural tools and profile management
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="size-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* USER ACCOUNT SECTION (Inside 3-Line Menu as requested) */}
              <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white">
                {currentUser ? (
                  <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-11 rounded-2xl text-white flex items-center justify-center text-sm font-black shadow-xs ${
                            isAdmin ? "bg-indigo-700" : "bg-emerald-700"
                          }`}
                        >
                          {isAdmin ? "A" : currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              {currentUser.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                isAdmin
                                  ? "bg-indigo-100 text-indigo-900"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {isAdmin ? t.officerPortal : t.farmerBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {currentUser.phone || "Verified Mobile"}
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium">
                            {currentUser.district}, {currentUser.state}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onLogout();
                          setDrawerOpen(false);
                        }}
                        className="size-8 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 flex items-center justify-center transition cursor-pointer"
                        title={t.signOut}
                      >
                        <LogOut className="size-4" />
                      </button>
                    </div>

                    {farmer && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Cultivating:</span>
                        <span className="font-bold text-emerald-800">
                          {farmer.form.crop} ({farmer.form.land_area_acres} Acres)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center">
                    <div className="size-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <User className="size-5" />
                    </div>
                    <h4 className="text-xs font-black text-slate-900">
                      Welcome Cultivator / Officer
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                      Sign in to save farm profile, track PMFBY claims & access warehouse bays.
                    </p>
                    <button
                      onClick={() => {
                        onOpenLogin();
                        setDrawerOpen(false);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <LogIn className="size-3.5" />
                      <span>{t.signIn} / {t.register}</span>
                    </button>
                  </div>
                )}

                {/* MULTILINGUAL SELECTOR */}
                <div className="mt-3 flex items-center justify-between bg-white rounded-xl p-1 border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500">
                    <Languages className="size-3.5" />
                    <span>Language:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "English", label: "EN" },
                      { id: "Telugu", label: "తెలుగు" },
                      { id: "Hindi", label: "हिन्दी" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLanguage(l.id)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          language === l.id
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ALL SERVICES & MODULES LIST */}
              <div className="p-4 flex-1 space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Farmer Services & Decision Engines
                </div>

                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = page === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group ${
                        isActive
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isActive
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800"
                          }`}
                        >
                          <Icon className="size-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              ({item.teluguTitle})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                          {item.badge}
                        </span>
                        <ChevronRight className="size-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* DRAWER FOOTER: Helpline Support */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 p-4 text-white shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                        <Sparkles className="size-3" />
                        24x7 Kisan Call Center
                      </span>
                      <h4 className="text-sm font-black mt-1">1800-180-1551</h4>
                      <p className="text-[10px] text-emerald-200/90 mt-0.5">
                        Toll-free agricultural scientist advisory in Telugu, Hindi & English
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenIvr();
                        setDrawerOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition cursor-pointer shadow-sm shrink-0"
                    >
                      Call / IVR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
