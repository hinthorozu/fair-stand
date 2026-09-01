from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()

def replace_function(src, name, replacement=''):
    start = src.find(f'function {name}(')
    if start < 0:
        raise SystemExit(f'{name} not found')
    brace = src.find('{', start)
    depth = 0
    end = None
    for i in range(brace, len(src)):
        if src[i] == '{':
            depth += 1
        elif src[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end is None:
        raise SystemExit(f'{name} block not closed')
    return src[:start] + replacement + src[end:]

# Remove the legacy floating screen overlay completely.
if 'function addTvScreenOverlay(' in s:
    s = replace_function(s, 'addTvScreenOverlay', '')
s = s.replace('addTvScreenOverlay(group);', '')

replacement = r'''function createTvModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';

  const blackMaterial = () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.05,
  });

  // BoxGeometry face material order:
  // +X, -X, +Y, -Y, +Z(front), -Z(back).
  // The TV is ONE 93 x 52.3 x 5 cm solid. No extra screen plane exists.
  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    new THREE.MeshBasicMaterial({
      map: getTvScreenTexture(),
      toneMapped: false,
    }),
    blackMaterial(),
  ];

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    materials,
  );
  tv.position.set(0, centerYM, 0);
  tv.castShadow = true;
  tv.receiveShadow = true;
  tv.userData.kind = 'surface';
  tv.userData.surfaceId = `${moduleState.id}:tv`;
  tv.userData.moduleId = moduleState.id;
  tv.userData.moduleType = 'tv';
  tv.userData.moduleIndex = moduleIndex;
  tv.userData.acceptsImage = false;
  tv.userData.selectionMode = 'module';
  group.add(tv);

  return { group, surfaces: [tv] };
}'''

s = replace_function(s, 'createTvModule', replacement)
scene.write_text(s)

# Update the focused TV renderer test to lock the single-solid contract.
test = Path('test/tv42Module.test.js')
t = test.read_text()
old_start = "test('TV renderer is procedural and maps the supplied screen image to the front face', () => {"
if old_start not in t:
    old_start = "test('TV renderer is one 5 cm BoxGeometry with the supplied image only on its front face', () => {"
start = t.find(old_start)
if start < 0:
    raise SystemExit('TV renderer test not found')
end = t.find("\n});", start)
if end < 0:
    raise SystemExit('TV renderer test end not found')
end += len("\n});")
new_test = r'''test('TV renderer is one 5 cm BoxGeometry with the supplied image only on its front face', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createTvModule(');
  const finish = source.indexOf('\n}', start) + 2;
  const tvSource = source.slice(start, finish);
  assert.ok(start >= 0);
  assert.doesNotMatch(source, /models\/tv\.glb/);
  assert.doesNotMatch(source, /loadTvModel/);
  assert.doesNotMatch(source, /addTvScreenOverlay/);
  assert.doesNotMatch(source, /tv-screen-image-overlay/);
  assert.match(tvSource, /const depthM = 0\.05/);
  assert.match(tvSource, /new THREE\.BoxGeometry\(widthM, heightM, depthM\)/);
  assert.match(tvSource, /map: getTvScreenTexture\(\)/);
  assert.doesNotMatch(tvSource, /new THREE\.PlaneGeometry/);
});'''
t = t[:start] + new_test + t[end:]
test.write_text(t)
