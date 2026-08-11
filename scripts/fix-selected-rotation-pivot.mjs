import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

function patch(path, transform) {
  const source = fs.readFileSync(path, 'utf8');
  const next = transform(source);
  if (next === source) throw new Error(`No changes produced for ${path}`);
  fs.writeFileSync(path, next);
}

patch('src/modulePlacement.js', (source) => {
  const anchor = `export function rotateModuleRotationZDeg(value, deltaDeg = 90) {\n  return normalizeModuleRotationZDeg(\n    normalizeModuleRotationZDeg(value) + Number(deltaDeg || 0),\n  );\n}\n`;
  const replacement = `${anchor}\nexport function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90) {\n  if (!placement) return null;\n  const width = Number(widthCm);\n  const x = Number(placement.xCm);\n  const y = Number(placement.yCm);\n  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;\n\n  const currentRotation = normalizeModuleRotationZDeg(placement.rotationZDeg);\n  const nextRotation = rotateModuleRotationZDeg(currentRotation, deltaDeg);\n  const currentVertical = isVerticalModuleRotation(currentRotation);\n  const nextVertical = isVerticalModuleRotation(nextRotation);\n\n  const centerX = x + (currentVertical ? 0 : width / 2);\n  const centerY = y + (currentVertical ? width / 2 : 0);\n\n  return createModulePlacement({\n    ...placement,\n    xCm: snapCm(nextVertical ? centerX : centerX - width / 2),\n    yCm: snapCm(nextVertical ? centerY - width / 2 : centerY),\n    rotationZDeg: nextRotation,\n  });\n}\n`;
  return replaceOnce(source, anchor, replacement, 'modulePlacement centered rotation helper');
});

patch('src/scene3d.js', (source) => {
  let next = replaceOnce(
    source,
    `  rotateModuleRotationZDeg,\n`,
    `  rotateModuleRotationZDeg,\n  rotateModulePlacementAroundCenter,\n`,
    'scene3d centered rotation import',
  );

  const oldBlock = `    const nextRotationZDeg = rotateModuleRotationZDeg(\n      moduleState.placement.rotationZDeg,\n      deltaDeg,\n    );\n    const nextPlacement = {\n      ...moduleState.placement,\n      rotationZDeg: nextRotationZDeg,\n    };\n    nextPlacement.wallId = inferWallIdForRotation(nextPlacement, nextRotationZDeg);\n`;
  const newBlock = `    const nextPlacement = rotateModulePlacementAroundCenter(\n      moduleState.placement,\n      moduleState.widthCm,\n      deltaDeg,\n    );\n    if (!nextPlacement) return false;\n    nextPlacement.wallId = inferWallIdForRotation(\n      nextPlacement,\n      nextPlacement.rotationZDeg,\n    );\n`;
  next = replaceOnce(next, oldBlock, newBlock, 'selected module rotation pivot');
  return next;
});

patch('test/modulePlacement.test.js', (source) => {
  let next = replaceOnce(
    source,
    `  snapPlacementToStand,\n`,
    `  snapPlacementToStand,\n  rotateModulePlacementAroundCenter,\n`,
    'test centered rotation import',
  );
  next += `\n\ntest('selected module quarter-turn keeps its center instead of rotating from the start corner', () => {\n  const rotated = rotateModulePlacementAroundCenter({\n    xCm: 200,\n    yCm: 100,\n    zCm: 0,\n    rotationZDeg: 90,\n    wallId: 'free',\n  }, 100, 90);\n\n  assert.deepEqual(rotated, {\n    xCm: 150,\n    yCm: 150,\n    zCm: 0,\n    rotationZDeg: 180,\n    wallId: 'free',\n  });\n});\n\ntest('selected module center rotation stays on the 50 cm grid', () => {\n  const rotated = rotateModulePlacementAroundCenter({\n    xCm: 100,\n    yCm: 100,\n    zCm: 0,\n    rotationZDeg: 0,\n    wallId: 'free',\n  }, 50, 90);\n\n  assert.equal(rotated.xCm % 50, 0);\n  assert.equal(rotated.yCm % 50, 0);\n  assert.equal(rotated.rotationZDeg, 90);\n});\n`;
  return next;
});

patch('PROJECT_RULES.md', (source) => {
  const needle = `- Bu davranış hem **modül sürüklenirken** hem de **modül bırakıldıktan sonra seçiliyken** çalışır.\n`;
  const replacement = `${needle}- Modül bırakıldıktan sonra döndürülürken başlangıç köşesine çivilenmez; **kendi merkezi etrafında döner** ve yeni eksende en yakın 50 cm grid konumuna oturur.\n`;
  return replaceOnce(source, needle, replacement, 'project rule selected rotation pivot');
});
