"""
RythuSetu Authorization & RBAC Dependency Engine
Provides server-side role validation, JWT extraction, and object-level permission enforcement.
Zero client-side authority.
"""

from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db import get_db
from app.models import FarmerProfile, UserAccount

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    request: Request = None,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)] = None,
    db: Session = Depends(get_db),
) -> UserAccount:
    """
    Validates the JWT token from either the Authorization Bearer header
    or HttpOnly secure session cookie, and retrieves the current user.
    Enforces server-side authentication without trusting client state.
    """
    token = None
    if credentials and credentials.credentials:
        token = credentials.credentials
    elif request and hasattr(request, "cookies") and request.cookies.get("rythusetu_access_token"):
        token = request.cookies.get("rythusetu_access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token or session.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        payload = decode_access_token(token)
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing user identifier.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or tampered authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(UserAccount, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been deactivated.",
        )

    return user


def get_optional_user(
    request: Request = None,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)] = None,
    db: Session = Depends(get_db),
) -> UserAccount | None:
    """Returns the authenticated user if token present and valid, otherwise None."""
    token = None
    if credentials and credentials.credentials:
        token = credentials.credentials
    elif request and hasattr(request, "cookies") and request.cookies.get("rythusetu_access_token"):
        token = request.cookies.get("rythusetu_access_token")

    if not token:
        return None
    try:
        return get_current_user(request=request, credentials=credentials, db=db)
    except HTTPException:
        return None


get_optional_current_user = get_optional_user


def get_current_farmer_profile(
    current_user: UserAccount = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FarmerProfile:
    """
    Retrieves the FarmerProfile strictly bound to the authenticated user.
    Prevents BOLA/IDOR by ensuring farmers can only access their own profile.
    If no profile exists for the user, returns 404 (zero mock fallbacks).
    """
    farmer = None
    if current_user.farmer_profile_id:
        farmer = db.get(FarmerProfile, current_user.farmer_profile_id)
    if not farmer:
        farmer = db.query(FarmerProfile).filter(FarmerProfile.user_id == current_user.id).first()

    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found for this account. Please register your agricultural profile.",
        )
    return farmer


def get_farmer_or_404(
    db: Session,
    farmer_id: int,
    current_user: UserAccount | None = None,
) -> FarmerProfile:
    """
    Strict lookup for FarmerProfile by ID.
    Enforces authorization check if current_user is provided:
    - Admin/Officer can view any farmer profile.
    - Farmer can ONLY view their own profile.
    Raises 404 if profile does not exist.
    Raises 403 if farmer tries to view another farmer's profile (BOLA/IDOR protection).
    """
    farmer = db.get(FarmerProfile, farmer_id)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer profile #{farmer_id} does not exist.",
        )

    if current_user:
        if current_user.role not in ("admin", "super_admin", "support_agent", "data_verifier", "officer"):
            user_owns = (
                current_user.farmer_profile_id == farmer.id or
                farmer.user_id == current_user.id
            )
            if not user_owns:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Forbidden: You do not have permission to access another farmer's records.",
                )
    return farmer


def require_role(*allowed_roles: str):
    """Factory dependency enforcing that the current user possesses one of the allowed roles."""
    def role_checker(current_user: UserAccount = Depends(get_current_user)) -> UserAccount:
        # Legacy compatibility: if user has role "officer", map dynamically to data_verifier permissions
        effective_role = "data_verifier" if current_user.role == "officer" else current_user.role
        if current_user.role not in allowed_roles and effective_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}. Your role: {current_user.role}",
            )
        return current_user
    return role_checker


# Reusable Role Dependencies
require_authenticated_user = get_current_user
require_farmer = require_role("farmer", "data_verifier", "support_agent", "admin", "super_admin", "officer")
require_internal = require_role("data_verifier", "support_agent", "admin", "super_admin", "officer")
require_verifier = require_role("data_verifier", "admin", "super_admin", "officer")
require_support = require_role("support_agent", "admin", "super_admin")
require_admin = require_role("admin", "super_admin")
require_super_admin = require_role("super_admin")
require_officer = require_internal  # Backward compatible alias for existing endpoints


def verify_object_ownership(current_user: UserAccount, resource_user_id: int | None, resource_name: str = "resource") -> None:
    """
    Prevents Broken Object Level Authorization (BOLA/IDOR).
    Allows access only if current user owns the resource or has administrative authority.
    """
    if current_user.role in ("admin", "super_admin", "support_agent", "data_verifier", "officer"):
        return

    if resource_user_id is None or current_user.id != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden. You do not have permission to access or modify this {resource_name}.",
        )

