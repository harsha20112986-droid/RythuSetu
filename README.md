# RythuSetu 🌾

**Your AI Bridge to Farmer Support**

RythuSetu is an AI-powered, multilingual farmer support platform focused on helping farmers understand climate risks, crop-loss support, government schemes, estimated benefits, and application guidance in simple language.

## Vision

Make agricultural support easier to discover and understand by connecting climate intelligence, verified scheme rules, explainable assistance, and farmer-friendly workflows in one place.

## Core Product

- Farmer profile and location-aware dashboard
- Climate monitoring and crop-risk assessment
- Explainable crop-loss risk detection
- Government scheme discovery and eligibility matching
- Estimated benefit calculator (not a guarantee of final payment)
- Guided crop-loss reporting workflow
- Application/document checklist and status tracking
- AI Krishi Assistant with multilingual text and voice support
- Telugu, English, and Hindi user experience
- Source-backed scheme information with verification dates

## Architecture Principle

RythuSetu uses a **rules/data-first + AI explanation** approach:

```text
Farmer Input
    ↓
Intent & Context
    ↓
Verified Data / Rules / Retrieval
    ↓
Deterministic Assessment
    ↓
AI Explanation
    ↓
Telugu / English / Hindi + Voice
```

The LLM will not be the source of truth for eligibility rules or benefit calculations.

## Planned Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Accessible, mobile-first UI

### Backend
- Python + FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic

### AI
- LLM-based assistant
- Retrieval-augmented scheme knowledge
- Deterministic eligibility/calculation engine
- Optional image-based crop damage module

### Data & Integrations
- Climate data APIs
- Verified government scheme sources
- Geospatial/location data
- Speech-to-text and text-to-speech

## Repository Structure

```text
RythuSetu/
├── frontend/          # Web application
├── backend/           # FastAPI application
├── data/              # Seed/reference datasets
├── docs/              # Architecture, product, and technical documentation
├── tests/             # Automated tests
├── .env.example
├── .gitignore
└── README.md
```

## Important Product Guardrails

- Show **estimated benefits**, not guaranteed compensation.
- Clearly distinguish model-generated risk assessment from official government declarations.
- Display data source and last-verified date for important scheme information.
- Avoid collecting sensitive identity information unless a real workflow requires it.
- Provide official links and helplines wherever applicable.

## Project Status

🚧 Initial foundation — implementation starts with the frontend/backend skeleton, core data model, and farmer journey.

## License

To be decided as the project matures.
