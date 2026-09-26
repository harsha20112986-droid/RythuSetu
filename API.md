# RythuSetu — Production API Reference Manual

**Version:** 0.4.0  
**Base URL:** `https://rythusetu-backend.onrender.com/api/v1`  
**Development URL:** `http://localhost:8000/api/v1`  
**Authentication Scheme:** Bearer JWT Token (`Authorization: Bearer <access_token>`)  
**Response Format:** JSON (UTF-8)  

---

## 1. Authentication & Security Headers

All protected endpoints require an RFC 7519 JWT Bearer access token passed via the HTTP `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rate Limiting Limits & Headers
When rate limits are exceeded, the API responds with HTTP 429 and the following headers:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
  "detail": "Rate limit exceeded. Please wait 60 seconds before retrying."
}
```

Rate limits enforced by IP / User token:
| Endpoint Group | Rate Limit Window |
|---|---|
| `/auth/register` | 5 requests / min |
| `/auth/login` | 10 requests / min |
| `/crop-loss` (Claim Filing) | 10 requests / min |
| `/crop-doctor/*` (Vision & Symptoms) | 15 requests / min |
| `/assistant/*` (Krishi Chat & Voice) | 15 requests / min |
| Standard Read Endpoints (`/mandi/*`, `/schemes`, etc.) | 60 requests / min |

### Standard Error Response Format
All errors return consistent JSON structures:
```json
{
  "detail": "Error description message explaining what failed."
}
```
Validation errors return Pydantic field details:
```json
{
  "detail": [
    {
      "loc": ["body", "crop"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## 2. Authentication Endpoints

### 2.1 Register New User
Creates a cultivator, data verifier, support agent, or administrative account. Valid roles: `farmer`, `data_verifier`, `support_agent`, `admin`, `super_admin`.

- **URL:** `POST /auth/register`
- **Rate Limit:** 5/min
- **Request Body:**
```json
{
  "username": "venkat_reddy",
  "password": "SecurePassword2026!",
  "name": "Venkat Reddy",
  "phone": "+91 98490 55443",
  "role": "farmer",
  "district": "Warangal",
  "state": "Telangana"
}
```
- **Response (HTTP 201):**
```json
{
  "status": "success",
  "message": "User registered successfully.",
  "user": {
    "id": 14,
    "username": "venkat_reddy",
    "name": "Venkat Reddy",
    "role": "farmer",
    "district": "Warangal",
    "state": "Telangana"
  }
}
```

### 2.2 Login (Obtain Tokens)
Authenticates credentials and returns JWT access and refresh tokens.

- **URL:** `POST /auth/login`
- **Rate Limit:** 10/min
- **Request Body:**
```json
{
  "username": "venkat_reddy",
  "password": "SecurePassword2026!"
}
```
- **Response (HTTP 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "refresh_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "user": {
    "id": 14,
    "username": "venkat_reddy",
    "name": "Venkat Reddy",
    "role": "farmer",
    "district": "Warangal",
    "farmer_profile_id": 105
  }
}
```

### 2.3 Current User Info
- **URL:** `GET /auth/me`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response (HTTP 200):**
```json
{
  "id": 14,
  "username": "venkat_reddy",
  "name": "Venkat Reddy",
  "role": "farmer",
  "phone": "+91 98490 55443",
  "district": "Warangal",
  "state": "Telangana",
  "farmer_profile_id": 105
}
```

---

## 3. Farmer Profiles

### 3.1 Get Authenticated Cultivator Profile
- **URL:** `GET /farmers/me`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response (HTTP 200):**
```json
{
  "id": 105,
  "user_id": 14,
  "name": "Venkat Reddy",
  "language": "Telugu",
  "state": "Telangana",
  "district": "Warangal",
  "mandal": "Narsampet",
  "village": "Chennaraopet",
  "crop": "Cotton",
  "season": "Kharif",
  "land_area_acres": 3.5,
  "created_at": "2026-09-26T12:00:00Z"
}
```

### 3.2 Create or Update Farm Profile
- **URL:** `POST /farmers` or `PUT /farmers/{farmer_id}`
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**
```json
{
  "name": "Venkat Reddy",
  "language": "Telugu",
  "state": "Telangana",
  "district": "Warangal",
  "mandal": "Narsampet",
  "village": "Chennaraopet",
  "crop": "Cotton",
  "season": "Kharif",
  "land_area_acres": 3.5
}
```
- **Response (HTTP 201/200):** Returns full updated `FarmerProfileResponse` object.

---

## 4. Mandi Intelligence & MSP Benchmarks

