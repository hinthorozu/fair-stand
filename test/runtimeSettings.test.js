import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';
import {
  formatImageUploadTooLargeMessage,
  getMaxImageUploadBytes,
  getMaxImageUploadMb,
  initializeRuntimeSettings,
  resetRuntimeSettings,
} from '../src/runtimeSettings.js';

test('initializeRuntimeSettings rejects invalid payload and restores canonical catalog', () => {
  try {
    assert.throws(() => initializeRuntimeSettings(null), TypeError);
    assert.throws(() => initializeRuntimeSettings({ maxImageUploadMb: 0 }), TypeError);
    assert.throws(() => initializeRuntimeSettings({ maxImageUploadMb: 5.5 }), TypeError);
    resetRuntimeSettings();
    assert.throws(() => getMaxImageUploadMb(), /not bootstrapped/);
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('canonical catalog settings seed 5 MB', () => {
  assert.equal(getMaxImageUploadMb(), 5);
  assert.equal(getMaxImageUploadBytes(), 5 * 1024 * 1024);
  assert.equal(formatImageUploadTooLargeMessage(), 'Görsel en fazla 5 MB olabilir.');
});

test('message follows bootstrapped MB', () => {
  try {
    initializeRuntimeSettings({ maxImageUploadMb: 8 });
    assert.equal(getMaxImageUploadBytes(), 8 * 1024 * 1024);
    assert.equal(formatImageUploadTooLargeMessage(), 'Görsel en fazla 8 MB olabilir.');
  } finally {
    loadCanonicalItemCatalog();
  }
});
