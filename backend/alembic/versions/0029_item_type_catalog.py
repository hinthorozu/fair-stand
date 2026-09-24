"""Replace stand.family with fair_stand_item_type catalog; rule↔type M:N.

Revision ID: 0029_item_type_catalog
Revises: 0028_rule_family_link
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0029_item_type_catalog"
down_revision = "0028_rule_family_link"
branch_labels = None
depends_on = None

_DISPLAY_NAMES = {
    "profile": "Profil",
    "panel": "Panel",
    "separator-panel": "Ayırıcı panel",
    "shelf": "Raf",
    "led-floodlight": "Projektör",
    "flat-panel": "Düz panel / duvar",
    "upright": "Dikme",
    "tv": "TV",
    "door": "Kapı",
    "door-leaf": "Kapı kanadı",
    "counter": "Banko",
    "counter-top": "Banko üstü",
    "base": "Baza",
    "base-top": "Baza üstü",
    "separator": "Ayırıcı",
    "showcase-2": "Vitrin 2",
    "showcase-3": "Vitrin 3",
    "showcase-board": "Vitrin levha",
    "showcase-accessory": "Vitrin aksesuar",
    "shelf-accessory": "Raf aksesuar",
    "illuminated-foam": "Işıklı köpük",
    "kettle": "Kettle",
    "mini-fridge": "Mini buzdolabı",
    "coat-rack": "Askılık",
    "plastic-trash-bin": "Çöp kutusu",
    "chair": "Sandalye",
    "bar-stool": "Bar taburesi",
    "indoor-plant-1": "Bitki",
    "connector": "Bağlantı",
    "floor": "Zemin",
    "sofa-set-classic": "Kanepe seti",
    "sofa-single-classic": "Tekli kanepe",
    "sofa-double-classic": "İkili kanepe",
    "coffee-table-classic": "Sehpa",
    "table-chair-set-eames": "Masa sandalye seti",
    "table-glass": "Cam masa",
    "video-wall-panel": "Video wall panel",
}


def upgrade() -> None:
    bind = op.get_bind()
    tables = set(sa.inspect(bind).get_table_names())

    if "fair_stand_item_type" not in tables:
        op.create_table(
            "fair_stand_item_type",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("key", sa.String(64), nullable=False),
            sa.Column("display_name", sa.String(128), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
            sa.UniqueConstraint("key", name="uq_fair_stand_item_type_key"),
        )

    # Seed keys from existing items + former families + known labels
    keys: set[str] = set()
    for (key,) in bind.execute(sa.text("SELECT DISTINCT item_type FROM fair_stand_items")).fetchall():
        if key:
            keys.add(str(key))
    if "fair_stand_family" in tables:
        for (key,) in bind.execute(sa.text("SELECT key FROM fair_stand_family")).fetchall():
            if key:
                keys.add(str(key))
    keys.update(_DISPLAY_NAMES.keys())

    for key in sorted(keys):
        name = _DISPLAY_NAMES.get(key, key)
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_item_type (key, display_name, is_active, created_at, updated_at)
                VALUES (:key, :name, TRUE, NOW(), NOW())
                ON CONFLICT (key) DO NOTHING
                """
            ),
            {"key": key, "name": name},
        )

    # FK items.item_type → item_type.key
    fks = {fk["name"] for fk in sa.inspect(bind).get_foreign_keys("fair_stand_items")}
    if "fk_fair_stand_items_item_type_key" not in fks:
        op.create_foreign_key(
            "fk_fair_stand_items_item_type_key",
            "fair_stand_items",
            "fair_stand_item_type",
            ["item_type"],
            ["key"],
            onupdate="CASCADE",
            ondelete="RESTRICT",
        )

    if "fair_stand_rule_item_type" not in tables:
        op.create_table(
            "fair_stand_rule_item_type",
            sa.Column("rule_id", sa.Integer(), nullable=False),
            sa.Column("item_type_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(
                ["rule_id"],
                ["fair_stand_rule.id"],
                name="fk_fair_stand_rule_item_type_rule_id",
                ondelete="CASCADE",
                onupdate="CASCADE",
            ),
            sa.ForeignKeyConstraint(
                ["item_type_id"],
                ["fair_stand_item_type.id"],
                name="fk_fair_stand_rule_item_type_item_type_id",
                ondelete="CASCADE",
                onupdate="CASCADE",
            ),
            sa.PrimaryKeyConstraint("rule_id", "item_type_id", name="pk_fair_stand_rule_item_type"),
        )
        op.create_index(
            "ix_fair_stand_rule_item_type_item_type_id",
            "fair_stand_rule_item_type",
            ["item_type_id"],
        )

    # Migrate rule↔family links → rule↔item_type (by key)
    if "fair_stand_rule_family" in tables:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_rule_item_type (rule_id, item_type_id)
                SELECT rf.rule_id, it.id
                FROM fair_stand_rule_family rf
                JOIN fair_stand_family f ON f.id = rf.family_id
                JOIN fair_stand_item_type it ON it.key = f.key
                ON CONFLICT DO NOTHING
                """
            )
        )
    else:
        # Fresh fallback seed links
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_rule_item_type (rule_id, item_type_id)
                SELECT r.id, it.id
                FROM fair_stand_rule r
                JOIN fair_stand_rule_type rt ON rt.id = r.rule_type_id AND rt.key = 'snap'
                JOIN fair_stand_item_type it ON it.key = 'profile'
                WHERE r.key = 'top-rail'
                ON CONFLICT DO NOTHING
                """
            )
        )
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_rule_item_type (rule_id, item_type_id)
                SELECT r.id, it.id
                FROM fair_stand_rule r
                JOIN fair_stand_rule_type rt ON rt.id = r.rule_type_id AND rt.key = 'snap'
                JOIN fair_stand_item_type it ON it.key IN ('panel', 'separator-panel')
                WHERE r.key = 'shelf-rail'
                ON CONFLICT DO NOTHING
                """
            )
        )

    # Drop family from items + family tables
    item_cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_items")}
    if "family_id" in item_cols:
        op.drop_index("ix_fair_stand_items_family_id", table_name="fair_stand_items")
        op.drop_constraint("fair_stand_items_family_id_fkey", "fair_stand_items", type_="foreignkey")
        op.drop_column("fair_stand_items", "family_id")

    if "fair_stand_rule_family" in set(sa.inspect(bind).get_table_names()):
        op.drop_index("ix_fair_stand_rule_family_family_id", table_name="fair_stand_rule_family")
        op.drop_table("fair_stand_rule_family")

    if "fair_stand_family" in set(sa.inspect(bind).get_table_names()):
        op.drop_table("fair_stand_family")


def downgrade() -> None:
    raise NotImplementedError("0029_item_type_catalog downgrade not supported")
