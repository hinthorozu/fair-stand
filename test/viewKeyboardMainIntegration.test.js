import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sceneSource = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const helpSource = await readFile(new URL('../src/helpGuide.js', import.meta.url), 'utf8');

test('scene delegates keyboard mapping and reuses existing camera/viewcube APIs', () => {
  assert.match(sceneSource, /resolveViewKeyboardShortcut\(event\)/);
  assert.match(sceneSource, /setCameraMode\(shortcut\.mode\)/);
  assert.match(sceneSource, /viewCube\.setViewDirection\(direction\)/);
  assert.match(sceneSource, /shortcut\.direction === 'counterclockwise' \? -90 : 90/);
});

test('Ctrl/Cmd+R suppresses browser reload before rotation handling', () => {
  assert.match(sceneSource, /shortcut\.type === 'rotate' && shortcut\.direction === 'clockwise'[\s\S]*event\.preventDefault\(\)/);
});

test('help guide documents view shortcuts and new clockwise rotation binding', () => {
  for (const key of ['P', 'O', 'L', 'R', 'T', 'F', 'H', 'Ctrl/Cmd + R', 'Shift + R']) {
    assert.match(helpSource, new RegExp(`<tr><th>${key.replace(/[+]/g, '\\+')}</th>`));
  }
});
