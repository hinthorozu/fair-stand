import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  MODULE_CATALOG,
  MODULE_CATALOG_GROUPS,
  resolveModuleCatalogKey,
} from '../src/catalog.js';
import { createModuleStateFromDescriptor } from '../src/designState.js';
import {
  allowsThinWallEndpointContact,
  canModulesOverlapByBehavior,
  getModuleBehavior,
} from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { AUTO_DEPOT_SIZES, planAutomaticDepot } from '../src/autoDepot.js';

const KEY = 'DEPOT_PLASTIC_TRASH_BIN';
const MODEL_FILE = 'plastic_trash_bin.glb';

function footprint(spec) {
  const xMin = Number(spec.placement.xCm);
  const xMax = xMin + Number(spec.widthCm);
  const yCenter = Number(spec.placement.yCm);
  const halfDepth = Number(spec.depthCm) / 2;
  return {
    xMin,
    xMax,
    yMin: yCenter - halfDepth,
    yMax: yCenter + halfDepth,
  };
}

function overlaps(a, b) {
  return a.xMin < b.xMax
    && a.xMax > b.xMin
    && a.yMin < b.yMax
    && a.yMax > b.yMin;
}

test('plastic trash bin is a canonical 40x40x60 fixed-model catalog module', () => {
  const descriptor = MODULE_CATALOG[KEY];
  assert.ok(descriptor);
  assert.equal(descriptor.label, 'Çöp Kutusu');
  assert.deepEqual(
    [descriptor.widthCm, descriptor.depthCm, descriptor.heightCm],
    [40, 40, 60],
  );
  assert.equal(descriptor.modelFile, MODEL_FILE);
  assert.equal(descriptor.preserveModelScale, false);
  assert.equal(existsSync(new URL(`../public/models/${MODEL_FILE}`, import.meta.url)), true);

  const extraGroup = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Extra');
  assert.ok(extraGroup?.keys.includes(KEY));
  assert.equal(
    MODULE_CATALOG_GROUPS.flatMap((group) => group.keys).filter((key) => key === KEY).length,
    1,
  );

  assert.equal(resolveModuleCatalogKey({
    type: descriptor.type,
    widthCm: 40,
    depthCm: 40,
    modelFile: MODEL_FILE,
  }), KEY);
});

test('trash bin state and behavior preserve fridge-style movement without overlap exceptions', () => {
  const descriptor = MODULE_CATALOG[KEY];
  const state = createModuleStateFromDescriptor(descriptor, { catalogKey: KEY });
  assert.ok(state);
  assert.equal(state.catalogKey, KEY);
  assert.equal(state.type, 'indoor-plant-1');
  assert.deepEqual([state.widthCm, state.depthCm, state.heightCm], [40, 40, 60]);
  assert.equal(state.modelFile, MODEL_FILE);
  assert.equal(state.preserveModelScale, false);

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.moveSnapCm, 10);
  assert.equal(behavior.rotationStepDeg, 90);
  assert.equal(behavior.defaultRotationDeg, 0);
  assert.equal(behavior.collision, 'footprint');
  assert.equal(behavior.magneticSnap, 'none');
  assert.deepEqual(behavior.overlapWithTypes, []);
  assert.equal(allowsThinWallEndpointContact(state), false);

  assert.equal(canModulesOverlapByBehavior(state, { type: 'mini-fridge' }), false);
  assert.equal(canModulesOverlapByBehavior(state, { type: 'kettle' }), false);
  assert.equal(canModulesOverlapByBehavior(state, { type: 'coat-rack' }), false);
});

test('trash bin has an explicit fixed-model contract and remains in F-014 BOM decision scope', () => {
  const contract = resolveModuleContract(KEY);
  assert.ok(contract);
  assert.equal(contract.catalogKey, KEY);
  assert.equal(contract.profile, 'free-model-fixed');
  assert.equal(contract.appearance.color, 'fixed');
  assert.equal(contract.renderer.mode, 'model');
  assert.equal(contract.behavior.moveSnapCm, 10);
  assert.equal(contract.behavior.magneticSnap, 'none');
  assert.equal(contract.bom.mode, 'decision-required');
});

test('automatic depot adds the trash bin inside every supported depot without floor-fixture overlap', () => {
  for (const [sizeKey, size] of Object.entries(AUTO_DEPOT_SIZES)) {
    const plan = planAutomaticDepot({
      standType: 'island',
      standXCm: 500,
      standYCm: 500,
      sizeKey,
      includeContents: true,
    });
    assert.equal(plan.ok, true, sizeKey);

    const trash = plan.specs.find((spec) => spec.catalogKey === KEY);
    const fridge = plan.specs.find((spec) => spec.kind === 'mini-fridge');
    const rack = plan.specs.find((spec) => spec.kind === 'coat-rack');
    assert.ok(trash, `${sizeKey}: trash bin missing`);
    assert.ok(fridge, `${sizeKey}: fridge missing`);
    assert.ok(rack, `${sizeKey}: rack missing`);
    assert.equal(trash.kind, 'indoor-plant-1');
    assert.equal(trash.modelFile, MODEL_FILE);
    assert.deepEqual([trash.widthCm, trash.depthCm, trash.heightCm], [40, 40, 60]);

    const trashBox = footprint(trash);
    const fridgeBox = footprint(fridge);
    const rackBox = footprint(rack);
    const depot = {
      xMin: plan.originXCm,
      xMax: plan.originXCm + Number(size.widthCm),
      yMin: plan.originYCm,
      yMax: plan.originYCm + Number(size.depthCm),
    };

    assert.ok(trashBox.xMin >= depot.xMin && trashBox.xMax <= depot.xMax, `${sizeKey}: trash x bounds`);
    assert.ok(trashBox.yMin >= depot.yMin && trashBox.yMax <= depot.yMax, `${sizeKey}: trash y bounds`);
    assert.equal(overlaps(trashBox, fridgeBox), false, `${sizeKey}: trash/fridge overlap`);
    assert.equal(overlaps(trashBox, rackBox), false, `${sizeKey}: trash/rack overlap`);
    assert.equal(overlaps(fridgeBox, rackBox), false, `${sizeKey}: fridge/rack overlap`);
  }
});
