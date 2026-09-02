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

# Depth-direction regression test: rear panel no longer exists.
depth_test_path = Path('test/showcaseDepthDirection.test.js')
depth_test = depth_test_path.read_text(encoding='utf-8')
old_assert = "  assert.match(scene, /backPanel\\.position\\.set\\(0, openingCenterY, caseFrontZ - showcaseDepth \\+ 0\\.009\\);/);\n"
if depth_test.count(old_assert) != 1:
    raise SystemExit(f'expected old backPanel assertion once, found {depth_test.count(old_assert)}')
depth_test = depth_test.replace(old_assert, '', 1)

open_back_test = r'''

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
'''
if "showcase rear is open while the showcase case remains intact" not in depth_test:
    depth_test += open_back_test
depth_test_path.write_text(depth_test, encoding='utf-8')

# Appearance regression test: keep white showcase case, explicitly require no rear panel.
appearance_path = Path('test/showcaseAppearance.test.js')
appearance = appearance_path.read_text(encoding='utf-8')
old_name = "test('showcase back, frame and top-bottom caps are white', () => {"
new_name = "test('showcase case stays white while rear remains open', () => {"
if appearance.count(old_name) != 1:
    raise SystemExit(f'expected showcase appearance test name once, found {appearance.count(old_name)}')
appearance = appearance.replace(old_name, new_name, 1)
old_back_assert = r"  assert.match(showcase, /const backPanel = new THREE\.Mesh\([\s\S]*?showcaseWhiteMaterial\.clone\(\)/);" + "\n"
new_back_assert = r"  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);" + "\n"
if appearance.count(old_back_assert) != 1:
    raise SystemExit(f'expected appearance backPanel assertion once, found {appearance.count(old_back_assert)}')
appearance = appearance.replace(old_back_assert, new_back_assert, 1)
appearance_path.write_text(appearance, encoding='utf-8')

print('showcase rear panel removed; case remains open-backed')
