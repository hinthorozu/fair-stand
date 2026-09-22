"""Copy fair_stand_item_dimensions from alembic dump into catalog_seed_data.py."""
from __future__ import annotations

import json
import re
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMP = ROOT / "backend" / "alembic" / "data" / "0002_fair_stand_catalog_dump.json"
SEED_PATH = ROOT / "backend" / "app" / "modules" / "fair_stand" / "infrastructure" / "catalog_seed_data.py"

DIM_KEYS = (
    "width_cm",
    "depth_cm",
    "height_cm",
    "mount_height_cm",
    "wall_gap_cm",
)


def py_num(value: Decimal) -> str:
    d = value.normalize()
    text = format(d, "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def format_dimensions_block(row: dict) -> str:
    lines = ['            "dimensions": {']
    for key in DIM_KEYS:
        val = row.get(key)
        if val is None:
            lines.append(f'                "{key}": None,')
        else:
            lines.append(f'                "{key}": {py_num(Decimal(str(val)))},')
    lines.append("            },")
    return "\n".join(lines)


def seed_item_keys(text: str) -> dict[str, str]:
    found = re.findall(r'"item_key": "([^"]+)"', text)
    return {key.lower(): key for key in found}


def main() -> None:
    payload = json.loads(DUMP.read_text(encoding="utf-8"))
    by_key = {r["item_key"]: r for r in payload["tables"]["fair_stand_item_dimensions"]}
    text = SEED_PATH.read_text(encoding="utf-8")
    key_map = seed_item_keys(text)
    updated = 0
    missing = []

    for dump_key, dim_row in sorted(by_key.items()):
        seed_key = key_map.get(dump_key.lower())
        if seed_key is None:
            missing.append(dump_key)
            continue
        pattern = (
            rf'("item_key": "{re.escape(seed_key)}",[\s\S]*?)'
            r'("dimensions": \{[\s\S]*?\},)'
        )
        match = re.search(pattern, text)
        if not match:
            missing.append(dump_key)
            continue
        replacement = format_dimensions_block(dim_row)
        new_text = text[: match.start(2)] + "\n" + replacement + text[match.end(2) :]
        if new_text != text:
            updated += 1
            text = new_text

    if missing:
        raise SystemExit(f"no seed block for dump keys: {missing[:15]} ... ({len(missing)} total)")

    SEED_PATH.write_text(text, encoding="utf-8")
    print(json.dumps({"items_in_dump": len(by_key), "blocks_updated": updated}, indent=2))


if __name__ == "__main__":
    main()