### 4.1 Daily APMC Mandi Spot Rates
Returns verified daily mandi transactions, arrival volumes, and recommendation tags.

- **URL:** `GET /mandi/prices`
- **Query Parameters:**
  - `crop` (required, e.g. `Cotton`, `Red Chilli`, `Turmeric`, `Paddy / Rice`)
  - `district` (optional, e.g. `Warangal`, `Guntur`)
  - `market` (optional, e.g. `Warangal Enumamula Yard`)
- **Response (HTTP 200):**
```json
{
  "crop": "Cotton",
  "district": "Warangal",
  "market": "Warangal Enumamula Yard",
  "prices": [
    {
      "id": 4,
      "crop": "Cotton",
      "variety": "Bunny / Brahma",
      "telugu_name": "పత్తి",
      "grade_tag": "FAQ",
      "market": "Warangal Enumamula Yard",
      "district": "Warangal",
      "state": "Telangana",
      "min_price": 7250.0,
      "max_price": 7850.0,
      "modal_price": 7550.0,
      "arrival_quantity_qtl": 380.0,
      "action": "SELL",
      "recommendation": "Firm mill demand; modal rate above MSP benchmark.",
      "effective_date": "2026-09-26",
      "verification_status": "OFFICIALLY_VERIFIED"
    }
  ],
  "provenance": {
    "source": "Government OGD / AGMARKNET",
    "tier": "GOVERNMENT_OGD",
    "freshness": "LATEST",
    "last_synced_at": "2026-09-26T19:30:00Z",
    "record_count": 1
  }
}
```

### 4.2 Historical Yard Rates (7 to 30 Days)
- **URL:** `GET /mandi/history`
- **Query Parameters:** `crop=Cotton&district=Warangal&days=7`
- **Response (HTTP 200):**
```json
{
  "crop": "Cotton",
  "district": "Warangal",
  "history": [
    {"date": "2026-09-26", "modal_price": 7550.0, "arrival_qtl": 380.0},
    {"date": "2026-09-25", "modal_price": 7480.0, "arrival_qtl": 360.0},
    {"date": "2026-09-24", "modal_price": 7420.0, "arrival_qtl": 345.0}
  ]
}
```

### 4.3 Mandi Yard Comparisons (Cross-Market Spread)
- **URL:** `GET /mandi/compare?crop=Red Chilli&state=Andhra Pradesh`
- **Response (HTTP 200):**
```json
{
  "crop": "Red Chilli",
  "state": "Andhra Pradesh",
  "yards": [
    {
      "market": "Guntur Mirchi Yard",
      "variety": "Teja / S17",
      "modal_price": 22400.0,
      "arrival_qtl": 420.0,
      "spread_vs_state_avg": "+1800.0"
    }
  ]
}
```

### 4.4 7-Day Trend Analytics
- **URL:** `GET /mandi/trend?commodity=Turmeric&district=Nizamabad&days=7`
- **Response (HTTP 200):**
```json
{
  "commodity": "Turmeric",
  "district": "Nizamabad",
  "trend_direction": "UPWARD",
  "percent_change_7d": 4.2,
  "current_modal_price": 14700.0,
  "points": [
    {"arrival_date": "2026-09-20", "modal_price": 14100.0},
    {"arrival_date": "2026-09-26", "modal_price": 14700.0}
  ]
}
```

### 4.5 Statutory MSP Reference Benchmarks
- **URL:** `GET /mandi/msp?commodity=Cotton`
- **Response (HTTP 200):**
```json
{
  "commodity": "Cotton",
  "benchmarks": [
    {
      "variety": "Medium Staple",
      "marketing_year": "2025-26",
      "season": "Kharif",
      "price_per_quintal": 7521.0,
      "government_source": "Commission for Agricultural Costs & Prices (CACP) / CCEA",
      "effective_date": "2025-10-01"
    },
    {
      "variety": "Long Staple",
      "marketing_year": "2025-26",
      "season": "Kharif",
      "price_per_quintal": 7921.0,
      "government_source": "Commission for Agricultural Costs & Prices (CACP) / CCEA",
      "effective_date": "2025-10-01"
    }
  ]
}
```

---

## 5. Weather, Climate & Harvest Shield

### 5.1 Weather & Climate Risk Assessment
- **URL:** `GET /climate/risk?state=Telangana&district=Warangal&crop=Cotton`
- **Response (HTTP 200):**
```json
{
  "district": "Warangal",
  "state": "Telangana",
  "crop": "Cotton",
  "temperature_c": 31.4,
  "humidity_rh": 78,
  "rain_probability_percent": 35,
  "risk_level": "MODERATE",
  "advisory": "Intermittent showers expected. Postpone foliar insecticide sprays until canopy dries."
}
```

