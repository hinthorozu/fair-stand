from pathlib import Path

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')
old = """      material.emissiveIntensity = 1.35;\n    } else {\n      material.emissiveMap = null;\n      material.emissive.set(fabricState.fabricColor ?? fabricState.color ?? '#ffffff');\n      material.emissiveIntensity = 0.72;\n"""
new = """      material.emissiveIntensity = 1.60;\n    } else {\n      material.emissiveMap = null;\n      material.emissive.set(fabricState.fabricColor ?? fabricState.color ?? '#ffffff');\n      material.emissiveIntensity = 0.82;\n"""
if old not in scene:
    raise SystemExit('lightbox intensity marker not found')
scene = scene.replace(old, new, 1)
scene_path.write_text(scene, encoding='utf-8')

test_path = Path('test/lightboxFabricLighting.test.js')
test = test_path.read_text(encoding='utf-8')
test = test.replace("material\\.emissiveIntensity = 1\\.35", "material\\.emissiveIntensity = 1\\.60")
test_path.write_text(test, encoding='utf-8')
