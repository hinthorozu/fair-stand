import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceOnce(source, from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 occurrence, found ${count}`);
  return source.replace(from, to);
}

// modulePlacement.js
{
  const path = 'src/modulePlacement.js';
  let s = read(path);

  s = replaceOnce(
    s,
    `  const addCandidate = (placement, targetModuleId, snapKind, priority = 0) => {\n    const center = getPlacementCenter(placement, width);\n    if (!center) return;\n    const distanceCm = Math.hypot(center.xCm - pointerX, center.yCm - pointerY);\n    if (distanceCm > threshold + EPSILON_CM) return;`,
    `  const addCandidate = (\n    placement,\n    targetModuleId,\n    snapKind,\n    priority = 0,\n    distanceOverrideCm = null,\n  ) => {\n    const center = getPlacementCenter(placement, width);\n    if (!center) return;\n    const overrideDistance = Number(distanceOverrideCm);\n    const distanceCm = Number.isFinite(overrideDistance)\n      ? overrideDistance\n      : Math.hypot(center.xCm - pointerX, center.yCm - pointerY);\n    if (distanceCm > threshold + EPSILON_CM) return;`,
    'candidate distance override',
  );

  s = replaceOnce(
    s,
    `        addCandidate(placement, targetModule.id, 'face', -1);`,
    `        const perpendicularDistanceCm = movingAxis === 'x'\n          ? Math.abs(Number(placement.yCm) - pointerY)\n          : Math.abs(Number(placement.xCm) - pointerX);\n        addCandidate(placement, targetModule.id, 'face', -1, perpendicularDistanceCm);`,
    'counter face perpendicular distance',
  );

  write(path, s);
}

// test/modulePlacement.test.js
{
  const path = 'test/modulePlacement.test.js';
  let s = read(path);
  const marker = `\ntest('physical module depth rejects parallel bodies that are too close', () => {`;
  const block = `\ntest('counter face snap ignores longitudinal grid offset when measuring wall proximity', () => {\n  const modules = [{\n    id: 'wall',\n    widthCm: 300,\n    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },\n  }];\n\n  const snapped = snapPlacementToModules({\n    moduleId: 'counter',\n    widthCm: 100,\n    depthCm: 50,\n    pointerXCm: 125,\n    pointerYCm: 0,\n    rotationZDeg: 0,\n    modules,\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n\n  assert.equal(snapped?.snapKind, 'face');\n  assert.equal(snapped?.placement.xCm, 100);\n  assert.equal(snapped?.placement.yCm, 30);\n\n  const validation = validatePlacementAgainstModules({\n    moduleId: 'counter',\n    widthCm: 100,\n    depthCm: 50,\n    placement: snapped.placement,\n    modules,\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(validation.ok, true);\n});\n`;
  if (!s.includes("counter face snap ignores longitudinal grid offset")) {
    s = replaceOnce(s, marker, block + marker, 'counter face snap distance regression');
  }
  write(path, s);
}

// Changelog.md
{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('435. Banko yüzeye yaslama snap mesafesi')) {
    s += `\n\n## Banko yüzeye yaslama snap mesafesi düzeltmesi\n\n435. Banko yüzeye yaslama snap mesafesi artık 2B Öklid mesafesiyle değil, hedef yüzeye dik eksendeki gerçek mesafeyle ölçülür.\n436. X/Y boyunca 50 cm grid hizasından doğan en fazla 25 cm boyuna fark, bankonun duvara yaslanma adayını artık yanlışlıkla iptal etmez.\n437. Böylece banko duvara yaklaştırıldığında 50 cm gerçek derinlik korunarak 10 cm duvar kasasına 30 cm merkez çizgisi mesafesinde sıfır temasla snap olur; iç içe geçme hâlâ collision olarak reddedilir.\n`;
  }
  write(path, s);
}

console.log('Counter face snap distance patch applied.');
