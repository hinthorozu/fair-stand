import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_STATE_TYPES } from '../src/designState.js';
import {
  isAllowedImportImageType,
  isAllowedImportZipFile,
  isSafeArchivePath,
  validateImportedAssetRecord,
  validateImportedProjectState,
  validateProjectArchiveManifest,
} from '../src/projectImportValidation.js';

test('MODULE_STATE_TYPES factory anahtarlarını kilitler', () => {
  assert.ok(MODULE_STATE_TYPES.includes('flat-panel'));
  assert.ok(MODULE_STATE_TYPES.includes('tv'));
  assert.ok(MODULE_STATE_TYPES.includes('illuminated-foam'));
});

test('zip yolu .. ve mutlak yolu reddeder', () => {
  assert.equal(isSafeArchivePath('assets/a.png'), true);
  assert.equal(isSafeArchivePath('../secret'), false);
  assert.equal(isSafeArchivePath('/tmp/x'), false);
  assert.equal(isSafeArchivePath('assets/../project.json'), false);
});

test('görsel tipi image/* olmalı; ZIP adı veya zip MIME', () => {
  assert.equal(isAllowedImportImageType('image/png'), true);
  assert.equal(isAllowedImportImageType('application/pdf'), false);
  assert.equal(isAllowedImportZipFile({ name: 'a.zip', type: '' }), true);
  assert.equal(isAllowedImportZipFile({ name: 'a.txt', type: 'text/plain' }), false);
});

test('import proje stand ve modül tipi doğrular', () => {
  const ok = validateImportedProjectState({
    id: 'p1',
    version: 1,
    stand: { standType: 'island', xCm: 500, yCm: 500, itemKey: 'karolaj' },
    modules: [{ id: 'm1', type: 'flat-panel' }],
  });
  assert.equal(ok.ok, true);

  const badType = validateImportedProjectState({
    id: 'p1',
    modules: [{ id: 'm1', type: 'not-a-module' }],
  });
  assert.equal(badType.ok, false);

  const badStand = validateImportedProjectState({
    id: 'p1',
    modules: [],
    stand: { standType: 'island', xCm: 10, yCm: 10 },
  });
  assert.equal(badStand.ok, false);
});

test('manifest archiveVersion 1 ve asset yolu assets/ altında', () => {
  const ok = validateProjectArchiveManifest({
    archiveVersion: 1,
    project: { id: 'p1', modules: [] },
    assets: [{ id: 'a1', path: 'assets/a1.png', type: 'image/png' }],
  });
  assert.equal(ok.ok, true);

  const badPath = validateImportedAssetRecord({
    id: 'a1',
    path: '../../etc/passwd',
    type: 'image/png',
  });
  assert.equal(badPath.ok, false);
});
