"""Canlı lokal Postgres: kesit 1+2+3 + overlap FK — tip davranışı + motor (gevşetme yok).

fair-stand kökünden:
  python backend/scripts/verify_live_item_type_placement.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.item_type_behavior_seed import (
    TYPE_BEHAVIOR_SLICE1,
    TYPE_BEHAVIOR_SLICE2,
    TYPE_BEHAVIOR_SLICE3,
    ensure_type_behavior_slices,
)

ROOT = Path(__file__).resolve().parents[2]
URL = "postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/fair_stand"
PAYLOAD = Path(__file__).with_name("_live_item_types.json")
NODE = Path(__file__).with_name("verify_live_item_type_placement_motor.mjs")


def main() -> int:
    eng = create_engine(URL)
    with Session(eng) as session:
        ver = session.execute(text("select version_num from alembic_version")).scalar()
        if ver != "0033_item_type_overlap_fk":
            print(f"FAIL alembic={ver!r} expected 0033_item_type_overlap_fk")
            return 1

        ensure_type_behavior_slices(session)
        session.commit()

        rows = session.execute(
            text(
                """
                SELECT key, placement, collision, move_snap_cm,
                       magnetic_snap, allow_side_insert, supports_wall_overlay_mount,
                       wall_capacity, connection_endpoint, collision_depth,
                       endpoint_contact, boundary_snap, collision_height,
                       ghost_kind, ghost_renderer, ghost_opacity,
                       is_active, id
                FROM fair_stand_item_type
                ORDER BY key
                """
            )
        ).mappings().all()

        overlap_rows = session.execute(
            text(
                """
                SELECT src.key AS src_key, tgt.key AS tgt_key
                FROM fair_stand_item_type_overlap o
                JOIN fair_stand_item_type src ON src.id = o.item_type_id
                JOIN fair_stand_item_type tgt ON tgt.id = o.overlap_item_type_id
                ORDER BY src.key, tgt.key
                """
            )
        ).mappings().all()
        overlaps_by_src: dict[str, list[str]] = {}
        for row in overlap_rows:
            overlaps_by_src.setdefault(row["src_key"], []).append(row["tgt_key"])

        by_key = {r["key"]: r for r in rows}
        expected_keys = (
            set(TYPE_BEHAVIOR_SLICE1) | set(TYPE_BEHAVIOR_SLICE2) | set(TYPE_BEHAVIOR_SLICE3)
        )
        missing = sorted(expected_keys - set(by_key))
        if missing:
            print(f"FAIL missing types: {missing}")
            return 1

        has_json_col = session.execute(
            text(
                """
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'fair_stand_item_type'
                  AND column_name = 'overlap_with_types'
                """
            )
        ).scalar()
        if has_json_col:
            print("FAIL overlap_with_types column must be dropped after FK migration")
            return 1

        mismatches: list[str] = []
        for key, (placement, collision, move_snap_cm) in TYPE_BEHAVIOR_SLICE1.items():
            row = by_key[key]
            got = (row["placement"], row["collision"], int(row["move_snap_cm"]))
            want = (placement, collision, move_snap_cm)
            if got != want:
                mismatches.append(f"{key} s1: got {got} want {want}")
        for key, (magnetic, allow_side, supports_overlay, capacity) in TYPE_BEHAVIOR_SLICE2.items():
            row = by_key[key]
            got = (
                row["magnetic_snap"],
                bool(row["allow_side_insert"]),
                bool(row["supports_wall_overlay_mount"]),
                row["wall_capacity"],
            )
            want = (magnetic, allow_side, supports_overlay, capacity)
            if got != want:
                mismatches.append(f"{key} s2: got {got} want {want}")
        for key, expected in TYPE_BEHAVIOR_SLICE3.items():
            (
                endpoint,
                depth,
                contact,
                boundary,
                height,
                overlap,
                ghost_kind,
                ghost_renderer,
                ghost_opacity,
            ) = expected
            row = by_key[key]
            got = (
                row["connection_endpoint"],
                row["collision_depth"],
                row["endpoint_contact"],
                row["boundary_snap"],
                row["collision_height"],
                overlaps_by_src.get(key, []),
                row["ghost_kind"],
                row["ghost_renderer"],
                Decimal(str(row["ghost_opacity"])),
            )
            want = (
                endpoint,
                depth,
                contact,
                boundary,
                height,
                sorted(overlap),
                ghost_kind,
                ghost_renderer,
                ghost_opacity,
            )
            if got != want:
                mismatches.append(f"{key} s3: got {got} want {want}")
        if mismatches:
            print("FAIL mismatches:")
            for line in mismatches:
                print(" ", line)
            return 1

        nulls = [
            r["key"]
            for r in rows
            if r["placement"] is None
            or r["collision"] is None
            or r["move_snap_cm"] is None
            or r["magnetic_snap"] is None
            or r["wall_capacity"] is None
            or r["connection_endpoint"] is None
            or r["collision_depth"] is None
            or r["endpoint_contact"] is None
            or r["boundary_snap"] is None
            or r["collision_height"] is None
            or r["ghost_kind"] is None
            or r["ghost_renderer"] is None
            or r["ghost_opacity"] is None
        ]
        if nulls:
            print(f"FAIL null behavior cols: {nulls}")
            return 1

        item_has_placement = session.execute(
            text(
                """
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'fair_stand_items'
                  AND column_name = 'placement'
                """
            )
        ).scalar()
        if item_has_placement:
            print("FAIL fair_stand_items must not have placement column")
            return 1

        wall = session.execute(
            text("SELECT item_key, item_type FROM fair_stand_items WHERE item_key = 'wall_200_350'")
        ).mappings().one()
        if wall["item_type"] != "flat-panel":
            print(f"FAIL wall_200 type={wall['item_type']!r}")
            return 1

        bootstrap_types = []
        for i, r in enumerate(rows):
            if not r["is_active"]:
                continue
            bootstrap_types.append(
                {
                    "id": i + 1,
                    "key": r["key"],
                    "displayName": r["key"],
                    "placement": r["placement"],
                    "collision": r["collision"],
                    "moveSnapCm": int(r["move_snap_cm"]),
                    "magneticSnap": r["magnetic_snap"],
                    "allowSideInsert": bool(r["allow_side_insert"]),
                    "supportsWallOverlayMount": bool(r["supports_wall_overlay_mount"]),
                    "wallCapacity": r["wall_capacity"],
                    "connectionEndpoint": r["connection_endpoint"],
                    "collisionDepth": r["collision_depth"],
                    "endpointContact": r["endpoint_contact"],
                    "boundarySnap": r["boundary_snap"],
                    "collisionHeight": r["collision_height"],
                    "overlapWithTypes": list(overlaps_by_src.get(r["key"], [])),
                    "ghost": {
                        "kind": r["ghost_kind"],
                        "renderer": r["ghost_renderer"],
                        "opacity": float(r["ghost_opacity"]),
                    },
                    "isActive": True,
                }
            )

    PAYLOAD.write_text(json.dumps(bootstrap_types, ensure_ascii=False), encoding="utf-8")
    result = subprocess.run(
        ["node", str(NODE)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    print(result.stdout.strip())
    if result.returncode != 0:
        print(result.stderr)
        print("FAIL node motor")
        return 1

    print(
        f"OK live Postgres: alembic={ver} types={len(rows)} "
        f"overlap_edges={len(overlap_rows)} slice3={len(TYPE_BEHAVIOR_SLICE3)} motor=ok"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
