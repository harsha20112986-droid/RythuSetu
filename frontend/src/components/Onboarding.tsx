import { type FormEvent } from "react";
import { MapPin, Sprout, AlertTriangle, ArrowLeft, ArrowRight, Check, UserCheck, ShieldAlert } from "lucide-react";
import {
  type FormState,
  type AuthUser,
  states,
  districts,
  cropOptions,
  seasons,
} from "../types";

export function Onboarding({
  form,
  saving,
  error,
  update,
  onSubmit,
  onBack,
  currentUser,
  isEditing,
  onOpenLogin,
}: {
  form: FormState;
  saving: boolean;
  error: string;
  update: (field: keyof FormState, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
  currentUser?: AuthUser | null;
  isEditing?: boolean;
  onOpenLogin?: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        {currentUser ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/90 px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <UserCheck className="size-3.5 text-emerald-600" />
            <span>Registered Farmer: {currentUser.name}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-3.5 py-1.5 rounded-2xl transition cursor-pointer shadow-2xs"
          >
            <ShieldAlert className="size-3.5 text-amber-600" />
            <span>Sign In / Register Required</span>
          </button>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 text-xl font-bold">
            <Sprout className="size-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              {isEditing ? "Update Farm Profile" : "Farmer Profile Setup"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isEditing ? "Update your farm details" : "Tell us about your farm"}
            </h1>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Your profile allows RythuSetu to accurately map your local weather conditions, match eligible state and central schemes, and compute estimated financial assistance.
        </p>

        {!currentUser && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span>Registration Required: Please sign in or register an account to setup and save your farm profile.</span>
            </div>
            <button
              type="button"
              onClick={onOpenLogin}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-7">
          {/* Farmer Name & Language */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Farmer Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Krishna Rao"
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Preferred Language</span>
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Telugu">{"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"} (Telugu)</option>
                <option value="Hindi">{"\u0939\u093F\u0928\u094D\u0926\u0940"} (Hindi)</option>
              </select>
            </label>
          </div>

          {/* Location Details */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-emerald-600" />
              Farm Location (Andhra Pradesh / Telangana)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">State</span>
                <select
                  value={form.state}
                  onChange={(e) => {
                    const nextState = e.target.value;
                    update("state", nextState);
                    update("district", districts[nextState]?.[0] || "");
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">District</span>
                <select
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                >
                  {(districts[form.state] || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Mandal / Tehsil (Optional)</span>
                <input
                  type="text"
                  value={form.mandal}
                  onChange={(e) => update("mandal", e.target.value)}
                  placeholder="e.g. Narsampet"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Village / Grama (Optional)</span>
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => update("village", e.target.value)}
                  placeholder="e.g. Chennaraopet"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </label>
            </div>
          </div>

          {/* Crop Selection */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sprout className="size-3.5 text-emerald-600" />
              Primary Crop
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cropOptions.map((crop) => {
                const isSelected = form.crop === crop.name;
                return (
                  <button
                    key={crop.name}
                    type="button"
                    onClick={() => update("crop", crop.name)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{crop.name}</span>
                      {isSelected && (
                        <span className="size-4 rounded-full bg-emerald-600 text-white grid place-items-center text-[10px]">
                          <Check className="size-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">
                      {crop.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Land Area and Season */}
          <div className="border-t border-slate-100 pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Season */}
              <div>
                <span className="mb-2 block text-xs font-bold text-slate-700">Cropping Season</span>
                <div className="space-y-2">
                  {seasons.map((s) => {
                    const isSelected = form.season === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => update("season", s.name)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/70 font-bold text-emerald-950"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <span className="font-bold">{s.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2 font-normal">{s.desc}</span>
                        </div>
                        {isSelected && <Check className="size-3.5 text-emerald-700 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Land Area */}
              <div>
                <span className="mb-2 block text-xs font-bold text-slate-700">
                  Land Holding (Acres)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={form.land_area_acres}
                  onChange={(e) => update("land_area_acres", e.target.value)}
                  placeholder="e.g. 3.5"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />

                {/* Preset Chips */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {["1.0", "2.5", "3.5", "5.0", "10.0"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => update("land_area_acres", preset)}
                      className={`px-2.5 py-1 text-xs rounded-xl border transition cursor-pointer ${
                        form.land_area_acres === preset
                          ? "bg-emerald-700 text-white border-emerald-700 font-bold"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {preset} ac
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Used directly to compute per-acre assistance like Rythu Bharosa.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <span>Saving Profile & Fetching Telemetry...</span>
              ) : (
                <>
                  <span>{isEditing ? "Update Profile & Open Dashboard" : "Save Profile & Open Dashboard"}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
