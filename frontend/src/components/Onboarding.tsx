import { useState, useMemo, type FormEvent } from "react";
import {
  MapPin,
  Sprout,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  UserCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  type FormState,
  type AuthUser,
  seasons,
  ALL_STATES,
  EXHAUSTIVE_CROPS,
  getDistrictsForState,
  getMandalsForDistrict,
  getVillagesForMandal,
  type CropCategory,
  type CropItem,
} from "../types";

const CROP_CATEGORIES: CropCategory[] = [
  "All",
  "Cereals & Millets",
  "Pulses",
  "Oilseeds",
  "Commercial & Fiber",
  "Spices & Condiments",
  "Fruits & Plantation",
  "Vegetables",
];

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
  const [cropCategory, setCropCategory] = useState<CropCategory>("All");
  const [cropSearch, setCropSearch] = useState<string>("");

  // Cascading Location Calculations
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(form.state);
  }, [form.state]);

  const availableMandals = useMemo(() => {
    return getMandalsForDistrict(form.state, form.district);
  }, [form.state, form.district]);

  const availableVillages = useMemo(() => {
    return getVillagesForMandal(form.state, form.district, form.mandal);
  }, [form.state, form.district, form.mandal]);

  // Is current mandal or village a custom write-in?
  const isCustomMandal = Boolean(form.mandal && !availableMandals.includes(form.mandal));
  const isCustomVillage = Boolean(form.village && !availableVillages.includes(form.village));

  const [showCustomMandalInput, setShowCustomMandalInput] = useState(isCustomMandal);
  const [showCustomVillageInput, setShowCustomVillageInput] = useState(isCustomVillage);

  // Filtered crop list
  const filteredCrops = useMemo(() => {
    const q = cropSearch.trim().toLowerCase();
    return EXHAUSTIVE_CROPS.filter((c: CropItem) => {
      const matchCat = cropCategory === "All" || c.category === cropCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.teluguName.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [cropCategory, cropSearch]);

  const handleStateChange = (nextState: string) => {
    const nextDistricts = getDistrictsForState(nextState);
    const firstDist = nextDistricts[0] || "";
    const nextMandals = getMandalsForDistrict(nextState, firstDist);
    const firstMandal = nextMandals[0] || "";
    const nextVillages = getVillagesForMandal(nextState, firstDist, firstMandal);
    const firstVillage = nextVillages[0] || "";

    update("state", nextState);
    update("district", firstDist);
    update("mandal", firstMandal);
    update("village", firstVillage);
    setShowCustomMandalInput(false);
    setShowCustomVillageInput(false);
  };

  const handleDistrictChange = (nextDist: string) => {
    const nextMandals = getMandalsForDistrict(form.state, nextDist);
    const firstMandal = nextMandals[0] || "";
    const nextVillages = getVillagesForMandal(form.state, nextDist, firstMandal);

    update("district", nextDist);
    update("mandal", firstMandal);
    update("village", nextVillages[0] || "");
    setShowCustomMandalInput(false);
    setShowCustomVillageInput(false);
  };

  const handleMandalChange = (val: string) => {
    if (val === "__custom__") {
      setShowCustomMandalInput(true);
      update("mandal", "");
      update("village", "");
      setShowCustomVillageInput(true);
    } else {
      setShowCustomMandalInput(false);
      update("mandal", val);
      const nextVillages = getVillagesForMandal(form.state, form.district, val);
      update("village", nextVillages[0] || "");
      setShowCustomVillageInput(false);
    }
  };

  const handleVillageChange = (val: string) => {
    if (val === "__custom__") {
      setShowCustomVillageInput(true);
      update("village", "");
    } else {
      setShowCustomVillageInput(false);
      update("village", val);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 text-xl font-bold shrink-0">
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
          Your profile accurately maps hyper-local weather telemetry, verified central & state scheme eligibility, and APMC Mandi rates across Andhra Pradesh and Telangana.
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
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
              </select>
            </label>
          </div>

          {/* Cascading Location Hierarchy */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-emerald-600" />
                Farm Location (State ➔ District ➔ Mandal ➔ Village)
              </h3>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                {form.state} • {availableDistricts.length} Districts
              </span>
            </div>

            {/* State & District Selectors */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">State</span>
                <select
                  value={form.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                >
                  {ALL_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  District ({form.state})
                </span>
                <select
                  value={form.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Mandal & Village Cascading Selectors */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Mandal / Tehsil */}
              <div>
                <label className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">Mandal / Tehsil</span>
                    {!showCustomMandalInput && (
                      <button
                        type="button"
                        onClick={() => setShowCustomMandalInput(true)}
                        className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-semibold"
                      >
                        + Type Custom
                      </button>
                    )}
                  </div>
                  {!showCustomMandalInput ? (
                    <select
                      value={form.mandal}
                      onChange={(e) => handleMandalChange(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                    >
                      <option value="">-- Select Mandal --</option>
                      {availableMandals.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                      <option value="__custom__">+ Other / Enter Custom Mandal</option>
                    </select>
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={form.mandal}
                        onChange={(e) => update("mandal", e.target.value)}
                        placeholder="Type your Mandal name"
                        className="w-full rounded-2xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-100 transition"
                      />
                      {availableMandals.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomMandalInput(false);
                            if (availableMandals[0]) update("mandal", availableMandals[0]);
                          }}
                          className="text-[11px] text-slate-500 hover:text-emerald-700 cursor-pointer"
                        >
                          ← Choose from official mandal list
                        </button>
                      )}
                    </div>
                  )}
                </label>
              </div>

              {/* Village / Grama */}
              <div>
                <label className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">Village / Grama (Optional)</span>
                    {!showCustomVillageInput && (
                      <button
                        type="button"
                        onClick={() => setShowCustomVillageInput(true)}
                        className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-semibold"
                      >
                        + Type Custom
                      </button>
                    )}
                  </div>
                  {!showCustomVillageInput && availableVillages.length > 0 ? (
                    <select
                      value={form.village}
                      onChange={(e) => handleVillageChange(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition cursor-pointer"
                    >
                      <option value="">-- Select Village --</option>
                      {availableVillages.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                      <option value="__custom__">+ Other / Enter Custom Village</option>
                    </select>
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={form.village}
                        onChange={(e) => update("village", e.target.value)}
                        placeholder="Type your Village or Grama"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                      />
                      {availableVillages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomVillageInput(false);
                            if (availableVillages[0]) update("village", availableVillages[0]);
                          }}
                          className="text-[11px] text-slate-500 hover:text-emerald-700 cursor-pointer"
                        >
                          ← Choose from official village list
                        </button>
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Exhaustive Crop Selection Across AP & Telangana */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sprout className="size-3.5 text-emerald-600" />
                  Primary Crop (All AP & Telangana Yields)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select your crop across 60+ verified crops cultivated across Andhra Pradesh & Telangana
                </p>
              </div>

              {form.crop && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-full text-xs font-extrabold self-start sm:self-auto">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Selected: {form.crop}</span>
                </div>
              )}
            </div>

            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="size-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                placeholder="Search crop by name in English or Telugu (e.g. Chilli, వరి, Cotton, Tomato, Mango)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
              />
              {cropSearch && (
                <button
                  type="button"
                  onClick={() => setCropSearch("")}
                  className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCropCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    cropCategory === cat
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Crop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => {
                  const isSelected = form.crop === crop.name;
                  return (
                    <button
                      key={crop.name}
                      type="button"
                      onClick={() => update("crop", crop.name)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/30 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 leading-snug">
                          {crop.name}
                        </span>
                        {isSelected && (
                          <span className="size-4 rounded-full bg-emerald-600 text-white grid place-items-center text-[10px] shrink-0 mt-0.5">
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-950 font-extrabold text-[10px]">
                          {crop.teluguName}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium truncate max-w-[90px]">
                          {crop.tag}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                  No crops matching "{cropSearch}". Try searching for rice, cotton, chilli, or click "All".
                </div>
              )}
            </div>
            <p className="mt-2 text-right text-[10px] text-slate-400 font-medium">
              Showing {filteredCrops.length} of {EXHAUSTIVE_CROPS.length} agricultural & horticultural crops
            </p>
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