### 5.2 Harvest Shield (Drying & Sowing Window)
- **URL:** `GET /weather/harvest-shield?district=Warangal&crop=Paddy&days_to_harvest=4`
- **Response (HTTP 200):**
```json
{
  "harvest_safety_index": "SAFE",
  "window_favorable": true,
  "rain_risk_next_72h": "LOW (15%)",
  "grain_moisture_guidance": "Ideal harvesting conditions. Ensure threshing yard tarpaulins are accessible."
}
```

---

## 6. Government Schemes & Benefits

### 6.1 Scheme Matching
- **URL:** `GET /schemes?state=Telangana&crop=Cotton&season=Kharif`
- **Response (HTTP 200):**
```json
{
  "state": "Telangana",
  "crop": "Cotton",
  "season": "Kharif",
  "disclaimer": "Matches are guidance only. Official eligibility requires department verification.",
  "schemes": [
    {
      "id": "pm-kisan",
      "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      "annual_benefit_inr": 6000,
      "category": "Direct Income Support",
      "portal_url": "https://pmkisan.gov.in"
    },
    {
      "id": "rythu-bharosa-ts",
      "name": "Telangana Rythu Bharosa",
      "annual_benefit_inr": 15000,
      "category": "State Investment Support",
      "portal_url": "https://agri.telangana.gov.in"
    }
  ]
}
```

### 6.2 Benefit Calculator
- **URL:** `GET /benefits/estimate?state=Telangana&crop=Cotton&season=Kharif&land_area_acres=3.5`
- **Response (HTTP 200):**
```json
{
  "total_estimated_annual_support_inr": 58500.0,
  "breakdown": [
    {"scheme": "PM-KISAN", "amount_inr": 6000.0},
    {"scheme": "Telangana Rythu Bharosa", "amount_inr": 52500.0}
  ]
}
```

---

## 7. Crop Doctor (Vision Diagnosis & Symptoms)

### 7.1 Image Analysis (Magic-Byte Validated)
Uploads leaf photo for lesion analysis.

- **URL:** `POST /crop-doctor/analyze`
- **Rate Limit:** 15/min
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `image` (binary file: authentic JPEG, PNG, or WebP $\le 8$ MB)
  - `crop` (string, e.g. `Cotton`)
  - `language` (string: `en`, `te`, `hi`)
- **Response (HTTP 200):**
```json
{
  "diagnosis": "Bacterial Leaf Blight (Xanthomonas citri)",
  "identified_crop": "Cotton",
  "severity": "Moderate",
  "symptoms_observed": "Water-soaked angular leaf lesions with yellow halos.",
  "clinical_guidance": "Recommended immediate spray: Copper Oxychloride 50% WP (30g) + Streptocycline (1g) in 10L water. Avoid flood irrigation to limit pathogen spread.",
  "consult_expert_required": false
}
```

### 7.2 Symptom-Based Diagnostic Heuristic
- **URL:** `POST /crop-doctor/diagnose-symptoms`
- **Request Body:**
```json
{
  "crop": "Chilli",
  "plant_part": "Leaves",
  "symptoms": "Upward leaf curling, stunted canopy, brittle foliage",
  "language": "English"
}
```
- **Response (HTTP 200):**
```json
{
  "diagnosis": "Chilli Thrips & Yellow Mite Infestation (Murda Complex)",
  "management": "Spray Diafenthiuron 50% WP @ 1.25g/L or Spinetoram 11.7% SC @ 1ml/L. Install blue and yellow sticky traps."
}
```

---

## 8. Crop Loss Assistant & Claims Preparation

### 8.1 File Crop Loss Intimation (72-Hour Statutory Window)
- **URL:** `POST /crop-loss`
- **Rate Limit:** 10/min
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `farmer_id` (integer: `105`)
  - `crop` (`Cotton`)
  - `damage_type` (`Localized Hailstorm / Inundation`)
  - `loss_date` (`2026-09-25`)
  - `affected_area_acres` (`2.5`)
  - `damage_percent` (`65.0`)
  - `survey_number` (`142/2A`, optional)
  - `village` (`Duggondi`, optional)
  - `mandal` (`Narsampet`, optional)
  - `description` (`Severe localized inundation submerged field for 36 hours.`)
  - `evidence` (optional photographic evidence)
- **Response (HTTP 201):**
```json
{
  "reference_number": "RYTHU-CLAIM-2026-1044",
  "status": "PREPARATION_READY",
  "is_within_window": true,
  "submission_timestamp": "2026-09-26T08:30:00Z",
  "message": "Crop loss intimation dossier prepared successfully. Proceed to pmfby.gov.in or call 14447 to complete filing."
}
```

