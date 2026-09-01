from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text(encoding='utf-8')

start_marker = """    if (shelfLightingOn) {
      // Boydan boya lineer LED: raf geometrisine dokunmadan alt yüzeye oturur.
"""
end_marker = """    }
  });

  return built;
}"""

start = s.find(start_marker)
if start < 0:
    raise SystemExit('shelf lighting block start not found')
end = s.find(end_marker, start)
if end < 0:
    raise SystemExit('shelf lighting block end not found')

replacement = """    if (shelfLightingOn) {
      // Gerçek raf altı aydınlatma: görünür lineer LED + aşağı/öne bakan spot.
      const ledStripWidthM = Math.max(innerWidthM - 0.04, 0.08);
      const ledStripDepthM = 0.016;
      const ledStripThicknessM = 0.006;
      const shelfBottomY = seamHeightM;
      const ledCenterZM = wallDepthM / 2 + shelfDepthM * 0.78;

      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(ledStripWidthM, ledStripThicknessM, ledStripDepthM),
        new THREE.MeshStandardMaterial({
          color: 0xfff4df,
          emissive: 0xffe3bd,
          emissiveIntensity: 3.2,
          roughness: 0.28,
          metalness: 0,
        }),
      );
      ledStrip.position.set(
        0,
        shelfBottomY - ledStripThicknessM / 2 - 0.001,
        ledCenterZM,
      );
      ledStrip.userData.kind = 'decoration';
      ledStrip.userData.role = 'shelf-under-led-strip';
      built.group.add(ledStrip);

      const spot = new THREE.SpotLight(
        0xfff2dc,
        20,
        1.15,
        0.78,
        0.82,
        1.6,
      );
      spot.position.set(
        0,
        shelfBottomY - 0.018,
        wallDepthM / 2 + shelfDepthM * 0.76,
      );
      spot.target.position.set(
        0,
        Math.max(0.04, shelfBottomY - 0.58),
        wallDepthM / 2 + shelfDepthM * 1.02,
      );
      spot.castShadow = false;
      spot.userData.kind = 'decoration';
      spot.userData.role = 'shelf-under-light';
      built.group.add(spot, spot.target);
    }
"""

s = s[:start] + replacement + s[end + len("    }\n"):]
scene.write_text(s, encoding='utf-8')

test = Path('test/shelfLighting.test.js')
t = test.read_text(encoding='utf-8')
old = """  assert.match(source, /new THREE\\.PlaneGeometry\\(ledStripWidthM, glowDepthM\\)/);
  assert.match(source, /shelf-under-led-strip/);
  assert.match(source, /color: 0xffefd2/);
  assert.match(source, /shelf-under-front-glow/);
  assert.match(source, /0xffedcf/);
  assert.match(source, /shelfBottomY - ledStripThicknessM \\/ 2 - 0\\.001/);
  assert.match(source, /opacity: 0\\.58/);
  assert.match(source, /role = 'shelf-under-light'/);
"""
new = """  assert.match(source, /new THREE\\.SpotLight\\(/);
  assert.match(source, /shelf-under-led-strip/);
  assert.match(source, /emissive: 0xffe3bd/);
  assert.match(source, /0xfff2dc/);
  assert.match(source, /shelfBottomY - ledStripThicknessM \\/ 2 - 0\\.001/);
  assert.match(source, /spot\\.castShadow = false/);
  assert.match(source, /role = 'shelf-under-light'/);
  assert.doesNotMatch(source, /shelf-under-front-glow/);
"""
if old not in t:
    raise SystemExit('shelf lighting test block not found')
t = t.replace(old, new, 1)
test.write_text(t, encoding='utf-8')
