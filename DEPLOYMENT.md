# RythuSetu — Production Deployment Guide

**Version:** 0.4.0  
**Effective Date:** 2026-09-26  
**Infrastructure Platforms:** Vercel (Edge Frontend) + Render (Cloud Web, Managed PostgreSQL, Cron Sync)  

---

## 1. System Architecture Overview

RythuSetu runs a decoupled cloud topology optimized for high availability, low latency across rural mobile networks, and automated daily agricultural market synchronizations.

```mermaid
flowchart TD
    subgraph Client["Farmer & Officer Devices"]
        Mobile["Mobile Web / PWA Browser"]
        Desktop["Desktop Browser (Admin)"]
    end

    subgraph VercelEdge["Vercel Edge Network (Global CDN)"]
        FrontendSPA["React 19 + TypeScript + Vite SPA<br/>(https://rythu-setu.vercel.app)"]
    end

    subgraph RenderCloud["Render Cloud Platform (Singapore / Oregon)"]
        BackendWeb["FastAPI Web Service<br/>(rythusetu-backend)"]
        CronSync["Nightly Ingestion Worker<br/>(rythusetu-mandi-sync)<br/>01:00 IST / 19:30 UTC"]
        PostgresDB[("Render Managed PostgreSQL<br/>(rythusetu-db)")]
        DiskStorage["Persistent Uploads<br/>(/backend/uploads)"]
    end

    subgraph ExternalServices["Government & Weather Upstream APIs"]
        OGD["Data.gov.in (OGD)<br/>APMC Mandi Daily Prices"]
        Agmarknet["Agmarknet Portal"]
        OpenMeteo["Open-Meteo<br/>Weather & Soil Grid"]
    end

    Mobile -->|HTTPS / WSS| FrontendSPA
    Desktop -->|HTTPS| FrontendSPA
    FrontendSPA -->|REST API / JSON| BackendWeb
    BackendWeb -->|SQLAlchemy / Psycopg 3| PostgresDB
    BackendWeb -->|Magic-Byte Storage| DiskStorage
    BackendWeb -->|REST Client| OpenMeteo
    CronSync -->|Scheduled Sync| OGD
    CronSync -->|Fallback Agmarknet| Agmarknet
    CronSync -->|Idempotent Upsert| PostgresDB
```

- **Frontend (Vercel):** Single Page Application (SPA) built with React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Vite. Leverages vendor chunk splitting (`vendor-react`, `vendor-lucide`) and route lazy-loading across 23 subcomponents.
- **Backend (Render):** FastAPI application with Pydantic validation, bcrypt security, RFC 7519 JWT auth, and unified PostgreSQL pooling via `psycopg` (binary v3) and SQLAlchemy 2.0.
- **Database (Render PostgreSQL):** Fully managed relational PostgreSQL instance storing users, PMFBY claims, APMC prices, MSP benchmarks, and audit logs.
- **Background Worker (Render Cron):** Standalone daily job executing `backend/cron_sync.py` at 01:00 IST (19:30 UTC) to ingest daily mandi transactions from `data.gov.in`.

---

## 2. Infrastructure Prerequisites

