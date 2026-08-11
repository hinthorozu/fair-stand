import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPlacementFeedbackMessage, hasPlacementFeedbackPointer } from '../src/placementFeedback.js';

test('simplifies collision feedback', () => {
  assert.equal(
    formatPlacementFeedbackMessage('Başka bir modülle çakışıyor.'),
    'Başka modülle çakışıyor.',
  );
});

test('simplifies stand boundary feedback', () => {
  assert.equal(
    formatPlacementFeedbackMessage('Modül X stand sınırını aşıyor.'),
    'Stand sınırı dışında.',
  );
  assert.equal(
    formatPlacementFeedbackMessage('Modül aktif stand alanını aşıyor.'),
    'Stand sınırı dışında.',
  );
});

test('simplifies continuous wall capacity feedback', () => {
  assert.equal(
    formatPlacementFeedbackMessage('Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.'),
    'Yeterli boşluk yok.',
  );
});


test('treats null coordinates as no pointer', () => {
  assert.equal(hasPlacementFeedbackPointer(null, null), false);
  assert.equal(hasPlacementFeedbackPointer(undefined, undefined), false);
  assert.equal(hasPlacementFeedbackPointer(null, 120), false);
});

test('accepts real pointer coordinates including zero', () => {
  assert.equal(hasPlacementFeedbackPointer(0, 0), true);
  assert.equal(hasPlacementFeedbackPointer(320, 180), true);
});
