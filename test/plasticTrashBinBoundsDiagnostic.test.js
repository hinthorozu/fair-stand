import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const GLB_PATH = new URL('../public/models/plastic_trash_bin.glb', import.meta.url);

function parseGlb(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'glTF');
  assert.equal(buffer.readUInt32LE(4), 2);
  const totalLength = buffer.readUInt32LE(8);
  assert.equal(totalLength, buffer.length);

  let offset = 12;
  let json = null;
  let bin = null;
  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    const chunk = buffer.subarray(offset + 8, offset + 8 + chunkLength);
    if (chunkType === 0x4E4F534A) json = JSON.parse(chunk.toString('utf8').replace(/\u0000+$/g, ''));
    if (chunkType === 0x004E4942) bin = chunk;
    offset += 8 + chunkLength;
  }
  assert.ok(json, 'GLB JSON chunk missing');
  assert.ok(bin, 'GLB BIN chunk missing');
  return { json, bin };
}

function identity() {
  return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function trsMatrix(node) {
  if (Array.isArray(node.matrix) && node.matrix.length === 16) return [...node.matrix];
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [qx, qy, qz, qw] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];

  const x2 = qx + qx; const y2 = qy + qy; const z2 = qz + qz;
  const xx = qx * x2; const xy = qx * y2; const xz = qx * z2;
  const yy = qy * y2; const yz = qy * z2; const zz = qz * z2;
  const wx = qw * x2; const wy = qw * y2; const wz = qw * z2;

  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    tx, ty, tz, 1,
  ];
}

function transformPoint(m, [x, y, z]) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

function accessorBounds(gltf, bin, accessorIndex) {
  const accessor = gltf.accessors?.[accessorIndex];
  assert.ok(accessor, `Missing accessor ${accessorIndex}`);
  if (Array.isArray(accessor.min) && Array.isArray(accessor.max)) {
    return { min: accessor.min.slice(0, 3), max: accessor.max.slice(0, 3) };
  }

  assert.equal(accessor.componentType, 5126, 'POSITION accessor without min/max must be FLOAT');
  assert.equal(accessor.type, 'VEC3');
  const view = gltf.bufferViews?.[accessor.bufferView];
  assert.ok(view, 'POSITION bufferView missing');
  const stride = view.byteStride ?? 12;
  const start = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < accessor.count; i += 1) {
    const base = start + i * stride;
    for (let axis = 0; axis < 3; axis += 1) {
      const value = bin.readFloatLE(base + axis * 4);
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }
  return { min, max };
}

function expandBounds(target, bounds, matrix) {
  const [minX, minY, minZ] = bounds.min;
  const [maxX, maxY, maxZ] = bounds.max;
  for (const x of [minX, maxX]) {
    for (const y of [minY, maxY]) {
      for (const z of [minZ, maxZ]) {
        const point = transformPoint(matrix, [x, y, z]);
        for (let axis = 0; axis < 3; axis += 1) {
          target.min[axis] = Math.min(target.min[axis], point[axis]);
          target.max[axis] = Math.max(target.max[axis], point[axis]);
        }
      }
    }
  }
}

function measureScene(gltf, bin) {
  const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  const scene = gltf.scenes?.[gltf.scene ?? 0];
  assert.ok(scene, 'Default scene missing');

  function visit(nodeIndex, parentMatrix) {
    const node = gltf.nodes?.[nodeIndex];
    assert.ok(node, `Missing node ${nodeIndex}`);
    const world = multiply(parentMatrix, trsMatrix(node));
    if (Number.isInteger(node.mesh)) {
      const mesh = gltf.meshes?.[node.mesh];
      assert.ok(mesh, `Missing mesh ${node.mesh}`);
      for (const primitive of mesh.primitives ?? []) {
        const positionAccessor = primitive.attributes?.POSITION;
        if (!Number.isInteger(positionAccessor)) continue;
        expandBounds(bounds, accessorBounds(gltf, bin, positionAccessor), world);
      }
    }
    for (const child of node.children ?? []) visit(child, world);
  }

  for (const nodeIndex of scene.nodes ?? []) visit(nodeIndex, identity());
  return {
    min: bounds.min,
    max: bounds.max,
    size: bounds.max.map((value, axis) => value - bounds.min[axis]),
  };
}

test('diagnostic: plastic trash bin GLB reports transformed scene bounds', () => {
  const { json, bin } = parseGlb(readFileSync(GLB_PATH));
  const bounds = measureScene(json, bin);
  bounds.size.forEach((value) => assert.ok(Number.isFinite(value) && value > 0));

  const rounded = bounds.size.map((value) => Number(value.toFixed(6)));
  console.log(`PLASTIC_TRASH_BIN_BOUNDS_METERS x=${rounded[0]} y=${rounded[1]} z=${rounded[2]}`);
  console.log(`PLASTIC_TRASH_BIN_BOUNDS_CM x=${Number((rounded[0] * 100).toFixed(3))} y=${Number((rounded[1] * 100).toFixed(3))} z=${Number((rounded[2] * 100).toFixed(3))}`);
});
