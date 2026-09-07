import { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  FileCheck2,
  ArrowLeft,
  X,
} from "lucide-react";
import { type Farmer, type Scheme, API_BASE } from "../types";

export function SchemeFinder({
  farmer,
  onBack,
}: {
  farmer: Farmer;
  onBack: () => void;
}) {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          state: farmer.form.state,
          crop: farmer.form.crop,
          season: farmer.form.season,
        });

        const response = await fetch(`${API_BASE}/schemes?${query.toString()}`);
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body?.detail || "Unable to load schemes");
        }

        setSchemes(body.schemes ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load schemes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [farmer.form.state, farmer.form.crop, farmer.form.season]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.summary.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || s.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [schemes, search, selectedCategory]);

  const categories = ["All", "Income Support", "Farm Investment Support", "Crop Insurance"];

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Rule-Matched Assistance Database
          </span>
          <span className="size-1 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-200">
            {farmer.form.state} • {farmer.form.crop} • {farmer.form.season}
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-black">
          Government Schemes & Support
        </h1>

        <p className="mt-2 text-sm text-emerald-100 max-w-xl">
          Verified central and state schemes evaluated against your farm profile. Click any scheme to inspect eligibility details or open the official government portal.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search schemes by name or benefit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Matching verified schemes against your profile...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Schemes Grid */}
      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <article
              key={scheme.id}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                      <FileCheck2 className="size-5" />
                    </div>
                    <div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                        {scheme.scope} • {scheme.category}
                      </span>
                      <h3 className="mt-1 font-black text-lg text-slate-900">
                        {scheme.name}
                      </h3>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 shrink-0">
                    {scheme.match_label}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {scheme.summary}
                </p>

                {/* Key Benefit Highlight */}
                <div className="mt-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                    Direct Financial Benefit
                  </p>
                  <p className="mt-0.5 text-xs font-black text-emerald-950">
                    {scheme.benefit}
                  </p>
                </div>

                {/* Eligibility Note */}
                <div className="mt-3 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Eligibility Criteria: </span>
                  {scheme.eligibility_note}
                </div>

                {/* Match Reasons Checklist */}
                {scheme.reasons && scheme.reasons.length > 0 && (
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    {scheme.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Verified: {scheme.last_verified}
                </span>

                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && filteredSchemes.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="font-bold text-sm">No schemes match your filter query.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-3 text-xs font-bold text-emerald-700 underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
