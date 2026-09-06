import { useEffect, useState, type FormEvent } from "react";

const API_BASE = "http://localhost:8000/api/v1";

type FormState = {
  name: string;
  language: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  crop: string;
  season: string;
  land_area_acres: string;
};

type SavedFarmer = { id: number; form: FormState };

type Scheme = {
  id: string;
  name: string;
  category: string;
  scope: string;
  icon: string;
  summary: string;
  benefit: string;
  eligibility_note: string;
  official_url: string;
  last_verified: string;
  match_label: string;
  reasons: string[];
};

type BenefitItem = {
  id: string;
  name: string;
  category: string;
  type: string;
  estimated_amount: number | null;
  calculation: string;
  basis: string;
  official_url: string;
  last_verified: string;
};

type BenefitEstimate = {
  estimated_total: number;
  items: BenefitItem[];
  disclaimer: string;
};

const states = ["Andhra Pradesh", "Telangana"];
const districts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Kurnool", "Guntur", "Krishna"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
};
const crops = ["Groundnut", "Rice", "Cotton", "Maize", "Chilli", "Pigeon Pea"];
const seasons = ["Kharif", "Rabi", "Summer"];

function App() {
  const [page, setPage] = useState<"home" | "onboarding" | "dashboard" | "schemes" | "benefits">("home");
  const [farmer, setFarmer] = useState<SavedFarmer | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "", language: "English", state: "Andhra Pradesh", district: "Anantapur",
    mandal: "", village: "", crop: "Groundnut", season: "Kharif", land_area_acres: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("rythusetu_farmer");
    if (!stored) return;
    try {
      const data = JSON.parse(stored) as SavedFarmer;
      setFarmer(data);
      setForm(data.form);
    } catch {
      localStorage.removeItem("rythusetu_farmer");
    }
  }, []);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, land_area_acres: Number(form.land_area_acres) }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.detail?.[0]?.msg || body?.detail || "Unable to save profile");
      const saved: SavedFarmer = { id: body.id, form };
      setFarmer(saved);
      localStorage.setItem("rythusetu_farmer", JSON.stringify(saved));
      setPage("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <Header page={page} hasProfile={Boolean(farmer)} onHome={() => setPage("home")} onDashboard={() => setPage(farmer ? "dashboard" : "onboarding")} />
      {page === "home" && <Home hasProfile={Boolean(farmer)} onStart={() => setPage("onboarding")} onDashboard={() => setPage("dashboard")} />}
      {page === "onboarding" && <Onboarding form={form} farmer={farmer} saving={saving} error={error} update={update} onSubmit={saveProfile} onBack={() => setPage(farmer ? "dashboard" : "home")} />}
      {page === "dashboard" && farmer && <Dashboard farmer={farmer} onEdit={() => setPage("onboarding")} onSchemes={() => setPage("schemes")} onBenefits={() => setPage("benefits")} />}
      {page === "schemes" && farmer && <SchemeFinder farmer={farmer} onBack={() => setPage("dashboard")} />}
      {page === "benefits" && farmer && <BenefitEstimator farmer={farmer} onBack={() => setPage("dashboard")} />}
      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-stone-500 lg:px-8">RythuSetu is a support and guidance platform. Benefit estimates are informational and do not replace official government or insurance decisions.</footer>
    </main>
  );
}

function Header({ page, hasProfile, onHome, onDashboard }: { page: string; hasProfile: boolean; onHome: () => void; onDashboard: () => void }) {
  return <header className="border-b border-stone-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8"><button onClick={onHome} className="flex items-center gap-3 text-left"><div className="grid size-11 place-items-center rounded-2xl bg-green-700 text-xl">🌾</div><div><p className="text-lg font-bold">RythuSetu</p><p className="text-xs text-stone-500">Your AI Bridge to Farmer Support</p></div></button><div className="flex items-center gap-2">{hasProfile && page !== "dashboard" && page !== "schemes" && page !== "benefits" && <button onClick={onDashboard} className="hidden rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 sm:block">My Dashboard</button>}<span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">Dashboard v0.5</span></div></div></header>;
}

