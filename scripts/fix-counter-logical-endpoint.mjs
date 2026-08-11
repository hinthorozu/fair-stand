import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceExact(source, from, to, label, expected = 1) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected}, found ${count}`);
  return source.split(from).join(to);
}

{
  const path = 'src/modulePlacement.js';
  let s = read(path);

  s = replaceExact(s,
`export function validatePlacementAgainstModules({
  placement,
  widthCm,
  depthCm = null,
  moduleId = null,
  modules = [],`,
`export function validatePlacementAgainstModules({
  placement,
  widthCm,
  depthCm = null,
  moduleId = null,
  moduleType = null,
  modules = [],`,
'validation module type');

  s = replaceExact(s,
`  const candidate = { id: moduleId, widthCm, depthCm, placement };`,
`  const candidate = { id: moduleId, type: moduleType, widthCm, depthCm, placement };`,
'candidate module type');

  s = replaceExact(s,
`      moduleId,
      modules,
      standType,`,
`      moduleId,
      moduleType,
      modules,
      standType,`,
'snap candidate validation type');

  s = replaceExact(s,
`        const targetHalfDepthCm = targetDepthCm / 2;
        const crossCenterCm = movingAxis === 'x'`,
`        const targetHalfDepthCm = targetDepthCm / 2;
        const logicalEndpointContact = isCounter
          && targetDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
        const endpointOffsetCm = logicalEndpointContact ? 0 : targetHalfDepthCm;
        const crossCenterCm = movingAxis === 'x'`,
'logical endpoint offset');

  s = replaceExact(s,
`        [
          target.fixedCm + targetHalfDepthCm,
          target.fixedCm - targetHalfDepthCm - width,
        ].forEach((startCm) => {`,
`        [
          target.fixedCm + endpointOffsetCm,
          target.fixedCm - endpointOffsetCm - width,
        ].forEach((startCm) => {`,
'counter side positions');

  s = replaceExact(s,
`    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);
    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);
    const thinEndpointJoin = horizontalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM`,
`    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);
    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);

    const counterModule = horizontalModule?.type === 'counter'
      ? horizontalModule
      : (verticalModule?.type === 'counter' ? verticalModule : null);
    if (counterModule) {
      const counterIsHorizontal = counterModule === horizontalModule;
      const counterSegment = counterIsHorizontal ? horizontal : vertical;
      const thinModule = counterIsHorizontal ? verticalModule : horizontalModule;
      const counterIntersectionCm = counterIsHorizontal ? intersectionX : intersectionY;
      const thinDepthCm = getModuleCollisionDepthCm(thinModule);
      const logicalCounterEndpointJoin = thinDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM
        && pointIsSegmentEndpoint(counterSegment, counterIntersectionCm);
      if (logicalCounterEndpointJoin) return false;
    }

    const thinEndpointJoin = horizontalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM`,
'counter thin endpoint collision exception');

  s = replaceExact(s,
`      const targetHalfDepthCm = targetDepthCm / 2;
      const faceA = target.fixedCm - targetHalfDepthCm;
      const faceB = target.fixedCm + targetHalfDepthCm;
      const endpointContact = nearlyEqual(moving.startCm, faceA)
        || nearlyEqual(moving.startCm, faceB)
        || nearlyEqual(moving.endCm, faceA)
        || nearlyEqual(moving.endCm, faceB);`,
`      const targetHalfDepthCm = targetDepthCm / 2;
      const logicalEndpointContact = isCounter
        && targetDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
      const targetFaces = logicalEndpointContact
        ? [target.fixedCm]
        : [target.fixedCm - targetHalfDepthCm, target.fixedCm + targetHalfDepthCm];
      const endpointContact = targetFaces.some((faceCm) => (
        nearlyEqual(moving.startCm, faceCm) || nearlyEqual(moving.endCm, faceCm)
      ));`,
'corner logical endpoint contact');

  write(path, s);
}

{
  const path = 'src/scene3d.js';
  let s = read(path);

  const validationPattern = /moduleId: moduleState\.id,\n(\s+)modules:/g;
  const matches = [...s.matchAll(validationPattern)];
  if (matches.length !== 3) throw new Error(`scene validation moduleType: expected 3, found ${matches.length}`);
  s = s.replace(validationPattern, (_match, indent) => (
    `moduleId: moduleState.id,\n${indent}moduleType: moduleState.type,\n${indent}modules:`
  ));

  const filterBlock = `modules: moduleState.type === 'counter'\n        ? renderedModules\n        : renderedModules.filter((module) => module.type !== 'counter'),`;
  s = replaceExact(s, filterBlock, `modules: renderedModules,`, 'counter snap target filter', 2);

  write(path, s);
}

{
  const path = 'test/modulePlacement.test.js';
  let s = read(path);

  s = s.replaceAll(`moduleId: 'counter',\n    widthCm:`, `moduleId: 'counter',\n    moduleType: 'counter',\n    widthCm:`);
  s = s.replaceAll(`moduleId: 'counter', widthCm:`, `moduleId: 'counter', moduleType: 'counter', widthCm:`);

  s = replaceExact(s, `assert.equal(left?.placement.xCm, 5);`, `assert.equal(left?.placement.xCm, 0);`, 'left wall expected');
  s = replaceExact(s, `assert.equal(right?.placement.xCm, 695);`, `assert.equal(right?.placement.xCm, 700);`, 'right wall expected');
  s = replaceExact(s, `assert.equal(snapped?.placement.yCm, 5);`, `assert.equal(snapped?.placement.yCm, 0);`, 'rotated back wall expected');

  s = replaceExact(s,
`      pointerXCm: 55, pointerYCm: 30, rotationZDeg: 0, expectedX: 5, expectedY: 30,`,
`      pointerXCm: 50, pointerYCm: 30, rotationZDeg: 0, expectedX: 0, expectedY: 30,`,
'corner u-left expected');
  s = replaceExact(s,
`      pointerXCm: 745, pointerYCm: 30, rotationZDeg: 0, expectedX: 695, expectedY: 30,`,
`      pointerXCm: 750, pointerYCm: 30, rotationZDeg: 0, expectedX: 700, expectedY: 30,`,
'corner u-right expected');
  s = replaceExact(s,
`      pointerXCm: 30, pointerYCm: 55, rotationZDeg: 90, expectedX: 30, expectedY: 5,`,
`      pointerXCm: 30, pointerYCm: 50, rotationZDeg: 90, expectedX: 30, expectedY: 0,`,
'corner l-left expected');
  s = replaceExact(s,
`      pointerXCm: 770, pointerYCm: 55, rotationZDeg: 90, expectedX: 770, expectedY: 5,`,
`      pointerXCm: 770, pointerYCm: 50, rotationZDeg: 90, expectedX: 770, expectedY: 0,`,
'corner l-right expected');

  const marker = `\ntest('physical module depth rejects parallel bodies that are too close', () => {`;
  if (!s.includes('all banko widths fit exact logical grid gaps next to thin modules')) {
    const block = `\ntest('all banko widths fit exact logical grid gaps next to thin modules', () => {\n  [100, 150, 200].forEach((widthCm) => {\n    const modules = [{\n      id: 'separator',\n      type: 'separator',\n      widthCm: 300,\n      placement: { xCm: widthCm, yCm: 0, zCm: 0, rotationZDeg: 90, wallId: 'right' },\n    }];\n\n    const snapped = snapPlacementToModules({\n      moduleId: 'counter',\n      moduleType: 'counter',\n      widthCm,\n      depthCm: 50,\n      pointerXCm: widthCm / 2,\n      pointerYCm: 125,\n      rotationZDeg: 0,\n      modules,\n      standType: 'u-stand',\n      standXCm: widthCm,\n      standYCm: 400,\n    });\n\n    assert.equal(snapped?.snapKind, 'face', String(widthCm));\n    assert.equal(snapped?.placement.xCm, 0, String(widthCm));\n    assert.equal(validatePlacementAgainstModules({\n      moduleId: 'counter',\n      moduleType: 'counter',\n      widthCm,\n      depthCm: 50,\n      placement: snapped.placement,\n      modules,\n      standType: 'u-stand',\n      standXCm: widthCm,\n      standYCm: 400,\n    }).ok, true, String(widthCm));\n  });\n});\n\ntest('thin modules may snap to a banko endpoint symmetrically', () => {\n  const modules = [{\n    id: 'counter-target',\n    type: 'counter',\n    widthCm: 100,\n    depthCm: 50,\n    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  }];\n\n  const snapped = snapPlacementToModules({\n    moduleId: 'separator',\n    moduleType: 'separator',\n    widthCm: 50,\n    pointerXCm: 200,\n    pointerYCm: 125,\n    rotationZDeg: 90,\n    modules,\n    standType: 'island',\n    standXCm: 500,\n    standYCm: 500,\n  });\n\n  assert.equal(snapped?.snapKind, 'corner');\n  assert.equal(snapped?.placement.xCm, 200);\n  assert.equal(snapped?.placement.yCm, 100);\n});\n`;
    s = replaceExact(s, marker, block + marker, 'counter grid test insertion');
  }

  write(path, s);
}

{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('444. Banko 100/150/200')) {
    s += `\n\n## Banko nominal ölçü / mantıksal bağlantı çizgisi düzeltmesi\n\n444. Banko 100/150/200 fiziksel ve nominal X ölçüleri değiştirilmeden sırasıyla 100/150/200 cm olarak korunur.\n445. Bankonun sol/sağ uç yüzü 10 cm derinlikli ince duvar, panel, separatör ve benzeri modüllerde dış yüzeyden 5 cm kaçmak yerine modülün mantıksal merkez/bağlantı çizgisine oturabilir; böylece 100 cm grid aralığına Banko 100 gerçekten sığar.\n446. Bu mantıksal uç bağlantısı bankoya özeldir; banko-bankoya temas gerçek gövde yüzeyleri üzerinden hesaplanmaya devam eder.\n447. İnce modül -> banko ve banko -> ince modül yerleşimleri aynı endpoint bağlantısını kabul eder; snap hedefi olarak bankoların tek taraflı filtrelenmesi kaldırıldı.\n448. Banko 100/150/200 için tam nominal grid aralığı regresyon testleri ve ters yönde ince-modül -> banko endpoint snap testi eklendi.\n`;
  }
  write(path, s);
}

console.log('Counter logical endpoint patch applied.');