Before deploying, ensure you have:
1. A **GitHub account** with access to the `RythuSetu` repository.
2. A **Render account** ([render.com](https://render.com)) with an active team or personal workspace.
3. A **Vercel account** ([vercel.com](https://vercel.com)) connected to your GitHub account.
4. An **Open Government Data (OGD) API Key** from [data.gov.in](https://data.gov.in) (free registration under Ministry of Electronics & IT).
5. Optional: An **OpenAI API Key** if deploying generative natural-language Krishi Assistant speech-to-text features.

---

## 3. Step-by-Step Render Deployment (Backend & Database)

RythuSetu includes an Infrastructure-as-Code blueprint (`render.yaml`) that can provision the entire backend stack in one click, or services can be configured manually.

### Option A: Blueprint Provisioning (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **Blueprints** $\rightarrow$ **New Blueprint Instance**.
3. Connect the `RythuSetu` repository.
4. Render will parse `render.yaml` and display the resources to be created:
   - Database: `rythusetu-db` (PostgreSQL)
   - Web Service: `rythusetu-backend` (Python 3.11 FastAPI)
   - Cron Job: `rythusetu-mandi-sync` (Nightly sync worker)
   - Static Site (Optional fallback): `rythusetu-frontend`
5. Click **Apply**.
6. Render will automatically generate 64-character cryptographic values for `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY`, and `ADMIN_INITIAL_PASSWORD`.
7. Once provisioned, add your secret `DATA_GOV_API_KEY` under the Environment settings of `rythusetu-backend` and `rythusetu-mandi-sync`.

---

### Option B: Manual Service Configuration

If configuring services individually via the dashboard:

#### Step 1: Create Managed PostgreSQL Database
1. In Render Dashboard, click **New +** $\rightarrow$ **PostgreSQL**.
2. Settings:
   - **Name:** `rythusetu-db`
   - **Database:** `rythusetu`
   - **User:** `rythusetu`
   - **Region:** Singapore (`singapore`) or closest geographic region
   - **Plan:** Free (or Starter for non-expiring production workloads)
3. Click **Create Database**.
4. Once active, copy the **Internal Database URL** (`postgresql://rythusetu:...@rythusetu-db:5432/rythusetu`).

#### Step 2: Create Web Service (`rythusetu-backend`)
1. Click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Name:** `rythusetu-backend`
   - **Runtime:** `Python`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free (or Starter)
4. Environment Variables (click **Add Environment Variable**):
   - `PYTHON_VERSION`: `3.11.9`
   - `APP_ENV`: `production`
   - `DATABASE_URL`: Paste the Internal Database URL from Step 1 (change dialect prefix to `postgresql+psycopg://` if connecting via SQLAlchemy).
   - `JWT_SECRET_KEY`: Generate via `python -c "import secrets; print(secrets.token_hex(32))"`
   - `JWT_REFRESH_SECRET_KEY`: Generate via `python -c "import secrets; print(secrets.token_hex(32))"`
   - `ADMIN_INITIAL_PASSWORD`: Set a secure initial password ($\ge 12$ characters).
   - `ALLOWED_ORIGINS`: `https://rythu-setu.vercel.app,http://localhost:5173`
   - `DATA_GOV_API_KEY`: Your key from `data.gov.in`.
5. Click **Deploy Web Service**.

#### Step 3: Create Cron Job (`rythusetu-mandi-sync`)
1. Click **New +** $\rightarrow$ **Cron Job**.
2. Settings:
   - **Name:** `rythusetu-mandi-sync`
   - **Runtime:** `Python`
   - **Root Directory:** `backend`
   - **Schedule:** `30 19 * * *` (Runs daily at 19:30 UTC / 01:00 AM IST)
   - **Build Command:** `pip install -r requirements.txt`
   - **Command:** `python cron_sync.py`
   - **Plan:** Free
3. Environment Variables:
   - `APP_ENV`: `production`
   - `DATABASE_URL`: Same Internal Database URL as above.
   - `DATA_GOV_API_KEY`: Your key from `data.gov.in`.
   - `MANDI_SYNC_STATES`: `Telangana,Andhra Pradesh`
   - `MANDI_SYNC_LIMIT`: `1000`
4. Click **Save Changes**.

---

## 4. Step-by-Step Vercel Deployment (Frontend)

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select your `RythuSetu` repository and click **Import**.
4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Configure Environment Variables:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://rythusetu-backend.onrender.com` (Your Render Web Service URL)
6. Click **Deploy**.
7. Vercel will build the frontend, generate production hashed assets, and provide an edge URL (e.g., `https://rythu-setu.vercel.app`).
8. Verify single-page routing rewrite: Ensure `frontend/vercel.json` (or rewrite rules) directs all routes `/*` to `/index.html`.

---

## 5. Database Migration Procedure (Alembic)

RythuSetu uses Alembic for declarative schema versioning and schema migrations.

### Running Migrations in Production
To apply all pending database migrations against the production PostgreSQL instance:

```bash
# Set production DATABASE_URL locally or execute in the Render Shell
export DATABASE_URL="postgresql+psycopg://rythusetu:<password>@<render-postgres-host>/rythusetu"

cd backend

# 1. Inspect current applied revision
alembic current

# 2. Review all migration history
alembic history --verbose

# 3. Upgrade database to latest revision
alembic upgrade head
```

### Generating a New Migration
When models in `backend/app/models.py` are modified:
```bash
cd backend
alembic revision --autogenerate -m "add_support_tickets_table"
# Review generated script in alembic/versions/
alembic upgrade head
```

### Rollback Procedure
If a database migration causes errors during rollout:
```bash
# Roll back exactly one revision
alembic downgrade -1

# Or roll back to a specific target revision
alembic downgrade 1e1bebe17e7b
```

---

## 6. Environment Variables Reference

| Variable Name | Required | Applicable Target | Default / Format | Purpose |
|---|---|---|---|---|
| `APP_ENV` | **Yes** | Backend & Cron | `production` / `development` | Triggers strict fail-closed security and disables mock test fixtures in production. |
| `DATABASE_URL` | **Yes** | Backend & Cron | `postgresql+psycopg://...` | Full connection string for PostgreSQL in production or SQLite in development. |
| `JWT_SECRET_KEY` | **Yes** | Backend | 64-char hex string | Symmetric secret used to sign HS256 access tokens. Minimum 32 characters in production. |
| `JWT_REFRESH_SECRET_KEY` | **Yes** | Backend | 64-char hex string | Symmetric secret used to sign 7-day refresh tokens. Minimum 32 characters. |
| `JWT_ALGORITHM` | No | Backend | `HS256` | JWT signing algorithm. |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | No | Backend | `30` | Access token lifespan in minutes. |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | No | Backend | `7` | Refresh token lifespan in days. |
| `ADMIN_INITIAL_PASSWORD` | **Yes** | Backend | String ($\ge 10$ chars) | Bootstrap password for the initial administrator/AEO account (`admin`). |
| `ALLOWED_ORIGINS` | **Yes** | Backend | Comma-separated URLs | Strict CORS allowlist (e.g., `https://rythu-setu.vercel.app,http://localhost:5173`). |
| `DATA_GOV_API_KEY` | **Yes** (for live sync) | Backend & Cron | 40-char API key | Authentication key for data.gov.in Open Government Data (OGD) APMC market endpoints. |
| `MANDI_SYNC_STATES` | No | Cron Sync | `"Telangana,Andhra Pradesh"` | Target states for daily market price ingestion. |
| `MANDI_SYNC_LIMIT` | No | Cron Sync | `1000` | Upper limit of records ingested per state per cron execution. |
| `OPENAI_API_KEY` | No | Backend | `sk-...` | Optional API key for Krishi Assistant voice transcription and generative replies. |
| `OPENAI_MODEL` | No | Backend | `gpt-5.6-luna` | Model identifier used for generative assistant completions. |
| `WEATHER_API_KEY` | No | Backend | String | Optional proprietary weather provider key; falls back to Open-Meteo automatically. |
| `VITE_API_BASE_URL` | **Yes** | Frontend (Vercel) | `https://...onrender.com` | Base backend URL consumed by React client-side HTTP calls. |

---

## 7. Post-Deployment Verification & Health Checks

Verify your deployment using automated probes and health endpoints:

### 1. Shallow Liveness Check
Checks if the Python web process is responding:
```bash
curl -I https://rythusetu-backend.onrender.com/health
```
**Expected Response:**
```http
HTTP/2 200
content-type: application/json

{"status":"healthy","service":"rythusetu-backend"}
```

### 2. Deep Readiness Probe
Verifies database connectivity (`SELECT 1`), uploads filesystem writeability, and security configurations:
```bash
curl -i https://rythusetu-backend.onrender.com/readiness
```
**Expected Response:**
```http
HTTP/2 200
content-type: application/json

{
  "status": "ready",
  "service": "rythusetu-backend",
  "checks": {
    "database": {"status": "ok", "dialect": "postgresql"},
    "storage": {"status": "ok", "writable": true},
    "security": {"status": "ok", "environment": "production"}
  }
}
```

### 3. Mandi Pipeline Status Check
Verifies whether daily APMC market prices have been ingested or are running in baseline seeded mode:
```bash
curl -i https://rythusetu-backend.onrender.com/api/v1/mandi/prices?crop=Cotton&district=Warangal
```
Inspect the `provenance` block in the JSON payload:
- `source`: `"Government OGD / AGMARKNET"` or `"e-NAM APMC Daily Bulletin"`
- `freshness`: `"LATEST"`, `"RECENT"`, or `"DELAYED"`
- `verification_status`: `"OFFICIALLY_VERIFIED"` or `"BASELINE_SEEDED"`

---

## 8. Custom Domain & DNS Setup

To link a custom domain (e.g., `rythusetu.in` and `api.rythusetu.in`):

### Frontend Domain (Vercel)
1. In Vercel Project Settings $\rightarrow$ **Domains**, add `rythusetu.in` and `www.rythusetu.in`.
2. Configure DNS records with your registrar:
   - **A Record:** `@` $\rightarrow$ `76.76.21.21`
   - **CNAME Record:** `www` $\rightarrow$ `cname.vercel-dns.com`
3. Vercel automatically provisions and renews Let's Encrypt SSL certificates.

### Backend Custom Domain (Render)
1. In Render Dashboard $\rightarrow$ `rythusetu-backend` $\rightarrow$ **Settings** $\rightarrow$ **Custom Domains**.
2. Add `api.rythusetu.in`.
3. In your DNS provider, create a CNAME record:
   - **CNAME Record:** `api` $\rightarrow$ `rythusetu-backend.onrender.com`
4. Update `ALLOWED_ORIGINS` in Render and `VITE_API_BASE_URL` in Vercel to reflect the new custom domains.

---

## 9. Rollback & Disaster Recovery Playbook

If a critical defect is identified post-deployment:

### Immediate Frontend Rollback (Vercel)
1. Open Vercel Dashboard $\rightarrow$ **Deployments**.
2. Locate the previous stable build.
3. Click the three dots ($\dots$) and select **Instant Rollback**.
4. The edge CDN switches traffic to the previous bundle in under 5 seconds.

### Backend Rollback (Render)
1. Open Render Dashboard $\rightarrow$ `rythusetu-backend` $\rightarrow$ **Events**.
2. Click **Rollback to this deploy** on the last working release.
3. If the release introduced database schema incompatibilities, immediately run:
   ```bash
   alembic downgrade -1
   ```

---

## 10. Render Free Tier Operational Constraints

When deploying under Render's Free tier, be aware of the following technical limitations:

| Constraint | Limit | Impact on RythuSetu | Mitigation |
|---|---|---|---|
| **Web Service Spin-Down** | Inactivity timeout: 15 min | First farmer request after 15m idle may experience a **30–50s cold start**. | Frontend displays a warm-up banner on initial load; upgraded Starter plan ($7/mo) avoids spin-down. |
| **RAM Quota** | 512 MB per Web Service | Memory-intensive image manipulations in Crop Doctor could trigger OOM restart. | Crop Doctor images are capped at 8 MB and validated via streaming magic bytes; heavy ML runs offline. |
| **PostgreSQL Database** | 1 GB storage, 97 connection limit | Historical mandi records and image logs may fill storage over 6–12 months. | Weekly vacuuming; raw payloads in `mandi_raw_records` older than 90 days can be archived. |
| **Cron Execution Timeout** | 15 minutes max execution | Large bulk ingests spanning multiple states could timeout if API is slow. | `MANDI_SYNC_LIMIT` is capped at 1000 records per state to guarantee completion within 3 minutes. |