### 8.2 Validate Dossier Completeness
- **URL:** `POST /claims/validate-completeness`
- **Request Body:**
```json
{
  "farmer_id": 105,
  "crop": "Cotton",
  "damage_type": "Inundation / Submergence",
  "loss_date": "2026-09-25",
  "affected_area_acres": 2.5,
  "damage_percent": 65.0,
  "survey_number": "142/2A",
  "village": "Duggondi",
  "has_photo_evidence": true
}
```
- **Response (HTTP 200):** Returns completeness score, missing fields, recommendations, and statutory window status.

### 8.3 Record Farmer Self-Entered Official Status
- **URL:** `POST /claims/{claim_id}/self-status`
- **Request Body:**
```json
{
  "farmer_id": 105,
  "official_reference_number": "PMFBY/2026/TG/984210",
  "farmer_self_status": "SUBMITTED_OFFICIAL",
  "farmer_notes": "Filed at Warangal MeeSeva Center counter 3"
}
```
- **Response (HTTP 200):** Acknowledges saved self-managed reference ID.

### 8.4 Track Claim Status Lifecycle
- **URL:** `GET /claims/status/{reference_number}`
- **Response (HTTP 200):**
```json
{
  "reference_number": "RYTHU-CLAIM-2026-1044",
  "farmer_name": "Venkat Reddy",
  "crop": "Cotton",
  "status": "Preparation Ready",
  "damage_percent": 65.0,
  "history": [
    {"event": "Submitted", "timestamp": "2026-09-26T08:30:00Z", "actor": "Farmer"},
    {"event": "Completeness Verified", "timestamp": "2026-09-26T14:15:00Z", "actor": "Data Verifier", "notes": "Completeness verified. Pack prepared for farmer submission at pmfby.gov.in."}
  ]
}
```

---

## 9. Storage, Machinery & Direct Market Linkages

### 9.1 Cold Storage Directory & Booking
- **List Facilities:** `GET /storage/cold-godowns?district=Guntur&state=Andhra Pradesh`
- **Book Storage Space:** `POST /storage/book-space`
  - Body: `{"facility_id": "cs-gtr-01", "commodity": "Red Chilli", "bags_count": 100, "duration_months": 6}`
- **Response (HTTP 201):** Returns `booking_token: "CS-BOOK-2026-904"`, total rent quotation, and e-NWR pledge loan eligibility.

### 9.2 Custom Hiring Center (CHC) Machinery
- **List Equipment:** `GET /machinery/rentals?district=Warangal&category=Tractor`
- **Book Machinery:** `POST /machinery/book`
  - Body: `{"machinery_id": "mch-wgl-01", "acres_or_hours": 4.0, "required_date": "2026-09-28"}`
- **Response (HTTP 201):** Returns `booking_token: "MCH-BOOK-2026-302"`, operator contact info, and total estimated dispatch fee.

### 9.3 Direct Factory Supply & Gate Pass
- **List Verified Agro-Processing Factories:** `GET /direct-market/factories?crop=Cotton`
- **Issue Gate Pass:** `POST /direct-market/delivery-pass`
  - Body: `{"factory_id": "fact-wgl-01", "crop": "Cotton", "allocated_quantity_qtl": 25.0, "delivery_date": "2026-09-29"}`
- **Response (HTTP 201):** Returns `pass_number: "PASS-DM-2026-401"`, agreed spot rate per quintal, and zero-brokerage savings estimate.

---

## 10. Farm Ledger (Agri Khata)

### 10.1 Cost Template & Breakeven Calculator
- **Template:** `GET /khata/template?crop=Cotton`
- **Calculate Breakeven:** `POST /khata/calculate-breakeven`
  - Body:
```json
{
  "farmer_name": "Venkat Reddy",
  "crop": "Cotton",
  "acres": 3.0,
  "total_yield_quintals": 24.0,
  "expenses": {
    "seeds": 6400,
    "land_preparation": 9000,
    "fertilizers_manure": 14500,
    "crop_protection": 8200,
    "labor_and_picking": 28000,
    "machinery_diesel": 7500,
    "miscellaneous": 3000
  },
  "expected_market_price_per_qtl": 7500.0
}
```
  - **Response (HTTP 200):**
```json
{
  "total_cultivation_cost": 76600.0,
  "breakeven_price_per_qtl": 3191.67,
  "expected_gross_revenue": 180000.0,
  "net_profit_projected": 103400.0,
  "margin_percent": 57.44
}
```

---

