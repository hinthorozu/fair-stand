"""Stand envelope singleton fair_stand_dimensions.

Revision ID: 0003_fair_stand_dimensions
Revises: 0002_fair_stand_catalog_seed
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.stand_dimensions_seed import ensure_stand_dimensions

revision = "0003_fair_stand_dimensions"
down_revision = "0002_fair_stand_catalog_seed"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if "fair_stand_dimensions" not in sa.inspect(bind).get_table_names():
        op.create_table(
            "fair_stand_dimensions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("height_m", sa.Numeric(8, 3), nullable=False),
            sa.Column("depth_m", sa.Numeric(8, 3), nullable=False),
            sa.Column("strip_count", sa.Integer(), nullable=False),
            sa.Column("strip_height_m", sa.Numeric(8, 3), nullable=False),
            sa.Column("frame_width_m", sa.Numeric(8, 3), nullable=False),
            sa.Column("frame_depth_m", sa.Numeric(8, 3), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.CheckConstraint("id = 1", name="ck_fair_stand_dimensions_singleton"),
            sa.CheckConstraint("strip_count > 0", name="ck_fair_stand_dimensions_strip_count"),
            sa.CheckConstraint("height_m > 0", name="ck_fair_stand_dimensions_height"),
            sa.CheckConstraint("depth_m > 0", name="ck_fair_stand_dimensions_depth"),
            sa.CheckConstraint("strip_height_m > 0", name="ck_fair_stand_dimensions_strip_height"),
            sa.CheckConstraint("frame_width_m > 0", name="ck_fair_stand_dimensions_frame_width"),
            sa.CheckConstraint("frame_depth_m > 0", name="ck_fair_stand_dimensions_frame_depth"),
            sa.CheckConstraint(
                "height_m = strip_count * strip_height_m",
                name="ck_fair_stand_dimensions_height_strips",
            ),
            sa.PrimaryKeyConstraint("id"),
        )
    session = Session(bind=bind)
    try:
        ensure_stand_dimensions(session)
        session.commit()
    finally:
        session.close()


def downgrade() -> None:
    op.drop_table("fair_stand_dimensions")
