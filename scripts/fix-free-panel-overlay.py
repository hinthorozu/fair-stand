from pathlib import Path

path = Path('src/scene3d.js')
s = path.read_text()

needle = """    const allowedWalls = getAllowedWallIds(stageLayout.standType)\n      .filter((wallId) => wallId === 'back' || wallId === 'left' || wallId === 'right');\n"""
insert = """    const pointed = pickModuleAt(clientX, clientY);\n    const pointedModuleState = pointed?.moduleGroup?.userData?.moduleState;\n    const freePanelSupportTypes = new Set([\n      'flat-panel',\n      'base-wall',\n      'shelf',\n      'door',\n      'showcase-2',\n      'showcase-3',\n      'separator',\n    ]);\n    if (\n      pointedModuleState?.placement?.wallId === 'free'\n      && freePanelSupportTypes.has(pointedModuleState.type)\n      && pointed?.hit?.point\n    ) {\n      const supportRotationZDeg = normalizeModuleRotationZDeg(pointedModuleState.placement.rotationZDeg);\n      const supportFront = new THREE.Vector3(0, 0, 1)\n        .applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(supportRotationZDeg));\n      const cameraSide = overlayRaycaster.ray.origin.clone().sub(pointed.hit.point).dot(supportFront);\n      const rotationZDeg = normalizeModuleRotationZDeg(\n        supportRotationZDeg + (cameraSide < 0 ? 180 : 0),\n      );\n      const hit = pointed.hit.point;\n      const heightCm = Math.max(1, Number(moduleState?.screenHeightCm ?? moduleState?.heightCm ?? 52.3));\n      const halfHeightM = heightCm / 200;\n      const defaultCenterM = 1.75;\n      const minOffsetCm = Math.ceil(((halfHeightM - defaultCenterM) * 100) / 10) * 10;\n      const maxOffsetCm = Math.floor(((STAND_DIMENSIONS.height - halfHeightM - defaultCenterM) * 100) / 10) * 10;\n      const rawOffsetCm = (hit.y - ACTIVE_PLATFORM_HEIGHT_M - defaultCenterM) * 100;\n      const zCm = THREE.MathUtils.clamp(Math.round(rawOffsetCm / 10) * 10, minOffsetCm, maxOffsetCm);\n\n      return {\n        wallId: 'free',\n        pointerXCm: hit.x * 100,\n        pointerYCm: hit.z * 100,\n        rotationZDeg,\n        zCm,\n        freePanelSupport: true,\n        supportModuleId: pointedModuleState.id,\n      };\n    }\n\n    const allowedWalls = getAllowedWallIds(stageLayout.standType)\n      .filter((wallId) => wallId === 'back' || wallId === 'left' || wallId === 'right');\n"""
if needle not in s:
    raise SystemExit('wall helper insertion point not found')
s = s.replace(needle, insert, 1)

needle2 = """        depthCm: moduleState.depthCm,\n        pointerXCm: wallPoint.pointerXCm,\n"""
replace2 = """        depthCm: moduleState.depthCm,\n        forceFree: wallPoint.freePanelSupport === true,\n        pointerXCm: wallPoint.pointerXCm,\n"""
count = s.count(needle2)
if count < 2:
    raise SystemExit(f'expected at least two overlay snap call sites, found {count}')
s = s.replace(needle2, replace2, 2)

path.write_text(s)
