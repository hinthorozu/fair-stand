from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text(encoding='utf-8')

old = """      const spot = new THREE.SpotLight(
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
"""

new = """      // Sağ-sol simetrik iki spot; raf genişliğinin çeyrek noktalarına yerleşir.
      const spotOffsets = [-innerWidthM * 0.25, innerWidthM * 0.25];
      spotOffsets.forEach((spotX) => {
        const spot = new THREE.SpotLight(
          0xfff2dc,
          14,
          1.0,
          0.68,
          0.82,
          1.6,
        );
        spot.position.set(
          spotX,
          shelfBottomY - 0.018,
          wallDepthM / 2 + shelfDepthM * 0.76,
        );
        spot.target.position.set(
          spotX,
          Math.max(0.04, shelfBottomY - 0.58),
          wallDepthM / 2 + shelfDepthM * 1.02,
        );
        spot.castShadow = false;
        spot.userData.kind = 'decoration';
        spot.userData.role = 'shelf-under-light';
        built.group.add(spot, spot.target);
      });
"""

if old not in s:
    raise SystemExit('single shelf spotlight block not found')
s = s.replace(old, new, 1)
scene.write_text(s, encoding='utf-8')

test = Path('test/shelfLighting.test.js')
t = test.read_text(encoding='utf-8')
needle = "  assert.match(source, /new THREE\\.SpotLight\\(/);\n"
replacement = needle + "  assert.match(source, /const spotOffsets = \\[-innerWidthM \\* 0\\.25, innerWidthM \\* 0\\.25\\]/);\n  assert.match(source, /spotOffsets\\.forEach\\(\\(spotX\\) =>/);\n"
if needle not in t:
    raise SystemExit('spotlight test marker not found')
t = t.replace(needle, replacement, 1)
test.write_text(t, encoding='utf-8')
