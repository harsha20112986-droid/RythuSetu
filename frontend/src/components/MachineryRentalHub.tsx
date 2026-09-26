import { useState, useEffect } from "react";
import {
  Tractor,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Truck,
} from "lucide-react";
import {
  type Farmer,
  type MachineryItem,
  type MachineryBookingRecord,
  API_BASE,
  ALL_STATES,
  getDistrictsForState,
} from "../types";

export function MachineryRentalHub({
  farmer,
  onBack,
  language = "English",
}: {
  farmer: Farmer | null;
  onBack: () => void;
  language?: string;
}) {
  const [selectedState, setSelectedState] = useState(farmer?.form.state || "Andhra Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState(farmer?.form.district || "Guntur");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [equipmentList, setEquipmentList] = useState<MachineryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalItem, setBookingModalItem] = useState<MachineryItem | null>(null);
  
  // Booking Form State
  const [farmerName, setFarmerName] = useState(farmer?.form.name || "");
  const [phone, setPhone] = useState("9848012345");
  const [village, setVillage] = useState(farmer?.form.village || "");
  const [acresOrHours, setAcresOrHours] = useState<number>(2.0);
  const [requiredDate, setRequiredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MachineryBookingRecord | null>(null);

  const isTelugu = language === "Telugu";

  const districts = getDistrictsForState(selectedState);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        state: selectedState,
        district: selectedDistrict,
        category: categoryFilter,
      });
      const res = await fetch(`${API_BASE}/machinery/rentals?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEquipmentList(data.equipment || []);
      }
    } catch (e) {
      console.error("Failed to fetch machinery", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, [selectedState, selectedDistrict, categoryFilter]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalItem) return;

    setSubmittingBooking(true);
    try {
      const res = await fetch(`${API_BASE}/machinery/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machinery_id: bookingModalItem.id,
          farmer_name: farmerName || "Cultivator",
          phone: phone,
          district: selectedDistrict,
          village: village || "Local Village",
          acres_or_hours: Number(acresOrHours) || 1,
          required_date: requiredDate,
        }),
      });

      if (res.ok) {
        const data: MachineryBookingRecord = await res.json();
        setConfirmedBooking(data);
        setBookingModalItem(null);
      }
    } catch (err) {
      console.error("Booking failed", err);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isTelugu ? "హోమ్‌కు తిరిగి వెళ్ళండి" : "Back to Home"}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            {isTelugu ? "ప్రభుత్వ ధృవీకృత యంత్రాలు & డ్రోన్లు" : "Verified Custom Hiring Centers (CHC)"}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm">
            <Tractor className="w-4 h-4 text-emerald-300" />
            <span>{isTelugu ? "రైతు యంత్రాల కిరాయి కేంద్రం" : "Farm Machinery & Agri Drone Hub"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isTelugu
              ? "ట్రాక్టర్లు, డ్రోన్ స్ప్రేయింగ్ & హార్వెస్టర్లు మీ పొలం వద్దకే"
              : "Rent Tractors, Spray Drones & Harvesters at Govt Benchmarks"}
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            {isTelugu
              ? "కార్మికుల కొరత ఉన్నప్పుడు భారీ యంత్రాలను కొననక్కర్లేదు. స్థానిక యజమానులను నేరుగా సంప్రదించి గంటకు లేదా ఎకరాకు చొప్పున బుక్ చేసుకోండి."
              : "Save up to 40% on labor and eliminate capital costs. Rent tractors, laser levelers, and 10L spray drones with zero middleman commissions."}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm text-emerald-200 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {isTelugu ? "డ్రోన్ స్ప్రే: ₹380 / ఎకరా (7 నిమిషాలు)" : "Agri Drone: ₹380/acre"}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {isTelugu ? "ట్రాక్టర్ రొటవేటర్: ₹1,200 / గంట" : "Tractor + Rotavator: ₹1,200/hr"}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {isTelugu ? "వరి హార్వెస్టర్: ₹2,400 / ఎకరా" : "Track Harvester: ₹2,400/acre"}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Banner if just booked */}
      {confirmedBooking && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-md space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <span>
                {isTelugu ? "యంత్రం బుకింగ్ విజయవంతమైంది! టోకెన్ జారీ చేయబడింది" : "Booking Confirmed! Operator Dispatched"}
              </span>
            </div>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-emerald-200 text-sm">
            <div>
              <span className="text-gray-500 block text-xs">{isTelugu ? "బుకింగ్ టోకెన్" : "Token ID"}</span>
              <span className="font-mono font-bold text-emerald-700">{confirmedBooking.booking_token}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">{isTelugu ? "యంత్రం" : "Equipment"}</span>
              <span className="font-semibold text-gray-900">{confirmedBooking.machinery_type}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">{isTelugu ? "అంచనా ఖర్చు" : "Estimated Cost"}</span>
              <span className="font-bold text-gray-900">₹{confirmedBooking.estimated_cost_inr.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-sm text-emerald-800 font-medium">
            📢 {confirmedBooking.instructions}
          </p>
          <div className="flex gap-2">
            <a
              href={`tel:${confirmedBooking.operator_phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow"
            >
              <Phone className="w-4 h-4" />
              {isTelugu ? "ఆపరేటర్‌కు ఫోన్ చేయండి" : "Call Operator Now"} ({confirmedBooking.operator_phone})
            </a>
          </div>
        </div>
      )}

      {/* Filter and District Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-600 uppercase">
              {isTelugu ? "రాష్ట్రం & జిల్లా" : "State & District"}:
            </span>
          </div>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              const newDists = getDistrictsForState(e.target.value);
              setSelectedDistrict(newDists[0] || "");
            }}
            className="text-sm font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
          >
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-sm font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          {[
            { id: "all", label: isTelugu ? "అన్నీ" : "All" },
            { id: "Land Preparation", label: isTelugu ? "ట్రాక్టర్లు / దుక్కి" : "Tractors" },
            { id: "Pest & Foliar Spraying", label: isTelugu ? "డ్రోన్ స్ప్రేయింగ్" : "Drones" },
            { id: "Harvesting & Threshing", label: isTelugu ? "కోత మిషన్లు" : "Harvesters" },
            { id: "Precision Water Conservation", label: isTelugu ? "లెవెలర్లు" : "Levelers" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                categoryFilter === cat.id
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-sm font-semibold"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards List */}
      {loading ? (
        <div className="py-16 text-center text-gray-500">
          <Clock className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p>{isTelugu ? "యంత్రాల వివరాలు లోడ్ అవుతున్నాయి..." : "Fetching nearby machinery..."}</p>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">
            {isTelugu
              ? "ఎంచుకున్న జిల్లాలో ప్రస్తుతం యంత్రాలు అందుబాటులో లేవు. సమీప జిల్లాను ఎంచుకోండి."
              : "No machinery registered yet in this district. Select a neighboring district."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Equipment Thumbnail & Status Badge */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.machinery_type}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-sm">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-gray-800 text-xs px-2 py-0.5 rounded shadow font-semibold">
                    ⭐ {item.rating} ({item.total_trips} {isTelugu ? "ట్రిప్పులు" : "trips"})
                  </div>
                  <div className="absolute bottom-2 left-3 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {item.availability_status}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                      {isTelugu && item.telugu_name ? item.telugu_name : item.machinery_type}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">{item.brand_model}</p>
                  </div>

                  {/* Pricing Highlight */}
                  <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl">
                    <span className="text-xs text-gray-500 block">
                      {isTelugu ? "ప్రభుత్వ బెంచ్‌మార్క్ కిరాయి రేటు" : "Standard Rental Rate"}:
                    </span>
                    <span className="text-xl font-extrabold text-emerald-800">{item.rate_unit}</span>
                  </div>

                  {/* Owner & Location */}
                  <div className="text-xs space-y-1 text-gray-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.owner_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {item.village}, {item.mandal}, {item.district} ({item.distance_km} km)
                      </span>
                    </div>
                  </div>

                  {/* Operations Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.suitable_operations.map((op, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-md font-medium"
                      >
                        ✓ {op}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                <a
                  href={`tel:${item.owner_phone}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isTelugu ? "ఫోన్ చేయండి" : "Call Owner"}</span>
                </a>
                <button
                  onClick={() => {
                    setBookingModalItem(item);
                  }}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  <span>{isTelugu ? "బుక్ చేయండి" : "Book Slot"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-xl text-gray-900">
                  {isTelugu ? "యంత్రం బుకింగ్ ఫారమ్" : "Book Farm Machinery Dispatch"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {bookingModalItem.machinery_type} — {bookingModalItem.rate_unit}
                </p>
              </div>
              <button
                onClick={() => setBookingModalItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTelugu ? "రైతు పేరు" : "Farmer Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isTelugu ? "ఫోన్ నంబర్" : "Mobile Phone"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isTelugu ? "గ్రామం" : "Field Village"}
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Chennaraopet"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {bookingModalItem.pricing_type === "per_hour"
                      ? isTelugu
                        ? "అవసరమైన గంటలు"
                        : "Hours Needed"
                      : isTelugu
                      ? "పొలం ఎకరాలు"
                      : "Total Acres"}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={acresOrHours}
                    onChange={(e) => setAcresOrHours(parseFloat(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isTelugu ? "కావలసిన తేదీ" : "Required Date"}
                  </label>
                  <input
                    type="date"
                    required
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-800 block font-medium">
                    {isTelugu ? "అంచనా మొత్తం చెల్లింపు" : "Total Estimated Rent"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {acresOrHours} {bookingModalItem.pricing_type === "per_hour" ? "hours" : "acres"} × ₹{bookingModalItem.rate_inr}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-emerald-900">
                  ₹{(acresOrHours * bookingModalItem.rate_inr).toLocaleString()}
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-tight">
                ℹ️ {isTelugu
                  ? "ముందస్తు డిపాజిట్ అవసరం లేదు. పని పూర్తయిన తర్వాత ఆపరేటర్‌కు నేరుగా నగదు లేదా UPI ద్వారా చెల్లించండి."
                  : "No advance payment needed. You pay the operator directly after on-field work completion."}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalItem(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100"
                >
                  {isTelugu ? "రద్దు" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {submittingBooking
                    ? isTelugu
                      ? "టోకెన్ జారీ చేస్తోంది..."
                      : "Booking..."
                    : isTelugu
                    ? "ఖరారు చేయండి"
                    : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
