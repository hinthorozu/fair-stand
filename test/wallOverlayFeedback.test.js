import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getItem } from '../src/items.js';
import {
  formatPlacementFeedbackMessage,
  formatWallOverlayFeedback,
  resolvePlacementSubjectName,
} from '../src/placementFeedback.js';

test('wall-overlay uyarısı Işıklı Strafor için item adını kullanır, TV yazmaz', () => {
  const foam = getItem('illuminated-foam');
  assert.equal(foam.name, 'Işıklı Strafor / Logo');
  assert.equal(
    formatWallOverlayFeedback('drag-on-stand', foam),
    'Işıklı Strafor / Logo: aktif stand alanında sürükle.',
  );
  assert.equal(
    formatWallOverlayFeedback('drop-on-stand', foam),
    'Işıklı Strafor / Logo: aktif stand alanına bırak.',
  );
  assert.equal(
    formatWallOverlayFeedback('stand-limit', foam),
    'Işıklı Strafor / Logo bu yönde stand sınırına ulaştı.',
  );
  for (const kind of ['drop-on-stand', 'drag-on-stand', 'surface-failed', 'wall-place-failed', 'wall-move-failed', 'stand-limit']) {
    assert.doesNotMatch(formatWallOverlayFeedback(kind, foam), /\bTV\b/);
  }
});

test('wall-overlay uyarısı TV için TV item adını kullanır', () => {
  const tv = getItem('tv_55');
  assert.equal(
    formatWallOverlayFeedback('wall-move-failed', tv),
    `${tv.name} bu duvar konumuna taşınamadı.`,
  );
});

test('ad yoksa genel Modül öznesi kullanılır', () => {
  assert.equal(resolvePlacementSubjectName(null), 'Modül');
  assert.equal(resolvePlacementSubjectName({ name: '  ' }), 'Modül');
  assert.equal(formatWallOverlayFeedback('surface-failed', null), 'Modül bu yüzeye yerleştirilemedi.');
  assert.throws(() => formatWallOverlayFeedback('bilinmeyen', null), TypeError);
});

test('wall-overlay mesajları genel sadeleştirme kalıplarına takılmaz', () => {
  const foam = getItem('illuminated-foam');
  const message = formatWallOverlayFeedback('stand-limit', foam);
  assert.equal(formatPlacementFeedbackMessage(message), message);
});

test('scene3d wall-overlay uyarılarında sabit TV metni kalmaz, serbest yerleşim sebebi taşınır', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /showPlacementFeedback\('TV|const message = '(?:TV|.*TV\'yi)/);
  assert.doesNotMatch(source, /'TV\'yi aktif stand alan/);
  assert.match(source, /return \{ placement: null, message: snapped\.message \?\? null \};/);
  assert.match(source, /free\.message \?\? formatWallOverlayFeedback\('drag-on-stand'/);
  assert.match(source, /free\.message \?\? formatWallOverlayFeedback\('drop-on-stand'/);
});
