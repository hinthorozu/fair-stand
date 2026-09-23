"""Snap catalog seed: stand.family + rule_type + rule (UI-editable).

Runtime does NOT read item_type maps. This module only:
- ensures rule_type `snap` and initial rules/families exist
- stamps seed dicts with family_code / rule codes for FK resolution
"""

from __future__ import annotations

from datetime import UTC, datetime

import sqlalchemy as sa

SNAP_FACES = frozenset({"front", "back", "top", "bottom", "left", "right"})
SNAP_EDGES = frozenset({"top", "bottom", "left", "right"})
SNAP_MOUNT_MODES = frozenset({"face-edge", "panel-seam"})

RULE_TYPE_SNAP = "snap"

# One-time seed DATA (not runtime). Codes only — face/edge live on rules.
_INITIAL_FAMILIES: tuple[tuple[str, str, int], ...] = (
    ("profile", "Profil", 10),
    ("panel", "Panel", 20),
    ("separator-panel", "Ayırıcı panel", 30),
    ("shelf", "Raf", 40),
    ("led-floodlight", "Projektör", 50),
    ("flat-panel", "Düz panel / duvar", 60),
)

_INITIAL_RULES: tuple[tuple[str, str, str | None, str | None, str | None, int], ...] = (
    ("top-rail", "Üst ray", "top", "top", "face-edge", 10),
    ("shelf-rail", "Raf rayı", "front", "top", "panel-seam", 20),
)

# item_type → (family_code, requires_rule_code, provides_rule_code) — seed/migration only
_SEED_ITEM_BINDINGS: dict[str, tuple[str | None, str | None, str | None]] = {
    "led-floodlight": ("led-floodlight", "top-rail", None),
    "shelf": ("shelf", "shelf-rail", None),
    "profile": ("profile", None, "top-rail"),
    "panel": ("panel", None, "shelf-rail"),
    "separator-panel": ("separator-panel", None, "shelf-rail"),
    "flat-panel": ("flat-panel", None, None),
}


def _now() -> datetime:
    return datetime.now(tz=UTC)


def snap_binding_for_item_type(item_type: str) -> tuple[str | None, str | None, str | None]:
    return _SEED_ITEM_BINDINGS.get(item_type, (None, None, None))


def apply_item_snap_fields(row: dict) -> dict:
    family_code, requires, provides = snap_binding_for_item_type(row["item_type"])
    row["family_code"] = family_code
    row["snap_requires_rule_code"] = requires
    row["snap_provides_rule_code"] = provides
    row["snap_target_item_type"] = None
    row["snap_anchor"] = None
    row.pop("snap_requires", None)
    row.pop("snap_provides", None)
    row.pop("snap_face", None)
    row.pop("snap_edge", None)
    return row


def ensure_snap_catalog(session) -> dict[str, dict[str, int]]:
    """Idempotent: rule_type snap, initial rules/families. Returns id maps by code."""
    from app.modules.fair_stand.infrastructure.models import (
        FairStandFamilyModel,
        FairStandRuleModel,
        FairStandRuleTypeModel,
    )

    now = _now()
    rule_type = session.scalar(
        sa.select(FairStandRuleTypeModel).where(FairStandRuleTypeModel.code == RULE_TYPE_SNAP)
    )
    if rule_type is None:
        rule_type = FairStandRuleTypeModel(
            code=RULE_TYPE_SNAP,
            display_name="Snap",
            is_active=True,
            created_at=now,
            updated_at=now,
        )
        session.add(rule_type)
        session.flush()

    families: dict[str, int] = {}
    for code, name, sort_index in _INITIAL_FAMILIES:
        row = session.scalar(sa.select(FairStandFamilyModel).where(FairStandFamilyModel.code == code))
        if row is None:
            row = FairStandFamilyModel(
                code=code,
                display_name=name,
                sort_index=sort_index,
                is_active=True,
                created_at=now,
                updated_at=now,
            )
            session.add(row)
            session.flush()
        families[code] = int(row.id)

    rules: dict[str, int] = {}
    for code, name, face, edge, mount_mode, sort_index in _INITIAL_RULES:
        row = session.scalar(
            sa.select(FairStandRuleModel).where(
                FairStandRuleModel.rule_type_id == rule_type.id,
                FairStandRuleModel.code == code,
            )
        )
        if row is None:
            row = FairStandRuleModel(
                rule_type_id=int(rule_type.id),
                code=code,
                display_name=name,
                face=face,
                edge=edge,
                mount_mode=mount_mode,
                sort_index=sort_index,
                is_active=True,
                created_at=now,
                updated_at=now,
            )
            session.add(row)
            session.flush()
        rules[code] = int(row.id)

    session.flush()
    return {
        "families": families,
        "rules": rules,
        "rule_types": {RULE_TYPE_SNAP: int(rule_type.id)},
    }


def bind_item_snap_fks(bind, *, families: dict[str, int], rules: dict[str, int]) -> None:
    """Migration helper: set family_id / rule FKs from item_type seed bindings."""
    rows = bind.execute(sa.text("SELECT item_key, item_type FROM fair_stand_items")).mappings()
    for row in rows:
        family_code, requires, provides = snap_binding_for_item_type(row["item_type"])
        bind.execute(
            sa.text(
                """
                UPDATE fair_stand_items
                SET family_id = :family_id,
                    snap_requires_rule_id = :requires_id,
                    snap_provides_rule_id = :provides_id,
                    snap_target_item_type = NULL,
                    snap_anchor = NULL
                WHERE item_key = :item_key
                """
            ),
            {
                "family_id": families.get(family_code) if family_code else None,
                "requires_id": rules.get(requires) if requires else None,
                "provides_id": rules.get(provides) if provides else None,
                "item_key": row["item_key"],
            },
        )
