from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()

newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

old = "  backPanel.position.set(0, openingCenterY, -depth / 2 + 0.009);\n"
new = "  // Arka kapak modulun eski arka duzleminde degil, vitrinin 30 cm kasasinin\n  // en arka ucunda durur. 9 mm ofset panel kalinliginin merkezidir.\n  backPanel.position.set(0, openingCenterY, caseFrontZ - showcaseDepth + 0.009);\n"

count = scene.count(old)
if count != 1:
    raise SystemExit(f'expected exactly one showcase back-panel position, found {count}')
scene = scene.replace(old, new, 1)

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseDepthDirection.test.js')
test = test_path.read_text(encoding='utf-8')
needle = "  assert.match(scene, /const caseCenterZ = caseFrontZ - showcaseDepth \\/ 2;/);\n"
addition = needle + "  assert.match(scene, /backPanel\\.position\\.set\\(0, openingCenterY, caseFrontZ - showcaseDepth \\+ 0\\.009\\);/);\n"
if 'backPanel\\.position\\.set' not in test:
    if needle not in test:
        raise SystemExit('showcase depth test anchor not found')
    test = test.replace(needle, addition, 1)
test_path.write_text(test, encoding='utf-8')

print('showcase back panel moved to rear edge')
