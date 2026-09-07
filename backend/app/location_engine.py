"""
RythuSetu Official Government LGD (Local Government Directory) Location Engine
Contains all 28 districts & 688 mandals & 17,954 villages in Andhra Pradesh
Contains all 33 districts & 617 mandals & 11,285 villages in Telangana
"""

import os
import sqlite3
import csv
from typing import List, Dict, Optional, Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
DB_PATH = os.path.join(DATA_DIR, "locations.db")


def ensure_database():
    """Ensure SQLite database exists and is populated."""
    if os.path.exists(DB_PATH) and os.path.getsize(DB_PATH) > 1000000:
        return

    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        district_code TEXT,
        mandal TEXT NOT NULL,
        mandal_code TEXT,
        village TEXT NOT NULL,
        village_native TEXT,
        village_code TEXT,
        pincode TEXT,
        category TEXT,
        status TEXT
    )
    """)

    files = [
        ("Andhra Pradesh", os.path.join(DATA_DIR, "andhra_pradesh_villages.csv")),
        ("Telangana", os.path.join(DATA_DIR, "telangana_villages.csv"))
    ]

    for state_name, file_path in files:
        if not os.path.exists(file_path):
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            batch = []
            for row in reader:
                batch.append((
                    state_name,
                    row["District"].strip(),
                    row.get("District Code", "").strip(),
                    row["Mandal"].strip(),
                    row.get("Mandal Code", "").strip(),
                    row["Village"].strip(),
                    row.get("Village (Native)", "").strip(),
                    row.get("Village Code", "").strip(),
                    row.get("Pincode", "").strip(),
                    row.get("Category", "").strip(),
                    row.get("Status", "").strip(),
                ))
                if len(batch) >= 5000:
                    cursor.executemany("""
                    INSERT INTO locations (
                        state, district, district_code, mandal, mandal_code,
                        village, village_native, village_code, pincode, category, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, batch)
                    batch = []
            if batch:
                cursor.executemany("""
                INSERT INTO locations (
                    state, district, district_code, mandal, mandal_code,
                    village, village_native, village_code, pincode, category, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, batch)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state_district ON locations (state, district)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state_district_mandal ON locations (state, district, mandal)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_village_name ON locations (village)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_pincode ON locations (pincode)")
    conn.commit()
    conn.close()


def get_db_connection() -> sqlite3.Connection:
    ensure_database()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_states() -> List[str]:
    """Get list of supported states."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT state FROM locations ORDER BY state")
    rows = cursor.fetchall()
    conn.close()
    return [r["state"] for r in rows] or ["Andhra Pradesh", "Telangana"]


def get_districts(state: str) -> List[str]:
    """Get all official districts for a state."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT DISTINCT district FROM locations WHERE LOWER(state) = LOWER(?) ORDER BY district",
        (state,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [r["district"] for r in rows]


def get_mandals(state: str, district: str) -> List[str]:
    """Get all official mandals for a district."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT DISTINCT mandal FROM locations WHERE LOWER(state) = LOWER(?) AND LOWER(district) = LOWER(?) ORDER BY mandal",
        (state, district)
    )
    rows = cursor.fetchall()
    conn.close()
    return [r["mandal"] for r in rows]


def get_villages(state: str, district: str, mandal: str) -> List[Dict[str, Any]]:
    """Get all official villages for a mandal with native name, pincode, and LGD code."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT village, village_native, pincode, village_code, category, status
        FROM locations
        WHERE LOWER(state) = LOWER(?) AND LOWER(district) = LOWER(?) AND LOWER(mandal) = LOWER(?)
        ORDER BY village
        """,
        (state, district, mandal)
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "village": r["village"],
            "native": r["village_native"] or "",
            "pincode": r["pincode"] or "",
            "code": r["village_code"] or "",
            "category": r["category"] or "",
            "status": r["status"] or "Inhabited"
        }
        for r in rows
    ]


def search_locations(query: str, state: Optional[str] = None, limit: int = 30) -> List[Dict[str, Any]]:
    """Search villages, mandals, or pincodes."""
    conn = get_db_connection()
    cursor = conn.cursor()
    q = f"%{query.strip()}%"
    
    if state:
        cursor.execute(
            """
            SELECT state, district, mandal, village, village_native, pincode, village_code
            FROM locations
            WHERE LOWER(state) = LOWER(?) AND (
                LOWER(village) LIKE LOWER(?) OR
                village_native LIKE ? OR
                LOWER(mandal) LIKE LOWER(?) OR
                pincode LIKE ?
            )
            ORDER BY village
            LIMIT ?
            """,
            (state, q, q, q, q, limit)
        )
    else:
        cursor.execute(
            """
            SELECT state, district, mandal, village, village_native, pincode, village_code
            FROM locations
            WHERE LOWER(village) LIKE LOWER(?) OR
                village_native LIKE ? OR
                LOWER(mandal) LIKE LOWER(?) OR
                pincode LIKE ?
            ORDER BY state, district, village
            LIMIT ?
            """,
            (q, q, q, q, limit)
        )
    
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "state": r["state"],
            "district": r["district"],
            "mandal": r["mandal"],
            "village": r["village"],
            "native": r["village_native"] or "",
            "pincode": r["pincode"] or "",
            "code": r["village_code"] or ""
        }
        for r in rows
    ]


def get_location_stats() -> Dict[str, Any]:
    """Return database summary stats."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT state, COUNT(DISTINCT district) as dist_cnt, COUNT(DISTINCT mandal) as mand_cnt, COUNT(*) as vill_cnt
    FROM locations
    GROUP BY state
    """)
    rows = cursor.fetchall()
    conn.close()
    
    stats = {}
    total_villages = 0
    total_mandals = 0
    total_districts = 0
    for r in rows:
        stats[r["state"]] = {
            "districts": r["dist_cnt"],
            "mandals": r["mand_cnt"],
            "villages": r["vill_cnt"]
        }
        total_districts += r["dist_cnt"]
        total_mandals += r["mand_cnt"]
        total_villages += r["vill_cnt"]

    return {
        "states": stats,
        "total_states": len(stats),
        "total_districts": total_districts,
        "total_mandals": total_mandals,
        "total_villages": total_villages,
        "source": "Local Government Directory (LGD), Ministry of Panchayati Raj, Govt of India"
    }
