import { useEffect, useState, type FormEvent } from "react";

const API_BASE = "http://localhost:8000/api/v1";

const features = [
  { icon: "🌦️", title: "Climate Risk", description: "Understand weather and climate risks affecting your crops." },
  { icon: "📋", title: "Scheme Finder", description: "Find relevant government support and understand eligibility." },
  { icon: "💰", title: "Benefit Estimator", description: "See an explainable estimate of potential eligible benefits." },
  { icon: "🌱", title: "Crop Loss", description: "Report crop damage with evidence and track what happens next." },
];

const states = ["Andhra Pradesh", "Telangana"];
const districts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Kurnool", "Guntur", "Krishna"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
};
const crops = ["Groundnut", "Rice", "Cotton", "Maize", "Chilli", "Pigeon Pea"];
const seasons = ["Kharif", "Rabi", "Summer"];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    language: "English",
    state: "Andhra Pradesh",
    district: "Anantapur",
    mandal: "",
    village: "",
    crop: "Groundnut",
    season: "Kharif",
    land_area_acres: "",
  });

  useEffect(() => {
    const existing = localStorage.getItem("rythusetu_farmer");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setForm((current) => ({ ...current, ...parsed.form }));
        setProfileId(parsed.id ?? null);
        setSaved(true);
      } catch {
        localStorage.removeItem("rythusetu_farmer");
      }
    }
  }, []);

  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSaved(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      land_area_acres: Number(form.land_area_acres),
    };

    try {
      const response = await fetch(`${API_BASE}/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail?.[0]?.msg || body?.detail || "Unable to save profile");
      }
      const data = await response.json();
      localStorage.setItem("rythusetu_farmer", JSON.stringify({ id: data.id, form }));
      setProfileId(data.id);
      setSaved(true);
      setShowOnboarding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-green-700 text-xl shadow-sm">🌾</div>
            <div>
              <p className="text-lg font-bold tracking-tight">RythuSetu</p>
              <p className="text-xs text-stone-500">Your AI Bridge to Farmer Support</p>
            </div>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
            Onboarding v0.2
          </span>
        </div>
      </header>

      {!showOnboarding ? (
        <>
          <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <span className="mb-4 w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                AI-Powered Farmer Support Platform
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Know your risk. Know your benefits. Know what to do next.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
                RythuSetu brings climate risk insights, crop-loss guidance, government schemes, and next-step support together in one farmer-friendly platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setShowOnboarding(true)} className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800">
                  {saved ? "Update Farmer Profile" : "Get Started"}
                </button>
                <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-700 transition hover:bg-stone-100">
                  Explore Features
                </button>
              </div>
              {saved && (
                <p className="mt-4 text-sm font-medium text-green-700">✓ Farmer profile saved successfully{profileId ? ` · ID ${profileId}` : ""}</p>
              )}
            </div>

            <div className="rounded-3xl border border-green-100 bg-green-900 p-6 text-white shadow-xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">Farmer home</p>
              <div className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-sm text-green-100">Good morning 👋</p>
                <p className="mt-1 text-2xl font-bold">Your farm support snapshot</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-green-100">Weather risk</p><p className="mt-1 text-xl font-bold">Coming soon</p></div>
                  <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-green-100">Eligible schemes</p><p className="mt-1 text-xl font-bold">Coming soon</p></div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-green-50">
                Start with your farmer profile. RythuSetu will use it later to personalize risk, scheme, benefit, and crop-loss guidance.
              </div>
            </div>
          </section>

          <section id="features" className="border-y border-stone-200 bg-white">
            <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
              <div className="max-w-2xl"><p className="text-sm font-semibold text-green-700">What we are building</p><h2 className="mt-2 text-3xl font-bold tracking-tight">One place for the next right action.</h2></div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => <article key={feature.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5"><div className="text-2xl">{feature.icon}</div><h3 className="mt-4 font-bold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{feature.description}</p></article>)}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
          <button onClick={() => setShowOnboarding(false)} className="mb-6 text-sm font-semibold text-green-700">← Back to home</button>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-green-700">Step 1 · Farmer profile</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tell us about your farm</h1>
              <p className="mt-3 leading-7 text-stone-600">This information helps RythuSetu personalize future climate alerts, scheme matches, and benefit estimates.</p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Farmer name" value={form.name} onChange={(value) => update("name", value)} placeholder="Enter your name" required />
                <SelectField label="Preferred language" value={form.language} options={["English", "Telugu", "Hindi"]} onChange={(value) => update("language", value)} />
              </div>

              <div className="border-t border-stone-100 pt-6"><p className="font-bold">Farm location</p><div className="mt-4 grid gap-5 sm:grid-cols-2">
                <SelectField label="State" value={form.state} options={states} onChange={(value) => { update("state", value); update("district", districts[value][0]); }} />
                <SelectField label="District" value={form.district} options={districts[form.state]} onChange={(value) => update("district", value)} />
                <Field label="Mandal" value={form.mandal} onChange={(value) => update("mandal", value)} placeholder="Enter mandal" required />
                <Field label="Village" value={form.village} onChange={(value) => update("village", value)} placeholder="Enter village" required />
              </div></div>

              <div className="border-t border-stone-100 pt-6"><p className="font-bold">Farm details</p><div className="mt-4 grid gap-5 sm:grid-cols-2">
                <SelectField label="Main crop" value={form.crop} options={crops} onChange={(value) => update("crop", value)} />
                <SelectField label="Season" value={form.season} options={seasons} onChange={(value) => update("season", value)} />
                <Field label="Land area (acres)" type="number" min="0.1" step="0.1" value={form.land_area_acres} onChange={(value) => update("land_area_acres", value)} placeholder="e.g. 2.5" required />
              </div></div>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <button disabled={saving} className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving profile…" : "Save Farmer Profile"}
              </button>
              <p className="text-center text-xs leading-5 text-stone-500">No Aadhaar or other unnecessary sensitive identifier is required for this step.</p>
            </form>
          </div>
        </section>
      )}

      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-stone-500 lg:px-8">
        RythuSetu is a support and guidance platform. Benefit estimates are informational and do not replace official government or insurance decisions.
      </footer>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", min, step, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; min?: string; step?: string; required?: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span><input required={required} type={type} min={min} step={step} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition placeholder:text-stone-400 focus:border-green-600 focus:ring-4 focus:ring-green-100" /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export default App;
