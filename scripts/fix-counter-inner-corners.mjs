import fs from 'node:fs';

function replaceExact(path, from, to, expected = 1) {
  let s = fs.readFileSync(path, 'utf8');
  const count = s.split(from).length - 1;
  if (count !== expected) throw new Error(`${path}: expected ${expected}, found ${count}`);
  s = s.replace(from, to);
  fs.writeFileSync(path, s);
}

replaceExact(
  'src/modulePlacement.js',
  `export function snapPlacementToModules({\n  moduleId = null,\n  widthCm,`,
  `export function snapPlacementToModules({\n  moduleId = null,\n  moduleType = null,\n  widthCm,`,
);

replaceExact(
  'src/modulePlacement.js',
  `  const candidates = [];\n\n  const addCandidate = (`,
  `  const candidates = [];\n  const counterCornerFaces = [];\n  const isCounter = moduleType === 'counter';\n\n  const addCandidate = (`,
);

replaceExact(
  'src/modulePlacement.js',
  `    candidates.push({\n      placement,\n      targetModuleId,\n      snapKind,\n      priority,\n      distanceCm,\n    });\n  };\n\n  modules.forEach((targetModule) => {`,
  `    candidates.push({\n      placement,\n      targetModuleId,\n      snapKind,\n      priority,\n      distanceCm,\n    });\n  };\n\n  const rememberCounterFace = (placement, targetModule, constrainedAxis) => {\n    if (!isCounter || !placement || !targetModule) return;\n    counterCornerFaces.push({\n      placement: { ...placement },\n      targetModule,\n      constrainedAxis,\n    });\n  };\n\n  modules.forEach((targetModule) => {`,
);

replaceExact(
  'src/modulePlacement.js',
  `          addCandidate(placement, targetModule.id, 'face', -1, alongAxisDistanceCm);`,
  `          rememberCounterFace(placement, targetModule, movingAxis);\n          addCandidate(placement, targetModule.id, 'face', -1, alongAxisDistanceCm);`,
);

replaceExact(
  'src/modulePlacement.js',
  `        addCandidate(placement, targetModule.id, 'face', -1, perpendicularDistanceCm);`,
  `        rememberCounterFace(\n          placement,\n          targetModule,\n          movingAxis === 'x' ? 'y' : 'x',\n        );\n        addCandidate(placement, targetModule.id, 'face', -1, perpendicularDistanceCm);`,
);

replaceExact(
  'src/modulePlacement.js',
  `  });\n\n  if (!candidates.length) return null;\n  candidates.sort((a, b) => (`,
  `  });\n\n  if (isCounter && counterCornerFaces.length > 1) {\n    const touchesTargetFace = (placement, targetModule) => {\n      const moving = getGroundSegment({ widthCm: width, depthCm, placement });\n      const target = getGroundSegment(targetModule);\n      if (!moving || !target) return false;\n\n      const targetDepthCm = getModuleCollisionDepthCm(targetModule);\n      if (moving.axis === target.axis) {\n        const longitudinalOverlap = moving.startCm < target.endCm - EPSILON_CM\n          && target.startCm < moving.endCm - EPSILON_CM;\n        const centerLineGapCm = Math.abs(moving.fixedCm - target.fixedCm);\n        return longitudinalOverlap\n          && nearlyEqual(centerLineGapCm, (movingDepthCm + targetDepthCm) / 2);\n      }\n\n      const crossMinCm = moving.fixedCm - movingDepthCm / 2;\n      const crossMaxCm = moving.fixedCm + movingDepthCm / 2;\n      const crossOverlap = crossMinCm < target.endCm - EPSILON_CM\n        && target.startCm < crossMaxCm - EPSILON_CM;\n      const targetHalfDepthCm = targetDepthCm / 2;\n      const faceA = target.fixedCm - targetHalfDepthCm;\n      const faceB = target.fixedCm + targetHalfDepthCm;\n      const endpointContact = nearlyEqual(moving.startCm, faceA)\n        || nearlyEqual(moving.startCm, faceB)\n        || nearlyEqual(moving.endCm, faceA)\n        || nearlyEqual(moving.endCm, faceB);\n      return crossOverlap && endpointContact;\n    };\n\n    const xFaces = counterCornerFaces.filter((entry) => entry.constrainedAxis === 'x');\n    const yFaces = counterCornerFaces.filter((entry) => entry.constrainedAxis === 'y');\n\n    xFaces.forEach((xFace) => {\n      yFaces.forEach((yFace) => {\n        if (xFace.targetModule.id === yFace.targetModule.id) return;\n        const placement = createModulePlacement({\n          ...freePlacement,\n          xCm: xFace.placement.xCm,\n          yCm: yFace.placement.yCm,\n          rotationZDeg: resolvedRotation,\n          wallId: 'free',\n        });\n        if (!touchesTargetFace(placement, xFace.targetModule)) return;\n        if (!touchesTargetFace(placement, yFace.targetModule)) return;\n\n        const center = getPlacementCenter(placement, width);\n        if (!center) return;\n        const cornerDistanceCm = Math.max(\n          Math.abs(center.xCm - pointerX),\n          Math.abs(center.yCm - pointerY),\n        );\n        addCandidate(placement, xFace.targetModule.id, 'corner-face', -2, cornerDistanceCm);\n      });\n    });\n  }\n\n  if (!candidates.length) return null;\n  candidates.sort((a, b) => (`,
);

replaceExact(
  'src/scene3d.js',
  `      moduleId: moduleState.id,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,`,
  `      moduleId: moduleState.id,\n      moduleType: moduleState.type,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,`,
  2,
);

let changelog = fs.readFileSync('Changelog.md', 'utf8');
if (!changelog.includes('441. Bankonun U/L stand dip köşelerinde')) {
  changelog += `\n\n## Banko iç köşe yaslama düzeltmesi\n\n441. Bankonun U/L stand dip köşelerinde iki duvar yüzüne aynı anda sıfır temasla oturabilmesi için bankoya özel iki-yüzey köşe snap adayı eklendi.\n442. Tek duvar snap adayının ikinci duvarla collision'a düşmesi halinde sistem artık iki temas koordinatını birleştirerek gerçek köşe yerleşimini dener; diğer modül tiplerinin snap/collision davranışı değiştirilmedi.\n443. Sol ve sağ dip köşelerde, 0/90/180/270 derece banko yönlerinde fiziksel temas serbest; gerçek iç içe geçme collision olarak kalır.\n`;
  fs.writeFileSync('Changelog.md', changelog);
}

console.log('Banko inner-corner patch applied.');
