import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';
import {
  applyArchiveButtonVisibility,
  formatImageUploadTooLargeMessage,
  resolveArchiveButtonVisibility,
  getMaxImageUploadBytes,
  getMaxImageUploadMb,
  initializeRuntimeSettings,
  isExportButtonVisible,
  isImportButtonVisible,
  isSaveAsButtonVisible,
  resetRuntimeSettings,
} from '../src/runtimeSettings.js';

function canonicalSettings(overrides = {}) {
  return {
    maxImageUploadMb: 5,
    exportButtonVisible: true,
    importButtonVisible: true,
    saveAsButtonVisible: true,
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
  assert.equal(isSaveAsButtonVisible(), true);
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
  assert.match(html, /id="save-as-project" type="button" hidden/);
  assert.match(markup, /id=\\"export-project\\" type=\\"button\\" hidden/);
  assert.match(markup, /id=\\"import-project\\" type=\\"button\\" hidden/);
  assert.match(markup, /id=\\"save-as-project\\" type=\\"button\\" hidden/);
});

function fakeButton() {
  const attributes = new Map();
  return {
    hidden: true,
    getAttribute(name) {
      return attributes.has(name) ? attributes.get(name) : null;
    },
    hasAttribute(name) {
      return attributes.has(name);
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
  };
}

test('applyArchiveButtonVisibility follows settings without showing then hiding', () => {
  const exportButton = fakeButton();
  const importButton = fakeButton();
  const saveAsButton = fakeButton();
  const documentRef = {
    querySelector(selector) {
      if (selector === '#export-project') return exportButton;
      if (selector === '#import-project') return importButton;
      if (selector === '#save-as-project') return saveAsButton;
      return null;
    },
  };
  try {
    initializeRuntimeSettings(canonicalSettings({
      exportButtonVisible: false,
      importButtonVisible: true,
      saveAsButtonVisible: false,
    }));
    applyArchiveButtonVisibility(documentRef);
    assert.equal(exportButton.hidden, true);
    assert.equal(importButton.hidden, false);
    assert.equal(saveAsButton.hidden, true);
    assert.equal(exportButton.getAttribute('aria-hidden'), 'true');
    assert.equal(importButton.hasAttribute('aria-hidden'), false);
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('configurator applies archive visibility with capabilities and does not let permission reveal those buttons', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const start = main.indexOf('function applyProjectCapabilityVisibility');
  assert.ok(start >= 0);
  const body = main.slice(start, main.indexOf('\n}', start));
  assert.match(body, /hide\(saveProjectButton/);
  assert.match(body, /hide\(deleteProjectButton/);
  assert.match(body, /applyArchiveButtonVisibility\(document, capabilities\)/);
  assert.doesNotMatch(body, /hide\(exportProjectButton/);
  assert.doesNotMatch(body, /hide\(importProjectButton/);
  assert.doesNotMatch(body, /hide\(saveAsProjectButton/);
});

test('a denied permission stays hidden even when the archive setting is on', () => {
  const visible = {
    exportButtonVisible: true,
    importButtonVisible: true,
    saveAsButtonVisible: true,
  };
  try {
    initializeRuntimeSettings(canonicalSettings(visible));
    const resolved = resolveArchiveButtonVisibility({ canCreate: false, canExecute: false });
    assert.deepEqual(resolved, { export: false, import: false, saveAs: false });
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('an archive setting hides a button the permission would allow', () => {
  try {
    initializeRuntimeSettings(canonicalSettings({
      exportButtonVisible: false,
      importButtonVisible: false,
      saveAsButtonVisible: true,
    }));
    const resolved = resolveArchiveButtonVisibility({ canCreate: true, canExecute: true });
    assert.equal(resolved.export, false);
    assert.equal(resolved.import, false);
    assert.equal(resolved.saveAs, true);
  } finally {
    loadCanonicalItemCatalog();
  }
});
