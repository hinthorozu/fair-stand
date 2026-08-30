from pathlib import Path
import re

ROOT = Path('.')

# 1) Catalog: remove classic dimensions block, catalog entry, and key.
catalog = Path('src/catalog.js')
text = catalog.read_text()
text = re.sub(
    r"\nexport const furniture_sofa_set_classic_DIMENSIONS = Object\.freeze\(\{.*?\n\}\);\n",
    "\n",
    text,
    flags=re.S,
)
text = re.sub(r"^\s*furniture_sofa_set_classic:.*\n", "", text, flags=re.M)
text = re.sub(r"^\s*'furniture_sofa_set_classic',\s*\n", "", text, flags=re.M)
catalog.write_text(text)

# 2) Scene renderer: remove the whole procedural classic sofa renderer block.
scene = Path('src/scene3d.js')
text = scene.read_text()
start = text.find('function createSofaSetModule(moduleState, moduleIndex) {')
if start >= 0:
    end = text.find('function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {', start)
    if end < 0:
        raise SystemExit('classic sofa renderer end boundary not found')
    text = text[:start] + text[end:]

# Remove any remaining direct renderer call / exact classic type branches.
text = ''.join(
    line for line in text.splitlines(keepends=True)
    if 'createSofaSetModule(' not in line
    and not re.search(r"['\"]sofa-set['\"]", line)
    and 'furniture_sofa_set_classic' not in line
)
scene.write_text(text)

# 3) Sweep source/tests/config text files for leftover exact classic references.
#    Beige sofa-set-beige is intentionally preserved because regex matches only exact quoted sofa-set.
skip_roots = {'.git', 'node_modules', 'dist', 'coverage', '.github'}
for path in ROOT.rglob('*'):
    if not path.is_file():
        continue
    if any(part in skip_roots for part in path.parts):
        continue
    try:
        data = path.read_text()
    except (UnicodeDecodeError, OSError):
        continue
    if 'furniture_sofa_set_classic' not in data and not re.search(r"['\"]sofa-set['\"]", data) and 'createSofaSetModule' not in data:
        continue
    cleaned = ''.join(
        line for line in data.splitlines(keepends=True)
        if 'furniture_sofa_set_classic' not in line
        and 'createSofaSetModule' not in line
        and not re.search(r"['\"]sofa-set['\"]", line)
    )
    path.write_text(cleaned)

# 4) Hard guard across the whole tracked workspace (except temporary workflow/script).
residuals = []
for path in ROOT.rglob('*'):
    if not path.is_file():
        continue
    if any(part in skip_roots for part in path.parts):
        continue
    try:
        data = path.read_text()
    except (UnicodeDecodeError, OSError):
        continue
    if (
        'furniture_sofa_set_classic' in data
        or 'createSofaSetModule' in data
        or re.search(r"['\"]sofa-set['\"]", data)
    ):
        residuals.append(str(path))

if residuals:
    raise SystemExit('classic sofa references remain: ' + ', '.join(residuals))

# Beige GLB must still exist in source.
if 'furniture_sofa_set_beige' not in Path('src/catalog.js').read_text():
    raise SystemExit('beige sofa catalog entry was removed unexpectedly')
