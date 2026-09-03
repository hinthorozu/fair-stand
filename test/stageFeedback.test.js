import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCapacityPopup,
  renderStageResult,
  renderWallResult,
} from '../src/stageFeedback.js';

function createElement() {
  const classes = new Set();
  return {
    textContent: '',
    classList: {
      toggle(name, force) {
        if (force) classes.add(name);
        else classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      },
    },
  };
}

test('renderStageResult preserves text and error class behavior', () => {
  const element = createElement();
  renderStageResult(element, 'Hazır');
  assert.equal(element.textContent, 'Hazır');
  assert.equal(element.classList.contains('error'), false);

  renderStageResult(element, 'Hata', true);
  assert.equal(element.textContent, 'Hata');
  assert.equal(element.classList.contains('error'), true);
});

test('renderWallResult only warns for error messages', () => {
  const calls = [];
  renderWallResult('Bilgi', false, (message) => calls.push(message));
  renderWallResult('Sorun', true, (message) => calls.push(message));
  assert.deepEqual(calls, ['Sorun']);
});

test('formatCapacityPopup preserves the current Turkish capacity details', () => {
  assert.equal(
    formatCapacityPopup({
      axis: 'x',
      limitCm: 300,
      currentCm: 200,
      addedCm: 150,
      projectedCm: 350,
    }, 'Modül eklenemedi'),
    'Modül eklenemedi\n\nX stand sınırı: 300 cm\nMevcut toplam: 200 cm\nEklenmek istenen: 150 cm\nOluşacak toplam: 350 cm\n\nAktif stand alanı aşılamaz.',
  );
});
