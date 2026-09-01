from pathlib import Path

path = Path('src/scene3d.js')
s = path.read_text()


def replace_braced_function(text, signature, replacement):
    start = text.find(signature)
    if start < 0:
        raise SystemExit(f'not found: {signature}')
    brace = text.find('{', start)
    depth = 0
    i = brace
    while i < len(text):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return text[:start] + replacement + text[i + 1:]
        i += 1
    raise SystemExit(f'unclosed block: {signature}')

start = s.find('let tvModelPromise = null;')
if start < 0:
    raise SystemExit('tvModelPromise block not found')
fn_start = s.find('function loadTvModel()', start)
if fn_start < 0:
    raise SystemExit('loadTvModel not found')
brace = s.find('{', fn_start)
depth = 0
end = None
for i in range(brace, len(s)):
    if s[i] == '{':
        depth += 1
    elif s[i] == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
if end is None:
    raise SystemExit('loadTvModel block unclosed')

texture_helper = """let tvScreenTexture = null;\n\nfunction getTvScreenTexture() {\n  if (!tvScreenTexture) {\n    tvScreenTexture = new THREE.TextureLoader().load(TV_SCREEN_DATA_URL);\n    tvScreenTexture.colorSpace = THREE.SRGBColorSpace;\n  }\n  return tvScreenTexture;\n}\n"""
s = s[:start] + texture_helper + s[end:]

procedural_tv = r'''function createTvModule(moduleState, moduleIndex) {
  const targetWidthM = Number(moduleState.screenWidthCm || 93) / 100;
  const targetHeightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;
  const bezelM = 0.012;

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.58,
    metalness: 0.12,
  });
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(targetWidthM, targetHeightM, depthM),
    bodyMaterial,
  );
  body.position.set(0, centerYM, depthM / 2);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const screenMaterial = new THREE.MeshBasicMaterial({
    map: getTvScreenTexture(),
    toneMapped: false,
    side: THREE.FrontSide,
  });
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(
      Math.max(0.02, targetWidthM - bezelM * 2),
      Math.max(0.02, targetHeightM - bezelM * 2),
    ),
    screenMaterial,
  );
  screen.position.set(0, centerYM, depthM + 0.001);
  screen.renderOrder = 2;
  group.add(screen);

  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(targetWidthM, targetHeightM, depthM),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  proxy.position.set(0, centerYM, depthM / 2);
  proxy.userData.kind = 'surface';
  proxy.userData.surfaceId = `${moduleState.id}:tv`;
  proxy.userData.moduleId = moduleState.id;
  proxy.userData.moduleType = 'tv';
  proxy.userData.moduleIndex = moduleIndex;
  proxy.userData.acceptsImage = false;
  proxy.userData.selectionMode = 'module';
  group.add(proxy);

  return { group, surfaces: [proxy] };
}'''
s = replace_braced_function(s, 'function createTvModule(moduleState, moduleIndex)', procedural_tv)

marker = "if (ghostBehavior.renderer === 'tv')"
start = s.find(marker)
if start < 0:
    raise SystemExit('TV ghost branch not found')
brace = s.find('{', start)
depth = 0
end = None
for i in range(brace, len(s)):
    if s[i] == '{':
        depth += 1
    elif s[i] == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
if end is None:
    raise SystemExit('TV ghost branch unclosed')

ghost = r'''if (ghostBehavior.renderer === 'tv') {
    const root = new THREE.Group();
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.523, 0.05),
      ghostMaterial,
    );
    mesh.position.set(0, 1.75, 0.025);
    mesh.renderOrder = 10000;
    root.add(mesh);
    scene.add(root);

    placementGhost = {
      root,
      mesh,
      tintMaterials: [ghostMaterial],
      key,
      widthCm: dimensions.widthCm,
      ownsGeometry: true,
      colorHex: PLACEMENT_VALID_COLOR,
    };
    return placementGhost;
  }'''
s = s[:start] + ghost + s[end:]

path.write_text(s)
Path('public/models/tv.glb').unlink(missing_ok=True)

# Update TV-specific tests from the old GLB contract to the procedural contract.
test_path = Path('test/tv42Module.test.js')
t = test_path.read_text()
t = t.replace(
"test('TV 42 catalog and state use one shared GLB-scaled 93.0 x 52.3 screen', () => {",
"test('TV 42 catalog and state use one shared 93.0 x 52.3 screen', () => {",
)
t = t.replace(
"""test('TV renderer loads shared tv.glb and hides receiver meshes', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /models\\/tv\\.glb/);\n  assert.match(source, /new Set\\(\\['Object_4', 'Object_5'\\]\\)/);\n  assert.match(source, /KYROX/);\n});""",
"""test('TV renderer is procedural and maps the supplied screen image to the front face', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.doesNotMatch(source, /models\\/tv\\.glb/);\n  assert.doesNotMatch(source, /loadTvModel/);\n  assert.match(source, /new THREE\\.BoxGeometry\\(targetWidthM, targetHeightM, depthM\\)/);\n  assert.match(source, /map: getTvScreenTexture\\(\\)/);\n  assert.match(source, /side: THREE\\.FrontSide/);\n});""",
)
t = t.replace(
"""test('TV asset GLB header length matches actual file size', () => {\n  const data = fs.readFileSync(new URL('../public/models/tv.glb', import.meta.url));\n  assert.equal(data.subarray(0, 4).toString('ascii'), 'glTF');\n  assert.equal(data.readUInt32LE(4), 2);\n  assert.equal(data.readUInt32LE(8), data.length);\n  assert.ok(data.length > 1000);\n});""",
"""test('TV no longer depends on a GLB asset', () => {\n  assert.equal(fs.existsSync(new URL('../public/models/tv.glb', import.meta.url)), false);\n  const imageSource = fs.readFileSync(new URL('../src/tvScreenImage.js', import.meta.url), 'utf8');\n  assert.match(imageSource, /data:image\\/jpeg;base64,/);\n});""",
)
test_path.write_text(t)
