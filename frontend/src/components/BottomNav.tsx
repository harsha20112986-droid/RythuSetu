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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 sm:hidden shadow-lg shadow-slate-900/10">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
                isActive
                  ? "text-emerald-700 font-extrabold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? "bg-emerald-100 text-emerald-800" : ""
                }`}
              >
                <Icon className="size-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
