import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const GLB_URL = new URL('../public/models/plastic_trash_bin.glb', import.meta.url);

function multiply4(a, b) {
  const out = new Array(16).fill(0);
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      for (let k = 0; k < 4; k += 1) out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
    }
  }
  return out;
}

function trsMatrix(node) {
  if (Array.isArray(node.matrix) && node.matrix.length === 16) return node.matrix.map(Number);
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

function parseGlbJson(buffer) {
  assert.equal(buffer.toString('utf8', 0, 4), 'glTF');
  assert.equal(buffer.readUInt32LE(4), 2);
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const length = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    offset += 8;
    if (type === 0x4E4F534A) {
      return JSON.parse(buffer.toString('utf8', offset, offset + length).replace(/\u0000+$/g, '').trim());
    }
    offset += length;
  }
  throw new Error('GLB JSON chunk missing');
}

function sceneBounds(gltf) {
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const scene = gltf.scenes?.[gltf.scene ?? 0];
  assert.ok(scene, 'Default GLB scene missing');

  const includeAccessor = (accessorIndex, matrix) => {
    const accessor = gltf.accessors?.[accessorIndex];
    if (!accessor?.min || !accessor?.max) return;
    const [xmin, ymin, zmin] = accessor.min.map(Number);
    const [xmax, ymax, zmax] = accessor.max.map(Number);
    for (const x of [xmin, xmax]) for (const y of [ymin, ymax]) for (const z of [zmin, zmax]) {
      const p = transformPoint(matrix, [x, y, z]);
      for (let i = 0; i < 3; i += 1) {
        min[i] = Math.min(min[i], p[i]);
        max[i] = Math.max(max[i], p[i]);
      }
    }
  };

  const visit = (nodeIndex, parentMatrix) => {
    const node = gltf.nodes?.[nodeIndex] ?? {};
    const world = multiply4(parentMatrix, trsMatrix(node));
    if (Number.isInteger(node.mesh)) {
      for (const primitive of gltf.meshes?.[node.mesh]?.primitives ?? []) {
        if (Number.isInteger(primitive.attributes?.POSITION)) includeAccessor(primitive.attributes.POSITION, world);
      }
    }
    for (const child of node.children ?? []) visit(child, world);
  };

  for (const nodeIndex of scene.nodes ?? []) visit(nodeIndex, identity);
  assert.ok(min.every(Number.isFinite) && max.every(Number.isFinite), 'Could not derive GLB scene bounds');
  return { min, max, size: max.map((value, i) => value - min[i]) };
}

test('plastic trash bin GLB exposes measurable real scene bounds', () => {
  const buffer = readFileSync(GLB_URL);
  const gltf = parseGlbJson(buffer);
  const bounds = sceneBounds(gltf);
  const cm = bounds.size.map((meters) => meters * 100);
  console.log(`PLASTIC_TRASH_BIN_BOUNDS_M=${bounds.size.map((v) => v.toFixed(6)).join('x')}`);
  console.log(`PLASTIC_TRASH_BIN_BOUNDS_CM=${cm.map((v) => v.toFixed(3)).join('x')}`);
  assert.ok(bounds.size.every((value) => Number.isFinite(value) && value > 0));
});
