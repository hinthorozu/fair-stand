import fs from 'node:fs';

const path = 'src/scene3d.js';
let text = fs.readFileSync(path, 'utf8');

function replaceOnce(from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  text = text.replace(from, to);
}

replaceOnce(
`  function getGroundPoint(clientX, clientY) {\n    if (!activeFloor.visible) return null;\n    setPointerFromClient(clientX, clientY);\n    raycaster.setFromCamera(pointer, camera);\n    const hit = raycaster.intersectObject(activeFloor, false)[0];\n    if (!hit) return null;\n    return {\n      xCm: hit.point.x * 100,\n      yCm: hit.point.z * 100,\n    };\n  }`,
`  function getGroundPoint(clientX, clientY) {\n    if (!activeFloor.visible) return null;\n    setPointerFromClient(clientX, clientY);\n    raycaster.setFromCamera(pointer, camera);\n    const hit = raycaster.intersectObject(activeFloor, false)[0];\n    if (!hit) return null;\n    return {\n      xCm: hit.point.x * 100,\n      yCm: hit.point.z * 100,\n    };\n  }\n\n  function getTopFixtureDragPoint(clientX, clientY, wallId) {\n    if (!stageLayout) return null;\n    setPointerFromClient(clientX, clientY);\n    raycaster.setFromCamera(pointer, camera);\n\n    let plane;\n    if (wallId === 'left') {\n      plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);\n    } else if (wallId === 'right') {\n      plane = new THREE.Plane(\n        new THREE.Vector3(1, 0, 0),\n        -Number(stageLayout.widthM),\n      );\n    } else {\n      // Back wall: world Z = 0. Projektör havadayken mouse ray'ini bu duvar düzlemine düşür.\n      plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);\n    }\n\n    const point = new THREE.Vector3();\n    const hit = raycaster.ray.intersectPlane(plane, point);\n    if (!hit) return null;\n    return {\n      xCm: point.x * 100,\n      yCm: point.z * 100,\n    };\n  }`,
'add top fixture wall-plane projection',
);

replaceOnce(
`    dragSession.moduleGroup.visible = false;\n    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);\n\n    const ground = getGroundPoint(event.clientX, event.clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      dragSession.preview = null;\n      showPlacementFeedback('Modülü aktif stand alanına bırak.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n      });\n      return;\n    }\n\n    const moduleState = dragSession.moduleState;\n    const snapped = snapPlacementToStand({`,
`    dragSession.moduleGroup.visible = false;\n    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);\n\n    const moduleState = dragSession.moduleState;\n\n    if (isTopFixtureType(moduleState.type)) {\n      const wallId = moduleState.placement?.wallId ?? 'back';\n      const wallPoint = getTopFixtureDragPoint(event.clientX, event.clientY, wallId);\n      if (!wallPoint) {\n        disposePlacementGhost();\n        dragSession.preview = null;\n        showPlacementFeedback('Projektörü üst profil boyunca sürükle.', {\n          clientX: event.clientX,\n          clientY: event.clientY,\n        });\n        return;\n      }\n\n      const basePlacement = {\n        ...(moduleState.placement ?? {}),\n        wallId,\n        rotationZDeg: dragSession.preferredRotationZDeg,\n      };\n      const placement = snapTopFixturePlacement(\n        basePlacement,\n        wallPoint,\n        moduleState.widthCm,\n      );\n      dragSession.preview = {\n        placement,\n        valid: true,\n        message: null,\n        plan: {\n          ok: true,\n          movingPlacement: { ...placement },\n          placements: new Map([[moduleState.id, { ...placement }]]),\n        },\n        snap: { mode: 'top-wall' },\n      };\n      showPlacementGhost(moduleState, placement, true);\n      clearPlacementFeedback();\n      return;\n    }\n\n    const ground = getGroundPoint(event.clientX, event.clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      dragSession.preview = null;\n      showPlacementFeedback('Modülü aktif stand alanına bırak.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n      });\n      return;\n    }\n\n    const snapped = snapPlacementToStand({`,
'route top fixture before ground projection',
);

// The old top-fixture branch after snapPlacementToStand is now unreachable for existing fixture drags.
// Keep it for catalog placement compatibility and minimal change surface.

fs.writeFileSync(path, text);
