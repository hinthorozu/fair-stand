import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import {
  getModuleBehavior,
  hasExplicitModuleBehavior,
} from '../src/moduleBehavior.js';

test('every catalog module type has an explicit behavior contract', () => {
  const catalogTypes = [...new Set(
    MODULE_CATALOG_KEYS.map((moduleKey) => MODULE_CATALOG[moduleKey]?.type),
  )].filter(Boolean);

  const missingTypes = catalogTypes.filter((type) => !hasExplicitModuleBehavior(type));

  assert.deepEqual(
    missingTypes,
    [],
    `Catalog module types missing explicit behavior: ${missingTypes.join(', ')}`,
  );
});

test('unknown module types remain distinguishable from declared catalog behavior', () => {
  assert.equal(hasExplicitModuleBehavior('__unknown-module-type__'), false);
  assert.deepEqual(getModuleBehavior('__unknown-module-type__'), {
    placement: 'wall',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'segment',
    ghost: {
      kind: 'silhouette',
      renderer: 'module-silhouette',
      opacity: 0.38,
    },
  });
});
