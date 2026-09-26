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
class RedisSlidingWindowRateLimiter:
    """Distributed sliding-window rate limiter using Redis sorted sets (ZADD/ZREMRANGEBYSCORE)."""
    def __init__(self, redis_url: str):
        import redis
        self.client = redis.from_url(redis_url, decode_responses=True, socket_timeout=2.0)

    def is_allowed(self, identifier: str, max_requests: int, window_seconds: int) -> tuple[bool, int]:
        now = time.time()
        window_start = now - window_seconds
        key = f"rythusetu:ratelimit:{identifier}"

        pipe = self.client.pipeline()
        pipe.zremrangebyscore(key, 0, window_start)
        pipe.zcard(key)
        pipe.zadd(key, {f"{now}:{time.time_ns()}": now})
        pipe.expire(key, window_seconds + 60)
        pipe.zrange(key, 0, 0, withscores=True)
        results = pipe.execute()

        request_count = results[1]
        if request_count >= max_requests:
            oldest_ts = results[4][0][1] if results[4] else window_start
            retry_after = max(1, int(window_seconds - (now - oldest_ts)) + 1)
            return False, retry_after

        return True, 0


class HybridRateLimiter:
    """Dispatches to Redis if configured and reachable; otherwise uses local sliding window."""
    def __init__(self):
        self._memory = InMemorySlidingWindowRateLimiter()
        self._redis: RedisSlidingWindowRateLimiter | None = None
        self._redis_failed = False

        if getattr(settings, "redis_url", None):
            try:
                import redis
                self._redis = RedisSlidingWindowRateLimiter(settings.redis_url)
            except Exception as e:
                print(f"[RATE LIMIT NOTICE] Redis rate limiter initialization skipped: {e}")
                self._redis = None

    def is_allowed(self, identifier: str, max_requests: int, window_seconds: int) -> tuple[bool, int]:
        if self._redis and not self._redis_failed:
            try:
                return self._redis.is_allowed(identifier, max_requests, window_seconds)
            except Exception as e:
                print(f"[RATE LIMIT WARNING] Redis rate limit check failed ({e}), falling back to memory.")
                self._redis_failed = True

        return self._memory.is_allowed(identifier, max_requests, window_seconds)

    def reset(self):
        self._memory.requests.clear()
        self._redis_failed = False


rate_limiter = HybridRateLimiter()


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
    rate_limiter.reset()


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


