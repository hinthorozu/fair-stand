import fs from 'node:fs';

const path = 'src/modulePlacement.js';
let s = fs.readFileSync(path, 'utf8');

function once(from, to, label) {
  const count = s.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1, found ${count}`);
  s = s.replace(from, to);
}

once(
  `    if (strictMovingDepth) {\n      if (!freePlacement || target.axis !== movingAxis) return;\n\n      const targetDepthCm = getModuleCollisionDepthCm(targetModule);`,
  `    if (strictMovingDepth) {\n      if (!freePlacement) return;\n\n      const targetDepthCm = getModuleCollisionDepthCm(targetModule);\n\n      if (target.axis !== movingAxis) {\n        const targetHalfDepthCm = targetDepthCm / 2;\n        const crossCenterCm = movingAxis === 'x'\n          ? Number(freePlacement.yCm)\n          : Number(freePlacement.xCm);\n        const sideMinCm = crossCenterCm - movingDepthCm / 2;\n        const sideMaxCm = crossCenterCm + movingDepthCm / 2;\n        const crossOverlap = sideMinCm < target.endCm - EPSILON_CM\n          && target.startCm < sideMaxCm - EPSILON_CM;\n        if (!crossOverlap) return;\n\n        [\n          target.fixedCm + targetHalfDepthCm,\n          target.fixedCm - targetHalfDepthCm - width,\n        ].forEach((startCm) => {\n          const placement = createModulePlacement({\n            ...freePlacement,\n            xCm: movingAxis === 'x' ? startCm : freePlacement.xCm,\n            yCm: movingAxis === 'y' ? startCm : freePlacement.yCm,\n            rotationZDeg: resolvedRotation,\n            wallId: 'free',\n          });\n          const center = getPlacementCenter(placement, width);\n          if (!center) return;\n          const alongAxisDistanceCm = movingAxis === 'x'\n            ? Math.abs(center.xCm - pointerX)\n            : Math.abs(center.yCm - pointerY);\n          addCandidate(placement, targetModule.id, 'face', -1, alongAxisDistanceCm);\n        });\n        return;\n      }`,
  'four-side snap',
);

fs.writeFileSync(path, s);

const changelogPath = 'Changelog.md';
let c = fs.readFileSync(changelogPath, 'utf8');
if (!c.includes('438. Banko yaslama davranışındaki paralel eksen kısıtı')) {
  c += `\n\n## Banko dört taraf yaslama düzeltmesi\n\n438. Banko yaslama davranışındaki paralel eksen kısıtı kaldırıldı; fiziksel gövdenin ön, arka, sol ve sağ dört tarafı da uygun duvar/modül yüzüne temas ederek yaslanabilir.\n439. Ön/arka temasında gerçek derinlikler birlikte hesaplanır; sol/sağ uç yüz temasında bankonun gerçek uç yüzü hedef modülün kasa yüzüne oturtulur.\n440. 0/90/180/270 derece yönlerin tamamında temas serbest, fiziksel iç içe geçme collision olarak yasaktır.\n`;
  fs.writeFileSync(changelogPath, c);
}

console.log('Banko four-side snap patch applied.');
