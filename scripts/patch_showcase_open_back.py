from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()
newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

old = """  const backPanel = new THREE.Mesh(\n    new THREE.BoxGeometry(innerWidth, openingHeight, 0.018),\n    showcaseWhiteMaterial.clone(),\n  );\n  // Arka kapak modulun eski arka duzleminde degil, vitrinin 30 cm kasasinin\n  // en arka ucunda durur. 9 mm ofset panel kalinliginin merkezidir.\n  backPanel.position.set(0, openingCenterY, caseFrontZ - showcaseDepth + 0.009);\n  backPanel.receiveShadow = true;\n  group.add(backPanel);\n\n"""

count = scene.count(old)
if count != 1:
    raise SystemExit(f'expected exactly one showcase backPanel block, found {count}')
scene = scene.replace(old, '', 1)

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseDepthDirection.test.js')
test = test_path.read_text(encoding='utf-8')
old_assert = "  assert.match(scene, /backPanel\\.position\\.set\\(0, openingCenterY, caseFrontZ - showcaseDepth \\+ 0\\.009\\);/);\n"
if test.count(old_assert) != 1:
    raise SystemExit(f'expected old backPanel assertion once, found {test.count(old_assert)}')
test = test.replace(old_assert, '', 1)

open_back_test = """

test('showcase rear is open while the showcase case remains intact', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);
  assert.doesNotMatch(showcase, /group\.add\(backPanel\)/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /const cap = new THREE\.Mesh\(capGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\);/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
"""
if "showcase rear is open while the showcase case remains intact" not in test:
    test += open_back_test

test_path.write_text(test, encoding='utf-8')

print('showcase rear panel removed; case remains open-backed')
