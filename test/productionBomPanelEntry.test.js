import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { resolveItemBom } from '../src/itemBom.js';
import { describeSurfaceSelection } from '../src/selectionFeedback.js';

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('production BOM panel loads from main runtime; opens via toolbar toggle not auto', () => {
  assert.match(mainSource, /import \{ createProductionBomPanel \} from '\.\/productionBomPanel\.js'/);
  assert.match(mainSource, /toggle-production-bom/);
  assert.match(mainSource, /productionBomPanel\.open\(\)/);
  assert.doesNotMatch(mainSource, /rebuildSceneFromSetup[\s\S]{0,400}productionBomPanel\.open\(\)/);
  assert.doesNotMatch(mainSource, /rawBomDebug/);
  assert.doesNotMatch(mainSource, /rawBom/);
});

test('wall selection feedback still describes width used by wall BOM recipes', () => {
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
});
