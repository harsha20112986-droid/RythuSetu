from __future__ import annotations

from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import settings

router = APIRouter(prefix="/api/v1/assistant", tags=["assistant"])

_ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/webm;codecs=opus",
    "audio/ogg",
    "audio/mp4",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
}

_LANGUAGE_MAP = {
    "en": "en",
    "english": "en",
    "te": "te",
    "telugu": "te",
    "hi": "hi",
    "hindi": "hi",
}


@router.post("/transcribe")
async def transcribe_assistant_audio(
    language: str = Form(default="en"),
    audio: UploadFile = File(...),
):
    """Transcribe a short farmer voice question using OpenAI speech-to-text."""
    if not settings.openai_api_key:
        raise HTTPException(
            status_code=503,
            detail="Voice transcription is not configured. Add OPENAI_API_KEY to backend/.env.",
        )

    content_type = (audio.content_type or "").split(";")[0].lower()
    if content_type not in {item.split(";")[0] for item in _ALLOWED_AUDIO_TYPES}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format. Please record using the browser microphone.",
        )

    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio recording is empty.")

    if len(audio_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio recording must be 10 MB or smaller.")

    language_code = _LANGUAGE_MAP.get(language.strip().lower(), "en")

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.openai_api_key)

        filename = audio.filename or "speech.webm"
        file_tuple = (
            filename,
            BytesIO(audio_bytes),
            content_type or "audio/webm",
        )

        result = client.audio.transcriptions.create(
            model="gpt-4o-mini-transcribe",
            file=file_tuple,
            language=language_code,
        )

        text = (getattr(result, "text", "") or "").strip()

        if not text:
            raise HTTPException(
                status_code=422,
                detail="No speech was recognized. Please speak clearly and try again.",
            )

        return {
            "text": text,
            "language": language_code,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Voice transcription service unavailable: {exc}",
        ) from exc
