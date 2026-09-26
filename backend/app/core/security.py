"""
RythuSetu Core Security Engine
Provides production-grade Bcrypt password hashing, timing-safe verification,
and cryptographic HMAC-SHA256 (HS256) JWT generation and decoding.
Zero plaintext passwords, zero plaintext legacy fallbacks, zero predictable tokens.
"""

from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings

BCRYPT_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hashes a password with native bcrypt using 12 salt rounds."""
    if not password:
        raise ValueError("Password cannot be empty")
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password strictly against a bcrypt hash in constant time.
    Zero plaintext compatibility paths. Rejects malformed or non-bcrypt hashes.
    """
    if not plain_password or not hashed_password:
        return False

    # Strictly require standard bcrypt hash prefix
    if not hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        return False

    pw_bytes = plain_password.encode("utf-8")[:72]
    try:
        return bcrypt.checkpw(pw_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None
) -> str:
    """
    Creates a signed access JWT with subject, role, claims, and short expiration.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.jwt_access_token_expire_minutes)
        
    to_encode.update({
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": settings.app_name,
    })
    
    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )


def create_refresh_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None
) -> str:
    """
    Creates a signed refresh JWT with 7-day expiration.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.jwt_refresh_token_expire_days)
        
    to_encode.update({
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": settings.app_name,
    })
    
    return jwt.encode(
        to_encode,
        settings.jwt_refresh_secret_key,
        algorithm=settings.jwt_algorithm
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decodes and cryptographically verifies access JWT signature and expiry.
    Raises JWTError if invalid, expired, or wrong token type.
    """
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
        issuer=settings.app_name,
    )
    if payload.get("type") != "access":
        raise JWTError("Invalid token type. Expected access token.")
    return payload


def decode_refresh_token(token: str) -> dict[str, Any]:
    """
    Decodes and cryptographically verifies refresh JWT signature and expiry.
    Raises JWTError if invalid, expired, or wrong token type.
    """
    payload = jwt.decode(
        token,
        settings.jwt_refresh_secret_key,
        algorithms=[settings.jwt_algorithm],
        issuer=settings.app_name,
    )
    if payload.get("type") != "refresh":
        raise JWTError("Invalid token type. Expected refresh token.")
    return payload
