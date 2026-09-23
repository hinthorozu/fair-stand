/** Seed/fixture DATA only — not a runtime type map. Stamps requires on consumers; provides via rule.itemTypeKeys. */

export const SNAP_RULE_FIXTURE = Object.freeze([
  Object.freeze({
    id: 1,
    key: 'top-rail',
    displayName: 'Üst ray',
    face: 'top',
    edge: 'top',
    itemTypeKeys: Object.freeze(['profile']),
    isActive: true,
  }),
  Object.freeze({
    id: 2,
    key: 'shelf-rail',
    displayName: 'Raf rayı',
    face: 'front',
    edge: 'top',
    itemTypeKeys: Object.freeze(['panel', 'separator-panel']),
    isActive: true,
  }),
]);

/** Only consumers need per-item requires. Hosts come from rule ↔ item_type. */
const BINDINGS = Object.freeze({
  'led-floodlight': Object.freeze({
    snapRequires: 'top-rail',
    snapRequiresRuleId: 1,
  }),
  shelf: Object.freeze({
    snapRequires: 'shelf-rail',
    snapRequiresRuleId: 2,
  }),
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
