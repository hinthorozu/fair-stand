/**
 * Admin montaj AABB (OBB lokal) köşe → köşe yapıştırma.
 * Three: X=W, Y=H, Z=D. Ürün SCENE_POSE ile uyumlu.
 */

/** @typedef {{ key: string, w: -1|1, h: -1|1, d: -1|1, label: string }} CornerDef */

/** @type {CornerDef[]} */
export const ASSEMBLY_CORNERS = [
  { key: 'w-h-d-', w: -1, h: -1, d: -1, label: 'W− H− D−' },
  { key: 'w+h-d-', w: 1, h: -1, d: -1, label: 'W+ H− D−' },
  { key: 'w-h-d+', w: -1, h: -1, d: 1, label: 'W− H− D+' },
  { key: 'w+h-d+', w: 1, h: -1, d: 1, label: 'W+ H− D+' },
  { key: 'w-h+d-', w: -1, h: 1, d: -1, label: 'W− H+ D−' },
  { key: 'w+h+d-', w: 1, h: 1, d: -1, label: 'W+ H+ D−' },
  { key: 'w-h+d+', w: -1, h: 1, d: 1, label: 'W− H+ D+' },
  { key: 'w+h+d+', w: 1, h: 1, d: 1, label: 'W+ H+ D+' },
];

export function getCornerDef(key) {
  return ASSEMBLY_CORNERS.find((corner) => corner.key === key) || null;
}

/**
 * Lokal köşe ofseti (mesh merkezine göre, metre).
 * @param {{ widthM: number, depthM: number, heightM: number }} size
 * @param {CornerDef} corner
 */
export function localCornerOffsetMeters(size, corner) {
  const widthM = Math.max(Number(size?.widthM) || 0.01, 0.01);
  const depthM = Math.max(Number(size?.depthM) || 0.01, 0.01);
  const heightM = Math.max(Number(size?.heightM) || 0.01, 0.01);
  return {
    x: corner.w * (widthM / 2),
    y: corner.h * (heightM / 2),
    z: corner.d * (depthM / 2),
  };
}

/**
 * Kaynak mesh’i kaydır: sourceCorner world’de targetCorner ile çakışsın.
 * Rotasyon korunur.
 * @returns {{ dx: number, dy: number, dz: number } | null} metre delta
 */
export function snapMeshCornerToCorner(sourceMesh, sourceCornerKey, targetMesh, targetCornerKey) {
  if (!sourceMesh || !targetMesh || sourceMesh === targetMesh) return null;
  const sourceCorner = getCornerDef(sourceCornerKey);
  const targetCorner = getCornerDef(targetCornerKey);
  if (!sourceCorner || !targetCorner) return null;
  const sourceSize = sourceMesh.userData?.partSize;
  const targetSize = targetMesh.userData?.partSize;
  if (!sourceSize || !targetSize) return null;

  const srcLocal = localCornerOffsetMeters(sourceSize, sourceCorner);
  const tgtLocal = localCornerOffsetMeters(targetSize, targetCorner);

  if (typeof sourceMesh.localToWorld === 'function' && typeof targetMesh.localToWorld === 'function') {
    const Vector3 = sourceMesh.position.constructor;
    const from = sourceMesh.localToWorld(new Vector3(srcLocal.x, srcLocal.y, srcLocal.z));
    const to = targetMesh.localToWorld(new Vector3(tgtLocal.x, tgtLocal.y, tgtLocal.z));
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    sourceMesh.position.x += dx;
    sourceMesh.position.y += dy;
    sourceMesh.position.z += dz;
    return { dx, dy, dz };
  }

  // Kimlik world (unit test): world = position + local
  const from = {
    x: Number(sourceMesh.position?.x || 0) + srcLocal.x,
    y: Number(sourceMesh.position?.y || 0) + srcLocal.y,
    z: Number(sourceMesh.position?.z || 0) + srcLocal.z,
  };
  const to = {
    x: Number(targetMesh.position?.x || 0) + tgtLocal.x,
    y: Number(targetMesh.position?.y || 0) + tgtLocal.y,
    z: Number(targetMesh.position?.z || 0) + tgtLocal.z,
  };
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  sourceMesh.position.x = Number(sourceMesh.position?.x || 0) + dx;
  sourceMesh.position.y = Number(sourceMesh.position?.y || 0) + dy;
  sourceMesh.position.z = Number(sourceMesh.position?.z || 0) + dz;
  return { dx, dy, dz };
}
