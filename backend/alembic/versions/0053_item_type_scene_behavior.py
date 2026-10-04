"""Move item type scene behavior to an optional 1:1 child table.

Revision ID: 0053_item_type_scene_behavior
Revises: 0052_unit_key

Copies existing behavior column values. Does not invent defaults.
Downgrade refuses item types that have no behavior row.
"""

from alembic import op
import sqlalchemy as sa


revision = "0053_item_type_scene_behavior"
down_revision = "0052_unit_key"
branch_labels = None
depends_on = None

_BEHAVIOR_COLUMNS = (
    "placement",
    "collision",
    "move_snap_cm",
    "magnetic_snap",
    "allow_side_insert",
    "supports_wall_overlay_mount",
    "wall_capacity",
    "connection_endpoint",
    "collision_depth",
    "endpoint_contact",
    "boundary_snap",
    "collision_height",
    "ghost_kind",
    "ghost_renderer",
    "ghost_opacity",
)

_PARENT_CHECKS = (
    "ck_fair_stand_item_type_placement",
    "ck_fair_stand_item_type_collision",
    "ck_fair_stand_item_type_move_snap_cm",
    "ck_fair_stand_item_type_magnetic_snap",
    "ck_fair_stand_item_type_wall_capacity",
    "ck_fair_stand_item_type_connection_endpoint",
    "ck_fair_stand_item_type_collision_depth",
    "ck_fair_stand_item_type_endpoint_contact",
    "ck_fair_stand_item_type_boundary_snap",
    "ck_fair_stand_item_type_collision_height",
    "ck_fair_stand_item_type_ghost_opacity",
)


