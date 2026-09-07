import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Warehouse,
  MapPin,
  Thermometer,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react";
import {
  type Farmer,
  type ColdStorageFacility,
  type StorageBookingRecord,
  API_BASE,
  ALL_STATES,
} from "../types";

export function ColdStorageFinder({
  farmer,
  onBack,
}: {
  farmer: Farmer | null;
  onBack: () => void;
}) {
  const [selectedState, setSelectedState] = useState(farmer?.form.state || "");
  const [selectedDistrict, setSelectedDistrict] = useState(farmer?.form.district || "");
  const [selectedCommodity, setSelectedCommodity] = useState(farmer?.form.crop || "All");

  const [facilities, setFacilities] = useState<ColdStorageFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking Modal State
  const [activeFacility, setActiveFacility] = useState<ColdStorageFacility | null>(null);
  const [bookingName, setBookingName] = useState(farmer?.form.name || "");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingBags, setBookingBags] = useState("100");
  const [bookingMonths, setBookingMonths] = useState("4");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<StorageBookingRecord | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);
      if (selectedDistrict) params.append("district", selectedDistrict);
      if (selectedCommodity && selectedCommodity !== "All") params.append("commodity", selectedCommodity);

      const res = await fetch(`${API_BASE}/storage/cold-godowns?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to fetch cold storage units");
      setFacilities(data.facilities || []);
    } catch (err: any) {
      setError(err.message || "Failed to load cold storage directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [selectedState, selectedDistrict, selectedCommodity]);

  const handleBookSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacility) return;
    setSubmittingBooking(true);
    try {
      const res = await fetch(`${API_BASE}/storage/book-space`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: activeFacility.id,
          farmer_name: bookingName.trim() || "Farmer Member",
          phone: bookingPhone.trim() || "+91 98480 XXXXX",
          commodity: activeFacility.commodities[0] || "General Produce",
          bags_count: parseInt(bookingBags) || 50,
          duration_months: parseInt(bookingMonths) || 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Booking failed");
      setBookingConfirmation(data);
    } catch (err: any) {
      alert(err.message || "Booking reservation failed");
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Header & Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-black text-sky-800">
          <Warehouse className="size-3.5 text-sky-600" />
          CWC / SWC / WDRA Certified Grid
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-10 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-wider text-sky-400">
            Post-Harvest Preservation & Pledge Loans
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">
            AC Godowns & Cold Storage Logistics Network
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-sky-100 leading-relaxed">
            Preserve your harvested Red Chilli, Turmeric, Pulses, and perishable produce up to 10 months without color loss or quality deterioration.
            Access government <strong>e-NWR electronic warehouse receipts</strong> to obtain instant bank loans up to 75% of stock value while waiting for market prices to surge.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
            >
              <option value="">All States (AP & Telangana)</option>
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">District Search</label>
            <input
              type="text"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              placeholder="e.g. Guntur, Khammam, Warangal"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Commodity / Produce</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
            >
              <option value="All">All Commodities</option>
              <option value="Red Chilli">Red Chilli (మిరప)</option>
              <option value="Turmeric">Turmeric (పసుపు)</option>
              <option value="Cotton Bales">Cotton Bales (పత్తి)</option>
              <option value="Paddy / Rice">Paddy / Rice (వరి)</option>
              <option value="Groundnut">Groundnut (వేరుశనగ)</option>
              <option value="Pulses">Pulses & Red Gram (కందులు)</option>
              <option value="Vegetables">Vegetables & Fruits</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Directory */}
      {loading && (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-slate-600 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-8 animate-spin text-sky-600" />
          <span className="text-sm font-semibold">Connecting to State Warehousing & Cold Chain Registry...</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && facilities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac) => {
            const occupancy = Math.round(((fac.capacity_mt - fac.available_space_mt) / fac.capacity_mt) * 100);
            return (
              <div
                key={fac.id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-6 sm:p-7">
                  {/* Top Badge Strip */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[10px] font-black text-sky-800 uppercase">
                      {fac.facility_type}
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                      ₹{fac.monthly_rent_per_bag} / bag / mo
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {fac.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span>{fac.location}, {fac.district} ({fac.state})</span>
                  </p>

                  {/* Commodities Supported */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {fac.commodities.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[11px] font-bold text-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Storage Capacity Gauge */}
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Capacity Utilization</span>
                      <span>{fac.available_space_mt.toLocaleString()} MT Free of {fac.capacity_mt.toLocaleString()} MT</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${occupancy > 80 ? "bg-amber-500" : "bg-emerald-600"}`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>

                  {/* Climate Specs & Bank Loan */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl border border-sky-100 bg-sky-50/50">
                      <span className="text-[10px] font-bold uppercase text-sky-800 flex items-center gap-1 mb-0.5">
                        <Thermometer className="size-3" />
                        Climate Control
                      </span>
                      <span className="font-semibold text-slate-800">{fac.temp_range} • {fac.humidity_rh}</span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1 mb-0.5">
                        <CreditCard className="size-3" />
                        e-NWR Pledge Loan
                      </span>
                      <span className="font-semibold text-slate-800">{fac.loan_percent}</span>
                    </div>
                  </div>

                  {/* Feature Tags */}
                  <ul className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-600">
                    {fac.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-500 font-bold block">Manager / In-Charge</span>
                    <span className="font-bold text-slate-800">{fac.contact_person}</span>
                    <a href={`tel:${fac.phone}`} className="text-sky-700 hover:underline block font-semibold text-[11px]">
                      {fac.phone}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveFacility(fac);
                      setBookingConfirmation(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Reserve Storage Bay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {activeFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">
                  Storage Bay Reservation
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {activeFacility.name}
                </h3>
                <p className="text-xs text-slate-500">{activeFacility.location}, {activeFacility.district}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFacility(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {!bookingConfirmation ? (
              <form onSubmit={handleBookSpace} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+91 98480 XXXXX"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Number of Bags</label>
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      required
                      value={bookingBags}
                      onChange={(e) => setBookingBags(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{activeFacility.bag_weight_kg}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Storage Duration</label>
                    <select
                      value={bookingMonths}
                      onChange={(e) => setBookingMonths(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months (Recommended)</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                    </select>
                  </div>
                </div>

                {/* Live Cost Calculation Box */}
                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Monthly Rental:</span>
                    <strong className="text-slate-900 font-black">
                      ₹{((parseInt(bookingBags) || 0) * activeFacility.monthly_rent_per_bag).toLocaleString()} / month
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-sky-200/80">
                    <span className="text-sky-950 font-bold">Total Estimated Tariff:</span>
                    <strong className="text-sky-950 font-black text-sm">
                      ₹{((parseInt(bookingBags) || 0) * activeFacility.monthly_rent_per_bag * (parseInt(bookingMonths) || 1)).toLocaleString()}
                    </strong>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold block mt-1.5">
                    ✓ Eligible for 70-75% Bank Loan on receipt of goods
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveFacility(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {submittingBooking ? "Generating Pass..." : "Confirm Bay Reservation"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <div className="grid size-12 place-items-center rounded-full bg-emerald-600 text-white mx-auto mb-2">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h4 className="text-base font-black text-emerald-950">Storage Bay Reserved Successfully!</h4>
                  <p className="text-xs text-emerald-800 mt-1 font-semibold">
                    Booking Reference Token:
                  </p>
                  <span className="mt-1 inline-block text-lg font-black text-emerald-900 bg-white border border-emerald-300 px-3.5 py-1 rounded-xl tracking-wider">
                    {bookingConfirmation.booking_token}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex justify-between">
                    <span>Facility:</span>
                    <strong className="text-slate-900">{bookingConfirmation.facility_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Commodity & Bags:</span>
                    <strong className="text-slate-900">{bookingConfirmation.commodity} ({bookingConfirmation.bags_count} bags)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong className="text-slate-900">{bookingConfirmation.duration_months} Months</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span>Estimated Cost:</span>
                    <strong className="text-emerald-800 font-black">₹{bookingConfirmation.total_estimated_rent_inr.toLocaleString()}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  {bookingConfirmation.instructions}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveFacility(null)}
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
