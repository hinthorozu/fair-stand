import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

function replaceRegex(source, regex, replacement, label) {
  if (!regex.test(source)) throw new Error(`Patch regex target not found: ${label}`);
  return source.replace(regex, replacement);
}

// 1) Çoklu seçim: yalnızca aynı fiziksel duvar düzlemi / yön üzerinde.
const rectPath = 'src/rectSelection.js';
let rect = fs.readFileSync(rectPath, 'utf8');
rect = replaceOnce(
  rect,
  `function normalizePoint(point) {\n  return {\n    moduleIndex: Number(point?.moduleIndex),\n    stripIndex: Number(point?.stripIndex),\n  };\n}\n`,
  `function normalizePoint(point) {\n  return {\n    moduleIndex: Number(point?.moduleIndex),\n    stripIndex: Number(point?.stripIndex),\n    selectionPlaneKey: point?.selectionPlaneKey ?? null,\n  };\n}\n`,
  'rect normalizePoint',
);
rect = replaceOnce(
  rect,
  `  const minModuleIndex = Math.min(anchor.moduleIndex, target.moduleIndex);\n`,
  `  if (\n    anchor.selectionPlaneKey\n    && target.selectionPlaneKey\n    && anchor.selectionPlaneKey !== target.selectionPlaneKey\n  ) {\n    return {\n      ok: false,\n      message: 'Çoklu seçim yalnızca aynı duvar düzleminde yapılabilir.',\n    };\n  }\n\n  const requiredPlaneKey = anchor.selectionPlaneKey ?? target.selectionPlaneKey ?? null;\n  const minModuleIndex = Math.min(anchor.moduleIndex, target.moduleIndex);\n`,
  'rect plane guard',
);
rect = replaceOnce(
  rect,
  `  const entries = items\n    .filter((item) => (\n      item.moduleIndex >= minModuleIndex\n      && item.moduleIndex <= maxModuleIndex\n      && item.stripIndex >= minStripIndex\n      && item.stripIndex <= maxStripIndex\n    ))\n`,
  `  const rectangleItems = items.filter((item) => (\n    item.moduleIndex >= minModuleIndex\n    && item.moduleIndex <= maxModuleIndex\n    && item.stripIndex >= minStripIndex\n    && item.stripIndex <= maxStripIndex\n  ));\n\n  if (\n    requiredPlaneKey\n    && rectangleItems.some((item) => (\n      item.selectionPlaneKey != null && item.selectionPlaneKey !== requiredPlaneKey\n    ))\n  ) {\n    return {\n      ok: false,\n      message: 'Çoklu seçim yalnızca aynı duvar düzleminde yapılabilir.',\n    };\n  }\n\n  const entries = rectangleItems\n    .filter((item) => !requiredPlaneKey || item.selectionPlaneKey == null || item.selectionPlaneKey === requiredPlaneKey)\n`,
  'rect plane filter',
);
fs.writeFileSync(rectPath, rect);

const rectTestPath = 'test/rectSelection.test.js';
let rectTest = fs.readFileSync(rectTestPath, 'utf8');
rectTest += `\n\ntest('rejects rectangle selection across different wall planes', () => {\n  const items = makeGrid(3, 2).map((item) => ({\n    ...item,\n    selectionPlaneKey: item.moduleIndex === 1 ? 'back:0:x:0' : 'free:0:x:100',\n  }));\n  const result = createRectSelection(\n    items,\n    { moduleIndex: 0, stripIndex: 0, selectionPlaneKey: 'free:0:x:100' },\n    { moduleIndex: 2, stripIndex: 1, selectionPlaneKey: 'free:0:x:100' },\n  );\n\n  assert.equal(result.ok, false);\n  assert.equal(result.message, 'Çoklu seçim yalnızca aynı duvar düzleminde yapılabilir.');\n});\n`;
fs.writeFileSync(rectTestPath, rectTest);

