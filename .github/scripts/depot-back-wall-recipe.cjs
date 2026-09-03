const fs = require('fs');

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing anchor: ${label}`);
  return source.replace(before, after);
}

let depot = fs.readFileSync('src/autoDepot.js', 'utf8');
depot = replaceOnce(
  depot,
  `  else if (standType === 'back-wall' || standType === 'u-stand') { xCm = (standX - size.widthCm) / 2; yCm = 0; }`,
  `  else if (standType === 'back-wall' || standType === 'u-stand') {\n    // Sırt duvarı üretim reçetesi 50 cm gridde kalmalı; 150 cm depo için merkezi en yakın 50 cm noktasına al.\n    xCm = Math.round(((standX - size.widthCm) / 2) / 50) * 50;\n    yCm = 0;\n  }`,
  'back wall depot grid alignment',
);
fs.writeFileSync('src/autoDepot.js', depot);

let automatic = fs.readFileSync('src/automaticWall.js', 'utf8');
automatic += `\nexport function composeAutomaticBackWallWithDepot({ standXCm, depotOriginXCm, depotWidthCm } = {}) {\n  const standX = Number(standXCm);\n  const depotX = Number(depotOriginXCm);\n  const depotWidth = Number(depotWidthCm);\n  if (![standX, depotX, depotWidth].every(Number.isFinite) || standX <= 0 || depotWidth <= 0) {\n    return { ok: false, message: 'Depo sırt duvarı ölçüleri geçersiz.' };\n  }\n  if (depotX < 0 || depotX + depotWidth > standX) {\n    return { ok: false, message: 'Depo sırt duvarı stand sınırını aşıyor.' };\n  }\n\n  const modules = [];\n  const addChunk = (lengthCm, startXCm, exact = false) => {\n    if (lengthCm <= 0) return true;\n    if (exact) {\n      modules.push({ widthCm: lengthCm, placement: { xCm: startXCm, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' }, depotBack: true });\n      return true;\n    }\n    const composed = composeStraightWall(lengthCm);\n    if (!composed.ok) return false;\n    let cursor = startXCm;\n    for (const widthCm of composed.modules) {\n      modules.push({ widthCm, placement: { xCm: cursor, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' }, depotBack: false });\n      cursor += widthCm;\n    }\n    return true;\n  };\n\n  const beforeCm = depotX;\n  const afterStartCm = depotX + depotWidth;\n  const afterCm = standX - afterStartCm;\n  if (!addChunk(beforeCm, 0)) return { ok: false, message: 'Depo öncesi sırt duvarı oluşturulamadı.' };\n  if (!addChunk(depotWidth, depotX, true)) return { ok: false, message: 'Depo sırt paneli oluşturulamadı.' };\n  if (!addChunk(afterCm, afterStartCm)) return { ok: false, message: 'Depo sonrası sırt duvarı oluşturulamadı.' };\n\n  return { ok: true, modules };\n}\n`;
fs.writeFileSync('src/automaticWall.js', automatic);

let main = fs.readFileSync('src/main.js', 'utf8');
main = replaceOnce(
  main,
  `  composeAutomaticStandWall,\n  getAutomaticWallCapacityCm,\n} from './automaticWall.js';`,
  `  composeAutomaticStandWall,\n  composeAutomaticBackWallWithDepot,\n  getAutomaticWallCapacityCm,\n} from './automaticWall.js';`,
  'automatic wall import',
);

const oldBlock = `    currentModules = automaticWall.widths.map((widthCm, index) => {\n      const moduleState = createFlatPanelModuleState(widthCm);\n      moduleState.placement = { ...automaticWall.placements[index] };\n      return moduleState;\n    });\n  }\n  if (depotPlan?.ok) currentModules.push(...createAutomaticDepotStates(depotPlan));`;

const newBlock = `    currentModules = automaticWall.widths.map((widthCm, index) => {\n      const moduleState = createFlatPanelModuleState(widthCm);\n      moduleState.placement = { ...automaticWall.placements[index] };\n      return moduleState;\n    });\n\n    if (depotPlan?.ok) {\n      const customBack = composeAutomaticBackWallWithDepot({\n        standXCm: setup.xCm,\n        depotOriginXCm: depotPlan.originXCm,\n        depotWidthCm: depotPlan.widthCm,\n      });\n      if (!customBack.ok) { renderStageResult(customBack.message, true); return; }\n\n      currentModules = currentModules.filter((moduleState) => moduleState.placement?.wallId !== 'back');\n      const backStates = customBack.modules.map((entry) => {\n        const moduleState = createFlatPanelModuleState(entry.widthCm);\n        moduleState.placement = { ...entry.placement };\n        if (entry.depotBack) moduleState.autoDepotBack = true;\n        return moduleState;\n      });\n      currentModules.push(...backStates);\n    }\n  }\n  if (depotPlan?.ok) currentModules.push(...createAutomaticDepotStates(depotPlan));`;
main = replaceOnce(main, oldBlock, newBlock, 'stage automatic wall block');
fs.writeFileSync('src/main.js', main);

fs.writeFileSync('test/depotBackWallRecipe.test.js', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { composeAutomaticBackWallWithDepot } from '../src/automaticWall.js';\nimport { planAutomaticDepot } from '../src/autoDepot.js';\n\nfor (const [sizeKey, depotWidthCm, originXCm] of [['100x100',100,450], ['150x100',150,450], ['200x100',200,400], ['200x200',200,400]]) {\n  test(sizeKey + ' depot back wall keeps one exact depot-width panel', () => {\n    const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 1000, standYCm: 500, sizeKey });\n    assert.equal(plan.ok, true);\n    assert.equal(plan.originXCm, originXCm);\n    const result = composeAutomaticBackWallWithDepot({ standXCm: 1000, depotOriginXCm: plan.originXCm, depotWidthCm: plan.widthCm });\n    assert.equal(result.ok, true);\n    const depotPanels = result.modules.filter((item) => item.depotBack);\n    assert.equal(depotPanels.length, 1);\n    assert.equal(depotPanels[0].widthCm, depotWidthCm);\n    assert.equal(depotPanels[0].placement.xCm, originXCm);\n    assert.equal(depotPanels[0].placement.wallId, 'back');\n    assert.equal(result.modules.reduce((sum, item) => sum + item.widthCm, 0), 1000);\n  });\n}\n`);
