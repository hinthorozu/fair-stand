// catalogVisible / catalogCategory / catalogItemIndex her Item'ın kendi katalog görünüm verisidir.
// catalogPreview görünür Item'da Catalog kart renderer key'idir; type üzerinden seçilmez.
// dimensions fiziksel ürün ölçüsüdür; sceneDimensions aynı field setinin runtime override katmanıdır.
// catalogCategory yalnız UI gruplamasıdır; type, Item Contract veya registry grubundan türetilmez.
// Catalog, Item runtime repository değildir; catalogVisible=false Item'ı yok etmez.
// Kanonik Item tablosu. Satır = Item (`itemKey`). Kova map yoktur.

let itemByKey = null;
let catalogReady = false;

function freezeDeep(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (Array.isArray(value)) {
    value.forEach(freezeDeep);
    return Object.freeze(value);
  }
  for (const nested of Object.values(value)) freezeDeep(nested);
  return Object.freeze(value);
}

export function isItemCatalogReady() {
  return catalogReady === true;
}

export function initializeItemRegistry(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError('Fair Stand Item catalog bootstrap returned no Items.');
  }
  const next = Object.create(null);
  for (const item of items) {
    if (!item?.itemKey) throw new TypeError('Bootstrapped Item is missing itemKey.');
    next[item.itemKey] = freezeDeep(structuredClone(item));
  }
  itemByKey = Object.freeze(next);
  catalogReady = true;
}

export function resetItemRegistry() {
  itemByKey = null;
  catalogReady = false;
}

function requireRegistry() {
  if (!itemByKey) {
    throw new Error('Fair Stand Item catalog is not bootstrapped.');
  }
  return itemByKey;
}



const CONNECTOR_ITEM_KEYS_BY_TYPE = Object.freeze({
  start: 'connector_start',
  single: 'connector_single',
  double: 'connector_double',
  corner: 'connector_corner',
});

/**
 * TEST_ONLY connector type→itemKey yardımcısı.
 * Production BOM child satırları `composition.items` içindeki `itemKey` taşır;
 * `resolveItemBom` / `expandRecipe` bu API’yi çağırmaz.
 */
export function getConnectorItemKey(connectorType) {
  return CONNECTOR_ITEM_KEYS_BY_TYPE[connectorType] ?? null;
}

function normalizePositiveQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : null;
}

/**
 * Kanonik connector BOM çözümleyici.
 *
 * Miktar / sınıflandırma sahibi çağırandır (recipe veya kanonik ilişki
 * çözümleyici). Bu katman aparat miktarını renderer geometrisinden,
 * yakınlıktan veya geçici placement snap türünden tahmin etmez.
 */
export function resolveConnectorBom(requirements = []) {
  const quantities = new Map();

  for (const requirement of requirements) {
    const itemKey = requirement?.itemKey ?? getConnectorItemKey(requirement?.connectorType);
    const item = getItem(itemKey);
    if (!item || item.type !== 'connector') {
      throw new TypeError(`Unknown connector Item: ${itemKey ?? requirement?.connectorType ?? 'unknown'}.`);
    }

    const quantity = normalizePositiveQuantity(requirement?.quantity);
    if (quantity === null) {
      throw new TypeError(`Connector quantity is required for ${itemKey}.`);
    }

    quantities.set(itemKey, (quantities.get(itemKey) ?? 0) + quantity);
  }

  return Array.from(quantities, ([itemKey, quantity]) => {
    const item = getItem(itemKey);
    return Object.freeze({ itemKey, quantity, unit: item.unit, item });
  });
}

// Bağımsız ticari ürünler, doğrulanmış ürün varsayılanlarının sahibidir.


const COMMERCIAL_TYPES = Object.freeze(new Set([
  'coat-rack',
  'kettle',
  'mini-fridge',
  'plastic-trash-bin',
]));

export function getCommercialItemForType(type) {
  if (!COMMERCIAL_TYPES.has(type)) return null;
  return Object.values(requireRegistry()).find((item) => item.type === type) ?? null;
}

