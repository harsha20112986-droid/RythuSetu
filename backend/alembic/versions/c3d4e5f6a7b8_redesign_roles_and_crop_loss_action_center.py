"""redesign_roles_and_crop_loss_action_center

Revision ID: c3d4e5f6a7b8
Revises: 07580a08c5ca, b2c3d4e5f6a7
Create Date: 2026-09-27 01:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = ('07580a08c5ca', 'b2c3d4e5f6a7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    1. Adds Official Action Center fields to crop_loss_reports.
    2. Migrates legacy 'officer' user accounts to 'data_verifier' (or 'admin' if username indicates admin).
    3. Migrates claim_events actor_role from 'officer' to 'data_verifier'.
    """
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # 1. Add missing columns to crop_loss_reports if they do not exist
    existing_cols = [c['name'] for c in inspector.get_columns('crop_loss_reports')] if 'crop_loss_reports' in inspector.get_table_names() else []

    cols_to_add = [
        ('survey_number', sa.String(length=80), None),
        ('mandal', sa.String(length=80), None),
        ('village', sa.String(length=120), None),
        ('official_reference_number', sa.String(length=100), None),
        ('farmer_self_status', sa.String(length=60), 'PREPARATION_READY'),
        ('farmer_notes', sa.Text(), None),
        ('submission_date', sa.String(length=40), None),
        ('follow_up_date', sa.String(length=40), None),
        ('verifier_notes', sa.Text(), None),
    ]

    for col_name, col_type, default_val in cols_to_add:
        if col_name not in existing_cols:
            if default_val is not None:
                op.add_column('crop_loss_reports', sa.Column(col_name, col_type, nullable=True, server_default=default_val))
            else:
                op.add_column('crop_loss_reports', sa.Column(col_name, col_type, nullable=True))

    # 2. Deterministic data migration: migrate 'officer' to 'data_verifier'
    # Check if user_accounts table exists
    if 'user_accounts' in inspector.get_table_names():
        # Update officer accounts where username/role indicates admin to 'admin', else 'data_verifier'
        conn.execute(sa.text("UPDATE user_accounts SET role = 'admin' WHERE role = 'officer' AND (username LIKE '%admin%' OR designation LIKE '%Admin%')"))
        conn.execute(sa.text("UPDATE user_accounts SET role = 'data_verifier' WHERE role = 'officer'"))

    # 3. Update claim_events table actor_role
    if 'claim_events' in inspector.get_table_names():
        conn.execute(sa.text("UPDATE claim_events SET actor_role = 'data_verifier' WHERE actor_role = 'officer'"))


def downgrade() -> None:
    """Safe downgrade reverting new columns and restoring legacy role representation where applicable."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols_to_drop = [
        'survey_number', 'mandal', 'village', 'official_reference_number',
        'farmer_self_status', 'farmer_notes', 'submission_date', 'follow_up_date', 'verifier_notes'
    ]
    if 'crop_loss_reports' in inspector.get_table_names():
        existing_cols = [c['name'] for c in inspector.get_columns('crop_loss_reports')]
        for col_name in cols_to_drop:
            if col_name in existing_cols:
                try:
                    op.drop_column('crop_loss_reports', col_name)
                except Exception:
                    pass

    if 'user_accounts' in inspector.get_table_names():
        conn.execute(sa.text("UPDATE user_accounts SET role = 'officer' WHERE role = 'data_verifier'"))

    if 'claim_events' in inspector.get_table_names():
        conn.execute(sa.text("UPDATE claim_events SET actor_role = 'officer' WHERE actor_role = 'data_verifier'"))
