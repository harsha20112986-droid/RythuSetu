import {
  Home as HomeIcon,
  TrendingUp,
  MapPin,
  Stethoscope,
  LayoutDashboard,
  Sprout,
} from "lucide-react";
import { type Page, type Farmer } from "../types";

export function BottomNav({
  currentPage,
  onNavigate,
  farmer,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  farmer: Farmer | null;
}) {
  const navItems = [
    {
      id: "home" as Page,
      label: "Home",
      icon: HomeIcon,
    },
    {
      id: "mandi" as Page,
      label: "Mandi Rates",
      icon: TrendingUp,
    },
    {
      id: "nearby" as Page,
      label: "Agro Hub",
      icon: MapPin,
    },
    {
      id: "doctor" as Page,
      label: "Crop Doctor",
      icon: Stethoscope,
    },
    {
      id: (farmer ? "dashboard" : "onboarding") as Page,
      label: farmer ? "Dashboard" : "Register",
      icon: farmer ? LayoutDashboard : Sprout,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 px-2 sm:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive
                  ? "text-emerald-800 font-extrabold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <div
                className={`relative px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 shadow-2xs scale-105"
                    : "text-slate-600"
                }`}
              >
                <Icon className="size-4.5" />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-emerald-700" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