// Extra furniture. Tekil Item'lar kendi type'ına sahip. Eames ve klasik koltuk takımları child Item kümesidir.
// BOM decision-required — unit / composition.items / moduleRecipes uydurulmaz.


const FURNITURE_TYPES = Object.freeze(new Set([
  'sofa-set-classic',
  'sofa-single-classic',
  'sofa-double-classic',
  'coffee-table-classic',
  'table-chair-set-eames',
  'chair',
  'table-glass',
  'bar-stool',
]));

export function getFurnitureItemForType(type) {
  if (!FURNITURE_TYPES.has(type)) return null;
  return Object.values(requireRegistry()).find((item) => item.type === type) ?? null;
}

// Üst profil LED projektör. Tekil katalog Item. BOM decision-required — unit/recipe uydurulmaz.


export function getTopLightItemForType(type) {
  if (type !== 'led-floodlight') return null;
  const item = getItem('led_floodlight');
  return item?.type === type ? item : null;
}

// Katalog dışı SVG → ışıklı strafor. itemKey type ile aynıdır; Catalog kartı yoktur.


// Zemin kaplamaları modül değildir; persist alanı stand.itemKey (eski kayıt: floorType). Katalog/recipe yok.


export function listFloorItems() {
  return Object.values(requireRegistry()).filter((item) => item.type === 'floor');
}

export function getFloorItem(floorType) {
  const item = requireRegistry()[floorType];
  return item?.type === 'floor' ? item : null;
}

export function getFloorSelectLabel(item) {
  if (!item) return '';
  const widthCm = Number(item.dimensions?.widthCm);
  const depthCm = Number(item.dimensions?.depthCm);
  if (item.paintable && Number.isFinite(widthCm) && Number.isFinite(depthCm)) {
    return `${item.name} · ${widthCm} × ${depthCm} cm`;
  }
  return item.name;
}

export function isParquetFloorItem(item) {
  return item?.type === 'floor' && Number(item.dimensions?.lengthCm) > 0;
}

export function isGridTileFloorItem(item) {
  return item?.type === 'floor'
    && Boolean(item.paintable)
    && Number(item.dimensions?.widthCm) > 0
    && Number(item.dimensions?.depthCm) > 0
    && !isParquetFloorItem(item);
}

export function isCarpetFloorItem(item) {
  return item?.type === 'floor'
    && Boolean(item.paintable)
    && !Number(item.dimensions?.widthCm);
}

export function resolveStandFloorItemKey(standOrKey) {
  const raw = typeof standOrKey === 'string'
    ? standOrKey
    : (standOrKey?.itemKey ?? standOrKey?.floorType ?? null);
  return getFloorItem(raw)?.itemKey ?? getFloorItem('karolaj').itemKey;
}

export function getFurnitureClusterQuantity(item, childItemKey) {
  const entry = item?.composition?.items?.find((row) => row.itemKey === childItemKey);
  return entry == null ? null : Number(entry.quantity);
}

// Yapay bitki / uzun saksı ailesi. Hepsi type `indoor-plant-1`; ayrım itemKey + ölçü/modelFile.
// BOM decision-required — composition/recipe uydurulmaz.


// Duvara asılan medya ürünleri tek `tv` davranış ailesini paylaşır. Sıradan TV'ler
// doğrulanmış ekran ölçüsüne göre parametriktir; widthCm/heightCm görünür ekrandır.
// Video wall panel ölçüsü VIDEO_WALL_PANEL Item'ındadır; ızgara rows/cols parent'ta kalır.


function resolveVideoWallPanelItem(item) {
  const panelItemKey = item?.videoWall?.panelItemKey ?? null;
  return panelItemKey ? getItem(panelItemKey) : null;
}

