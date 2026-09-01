from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

old = """    const arrowDelta = {\n      arrowleft: [-1, 0],\n      arrowright: [1, 0],\n      arrowup: [0, -1],\n      arrowdown: [0, 1],\n    }[pressedKey];\n    if (arrowDelta) {\n"""
new = """    const arrowScreenDirection = {\n      arrowleft: new THREE.Vector2(-1, 0),\n      arrowright: new THREE.Vector2(1, 0),\n      arrowup: new THREE.Vector2(0, 1),\n      arrowdown: new THREE.Vector2(0, -1),\n    }[pressedKey];\n    if (arrowScreenDirection) {\n"""
if old not in text:
    raise SystemExit('arrow map block not found')
text = text.replace(old, new, 1)

old = """      const desiredPlacement = createModulePlacement({\n        ...moduleState.placement,\n        xCm: Number(moduleState.placement.xCm || 0) + arrowDelta[0] * stepCm,\n        yCm: Number(moduleState.placement.yCm || 0) + arrowDelta[1] * stepCm,\n        wallId: 'free',\n      });\n      desiredPlacement.zCm = Number(moduleState.placement.zCm || 0);\n"""
new = """      const moduleWorldPosition = new THREE.Vector3();\n      moduleGroup.getWorldPosition(moduleWorldPosition);\n      const projectedOrigin = moduleWorldPosition.clone().project(camera);\n      const worldStepM = stepCm / 100;\n      const candidates = [\n        { xCm: stepCm, yCm: 0, world: new THREE.Vector3(worldStepM, 0, 0) },\n        { xCm: -stepCm, yCm: 0, world: new THREE.Vector3(-worldStepM, 0, 0) },\n        { xCm: 0, yCm: stepCm, world: new THREE.Vector3(0, 0, worldStepM) },\n        { xCm: 0, yCm: -stepCm, world: new THREE.Vector3(0, 0, -worldStepM) },\n      ];\n      const bestArrowMove = candidates\n        .map((candidate) => {\n          const projectedTarget = moduleWorldPosition.clone().add(candidate.world).project(camera);\n          const screenDelta = new THREE.Vector2(\n            projectedTarget.x - projectedOrigin.x,\n            projectedTarget.y - projectedOrigin.y,\n          );\n          const lengthSq = screenDelta.lengthSq();\n          const score = lengthSq > 1e-12\n            ? screenDelta.normalize().dot(arrowScreenDirection)\n            : -Infinity;\n          return { ...candidate, score };\n        })\n        .sort((a, b) => b.score - a.score)[0];\n      if (!bestArrowMove || !Number.isFinite(bestArrowMove.score)) return;\n\n      const desiredPlacement = createModulePlacement({\n        ...moduleState.placement,\n        xCm: Number(moduleState.placement.xCm || 0) + bestArrowMove.xCm,\n        yCm: Number(moduleState.placement.yCm || 0) + bestArrowMove.yCm,\n        wallId: 'free',\n      });\n      desiredPlacement.zCm = Number(moduleState.placement.zCm || 0);\n"""
if old not in text:
    raise SystemExit('arrow placement block not found')
text = text.replace(old, new, 1)

path.write_text(text)
