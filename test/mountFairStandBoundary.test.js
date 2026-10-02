import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mountSource = readFileSync(new URL('../src/mountFairStand.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('Fair Stand exposes a mount/unmount boundary without rewriting the configurator', () => {
  assert.match(mountSource, /export function mountFairStand\(container, options = \{\}\)/);
  assert.match(mountSource, /startFairStandConfigurator/);
  assert.match(mountSource, /unmountFairStand/);
  assert.match(mountSource, /setFairStandHostDocument/);
  assert.match(mountSource, /data-fair-stand-mount/);
  assert.match(mountSource, /#app > \.sidebar-toggle/);
  assert.match(mountSource, /display: inline-flex/);
  assert.match(mountSource, /#app > \.sidebar/);
  assert.match(mountSource, /style\.remove\(\)/);
  assert.match(mountSource, /insertAdjacentHTML\('beforeend', FAIR_STAND_MARKUP\)/);
  assert.doesNotMatch(mountSource, /createElement\(['"]iframe['"]\)/);
  assert.doesNotMatch(mountSource, /contentDocument/);
  assert.match(mainSource, /export function startFairStandConfigurator/);
  assert.match(mainSource, /scene3d\?\.dispose\?\.\(\)/);
});