// Katalog, state oluşturucu ve seçim geri bildiriminin kullandığı duvar-medya ölçü çözümleyicisi.
// Video wall toplamları VIDEO_WALL_PANEL × ızgaradan okunur; sıradan TV canonical dimensions kullanır.
export function resolveWallMediaMetrics(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  if (!item || item.type !== 'tv') return null;
  const scene = resolveSceneDimensions(item);
  const depthCm = Number(item.dimensions?.depthCm);
  const base = {
    itemKey: item.itemKey, type: item.type, label: item.name, depthCm,
    widthCm: scene.widthCm,
    heightCm: scene.heightCm,
  };
  if (item.videoWall) {
    const panel = resolveVideoWallPanelItem(item);
    const panelWidthCm = Number(panel?.dimensions?.widthCm);
    const panelHeightCm = Number(panel?.dimensions?.heightCm);
    if (!Number.isFinite(panelWidthCm) || !Number.isFinite(panelHeightCm)) {
      throw new TypeError(`Missing VIDEO_WALL_PANEL dimensions for ${item.itemKey}.`);
    }
    return Object.freeze({
      ...base,
      widthCm: panelWidthCm * item.videoWall.cols,
      heightCm: panelHeightCm * item.videoWall.rows,
      videoWallRows: item.videoWall.rows,
      videoWallCols: item.videoWall.cols,
      panelItemKey: item.videoWall.panelItemKey,
    });
  }
  return Object.freeze({
    ...base,
    videoWallRows: 1,
    videoWallCols: 1,
  });
}





const SHOWCASE_ITEM_KEYS_BY_TYPE = Object.freeze({
  'showcase-2': 'wall_showcase_100_2',
  'showcase-3': 'wall_showcase_100_3',
});

export function getShowcaseItemKeyForType(type) {
  return SHOWCASE_ITEM_KEYS_BY_TYPE[type] ?? null;
}

export function getShowcaseBodyDefinition(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  const expectedItemKey = getShowcaseItemKeyForType(item?.type);
  if (!item || !expectedItemKey || item.itemKey !== expectedItemKey) return null;

  const sideItem = getItem(item.bodyItems?.sideItemKey);
  const horizontalItem = getItem(item.bodyItems?.horizontalItemKey);
  const glassShelfItem = getItem(item.bodyItems?.glassShelfItemKey);
  if (!sideItem?.dimensions || !horizontalItem?.dimensions || !glassShelfItem?.dimensions) {
    throw new TypeError(`Canonical showcase body Items are incomplete for ${item.itemKey}.`);
  }
  if (sideItem.material !== 'sunta' || horizontalItem.material !== 'sunta') {
    throw new TypeError(`Canonical showcase body boards must be sunta for ${item.itemKey}.`);
  }
  if (Number(sideItem.dimensions.depthCm) !== Number(horizontalItem.dimensions.depthCm)
      || Number(sideItem.dimensions.thicknessCm) !== Number(horizontalItem.dimensions.thicknessCm)) {
    throw new TypeError(`Canonical showcase body board depth/thickness mismatch for ${item.itemKey}.`);
  }
  if (!Number.isInteger(sideItem.defaultColor)
      || sideItem.defaultColor !== horizontalItem.defaultColor) {
    throw new TypeError(`Canonical showcase body default color mismatch for ${item.itemKey}.`);
  }
  return Object.freeze({
    item, sideItem, horizontalItem, glassShelfItem, defaultColor: sideItem.defaultColor,
  });
}

export function getItem(itemKey) {
  return requireRegistry()[itemKey] ?? null;
}

export function isShortUpFamilyDescriptor(descriptor) {
  const variant = descriptor?.variant ?? getItem(descriptor?.itemKey)?.variant;
  return variant === 'short-up-1' || variant === 'short-up-2';
}

