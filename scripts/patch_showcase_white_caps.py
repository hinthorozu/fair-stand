from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()

newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

start = scene.index('function createShowcaseModule(')
end = scene.index('\nfunction createSelectionFrame', start)
block = scene[start:end]

replacements = [
    ('  const showcaseDepth = 0.36;\n', '  const showcaseDepth = 0.30;\n'),
    (
        "  const frameMaterial = new THREE.MeshStandardMaterial({\n    color: FRAME_COLOR,\n    metalness: 0.68,\n    roughness: 0.28,\n  });\n",
        "  const frameMaterial = new THREE.MeshStandardMaterial({\n    color: FRAME_COLOR,\n    metalness: 0.68,\n    roughness: 0.28,\n  });\n  const showcaseWhiteMaterial = new THREE.MeshStandardMaterial({\n    color: 0xffffff,\n    metalness: 0,\n    roughness: 0.72,\n  });\n",
    ),
    (
        '    new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.82 }),\n',
        '    showcaseWhiteMaterial.clone(),\n',
    ),
    (
        '    const post = new THREE.Mesh(frontPostGeometry.clone(), frameMaterial.clone());\n',
        '    const post = new THREE.Mesh(frontPostGeometry.clone(), showcaseWhiteMaterial.clone());\n',
    ),
    (
        '    const edge = new THREE.Mesh(frontEdgeGeometry.clone(), frameMaterial.clone());\n',
        '    const edge = new THREE.Mesh(frontEdgeGeometry.clone(), showcaseWhiteMaterial.clone());\n',
    ),
    (
        '    const shelfFront = new THREE.Mesh(shelfFrontGeometry.clone(), frameMaterial.clone());\n',
        '    const shelfFront = new THREE.Mesh(shelfFrontGeometry.clone(), showcaseWhiteMaterial.clone());\n',
    ),
]

for old, new in replacements:
    if block.count(old) != 1:
        raise SystemExit(f'expected exactly one showcase match for: {old[:70]!r}')
    block = block.replace(old, new, 1)

anchor = """  for (const side of [-1, 1]) {\n    const sideGlass = new THREE.Mesh(sideGlassGeometry.clone(), sideGlassMaterial.clone());\n    sideGlass.position.set(\n      side * (innerWidth / 2 - 0.009),\n      openingCenterY,\n      caseCenterZ,\n    );\n    group.add(sideGlass);\n  }\n\n"""
insert = anchor + """  const capGeometry = new THREE.BoxGeometry(\n    Math.max(innerWidth - 0.018, 0.02),\n    0.018,\n    showcaseDepth,\n  );\n  for (const y of [openingBottom, openingTop]) {\n    const cap = new THREE.Mesh(capGeometry.clone(), showcaseWhiteMaterial.clone());\n    cap.position.set(0, y, caseCenterZ);\n    cap.castShadow = true;\n    cap.receiveShadow = true;\n    group.add(cap);\n  }\n\n"""
if block.count(anchor) != 1:
    raise SystemExit('side glass anchor not found exactly once')
block = block.replace(anchor, insert, 1)

block = block.replace('36 cm derinligin', '30 cm derinligin')

scene = scene[:start] + block + scene[end:]

if 'const showcaseDepth = 0.36;' in block:
    raise SystemExit('old 36 cm showcase depth still exists')
if 'showcaseWhiteMaterial' not in block or 'const capGeometry' not in block:
    raise SystemExit('showcase white/cap patch incomplete')

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseAppearance.test.js')
test_path.write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const showcaseStart = scene.indexOf('function createShowcaseModule(');
const showcaseEnd = scene.indexOf('function createSelectionFrame', showcaseStart);
const showcase = scene.slice(showcaseStart, showcaseEnd);

test('showcase is 30 cm deep and projects behind the panel plane', () => {
  assert.match(showcase, /const showcaseDepth = 0\.30;/);
  assert.match(showcase, /const caseFrontZ = depth \/ 2;/);
  assert.match(showcase, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
});

test('showcase back, frame and top-bottom caps are white', () => {
  assert.match(showcase, /const showcaseWhiteMaterial = new THREE\.MeshStandardMaterial\(\{/);
  assert.match(showcase, /color: 0xffffff/);
  assert.match(showcase, /const backPanel = new THREE\.Mesh\([\s\S]*?showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /const capGeometry = new THREE\.BoxGeometry\([\s\S]*?showcaseDepth/);
  assert.match(showcase, /for \(const y of \[openingBottom, openingTop\]\)/);
  assert.match(showcase, /frontPostGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /frontEdgeGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /shelfFrontGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
});
""", encoding='utf-8')

print('showcase appearance patch applied')
