import fs from 'node:fs';

const path = 'src/scene3d.js';
let text = fs.readFileSync(path, 'utf8');

function replaceOnce(from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  text = text.replace(from, to);
}

replaceOnce(
`  function getTopFixtureDragPoint(clientX, clientY, wallId) {\n    if (!stageLayout) return null;\n    setPointerFromClient(clientX, clientY);\n    raycaster.setFromCamera(pointer, camera);\n\n    let plane;\n    if (wallId === 'left') {\n      plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);\n    } else if (wallId === 'right') {\n      plane = new THREE.Plane(\n        new THREE.Vector3(1, 0, 0),\n        -Number(stageLayout.widthM),\n      );\n    } else {\n      // Back wall: world Z = 0. Projektör havadayken mouse ray'ini bu duvar düzlemine düşür.\n      plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);\n    }\n\n    const point = new THREE.Vector3();\n    const hit = raycaster.ray.intersectPlane(plane, point);\n    if (!hit) return null;\n    return {\n      xCm: point.x * 100,\n      yCm: point.z * 100,\n    };\n  }`,
`  function getTopFixtureDragPoint(clientX, clientY, preferredWallId = 'back') {\n    if (!stageLayout) return null;\n    setPointerFromClient(clientX, clientY);\n    raycaster.setFromCamera(pointer, camera);\n\n    const allowedWalls = getAllowedWallIds(stageLayout.standType)\n      .filter((wallId) => wallId !== 'free');\n    const wallOrder = [preferredWallId, ...allowedWalls.filter((wallId) => wallId !== preferredWallId)];\n    const candidates = [];\n    const epsilonCm = 4;\n\n    wallOrder.forEach((wallId, order) => {\n      let plane;\n      if (wallId === 'left') {\n        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);\n      } else if (wallId === 'right') {\n        plane = new THREE.Plane(\n          new THREE.Vector3(1, 0, 0),\n          -Number(stageLayout.widthM),\n        );\n      } else if (wallId === 'back') {\n        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);\n      } else {\n        return;\n      }\n\n      const point = new THREE.Vector3();\n      const hit = raycaster.ray.intersectPlane(plane, point);\n      if (!hit) return;\n\n      const xCm = point.x * 100;\n      const yCm = point.z * 100;\n      const inBounds = wallId === 'back'\n        ? xCm >= -epsilonCm && xCm <= Number(stageLayout.widthCm) + epsilonCm\n        : yCm >= -epsilonCm && yCm <= Number(stageLayout.depthCm) + epsilonCm;\n      if (!inBounds) return;\n\n      candidates.push({\n        wallId,\n        xCm,\n        yCm,\n        distance: raycaster.ray.origin.distanceTo(point),\n        order,\n      });\n    });\n\n    if (!candidates.length) return null;\n    candidates.sort((a, b) => (a.distance - b.distance) || (a.order - b.order));\n    return candidates[0];\n  }`,
'corner-aware top fixture raycast',
);

replaceOnce(
`      const wallId = moduleState.placement?.wallId ?? 'back';\n      const wallPoint = getTopFixtureDragPoint(event.clientX, event.clientY, wallId);`,
`      const currentWallId = dragSession.preview?.placement?.wallId\n        ?? moduleState.placement?.wallId\n        ?? 'back';\n      const wallPoint = getTopFixtureDragPoint(event.clientX, event.clientY, currentWallId);`,
'allow wall switching while dragging',
);

replaceOnce(
`      const basePlacement = {\n        ...(moduleState.placement ?? {}),\n        wallId,\n        rotationZDeg: dragSession.preferredRotationZDeg,\n      };`,
`      const wallRotationZDeg = wallPoint.wallId === 'left'\n        ? 90\n        : (wallPoint.wallId === 'right' ? 270 : 0);\n      const basePlacement = {\n        ...(moduleState.placement ?? {}),\n        wallId: wallPoint.wallId,\n        rotationZDeg: wallRotationZDeg,\n      };\n      dragSession.preferredRotationZDeg = wallRotationZDeg;`,
'rotate fixture with corner wall',
);

fs.writeFileSync(path, text);
