import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMERCIAL_ITEMS, getItem } from '../src/items.js';
import { resolveItemBom } from '../src/itemBom.js';
import { MODULE_CATALOG, resolveItemKey } from '../src/catalog.js';
import { createModuleStateFromDescriptor, duplicateModuleState, normalizeModuleItemState } from '../src/designState.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { describeSurfaceSelection } from '../src/selectionFeedback.js';
import { planAutomaticDepot } from '../src/autoDepot.js';

for (const item of Object.values(COMMERCIAL_ITEMS)) {
  test(`${item.itemKey}: canonical properties and instance lifecycle`, () => {
    const catalog = MODULE_CATALOG[item.itemKey];
    assert.equal(catalog.itemKey, item.itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.modelFile, item.modelFile);
    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, item.itemKey);
    assert.equal(state.itemKey, item.itemKey);
    for (const [key, value] of Object.entries(item.dimensions)) {
      assert.equal(catalog[key], value);
      assert.equal(state[key], value);
    }
    state.placement = { xCm: 80, yCm: 90, zCm: 0, rotationZDeg: 90, wallId: 'free' };
    state.widthCm += 1;
    const restored = normalizeModuleItemState(JSON.parse(JSON.stringify(state)));
    assert.deepEqual(restored, state);
    assert.equal(resolveItemKey(restored), item.itemKey);
    const duplicate = duplicateModuleState(restored);
    assert.notEqual(duplicate.id, state.id);
    assert.deepEqual({ ...duplicate, id: state.id }, state);
    assert.equal(item.unit, 'adet');
    assert.equal(resolveModuleContract(item.itemKey).bom.mode, 'self');
    assert.equal(resolveModuleContract(item.itemKey).bom.source, 'src/itemBom.js');
    const bom = resolveItemBom(item.itemKey);
    assert.equal(bom.length, 1);
    assert.equal(bom[0].itemKey, item.itemKey);
    assert.equal(bom[0].quantity, 1);
    assert.equal(bom[0].unit, 'adet');
    const feedback = describeSurfaceSelection([{ userData: { moduleIndex: 0, moduleType: item.type } }], [state]);
    assert.ok(feedback.message.includes(item.name));
    assert.ok(feedback.message.includes(`${state.widthCm} × ${state.depthCm} × ${state.heightCm}`));
    assert.equal(getItem(`DEPOT_${item.itemKey}`), null);
    assert.equal(MODULE_CATALOG[`DEPOT_${item.itemKey}`], undefined);
  });
}

test('automatic depot resolves all four Items through the shared factory', () => {
  const plan = planAutomaticDepot({ standType: 'island', standXCm: 500, standYCm: 500, includeContents: true });
  const states = plan.specs.filter((spec) => Object.values(COMMERCIAL_ITEMS).some((item) => item.type === spec.kind))
    .map((spec) => createModuleStateFromDescriptor({ ...spec, type: spec.kind }, { preservePlacement: true }));
  assert.deepEqual(states.map((state) => state.itemKey).sort(), Object.keys(COMMERCIAL_ITEMS).sort());
  assert.ok(states.every((state) => state.placement));
});

test('trash product properties cannot be overridden by an external descriptor', () => {
  const item = getItem('PLASTIC_TRASH_BIN');
  const state = createModuleStateFromDescriptor({
    ...MODULE_CATALOG.PLASTIC_TRASH_BIN,
    widthCm: 42,
    depthCm: 45,
    heightCm: 70,
    modelFile: 'external.glb',
    modelRotationYDeg: 90,
    visualRotationYDeg: 45,
    preserveModelScale: true,
  });
  assert.deepEqual(
    [state.widthCm, state.depthCm, state.heightCm],
    [item.dimensions.widthCm, item.dimensions.depthCm, item.dimensions.heightCm],
  );
  assert.equal(state.modelFile, item.modelFile);
  assert.equal(state.modelRotationYDeg, item.modelRotationYDeg);
  assert.equal(state.preserveModelScale, item.preserveModelScale);
  assert.equal(item.visualRotationYDeg, -90);
  assert.equal(state.visualRotationYDeg, item.visualRotationYDeg);
  state.visualRotationYDeg = 0;
  assert.equal(state.visualRotationYDeg, 0);
});
