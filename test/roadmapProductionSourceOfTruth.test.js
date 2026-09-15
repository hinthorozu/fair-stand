import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ROADMAPS = [
  new URL('../ROADMAP.md', import.meta.url),
  new URL('../ROADMAP_PHASE_4.md', import.meta.url),
];

const FORBIDDEN_DUPLICATED_DATASET_MARKERS = [
  'Doğrulanmış üretim bilgileri',
  'Doğrulanmış fiziksel standartlar',
  'Doğrulanmış düz duvar reçetesi',
  '346.5 cm',
  '48.5 × 47 × 0.8 cm',
  '2 × 41.5 cm',
  '13 × tekli/düz bağlantı aparatı',
];

const FORBIDDEN_STALE_IDENTITY_MARKERS = [
  'partId kullanan',
  'bağımsız production-part sözlüğü',
];

test('roadmaps point to canonical production/recipe owners instead of copying the dataset', async () => {
  for (const roadmapUrl of ROADMAPS) {
    const source = await readFile(roadmapUrl, 'utf8');

    assert.match(source, /src\/items\.js/);
    assert.match(source, /src\/moduleRecipes\.js/);
    assert.match(source, /Production dataset kuralı/);
    assert.match(source, /itemKey/);

    for (const marker of FORBIDDEN_DUPLICATED_DATASET_MARKERS) {
      assert.equal(
        source.includes(marker),
        false,
        `${roadmapUrl.pathname} duplicates canonical production data via: ${marker}`,
      );
    }

    for (const marker of FORBIDDEN_STALE_IDENTITY_MARKERS) {
      assert.equal(
        source.includes(marker),
        false,
        `${roadmapUrl.pathname} still claims stale partId / production-part identity: ${marker}`,
      );
    }
  }
});
