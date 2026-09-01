from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text(encoding='utf-8')

old_dims = """      const ledStripDepthM = 0.016;
      const ledStripThicknessM = 0.006;
"""
new_dims = """      const ledStripDepthM = 0.028;
      const ledStripThicknessM = 0.008;
"""
if old_dims not in s:
    raise SystemExit('LED dimensions block not found')
s = s.replace(old_dims, new_dims, 1)

old_material = """        new THREE.MeshStandardMaterial({
          color: 0xfff6e8,
          emissive: 0xffddb5,
          emissiveIntensity: 6.0,
          roughness: 0.28,
          metalness: 0,
        }),
"""
new_material = """        new THREE.MeshBasicMaterial({
          color: 0xffefd2,
        }),
"""
if old_material not in s:
    raise SystemExit('LED strip material block not found')
s = s.replace(old_material, new_material, 1)

old_glow_material = """          color: 0xfff3dc,
          transparent: true,
          opacity: 0.18,
"""
new_glow_material = """          color: 0xffedcf,
          transparent: true,
          opacity: 0.38,
"""
if old_glow_material not in s:
    raise SystemExit('under-glow material block not found')
s = s.replace(old_glow_material, new_glow_material, 1)

marker = """      underGlow.userData.kind = 'decoration';
      underGlow.userData.role = 'shelf-under-light';
      built.group.add(underGlow);
"""
addition = marker + """

      // Ön kenarın hemen altında görünen ince bloom bandı; sahne ışığı değildir.
      const frontGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(ledStripWidthM, 0.045),
        new THREE.MeshBasicMaterial({
          color: 0xffefd2,
          transparent: true,
          opacity: 0.58,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
      frontGlow.position.set(
        0,
        shelfBottomY - 0.024,
        wallDepthM / 2 + shelfDepthM + 0.004,
      );
      frontGlow.userData.kind = 'decoration';
      frontGlow.userData.role = 'shelf-under-front-glow';
      built.group.add(frontGlow);
"""
if marker not in s:
    raise SystemExit('underGlow marker not found')
s = s.replace(marker, addition, 1)
scene.write_text(s, encoding='utf-8')

test = Path('test/shelfLighting.test.js')
t = test.read_text(encoding='utf-8')
t = t.replace("  assert.match(source, /color: 0xfff6e8/);\n", "  assert.match(source, /color: 0xffefd2/);\n", 1)
t = t.replace("  assert.match(source, /emissive: 0xffddb5/);\n", "  assert.match(source, /shelf-under-front-glow/);\n", 1)
t = t.replace("  assert.match(source, /0xfff3dc/);\n", "  assert.match(source, /0xffedcf/);\n", 1)
t = t.replace(
    "  assert.match(source, /shelfBottomY - ledStripThicknessM \\/ 2 - 0\\.001/);\n",
    "  assert.match(source, /shelfBottomY - ledStripThicknessM \\/ 2 - 0\\.001/);\n  assert.match(source, /opacity: 0\\.58/);\n",
    1,
)
test.write_text(t, encoding='utf-8')
