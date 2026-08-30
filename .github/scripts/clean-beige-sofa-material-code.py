from pathlib import Path
import re

p = Path('src/scene3d.js')
s = p.read_text()

# Remove all custom beige-sofa material/color/texture separation helpers.
s, count = re.subn(
    r"\nfunction separateBeigeSofaWoodMaterial\(.*?\nfunction createBeigeSofaSetModule\(",
    "\nfunction createBeigeSofaSetModule(",
    s,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('beige sofa helper block not found exactly once')

# Beige sofa is display-only for material/color: do not mutate its GLB material through the generic color flow.
old_apply = """  function applyColor(meshOrMeshes, hexColor) {\n    normalizeMeshes(meshOrMeshes).forEach((mesh) => {\n      if (!mesh?.material) return;\n      const surfaceState = mesh.userData.surfaceState;\n      applyColorOverride(surfaceState, hexColor);\n\n      const colorTargets = mesh.userData.colorTargets?.length\n        ? mesh.userData.colorTargets\n        : [mesh];\n\n      if (mesh.userData.moduleType === 'sofa-set-beige') {\n        colorTargets.forEach((target) => applyBeigeSofaUpholsteryColor(target, hexColor));\n        return;\n      }\n"""
new_apply = """  function applyColor(meshOrMeshes, hexColor) {\n    normalizeMeshes(meshOrMeshes).forEach((mesh) => {\n      if (!mesh?.material) return;\n      if (mesh.userData.moduleType === 'sofa-set-beige') return;\n      const surfaceState = mesh.userData.surfaceState;\n      applyColorOverride(surfaceState, hexColor);\n\n      const colorTargets = mesh.userData.colorTargets?.length\n        ? mesh.userData.colorTargets\n        : [mesh];\n"""
if old_apply not in s:
    raise SystemExit('applyColor beige sofa block not found')
s = s.replace(old_apply, new_apply, 1)

old_traverse = """      mesh.traverse((object) => {\n        if (!object.isMesh) return;\n        object.castShadow = true;\n        object.receiveShadow = true;\n        separateBeigeSofaWoodMaterial(object, moduleState.surface?.color ?? '#ffffff');\n        colorTargets.push(object);\n      });\n"""
new_traverse = """      mesh.traverse((object) => {\n        if (!object.isMesh) return;\n        object.castShadow = true;\n        object.receiveShadow = true;\n        // Keep the GLB material exactly as authored: no color, texture or material overrides.\n      });\n"""
if old_traverse not in s:
    raise SystemExit('beige sofa traverse mutation block not found')
s = s.replace(old_traverse, new_traverse, 1)

# Guard: none of the removed custom sofa material hooks may remain.
for token in ['separateBeigeSofaWoodMaterial', 'applyBeigeSofaUpholsteryColor', 'sofaFixedWood', 'sofaUpholstery']:
    if token in s:
        raise SystemExit(f'remaining beige sofa material hook: {token}')

p.write_text(s)
