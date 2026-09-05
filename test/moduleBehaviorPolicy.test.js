import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  allowsThinWallEndpointContact,
  canModulesOverlapByBehavior,
  countsTowardWallCapacity,
  getModuleBehavior,
  getModuleCollisionStrategy,
  getModuleMagneticSnapStrategy,
  resolveSideInsertRotationDeg,
  supportsWallOverlayMount,
  usesLogicalFixtureEndpoint,
  usesWallBackboneCollisionDepth,
  usesWallInnerFaceBoundary,
} from '../src/moduleBehavior.js';

test('F-011 special placement policies are declared by the canonical behavior contract', () => {
  for (const type of ['mini-fridge', 'kettle', 'coat-rack']) {
    assert.equal(getModuleMagneticSnapStrategy(type), 'none', type);
  }

  assert.equal(usesLogicalFixtureEndpoint('counter'), true);
  assert.equal(usesLogicalFixtureEndpoint('base'), true);
  assert.equal(usesLogicalFixtureEndpoint('flat-panel'), false);

  assert.equal(usesWallBackboneCollisionDepth('base-wall'), true);
  assert.equal(usesWallBackboneCollisionDepth('base'), false);

  assert.equal(allowsThinWallEndpointContact('indoor-plant-1'), true);
  assert.equal(allowsThinWallEndpointContact('mini-fridge'), false);

  assert.equal(usesWallInnerFaceBoundary('sofa-set-classic'), true);
  assert.equal(usesWallInnerFaceBoundary('table-chair-set-eames'), true);
  assert.equal(usesWallInnerFaceBoundary('counter'), false);

  assert.equal(supportsWallOverlayMount('flat-panel'), true);
  assert.equal(supportsWallOverlayMount('base-wall'), true);
  assert.equal(supportsWallOverlayMount('shelf'), true);
  assert.equal(supportsWallOverlayMount('door'), true);
  assert.equal(supportsWallOverlayMount('showcase-2'), true);
  assert.equal(supportsWallOverlayMount('showcase-3'), true);
  assert.equal(supportsWallOverlayMount('separator'), true);
  assert.equal(supportsWallOverlayMount('counter'), false);

  assert.equal(countsTowardWallCapacity('led-floodlight'), false);
  assert.equal(countsTowardWallCapacity('flat-panel'), true);

  assert.equal(resolveSideInsertRotationDeg('bar-stool', 90), 270);
  assert.equal(resolveSideInsertRotationDeg('counter', 90), 90);
});

test('kettle keeps its pre-F-011 declared contract and runtime collision semantics', () => {
  assert.equal(canModulesOverlapByBehavior({ type: 'kettle' }, { type: 'mini-fridge' }), true);
  assert.equal(canModulesOverlapByBehavior({ type: 'mini-fridge' }, { type: 'kettle' }), true);
  assert.equal(canModulesOverlapByBehavior({ type: 'kettle' }, { type: 'counter' }), false);
  assert.equal(getModuleBehavior('kettle').collision, 'none');
  assert.equal(getModuleCollisionStrategy('kettle'), 'footprint');
});

test('placement core selects F-011 policies through moduleBehavior instead of private type registries', () => {
  const source = readFileSync(new URL('../src/modulePlacement.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /DEPOT_FREE_NO_MAGNETIC_SNAP_TYPES/);
  assert.doesNotMatch(source, /moduleType === 'base-wall'/);
  assert.doesNotMatch(source, /module\?\.type === 'base-wall'/);
  assert.doesNotMatch(source, /moduleType === 'sofa-set-classic'/);
  assert.doesNotMatch(source, /moduleType === 'table-chair-set-eames'/);
  assert.doesNotMatch(source, /insertedModule\.type === 'bar-stool'/);
  assert.doesNotMatch(source, /isKettleMiniFridgeStackPair/);

  for (const helper of [
    'getModuleMagneticSnapStrategy',
    'usesLogicalFixtureEndpoint',
    'usesWallBackboneCollisionDepth',
    'allowsThinWallEndpointContact',
    'usesWallInnerFaceBoundary',
    'canModulesOverlapByBehavior',
    'resolveSideInsertRotationDeg',
  ]) {
    assert.match(source, new RegExp(helper), helper);
  }
});
