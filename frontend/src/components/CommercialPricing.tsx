import { useState } from "react";
import {
  CheckCircle2,
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export function CommercialPricing({
  onBack,
  initialTab = "pricing",
}: {
  onBack: () => void;
  onOpenDemo?: () => void;
  initialTab?: "pricing" | "organizations";
}) {
  const [tab, setTab] = useState<"pricing" | "organizations">(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    org: "",
    role: "FPO Director",
    phone: "",
    farmersCount: "500 - 2,000",
    district: "Guntur",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            ← Back to Platform
          </button>
          <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/60">
            <button
              onClick={() => setTab("pricing")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                tab === "pricing" ? "bg-white text-emerald-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Commercial Pricing
            </button>
            <button
              onClick={() => setTab("organizations")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                tab === "organizations" ? "bg-white text-emerald-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Organizations & FPOs
            </button>
          </div>
        </div>

        {tab === "pricing" ? (
          <div>
            {/* Pricing Header */}
            <div className="text-center max-w-3xl mx-auto mt-12 mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="size-3.5 text-amber-500" />
                Transparent SaaS Licensing
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Pilot Packages for FPOs, Cooperatives & Agri Enterprises
              </h1>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Deploy RythuSetu across your farmer network. Full data verification, white-label branding, and dedicated agricultural scientist advisory integration.
              </p>
            </div>

            {/* 3 Pricing Tiers */}
            <div className="grid gap-8 lg:grid-cols-3 items-stretch">
              {/* Tier 1: District Pilot */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Tier 1</div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">District Pilot</h3>
                  <p className="text-xs text-slate-500 mt-1">Ideal for single FPOs & local cooperative societies</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">₹45,000</span>
                    <span className="text-xs text-slate-500">/ 3-month pilot</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">Up to 500 Registered Farmers</div>

                  <ul className="mt-8 space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Daily APMC Mandi arrival price radar</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>AI Crop Doctor leaf disease screening</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>PMFBY 72-hour crop loss intimation dossiers</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>English & Telugu interface</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>FPO Coordinator Admin Dashboard</span></li>
                  </ul>
                </div>
                <button
                  onClick={() => setTab("organizations")}
                  className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition cursor-pointer"
                >
                  Book Pilot Evaluation
                </button>
              </div>

              {/* Tier 2: FPO Network (Popular) */}
              <div className="rounded-3xl border-2 border-emerald-600 bg-gradient-to-b from-white via-emerald-50/20 to-white p-8 shadow-xl hover:shadow-2xl transition flex flex-col justify-between relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular for FPOs
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-700">Tier 2</div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Federation Network</h3>
                  <p className="text-xs text-slate-500 mt-1">For FPO federations & district cooperative unions</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">₹1,25,000</span>
                    <span className="text-xs text-slate-500">/ annual license</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">Up to 3,000 Registered Farmers</div>

                  <ul className="mt-8 space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>All District Pilot features included</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Direct Factory & Mill buyer linkages</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Custom Hiring Center (CHC) machinery booking</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>WDRA Cold Storage bay reservations</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Toll-Free 1800 IVR phone line access</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Multi-village admin access with data export</span></li>
                  </ul>
                </div>
                <button
                  onClick={() => setTab("organizations")}
                  className="mt-8 w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  Request Federation Demo
                </button>
              </div>

              {/* Tier 3: Enterprise & State */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Tier 3</div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Agri Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-1">For agribusinesses, agri-input companies & banks</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">Custom</span>
                    <span className="text-xs text-slate-500">/ tailored deployment</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">Unlimited Farmers & Multi-State</div>

                  <ul className="mt-8 space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Dedicated PostgreSQL tenant & custom API access</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>White-label branding & custom domain</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>ERP & bank e-NWR pledge loan integration</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>Custom satellite radar & soil NPK models</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 shrink-0" /><span>SLA 99.9% uptime & dedicated engineering support</span></li>
                  </ul>
                </div>
                <button
                  onClick={() => setTab("organizations")}
                  className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition cursor-pointer"
                >
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Organizations View */}
            <div className="mt-12 grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-4">
                  <Building2 className="size-3.5" />
                  Institutional Agricultural Deployment
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Empower Your Entire Farmer Network with RythuSetu
                </h1>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  Whether you are an FPO board, an agricultural cooperative, or a rural banking partner, RythuSetu delivers digital intelligence directly to your members without requiring smartphones or technical expertise.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Member Onboarding & Land Profiling</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Bulk upload farmer survey numbers, crop acreage, and bank verification statuses.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Direct Factory Procurement</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Aggregate member harvest lots for ginning mills & modern rice mills with zero broker deductions.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Statutory 72-Hour Claim Readiness</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Automated PMFBY claim preparation dossiers prevent insurance rejection deadlines.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                {submitted ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="size-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Inquiry Received!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Thank you, {form.name}. Our AgriTech deployment team will contact you within 24 hours with pilot documentation and custom access keys.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900">Schedule an Institutional Demo</h3>
                    <p className="text-xs text-slate-500">Get a 15-minute walkthrough of the FPO Coordinator Console.</p>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Ramesh Reddy"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Organization / FPO</label>
                        <input
                          type="text"
                          required
                          value={form.org}
                          onChange={(e) => setForm({ ...form, org: e.target.value })}
                          placeholder="e.g. Warangal Cotton FPO"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Role</label>
                        <select
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-emerald-600"
                        >
                          <option>FPO Director / CEO</option>
                          <option>Cooperative Officer</option>
                          <option>Agri Enterprise Lead</option>
                          <option>Bank Agri Credit Officer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Member Farmers</label>
                        <select
                          value={form.farmersCount}
                          onChange={(e) => setForm({ ...form, farmersCount: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-emerald-600"
                        >
                          <option>100 - 500 Farmers</option>
                          <option>500 - 2,000 Farmers</option>
                          <option>2,000 - 10,000 Farmers</option>
                          <option>10,000+ Farmers</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Request 10-Minute Pilot Demo</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
