# RythuSetu Backend

FastAPI service for farmer profiles, climate-risk assessment, scheme discovery, benefit estimation, crop-loss reporting, and the AI assistant.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://localhost:8000
Docs: http://localhost:8000/docs
Health: http://localhost:8000/health
