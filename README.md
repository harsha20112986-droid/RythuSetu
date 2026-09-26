# RythuSetu 🌾
> **Farmer Support Platform with Government-Data Integrations, Agricultural Intelligence Tools, Marketplace Workflows & Auditable Claim-Preparation Assistance**

[![Production CI](https://github.com/harsha20112986-droid/RythuSetu/actions/workflows/ci.yml/badge.svg)](https://github.com/harsha20112986-droid/RythuSetu/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?style=flat&logo=sqlite&logoColor=white)](https://www.sqlalchemy.org/)
[![Security: BCrypt & JWT](https://img.shields.io/badge/Security-BCrypt%20%7C%20JWT%20RBAC-success)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RythuSetu** is an advanced, multilingual agricultural intelligence and governance platform designed for Indian smallholder cultivators, tenant farmers, and agricultural operations teams. Built with deterministic agronomic rules, relational database persistence, cryptographic authentication, and transparent data provenance, RythuSetu bridges fragmented agricultural systems across Open-Meteo meteorological radar, plant disease symptom pattern matching, official Data.gov.in / Agmarknet APMC market arrivals, regional cold storage directories, Custom Hiring Machinery rental workflows, and statutory 72-hour PMFBY crop loss claim-preparation assistance.

---

## 🏛️ System Architecture

RythuSetu adheres to a **deterministic rules-first, server-authoritative, auditable** architecture:
* **Server Authority**: Zero client-side authority for logins, roles, or claims. All authentication uses bcrypt (12 rounds) salted password hashing and cryptographic JSON Web Tokens (JWT).
* **Role-Based Access Control (RBAC)**: Distinct permissions for `farmer`, `data_verifier`, `support_agent`, `admin`, and `super_admin` roles, with endpoint-level dependency enforcement and BOLA/IDOR protection.
* **Persistent Relational Core**: Fully normalized relational schema with connection pooling, supporting PostgreSQL in production and SQLite in local development.
* **Immutable Audit Trail**: Every status transition is recorded in `ClaimEvent` audit logs, while security-relevant actions are tracked in `AuditLog`.
* **Transparent Data Provenance**: Every price, seed lot, and godown listing carries explicit trust and freshness labels (`VERIFIED`, `CURATED`, `ESTIMATED`, `OFFLINE`).

```text
               ┌────────────────────────────────────────────────────────┐
               │         RythuSetu Mobile-First React Interface         │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                  Bearer JWT (HS256)
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                 FastAPI Security Core                  │
               │   • Native BCrypt (12 rounds) Salted Hashing           │
               │   • Server-Side RBAC (Farmer / Verifier / Admin)       │
               │   • Security Headers (nosniff, DENY, XSS-block)        │
               │   • BOLA / IDOR Authorization Ownership Checks         │
               └───────────────────────────┬────────────────────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
        🌾 Cultivator Services                      🏢 Operations Console
      • Hyperlocal Weather Radar                  • Dossier Completeness Review
      • Vision AI Leaf Pathology                  • Evidence Photo Verification
      • e-NAM APMC Benchmark Rates                • Scale of Finance Valuation Check
      • Soil Health & NPK Dosage                  • Emergency Broadcast Advisories
      • PMFBY 72-hr Claim Dossier                 • Registered Cultivator Directory
      • Official Action Center (14447)            • Cold Storage Slot Oversight
      • WDRA Cold Godown Booking                  • Factory Delivery Authorizations
      • Factory Direct Gate Passes                • Upstream Mandi Ingestion Telemetry
      • Farm Machinery CHC Rentals                • Immutable System Audit Log
                     │                                           │
                     └─────────────────────┬─────────────────────┘
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │          Persistent Database (PostgreSQL / SQLite)     │
               │   • user_accounts          • crop_loss_reports         │
               │   • farmer_profiles        • claim_events              │
               │   • storage_facilities     • storage_bookings          │
               │   • machinery_listings     • machinery_bookings        │
               │   • direct_market_orders   • agri_khata_entries        │
               │   • seed_grievances        • broadcast_alerts          │
               │   • official_action_records• audit_logs                │
               └────────────────────────────────────────────────────────┘
```

---

## ✨ Core Production Engines

### 🌾 1. Cultivator & Smallholder Capabilities

* **📋 PMFBY 72-Hour Claim Preparation Assistant (`claims_engine.py`)**:
  * Calculates statutory 72-hour window compliance (`is_within_window`, remaining hours) from loss incident date.
  * Formats standard preparation dossiers with sequential tracking IDs (`RYTHU-CLAIM-2026-XXXX`).
  * Generates printable facilitation packets adhering to Ministry of Agriculture SLBC benchmarks.
  * Directs cultivators to official filing channels: `pmfby.gov.in` and Kisan Helpline `14447`.
  * Enables cultivators to store their self-entered official claim reference numbers and track status truthfully.

* **🏛️ Official Action Center (`action_center_engine.py`)**:
  * Centralizes statutory deadlines, official government portals, helplines, and preparation checklists.
  * Transparently declares that RythuSetu is an independent preparatory tool and not a government body.

* **📈 Live Mandi & APMC Price Intelligence (`mandi_engine.py`)**:
  * Real market arrivals, modal rates, and MSP comparison across major APMC yards (Guntur Mirchi Yard, Warangal Enamamula, Nizamabad, Anantapur, Khammam).
  * Labeled with explicit data provenance (`e-NAM APMC Benchmark Reference & CACP MSP 2025-26`, trust label: `CURATED` / `VERIFIER_ENTERED`).
  * Crop-specific variety tracking (e.g. Teja, 334/Sannam, Byadagi, Naatu for Red Chilli).

* **🏭 Zero-Broker Farm-to-Factory Direct Linkages (`direct_market_engine.py`)**:
  * Certified procurement contracts with direct spinning mills, dal processing units, and chilli cold complexes.
  * Generates persistent Factory Gate Entry Delivery Passes (`DIRECT-PASS-2026-XXXX`).

* **❄️ AC Godowns & Cold Storage Network (`storage_engine.py`)**:
  * WDRA-regulated cold storages with capacity tracking, temperature/humidity monitoring, and e-NWR warehouse pledge financing details.
  * Generates persistent storage reservation tokens (`RS-GODOWN-2026-XXXX`).

* **🚜 Custom Hiring Center (CHC) Farm Machinery (`machinery_engine.py`)**:
  * Verified tractor, agricultural spray drone, laser land leveler, and multi-crop thresher listings with instant booking tokens (`RS-MCH-XXXX`).

* **🌱 Anti-Spurious Seed & Lot Verifier (`seed_verifier_engine.py`)**:
  * Verifies seed batch lots against state certification standards and generates standardized grievance dossiers for submission to District Agriculture Directorates or National Consumer Helpline (`1915`).

* **💰 Digital Agri Khata Ledger (`khata_engine.py`)**:
  * Cost-of-cultivation templates, breakeven price calculation, and distress-sale prevention warnings backed by persistent ledger tables.

---

### 🏢 2. Operations & Data Verification Console

* **📊 Operations Dashboard (`AdminPortal.tsx`)**:
  * Authenticated dashboard protected by server-enforced internal staff JWT credentials (`data_verifier`, `admin`).
  * Aggregated smallholder count, pending dossier completeness reviews, and relief estimates.
* **🛡️ Crop Loss Dossier Quality Review**:
  * Multi-stage verification: `Intimation Registered` ➔ `Completeness Verified` ➔ `Preparation Ready` ➔ `Forwarded to Official Portal`.
  * Creates permanent, auditable `ClaimEvent` records for every state change.
* **🚨 Emergency Weather & Pest Epidemic Broadcaster**:
  * Dispatches verified departmental advisories across districts directly into cultivator dashboards.

---

## 🔒 Security Architecture

| Security Domain | Implementation |
| :--- | :--- |
| **Password Storage** | Native `bcrypt` with 12 rounds of salt. Zero plaintext passwords. |
| **Token Authentication** | Cryptographically signed JSON Web Tokens (`HS256`) with 24-hour expiration. |
| **Access Control (RBAC)**| Server-side dependencies (`require_admin`, `require_verifier`, `require_internal`, `require_farmer`). |
| **Privilege Escalation**| Public registration strictly enforces `role="farmer"`. Administrative and verifier roles require manual provisioning. |
| **HTTP Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`. |
| **CORS Protection** | Strict whitelist configured via `ALLOWED_ORIGINS` environment variable. |
| **Audit Trails** | All logins, failures, claim updates, and status transitions recorded in `audit_logs` table. |

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
* **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2.0
* **Authentication**: Native BCrypt, Python-JOSE (JWT)
* **Database**: PostgreSQL (Production) / SQLite (Development)
* **Testing**: Pytest, HTTPX TestClient

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/harsha20112986-droid/RythuSetu.git
cd RythuSetu
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install production dependencies
pip install -r requirements.txt

# Run automated tests
pytest test_features.py -v

# Start FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* Backend API: `http://127.0.0.1:8000`
* Interactive API Documentation: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Run TypeScript checks and build
npm run build

# Start Vite development server
npm run dev
```
* Frontend Web App: `http://localhost:5173/`

---

## 🧪 Automated Test Suite

RythuSetu includes 11 end-to-end integration and security test suites covering:
* Native bcrypt password hashing & constant-time verification
* Public registration role enforcement & privilege escalation blocking
* JWT access token generation, expiration, and `/auth/me` verification
* Server-side RBAC protection (401 anonymous, 403 farmer, 200 admin)
* PMFBY 72-hour reporting window compliance & database persistence
* Cold storage and direct market factory gate pass generation and tracking
* Anti-spurious seed verification and grievance persistence
* Digital Agri Khata breakeven calculations and ledger history

Run all tests with:
```bash
cd backend
pytest test_features.py -v
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
