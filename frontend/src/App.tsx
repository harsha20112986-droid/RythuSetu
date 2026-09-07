import { useState, useEffect, type FormEvent } from "react";
import {
  type Page,
  type FormState,
  type Farmer,
  type ChatMessage,
  type AuthUser,
  API_BASE,
} from "./types";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { SchemeFinder } from "./components/SchemeFinder";
import { BenefitEstimator } from "./components/BenefitEstimator";
import { CropLossReporter } from "./components/CropLossReporter";
import { CropDoctor } from "./components/CropDoctor";
import { MandiPrices } from "./components/MandiPrices";
import { FertilizerOptimizer } from "./components/FertilizerOptimizer";
import { IvrModal } from "./components/IvrModal";
import { KrishiAssistant } from "./components/KrishiAssistant";
import { LoginModal } from "./components/LoginModal";
import { AdminPortal } from "./components/AdminPortal";
import { Sprout } from "lucide-react";

export function App() {
  const [page, setPage] = useState<Page>("home");
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "Kishan Rao",
    language: "English",
    state: "Telangana",
    district: "Warangal",
    mandal: "Narsampet",
    village: "Chennaraopet",
    crop: "Cotton",
    season: "Kharif",
    land_area_acres: "3.5",
  });

  // Role authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [ivrOpen, setIvrOpen] = useState(false);
  const [assistantLanguage, setAssistantLanguage] = useState("English");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([]);

  // Initialize farmer & auth user on mount
  useEffect(() => {
    // 1. Check saved auth user
    const savedUserRaw = localStorage.getItem("rythusetu_user");
    if (savedUserRaw) {
      try {
        const u = JSON.parse(savedUserRaw) as AuthUser;
        setCurrentUser(u);
        if (u.role === "admin") {
          setPage("admin");
        }
      } catch {
        localStorage.removeItem("rythusetu_user");
      }
    }

    // 2. Check saved farmer profile
    const raw = localStorage.getItem("rythusetu_farmer");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Farmer;
        setFarmer(saved);
        setForm(saved.form);
        setAssistantLanguage(saved.form.language || "English");
      } catch {
        localStorage.removeItem("rythusetu_farmer");
      }
    }
  }, []);

  useEffect(() => {
    if (!farmer) return;

    const language = farmer.form.language || "English";
    const welcome =
      language === "Telugu"
        ? `\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02 ${farmer.form.name}! \u0C28\u0C47\u0C28\u0C41 \u0C2E\u0C40 RythuSetu Krishi Assistant.`
        : language === "Hindi"
          ? `\u0928\u092E\u0938\u094D\u0924\u0947 ${farmer.form.name}! \u092E\u0948\u0902 \u0906\u092A\u0915\u093E RythuSetu Krishi Assistant \u0939\u0942\u0901\u0964`
          : `Namaste ${farmer.form.name}! I'm your RythuSetu Krishi Assistant.`;

    const instructions =
      language === "Telugu"
        ? " \u0C35\u0C3E\u0C24\u0C3E\u0C35\u0C30\u0C23\u0C02, \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D ధరలు, ఎరువులు లేదా పంట నష్టం గురించి అడగండి."
        : language === "Hindi"
          ? " \u092E\u094C\u0938\u092E, मंडी भाव, खाद खुराक या फसल नुकसान के बारे में पूछें।"
          : " Ask me about weather risk, live mandi prices, fertilizer dosages, eligible schemes, or crop loss claims.";

    setAssistantMessages([
      {
        role: "assistant",
        text: welcome + instructions,
      },
    ]);

    setAssistantLanguage(language);
  }, [farmer]);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSelectPreset = (preset: Farmer) => {
    setFarmer(preset);
    setForm(preset.form);
    setAssistantLanguage(preset.form.language || "English");
    localStorage.setItem("rythusetu_farmer", JSON.stringify(preset));
    setPage("dashboard");
  };

  const handleLoginSuccess = (user: AuthUser, farmerProfile?: Farmer) => {
    setCurrentUser(user);
    if (farmerProfile) {
      setFarmer(farmerProfile);
      setForm(farmerProfile.form);
      setAssistantLanguage(farmerProfile.form.language || "English");
    }
    if (user.role === "admin") {
      setPage("admin");
    } else {
      setPage("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rythusetu_user");
    localStorage.removeItem("rythusetu_token");
    setCurrentUser(null);
    setPage("home");
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          land_area_acres: Number(form.land_area_acres),
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.detail?.[0]?.msg ||
            body?.detail ||
            "Unable to save farmer profile",
        );
      }

      const saved: Farmer = {
        id: body.id,
        form,
      };

      setFarmer(saved);
      localStorage.setItem("rythusetu_farmer", JSON.stringify(saved));
      setPage("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = (targetPage: "schemes" | "benefits" | "loss") => {
    if (farmer) {
      setPage(targetPage);
    } else {
      setPage("onboarding");
    }
  };

  const sendAssistantMessage = async (customText?: string) => {
    const textToSend = customText || assistantQuestion;
    if (!textToSend.trim() || assistantLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAssistantMessages((prev) => [...prev, userMessage]);
    if (!customText) setAssistantQuestion("");
    setAssistantLoading(true);
    setAssistantError("");

    try {
      const response = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmer?.id ?? 1,
          question: textToSend,
          language: assistantLanguage,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.detail || "Assistant response failed");
      }

      const botMessage: ChatMessage = {
        role: "assistant",
        text: body.answer || "No response received",
        timestamp: new Date().toLocaleTimeString(),
      };

      setAssistantMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setAssistantError(
        err instanceof Error ? err.message : "Assistant communication error",
      );
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      <Header
        page={page}
        setPage={setPage}
        farmer={farmer}
        language={assistantLanguage}
        setLanguage={setAssistantLanguage}
        onOpenIvr={() => setIvrOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 pb-16">
        {/* Officer Administration Portal */}
        {currentUser?.role === "admin" && page === "admin" && (
          <AdminPortal
            user={currentUser}
            onSwitchToFarmerView={() => setPage("home")}
          />
        )}

        {/* Regular Platform Views */}
        {page === "home" && (
          <Home
            farmer={farmer}
            onStart={() => setPage("onboarding")}
            onDashboard={() => setPage("dashboard")}
            onSelectPreset={handleSelectPreset}
            onNavigate={handleNavigate}
          />
        )}

        {page === "onboarding" && (
          <Onboarding
            form={form}
            saving={saving}
            error={error}
            update={update}
            onSubmit={saveProfile}
            onBack={() => setPage(farmer ? "dashboard" : "home")}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {page === "dashboard" && farmer && (
          <Dashboard
            farmer={farmer}
            onEdit={() => setPage("onboarding")}
            onSchemes={() => setPage("schemes")}
            onBenefits={() => setPage("benefits")}
            onLoss={() => setPage("loss")}
            onOpenAssistant={() => setAssistantOpen(true)}
            onDoctor={() => setPage("doctor")}
            onOpenIvr={() => setIvrOpen(true)}
            onMandi={() => setPage("mandi")}
            onFertilizer={() => setPage("fertilizer")}
          />
        )}

        {page === "mandi" && (
          <MandiPrices
            farmer={farmer}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "fertilizer" && (
          <FertilizerOptimizer
            farmer={farmer}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "schemes" && farmer && (
          <SchemeFinder
            farmer={farmer}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "benefits" && farmer && (
          <BenefitEstimator
            farmer={farmer}
            onBack={() => setPage("dashboard")}
          />
        )}

        {page === "doctor" && (
          <CropDoctor
            farmer={farmer}
            onBack={() => setPage(farmer ? "dashboard" : "home")}
            onNavigateToLoss={() => setPage("loss")}
          />
        )}

        {page === "loss" && farmer && (
          <CropLossReporter
            farmer={farmer}
            onBack={() => setPage("dashboard")}
          />
        )}
      </div>

      {/* Floating Krishi AI Assistant - Only for Farmers */}
      {currentUser?.role !== "admin" && farmer && (
        <KrishiAssistant
          open={assistantOpen}
          setOpen={setAssistantOpen}
          language={assistantLanguage}
          setLanguage={setAssistantLanguage}
          messages={assistantMessages}
          question={assistantQuestion}
          setQuestion={setAssistantQuestion}
          loading={assistantLoading}
          error={assistantError}
          onSend={sendAssistantMessage}
        />
      )}

      {/* Login & Registration Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-8 backdrop-blur-xs text-xs text-slate-500 pr-24 sm:pr-8">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-xl bg-emerald-700 text-white text-xs shadow-2xs">
              <Sprout className="size-4 text-emerald-100" />
            </div>
            <span className="font-black text-emerald-950 text-sm tracking-tight">RythuSetu</span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-600">AI Bridge to Farmer Support</span>
          </div>

          <p className="text-center sm:text-right max-w-md text-slate-400 leading-relaxed text-[11px]">
            Comprehensive agricultural decision-support with real-time e-NAM Mandi arrivals, NPK fertilizer optimization, and PMFBY claims management.
          </p>
        </div>
      </footer>

      <IvrModal open={ivrOpen} setOpen={setIvrOpen} farmer={farmer} />
    </main>
  );
}

export default App;
