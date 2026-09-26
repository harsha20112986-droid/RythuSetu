# Changelog

All notable changes to the **RythuSetu** agricultural intelligence and market platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- WhatsApp & SMS automated alerts for high-risk pest advisories and PMFBY claim status.
- Farmer Producer Organization (FPO) collective bulk-selling aggregations.
- Direct UPI payment integration for machinery rental security deposits.

---

## [0.4.0] - 2026-09-26

### Added
- **Production Mandi Data Pipeline:** Built `MandiIngestionService` connecting to Government Open Data (`data.gov.in` / Agmarknet) featuring SSRF protection (domain allowlisting, private RFC 1918 block) and idempotent composite unique key upserts (`state`, `district`, `market`, `commodity`, `variety`, `grade`, `arrival_date`).
- **Official Statutory MSP Benchmarks:** Added `msp_benchmarks` table and seeder decoupling daily spot APMC prices from statutory CACP reference floors (15 CACP crops + 2 state MIS crops for Chilli and Turmeric).
- **24 Authentic APMC Baseline Seed Records:** Seeded verified baseline daily records across 8 major market yards: Guntur Mirchi Yard, Warangal Enumamula Yard, Khammam APMC, Nizamabad APMC, Suryapet APMC, Anantapur APMC, Kurnool APMC, and Mahbubnagar APMC.
- **Render PostgreSQL Auto-Wiring:** Automated database provisioning and credential wiring via `render.yaml` with unified connection pooling.
- **Nightly Mandi Ingestion Cron Service:** Configured scheduled background worker `rythusetu-mandi-sync` executing daily at 01:00 IST (19:30 UTC) via `cron_sync.py`.
- **OGD Ingestion Configuration:** Added `DATA_GOV_API_KEY` configuration enabling live daily APMC ingestion with graceful offline fallback.
- **Frontend Lazy-Loading:** Implemented `React.lazy` and `Suspense` splitting the monolithic SPA across 23 discrete route chunks to reduce mobile bandwidth load.
- **Vendor Chunk Splitting:** Configured Vite Rollup manual chunks isolating `vendor-react` (182 KB) and `vendor-lucide` (37 KB) from application business logic.
- **Truthful Provenance Display (`DataSourceBadge`):** Component rendering transparent data tiers: `GOVERNMENT_OGD`, `APMC_BULLETIN`, `BASELINE_SEEDED`, and `CURATED_REFERENCE`.
- **4-View Mandi Prices System:** Redesigned `MandiPrices.tsx` into a 4-tab user interface covering Varieties, Yards, MSP Price Comparison, and 7-day Historical Price Trends.
- **Dynamic Home Price Ticker:** Replaced static marketing tickers with reactive live-queried mandi data reflecting active session arrivals.
- **Admin Ingestion Telemetry Card:** Real-time visibility into recent ingestion runs, record counts (inserted, updated, rejected), error logs, and upstream timestamps.
- **MandiProvenance Data Contract:** Extended TypeScript schemas with `freshness` (`LATEST`, `RECENT`, `DELAYED`, `STALE`), `tier`, and `verification_status` metadata.
- **Notification System:** Added `Notification` relational model and user notification endpoints (`/api/v1/notifications`, `/api/v1/notifications/{id}/read`) for weather alerts and claim updates.
- **Support Ticket System:** Added support ticketing framework allowing registered cultivators to submit inquiries and receive officer assistance.
- **Extended Health Probes:** Added sub-service health checks `/health/mandi`, `/health/weather`, and `/health/ai` complementing shallow `/health` and deep `/readiness`.
- **Content Security Policy (CSP):** Strengthened `SecurityHeadersMiddleware` with strict CSP directives mitigating Cross-Site Scripting (XSS).
- **SEO & Search Indexing:** Added `robots.txt` disallowing `/api/` scraper crawling and injected meta tags (Open Graph, keywords, viewport optimization).
- **Legal Compliance Pages:** Created Privacy Policy and Terms of Service modal routes conforming to Indian Digital Personal Data Protection Act (DPDP Act 2023) standards.
- **Expanded Schemes Database:** Expanded `data/schemes.json` to 10 verified Central and State agricultural programs (PM-KISAN, Rythu Bharosa, PMFBY, Rythu Bima, SMAM, PMKSY, PKVY, etc.).
- **Production Documentation Suite:** Authored complete operational references: `PRODUCTION_GAP_REPORT.md`, `SECURITY.md`, `DEPLOYMENT.md`, `DATABASE.md`, `API.md`, `ADMIN_GUIDE.md`, and `FARMER_GUIDE.md`.

