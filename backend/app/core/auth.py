"""
RythuSetu Authorization & RBAC Dependency Engine
Provides server-side role validation, JWT extraction, and object-level permission enforcement.
Zero client-side authority.
"""

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db import get_db
from app.models import UserAccount

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
    db: Session = Depends(get_db),
) -> UserAccount:
    """
    Validates the Bearer JWT token and retrieves the current user.
    Enforces server-side authentication without trusting client state.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
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
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
    db: Session = Depends(get_db),
) -> UserAccount | None:
    """Returns the authenticated user if token present and valid, otherwise None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return get_current_user(credentials=credentials, db=db)
    except HTTPException:
        return None


get_optional_current_user = get_optional_user



def require_role(*allowed_roles: str):
    """Factory dependency enforcing that the current user possesses one of the allowed roles."""
    def role_checker(current_user: UserAccount = Depends(get_current_user)) -> UserAccount:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}. Your role: {current_user.role}",
            )
        return current_user
    return role_checker


# Reusable Role Dependencies
require_authenticated_user = get_current_user
require_farmer = require_role("farmer", "officer", "admin", "super_admin")
require_officer = require_role("officer", "admin", "super_admin")
require_admin = require_role("admin", "super_admin")
require_super_admin = require_role("super_admin")


def verify_object_ownership(current_user: UserAccount, resource_user_id: int | None, resource_name: str = "resource") -> None:
    """
    Prevents Broken Object Level Authorization (BOLA/IDOR).
    Allows access only if current user owns the resource or has administrative authority.
    """
    if current_user.role in ("admin", "super_admin", "officer"):
        return
        
    if resource_user_id is None or current_user.id != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden. You do not have permission to access or modify this {resource_name}.",
        )
