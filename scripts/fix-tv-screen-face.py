from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()
old = """  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    }),
    blackMaterial(),
  ];"""
new = """  const screenMaterial = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
  });
  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    screenMaterial,
    screenMaterial,
  ];"""
if old not in s:
    raise SystemExit('TV material block not found')
s = s.replace(old, new, 1)
scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
t = t.replace("test('TV renderer is one 5 cm BoxGeometry with the supplied image only on its front face', () => {", "test('TV renderer is one 5 cm BoxGeometry with the supplied image on both Z faces', () => {")
t = t.replace("  assert.match(tvSource, /map: screenTexture/);", "  assert.match(tvSource, /const screenMaterial = new THREE\\.MeshBasicMaterial/);\n  assert.match(tvSource, /map: screenTexture/);\n  assert.match(tvSource, /screenMaterial,\\n    screenMaterial,/);")
test.write_text(t)
