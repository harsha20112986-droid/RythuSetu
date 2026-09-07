# RythuSetu 🌾
> **Your AI Bridge to Farmer Support & Agricultural Governance**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite / SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?style=flat&logo=sqlite&logoColor=white)](https://www.sqlalchemy.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RythuSetu** is an AI-powered, multilingual agricultural decision-support and governance platform designed for Indian smallholder farmers and agriculture extension officers. It bridges fragmented agricultural information—unifying live meteorological radar, AI computer vision leaf pathology, e-NAM live market arrivals, scientific NPK fertilizer dosing, government welfare schemes, and 4-stage PMFBY crop loss insurance claims with direct officer auditing workflows.

---

## 🏛️ System Architecture

RythuSetu operates on a **deterministic rules-first + AI explanation** paradigm. Mathematical financial payouts, insurance eligibility rules, and fertilizer dosages are calculated using verified agricultural circulars, while multimodal AI assists with pathology diagnosis, explanation, and natural language communication in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, and **English**.

```text
               ┌────────────────────────────────────────────────────────┐
               │              RythuSetu Web & Mobile Interface          │
               └───────────────────────────┬────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       🌾 Cultivator / Farmer Workspace             🏛️ Agriculture Officer Command Desk
     • Personal Farm Telemetry                     • PMFBY Claims Verification Desk
     • AI Crop Doctor (Leaf Vision)                • Geotagged Damage Photo Inspection
     • Live Mandi & APMC Rates (e-NAM)             • DBT Payout Authorization & Audit
     • Soil Health & NPK Dosage Optimizer          • District Emergency Alert Broadcaster
     • Government Scheme Calculator                • Smallholder Mandal Directory
     • PMFBY Claim Packet Generator                • Aggregated Relief Telemetry
     • Multilingual Krishi AI Voice
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                 FastAPI Core Services                  │
               ├───────────────────────────┬────────────────────────────┤
               │ • Weather Risk Engine     │ • Soil & NPK Dosage Engine │
               │ • Vision Pathology Model  │ • Mandi e-NAM Feed Engine  │
               │ • PMFBY Claims Processor  │ • Role-Based Auth Engine   │
               │ • Krishi AI Assistant     │ • SQLite / SQLAlchemy ORM  │
               └────────────────────────────────────────────────────────┘
```

---

## ✨ Core Capabilities

### 🌾 1. For Cultivators & Farmers

* **🌦️ Hyperlocal Meteorological Radar & Agro-Risk Index**:
  * Direct integration with Open-Meteo telemetry (Temperature, Humidity, Rain Probability, Wind Velocity).
  * Computes deterministic crop-specific risk indexes (e.g., heat stress thresholds for Kharif Cotton or wilt risks for Groundnut).

* **🔬 Computer Vision AI Crop Doctor (`CropDoctor.tsx`)**:
  * Upload or photograph diseased crop foliage for automated pathology classification.
  * Provides confidence score, canopy severity percentage, organic remedies (e.g., Neem Seed Kernel Extract), chemical sprays (e.g., Copper Oxychloride), and PMFBY localized calamity coverage status.

* **📈 Live Mandi & APMC Price Intelligence (`MandiPrices.tsx`)**:
  * Real-time market arrival volumes and modal prices across major APMC yards (*Warangal Enamamula Market Yard*, *Khammam*, *Nizamabad*, *Suryapet*, *Anantapur*, *Guntur Mirchi Yard*).
  * Compares modal rates against official Government Minimum Support Price (MSP) benchmarks.
  * Provides algorithmic **"Sell vs. Hold"** recommendations based on arrival velocity and mill demand.

* **🧪 Soil Health & Smart Fertilizer Dosage Optimizer (`FertilizerOptimizer.tsx`)**:
  * Classifies soil profile (*Black Cotton Clay*, *Red Sandy Loam*, *Alluvial*, *Laterite*) with moisture retention, pH, and organic carbon analysis.
  * Computes exact standard bag counts for Urea (45 kg bags), DAP (50 kg bags), MOP Potash (50 kg bags), and Zinc Sulphate scaled to the farmer's acreage.
  * Outputs stage-by-stage split schedules (Basal application at sowing, 1st top dressing at 30 days, 2nd top dressing at flowering).

* **🏛️ Government Scheme Matching & Benefit Estimator (`SchemeFinder.tsx` & `BenefitEstimator.tsx`)**:
  * Transparent math and eligibility checks for PM-KISAN, Rythu Bharosa / Bandhu, PMKSY Micro-Irrigation Drip Subsidies, and PMFBY.

* **📋 PMFBY 4-Stage Claim Generator & Printable Dossier (`CropLossReporter.tsx`)**:
  * Generates standardized claim packets within the mandatory 72-hour localized calamity window.
  * Generates a **Printable Official Claim Submission Dossier** with claim reference barcode, Aadhaar e-KYC status, financial valuation, and physical signatures & MAO seal stamp zones.

* **🤖 Multilingual Krishi AI Assistant & 1800 Kisan Hotline**:
  * Interactive conversational assistant answering questions in Telugu, Hindi, and English.
  * Built-in browser simulated toll-free IVR phone hotline for farmers without internet access.

---

### 🏛️ 2. For Agriculture Extension Officers (MAO / DAO)

* **📊 Government Command Portal (`AdminPortal.tsx`)**:
  * Real-time district telemetry: registered smallholders, pending physical field inspections, authorized claims, and total relief disbursed.
* **🛡️ PMFBY Claims Verification & Audit Desk**:
  * Master registry of all submitted damage claims with inline geotagged physical evidence photo auditing.
  * Decision controls: `Mark Field Inspected` ➔ `Approve for DBT` ➔ `Disburse Direct Benefit Transfer` ➔ `Reject`.
* **🚨 Emergency Weather & Pest Broadcast Dispatcher**:
  * Dispatches urgent advisories (e.g., *Pink Bollworm Alerts*, *Unseasonal Hailstorm Warnings*) directly to farmers' dashboards.
* **📁 District Smallholder Registry**:
  * Searchable registry of onboarded cultivators across mandals, survey details, and active insurance coverage.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 |
| **Database & ORM** | SQLite / PostgreSQL, SQLAlchemy 2.0 |
| **Meteorological Data** | Open-Meteo API |
| **Pathology & AI** | Deep Learning Vision / Multi-tier Heuristic Pathology Classifier |
| **Market Data** | e-NAM & Directorate of Agricultural Marketing schemas |

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18.0 or higher
* **Python**: v3.10 or higher
* **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/harsha20112986-droid/RythuSetu.git
cd RythuSetu
```

---

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* Backend API will be live at: `http://127.0.0.1:8000`
* Interactive OpenAPI Documentation: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup (React + Vite)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
* Frontend Web App will be live at: `http://localhost:5173/`

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registers a new Cultivator or Agriculture Officer |
| `POST` | `/api/v1/auth/login` | Authenticates credentials and returns JWT bearer token |
| `GET` | `/api/v1/climate/risk` | Fetches live weather telemetry and computes agro-climatic risk |
| `POST` | `/api/v1/crop-doctor/analyze` | Evaluates leaf photo for pathology, severity, and treatments |
| `GET` | `/api/v1/mandi/prices` | Fetches e-NAM APMC arrivals, modal rates, and MSP spread |
| `POST` | `/api/v1/soil/fertilizer-plan` | Calculates NPK split dosage and bag requirements per acre |
| `GET` | `/api/v1/schemes` | Discovers eligible state & central welfare schemes |
| `POST` | `/api/v1/benefits/estimate` | Calculates annual subsidy estimations |
| `POST` | `/api/v1/claims/generate-pack` | Generates standardized PMFBY claim dossier |
| `GET` | `/api/v1/admin/dashboard-stats` | Aggregates district smallholder and relief metrics |
| `GET` | `/api/v1/admin/all-claims` | Returns all filed claims for officer audit |
| `POST` | `/api/v1/admin/claims/{id}/update` | Officer advances claim stage or issues DBT approval |
| `POST` | `/api/v1/admin/broadcast-alert` | Dispatches emergency weather/pest alert to district |
| `GET` | `/api/v1/admin/farmers` | Retrieves registered district cultivators from database |

---

## 🛡️ Agricultural Guardrails & Principles

1. **Deterministic Financial Computations**: Benefit calculators and PMFBY relief estimations are strictly derived from published government scale-of-finance rules, not generative hallucination.
2. **Transparent Disclosure**: All estimated payments are clearly declared as estimates that do not supersede formal gazette decrees or joint-survey committee declarations.
3. **Privacy First**: Agricultural data is securely partitioned; single-farm private records are never exposed to other farmers.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
