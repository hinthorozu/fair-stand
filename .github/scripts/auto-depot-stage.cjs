const fs = require('fs');
function rep(s,a,b,l){ if(!s.includes(a)) throw new Error(l); return s.replace(a,b); }

// autoDepot planner
fs.writeFileSync('src/autoDepot.js', `import { createModulePlacement } from './modulePlacement.js';

export const AUTO_DEPOT_SIZES = Object.freeze({
  '100x100': Object.freeze({ widthCm: 100, depthCm: 100, label: '1 × 1 m' }),
  '150x100': Object.freeze({ widthCm: 150, depthCm: 100, label: '1,5 × 1 m' }),
  '200x100': Object.freeze({ widthCm: 200, depthCm: 100, label: '2 × 1 m' }),
  '200x200': Object.freeze({ widthCm: 200, depthCm: 200, label: '2 × 2 m' }),
});

function wall(widthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind: 'wall', widthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function door(xCm, yCm, rotationZDeg = 0) {
  return { kind: 'door', widthCm: 100, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function fixture(kind, widthCm, depthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind, widthCm, depthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}

function addFront(specs, xCm, yCm, widthCm) {
  if (widthCm === 100) { specs.push(door(xCm, yCm)); return; }
  if (widthCm === 150) { specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm)); return; }
  specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm), wall(50, xCm + 150, yCm));
}

export function planAutomaticDepot({ standType, standXCm, standYCm, sizeKey = '100x100', includeContents = false } = {}) {
  const size = AUTO_DEPOT_SIZES[sizeKey];
  const standX = Number(standXCm); const standY = Number(standYCm);
  if (!size) return { ok: false, message: 'Depo ölçüsü geçersiz.' };
  if (!Number.isFinite(standX) || !Number.isFinite(standY) || standX <= 0 || standY <= 0) return { ok: false, message: 'Stand ölçüsü geçersiz.' };
  if (size.widthCm > standX || size.depthCm > standY) return { ok: false, message: 'Seçilen depo ölçüsü stand alanına sığmıyor.' };

  let xCm = 0; let yCm = 0; let useBackWall = true; let useLeftWall = false; let useRightWall = false;
  if (standType === 'l-left') { xCm = 0; yCm = 0; useLeftWall = true; }
  else if (standType === 'l-right') { xCm = standX - size.widthCm; yCm = 0; useRightWall = true; }
  else if (standType === 'back-wall' || standType === 'u-stand') { xCm = (standX - size.widthCm) / 2; yCm = 0; }
  else if (standType === 'island') { xCm = (standX - size.widthCm) / 2; yCm = (standY - size.depthCm) / 2; useBackWall = false; }
  else return { ok: false, message: 'Bu stand tipi için otomatik depo yerleşimi desteklenmiyor.' };

  const specs = [];
  if (!useBackWall) specs.push(wall(size.widthCm, xCm, yCm));
  if (!useLeftWall) specs.push(wall(size.depthCm, xCm, yCm, 90));
  if (!useRightWall) specs.push(wall(size.depthCm, xCm + size.widthCm, yCm, 90));
  addFront(specs, xCm, yCm + size.depthCm, size.widthCm);

  if (includeContents) {
    const inset = 5;
    specs.push(fixture('mini-fridge', 45, 43, xCm + inset, yCm + inset));
    specs.push(fixture('coat-rack', 43, 43, xCm + size.widthCm - 43 - inset, yCm + inset));
    specs.push(fixture('kettle', 24, 19, xCm + (size.widthCm - 24) / 2, yCm + Math.min(size.depthCm - 24, 55)));
  }

  return { ok: true, sizeKey, widthCm: size.widthCm, depthCm: size.depthCm, originXCm: xCm, originYCm: yCm, specs };
}
`);

let s=fs.readFileSync('index.html','utf8');
s=rep(s,
`          <label class="stand-size-field" for="floor-type"><span>Zemin Kaplaması</span><select id="floor-type"><option value="karolaj">Karolaj · 100 × 100 cm</option><option value="hali">Halı</option><option value="parke-acik">Beyaz Meşe</option><option value="parke-sari">Sarı Meşe</option><option value="parke-beton">Beton Parke</option></select></label>\n          <button id="create-stage" type="button" class="primary" disabled>Sahneyi Oluştur</button>`,
`          <label class="stand-size-field" for="floor-type"><span>Zemin Kaplaması</span><select id="floor-type"><option value="karolaj">Karolaj · 100 × 100 cm</option><option value="hali">Halı</option><option value="parke-acik">Beyaz Meşe</option><option value="parke-sari">Sarı Meşe</option><option value="parke-beton">Beton Parke</option></select></label>\n          <div style="display:grid;gap:8px;padding:10px 0 4px">\n            <label style="display:flex;align-items:center;gap:8px;font-weight:700"><input id="auto-depot-enabled" type="checkbox" /> Depo eklensin</label>\n            <label class="stand-size-field" for="auto-depot-size"><span>Depo ölçüsü</span><select id="auto-depot-size" disabled><option value="100x100">1 × 1 m</option><option value="150x100">1,5 × 1 m</option><option value="200x100">2 × 1 m</option><option value="200x200">2 × 2 m</option></select></label>\n            <label style="display:flex;align-items:center;gap:8px;font-weight:700"><input id="auto-depot-contents" type="checkbox" disabled /> Depo içeriği eklensin</label>\n            <span class="muted">Seçilirse Mini Buzdolabı + Kettle + Askılık otomatik eklenir.</span>\n          </div>\n          <button id="create-stage" type="button" class="primary" disabled>Sahneyi Oluştur</button>`,
'index depot controls');
fs.writeFileSync('index.html',s);

