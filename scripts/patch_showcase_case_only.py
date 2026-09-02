from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()
newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

start = scene.index('function createShowcaseModule(')
end = scene.index('\nfunction createSelectionFrame(', start)
block = scene[start:end]

old_frame = """  // Vitrin modulu komple beyaz kasalidir; cam yalnizca yatay raflarda kullanilir.
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.58,
  });
"""
new_frame = """  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });
"""
if block.count(old_frame) != 1:
    raise SystemExit(f'outer showcase-module frame block match count: {block.count(old_frame)}')
block = block.replace(old_frame, new_frame, 1)

old_backing = '        color: isGlass ? GLASS_BACK_COLOR : 0xffffff,\n'
new_backing = '        color: isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,\n'
if block.count(old_backing) != 1:
    raise SystemExit(f'outer showcase-module backing match count: {block.count(old_backing)}')
block = block.replace(old_backing, new_backing, 1)

scene = scene[:start] + block + scene[end:]
with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseDepthDirection.test.js')
test = test_path.read_text(encoding='utf-8')
marker = "\n\ntest('showcase case is white and only horizontal shelves use glass material', () => {"
if marker in test:
    test = test[:test.index(marker)].rstrip() + '\n'

extra = r'''

test('showcase styling is isolated to the showcase box, not the parent module frame', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.match(showcase, /const frameMaterial = new THREE\.MeshStandardMaterial\(\{\s*color: FRAME_COLOR,\s*metalness: 0\.68,\s*roughness: 0\.28,/);
  assert.match(showcase, /color: isGlass \? GLASS_BACK_COLOR : PANEL_BACK_COLOR,/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /new THREE\.Mesh\(sidePanelGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\)/);
  assert.match(showcase, /const cap = new THREE\.Mesh\(capGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\);/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
'''
if 'showcase styling is isolated to the showcase box' not in test:
    test = test.rstrip() + extra

test_path.write_text(test, encoding='utf-8')
print('restored parent module styling; showcase-box styling remains isolated')
