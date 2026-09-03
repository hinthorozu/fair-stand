import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const HISTORICAL_DOCS = [
  {
    path: '../FRESH_REPOSITORY_REVIEW.md',
    marker: 'HISTORICAL SNAPSHOT — CURRENT SOURCE OF TRUTH DEĞİLDİR.',
  },
  {
    path: '../REPOSITORY_CLEANUP_PROGRESS.md',
    marker: 'HISTORICAL PROGRESS SNAPSHOT — AKTİF İŞ TAKİP DOSYASI DEĞİLDİR.',
  },
];

test('superseded review/progress documents are visibly historical and redirect to current trackers', async () => {
  for (const doc of HISTORICAL_DOCS) {
    const source = await readFile(new URL(doc.path, import.meta.url), 'utf8');

    assert.match(source.slice(0, 1200), new RegExp(doc.marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(source.slice(0, 1600), /audit\/FULL_SWEEP_STATE\.md/);
    assert.match(source.slice(0, 1600), /audit\/FINDINGS\.md/);
  }
});
