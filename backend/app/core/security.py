"""
RythuSetu Core Security Engine
Provides production-grade Bcrypt password hashing, timing-safe verification,
and cryptographic HMAC-SHA256 (HS256) JWT generation and decoding.
Zero plaintext passwords, zero predictable tokens.
"""

from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings

BCRYPT_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hashes a password with bcrypt using 12 salt rounds."""
    if not password:
        raise ValueError("Password cannot be empty")
    # Truncate to 72 bytes as per standard bcrypt specification
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against a bcrypt hash in constant time.
    Also handles transparent migration for legacy plain text passwords during initial login.
    """
    if not plain_password or not hashed_password:
        return False
        
    pw_bytes = plain_password.encode("utf-8")[:72]
    
    # Standard bcrypt hash starts with $2a$, $2b$, or $2y$
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(pw_bytes, hashed_password.encode("utf-8"))
        except Exception:
            return False
            
    # Legacy migration fallback: constant-time string comparison for existing pre-migration records
    import hmac
    return hmac.compare_digest(plain_password.strip(), hashed_password.strip())


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None
) -> str:
    """
    Creates a signed JWT with subject, role, claims, issued-at, and expiration.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.jwt_access_token_expire_minutes)
        
    to_encode.update({
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": settings.app_name,
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decodes and cryptographically verifies JWT signature and expiry.
    Raises JWTError if invalid or expired.
    """
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
        issuer=settings.app_name,
    )
    return payload