## 11. Krishi Assistant (AI Chat & Audio)

### 11.1 Chat Query
- **URL:** `POST /assistant/chat`
- **Rate Limit:** 15/min
- **Request Body:**
```json
{
  "farmer_id": 105,
  "question": "What is the current Warangal mandi price for Cotton?",
  "language": "English"
}
```
- **Response (HTTP 200):**
```json
{
  "reply": "Warangal Enumamula Yard currently reports Cotton (Bunny/Brahma) modal price at ₹7,550 per quintal, which is above the Kharif MSP benchmark of ₹7,521.",
  "language": "English"
}
```

### 11.2 Voice Audio Transcription
- **URL:** `POST /assistant/transcribe`
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `audio` (WebM/Ogg audio binary $\le 10$ MB), `language` (`te`, `en`, `hi`)
- **Response (HTTP 200):** Returns transcribed text string.

---

## 12. Notifications & Support Tickets

### 12.1 User Notifications
- **List:** `GET /notifications`
- **Mark As Read:** `POST /notifications/{notification_id}/read`

### 12.2 Support Inquiries
- **Submit Ticket:** `POST /support/tickets`
  - Body: `{"subject": "Discrepancy in PMFBY intimation receipt", "category": "claims", "message": "My intimation timestamp was within 48h but shows 73h in status."}`
- **Response (HTTP 201):** Returns ticket tracking ID and assigned support agent acknowledgment.

---

## 13. Operations & Data Verification Endpoints

*(Requires Bearer token with role `data_verifier`, `support_agent`, `admin`, or `super_admin`)*

| Endpoint | Method | Role Required | Description |
|---|---|---|---|
| `/admin/dashboard-stats` | `GET` | Verifier+ | Overall farmer counts, open claims, today's arrivals, active alerts. |
| `/admin/farmers` | `GET` | Verifier+ | Registered cultivators listing with acreage and district filters. |
| `/admin/users` | `GET` | Admin | System user accounts and role assignments. |
| `/admin/all-claims` | `GET` | Verifier+ | Complete PMFBY claims roster with review actions. |
| `/admin/claims/{id}/update` | `POST` | Verifier+ | Review claim dossier status (`VERIFIED`, `PREPARATION_READY`, `FLAGGED_INCOMPLETE`). |
| `/admin/broadcast-alert` | `POST` | Verifier+ | Post official emergency advisory for a specific district and crop. |
| `/admin/broadcast-alerts` | `GET` | Verifier+ | Retrieve active broadcast advisories. |
| `/admin/mandi/prices` | `GET` / `POST` | Verifier+ | Review or manually enter spot APMC market rates. |
| `/admin/mandi/prices/{id}` | `PUT` / `DELETE` | Verifier+ | Modify or deactivate a specific APMC spot record. |
| `/admin/mandi/sync` | `POST` | Admin | Trigger manual upstream mandi sync from `data.gov.in`. |
| `/admin/mandi/ingestion-status` | `GET` | Verifier+ | Ingestion run telemetry, record counts, and error diagnostics. |

---

## 14. Official Action Center Endpoints

### 14.1 List Statutory Action Items & Checklists
- **URL:** `GET /action-center/items?farmer_id=105`
- **Response (HTTP 200):** Returns array of action items with preparation checklists, deadlines, and official portal URLs.

### 14.2 Save Farmer's Self-Tracked Official Reference
- **URL:** `POST /action-center/save-reference`
- **Request Body:**
```json
{
  "farmer_id": 105,
  "action_key": "pmfby_loss_intimation",
  "category": "crop_loss",
  "title": "PMFBY Crop Loss Intimation",
  "official_reference_number": "PMFBY/2026/TG/984210",
  "farmer_self_status": "SUBMITTED_OFFICIAL",
  "notes": "Filed at Warangal MeeSeva center counter 3"
}
```
- **Response (HTTP 200):** Confirms saved reference record.

---

## 15. System Probes & Health Endpoints

### 14.1 Shallow Liveness Probe
- **URL:** `GET /health`
- **Response (HTTP 200):** `{"status": "healthy", "service": "rythusetu-backend"}`

### 14.2 Deep Readiness Probe
- **URL:** `GET /readiness`
- **Response (HTTP 200):**
```json
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

### 14.3 Subsystem Health Probes
- `GET /health/mandi`: Returns ingestion pipeline connectivity, last sync timestamp, and record volume.
- `GET /health/weather`: Returns Open-Meteo endpoint response latency and grid status.
- `GET /health/ai`: Checks LLM endpoint reachability and voice transcription status.
- `GET /api/v1/status`: API engine build version and service name.
