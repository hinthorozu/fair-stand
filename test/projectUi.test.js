import test from 'node:test';
import assert from 'node:assert/strict';

import { createProjectLoadingController, setButtonBusy, setSaveProjectEnabled } from '../src/projectUi.js';

function createFakeButton(label = 'Kaydet') {
  const attrs = new Map();
  return {
    textContent: label,
    disabled: false,
    dataset: {},
    setAttribute(name, value) { attrs.set(name, value); },
    removeAttribute(name) { attrs.delete(name); },
    getAttribute(name) { return attrs.get(name); },
  };
}

test('setButtonBusy preserves the original label and aria busy contract', () => {
  const button = createFakeButton('Kaydet');
  setButtonBusy(button, true, 'Kaydediliyor');
  assert.equal(button.disabled, true);
  assert.equal(button.textContent, 'Kaydediliyor');
  assert.equal(button.dataset.idleLabel, 'Kaydet');
  assert.equal(button.getAttribute('aria-busy'), 'true');

  setButtonBusy(button, false);
  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'Kaydet');
  assert.equal(button.getAttribute('aria-busy'), undefined);
});

test('save stays disabled until a scene exists', () => {
  const button = createFakeButton('Kaydet');
  setSaveProjectEnabled(button, false);
  assert.equal(button.disabled, true);
  setSaveProjectEnabled(button, true);
  assert.equal(button.disabled, false);
  setButtonBusy(button, true, 'Kaydediliyor');
  assert.equal(button.disabled, true);
  setButtonBusy(button, false);
  setSaveProjectEnabled(button, false);
  assert.equal(button.disabled, true);
  assert.equal(button.textContent, 'Kaydet');
});

test('repeated busy calls do not overwrite the stored idle label', () => {
  const button = createFakeButton('Aç');
  setButtonBusy(button, true, 'Açılıyor');
  setButtonBusy(button, true, 'Bekleyin');
  assert.equal(button.dataset.idleLabel, 'Aç');
  setButtonBusy(button, false);
  assert.equal(button.textContent, 'Aç');
});

test('loading controller preserves show/hide text and hidden-state behavior', () => {
  const overlay = { hidden: true };
  const titleElement = { textContent: '' };
  const detailElement = { textContent: '' };
  const controller = createProjectLoadingController({ overlay, titleElement, detailElement });

  controller.show('Proje yükleniyor…');
  assert.equal(overlay.hidden, false);
  assert.equal(titleElement.textContent, 'Proje yükleniyor…');
  assert.equal(detailElement.textContent, 'Lütfen bekleyin…');

  controller.show('İçe aktarılıyor…', 'ZIP hazırlanıyor.');
  assert.equal(detailElement.textContent, 'ZIP hazırlanıyor.');
  controller.hide();
  assert.equal(overlay.hidden, true);
});
