import { useState, useEffect } from "react";
import { Sliders, ExternalLink, RefreshCw, AlertTriangle, ArrowLeft, Calculator } from "lucide-react";
import { type Farmer, type BenefitData, API_BASE } from "../types";

export function BenefitEstimator({
  farmer,
  onBack,
}: {
  farmer: Farmer;
  onBack: () => void;
}) {
  const [simulatedAcres, setSimulatedAcres] = useState<number>(
    parseFloat(farmer.form.land_area_acres) || 2.5,
  );
  const [data, setData] = useState<BenefitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          state: farmer.form.state,
          crop: farmer.form.crop,
          season: farmer.form.season,
          land_area_acres: String(simulatedAcres),
        });

        const response = await fetch(`${API_BASE}/benefits/estimate?${query.toString()}`);
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body?.detail || "Unable to estimate benefits");
        }

        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to estimate benefits");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [farmer.form.state, farmer.form.crop, farmer.form.season, simulatedAcres]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to dashboard</span>
      </button>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 p-6 text-white shadow-xl sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <Calculator className="size-4" />
          Transparent Math Engine
        </span>
        <h1 className="mt-2 text-3xl font-black">
          Benefit & Payout Estimator
        </h1>
        <p className="mt-2 text-sm text-emerald-100 max-w-xl">
          Deterministic calculation of eligible financial assistance based on your land area and applicable state and central policies.
        </p>
      </div>

      {/* Interactive Acreage Slider Simulator */}
      <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sliders className="size-4" />
              Live Land Area Simulation
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Adjust Farm Acres to Simulate Annual Payouts
            </h3>
            <p className="text-xs text-slate-500">
              Profile default is {farmer.form.land_area_acres} acres. Drag the slider to test other farm sizes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-emerald-700">
              {simulatedAcres}
            </span>
            <span className="text-sm font-bold text-slate-600">Acres</span>
            {simulatedAcres !== parseFloat(farmer.form.land_area_acres) && (
              <button
                onClick={() => setSimulatedAcres(parseFloat(farmer.form.land_area_acres) || 2.5)}
                className="ml-2 text-xs font-bold text-slate-500 hover:text-emerald-700 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-6">
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.5"
            value={simulatedAcres}
            onChange={(e) => setSimulatedAcres(parseFloat(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
            <span>0.5 Acre</span>
            <span>5 Acres</span>
            <span>10 Acres</span>
            <span>15 Acres</span>
            <span>20 Acres</span>
          </div>

          {/* Quick preset buttons */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-500">Presets:</span>
            {[1, 2.5, 3.5, 5, 8, 10].map((val) => (
              <button
                key={val}
                onClick={() => setSimulatedAcres(val)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  simulatedAcres === val
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {val} ac
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Calculating potential annual benefits...</span>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && !loading && !error && (
        <div className="mt-6 space-y-6">
          {/* Total Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-green-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                Fixed-Rule Annual Support
              </span>
              <p className="mt-3 text-4xl sm:text-5xl font-black text-white">
                {"\u20B9"}{data.estimated_total.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-xs text-emerald-200/90">
                Sum of deterministic fixed and per-acre schemes for {simulatedAcres} acres in {farmer.form.state}.
              </p>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/15 pt-4 sm:pt-0 sm:pl-8">
              <p className="text-xs text-emerald-300 font-semibold">Includes:</p>
              <p className="text-sm font-bold text-white mt-1">PM-KISAN ({"\u20B9"}6,000 fixed)</p>
              {farmer.form.state === "Telangana" && (
                <p className="text-sm font-bold text-amber-300">
                  Rythu Bharosa ({"\u20B9"}{(12000 * simulatedAcres).toLocaleString("en-IN")})
                </p>
              )}
              {farmer.form.state === "Andhra Pradesh" && (
                <p className="text-sm font-bold text-amber-300">
                  YSR Rythu Bharosa ({"\u20B9"}{(7500 * simulatedAcres).toLocaleString("en-IN")})
                </p>
              )}
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Verified: {item.last_verified}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.type}</p>

                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Calculation Formula
                    </p>
                    <p className="mt-1 text-sm font-black text-emerald-950">
                      {item.calculation}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-black text-slate-900">
                      {item.estimated_amount !== null
                        ? `\u20B9${item.estimated_amount.toLocaleString("en-IN")}`
                        : "Loss Dependent"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Basis: {item.basis}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <a
                    href={item.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                  >
                    <span>View Guidelines</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center">
            {data.disclaimer}
          </p>
        </div>
      )}
    </section>
  );
}
