import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestSaveAsEditableName } from '../src/projectNaming.js';
import { buildSaveAsClone } from '../src/projectSaveAs.js';

test('suggestSaveAsEditableName appends and bumps (n)', () => {
  assert.equal(suggestSaveAsEditableName('Ada'), 'Ada (1)');
  assert.equal(suggestSaveAsEditableName('Ada (1)'), 'Ada (2)');
  assert.equal(suggestSaveAsEditableName(''), 'Adsız Proje (1)');
});

test('buildSaveAsClone remaps project and image asset ids', () => {
  const blob = new Blob(['x'], { type: 'image/png' });
  const { project, assets, idMap } = buildSaveAsClone({
    snapshot: {
      id: 'old-project',
      name: 'Eski',
      stand: { standType: 'island' },
      modules: [
        {
          id: 'mod-1',
          strips: [{ imageAssetId: 'asset-a' }],
          surface: { fabricImageAssetId: 'asset-a' },
        },
      ],
    },
    assets: [{ id: 'asset-a', name: 'a.png', type: 'image/png', blob }],
    newProjectId: 'new-project',
    newName: 'Yeni_(1)-Ada_500_500',
    createAssetIdFn: () => 'asset-b',
    now: 123,
  });

  assert.equal(project.id, 'new-project');
  assert.equal(project.name, 'Yeni_(1)-Ada_500_500');
  assert.equal(project.createdAt, 123);
  assert.notEqual(project.id, 'old-project');
  assert.equal(idMap.get('asset-a'), 'asset-b');
  assert.equal(assets.length, 1);
  assert.equal(assets[0].id, 'asset-b');
  assert.equal(project.modules[0].strips[0].imageAssetId, 'asset-b');
  assert.equal(project.modules[0].surface.fabricImageAssetId, 'asset-b');
  assert.equal(project.modules[0].id, 'mod-1');
});
