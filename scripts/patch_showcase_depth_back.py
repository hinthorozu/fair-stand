from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()

newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

old = """  const caseCenterZ = (showcaseDepth - depth) / 2;\n  const caseFrontZ = caseCenterZ + showcaseDepth / 2;\n"""
new = """  // Vitrinin on yuzu modulun on panel duzleminde kalir; 36 cm derinligin\n  // standart modul derinligini asan kismi tamamen arkaya dogru tasar.\n  const caseFrontZ = depth / 2;\n  const caseCenterZ = caseFrontZ - showcaseDepth / 2;\n"""

count = scene.count(old)
if count < 1:
    raise SystemExit('showcase depth block not found')
scene = scene.replace(old, new)

if '(showcaseDepth - depth) / 2' in scene:
    raise SystemExit('old forward showcase depth formula still exists')

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseDepthDirection.test.js')
test_path.write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\n\nconst scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n\ntest('showcase extra depth projects behind the panel, not in front', () => {\n  assert.match(scene, /const caseFrontZ = depth \/ 2;/);\n  assert.match(scene, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);\n  assert.doesNotMatch(scene, /caseCenterZ = \\(showcaseDepth - depth\\) \/ 2/);\n});\n""", encoding='utf-8')

print(f'showcase rear-depth patch applied to {count} render block(s)')