export function listRegisteredItems() {
  return Object.freeze(Object.values(requireRegistry()));
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export const SCENE_DIMENSION_FIELDS = Object.freeze([
  'widthCm',
  'depthCm',
  'heightCm',
  'lengthCm',
  'thicknessCm',
]);

function readDimensionField(layer, field) {
  if (!layer || typeof layer !== 'object') return null;
  return optionalNumber(layer[field]);
}

// Scene/runtime ölçü: aynı field adı için sceneDimensions ?? dimensions ?? MISSING.
// length→width, thickness→depth, Recipe/Catalog/type/itemKey/STAND çapraz remap yoktur.
export function resolveSceneDimensions(item) {
  const resolved = {};
  for (const field of SCENE_DIMENSION_FIELDS) {
    resolved[field] = readDimensionField(item?.sceneDimensions, field)
      ?? readDimensionField(item?.dimensions, field)
      ?? null;
  }
  return Object.freeze(resolved);
}

export function requireSceneDimension(item, field) {
  const value = resolveSceneDimensions(item)[field];
  if (value == null) {
    throw new TypeError(`Item ${item?.itemKey ?? 'unknown'} is missing scene dimension ${field}.`);
  }
  return value;
}

// Katalogdaki düz bankolarda `shape` yoktur; runtime state `shape: 'straight'` kullanır.
function shapesMatch(want, have) {
  const normalizedWant = want === 'L' ? 'L' : (want == null ? null : 'straight');
  const normalizedHave = have === 'L' ? 'L' : (have == null ? null : 'straight');
  if (normalizedWant === null) return true;
  if (normalizedHave === null && normalizedWant === 'straight') return true;
  return normalizedWant === normalizedHave;
}

function normalizeItemDescriptor(descriptor) {
  const nested = descriptor?.moduleState && typeof descriptor.moduleState === 'object'
    ? descriptor.moduleState
    : null;
  const source = nested ?? descriptor ?? {};
  return {
    itemKey: source.itemKey ?? descriptor?.itemKey ?? null,
    type: source.type ?? source.moduleType ?? descriptor?.type ?? descriptor?.moduleType ?? null,
    widthCm: optionalNumber(source.widthCm ?? descriptor?.widthCm),
    depthCm: optionalNumber(source.depthCm ?? descriptor?.depthCm),
    shape: source.shape ?? source.counterShape ?? descriptor?.shape ?? descriptor?.counterShape ?? null,
    modelFile: source.modelFile ?? descriptor?.modelFile ?? null,
    variant: source.variant ?? descriptor?.variant ?? null,
  };
}

// Catalog projection'ı taklit etmez; Item master + resolveSceneDimensions okur.
function getItemIdentityFields(item) {
  const scene = resolveSceneDimensions(item);
  return {
    type: item.type,
    widthCm: optionalNumber(scene.widthCm),
    depthCm: optionalNumber(scene.depthCm),
    shape: item.shape ?? null,
    modelFile: item.modelFile ?? null,
    variant: item.variant ?? null,
  };
}

// Item identity çözümlemesi Catalog üyeliğine bağlı değildir.
export function resolveItemKey(descriptor) {
  const normalized = normalizeItemDescriptor(descriptor);
  if (normalized.itemKey && getItem(normalized.itemKey)) return normalized.itemKey;
  if (!normalized.type) return null;
  // shelf identity yalnız exact itemKey; type/width/shelfCount tahmini yok
  if (normalized.type === 'shelf') return null;

  const candidates = listRegisteredItems().filter((item) => item.type === normalized.type);
  if (!candidates.length) return null;

  const matches = candidates.filter((item) => {
    const fields = getItemIdentityFields(item);
    if (normalized.widthCm !== null && optionalNumber(fields.widthCm) !== null && optionalNumber(fields.widthCm) !== normalized.widthCm) return false;
    if (normalized.depthCm !== null && optionalNumber(fields.depthCm) !== null && optionalNumber(fields.depthCm) !== normalized.depthCm) return false;
    if ((normalized.shape !== null || fields.shape != null)
      && !shapesMatch(normalized.shape, fields.shape)) return false;
    if ((normalized.modelFile !== null || fields.modelFile != null) && (fields.modelFile ?? null) !== normalized.modelFile) return false;
    if ((normalized.variant != null || fields.variant != null) && (fields.variant ?? null) !== (normalized.variant ?? null)) return false;
    return true;
  });

  if (matches.length === 1) return matches[0].itemKey;
  if (candidates.length === 1) return candidates[0].itemKey;
  return null;
}
