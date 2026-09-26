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

function positiveCm(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function degToRad(deg) {
  return (Number(deg) || 0) * (Math.PI / 180);
}

/** Three Euler XYZ — product axes X=W, Y=D, Z=H; rot map: X←rotX, Y←rotZ, Z←rotY. */
function rotateProductEulerXYZ(x, y, z, rotationXDeg, rotationYDeg, rotationZDeg) {
  const rx = degToRad(rotationXDeg);
  const ry = degToRad(rotationZDeg);
  const rz = degToRad(rotationYDeg);
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  const x1 = x;
  const z2 = z1 * Math.cos(ry) - x1 * Math.sin(ry);
  const x2 = z1 * Math.sin(ry) + x1 * Math.cos(ry);
  const y2 = y1;
  const x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
  const y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
  return { x: x3, y: y3, z: z2 };
}

/** Parça AABB köşeleri — ürün cm (X=W, Y=D, Z=H); merkez = (x,y,z+H/2). */
export function assemblyPartCornersCm(part) {
  const widthCm = Number(part?.widthCm) || 0;
  const depthCm = Number(part?.depthCm) || 0;
  const heightCm = Number(part?.heightCm) || 0;
  const cx = Number(part?.xCm) || 0;
  const cy = Number(part?.yCm) || 0;
  const cz = (Number(part?.zCm) || 0) + heightCm / 2;
  const corners = [];
  for (const sx of [-0.5, 0.5]) {
    for (const sy of [-0.5, 0.5]) {
      for (const sz of [-0.5, 0.5]) {
        const local = rotateProductEulerXYZ(
          sx * widthCm,
          sy * depthCm,
          sz * heightCm,
          part?.rotationXDeg,
          part?.rotationYDeg,
          part?.rotationZDeg,
        );
        corners.push({ x: cx + local.x, y: cy + local.y, z: cz + local.z });
      }
    }
  }
  return corners;
}

/** Birleşim AABB (ürün cm). Parça yoksa null. */
export function computeAssemblyPartsAabbCm(parts) {
  if (!Array.isArray(parts) || parts.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  let any = false;
  for (const part of parts) {
    for (const corner of assemblyPartCornersCm(part)) {
      any = true;
      minX = Math.min(minX, corner.x);
      minY = Math.min(minY, corner.y);
      minZ = Math.min(minZ, corner.z);
      maxX = Math.max(maxX, corner.x);
      maxY = Math.max(maxY, corner.y);
      maxZ = Math.max(maxZ, corner.z);
    }
  }
  if (!any) return null;
  return {
    minX,
    minY,
    minZ,
    maxX,
    maxY,
    maxZ,
    widthCm: maxX - minX,
    depthCm: maxY - minY,
    heightCm: maxZ - minZ,
  };
}

/**
 * AABB → hedef `sceneDimensions ?? dimensions` (eksik eksen = scale 1, uydurma yok).
 * Hedef W/D/H’nin hiçbiri yoksa null (transform uygulama).
 *
 * Placement ile aynı pivot: W/D merkezde (procedural baza ±W/2 ±D/H),
 * H tabanı 0’da. Ürün cm scale {x=W,y=D,z=H}; Three positionM: X=W, Y=H, Z=D.
 */
export function computeAssemblySceneFitTransform(aabb, targetBoxCm) {
  if (!aabb) return null;
  const targetW = positiveCm(targetBoxCm?.widthCm);
  const targetD = positiveCm(targetBoxCm?.depthCm);
  const targetH = positiveCm(targetBoxCm?.heightCm);
  if (targetW == null && targetD == null && targetH == null) return null;

  const sizeW = positiveCm(aabb.widthCm);
  const sizeD = positiveCm(aabb.depthCm);
  const sizeH = positiveCm(aabb.heightCm);
  const scale = {
    x: targetW != null && sizeW != null ? targetW / sizeW : 1,
    y: targetD != null && sizeD != null ? targetD / sizeD : 1,
    z: targetH != null && sizeH != null ? targetH / sizeH : 1,
  };
  const centerX = (aabb.minX + aabb.maxX) / 2;
  const centerY = (aabb.minY + aabb.maxY) / 2;
  return {
    scale,
    // applyPlacementToGroup merkez pivotu: lokal X/Z simetrik, Y taban = 0.
    positionM: {
      x: (-centerX * scale.x) / 100,
      y: (-aabb.minZ * scale.z) / 100 || 0,
      z: (-centerY * scale.y) / 100,
    },
  };
}

/**
 * Canlı katalog: bu child assembly/sahnede çizilir mi?
 * isRender=false veya isActive=false → yok (kayıtlı pose olsa bile).
 */
export function isAssemblyRenderableChild(child) {
  if (!child || typeof child !== 'object') return false;
  if (child.isRender !== true) return false;
  if (child.isActive === false) return false;
  return true;
}

/** Recipe BOM → canlı çizilebilir child instance listesi (pose yok; ölçü/renk katalogdan). */
export function expandBomRenderInstances(parentItem, getItemFn) {
  const rows = parentItem?.composition?.mode === 'recipe' && Array.isArray(parentItem.composition.items)
    ? parentItem.composition.items
    : [];
  const parts = [];
  for (const row of rows) {
    const childKey = row?.itemKey ? String(row.itemKey) : '';
    if (!childKey) continue;
    const child = typeof getItemFn === 'function' ? getItemFn(childKey) : null;
    if (!isAssemblyRenderableChild(child)) continue;
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
        childType: child.type ?? null,
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

/**
 * Tek giriş: canlı BOM (+ katalog bayrakları/ölçü/renk) + kayıtlı pose.
 * assembly.parts yalnız konum/rotasyon/kilit; görünürlük ve kutu child’dan gelir.
 */
export function buildLiveAssemblyParts(parentItem, savedParts, getItemFn) {
  const bomParts = expandBomRenderInstances(parentItem, getItemFn);
  return mergeAssemblyPoses(bomParts, savedParts);
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
    const lockRaw = saved.lockGroupId ?? saved.lock_group_id;
    const lockGroupId = Number.isInteger(Number(lockRaw)) && Number(lockRaw) >= 1
      ? Number(lockRaw)
      : null;
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
      lockGroupId,
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

const FRAME_PART_TYPES = new Set(['profile', 'upright']);
const PANEL_PART_TYPES = new Set(['panel', 'separator-panel']);
const TOP_PART_TYPES = new Set(['counter-top', 'base-top']);

/**
 * Prod assembly mesh görünümü — katalog child canlı; çerçeve duvar/banko ile aynı
 * `frameColorCss` (frameColorForModule); panel yüzleri moduleState.faces ile boyanabilir.
 */
export function resolveAssemblyPartVisual(child, {
  frameColorCss = null,
  panelColorCss = null,
  topColorCss = null,
} = {}) {
  const type = child?.type ? String(child.type) : '';
  const ownColor = Number.isInteger(child?.defaultColor)
    ? colorIntToCss(child.defaultColor)
    : null;

  if (FRAME_PART_TYPES.has(type)) {
    return {
      role: 'frame',
      colorCss: frameColorCss || ownColor || '#9ca3af',
      metalness: 0.68,
      roughness: 0.28,
    };
  }
  if (PANEL_PART_TYPES.has(type)) {
    return {
      role: 'panel',
      colorCss: panelColorCss || ownColor || '#9ca3af',
      metalness: 0.06,
      roughness: 0.72,
    };
  }
  if (TOP_PART_TYPES.has(type)) {
    return {
      role: 'top',
      colorCss: topColorCss || ownColor || '#f8fafc',
      metalness: 0,
      roughness: 0.58,
    };
  }
  return {
    role: 'other',
    colorCss: ownColor || '#9ca3af',
    metalness: 0.06,
    roughness: 0.72,
  };
}

export function isAssemblyFramePartType(type) {
  return FRAME_PART_TYPES.has(String(type || ''));
}

export function isAssemblyPanelPartType(type) {
  return PANEL_PART_TYPES.has(String(type || ''));
}

export function isAssemblyTopPartType(type) {
  return TOP_PART_TYPES.has(String(type || ''));
}

/** Counter/base faces → sıra ile panel instance’lara bağlanır. */
export function listModuleFaceStates(moduleState) {
  const faces = moduleState?.faces;
  if (!faces || typeof faces !== 'object') return [];
  return Object.values(faces).filter((face) => face && typeof face === 'object');
}

/** Admin / API payload → normalize */
export function normalizeAssemblyPartsPayload(parts) {
  if (!Array.isArray(parts)) return [];
  return parts.map((part, fallbackIndex) => {
    const lockRaw = part.lockGroupId ?? part.lock_group_id;
    const lockGroupId = Number.isInteger(Number(lockRaw)) && Number(lockRaw) >= 1
      ? Number(lockRaw)
      : null;
    return {
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
      lockGroupId,
    };
  }).filter((part) => part.childItemKey);
}
