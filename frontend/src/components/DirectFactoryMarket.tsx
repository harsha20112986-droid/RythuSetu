import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Factory,
  CheckCircle2,
  TrendingUp,
  MapPin,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react";
import {
  type Farmer,
  type FactoryContract,
  type DeliveryPassRecord,
  API_BASE,
  ALL_STATES,
} from "../types";

export function DirectFactoryMarket({
  farmer,
  onBack,
}: {
  farmer: Farmer | null;
  onBack: () => void;
}) {
  const [selectedState, setSelectedState] = useState(farmer?.form.state || "");
  const [selectedCrop, setSelectedCrop] = useState(farmer?.form.crop || "All");

  const [contracts, setContracts] = useState<FactoryContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Direct Gate Pass Modal State
  const [activeContract, setActiveContract] = useState<FactoryContract | null>(null);
  const [farmerName, setFarmerName] = useState(farmer?.form.name || "");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [originDistrict, setOriginDistrict] = useState(farmer?.form.district || "Warangal");
  const [originVillage, setOriginVillage] = useState(farmer?.form.village || "");
  const [quantityQtl, setQuantityQtl] = useState("20");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [submittingPass, setSubmittingPass] = useState(false);
  const [passConfirmation, setPassConfirmation] = useState<DeliveryPassRecord | null>(null);

  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);
      if (selectedCrop && selectedCrop !== "All") params.append("crop", selectedCrop);

      const res = await fetch(`${API_BASE}/direct-market/factories?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to fetch factory contracts");
      setContracts(data.contracts || []);
    } catch (err: any) {
      setError(err.message || "Failed to load direct factory market");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [selectedState, selectedCrop]);

  const handleGeneratePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;
    setSubmittingPass(true);
    try {
      const res = await fetch(`${API_BASE}/direct-market/delivery-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factory_id: activeContract.id,
          farmer_name: farmerName.trim() || "Cultivator",
          phone: farmerPhone.trim() || "+91 98480 XXXXX",
          district: originDistrict.trim() || activeContract.district,
          village: originVillage.trim() || "Farm Hub",
          crop: activeContract.crop,
          quantity_qtl: parseFloat(quantityQtl) || 10.0,
          delivery_date: deliveryDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Pass generation failed");
      setPassConfirmation(data);
    } catch (err: any) {
      alert(err.message || "Delivery pass generation failed");
    } finally {
      setSubmittingPass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-black text-emerald-800">
          <Factory className="size-3.5 text-emerald-600" />
          Zero-Broker Direct Linkage (0% Middlemen Cuts)
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 p-6 sm:p-10 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Rythu Direct • Farm-to-Factory Procurement
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">
            Direct Industry Sales Without Brokers & Middlemen
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Sell your harvested produce directly to verified Ginning Mills, Modern Rice Processing Units, Spice Extraction Plants, and Oil Expellers.
            Bypass 5% to 8% Mandi commission agent deductions (Arhatiya cuts) and receive higher rates with guaranteed electronic bank transfers.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              <option value="">All States (AP & Telangana)</option>
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Filter by Harvested Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
            >
              <option value="All">All Crops</option>
              <option value="Cotton">Cotton (పత్తి)</option>
              <option value="Paddy / Rice">Paddy / Rice (వరి)</option>
              <option value="Red Chilli">Red Chilli (మిరప)</option>
              <option value="Turmeric">Turmeric (పసుపు)</option>
              <option value="Groundnut">Groundnut (వేరుశనగ)</option>
              <option value="Maize">Maize (మొక్కజొన్న)</option>
              <option value="Pigeon Pea / Red Gram (Tur)">Pigeon Pea / Red Gram (కందులు)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {loading && (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-8 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold">Scanning verified agro-industrial procurement tenders...</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && contracts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((fac) => {
            const fulfilledPercent = Math.round((fac.procured_so_far_qtl / fac.total_demand_qtl) * 100);
            return (
              <div
                key={fac.id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-6 sm:p-7">
                  {/* Category & Verified Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-black text-slate-700 uppercase">
                      {fac.category}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Verified Industry Buyer
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {fac.factory_name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span>{fac.location}, {fac.district} ({fac.state})</span>
                  </p>

                  {/* Price Comparison Card (Highlighting Broker-Free Profit) */}
                  <div className="mt-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-900 block">
                          Direct Factory Payout
                        </span>
                        <span className="text-2xl font-black text-emerald-950">
                          ₹{fac.direct_offer_price_qtl.toLocaleString()} <span className="text-xs font-semibold text-emerald-800">/ Quintal</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 block">APMC Mandi Rate</span>
                        <span className="text-sm font-bold text-slate-600 line-through">
                          ₹{fac.mandi_benchmark_price_qtl.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center justify-between text-xs font-black text-emerald-900">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="size-3.5 text-emerald-700" />
                        Broker-Free Extra Profit:
                      </span>
                      <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[11px] font-black">
                        +₹{fac.extra_profit_per_qtl} / Qtl (+{fac.broker_commission_saved_percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Procurement Demand Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Total Procurement Target</span>
                      <span>{fac.procured_so_far_qtl.toLocaleString()} / {fac.total_demand_qtl.toLocaleString()} Qtl</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${fulfilledPercent}%` }} />
                    </div>
                  </div>

                  {/* Quality Specifications */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Moisture:</span>
                      <strong className="text-slate-800">{fac.quality_specs.moisture_max}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Grade / Staple:</span>
                      <strong className="text-slate-800">{fac.quality_specs.staple_length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min Lot Size:</span>
                      <strong className="text-slate-800">{fac.quality_specs.min_lot_size_qtl} Quintals</strong>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-500 italic">
                    💳 Payment: {fac.payment_terms}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-500 font-bold block">Sourcing Officer</span>
                    <span className="font-bold text-slate-800">{fac.procurement_officer}</span>
                    <a href={`tel:${fac.phone}`} className="text-emerald-700 hover:underline font-semibold block text-[11px]">
                      {fac.phone}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveContract(fac);
                      setPassConfirmation(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Sell Directly to Factory
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Delivery Pass Modal */}
      {activeContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Zero-Broker Factory Gate Entry Pass
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {activeContract.factory_name}
                </h3>
                <p className="text-xs text-slate-500">{activeContract.crop} Direct Procurement</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveContract(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {!passConfirmation ? (
              <form onSubmit={handleGeneratePass} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="e.g. Krishna Rao"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="+91 98480 XXXXX"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Origin District</label>
                    <input
                      type="text"
                      required
                      value={originDistrict}
                      onChange={(e) => setOriginDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Village Name</label>
                    <input
                      type="text"
                      value={originVillage}
                      onChange={(e) => setOriginVillage(e.target.value)}
                      placeholder="e.g. Geesugonda"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Quintals)</label>
                    <input
                      type="number"
                      step="0.5"
                      min={activeContract.quality_specs.min_lot_size_qtl}
                      required
                      value={quantityQtl}
                      onChange={(e) => setQuantityQtl(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Min: {activeContract.quality_specs.min_lot_size_qtl} Quintals
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery Date</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                {/* Profit & Payout Card */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Agreed Factory Rate:</span>
                    <strong className="text-slate-900 font-black">₹{activeContract.direct_offer_price_qtl.toLocaleString()} / Qtl</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Estimated Gross Payout:</span>
                    <strong className="text-emerald-950 font-black text-sm">
                      ₹{((parseFloat(quantityQtl) || 0) * activeContract.direct_offer_price_qtl).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-emerald-200/80">
                    <span className="text-emerald-900 font-bold">Extra Profit (Zero Broker Cut):</span>
                    <strong className="text-emerald-700 font-black">
                      +₹{((parseFloat(quantityQtl) || 0) * activeContract.extra_profit_per_qtl).toLocaleString()} Extra
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveContract(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPass}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {submittingPass ? "Generating Gate Pass..." : "Generate Direct Factory Gate Pass"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <div className="grid size-12 place-items-center rounded-full bg-emerald-600 text-white mx-auto mb-2">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h4 className="text-base font-black text-emerald-950">Factory Delivery Pass Issued!</h4>
                  <p className="text-xs text-emerald-800 mt-1 font-semibold">Official Entry Pass Token:</p>
                  <span className="mt-1 inline-block text-lg font-black text-emerald-900 bg-white border border-emerald-300 px-3.5 py-1 rounded-xl tracking-wider">
                    {passConfirmation.pass_number}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex justify-between">
                    <span>Buyer:</span>
                    <strong className="text-slate-900">{passConfirmation.factory_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Allocated Quantity:</span>
                    <strong className="text-slate-900">{passConfirmation.allocated_quantity_qtl} Quintals ({passConfirmation.crop})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Agreed Factory Rate:</span>
                    <strong className="text-slate-900">₹{passConfirmation.agreed_rate_per_qtl} / Qtl</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span>Estimated Payout:</span>
                    <strong className="text-emerald-800 font-black">₹{passConfirmation.total_estimated_payout_inr.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Broker Commission Saved:</span>
                    <span>₹{passConfirmation.broker_commission_saved_inr.toLocaleString()} (0% Middlemen cut)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  {passConfirmation.instructions}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveContract(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
