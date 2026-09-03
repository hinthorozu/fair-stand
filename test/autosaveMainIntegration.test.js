import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const mainSource = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

test('main.js delegates autosave lifecycle to autosaveController', () => {
  assert.match(mainSource, /import \{ createAutosaveController \} from '\.\/autosaveController\.js';/);
  assert.equal((mainSource.match(/createAutosaveController\(\{/g) || []).length, 1);
  assert.match(mainSource, /getSignature: getProjectStateSignature/);
  assert.match(mainSource, /persist: persistActiveProject/);
  assert.match(mainSource, /autosaveController\.enableFromCurrentState\(\)/);
  assert.match(mainSource, /autosaveController\.disable\(\)/);
  assert.match(mainSource, /autosaveController\.clearPending\(\)/);
  assert.match(mainSource, /autosaveController\.markSavedState\(\)/);
});

test('legacy autosave globals and duplicate timer loop are absent from main.js', () => {
  for (const token of [
    'autosaveEnabled',
    'autosaveTimer',
    'autosaveObservedSignature',
    'AUTOSAVE_DELAY_MS',
    'AUTOSAVE_WATCH_INTERVAL_MS',
    'clearAutosaveTimer',
    'scheduleAutosave',
    'enableAutosaveFromCurrentState',
    'disableAutosave',
  ]) {
    assert.equal(mainSource.includes(token), false, `${token} should not remain in main.js`);
  }
  assert.equal(mainSource.includes('setInterval(() => {\n  if (!autosave'), false);
});
