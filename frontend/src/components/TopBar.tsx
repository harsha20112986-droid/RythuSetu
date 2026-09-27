import { Bell, Search } from "lucide-react";
import type { Farmer, AuthUser } from "../types";

export function TopBar({
  farmer,
  currentUser,
  onOpenLogin,
}: {
  farmer: Farmer | null;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
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
    <div className="h-14 shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Search bar */}
      <div className="flex-1 max-w-md ml-10 md:ml-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
            readOnly
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <button
          className="relative size-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="size-4.5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500 ring-1 ring-white" />
        </button>

        {/* Profile avatar */}
        {currentUser ? (
          <div className="size-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-black cursor-default select-none">
            {initials}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="size-9 rounded-xl bg-slate-200 hover:bg-emerald-100 flex items-center justify-center text-slate-500 hover:text-emerald-700 transition cursor-pointer"
            title="Sign in"
          >
            <span className="text-xs font-bold">?</span>
          </button>
        )}
      </div>
    </div>
  );
}
