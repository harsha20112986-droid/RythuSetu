"""
RythuSetu Backend Application Package
Exports 'app' so both 'uvicorn app.main:app' and 'uvicorn app:app' work seamlessly.
"""
from app.main import app

__all__ = ["app"]