// 2) Collision: merkez çizgisine ek olarak gerçek 10 cm modül derinliğini hesaba kat.
const placementPath = 'src/modulePlacement.js';
let placement = fs.readFileSync(placementPath, 'utf8');
placement = `import { STAND_DIMENSIONS } from './catalog.js';\n\n${placement}`;
placement = replaceOnce(
  placement,
  `export const MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30;\n`,
  `export const MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30;\nexport const MODULE_COLLISION_DEPTH_CM = Math.max(\n  0,\n  Number(STAND_DIMENSIONS.depth) * 100 || 0,\n);\n`,
  'collision depth constant',
);
placement = replaceRegex(
  placement,
  /export function placementsOverlap\(moduleA, moduleB\) \{[\s\S]*?\n\}\n\nexport function validatePlacementAgainstModules/,
  `function getModuleCollisionDepthCm(module) {\n  const explicitDepthCm = Number(module?.depthCm);\n  if (Number.isFinite(explicitDepthCm) && explicitDepthCm > 0) return explicitDepthCm;\n  return MODULE_COLLISION_DEPTH_CM;\n}\n\nexport function placementsOverlap(moduleA, moduleB) {\n  const a = getGroundSegment(moduleA);\n  const b = getGroundSegment(moduleB);\n  if (!a || !b) return false;\n\n  const depthA = getModuleCollisionDepthCm(moduleA);\n  const depthB = getModuleCollisionDepthCm(moduleB);\n\n  if (a.axis === b.axis) {\n    const longitudinalOverlap = a.startCm < b.endCm - EPSILON_CM\n      && b.startCm < a.endCm - EPSILON_CM;\n    if (!longitudinalOverlap) return false;\n\n    const centerLineGapCm = Math.abs(a.fixedCm - b.fixedCm);\n    const requiredGapCm = (depthA + depthB) / 2;\n    return centerLineGapCm < requiredGapCm - EPSILON_CM;\n  }\n\n  const horizontal = a.axis === 'x' ? a : b;\n  const vertical = a.axis === 'y' ? a : b;\n  const horizontalModule = a.axis === 'x' ? moduleA : moduleB;\n  const verticalModule = a.axis === 'y' ? moduleA : moduleB;\n  const horizontalDepth = getModuleCollisionDepthCm(horizontalModule);\n  const verticalDepth = getModuleCollisionDepthCm(verticalModule);\n  const intersectionX = vertical.fixedCm;\n  const intersectionY = horizontal.fixedCm;\n  const onHorizontal = intersectionX >= horizontal.startCm - EPSILON_CM\n    && intersectionX <= horizontal.endCm + EPSILON_CM;\n  const onVertical = intersectionY >= vertical.startCm - EPSILON_CM\n    && intersectionY <= vertical.endCm + EPSILON_CM;\n\n  if (onHorizontal && onVertical) {\n    // Gerçek L/T bağlantılarında merkez çizgileri birleşebilir; en az bir\n    // modülün ucu bağlantı noktasındaysa bu birleşim kasıtlıdır.\n    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);\n    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);\n    return !horizontalEndpoint && !verticalEndpoint;\n  }\n\n  // Merkez çizgileri kesişmese bile 10 cm kasalar fiziksel olarak birbirine\n  // girebilir. Dik modülün yarı derinliğini X, yatay modülün yarı derinliğini\n  // Y doğrultusunda genişleterek gerçek footprint çakışmasını yakala.\n  const verticalHalfDepth = verticalDepth / 2;\n  const horizontalHalfDepth = horizontalDepth / 2;\n  const physicalXOverlap = intersectionX > horizontal.startCm - verticalHalfDepth + EPSILON_CM\n    && intersectionX < horizontal.endCm + verticalHalfDepth - EPSILON_CM;\n  const physicalYOverlap = intersectionY > vertical.startCm - horizontalHalfDepth + EPSILON_CM\n    && intersectionY < vertical.endCm + horizontalHalfDepth - EPSILON_CM;\n  return physicalXOverlap && physicalYOverlap;\n}\n\nexport function validatePlacementAgainstModules`,
  'depth-aware placementsOverlap',
);
fs.writeFileSync(placementPath, placement);

const placementTestPath = 'test/modulePlacement.test.js';
let placementTest = fs.readFileSync(placementTestPath, 'utf8');
placementTest += `\n\ntest('physical module depth rejects parallel bodies that are too close', () => {\n  const modules = [{\n    id: 'a',\n    widthCm: 200,\n    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  }];\n\n  const tooClose = validatePlacementAgainstModules({\n    moduleId: 'b',\n    widthCm: 200,\n    placement: { xCm: 100, yCm: 109, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n    modules,\n    standType: 'back-wall',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(tooClose.ok, false);\n\n  const justTouching = validatePlacementAgainstModules({\n    moduleId: 'b',\n    widthCm: 200,\n    placement: { xCm: 100, yCm: 110, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n    modules,\n    standType: 'back-wall',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(justTouching.ok, true);\n});\n`;
fs.writeFileSync(placementTestPath, placementTest);

