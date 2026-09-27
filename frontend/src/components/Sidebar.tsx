import { useState } from "react";
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
  Menu,
  X,
  Languages,
} from "lucide-react";
import type { Page, Farmer, AuthUser } from "../types";


// Condensed nav for the visible sidebar (top-level only)
const PRIMARY_NAV: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "onboarding", label: "Farm Profile", icon: User },
  { id: "recommendation", label: "Weather", icon: CloudRain },
  { id: "recommendation", label: "Crop Advisory", icon: Sprout },
  { id: "mandi", label: "Market Prices", icon: TrendingUp },
  { id: "schemes", label: "Schemes", icon: Landmark },
  { id: "loss", label: "Crop Loss", icon: ShieldAlert },
  { id: "machinery", label: "Machinery", icon: Tractor },
  { id: "storage", label: "Storage", icon: Warehouse },
  { id: "khata", label: "Agri Khata", icon: Calculator },
  { id: "action-center", label: "Support", icon: HeadphonesIcon },
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
}: {
  page: Page;
  setPage: (p: Page) => void;
  farmer: Farmer | null;
  currentUser: AuthUser | null;
  language: string;
  setLanguage: (l: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenIvr: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isStaff =
    currentUser?.role === "admin" ||
    currentUser?.role === "data_verifier" ||
    currentUser?.role === "support_agent" ||
    currentUser?.role === "super_admin";

  const navigate = (id: Page) => {
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

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <button
        onClick={() => setPage(isStaff ? "admin" : "home")}
        className="flex items-center gap-3 px-4 py-5 shrink-0 cursor-pointer hover:opacity-90 transition"
      >
        <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sprout className="size-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-black text-white tracking-tight">
            RythuSetu
          </span>
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto">
        {PRIMARY_NAV.map((item, idx) => {
          const Icon = item.icon;
          // De-duplicate entries that share the same id (e.g. two "recommendation")
          const uniqueKey = `${item.id}-${idx}`;
          const isActive = page === item.id;
          return (
            <button
              key={uniqueKey}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition cursor-pointer group ${
                isActive
                  ? "bg-white/20 text-white font-bold"
                  : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`size-4.5 shrink-0 ${isActive ? "text-white" : "text-emerald-200/70 group-hover:text-white"}`}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Language switcher */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="rounded-xl bg-white/10 p-1 flex items-center gap-1">
            <Languages className="size-3.5 text-emerald-200/70 ml-1 shrink-0" />
            {["EN", "తె", "हि"].map((l, i) => {
              const lang = ["English", "Telugu", "Hindi"][i];
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    language === lang
                      ? "bg-white text-emerald-900"
                      : "text-emerald-100/70 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* User section */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        {currentUser ? (
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-white/20 text-white flex items-center justify-center text-xs font-black shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-200/60 capitalize">
                  {currentUser.role.replace("_", " ")}
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              title="Sign out"
              className="size-7 rounded-lg bg-white/10 hover:bg-red-500/30 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer ${collapsed ? "px-2" : "px-3"}`}
          >
            <LogIn className="size-3.5 shrink-0" />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-gradient-to-b from-emerald-800 via-emerald-900 to-green-950 h-screen sticky top-0 overflow-hidden shadow-xl shadow-emerald-950/30">
        <SidebarContent />
      </aside>

      {/* ─── Tablet Sidebar (icon-only) ─── */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 shrink-0 bg-gradient-to-b from-emerald-800 via-emerald-900 to-green-950 h-screen sticky top-0 overflow-hidden shadow-xl">
        <SidebarContent collapsed />
      </aside>

      {/* ─── Mobile: hamburger trigger (top-left) ─── */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 size-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-lg cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-emerald-800 via-emerald-900 to-green-950 shadow-2xl flex flex-col">
            <button
              className="absolute top-3 right-3 size-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
