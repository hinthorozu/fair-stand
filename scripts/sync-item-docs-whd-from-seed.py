"""Align docs/items/* dimension fields with test/fixtures/itemCatalogSeed.json (W/H/D only)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "test" / "fixtures" / "itemCatalogSeed.json"
DOCS_ITEMS = ROOT / "docs" / "items"

LEGACY_DIM_LINE = re.compile(
    r"^\| `dimensions\.(lengthCm|thicknessCm)` \|.*\|\s*$",
    re.MULTILINE,
)
LEGACY_SCENE_LINE = re.compile(
    r"^\| `sceneDimensions\.(lengthCm|thicknessCm)` \|.*\|\s*$",
    re.MULTILINE,
)


def fmt_num(value) -> str:
    if value is None:
        return ""
    text = str(value)
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def camel_dims(dims: dict | None) -> dict[str, str]:
    if not dims:
        return {}
    out = {}
    mapping = {
        "width_cm": "widthCm",
        "depth_cm": "depthCm",
        "height_cm": "heightCm",
        "mount_height_cm": "mountHeightCm",
        "wall_gap_cm": "wallGapCm",
    }
    for db_key, js_key in mapping.items():
        if dims.get(db_key) is not None:
            out[js_key] = fmt_num(dims[db_key])
    return out


def camel_scene(scene: dict | None) -> dict[str, str]:
    if not scene:
        return {}
    out = {}
    for db_key, js_key in (
        ("width_cm", "widthCm"),
        ("depth_cm", "depthCm"),
        ("height_cm", "heightCm"),
    ):
        if scene.get(db_key) is not None:
            out[js_key] = fmt_num(scene[db_key])
    return out


def dimension_table_rows(dims: dict[str, str], scene: dict[str, str]) -> list[str]:
    rows = []
    for key in ("widthCm", "depthCm", "heightCm", "mountHeightCm", "wallGapCm"):
        if key in dims:
            rows.append(f"| `dimensions.{key}` | {dims[key]} | item kaydı |")
    for key in ("widthCm", "depthCm", "heightCm"):
        if key in scene:
            rows.append(f"| `sceneDimensions.{key}` | {scene[key]} | item kaydı |")
    return rows


def patch_static_table(content: str, rows: list[str]) -> str:
    content = LEGACY_DIM_LINE.sub("", content)
    content = LEGACY_SCENE_LINE.sub("", content)
    if not rows:
        return content
    marker = "## 1. Statik kayıt alanları"
    idx = content.find(marker)
    if idx < 0:
        return content
    table_start = content.find("| alan | değer | kapsam |", idx)
    if table_start < 0:
        return content
    header_end = content.find("\n", table_start)
    next_section = content.find("\n## ", header_end)
    if next_section < 0:
        next_section = len(content)
    block = content[table_start:next_section]
    for row in rows:
        field = row.split("|")[1].strip().strip("`")
        line_pat = re.compile(rf"^\| `{re.escape(field)}` \|.*\|\s*$", re.MULTILINE)
        if line_pat.search(block):
            block = line_pat.sub(row, block)
        else:
            block = block.rstrip() + "\n" + row + "\n"
    return content[:table_start] + block + content[next_section:]


DIM_BLOCK = re.compile(r"dimensions:\s*\{[^}]+\}", re.MULTILINE)


def js_dims_object(dims: dict[str, str]) -> str:
    parts = [f"{k}: {v}" for k, v in dims.items() if k in ("widthCm", "depthCm", "heightCm", "mountHeightCm", "wallGapCm")]
    return "dimensions: { " + ", ".join(parts) + " }"


def fix_prose_and_blocks(text: str, item_key: str, by_key: dict[str, dict]) -> str:
    text = text.replace("`lengthCm × depthCm × thicknessCm`", "`widthCm × depthCm × heightCm`")
    text = text.replace("lengthCm × depthCm × thicknessCm", "widthCm × depthCm × heightCm")
    text = re.sub(
        r"`lengthCm`, `thicknessCm`,",
        "`widthCm`, `depthCm`, `heightCm`,",
        text,
    )
    if item_key in by_key:
        row = by_key[item_key]
        dims = camel_dims(row.get("dimensions"))
        if dims and DIM_BLOCK.search(text):
            text = DIM_BLOCK.sub(js_dims_object(dims), text, count=1)
        w, d, h = dims.get("widthCm"), dims.get("depthCm"), dims.get("heightCm")
        if w and h and d:
            text = re.sub(
                rf"`lengthCm={re.escape(w)}`, `thicknessCm=[^`]+`",
                f"`widthCm={w}`, `depthCm={d}`, `heightCm={h}`",
                text,
            )
            text = re.sub(
                rf"lengthCm={re.escape(w)}, thicknessCm=[\d.]+",
                f"widthCm={w}, depthCm={d}, heightCm={h}",
                text,
            )
    return text


def load_seed() -> dict[str, dict]:
    payload = json.loads(SEED.read_text(encoding="utf-8"))
    by_key = {}
    for row in payload["items"]:
        by_key[row["item_key"]] = row
    return by_key


def main() -> None:
    by_key = load_seed()
    touched = 0
    for path in DOCS_ITEMS.rglob("*.md"):
        rel = path.name
        item_key = path.stem
        text = path.read_text(encoding="utf-8")
        orig = text
        text = LEGACY_DIM_LINE.sub("", text)
        text = LEGACY_SCENE_LINE.sub("", text)
        if item_key in by_key:
            row = by_key[item_key]
            dims = camel_dims(row.get("dimensions"))
            scene = camel_scene(row.get("scene_dimensions"))
            text = patch_static_table(text, dimension_table_rows(dims, scene))
        text = fix_prose_and_blocks(text, item_key, by_key)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            touched += 1
    print(f"updated {touched} markdown files under docs/items")


if __name__ == "__main__":
    main()
