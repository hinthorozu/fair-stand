"""Seed empty fair_stand catalog from the frozen local dump. No-op when Items exist.

Revision ID: 0002_fair_stand_catalog_seed
Revises: 0001_fair_stand_schema
"""

from alembic import op

from app.modules.fair_stand.infrastructure.catalog_dump_seed import seed_catalog_if_empty

revision = "0002_fair_stand_catalog_seed"
down_revision = "0001_fair_stand_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    seed_catalog_if_empty(op.get_bind())


def downgrade() -> None:
    raise NotImplementedError("Catalog dump seed is not reversible")