s=fs.readFileSync('src/main.js','utf8');
s=rep(s,
`import { resolveModuleCatalogKey } from './catalog.js';`,
`import { resolveModuleCatalogKey } from './catalog.js';\nimport { planAutomaticDepot } from './autoDepot.js';`,
'import auto depot');
s=rep(s,
`const floorTypeSelect = document.querySelector('#floor-type');\nconst stageResult = document.querySelector('#stage-result');`,
`const floorTypeSelect = document.querySelector('#floor-type');\nconst autoDepotEnabledInput = document.querySelector('#auto-depot-enabled');\nconst autoDepotSizeSelect = document.querySelector('#auto-depot-size');\nconst autoDepotContentsInput = document.querySelector('#auto-depot-contents');\nconst stageResult = document.querySelector('#stage-result');`,
'depot dom');

const helper=`function syncAutoDepotControls() {\n  const enabled = Boolean(autoDepotEnabledInput?.checked);\n  if (autoDepotSizeSelect) autoDepotSizeSelect.disabled = !enabled;\n  if (autoDepotContentsInput) {\n    autoDepotContentsInput.disabled = !enabled;\n    if (!enabled) autoDepotContentsInput.checked = false;\n  }\n}\n\nfunction createAutomaticDepotStates(plan) {\n  if (!plan?.ok) return [];\n  return plan.specs.map((spec) => {\n    let state = null;\n    if (spec.kind === 'wall') state = createFlatPanelModuleState(spec.widthCm);\n    else if (spec.kind === 'door') state = createDoorModuleState(100);\n    else if (spec.kind === 'mini-fridge') state = createMiniFridgeModuleState();\n    else if (spec.kind === 'kettle') state = createKettleModuleState();\n    else if (spec.kind === 'coat-rack') state = createCoatRackModuleState();\n    if (!state) return null;\n    state.placement = { ...spec.placement };\n    state.autoDepot = true;\n    return state;\n  }).filter(Boolean);\n}\n\n`;
s=rep(s,`function requestProjectName({ defaultName = '', mode = 'create' } = {}) {`,helper+`function requestProjectName({ defaultName = '', mode = 'create' } = {}) {`,'depot helper anchor');

s=rep(s,
`[standSizeXInput, standSizeYInput].forEach((input) => {\n  input.addEventListener('input', updateStageCreateState);\n  input.addEventListener('keydown', (event) => {\n    if (event.key === 'Enter' && !createStageButton.disabled) createStageButton.click();\n  });\n});`,
`[standSizeXInput, standSizeYInput].forEach((input) => {\n  input.addEventListener('input', updateStageCreateState);\n  input.addEventListener('keydown', (event) => {\n    if (event.key === 'Enter' && !createStageButton.disabled) createStageButton.click();\n  });\n});\nautoDepotEnabledInput?.addEventListener('change', syncAutoDepotControls);\nsyncAutoDepotControls();`,
'depot control listeners');

s=rep(s,
`  const projectName = await requestProjectName({ mode: 'create' });\n  if (!projectName) return;`,
`  const depotConfig = autoDepotEnabledInput?.checked ? {\n    enabled: true,\n    sizeKey: autoDepotSizeSelect?.value || '100x100',\n    includeContents: Boolean(autoDepotContentsInput?.checked),\n  } : { enabled: false, sizeKey: null, includeContents: false };\n  const depotPlan = depotConfig.enabled ? planAutomaticDepot({\n    standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm,\n    sizeKey: depotConfig.sizeKey, includeContents: depotConfig.includeContents,\n  }) : null;\n  if (depotPlan && !depotPlan.ok) { renderStageResult(depotPlan.message, true); return; }\n\n  const projectName = await requestProjectName({ mode: 'create' });\n  if (!projectName) return;`,
'depot preflight');

