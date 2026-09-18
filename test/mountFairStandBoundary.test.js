import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mountSource = readFileSync(new URL('../src/mountFairStand.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('Fair Stand exposes a mount/unmount boundary without rewriting the configurator', () => {
  assert.match(mountSource, /export function mountFairStand\(container\)/);
  assert.match(mountSource, /startFairStandConfigurator/);
  assert.match(mountSource, /unmountFairStand/);
  assert.match(mountSource, /setFairStandHostDocument/);
  assert.match(mainSource, /export function startFairStandConfigurator/);
  assert.match(mainSource, /scene3d\?\.dispose\?\.\(\)/);
});
