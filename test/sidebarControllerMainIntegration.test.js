import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('main delegates sidebar collapse behavior to sidebarController', () => {
  assert.match(source, /import \{ createSidebarController \} from '\.\/sidebarController\.js'/);
  assert.match(source, /createSidebarController\(\{[\s\S]*appElement,[\s\S]*toggleButton: sidebarToggleButton,[\s\S]*\}\)\.bind\(\)/);
  assert.doesNotMatch(source, /function setSidebarCollapsed\(/);
  assert.doesNotMatch(source, /sidebarToggleButton\?\.addEventListener\('click'/);
});
