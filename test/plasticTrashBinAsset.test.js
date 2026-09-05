import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ASSET_PATH = new URL('../public/models/plastic_trash_bin.glb', import.meta.url);

test('plastic trash bin GLB asset exists and has a valid GLB header', async () => {
  const buffer = await readFile(ASSET_PATH);
  assert.ok(buffer.length >= 12, 'GLB asset must contain the 12-byte header');
  assert.equal(buffer.subarray(0, 4).toString('utf8'), 'glTF');
  assert.equal(buffer.readUInt32LE(4), 2, 'GLB asset must use glTF binary version 2');
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'GLB header length must match file size');
});
