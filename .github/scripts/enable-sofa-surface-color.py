from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')

old = """function makeBeigeSofaBodyWhite(object) {\n"""
new = """function makeBeigeSofaBodyWhite(object, upholsteryColor = '#ffffff') {\n"""
if old not in s:
    raise SystemExit('makeBeigeSofaBodyWhite signature not found')
s = s.replace(old, new, 1)

old = """  const whiteMaterial = sourceMaterial.clone();\n  whiteMaterial.map = null;\n  whiteMaterial.color?.set('#ffffff');\n  whiteMaterial.needsUpdate = true;\n\n  // Leg material is a plain clone of the original GLB material. No property is altered.\n  const originalLegMaterial = sourceMaterial.clone();\n"""
new = """  const whiteMaterial = sourceMaterial.clone();\n  whiteMaterial.map = null;\n  whiteMaterial.color?.set(upholsteryColor);\n  whiteMaterial.userData = { ...(whiteMaterial.userData || {}), sofaUpholstery: true };\n  whiteMaterial.needsUpdate = true;\n\n  // Leg material is a plain clone of the original GLB material. No property is altered.\n  const originalLegMaterial = sourceMaterial.clone();\n  originalLegMaterial.userData = { ...(originalLegMaterial.userData || {}), sofaFixedWood: true };\n"""
if old not in s:
    raise SystemExit('sofa material block not found')
s = s.replace(old, new, 1)

marker = """function createBeigeSofaSetModule(moduleState, moduleIndex) {\n"""
helper = """function applyBeigeSofaBodyColor(target, hexColor) {\n  if (!target?.material) return;\n  const materials = Array.isArray(target.material) ? target.material : [target.material];\n  materials.forEach((material) => {\n    if (!material?.userData?.sofaUpholstery) return;\n    material.map = null;\n    material.color?.set(hexColor);\n    material.needsUpdate = true;\n  });\n}\n\n"""
if marker not in s:
    raise SystemExit('createBeigeSofaSetModule marker not found')
s = s.replace(marker, helper + marker, 1)

old = """        makeBeigeSofaBodyWhite(object);\n"""
new = """        makeBeigeSofaBodyWhite(object, moduleState.surface?.color ?? '#ffffff');\n        colorTargets.push(object);\n"""
if old not in s:
    raise SystemExit('sofa traverse color hook not found')
s = s.replace(old, new, 1)

old = """      if (!mesh?.material) return;\n      if (mesh.userData.moduleType === 'sofa-set-beige') return;\n      const surfaceState = mesh.userData.surfaceState;\n      applyColorOverride(surfaceState, hexColor);\n\n      const colorTargets = mesh.userData.colorTargets?.length\n        ? mesh.userData.colorTargets\n        : [mesh];\n"""
new = """      if (!mesh?.material) return;\n      const surfaceState = mesh.userData.surfaceState;\n      applyColorOverride(surfaceState, hexColor);\n\n      const colorTargets = mesh.userData.colorTargets?.length\n        ? mesh.userData.colorTargets\n        : [mesh];\n\n      if (mesh.userData.moduleType === 'sofa-set-beige') {\n        colorTargets.forEach((target) => applyBeigeSofaBodyColor(target, hexColor));\n        return;\n      }\n"""
if old not in s:
    raise SystemExit('applyColor sofa guard block not found')
s = s.replace(old, new, 1)

for token in ["sofaUpholstery", "sofaFixedWood", "applyBeigeSofaBodyColor"]:
    if token not in s:
        raise SystemExit(f'missing expected token: {token}')

p.write_text(s, encoding='utf-8')
