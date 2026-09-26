import { ArrowLeft, Shield, FileText, Lock, Scale, AlertCircle, CheckCircle2, Mail } from "lucide-react";

interface LegalPagesProps {
  page: "privacy" | "terms";
  onBack: () => void;
}

export function LegalPages({ page, onBack }: LegalPagesProps) {
  const isPrivacy = page === "privacy";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 mb-3 border border-emerald-500/30">
          {isPrivacy ? <Lock className="size-3.5" /> : <Scale className="size-3.5" />}
          <span>{isPrivacy ? "Transparency & Trust" : "Platform Conditions"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          {isPrivacy ? "Privacy Policy" : "Terms of Service"}
        </h1>
        <p className="mt-2 text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
          {isPrivacy
            ? "How RythuSetu collects, protects, and respects your agricultural and personal data."
            : "Clear, transparent guidelines for using the RythuSetu farmer intelligence platform."}
        </p>
        <p className="mt-2 text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      {/* Informal Disclaimer Notice */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="size-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> This document is provided for farmer transparency and informational purposes. It is subject to periodic updates and official legal review. For any privacy or terms inquiries, reach us at{" "}
          <a href="mailto:support@rythusetu.in" className="underline font-bold text-amber-950">
            support@rythusetu.in
          </a>.
        </p>
      </div>

      {/* Content Body */}
      {isPrivacy ? (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-slate-700 shadow-sm text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Shield className="size-4 text-emerald-600" />
              1. What Information We Collect
            </h2>
            <p>We collect only the information necessary to provide you with relevant agricultural assistance and scheme guidance:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Contact Information:</strong> Your name and mobile phone number (used for login and verification).</li>
              <li><strong>Farm Profile &amp; Location:</strong> State, district, mandal, village, land area (in acres), and water/irrigation source.</li>
              <li><strong>Crop &amp; Season Information:</strong> Crops sown, season (Kharif/Rabi), and harvest timeline.</li>
              <li><strong>Uploaded Images:</strong> Photos of damaged crops, leaf disease samples, or seed packet labels for diagnostic and verification tools.</li>
              <li><strong>Conversations:</strong> Questions asked to the multilingual Krishi AI assistant to generate appropriate answers.</li>
              <li><strong>No Aadhaar or Bank PINs:</strong> We never ask for or store Aadhaar numbers, PAN cards, or bank account PINs.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              2. How We Use Your Data
            </h2>
            <p>Your data is used exclusively to assist your farming operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Matching your farm profile against Central and State government welfare schemes (such as PM-KISAN, Rythu Bharosa, and PMFBY).</li>
              <li>Delivering localized weather hazards, drying yard rain warnings, and APMC market price insights.</li>
              <li>Assisting with seed authenticity checks and crop pest diagnosis.</li>
              <li>We do not sell your personal or farm data to third-party commercial advertisers or telemarketers.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Lock className="size-4 text-emerald-600" />
              3. Data Retention &amp; Storage
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Farm Records:</strong> Maintained for the active duration of your account so you don't need to re-enter farm details.</li>
              <li><strong>AI Assistant Conversations:</strong> Processed in real time for immediate answers and not stored for long-term profiling.</li>
              <li><strong>Crop Loss &amp; Damage Photos:</strong> Retained during the crop loss reporting lifecycle so you can present them to insurance survey officials.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Shield className="size-4 text-emerald-600" />
              4. Security Measures
            </h2>
            <p>
              We protect your data using industry-standard measures: all data in transit is encrypted using HTTPS / TLS, passwords are cryptographically hashed using bcrypt, and database access is restricted by strict role-based access controls.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              5. Your Rights &amp; Control
            </h2>
            <p>
              You maintain ownership of your information. You may request deletion or correction of your farm profile and stored data at any time by contacting our support team at{" "}
              <a href="mailto:support@rythusetu.in" className="text-emerald-700 underline font-semibold">
                support@rythusetu.in
              </a>.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Mail className="size-4 text-emerald-600" />
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to request data removal, please email us at{" "}
              <a href="mailto:support@rythusetu.in" className="text-emerald-700 underline font-semibold">
                support@rythusetu.in
              </a>.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-slate-700 shadow-sm text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="size-4 text-emerald-600" />
              1. Platform Purpose &amp; Scope
            </h2>
            <p>
              RythuSetu is an agricultural intelligence and decision-support platform designed to help smallholder farmers in Andhra Pradesh and Telangana navigate APMC mandi prices, government welfare schemes, weather risks, storage godowns, and crop health advisory tools.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600" />
              2. Informational Disclaimers &amp; No Guarantees
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Mandi &amp; Market Prices:</strong> Market prices shown on RythuSetu are based on publicly available AGMARKNET and APMC reports. Rates fluctuate daily based on arrival volume, crop moisture, and spot bidding. RythuSetu does not guarantee minimum prices or trading returns.
              </li>
              <li>
                <strong>Minimum Support Price (MSP):</strong> MSP is the government's declared reference floor price for public procurement centers. Procurement is subject to official agency guidelines, Fair Average Quality (FAQ) standards, and center capacity.
              </li>
              <li>
                <strong>Weather &amp; Rain Forecasts:</strong> Meteorological forecasts from Open-Meteo and models are probabilistic estimates for district levels. Sudden hyper-localized rainfall or microclimate variations can occur.
              </li>
              <li>
                <strong>Scheme Eligibility:</strong> Eligibility screenings are automated rule-based indicators to help you discover schemes. Official eligibility and DBT disbursements are determined solely by relevant state and central government departments.
              </li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Shield className="size-4 text-emerald-600" />
              3. AI Assistant &amp; Agronomic Advisory Limitations
            </h2>
            <p>
              The Krishi AI assistant provides informational suggestions based on verified agricultural manuals and university recommendations. AI responses do not replace direct consultation with local Mandal Agricultural Officers (MAO), Krishi Vigyan Kendra (KVK) scientists, or qualified agronomists. Always verify chemical spray dosages against official product labels.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              4. User Responsibilities
            </h2>
            <p>As a user of the platform, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Provide accurate crop, land area, and location information for effective advisory matching.</li>
              <li>Verify critical insurance claim deadlines directly with your local PMFBY insurance representative within the mandated 72-hour window.</li>
              <li>Keep your login credentials secure and not share your verification tokens with unauthorized parties.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Scale className="size-4 text-emerald-600" />
              5. Prohibited Uses &amp; Limitation of Liability
            </h2>
            <p>
              Users may not attempt to scrape, disrupt, or introduce malicious payloads to the platform, or submit fraudulent seed grievance reports. To the maximum extent permitted under applicable law, RythuSetu, its developers, and contributors shall not be liable for any crop yield losses, weather damages, or financial outcomes resulting from reliance on platform data.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Scale className="size-4 text-emerald-600" />
              6. Governing Law &amp; Contact
            </h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. For questions or feedback regarding these terms, please contact{" "}
              <a href="mailto:support@rythusetu.in" className="text-emerald-700 underline font-semibold">
                support@rythusetu.in
              </a>.
            </p>
          </section>
        </div>
      )}

      {/* Bottom Back Button */}
      <div className="pt-4 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
