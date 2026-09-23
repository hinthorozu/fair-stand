/** Seed/fixture DATA only — not a runtime type map. Stamps family/rule codes + denorm fields. */

const BINDINGS = Object.freeze({
  'led-floodlight': Object.freeze({
    familyCode: 'led-floodlight',
    snapRequires: 'top-rail',
    snapRequiresRuleId: 1,
    snapMountMode: 'face-edge',
  }),
  shelf: Object.freeze({
    familyCode: 'shelf',
    snapRequires: 'shelf-rail',
    snapRequiresRuleId: 2,
    snapMountMode: 'panel-seam',
  }),
  profile: Object.freeze({
    familyCode: 'profile',
    snapProvides: 'top-rail',
    snapProvidesRuleId: 1,
    snapFace: 'top',
    snapEdge: 'top',
    snapMountMode: 'face-edge',
  }),
  panel: Object.freeze({
    familyCode: 'panel',
    snapProvides: 'shelf-rail',
    snapProvidesRuleId: 2,
    snapFace: 'front',
    snapEdge: 'top',
    snapMountMode: 'panel-seam',
  }),
  'separator-panel': Object.freeze({
    familyCode: 'separator-panel',
    snapProvides: 'shelf-rail',
    snapProvidesRuleId: 2,
    snapFace: 'front',
    snapEdge: 'top',
    snapMountMode: 'panel-seam',
  }),
  'flat-panel': Object.freeze({ familyCode: 'flat-panel' }),
});

export function applyItemSnapFields(item) {
  const next = BINDINGS[item.type];
  delete item.snapTargetItemType;
  delete item.snapAnchor;
  delete item.snapRequires;
  delete item.snapProvides;
  delete item.snapFace;
  delete item.snapEdge;
  delete item.snapRequiresRuleId;
  delete item.snapProvidesRuleId;
  delete item.snapMountMode;
  delete item.familyCode;
  delete item.familyId;
  if (!next) return item;
  Object.assign(item, next);
  return item;
}