// 3) Feedback mesajlarını tek yerde sadeleştir.
const feedbackPath = 'src/placementFeedback.js';
fs.writeFileSync(feedbackPath, `export function formatPlacementFeedbackMessage(message) {\n  const text = String(message ?? '').trim();\n  if (!text) return '';\n\n  if (/başka (bir )?modülle çakışıyor|bu konumda başka bir modül var/i.test(text)) {\n    return 'Başka modülle çakışıyor.';\n  }\n  if (/stand sınırını aşıyor|aktif stand alanını aşıyor|hedef duvar sınırına sığmıyor/i.test(text)) {\n    return 'Stand sınırı dışında.';\n  }\n  if (/aktif duvar zincirinde.*yeterli alan yok/i.test(text)) {\n    return 'Yeterli boşluk yok.';\n  }\n  if (/duvar modülü .* yönünde olmalı|bu stand tipinde bu konuma modül yerleştirilemez/i.test(text)) {\n    return 'Bu konuma bu yönde yerleştirilemez.';\n  }\n\n  return text;\n}\n`);

const feedbackTestPath = 'test/placementFeedback.test.js';
fs.writeFileSync(feedbackTestPath, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { formatPlacementFeedbackMessage } from '../src/placementFeedback.js';\n\ntest('simplifies collision feedback', () => {\n  assert.equal(\n    formatPlacementFeedbackMessage('Başka bir modülle çakışıyor.'),\n    'Başka modülle çakışıyor.',\n  );\n});\n\ntest('simplifies stand boundary feedback', () => {\n  assert.equal(\n    formatPlacementFeedbackMessage('Modül X stand sınırını aşıyor.'),\n    'Stand sınırı dışında.',\n  );\n  assert.equal(\n    formatPlacementFeedbackMessage('Modül aktif stand alanını aşıyor.'),\n    'Stand sınırı dışında.',\n  );\n});\n\ntest('simplifies continuous wall capacity feedback', () => {\n  assert.equal(\n    formatPlacementFeedbackMessage('Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.'),\n    'Yeterli boşluk yok.',\n  );\n});\n`);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
scene = replaceOnce(
  scene,
  `import { computeImageFit } from './imageFit.js';\n`,
  `import { computeImageFit } from './imageFit.js';\nimport { formatPlacementFeedbackMessage } from './placementFeedback.js';\n`,
  'scene feedback import',
);
scene = replaceOnce(
  scene,
  `    const text = String(message ?? '').trim();\n`,
  `    const text = formatPlacementFeedbackMessage(message);\n`,
  'scene feedback formatting',
);
scene = replaceOnce(
  scene,
  `          stripIndex: surface.userData.stripIndex,\n        })),\n`,
  `          stripIndex: surface.userData.stripIndex,\n          selectionPlaneKey: surface.userData.selectionPlaneKey ?? null,\n        })),\n`,
  'scene rect selection plane data',
);
scene = replaceOnce(
  scene,
  `  function applyPlacementToGroup(group, placement, widthCm) {\n`,
  `  function createSelectionPlaneKey(placement) {\n    if (!placement) return null;\n    const rotation = normalizeModuleRotationZDeg(placement.rotationZDeg);\n    const vertical = isVerticalModuleRotation(rotation);\n    const fixedCm = vertical ? Number(placement.xCm) : Number(placement.yCm);\n    if (!Number.isFinite(fixedCm)) return null;\n    return [\n      placement.wallId ?? 'free',\n      rotation,\n      vertical ? 'y' : 'x',\n      fixedCm.toFixed(3),\n    ].join(':');\n  }\n\n  function applyPlacementToGroup(group, placement, widthCm) {\n`,
  'scene selection plane helper',
);
scene = replaceOnce(
  scene,
  `    if (vertical) {\n      group.position.set(xM, logicalZM, logicalYM + widthM / 2);\n    } else {\n      group.position.set(xM + widthM / 2, logicalZM, logicalYM);\n    }\n  }\n`,
  `    if (vertical) {\n      group.position.set(xM, logicalZM, logicalYM + widthM / 2);\n    } else {\n      group.position.set(xM + widthM / 2, logicalZM, logicalYM);\n    }\n\n    const selectionPlaneKey = createSelectionPlaneKey(placement);\n    group.userData.selectionPlaneKey = selectionPlaneKey;\n    group.traverse((child) => {\n      if (child.userData?.kind === 'surface') {\n        child.userData.selectionPlaneKey = selectionPlaneKey;\n      }\n    });\n  }\n`,
  'scene selection plane assignment',
);
fs.writeFileSync(scenePath, scene);

// 4) Roadmap: mevcut FAZ 2 gerçeğiyle eşitle; Issue #1 kapanışın en son maddesi olarak kalsın.
const roadmapPath = 'ROADMAP.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
  '- **FAZ 2: BAŞLADI — 10 Ağustos 2026**',
  '- **FAZ 2: YERLEŞİM MOTORU KAPANIŞ / POLISH AŞAMASI — 11 Ağustos 2026**',
);
roadmap = roadmap.replace(
  '- **FAZ 2.1: Yerleşim state + kontrollü sürükleme + edge snap temeli aktif**',
  '- **FAZ 2.1: temel tamamlandı; 4 yön rotasyon, magnetic snap, serbest yerleşim ve feedback aktif**',
);
roadmap = roadmap.replace(
  '- Sırt kenarında modül X yönüne, yan kenarlarda Y yönüne 0°/90° kontrollü şekilde oturur.',
  '- Modüller yalnızca 0° / 90° / 180° / 270° plan rotasyonlarında çalışır; `R` +90°, `Shift+R` -90° döndürür.',
);
roadmap = replaceRegex(
  roadmap,
  /## FAZ 2\.1'de henüz yapılmayanlar[\s\S]*?## FAZ 2 ana hedefleri/,
  `## FAZ 2 — güncel durum (11 Ağustos 2026)\n\nTamamlanan yerleşim özellikleri:\n\n- Katalog kartından doğrudan 3D sahneye drag & drop.\n- Sırt, L Sol, L Sağ, U ve Ada standlarda ortak 50 cm grid yerleşim motoru.\n- Tüm modüllerde 0° / 90° / 180° / 270° gerçek ön-yüz rotasyonu.\n- Sürüklerken ve seçiliyken `R` / `Shift+R` ile dönüş.\n- Modül merkezinden dönüş ve 50 cm grid'e yeniden oturma.\n- Modül-modül magnetic snap: uç-uca, L ve T bağlantıları.\n- Serbest alan yerleşimi ile perimeter duvar yerleşiminin aynı modül sistemi içinde çalışması.\n- Geçersiz sürükleme/dönüşte kırmızı ghost ve kısa kullanıcı feedback'i.\n- Çoklu panel dikdörtgen seçiminin farklı duvar düzlemlerini/köşeleri geçmesinin engellenmesi.\n- Collision kontrolünün merkez çizgisine ek olarak gerçek modül kasa derinliğini hesaba katması.\n- Kullanıcıya gösterilen yerleşim hata mesajlarının sadeleştirilmesi.\n\nFAZ 2 kapanış öncesi kalan:\n\n- **Issue #1 — EN SON:** serbest alandaki modül sıralarında `Ekle/Çoğalt Sağ/Sol` işlemlerinin yanlışlıkla duvar kapasitesi kontrolüne girmesi.\n- Issue #1 sonrası final regresyon ve FAZ 2 kapanış kararı.\n\n## FAZ 2 ana hedefleri`,
  'roadmap current status',
);
roadmap = roadmap.replace(
  '   - Sonraki adımda modül katalogdan doğrudan sahneye sürüklenebilir olacaktır.',
  '   - Modül katalog kartından doğrudan sahneye sürüklenebilir.',
);
roadmap = roadmap.replace(
  '   - X/Y konumu ve Z ekseni etrafındaki 0°/90° yönü state\'te saklanır.',
  '   - X/Y konumu ve Z ekseni etrafındaki 0°/90°/180°/270° yönü state\'te saklanır.',
);
roadmap = roadmap.replace(
  '   - L ve U yerleşim motoru oturduktan sonra serbest ada yerleşimi aynı kontrollü snap altyapısı üzerinden ele alınacaktır.',
  '   - Ada Stand serbest yerleşimi aynı kontrollü 50 cm grid + snap altyapısı üzerinden aktif olarak çalışır.',
);
fs.writeFileSync(roadmapPath, roadmap);

console.log('FAZ 2 polish patch applied.');
