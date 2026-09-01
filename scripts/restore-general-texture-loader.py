from pathlib import Path
p=Path('src/scene3d.js')
s=p.read_text()
needle="  const raycaster = new THREE.Raycaster();\n  const pointer = new THREE.Vector2();\n"
replacement=needle+"  // Shared loader for normal editable surface images. TV uses its own Blob/object-URL path.\n  const textureLoader = new THREE.TextureLoader();\n"
if "const textureLoader = new THREE.TextureLoader();" in s[s.index('export function createStandScene'):s.index('let surfaceMeshes')]:
    raise SystemExit('general textureLoader already present')
if needle not in s:
    raise SystemExit('insertion point not found')
s=s.replace(needle,replacement,1)
p.write_text(s)

t=Path('test/tv42Module.test.js')
ts=t.read_text()
marker="test('TV texture avoids loading the data URI as a URL', () => {"
guard="""test('scene keeps the shared textureLoader for normal panel images', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  const sceneStart = source.indexOf('export function createStandScene');\n  const surfaceStart = source.indexOf('let surfaceMeshes', sceneStart);\n  const setupSource = source.slice(sceneStart, surfaceStart);\n  assert.match(setupSource, /const textureLoader = new THREE\\.TextureLoader\\(\\)/);\n});\n\n"""
if guard not in ts:
    ts=ts.replace(marker,guard+marker,1)
t.write_text(ts)