### Fixed
- **Crop Doctor Confidence Scores:** Removed fabricated `confidence_percent` (e.g. 94%, 92%) from offline fallback disease database; replaced with transparent clinical observation guidance.
- **Mandi Price Verification Default:** Fixed `MandiPriceRecord.verification_status` default in `models.py` from `"OFFICIALLY_VERIFIED"` to `"OFFICER_ENTERED"` preventing unreviewed records from displaying as government-verified.
- **Curated Fallback Provenance:** Fixed curated reference data returning `"OFFICIALLY_VERIFIED"`; now accurately tagged as `"CURATED_REFERENCE"`.
- **Misleading UI Copy:** Removed unsubstantiated "LIVE", "100% deterministic", and "Real-time" claims across `Home.tsx`, `Header.tsx`, and `HarvestShield.tsx`.
- **MSP Policy Statement:** Qualified "guaranteed by the Government" marketing text to accurately state that MSP represents the statutory reference floor price subject to fair average quality standards.
- **Baseline Seed Labeling:** Relabeled initial mock/seeded mandi records from `"OFFICIALLY_VERIFIED"` to `"BASELINE_SEEDED"`.
- **Seed Verifier Test Button:** Wrapped dev-only "SPURIOUS-9999-FAKE" test button inside `import.meta.env.DEV` to eliminate simulated test triggers in production builds.

---

## [0.3.0] - 2026-09-26

### Added
- **Alembic Migration Framework:** Configured `backend/alembic` with initial migration versions establishing `mandi_daily_prices`, `mandi_ingestion_runs`, `mandi_raw_records`, and `msp_benchmarks` tables.
- **Mandi Pipeline Test Suite:** Added 13 automated unit and integration tests (`test_mandi_pipeline.py`) validating SSRF defense, payload parsing, freshness calculation, and duplicate upsert handling (37/37 total backend tests passing).
- **Fail-Closed Security Configuration:** Implemented `validate_production_security()` in `config.py` enforcing minimum 32-character `JWT_SECRET_KEY` and 10-character `ADMIN_INITIAL_PASSWORD` in production.
- **IDOR / BOLA Authorization:** Secured cultivator resource mutations using `get_current_farmer_profile` and `get_farmer_or_404` verification dependencies.
- **Bcrypt Password Security:** Enforced constant-time bcrypt verification across all authentication workflows.
- **Render Infrastructure Blueprint:** Introduced `render.yaml` with automated secret generation (`generateValue: true`).

---

## [0.2.0] - 2026-09-08

### Added
- **Authentication & RBAC:** User accounts with JSON Web Tokens and four distinct roles: `farmer`, `officer`, `admin`, and `super_admin`.
- **Farmer Profile Management:** Landholding, soil classification, primary crop, and village-level location profiles.
- **Mandi Price Explorer:** Initial APMC spot rates search and filter interface.
- **Scheme Finder & Benefit Estimator:** Rule-based matching engine evaluating farmer eligibility across government welfare programs.
- **Crop Doctor (Computer Vision):** Leaf lesion analysis supporting camera upload and symptom-based diagnosis.
- **Krishi AI Assistant:** Context-aware multilingual chatbot responding to agricultural queries in English, Telugu, and Hindi.
- **Soil Health & Fertilizer Optimizer:** NPK ratio calculations tailored to crop variety and acreage.
- **Cold Storage Finder:** Warehouse and godown directory with capacity indicators and e-NWR pledge loan eligibility.
- **Machinery Rental Hub:** Custom Hiring Center (CHC) tractor and harvester booking module.
- **Direct Factory Market:** Zero-brokerage direct supply contracts with agro-processing plants and delivery gate pass generation.
- **PMFBY Crop Loss Reporter:** 72-hour statutory damage intimation reporter with timestamped photographic evidence upload.
- **Harvest Shield:** Weather risk and drying advisory engine evaluating rainfall probabilities before harvest.
- **Agri Khata Ledger:** Cost of cultivation tracking and breakeven sale price calculation.
- **Seed Verifier:** Barcode and lot number validator identifying certified authentic seed batches.
- **Multilingual Support:** Localized UI in English, Telugu (తెలుగు), and Hindi (हिन्दी).
- **Progressive Web App (PWA):** Web manifest and service worker configuration for offline mobile responsiveness.
