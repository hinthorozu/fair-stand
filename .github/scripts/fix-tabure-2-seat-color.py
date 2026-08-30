from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

old = """  // Selection proxy only; the uploaded GLB remains visually/materially untouched.\n  const proxy = new THREE.Mesh(\n    new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100),\n    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),\n  );\n"""
new = """  // Selection proxy only. The GLB frame/legs stay untouched; only the seat is color-editable.\n  const colorTargets = [];\n  const proxy = new THREE.Mesh(\n    new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100),\n    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),\n  );\n"""
if old not in text:
    raise SystemExit('proxy block not found')
text = text.replace(old, new, 1)

old = """    colorTargets: [],\n  };\n\n  loadBarStool2Model().then((template) => {\n"""
new = """    colorTargets,\n  };\n\n  loadBarStool2Model().then((template) => {\n"""
if old not in text:
    raise SystemExit('colorTargets block not found')
text = text.replace(old, new, 1)

old = """    chair.traverse((object) => {\n      if (!object.isMesh) return;\n      object.castShadow = true;\n      object.receiveShadow = true;\n      // Do not replace, recolor or rebuild GLB materials/textures.\n    });\n"""
new = """    chair.traverse((object) => {\n      if (!object.isMesh) return;\n      object.castShadow = true;\n      object.receiveShadow = true;\n\n      const isSeat = object.name === 'Cube.001_Burlington Leather_0'\n        || object.material?.name === 'Burlington_Leather';\n      if (!isSeat || !object.material) return;\n\n      // The seat starts white and follows the module surface color. Remove only the\n      // base-color texture so the original frame/legs and every other GLB material stay intact.\n      object.material = object.material.clone();\n      object.material.map = null;\n      object.material.color?.set(moduleState.surface?.color ?? '#ffffff');\n      object.material.needsUpdate = true;\n      colorTargets.push(object);\n    });\n"""
if old not in text:
    raise SystemExit('traverse block not found')
text = text.replace(old, new, 1)

path.write_text(text)