function Home({ hasProfile, onStart, onDashboard }: { hasProfile: boolean; onStart: () => void; onDashboard: () => void }) {
  const features = [["🌦️", "Climate Risk", "Understand weather and climate risks affecting your crops."], ["📋", "Scheme Finder", "Find relevant government support and understand eligibility."], ["💰", "Benefit Estimator", "See an explainable estimate of potential eligible benefits."], ["🌱", "Crop Loss", "Report crop damage with evidence and track what happens next."]];
  return <><section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20"><div className="flex flex-col justify-center"><span className="mb-4 w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">AI-Powered Farmer Support Platform</span><h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">Know your risk. Know your benefits. Know what to do next.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">RythuSetu brings climate risk insights, crop-loss guidance, government schemes, and next-step support together in one farmer-friendly platform.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={hasProfile ? onDashboard : onStart} className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">{hasProfile ? "Open My Dashboard" : "Get Started"}</button>{hasProfile ? <button onClick={onStart} className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold">Update Profile</button> : <a href="#features" className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold">Explore Features</a>}</div>{hasProfile && <p className="mt-4 text-sm font-medium text-green-700">✓ Your farmer profile is ready for personalized support.</p>}</div><div className="rounded-3xl bg-green-900 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">Farmer home</p><div className="mt-6 rounded-2xl bg-white/10 p-5"><p className="text-sm text-green-100">Good morning 👋</p><p className="mt-1 text-2xl font-bold">Your farm support snapshot</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-green-100">Weather risk</p><p className="mt-1 text-xl font-bold">On dashboard</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-green-100">Farmer profile</p><p className="mt-1 text-xl font-bold">{hasProfile ? "Saved" : "Not started"}</p></div></div></div></div></section><section id="features" className="border-y border-stone-200 bg-white"><div className="mx-auto max-w-6xl px-5 py-14 lg:px-8"><p className="text-sm font-semibold text-green-700">What we are building</p><h2 className="mt-2 text-3xl font-bold">One place for the next right action.</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([icon, title, description]) => <article key={title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5"><div className="text-2xl">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{description}</p></article>)}</div></div></section></>;
}

function Onboarding({ form, farmer, saving, error, update, onSubmit, onBack }: { form: FormState; farmer: SavedFarmer | null; saving: boolean; error: string; update: (field: keyof FormState, value: string) => void; onSubmit: (event: FormEvent) => void; onBack: () => void }) {
  return <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14"><button onClick={onBack} className="mb-6 text-sm font-semibold text-green-700">← Back</button><div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9"><p className="text-sm font-semibold text-green-700">Farmer profile</p><h1 className="mt-2 text-3xl font-black tracking-tight">Tell us about your farm</h1><p className="mt-3 leading-7 text-stone-600">Your profile lets RythuSetu personalize climate, scheme, benefit, and crop-loss guidance.</p><form onSubmit={onSubmit} className="mt-8 space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Farmer name" value={form.name} onChange={(v) => update("name", v)} placeholder="Enter your name" required /><SelectField label="Preferred language" value={form.language} options={["English", "Telugu", "Hindi"]} onChange={(v) => update("language", v)} /></div><div className="border-t border-stone-100 pt-6"><p className="font-bold">Farm location</p><div className="mt-4 grid gap-5 sm:grid-cols-2"><SelectField label="State" value={form.state} options={states} onChange={(v) => { update("state", v); update("district", districts[v][0]); }} /><SelectField label="District" value={form.district} options={districts[form.state]} onChange={(v) => update("district", v)} /><Field label="Mandal" value={form.mandal} onChange={(v) => update("mandal", v)} placeholder="Enter mandal" required /><Field label="Village" value={form.village} onChange={(v) => update("village", v)} placeholder="Enter village" required /></div></div><div className="border-t border-stone-100 pt-6"><p className="font-bold">Farm details</p><div className="mt-4 grid gap-5 sm:grid-cols-2"><SelectField label="Main crop" value={form.crop} options={crops} onChange={(v) => update("crop", v)} /><SelectField label="Season" value={form.season} options={seasons} onChange={(v) => update("season", v)} /><Field label="Land area (acres)" type="number" min="0.1" step="0.1" value={form.land_area_acres} onChange={(v) => update("land_area_acres", v)} placeholder="e.g. 2.5" required /></div></div>{error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<button disabled={saving} className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white hover:bg-green-800 disabled:opacity-60">{saving ? "Saving profile…" : farmer ? "Save New Profile & Open Dashboard" : "Save & Open Dashboard"}</button><p className="text-center text-xs text-stone-500">No Aadhaar or other unnecessary sensitive identifier is required for this step.</p></form></div></section>;
}

function Dashboard({ farmer, onEdit, onSchemes, onBenefits }: { farmer: SavedFarmer; onEdit: () => void; onSchemes: () => void; onBenefits: () => void }) {
  const { form } = farmer;
  return <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12"><div className="flex flex-col gap-4 rounded-3xl bg-green-900 p-6 text-white shadow-xl sm:p-8 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">Farmer dashboard</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Namaste, {form.name} 👋</h1><p className="mt-2 text-green-100">{form.village}, {form.mandal}, {form.district} · {form.state}</p></div><button onClick={onEdit} className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/20">Edit profile</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card icon="🌱" label="Main crop" value={form.crop} detail={`${form.season} season`} /><Card icon="📐" label="Farm area" value={`${Number(form.land_area_acres).toFixed(1)} acres`} detail="Profile value" /><Card icon="📍" label="Location" value={form.district} detail={form.state} /><Card icon="🗣️" label="Language" value={form.language} detail="Preferred" /></div><div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]"><div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-green-700">Climate risk</p><h2 className="mt-1 text-2xl font-black">Moderate attention needed</h2><p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Demo assessment only. Live weather and crop-specific risk scoring will be connected next.</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">DEMO DATA</span></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Temperature" value="32°C" /><Metric label="Rain chance" value="20%" /><Metric label="Heat stress" value="Medium" /></div><div className="mt-6 rounded-2xl bg-stone-50 p-5"><p className="text-sm font-bold">Suggested action</p><p className="mt-2 text-sm leading-6 text-stone-600">Check crop moisture regularly and watch for heat-stress symptoms. This demo is not an official weather or disaster declaration.</p></div></div><div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"><p className="text-sm font-semibold text-green-700">Next actions</p><h2 className="mt-1 text-2xl font-black">Your support toolkit</h2><div className="mt-5 space-y-3"><button onClick={onSchemes} className="block w-full text-left"><Action icon="📋" title="Find schemes" subtitle="Relevant government support" /></button><button onClick={onBenefits} className="block w-full text-left"><Action icon="💰" title="Estimate benefits" subtitle="Explainable eligibility estimate" /></button><Action icon="🌱" title="Report crop loss" subtitle="Evidence + tracking workflow" /></div></div></div><div className="mt-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-900"><strong>Profile ID #{farmer.id}.</strong> Your saved profile personalizes RythuSetu features.</div></section>;
}

function SchemeFinder({ farmer, onBack }: { farmer: SavedFarmer; onBack: () => void }) {
  const [schemes, setSchemes] = useState<Scheme[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { const controller = new AbortController(); const load = async () => { try { const params = new URLSearchParams({ state: farmer.form.state, crop: farmer.form.crop, season: farmer.form.season }); const response = await fetch(`${API_BASE}/schemes?${params}`, { signal: controller.signal }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.detail || "Unable to load schemes"); setSchemes(body?.schemes ?? []); } catch (err) { if (err instanceof DOMException && err.name === "AbortError") return; setError(err instanceof Error ? err.message : "Unable to load schemes"); } finally { setLoading(false); } }; load(); return () => controller.abort(); }, [farmer.form.state, farmer.form.crop, farmer.form.season]);
  return <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12"><button onClick={onBack} className="mb-6 text-sm font-semibold text-green-700">← Back to dashboard</button><div className="rounded-3xl bg-green-900 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">Scheme finder</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Support matched to your farm</h1><p className="mt-3 max-w-3xl text-green-100">Based on {farmer.form.state}, {farmer.form.crop}, and {farmer.form.season}. Matches are guidance, not a confirmation of official eligibility.</p></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900"><strong>Important:</strong> RythuSetu ranks potentially relevant schemes. Final eligibility, enrollment, notified crops/areas, documents, and benefit decisions belong to the official government scheme or insurance authority.</div>{loading && <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-center text-stone-600">Finding relevant schemes…</div>}{error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}{!loading && !error && <div className="mt-8 grid gap-5 lg:grid-cols-2">{schemes.map((scheme) => <article key={scheme.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-start gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-stone-100 text-2xl">{scheme.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">{scheme.match_label}</span><span className="text-xs font-medium text-stone-400">{scheme.scope}</span></div><h2 className="mt-3 text-xl font-black">{scheme.name}</h2><p className="mt-1 text-sm font-semibold text-green-700">{scheme.category}</p></div></div><p className="mt-5 text-sm leading-6 text-stone-600">{scheme.summary}</p><div className="mt-5 rounded-2xl bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">Potential benefit</p><p className="mt-2 font-bold text-stone-900">{scheme.benefit}</p></div><div className="mt-5"><p className="text-sm font-bold">Why it appeared</p><ul className="mt-2 space-y-2 text-sm leading-6 text-stone-600">{scheme.reasons.map((reason) => <li key={reason}>✓ {reason}</li>)}</ul></div><div className="mt-5 rounded-2xl border border-stone-200 p-4"><p className="text-sm font-bold">Eligibility note</p><p className="mt-2 text-sm leading-6 text-stone-600">{scheme.eligibility_note}</p></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-stone-400">Source checked: {scheme.last_verified}</p><a href={scheme.official_url} target="_blank" rel="noreferrer" className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800">Open official site ↗</a></div></article>)}</div>}</section>;
}

function BenefitEstimator({ farmer, onBack }: { farmer: SavedFarmer; onBack: () => void }) {
  const [estimate, setEstimate] = useState<BenefitEstimate | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { const controller = new AbortController(); const load = async () => { setLoading(true); setError(""); try { const params = new URLSearchParams({ state: farmer.form.state, crop: farmer.form.crop, season: farmer.form.season, land_area_acres: farmer.form.land_area_acres }); const response = await fetch(`${API_BASE}/benefits/estimate?${params}`, { signal: controller.signal }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.detail || "Unable to calculate estimate"); setEstimate(body); } catch (err) { if (err instanceof DOMException && err.name === "AbortError") return; setError(err instanceof Error ? err.message : "Unable to calculate estimate"); } finally { setLoading(false); } }; load(); return () => controller.abort(); }, [farmer.form.state, farmer.form.crop, farmer.form.season, farmer.form.land_area_acres]);
  return <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12"><button onClick={onBack} className="mb-6 text-sm font-semibold text-green-700">← Back to dashboard</button><div className="rounded-3xl bg-green-900 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">Benefit estimator</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">What support could this profile qualify for?</h1><p className="mt-3 max-w-3xl text-green-100">Estimate based on {farmer.form.state}, {farmer.form.crop}, {farmer.form.season}, and {Number(farmer.form.land_area_acres).toFixed(1)} acres.</p></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900"><strong>Important:</strong> This is an informational estimate, not a guaranteed payment or insurance claim. Official eligibility, land records, exclusions, notified crops/areas, enrollment, verification, and assessed losses determine actual outcomes.</div>{loading && <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-center text-stone-600">Calculating your potential support…</div>}{error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}{!loading && !error && estimate && <><div className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-6 sm:p-8"><p className="text-sm font-semibold text-green-700">Potential annual support covered by fixed rules</p><p className="mt-2 text-4xl font-black text-green-900">₹{estimate.estimated_total.toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-green-800">Only schemes with a responsible fixed or area-based calculation are included in this total.</p></div><div className="mt-6 grid gap-5 lg:grid-cols-2">{estimate.items.map((item) => <article key={item.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-green-700">{item.category}</p><h2 className="mt-1 text-xl font-black">{item.name}</h2></div>{item.estimated_amount === null ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">Variable</span> : <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">Estimated</span>}</div><div className="mt-5 rounded-2xl bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">Calculation</p><p className="mt-2 font-bold">{item.calculation}</p></div>{item.estimated_amount !== null && <p className="mt-4 text-2xl font-black">₹{item.estimated_amount.toLocaleString("en-IN")}</p>}<p className="mt-4 text-sm leading-6 text-stone-600"><strong>Basis:</strong> {item.basis}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-stone-400">Source checked: {item.last_verified}</p><a href={item.official_url} target="_blank" rel="noreferrer" className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800">Verify officially ↗</a></div></article>)}</div><div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5"><p className="text-sm font-bold">What can change the actual amount?</p><p className="mt-2 text-sm leading-6 text-stone-600">Government rules, land-record verification, family-level eligibility, scheme exclusions, enrollment status, notified areas/crops, and insurance loss assessment can change the final outcome.</p></div></>}</section>;
}

function Card({ icon, label, value, detail }: { icon: string; label: string; value: string; detail: string }) { return <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><span className="text-xl">{icon}</span><span className="text-xs text-stone-400">{detail}</span></div><p className="mt-4 text-sm text-stone-500">{label}</p><p className="mt-1 truncate text-lg font-bold">{value}</p></article>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-stone-200 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>; }
function Action({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-stone-100 text-lg">{icon}</div><div><p className="font-bold">{title}</p><p className="mt-1 text-xs text-stone-500">{subtitle}</p></div><span className="ml-auto rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600">Open</span></div>; }
function Field({ label, value, onChange, placeholder, type = "text", min, step, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; min?: string; step?: string; required?: boolean }) { return <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span><input required={required} type={type} min={min} step={step} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100" /></label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

export default App;
