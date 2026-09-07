from __future__ import annotations

from collections import defaultdict, deque
from threading import Lock

MAX_MESSAGES = 8

_store: dict[int, deque[dict[str, str]]] = defaultdict(
    lambda: deque(maxlen=MAX_MESSAGES)
)
_lock = Lock()


def get_history(farmer_id: int) -> list[dict[str, str]]:
    """Return recent chat messages for a farmer.

    This MVP memory is process-local and intentionally bounded. It resets when
    the backend process restarts, avoiding a database migration while keeping
    conversational context available during a session.
    """
    with _lock:
        return list(_store[farmer_id])


def add_exchange(farmer_id: int, question: str, answer: str) -> None:
    with _lock:
        history = _store[farmer_id]
        history.append({"role": "user", "content": question})
        history.append({"role": "assistant", "content": answer})


def clear_history(farmer_id: int) -> None:
    with _lock:
        _store.pop(farmer_id, None)
