from pathlib import Path

scene_path = Path('src/scene3d.js')
test_path = Path('test/lightboxFabricLighting.test.js')
scene = scene_path.read_text()
test = test_path.read_text()

old = """    const backing = surface.userData?.backing;\n    if (backing) backing.visible = false;\n"""
new = """    const backing = surface.userData?.backing;\n    // Bez yalnızca ön baskı yüzeyini devralır; modülün arka paneli korunur.\n    if (backing) backing.visible = true;\n"""
if old not in scene:
    raise SystemExit('backing suspend block not found')
scene = scene.replace(old, new, 1)

old = "material.emissiveIntensity = 1.60;"
new = "material.emissiveIntensity = 1.08;"
if old not in scene:
    raise SystemExit('lit emissive intensity not found')
scene = scene.replace(old, new, 1)

old = """        context.fillStyle = '#ffffff';\n        context.fillRect(0, 0, canvas.width, canvas.height);\n        context.drawImage(\n          image,\n"""
new = """        context.fillStyle = '#ffffff';\n        context.fillRect(0, 0, canvas.width, canvas.height);\n        // Lightbox baskısında yüksek emissive değerinin yaptığı beyazlaşmayı telafi et:\n        // rengi hafifçe doygun ve kontrastlı tut, parlaklığı emissive ile ver.\n        context.filter = 'saturate(1.08) contrast(1.06)';\n        context.drawImage(\n          image,\n"""
if old not in scene:
    raise SystemExit('fabric canvas draw block not found')
scene = scene.replace(old, new, 1)

old = """          color: baseColor,\n          roughness: 0.86,\n          metalness: 0,\n          side: THREE.DoubleSide,\n          polygonOffset: true,\n"""
new = """          color: baseColor,\n          roughness: 0.86,\n          metalness: 0,\n          // Baskı yalnızca standın önünden görünür; arkadan normal panel/backing görünür.\n          side: THREE.FrontSide,\n          polygonOffset: true,\n"""
if old not in scene:
    raise SystemExit('fabric material side block not found')
scene = scene.replace(old, new, 1)

old = "assert.match(scene, /material\\.emissiveIntensity = 1\\.60/);"
new = "assert.match(scene, /material\\.emissiveIntensity = 1\\.08/);\n  assert.match(scene, /context\\.filter = 'saturate\\(1\\.08\\) contrast\\(1\\.06\\)'/);\n  assert.match(scene, /side: THREE\\.FrontSide/);\n  assert.match(scene, /if \\(backing\\) backing\\.visible = true/);"
if old not in test:
    raise SystemExit('lighting test intensity assertion not found')
test = test.replace(old, new, 1)

scene_path.write_text(scene)
test_path.write_text(test)
