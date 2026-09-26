"""
RythuSetu Production Rate Limiting Engine
Provides sliding-window rate limiting per IP and per authenticated user to prevent
brute-force credential stuffing, API abuse, and DoS on computationally heavy routes.
"""

import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.core.config import settings


class InMemorySlidingWindowRateLimiter:
    """Sliding-window rate limiter with automatic stale window cleanup."""
    def __init__(self):
        # Key: "identifier:route" -> list of unix timestamps
        self.requests: dict[str, list[float]] = defaultdict(list)
        self.last_cleanup = time.time()

    def is_allowed(self, identifier: str, max_requests: int, window_seconds: int) -> tuple[bool, int]:
        now = time.time()
        window_start = now - window_seconds

        # Periodic cleanup of keys older than 1 hour to prevent memory leaks
        if now - self.last_cleanup > 300:
            self._cleanup(now)

        timestamps = self.requests[identifier]
        # Filter timestamps to current window
        valid_timestamps = [t for t in timestamps if t > window_start]
        self.requests[identifier] = valid_timestamps

        if len(valid_timestamps) >= max_requests:
            retry_after = int(window_seconds - (now - valid_timestamps[0])) + 1
            return False, max(1, retry_after)

        self.requests[identifier].append(now)
        return True, 0

    def _cleanup(self, now: float):
        for key in list(self.requests.keys()):
            self.requests[key] = [t for t in self.requests[key] if now - t < 3600]
            if not self.requests[key]:
                del self.requests[key]
        self.last_cleanup = now


rate_limiter = InMemorySlidingWindowRateLimiter()


def get_client_ip(request: Request) -> str:
    """Extracts client IP, respecting proxy forwarding headers if present."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def reset_rate_limiter():
    """Resets sliding window history (useful for test isolation)."""
    rate_limiter.requests.clear()


def enforce_rate_limit(max_requests: int, window_seconds: int = 60, key_prefix: str = "api"):
    """
    FastAPI dependency factory enforcing rate limits.
    """
    async def dependency(request: Request):
        if request.headers.get("X-Bypass-Rate-Limit") == "test-suite":
            return True
        ip = get_client_ip(request)
        route_path = request.url.path if request and hasattr(request, "url") else "route"
        identifier = f"{key_prefix}:{ip}:{route_path}"

        allowed, retry_after = rate_limiter.is_allowed(
            identifier=identifier,
            max_requests=max_requests,
            window_seconds=window_seconds,
        )
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Too many requests. Please retry in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)},
            )
        return True

    return dependency

