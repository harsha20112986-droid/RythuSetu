import { Bell, Search, Menu, Phone, Sprout, Sparkles } from "lucide-react";
import type { Farmer, AuthUser } from "../types";

export function TopBar({
  farmer,
  currentUser,
  onOpenLogin,
  onToggleSidebar,
  sidebarCollapsed,
  onOpenIvr,
}: {
  farmer: Farmer | null;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  onOpenIvr?: () => void;
}) {
  const name = farmer?.form?.name || currentUser?.name || "";
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="h-15 shrink-0 flex items-center justify-between gap-3 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs sticky top-0 z-20 transition-all">
      {/* ── Left Side: 3-line Hamburger Menu Button + Search ── */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xl">
        {/* 3-Line Menu Button (Toggles thin / expanded on desktop, opens drawer on mobile) */}
        <button
          onClick={onToggleSidebar}
          className="size-10 rounded-xl bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 flex items-center justify-center transition cursor-pointer border border-slate-200/80 shadow-2xs shrink-0 group active:scale-95"
          title={sidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          aria-label="Toggle Sidebar"
        >
          <Menu className="size-5 transition-transform group-hover:scale-105" />
        </button>

        {/* Brand indicator when sidebar is collapsed on desktop */}
        {sidebarCollapsed && (
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 text-xs font-black shrink-0">
            <Sprout className="size-3.5 text-emerald-600" />
            <span>RythuSetu</span>
          </div>
        )}

        {/* Search bar */}
        <div className="flex-1 min-w-[120px] max-w-md">
          <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 rounded-xl px-3 py-1.5 border border-slate-200/60 transition shadow-2xs">
            <Search className="size-4 text-slate-400 shrink-0" />
            <input
              type="search"
              placeholder="Search schemes, mandis, crops..."
              className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none w-full"
              readOnly
              aria-label="Search"
            />
          </div>
        </div>
      </div>

      {/* ── Right Side: Toll-Free Helpline + Notifications + Avatar ── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* 1800 Kisan Helpline Phone Button */}
        {onOpenIvr && (
          <button
            onClick={onOpenIvr}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Kisan Call Center: 1800-180-1551 (Toll-Free Voice Advisory)"
          >
            <div className="size-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Phone className="size-3 animate-pulse" />
            </div>
            <span className="hidden md:inline font-black">1800-180-1551</span>
            <span className="md:hidden">Helpline</span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          className="relative size-9 sm:size-10 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
          title="Notifications & Weather Alerts"
          aria-label="Notifications"
        >
          <Bell className="size-4 sm:size-4.5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
        </button>

        {/* Profile Avatar */}
        {currentUser ? (
          <div
            className="size-9 sm:size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-2xs ring-1 ring-emerald-700/20 cursor-default select-none"
            title={`${currentUser.name} (${currentUser.role.replace("_", " ")})`}
          >
            {initials}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            title="Sign In / Register"
          >
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
