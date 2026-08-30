from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')

marker = "\nfunction createBeigeSofaSetModule(moduleState, moduleIndex) {\n"
if marker not in text:
    raise SystemExit('createBeigeSofaSetModule marker not found')

helper = r'''

const BEIGE_SOFA_LEG_MASKS = Object.freeze({
  beigechair2seatsofa_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00175,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([-0.00284, -0.03336]),
      Object.freeze([-0.03125, -0.00507]),
      Object.freeze([-0.01806, -0.04668]),
      Object.freeze([-0.04541, -0.01885]),
    ]),
  }),
  beigechair1_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00165,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([-0.03313, 0.03660]),
      Object.freeze([-0.01031, 0.03512]),
      Object.freeze([-0.02506, 0.02244]),
      Object.freeze([-0.02182, 0.04626]),
    ]),
  }),
  beigechair3_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00165,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([0.03456, -0.03568]),
      Object.freeze([0.03415, -0.01213]),
      Object.freeze([0.02072, -0.02595]),
      Object.freeze([0.04524, -0.02491]),
    ]),
  }),
});

function makeBeigeSofaBodyWhite(object) {
  if (!object?.isMesh || !object.geometry || !object.material) return;
  const mask = BEIGE_SOFA_LEG_MASKS[object.name];
  if (!mask) return;

  const sourceMaterial = Array.isArray(object.material) ? object.material[0] : object.material;
  if (!sourceMaterial) return;

  const geometry = object.geometry.clone();
  const position = geometry.getAttribute('position');
  if (!position || position.count < 3) return;

  let minY = Infinity;
  let maxY = -Infinity;
  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    const y = position.getY(vertexIndex);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const legMaxY = minY + Math.max(maxY - minY, 1e-9) * mask.maxYRatio;
  const radiusSquared = mask.radius * mask.radius;
  const index = geometry.index;
  const triangleCount = Math.floor((index ? index.count : position.count) / 3);

  const triangleMaterial = new Uint8Array(triangleCount);
  for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
    const offset = triangleIndex * 3;
    const a = index ? index.getX(offset) : offset;
    const b = index ? index.getX(offset + 1) : offset + 1;
    const c = index ? index.getX(offset + 2) : offset + 2;
    const centerX = (position.getX(a) + position.getX(b) + position.getX(c)) / 3;
    const centerY = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
    const centerZ = (position.getZ(a) + position.getZ(b) + position.getZ(c)) / 3;

    if (centerY > legMaxY) continue;
    const isLeg = mask.centers.some(([legX, legZ]) => {
      const dx = centerX - legX;
      const dz = centerZ - legZ;
      return dx * dx + dz * dz <= radiusSquared;
    });
    if (isLeg) triangleMaterial[triangleIndex] = 1;
  }

  const whiteMaterial = sourceMaterial.clone();
  whiteMaterial.map = null;
  whiteMaterial.color?.set('#ffffff');
  whiteMaterial.needsUpdate = true;

  // Leg material is a plain clone of the original GLB material. No property is altered.
  const originalLegMaterial = sourceMaterial.clone();

  geometry.clearGroups();
  if (triangleCount > 0) {
    let runStart = 0;
    let runMaterial = triangleMaterial[0];
    for (let triangleIndex = 1; triangleIndex <= triangleCount; triangleIndex += 1) {
      const nextMaterial = triangleIndex < triangleCount ? triangleMaterial[triangleIndex] : 255;
      if (triangleIndex < triangleCount && nextMaterial === runMaterial) continue;
      geometry.addGroup(runStart * 3, (triangleIndex - runStart) * 3, runMaterial);
      runStart = triangleIndex;
      runMaterial = nextMaterial;
    }
  }

  object.geometry = geometry;
  object.material = [whiteMaterial, originalLegMaterial];
}
'''

text = text.replace(marker, helper + marker, 1)

old = """      mesh.traverse((object) => {\n        if (!object.isMesh) return;\n        object.castShadow = true;\n        object.receiveShadow = true;\n        // Keep the GLB material exactly as authored: no color, texture or material overrides.\n      });"""
new = """      mesh.traverse((object) => {\n        if (!object.isMesh) return;\n        object.castShadow = true;\n        object.receiveShadow = true;\n        makeBeigeSofaBodyWhite(object);\n      });"""
if old not in text:
    raise SystemExit('sofa traverse block not found')
text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')
