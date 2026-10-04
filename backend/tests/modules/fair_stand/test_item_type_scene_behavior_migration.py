"""0053 copies behavior rows. 0054 adds production without a behavior row."""

from datetime import UTC, datetime
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

import sqlalchemy as sa
from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.pool import StaticPool


def _load_migration(filename: str, module_name: str):
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / filename
    spec = spec_from_file_location(module_name, path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def _parent_table() -> sa.Table:
    return sa.Table(
        "fair_stand_item_type",
        sa.MetaData(),
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(64), nullable=False),
        sa.Column("display_name", sa.String(128), nullable=False),
        sa.Column("placement", sa.String(32), nullable=False),
        sa.Column("collision", sa.String(32), nullable=False),
        sa.Column("move_snap_cm", sa.Integer(), nullable=False),
        sa.Column("magnetic_snap", sa.String(32), nullable=False),
        sa.Column("allow_side_insert", sa.Boolean(), nullable=False),
        sa.Column("supports_wall_overlay_mount", sa.Boolean(), nullable=False),
        sa.Column("wall_capacity", sa.String(16), nullable=False),
        sa.Column("connection_endpoint", sa.String(32), nullable=False),
        sa.Column("collision_depth", sa.String(32), nullable=False),
        sa.Column("endpoint_contact", sa.String(32), nullable=False),
        sa.Column("boundary_snap", sa.String(32), nullable=False),
        sa.Column("collision_height", sa.String(16), nullable=False),
        sa.Column("ghost_kind", sa.String(32), nullable=False),
        sa.Column("ghost_renderer", sa.String(64), nullable=False),
        sa.Column("ghost_opacity", sa.Numeric(4, 3), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.CheckConstraint(
            "placement IN ('wall', 'free', 'wall-overlay', 'top')",
            name="ck_fair_stand_item_type_placement",
        ),
        sa.CheckConstraint(
            "collision IN ('segment', 'footprint', 'none')",
            name="ck_fair_stand_item_type_collision",
        ),
        sa.CheckConstraint("move_snap_cm > 0", name="ck_fair_stand_item_type_move_snap_cm"),
        sa.CheckConstraint(
            "magnetic_snap IN ('standard', 'none', 'short-up-joint')",
            name="ck_fair_stand_item_type_magnetic_snap",
        ),
        sa.CheckConstraint(
            "wall_capacity IN ('include', 'exclude')",
            name="ck_fair_stand_item_type_wall_capacity",
        ),
        sa.CheckConstraint(
            "connection_endpoint IN ('segment', 'logical-fixture')",
            name="ck_fair_stand_item_type_connection_endpoint",
        ),
        sa.CheckConstraint(
            "collision_depth IN ('physical', 'wall-backbone')",
            name="ck_fair_stand_item_type_collision_depth",
        ),
        sa.CheckConstraint(
            "endpoint_contact IN ('standard', 'thin-wall-endpoint')",
            name="ck_fair_stand_item_type_endpoint_contact",
        ),
        sa.CheckConstraint(
            "boundary_snap IN ('stand-edge', 'wall-inner-face')",
            name="ck_fair_stand_item_type_boundary_snap",
        ),
        sa.CheckConstraint(
            "collision_height IN ('full')",
            name="ck_fair_stand_item_type_collision_height",
        ),
        sa.CheckConstraint(
            "ghost_opacity >= 0 AND ghost_opacity <= 1",
            name="ck_fair_stand_item_type_ghost_opacity",
        ),
        sa.UniqueConstraint("key", name="uq_fair_stand_item_type_key"),
    )


def _behavior_row(item_id: int, key: str, placement: str, collision: str, move_snap_cm: int) -> dict:
    now = datetime.now(tz=UTC)
    return {
        "id": item_id,
        "key": key,
        "display_name": key,
        "placement": placement,
        "collision": collision,
        "move_snap_cm": move_snap_cm,
        "magnetic_snap": "none" if key == "shelf" else "standard",
        "allow_side_insert": key != "shelf",
        "supports_wall_overlay_mount": True,
        "wall_capacity": "exclude" if key == "shelf" else "include",
        "connection_endpoint": "logical-fixture" if key == "shelf" else "segment",
        "collision_depth": "wall-backbone" if key == "shelf" else "physical",
        "endpoint_contact": "thin-wall-endpoint" if key == "shelf" else "standard",
        "boundary_snap": "wall-inner-face" if key == "shelf" else "stand-edge",
        "collision_height": "full",
        "ghost_kind": "silhouette",
        "ghost_renderer": "module-silhouette",
        "ghost_opacity": "0.380",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }


def _run(connection, migration, direction: str) -> None:
    context = MigrationContext.configure(connection)
    with Operations.context(context):
        getattr(migration, direction)()


def test_scene_behavior_migration_copies_values_and_blocks_non_scene_downgrade():
    migration = _load_migration(
        "0053_item_type_scene_behavior.py",
        "fair_stand_0053_item_type_scene_behavior",
    )
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    table = _parent_table()
    table.create(engine)
    rows = [
        _behavior_row(1, "flat-panel", "wall", "segment", 50),
        _behavior_row(2, "shelf", "wall-overlay", "none", 10),
    ]
    with engine.begin() as connection:
        connection.execute(table.insert(), rows)
        _run(connection, migration, "upgrade")
        copied = connection.execute(
            text(
                "SELECT item_type_id, placement, collision, move_snap_cm, magnetic_snap, "
                "wall_capacity, connection_endpoint, ghost_opacity "
                "FROM fair_stand_item_type_scene_behavior ORDER BY item_type_id"
            )
        ).mappings().all()
        assert [(row["item_type_id"], row["placement"], row["collision"], row["move_snap_cm"]) for row in copied] == [
            (1, "wall", "segment", 50),
            (2, "wall-overlay", "none", 10),
        ]
        assert copied[1]["magnetic_snap"] == "none"
        assert copied[1]["wall_capacity"] == "exclude"
        assert copied[1]["connection_endpoint"] == "logical-fixture"
        parent_columns = {column["name"] for column in inspect(connection).get_columns("fair_stand_item_type")}
        assert "placement" not in parent_columns
        assert "ghost_opacity" not in parent_columns
        fks = inspect(connection).get_foreign_keys("fair_stand_item_type_scene_behavior")
        assert fks[0]["referred_table"] == "fair_stand_item_type"
        assert fks[0]["options"]["ondelete"] == "CASCADE"
        assert fks[0]["options"]["onupdate"] == "CASCADE"
        pk = inspect(connection).get_pk_constraint("fair_stand_item_type_scene_behavior")
        assert pk["constrained_columns"] == ["item_type_id"]
        now = datetime.now(tz=UTC)
        connection.execute(
            text(
                "INSERT INTO fair_stand_item_type (id, key, display_name, is_active, created_at, updated_at) "
                "VALUES (3, 'production', 'Üretim', 1, :now, :now)"
            ),
            {"now": now},
        )
        try:
            _run(connection, migration, "downgrade")
            raise AssertionError("downgrade should reject a type without scene behavior")
        except RuntimeError as exc:
            assert "production" in str(exc)
        connection.execute(text("DELETE FROM fair_stand_item_type WHERE key = 'production'"))
        _run(connection, migration, "downgrade")
        restored = connection.execute(
            text(
                "SELECT id, placement, collision, move_snap_cm, magnetic_snap "
                "FROM fair_stand_item_type ORDER BY id"
            )
        ).mappings().all()
        assert restored[0]["placement"] == "wall"
        assert restored[0]["move_snap_cm"] == 50
        assert restored[1]["placement"] == "wall-overlay"
        assert restored[1]["collision"] == "none"
        assert restored[1]["move_snap_cm"] == 10
        assert restored[1]["magnetic_snap"] == "none"
        assert "fair_stand_item_type_scene_behavior" not in inspect(connection).get_table_names()
        _run(connection, migration, "upgrade")
        again = connection.execute(
            text(
                "SELECT placement, move_snap_cm FROM fair_stand_item_type_scene_behavior "
                "WHERE item_type_id = 2"
            )
        ).mappings().one()
        assert again["placement"] == "wall-overlay"
        assert again["move_snap_cm"] == 10


def test_production_migration_adds_items_without_behavior_and_downgrade_removes_them():
    split = _load_migration(
        "0053_item_type_scene_behavior.py",
        "fair_stand_0053_for_production_items",
    )
    production = _load_migration("0054_production_items.py", "fair_stand_0054_production_items")
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    table = _parent_table()
    table.create(engine)
    with engine.begin() as connection:
        connection.execute(table.insert(), [_behavior_row(1, "flat-panel", "wall", "segment", 50)])
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_items (
                  item_key VARCHAR(128) PRIMARY KEY,
                  name VARCHAR(256) NOT NULL,
                  item_type VARCHAR(64) NOT NULL,
                  unit VARCHAR(32),
                  catalog_visible BOOLEAN NOT NULL,
                  is_render BOOLEAN NOT NULL,
                  accepts_color BOOLEAN NOT NULL,
                  accepts_image BOOLEAN NOT NULL,
                  accepts_lightbox BOOLEAN NOT NULL,
                  accepts_glass BOOLEAN NOT NULL,
                  accepts_mesh BOOLEAN NOT NULL,
                  is_active BOOLEAN NOT NULL,
                  created_at DATETIME NOT NULL,
                  updated_at DATETIME NOT NULL
                )
                """
            )
        )
        _run(connection, split, "upgrade")
        _run(connection, production, "upgrade")
        behavior = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM fair_stand_item_type_scene_behavior
                JOIN fair_stand_item_type ON fair_stand_item_type.id = item_type_id
                WHERE fair_stand_item_type.key = 'production'
                """
            )
        ).scalar()
        assert behavior == 0
        items = connection.execute(
            text(
                "SELECT item_key, name, item_type, unit, catalog_visible, is_render, is_active "
                "FROM fair_stand_items ORDER BY item_key"
            )
        ).mappings().all()
        assert [row["item_key"] for row in items] == [
            "digital_print",
            "lightbox_fabric",
            "mesh_print",
        ]
        assert {row["name"] for row in items} == {"Dijital Baskı", "Mesh Baskı", "Lightbox Bezi"}
        assert {row["unit"] for row in items} == {"metre_kare"}
        assert all(row["item_type"] == "production" for row in items)
        assert all(row["catalog_visible"] in (0, False) for row in items)
        assert all(row["is_render"] in (0, False) for row in items)
        assert all(row["is_active"] in (1, True) for row in items)
        _run(connection, production, "downgrade")
        assert connection.execute(text("SELECT COUNT(*) FROM fair_stand_items")).scalar() == 0
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_item_type WHERE key = 'production'")
        ).scalar() == 0
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_item_type_scene_behavior")
        ).scalar() == 1
