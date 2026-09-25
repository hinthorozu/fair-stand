/**
 * Item assembly layout — BOM (composition.items) ayrı kalır; pose burada.
 * Parent lokal cm: X genişlik, Y derinlik, Z yerden yükseklik (SCENE_POSE).
 */

export function colorIntToCss(value) {
  if (value == null || value === '') return '#9ca3af';
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) return '#9ca3af';
  return `#${number.toString(16).padStart(6, '0')}`;
}

export function readItemBoxCm(item) {
  const scene = item?.sceneDimensions && typeof item.sceneDimensions === 'object'
    ? item.sceneDimensions
    : null;
  const dims = item?.dimensions && typeof item.dimensions === 'object' ? item.dimensions : null;
  const widthCm = Number(scene?.widthCm ?? dims?.widthCm);
  const depthCm = Number(scene?.depthCm ?? dims?.depthCm);
  const heightCm = Number(scene?.heightCm ?? dims?.heightCm);
  return {
    widthCm: Number.isFinite(widthCm) && widthCm > 0 ? widthCm : 10,
    depthCm: Number.isFinite(depthCm) && depthCm > 0 ? depthCm : 10,
    heightCm: Number.isFinite(heightCm) && heightCm > 0 ? heightCm : 10,
  };
}

/** Recipe BOM → isRender child instance listesi (pose yok). */
export function expandBomRenderInstances(parentItem, getItemFn) {
  const rows = parentItem?.composition?.mode === 'recipe' && Array.isArray(parentItem.composition.items)
    ? parentItem.composition.items
    : [];
  const parts = [];
  for (const row of rows) {
    const childKey = row?.itemKey ? String(row.itemKey) : '';
    if (!childKey) continue;
    const child = typeof getItemFn === 'function' ? getItemFn(childKey) : null;
    if (!child || child.isRender !== true) continue;
    const quantity = Math.round(Number(row.quantity));
    if (!Number.isFinite(quantity) || quantity <= 0) continue;
    const box = readItemBoxCm(child);
    for (let instanceIndex = 0; instanceIndex < quantity; instanceIndex += 1) {
      parts.push({
        childItemKey: child.itemKey,
        instanceIndex,
        widthCm: box.widthCm,
        depthCm: box.depthCm,
        heightCm: box.heightCm,
        colorCss: Number.isInteger(child.defaultColor)
          ? colorIntToCss(child.defaultColor)
          : '#9ca3af',
        xCm: 0,
        yCm: 0,
        zCm: instanceIndex * box.heightCm,
        rotationXDeg: 0,
        rotationYDeg: 0,
        rotationZDeg: 0,
      });
    }
  }
  return parts;
}

/** Kayıtlı pose’ları BOM instance’larına uygula; eksik instance default poz. */
export function mergeAssemblyPoses(bomParts, savedParts) {
  const byKey = new Map();
  if (Array.isArray(savedParts)) {
    for (const saved of savedParts) {
      if (!saved?.childItemKey) continue;
      const index = Number(saved.instanceIndex);
      if (!Number.isInteger(index) || index < 0) continue;
      byKey.set(`${saved.childItemKey}#${index}`, saved);
    }
  }
  return bomParts.map((part) => {
    const saved = byKey.get(`${part.childItemKey}#${part.instanceIndex}`);
    if (!saved) return { ...part };
    return {
      ...part,
      xCm: Number.isFinite(Number(saved.xCm)) ? Number(saved.xCm) : part.xCm,
      yCm: Number.isFinite(Number(saved.yCm)) ? Number(saved.yCm) : part.yCm,
      zCm: Number.isFinite(Number(saved.zCm)) ? Number(saved.zCm) : part.zCm,
      rotationXDeg: Number.isFinite(Number(saved.rotationXDeg))
        ? Number(saved.rotationXDeg)
        : part.rotationXDeg,
      rotationYDeg: Number.isFinite(Number(saved.rotationYDeg))
        ? Number(saved.rotationYDeg)
        : part.rotationYDeg,
      rotationZDeg: Number.isFinite(Number(saved.rotationZDeg))
        ? Number(saved.rotationZDeg)
        : part.rotationZDeg,
    };
  });
}

export function getItemAssemblyParts(item) {
  const parts = item?.assembly?.parts;
  return Array.isArray(parts) ? parts : [];
}

export function itemHasAssemblyLayout(item) {
  return getItemAssemblyParts(item).length > 0;
}

/** Admin / API payload → normalize */
export function normalizeAssemblyPartsPayload(parts) {
  if (!Array.isArray(parts)) return [];
  return parts.map((part, fallbackIndex) => ({
    childItemKey: String(part.childItemKey ?? part.child_item_key ?? ''),
    instanceIndex: Number.isInteger(Number(part.instanceIndex ?? part.instance_index))
      ? Number(part.instanceIndex ?? part.instance_index)
      : fallbackIndex,
    xCm: Number(part.xCm ?? part.x_cm) || 0,
    yCm: Number(part.yCm ?? part.y_cm) || 0,
    zCm: Number(part.zCm ?? part.z_cm) || 0,
    rotationXDeg: Number(part.rotationXDeg ?? part.rotation_x_deg) || 0,
    rotationYDeg: Number(part.rotationYDeg ?? part.rotation_y_deg) || 0,
    rotationZDeg: Number(part.rotationZDeg ?? part.rotation_z_deg) || 0,
  })).filter((part) => part.childItemKey);
}
