import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { resolveItemBom } from '../src/itemBom.js';
import { describeSurfaceSelection } from '../src/selectionFeedback.js';

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const rawBomSource = readFileSync(new URL('../src/rawBomDebug.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('BOM debug panel loads only through DEV + ?rawBom real entry', () => {
  assert.match(
    mainSource,
    /if \(import\.meta\.env\.DEV && new URLSearchParams\(window\.location\.search\)\.has\('rawBom'\)\) \{\s*import\('\.\/rawBomDebug\.js'\);\s*\}/,
  );
  assert.doesNotMatch(mainSource, /import '\.\/rawBomDebug\.js'/);
});

test('DEV debug selection path resolves the same wall BOM lines as resolveItemBom', () => {
  const message = describeSurfaceSelection([{
    userData: {
      moduleIndex: 0,
      widthCm: 100,
      stripNumber: 1,
      moduleType: 'flat-panel',
    },
  }]).message;

  assert.match(message, /·\s*100\s*cm\s*·/i);
  assert.doesNotMatch(message, /Banko|Baza|Kapı|Vitrin|Separatör/);

  const lines = resolveItemBom('wall_100_350');
  assert.ok(lines.length > 0);
  for (const line of lines) {
    assert.ok(line.itemKey);
    assert.ok(Number.isFinite(line.quantity) && line.quantity > 0);
    assert.equal(line.unit, 'adet');
  }

  assert.match(rawBomSource, /WALL_ITEM_KEYS\[widthCm\]/);
  assert.match(rawBomSource, /renderItemBom/);
  assert.match(rawBomSource, /resolveItemBom/);
});
