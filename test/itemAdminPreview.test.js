import test from 'node:test';
import assert from 'node:assert/strict';

import { envelopeFromForm, partFromChildRecord } from '../src/itemAdminPreview.js';

test('envelopeFromForm uses dimensions only (ignores scene override args if passed)', () => {
  const envelope = envelopeFromForm({
    widthCm: 100,
    depthCm: 10,
    heightCm: 50,
    sceneWidthCm: 200,
    sceneDepthCm: 8,
    sceneHeightCm: 350,
    defaultColor: 0xff0000,
  });
  assert.deepEqual(envelope, {
    widthCm: 100,
    depthCm: 10,
    heightCm: 50,
    colorCss: '#ff0000',
  });
});

test('envelopeFromForm returns null when dimensions incomplete', () => {
  assert.equal(
    envelopeFromForm({ widthCm: 100, depthCm: '', heightCm: 50, defaultColor: 1 }),
    null,
  );
});

test('partFromChildRecord ignores child sceneDimensions', () => {
  const part = partFromChildRecord(
    {
      itemKey: 'panel_100',
      defaultColor: 0x00ff00,
      dimensions: { widthCm: 100, depthCm: 10, heightCm: 50 },
      sceneDimensions: { widthCm: 200, depthCm: 8, heightCm: 350 },
    },
    0,
  );
  assert.equal(part.widthCm, 100);
  assert.equal(part.depthCm, 10);
  assert.equal(part.heightCm, 50);
  assert.equal(part.colorCss, '#00ff00');
});