s=rep(s,
`  currentStand = { ...setup, floorType: floorTypeSelect.value };`,
`  currentStand = { ...setup, floorType: floorTypeSelect.value, depot: depotConfig };`,
'currentStand depot');

const oldAuto=`  const automaticWall = composeAutomaticStandWall({\n    lengthCm: getAutomaticWallCapacityCm({\n      standType: setup.standType,\n      standXCm: setup.xCm,\n      standYCm: setup.yCm,\n    }),\n    standType: setup.standType,\n    standXCm: setup.xCm,\n    standYCm: setup.yCm,\n  });\n  if (!automaticWall.ok) {\n    renderStageResult(automaticWall.message, true);\n    return;\n  }\n  currentModules = automaticWall.widths.map((widthCm, index) => {\n    const moduleState = createFlatPanelModuleState(widthCm);\n    moduleState.placement = { ...automaticWall.placements[index] };\n    return moduleState;\n  });\n  rebuildWall({ resetView: true });`;
const newAuto=`  if (setup.standType === 'island') {\n    currentModules = [];\n  } else {\n    const automaticWall = composeAutomaticStandWall({\n      lengthCm: getAutomaticWallCapacityCm({ standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm }),\n      standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm,\n    });\n    if (!automaticWall.ok) { renderStageResult(automaticWall.message, true); return; }\n    currentModules = automaticWall.widths.map((widthCm, index) => {\n      const moduleState = createFlatPanelModuleState(widthCm);\n      moduleState.placement = { ...automaticWall.placements[index] };\n      return moduleState;\n    });\n  }\n  if (depotPlan?.ok) currentModules.push(...createAutomaticDepotStates(depotPlan));\n  rebuildWall({ resetView: true });`;
s=rep(s,oldAuto,newAuto,'automatic wall depot integration');

s=rep(s,
`    floorTypeSelect.value = currentStand.floorType || 'karolaj';\n    const stage = scene3d.createStage({`,
`    floorTypeSelect.value = currentStand.floorType || 'karolaj';\n    if (autoDepotEnabledInput) autoDepotEnabledInput.checked = Boolean(currentStand.depot?.enabled);\n    if (autoDepotSizeSelect && currentStand.depot?.sizeKey) autoDepotSizeSelect.value = currentStand.depot.sizeKey;\n    if (autoDepotContentsInput) autoDepotContentsInput.checked = Boolean(currentStand.depot?.includeContents);\n    syncAutoDepotControls();\n    const stage = scene3d.createStage({`,
'restore depot controls');
fs.writeFileSync('src/main.js',s);

s=fs.readFileSync('src/helpGuide.js','utf8');
s=rep(s,
`      <p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> butonuna bas. Açılan küçük pencerede proje adını girdikten sonra sistem yeni ve bağımsız projeyi oluşturur ve ilk kaydı otomatik olarak yapar. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>`,
`      <p>Stand tipini seç, X ve Y ölçülerini gir; istersen <strong>Depo eklensin</strong> seçeneğini açıp 1×1, 1,5×1, 2×1 veya 2×2 m depo ölçüsünü belirle. <strong>Depo içeriği eklensin</strong> seçilirse Mini Buzdolabı, Kettle ve Askılık da otomatik yerleşir. Sonra <strong>Sahneyi Oluştur</strong> butonuna bas ve proje adını gir; sistem projeyi oluşturup ilk kaydı otomatik yapar.</p>`,
'help quick depot');
fs.writeFileSync('src/helpGuide.js',s);

// tests for planner
fs.writeFileSync('tests/autoDepot.test.js', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { planAutomaticDepot } from '../src/autoDepot.js';\n\ntest('L-left depot uses existing back and left walls', () => {\n  const p = planAutomaticDepot({ standType:'l-left', standXCm:500, standYCm:400, sizeKey:'150x100' });\n  assert.equal(p.ok,true); assert.equal(p.originXCm,0); assert.equal(p.originYCm,0);\n  assert.equal(p.specs.filter(s=>s.kind==='door').length,1);\n  assert.equal(p.specs.filter(s=>s.kind==='wall').length,2);\n});\n\ntest('back wall depot is centered', () => {\n  const p = planAutomaticDepot({ standType:'back-wall', standXCm:500, standYCm:400, sizeKey:'200x100' });\n  assert.equal(p.originXCm,150); assert.equal(p.originYCm,0);\n});\n\ntest('island depot is centered and contains four sides', () => {\n  const p = planAutomaticDepot({ standType:'island', standXCm:600, standYCm:500, sizeKey:'200x200', includeContents:true });\n  assert.equal(p.originXCm,200); assert.equal(p.originYCm,150);\n  assert.equal(p.specs.filter(s=>['mini-fridge','kettle','coat-rack'].includes(s.kind)).length,3);\n});\n`);
