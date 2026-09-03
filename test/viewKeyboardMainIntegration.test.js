import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sceneSource = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const helpSource = await readFile(new URL('../src/helpGuide.js', import.meta.url), 'utf8');

test('scene delegates keyboard mapping and reuses existing camera/viewcube APIs', () => {
  assert.match(sceneSource, /resolveViewKeyboardShortcut\(event\)/);
  assert.match(sceneSource, /setCameraMode\(shortcut\.mode\)/);
  assert.match(sceneSource, /viewCube\.setViewDirection\(direction\)/);
  assert.match(sceneSource, /const deltaDeg = 90;/);
});

test('help guide documents view shortcuts and new clockwise rotation binding', () => {
  for (const key of ['P', 'O', 'L', 'R', 'T', 'F', 'H', 'Shift + R']) {
    assert.match(helpSource, new RegExp(`<tr><th>${key.replace(/[+]/g, '\\+')}</th>`));
  }
});
