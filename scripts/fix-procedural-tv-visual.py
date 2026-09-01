from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text()

start = s.find('function createTvModule(moduleState, moduleIndex)')
if start < 0:
    raise SystemExit('createTvModule not found')
brace = s.find('{', start)
depth = 0
end = None
for i in range(brace, len(s)):
    if s[i] == '{': depth += 1
    elif s[i] == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break
if end is None:
    raise SystemExit('createTvModule block not closed')

replacement = r'''function createTvModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;
  const bezelM = 0.012;
  const frontZ = depthM / 2 + 0.0015;
  const backZ = -(depthM / 2 + 0.0015);

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';

  // Keep the TV centered on its local origin so the 5 cm body is a single slab.
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.72,
      metalness: 0.05,
    }),
  );
  body.position.set(0, centerYM, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Front screen: only this face carries the user-provided TV image.
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(
      Math.max(0.02, widthM - bezelM * 2),
      Math.max(0.02, heightM - bezelM * 2),
    ),
    new THREE.MeshBasicMaterial({
      map: getTvScreenTexture(),
      toneMapped: false,
      side: THREE.FrontSide,
    }),
  );
  screen.position.set(0, centerYM, frontZ);
  screen.renderOrder = 3;
  group.add(screen);

  // Back cover gives a clearly different rear face without creating a second slab.
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(widthM - 0.02, heightM - 0.02),
    new THREE.MeshStandardMaterial({
      color: 0x2d2d2d,
      roughness: 0.9,
      metalness: 0,
      side: THREE.FrontSide,
    }),
  );
  back.rotation.y = Math.PI;
  back.position.set(0, centerYM, backZ);
  group.add(back);

  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  proxy.position.set(0, centerYM, 0);
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

s = s[:start] + replacement + s[end:]
p.write_text(s)
