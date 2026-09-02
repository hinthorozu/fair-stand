from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()
newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

start = scene.index('function createShowcaseModule(')
end = scene.index('\nfunction createSelectionFrame(', start)
block = scene[start:end]

old_frame = """  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });
"""
new_frame = """  // Vitrin modulu komple beyaz kasalidir; cam yalnizca yatay raflarda kullanilir.
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.58,
  });
"""
if block.count(old_frame) != 1:
    raise SystemExit(f'showcase frame material match count: {block.count(old_frame)}')
block = block.replace(old_frame, new_frame, 1)

old_side = """  const sideGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfe8e8,
    roughness: 0.18,
    metalness: 0,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const sideGlassGeometry = new THREE.BoxGeometry(0.018, openingHeight, showcaseDepth);
  for (const side of [-1, 1]) {
    const sideGlass = new THREE.Mesh(sideGlassGeometry.clone(), sideGlassMaterial.clone());
    sideGlass.position.set(
      side * (innerWidth / 2 - 0.009),
      openingCenterY,
      caseCenterZ,
    );
    group.add(sideGlass);
  }
"""
new_side = """  const sidePanelGeometry = new THREE.BoxGeometry(0.018, openingHeight, showcaseDepth);
  for (const side of [-1, 1]) {
    const sidePanel = new THREE.Mesh(sidePanelGeometry.clone(), showcaseWhiteMaterial.clone());
    sidePanel.position.set(
      side * (innerWidth / 2 - 0.009),
      openingCenterY,
      caseCenterZ,
    );
    sidePanel.castShadow = true;
    sidePanel.receiveShadow = true;
    group.add(sidePanel);
  }
"""
if block.count(old_side) != 1:
    raise SystemExit(f'showcase side-glass block match count: {block.count(old_side)}')
block = block.replace(old_side, new_side, 1)

# The solid panel backs belonging to this showcase module should also read white from behind.
old_backing_color = '        color: isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,\n'
new_backing_color = '        color: isGlass ? GLASS_BACK_COLOR : 0xffffff,\n'
if block.count(old_backing_color) != 1:
    raise SystemExit(f'showcase strip backing color match count: {block.count(old_backing_color)}')
block = block.replace(old_backing_color, new_backing_color, 1)

scene = scene[:start] + block + scene[end:]
with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

test_path = Path('test/showcaseDepthDirection.test.js')
test = test_path.read_text(encoding='utf-8')
extra = """

test('showcase case is white and only horizontal shelves use glass material', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.match(showcase, /const frameMaterial = new THREE\.MeshStandardMaterial\(\{\s*color: 0xffffff,/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /new THREE\.Mesh\(sidePanelGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\)/);
  assert.doesNotMatch(showcase, /sideGlassMaterial|sideGlassGeometry/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
"""
if "showcase case is white and only horizontal shelves use glass material" not in test:
    test += extra
    test_path.write_text(test, encoding='utf-8')

print('showcase made fully white except glass shelves')
