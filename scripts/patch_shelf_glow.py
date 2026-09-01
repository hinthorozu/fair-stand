from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text(encoding='utf-8')
old = """      // Geniş alan ışığı spot konisini kaldırır ve raf eni boyunca homojen yayılır.
      const areaLight = new THREE.RectAreaLight(
        0xffe4c8,
        28.0,
        ledStripWidthM,
        Math.max(shelfDepthM * 0.95, 0.18),
      );
      areaLight.position.set(
        0,
        shelfBottomY - 0.006,
        wallDepthM / 2 + shelfDepthM * 0.54,
      );
      areaLight.lookAt(new THREE.Vector3(
        0,
        shelfBottomY - 0.55,
        wallDepthM / 2 + shelfDepthM * 0.20,
      ));
      areaLight.userData.kind = 'decoration';
      areaLight.userData.role = 'shelf-under-light';
      built.group.add(areaLight);
"""
new = """      // Raf altındaki yerel parıltı; gerçek ışık yok, duvar ve malzeme renklerini etkilemez.
      const glowDepthM = Math.max(shelfDepthM * 0.72, 0.14);
      const underGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(ledStripWidthM, glowDepthM),
        new THREE.MeshBasicMaterial({
          color: 0xfff3dc,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
      underGlow.rotation.x = -Math.PI / 2;
      underGlow.position.set(
        0,
        shelfBottomY - 0.009,
        wallDepthM / 2 + shelfDepthM * 0.62,
      );
      underGlow.userData.kind = 'decoration';
      underGlow.userData.role = 'shelf-under-light';
      built.group.add(underGlow);
"""
if old not in s:
    raise SystemExit('shelf area light block not found')
scene.write_text(s.replace(old, new, 1), encoding='utf-8')

test = Path('test/shelfLighting.test.js')
t = test.read_text(encoding='utf-8')
t = t.replace("  assert.match(source, /new THREE\\.RectAreaLight\\(/);\n", "  assert.match(source, /new THREE\\.PlaneGeometry\\(ledStripWidthM, glowDepthM\\)/);\n", 1)
t = t.replace("  assert.match(source, /0xffe4c8/);\n", "  assert.match(source, /0xfff3dc/);\n", 1)
test.write_text(t, encoding='utf-8')

Path('.github/workflows/build.yml').write_text("""name: Build

on:
  push:
    branches: [ROG]
  pull_request:
    branches: [ROG]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
""", encoding='utf-8')

helper = Path('.github/workflows/optimize-shelf-light.yml')
if helper.exists():
    helper.unlink()

Path(__file__).unlink()