def upgrade() -> None:
    op.create_table(
        "fair_stand_item_type_scene_behavior",
        sa.Column("item_type_id", sa.Integer(), nullable=False),
        sa.Column("placement", sa.String(length=32), nullable=False),
        sa.Column("collision", sa.String(length=32), nullable=False),
        sa.Column("move_snap_cm", sa.Integer(), nullable=False),
        sa.Column("magnetic_snap", sa.String(length=32), nullable=False),
        sa.Column("allow_side_insert", sa.Boolean(), nullable=False),
        sa.Column("supports_wall_overlay_mount", sa.Boolean(), nullable=False),
        sa.Column("wall_capacity", sa.String(length=16), nullable=False),
        sa.Column("connection_endpoint", sa.String(length=32), nullable=False),
        sa.Column("collision_depth", sa.String(length=32), nullable=False),
        sa.Column("endpoint_contact", sa.String(length=32), nullable=False),
        sa.Column("boundary_snap", sa.String(length=32), nullable=False),
        sa.Column("collision_height", sa.String(length=16), nullable=False),
        sa.Column("ghost_kind", sa.String(length=32), nullable=False),
        sa.Column("ghost_renderer", sa.String(length=64), nullable=False),
        sa.Column("ghost_opacity", sa.Numeric(4, 3), nullable=False),
        sa.CheckConstraint(
            "placement IN ('wall', 'free', 'wall-overlay', 'top')",
            name="ck_fair_stand_item_type_scene_behavior_placement",
        ),
        sa.CheckConstraint(
            "collision IN ('segment', 'footprint', 'none')",
            name="ck_fair_stand_item_type_scene_behavior_collision",
        ),
        sa.CheckConstraint(
            "move_snap_cm > 0",
            name="ck_fair_stand_item_type_scene_behavior_move_snap_cm",
        ),
        sa.CheckConstraint(
            "magnetic_snap IN ('standard', 'none', 'short-up-joint')",
            name="ck_fair_stand_item_type_scene_behavior_magnetic_snap",
        ),
        sa.CheckConstraint(
            "wall_capacity IN ('include', 'exclude')",
            name="ck_fair_stand_item_type_scene_behavior_wall_capacity",
        ),
        sa.CheckConstraint(
            "connection_endpoint IN ('segment', 'logical-fixture')",
            name="ck_fair_stand_item_type_scene_behavior_connection_endpoint",
        ),
        sa.CheckConstraint(
            "collision_depth IN ('physical', 'wall-backbone')",
            name="ck_fair_stand_item_type_scene_behavior_collision_depth",
        ),
        sa.CheckConstraint(
            "endpoint_contact IN ('standard', 'thin-wall-endpoint')",
            name="ck_fair_stand_item_type_scene_behavior_endpoint_contact",
        ),
        sa.CheckConstraint(
            "boundary_snap IN ('stand-edge', 'wall-inner-face')",
            name="ck_fair_stand_item_type_scene_behavior_boundary_snap",
        ),
        sa.CheckConstraint(
            "collision_height IN ('full')",
            name="ck_fair_stand_item_type_scene_behavior_collision_height",
        ),
        sa.CheckConstraint(
            "ghost_opacity >= 0 AND ghost_opacity <= 1",
            name="ck_fair_stand_item_type_scene_behavior_ghost_opacity",
        ),
        sa.ForeignKeyConstraint(
            ["item_type_id"],
            ["fair_stand_item_type.id"],
            name="fk_fair_stand_item_type_scene_behavior_item_type_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.PrimaryKeyConstraint("item_type_id"),
    )
    column_list = ", ".join(_BEHAVIOR_COLUMNS)
    op.execute(
        sa.text(
            f"""
            INSERT INTO fair_stand_item_type_scene_behavior (item_type_id, {column_list})
            SELECT id, {column_list}
            FROM fair_stand_item_type
            """
        )
    )
    bind = op.get_bind()
    parent_count = bind.execute(sa.text("SELECT COUNT(*) FROM fair_stand_item_type")).scalar()
    child_count = bind.execute(
        sa.text("SELECT COUNT(*) FROM fair_stand_item_type_scene_behavior")
    ).scalar()
    if int(parent_count or 0) != int(child_count or 0):
        raise RuntimeError(
            "Scene behavior copy count mismatch: "
            f"item types={parent_count}, behavior rows={child_count}."
        )
    with op.batch_alter_table("fair_stand_item_type") as batch:
        for name in _PARENT_CHECKS:
            batch.drop_constraint(name, type_="check")
        for name in _BEHAVIOR_COLUMNS:
            batch.drop_column(name)


def downgrade() -> None:
    bind = op.get_bind()
    missing = bind.execute(
        sa.text(
            """
            SELECT fair_stand_item_type.key
            FROM fair_stand_item_type
            LEFT JOIN fair_stand_item_type_scene_behavior
              ON fair_stand_item_type_scene_behavior.item_type_id = fair_stand_item_type.id
            WHERE fair_stand_item_type_scene_behavior.item_type_id IS NULL
            ORDER BY fair_stand_item_type.key
            """
        )
    ).scalars().all()
    if missing:
        keys = ", ".join(missing)
        raise RuntimeError(
            "Downgrade blocked. Item types without scene behavior cannot return to "
            f"NOT NULL behavior columns: {keys}."
        )
    with op.batch_alter_table("fair_stand_item_type") as batch:
        batch.add_column(sa.Column("placement", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("collision", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("move_snap_cm", sa.Integer(), nullable=True))
        batch.add_column(sa.Column("magnetic_snap", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("allow_side_insert", sa.Boolean(), nullable=True))
        batch.add_column(sa.Column("supports_wall_overlay_mount", sa.Boolean(), nullable=True))
        batch.add_column(sa.Column("wall_capacity", sa.String(length=16), nullable=True))
        batch.add_column(sa.Column("connection_endpoint", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("collision_depth", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("endpoint_contact", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("boundary_snap", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("collision_height", sa.String(length=16), nullable=True))
        batch.add_column(sa.Column("ghost_kind", sa.String(length=32), nullable=True))
        batch.add_column(sa.Column("ghost_renderer", sa.String(length=64), nullable=True))
        batch.add_column(sa.Column("ghost_opacity", sa.Numeric(4, 3), nullable=True))
    assignments = ", ".join(
        f"{name} = (SELECT {name} FROM fair_stand_item_type_scene_behavior "
        f"WHERE item_type_id = fair_stand_item_type.id)"
        for name in _BEHAVIOR_COLUMNS
    )
    op.execute(sa.text(f"UPDATE fair_stand_item_type SET {assignments}"))
    with op.batch_alter_table("fair_stand_item_type") as batch:
        for name in _BEHAVIOR_COLUMNS:
            batch.alter_column(name, nullable=False)
        batch.create_check_constraint(
            "ck_fair_stand_item_type_placement",
            "placement IN ('wall', 'free', 'wall-overlay', 'top')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_collision",
            "collision IN ('segment', 'footprint', 'none')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_move_snap_cm",
            "move_snap_cm > 0",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_magnetic_snap",
            "magnetic_snap IN ('standard', 'none', 'short-up-joint')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_wall_capacity",
            "wall_capacity IN ('include', 'exclude')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_connection_endpoint",
            "connection_endpoint IN ('segment', 'logical-fixture')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_collision_depth",
            "collision_depth IN ('physical', 'wall-backbone')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_endpoint_contact",
            "endpoint_contact IN ('standard', 'thin-wall-endpoint')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_boundary_snap",
            "boundary_snap IN ('stand-edge', 'wall-inner-face')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_collision_height",
            "collision_height IN ('full')",
        )
        batch.create_check_constraint(
            "ck_fair_stand_item_type_ghost_opacity",
            "ghost_opacity >= 0 AND ghost_opacity <= 1",
        )
    op.drop_table("fair_stand_item_type_scene_behavior")
