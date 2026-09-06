const features = [
  {
    icon: "🌦️",
    title: "Climate Risk",
    description: "Understand weather and climate risks affecting your crops.",
  },
  {
    icon: "📋",
    title: "Scheme Finder",
    description: "Find relevant government support and understand eligibility.",
  },
  {
    icon: "💰",
    title: "Benefit Estimator",
    description: "See an explainable estimate of potential eligible benefits.",
  },
  {
    icon: "🌱",
    title: "Crop Loss",
    description: "Report crop damage with evidence and track what happens next.",
  },
];

function App() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-green-700 text-xl shadow-sm">
              🌾
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">RythuSetu</p>
              <p className="text-xs text-stone-500">Your AI Bridge to Farmer Support</p>
            </div>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
            Foundation v0.1
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
            AI-Powered Farmer Support Platform
          </span>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Know your risk. Know your benefits. Know what to do next.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            RythuSetu brings climate risk insights, crop-loss guidance, government schemes,
            and next-step support together in one farmer-friendly platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800">
              Get Started
            </button>
            <button className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-700 transition hover:bg-stone-100">
              Explore Features
            </button>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            Designed mobile-first for simple, accessible farmer journeys.
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-900 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
            Farmer home
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
            <p className="text-sm text-green-100">Good morning 👋</p>
            <p className="mt-1 text-2xl font-bold">Your farm support snapshot</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-green-100">Weather risk</p>
                <p className="mt-1 text-xl font-bold">Coming soon</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-green-100">Eligible schemes</p>
                <p className="mt-1 text-xl font-bold">Coming soon</p>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-green-50">
            RythuSetu will use verified scheme data and deterministic rules for assessments,
            with AI used to explain results clearly.
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-green-700">What we are building</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">One place for the next right action.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <div className="text-2xl">{feature.icon}</div>
                <h3 className="mt-4 font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-stone-500 lg:px-8">
        RythuSetu is a support and guidance platform. Benefit estimates are informational and do not replace official government or insurance decisions.
      </footer>
    </main>
  );
}

export default App;
