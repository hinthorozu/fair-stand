const SNAP_BY_TYPE = Object.freeze({
  'led-floodlight': Object.freeze({ snapTargetItemType: 'profile', snapAnchor: 'top' }),
  shelf: Object.freeze({ snapTargetItemType: 'panel', snapAnchor: 'top' }),
});

export function applyItemSnapFields(item) {
  const spec = SNAP_BY_TYPE[item.type];
  if (spec) Object.assign(item, spec);
  else {
    delete item.snapTargetItemType;
    delete item.snapAnchor;
  }
  return item;
}
