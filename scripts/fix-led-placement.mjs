import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  return text.replace(from, to);
}

// scene3d.js — LED top fixture gets its own 20 cm snap.
{
  const path = 'src/scene3d.js';
  let text = fs.readFileSync(path, 'utf8');

  const marker = `  function inferWallIdForRotation(placement, rotationZDeg) {`;
  const helper = `  function snapTopFixturePlacement(basePlacement, ground, widthCm) {\n    const placement = {\n      ...basePlacement,\n      zCm: Math.round(STAND_DIMENSIONS.height * 100),\n    };\n    if (!stageLayout || !ground) return placement;\n\n    const stepCm = 20;\n    const width = Math.max(0, Number(widthCm) || 0);\n    const snap20 = (value) => Math.round(Number(value) / stepCm) * stepCm;\n\n    if (placement.wallId === 'back') {\n      placement.xCm = Math.min(\n        Math.max(0, Number(stageLayout.widthCm) - width),\n        Math.max(0, snap20(ground.xCm)),\n      );\n      placement.yCm = 0;\n    } else if (placement.wallId === 'left') {\n      placement.xCm = 0;\n      placement.yCm = Math.min(\n        Math.max(0, Number(stageLayout.depthCm) - width),\n        Math.max(0, snap20(ground.yCm)),\n      );\n    } else if (placement.wallId === 'right') {\n      placement.xCm = Number(stageLayout.widthCm);\n      placement.yCm = Math.min(\n        Math.max(0, Number(stageLayout.depthCm) - width),\n        Math.max(0, snap20(ground.yCm)),\n      );\n    }\n\n    return placement;\n  }\n\n`;
  text = replaceOnce(text, marker, helper + marker, 'scene helper insertion');

  const oldPlacement = `      const placement = {\n        ...snapped.placement,\n        zCm: Math.round(STAND_DIMENSIONS.height * 100),\n      };`;
  const newPlacement = `      const placement = snapTopFixturePlacement(\n        snapped.placement,\n        ground,\n        moduleState.widthCm,\n      );`;
  text = replaceOnce(text, oldPlacement, newPlacement, 'catalog LED snap');
  text = replaceOnce(text, oldPlacement, newPlacement, 'drag LED snap');

  fs.writeFileSync(path, text);
}

// main.js — duplicating an LED keeps it on the same top wall and offsets it 20 cm.
{
  const path = 'src/main.js';
  let text = fs.readFileSync(path, 'utf8');

  const marker = `  if (sourceModule.placement && sourceModule.placement.wallId !== 'free') {`;
  const special = `  if (sourceModule.type === 'led-floodlight' && sourceModule.placement) {\n    const sourcePlacement = sourceModule.placement;\n    const placement = { ...sourcePlacement, zCm: 350 };\n    const deltaCm = side === 'left' ? -20 : 20;\n    const widthCm = Number(duplicate.widthCm) || 50;\n\n    if (sourcePlacement.wallId === 'back') {\n      placement.xCm = Math.min(\n        Math.max(0, Number(currentStand?.xCm) - widthCm),\n        Math.max(0, Number(sourcePlacement.xCm) + deltaCm),\n      );\n      placement.yCm = 0;\n    } else if (sourcePlacement.wallId === 'left' || sourcePlacement.wallId === 'right') {\n      placement.yCm = Math.min(\n        Math.max(0, Number(currentStand?.yCm) - widthCm),\n        Math.max(0, Number(sourcePlacement.yCm) + deltaCm),\n      );\n      placement.xCm = sourcePlacement.wallId === 'right' ? Number(currentStand?.xCm) : 0;\n    }\n\n    duplicate.placement = placement;\n    currentModules.push(duplicate);\n    rebuildWall({ resetView: false });\n    return;\n  }\n\n`;
  text = replaceOnce(text, marker, special + marker, 'LED duplicate special case');

  fs.writeFileSync(path, text);
}
