"""
RythuSetu Event & Notification Engine
Connects decoupled agricultural systems into an intelligent, event-driven platform.
Processes meteorological, market, and agronomic events to deliver timely, actionable alerts.
"""

from datetime import datetime, timezone
from typing import Any
from sqlalchemy.orm import Session
from app.models import Notification, FarmerProfile, UserAccount


def create_notification(
    db: Session,
    user_id: int,
    category: str,
    title: str,
    message: str,
    severity: str = "info",
    action_link: str | None = None,
) -> Notification:
    """Creates and persists an individual farmer notification."""
    notif = Notification(
        user_id=user_id,
        category=category,
        title=title,
        message=message,
        severity=severity,
        action_link=action_link,
        status="UNREAD",
        created_at=datetime.now(timezone.utc),
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def dispatch_weather_alert_event(
    db: Session,
    district: str,
    crop: str,
    hazard_title: str,
    advisory: str,
    severity: str = "warning",
    user_id: int | None = None,
) -> list[Notification]:
    """
    Dispatches targeted alerts to cultivators in the affected district (or specific user).
    Links directly to Harvest Shield tarpaulins and PMFBY claim preparation.
    """
    if user_id:
        farmers = db.query(FarmerProfile).filter(FarmerProfile.user_id == user_id).all()
    else:
        farmers = db.query(FarmerProfile).filter(FarmerProfile.district.ilike(f"%{district.strip()}%")).all()

    created = []

    for f in farmers:
        if f.user_id:
            if crop and crop.lower() != "all crops" and crop.lower() not in f.crop.lower():
                continue

            notif = create_notification(
                db=db,
                user_id=f.user_id,
                category="weather",
                title=f"⚠️ {district} Weather Alert: {hazard_title}",
                message=f"{advisory} Protect your {f.crop} harvest or prepare PMFBY intimation within 72 hours if damaged.",
                severity=severity,
                action_link="/crop-loss",
            )
            created.append(notif)

    return created


def dispatch_mandi_price_event(
    db: Session,
    crop: str,
    variety: str = "Standard",
    market: str = "District APMC",
    modal_price: float = 7500.0,
    msp_spread: float = 250.0,
    user_id: int | None = None,
) -> list[Notification]:
    """
    Notifies cultivators when spot prices for their crop spike above MSP.
    Links directly to factory tenders and cold storage options.
    """
    if user_id:
        farmers = db.query(FarmerProfile).filter(FarmerProfile.user_id == user_id).all()
    else:
        farmers = db.query(FarmerProfile).filter(FarmerProfile.crop.ilike(f"%{crop.strip()}%")).all()

    created = []

    for f in farmers:
        if f.user_id:
            action_desc = "above MSP" if msp_spread > 0 else "modal rate"
            notif = create_notification(
                db=db,
                user_id=f.user_id,
                category="market",
                title=f"📈 {crop} Price Alert ({variety})",
                message=f"Modal rates at {market} reached ₹{int(modal_price):,}/qtl (+₹{int(msp_spread):,} {action_desc}). Compare direct factory tenders or lock in godown space.",
                severity="info",
                action_link="/mandi",
            )
            created.append(notif)

    return created


def get_user_notifications(db: Session, user_id: int, unread_only: bool = False) -> list[dict[str, Any]]:
    """Retrieves notifications for the authenticated cultivator."""
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.status == "UNREAD")

    notifs = query.order_by(Notification.created_at.desc()).limit(50).all()
    return [
        {
            "id": n.id,
            "category": n.category,
            "title": n.title,
            "message": n.message,
            "severity": n.severity,
            "action_link": n.action_link,
            "status": n.status,
            "created_at": n.created_at.strftime("%d %b %Y, %I:%M %p"),
        }
        for n in notifs
    ]


def mark_notification_as_read(db: Session, notification_id: int, user_id: int) -> bool:
    """Marks a notification as read with ownership validation."""
    notif = db.get(Notification, notification_id)
    if not notif or notif.user_id != user_id:
        return False
    notif.status = "READ"
    db.commit()
    return True
