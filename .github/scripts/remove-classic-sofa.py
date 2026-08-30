from pathlib import Path
import re

catalog = Path('src/catalog.js')
text = catalog.read_text()
text, n = re.subn(
    r"\nexport const furniture_sofa_set_classic_DIMENSIONS = Object\.freeze\(\{.*?\n\}\);\n",
    "\n",
    text,
    flags=re.S,
)
if n != 1:
    raise SystemExit(f'classic dimensions block removals: {n}')
text = re.sub(r"^\s*furniture_sofa_set_classic:.*\n", "", text, flags=re.M)
text = re.sub(r"^\s*'furniture_sofa_set_classic',\s*\n", "", text, flags=re.M)
catalog.write_text(text)

scene = Path('src/scene3d.js')
text = scene.read_text()
start = text.find('function createSofaSetModule(moduleState, moduleIndex) {')
end = text.find('function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {', start)
if start < 0 or end < 0:
    raise SystemExit('classic sofa renderer function boundaries not found')
text = text[:start] + text[end:]

# Remove remaining active references to the deleted classic type/renderer.
lines = []
for line in text.splitlines(keepends=True):
    if 'createSofaSetModule(' in line:
        continue
    if re.search(r"['\"]sofa-set['\"]", line):
        continue
    lines.append(line)
text = ''.join(lines)
scene.write_text(text)

# Hard guard: classic catalog id/type must be gone from src, while beige stays.
residuals = []
for path in Path('src').rglob('*'):
    if not path.is_file():
        continue
    try:
        data = path.read_text()
    except UnicodeDecodeError:
        continue
    if 'furniture_sofa_set_classic' in data or re.search(r"['\"]sofa-set['\"]", data):
        residuals.append(str(path))
if residuals:
    raise SystemExit('classic sofa references remain: ' + ', '.join(residuals))
