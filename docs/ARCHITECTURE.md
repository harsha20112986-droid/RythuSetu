# RythuSetu Architecture

## Product flow

```text
Farmer
  ↓
Web / Mobile-first UI
  ↓
FastAPI API
  ↓
Verified data + deterministic rules
  ↓
Assessment / recommendation
  ↓
AI explanation + multilingual presentation
```

## Core principle

The system should be **data-first and rules-first**. AI explains verified information and assists the user; it should not invent scheme rules, compensation amounts, official declarations, or eligibility decisions.

## Planned modules

| Module | Responsibility |
|---|---|
| Farmer Profile | Location, crops, land/farm context |
| Climate Service | Weather history, forecast, risk indicators |
| Scheme Engine | Verified schemes, eligibility rules, source metadata |
| Benefit Estimator | Transparent, rule-based estimates |
| Crop Loss | Loss report, evidence, status tracking |
| AI Assistant | Retrieval + tool use + plain-language explanation |
| Language Layer | Telugu, English, Hindi and future voice support |
| Admin | Data freshness, scheme versions, review workflow |

## Trust layer

Every important recommendation should expose:

- Source / official reference
- Last verified date
- Effective date or scheme version when available
- Confidence or qualification notes
- Clear distinction between an estimate and an official decision
