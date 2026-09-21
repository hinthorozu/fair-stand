import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';
import {
  applyArchiveButtonVisibility,
  formatImageUploadTooLargeMessage,
  getMaxImageUploadBytes,
  getMaxImageUploadMb,
  initializeRuntimeSettings,
  isExportButtonVisible,
  isImportButtonVisible,
  resetRuntimeSettings,
} from '../src/runtimeSettings.js';

function canonicalSettings(overrides = {}) {
  return {
    maxImageUploadMb: 5,
    exportButtonVisible: true,
    importButtonVisible: true,
    ...overrides,
  };
}

test('initializeRuntimeSettings rejects invalid payload and restores canonical catalog', () => {
  try {
    assert.throws(() => initializeRuntimeSettings(null), TypeError);
    assert.throws(() => initializeRuntimeSettings({ maxImageUploadMb: 0 }), TypeError);
    assert.throws(() => initializeRuntimeSettings({ maxImageUploadMb: 5.5 }), TypeError);
    assert.throws(
      () => initializeRuntimeSettings({ maxImageUploadMb: 5 }),
      /exportButtonVisible/,
    );
    resetRuntimeSettings();
    assert.throws(() => getMaxImageUploadMb(), /not bootstrapped/);
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('canonical catalog settings seed 5 MB and archive buttons visible', () => {
  assert.equal(getMaxImageUploadMb(), 5);
  assert.equal(getMaxImageUploadBytes(), 5 * 1024 * 1024);
  assert.equal(formatImageUploadTooLargeMessage(), 'Görsel en fazla 5 MB olabilir.');
  assert.equal(isExportButtonVisible(), true);
  assert.equal(isImportButtonVisible(), true);
});

test('message follows bootstrapped MB', () => {
  try {
    initializeRuntimeSettings(canonicalSettings({ maxImageUploadMb: 8 }));
    assert.equal(getMaxImageUploadBytes(), 8 * 1024 * 1024);
    assert.equal(formatImageUploadTooLargeMessage(), 'Görsel en fazla 8 MB olabilir.');
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('archive buttons start hidden in markup', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const markup = readFileSync(new URL('../src/configuratorMarkup.js', import.meta.url), 'utf8');
  assert.match(html, /id="export-project" type="button" hidden/);
  assert.match(html, /id="import-project" type="button" hidden/);
  assert.match(markup, /id=\\"export-project\\" type=\\"button\\" hidden/);
  assert.match(markup, /id=\\"import-project\\" type=\\"button\\" hidden/);
});

test('applyArchiveButtonVisibility follows settings without showing then hiding', () => {
  const exportButton = { hidden: true };
  const importButton = { hidden: true };
  const documentRef = {
    querySelector(selector) {
      if (selector === '#export-project') return exportButton;
      if (selector === '#import-project') return importButton;
      return null;
    },
  };
  try {
    initializeRuntimeSettings(canonicalSettings({
      exportButtonVisible: false,
      importButtonVisible: true,
    }));
    applyArchiveButtonVisibility(documentRef);
    assert.equal(exportButton.hidden, true);
    assert.equal(importButton.hidden, false);
  } finally {
    loadCanonicalItemCatalog();
  }
});
