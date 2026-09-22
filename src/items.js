import { resolveWallPanelBandPitchCm } from './wallPanelBand.js';

// catalogVisible / categoryId / catalogItemIndex her Item'ın kendi katalog görünüm verisidir.
// previewId görünür Item'da Catalog kart silüet tanımıdır; type üzerinden seçilmez.
// dimensions fiziksel ürün ölçüsüdür; sceneDimensions aynı field setinin runtime override katmanıdır.
// categoryId yalnız UI gruplamasıdır; type, Item Contract veya registry grubundan türetilmez.
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
  if (!Array.isArray(items)) {
    throw new TypeError('Fair Stand Item catalog bootstrap items must be an array.');
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


// Zemin kaplamaları modül değildir; persist alanı stand.itemKey. Katalog/recipe yok.


export function listFloorItems() {
  return Object.values(requireRegistry()).filter((item) => item.type === 'floor');
}

export function getFloorItem(itemKey) {
  const item = requireRegistry()[itemKey];
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
    : (standOrKey?.itemKey ?? null);
  return getFloorItem(raw)?.itemKey ?? getFloorItem('karolaj').itemKey;
}

export function getFurnitureClusterQuantity(item, childItemKey) {
  const entry = item?.composition?.items?.find((row) => row.itemKey === childItemKey);
  return entry == null ? null : Number(entry.quantity);
}

const RECIPE_WALL_PANEL_CHILD_TYPES = Object.freeze(new Set(['panel', 'separator-panel']));

/** Recipe BOM panel slot count for wall-like modules (editable strip slots). */
export function countRecipeWallPanelSlots(item) {
  if (item?.composition?.mode !== 'recipe' || !Array.isArray(item.composition.items)) {
    return null;
  }
  let total = 0;
  for (const row of item.composition.items) {
    const childItemKey = row?.itemKey ?? null;
    const child = childItemKey ? getItem(childItemKey) : null;
    if (!child || !RECIPE_WALL_PANEL_CHILD_TYPES.has(child.type)) continue;
    const quantity = Number(row.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new TypeError(`Invalid recipe panel quantity for ${item.itemKey} → ${childItemKey}: ${row.quantity}.`);
    }
    total += quantity;
  }
  return total > 0 ? total : null;
}

/** Recipe panel slots capped by item ceiling (`sceneDimensions` / `dimensions` heightCm). */
export function resolveFlatPanelStripCount(item) {
  const pitchCm = Math.round(Number(resolveWallPanelBandPitchCm()));
  const ceilingHeightCm = requireSceneDimension(item, 'heightCm');
  const maxSlotsFromCeiling = Math.max(1, Math.floor(Number(ceilingHeightCm) / pitchCm));
  const fromRecipe = countRecipeWallPanelSlots(item);
  if (fromRecipe != null) {
    return Math.min(fromRecipe, maxSlotsFromCeiling);
  }
  return maxSlotsFromCeiling;
}

/** Full-height editable strip slots for showcase modules (ceiling ÷ band pitch). */
export function resolveShowcaseStripCount(item) {
  const pitchCm = Math.round(Number(resolveWallPanelBandPitchCm()));
  const ceilingHeightCm = requireSceneDimension(item, 'heightCm');
  return Math.max(1, Math.floor(Number(ceilingHeightCm) / pitchCm));
}

// Yapay bitki / uzun saksı ailesi. Hepsi type `indoor-plant-1`; ayrım kayıtlı itemKey.
// BOM decision-required — composition/recipe uydurulmaz.


// Duvara asılan medya ürünleri tek `tv` davranış ailesini paylaşır. Sıradan TV'ler
// doğrulanmış ekran ölçüsüne göre parametriktir; widthCm/heightCm görünür ekrandır.
// Video wall panel ölçüsü video_wall_panel Item'ındadır; ızgara rows/cols parent'ta kalır.


function resolveVideoWallPanelItem(item) {
  const panelItemKey = item?.videoWall?.panelItemKey ?? null;
  return panelItemKey ? getItem(panelItemKey) : null;
}

// Katalog, state oluşturucu ve seçim geri bildiriminin kullandığı duvar-medya ölçü çözümleyicisi.
// Video wall toplamları video_wall_panel × ızgaradan okunur; sıradan TV canonical dimensions kullanır.
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
      throw new TypeError(`Missing video_wall_panel dimensions for ${item.itemKey}.`);
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

/** Item master `isRender`: own scene module/mesh. Virtual/BOM rows stay out of factory. */
export function itemHasSceneRender(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  return item?.isRender === true;
}

function readCm(value) {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** Catalog drop kotu (yerden cm). Instance `placement.zCm`; tavan değil. */
export function resolveItemDefaultZCm(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  return readCm(item?.defaultZCm) ?? readCm(item?.dimensions?.mountHeightCm) ?? 0;
}

export const SNAP_ANCHORS = Object.freeze(['top', 'bottom', 'left', 'right']);

export function getItemSnapSpec(itemOrKey) {
  const item = typeof itemOrKey === 'string'
    ? getItem(itemOrKey)
    : (itemOrKey?.itemKey ? getItem(itemOrKey.itemKey) ?? itemOrKey : itemOrKey);
  const targetItemType = typeof item?.snapTargetItemType === 'string'
    ? item.snapTargetItemType.trim()
    : '';
  const anchor = item?.snapAnchor;
  if (!targetItemType || !SNAP_ANCHORS.includes(anchor)) return null;
  return Object.freeze({ targetItemType, anchor });
}

/** Overlay mouse Z ezer. Snap spec varsa placement.zCm (motor) kalır. Yoksa instance / defaultZCm. */
export function applyItemPlacementZCm(moduleState, placement, { overlayZCm = null } = {}) {
  if (!placement) return placement;
  const overlay = readCm(overlayZCm);
  if (overlay != null) return { ...placement, zCm: overlay };
  if (getItemSnapSpec(moduleState) && readCm(placement.zCm) != null) {
    return { ...placement, zCm: readCm(placement.zCm) };
  }
  const existing = readCm(moduleState?.placement?.zCm);
  if (moduleState?.placement && existing != null) return { ...placement, zCm: existing };
  return { ...placement, zCm: resolveItemDefaultZCm(moduleState?.itemKey ?? moduleState) };
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

// Catalog projection'ı taklit etmez; Item master + resolveSceneDimensions okur.
// Item identity çözümlemesi Catalog üyeliğine bağlı değildir.
// Item kimliği yalnız kayıtlı itemKey'dir; type/ölçü/shape/modelFile tahmini yoktur.
export function resolveItemKey(descriptor) {
  const itemKey = typeof descriptor === 'string'
    ? descriptor
    : (descriptor?.itemKey ?? descriptor?.moduleState?.itemKey ?? null);
  return itemKey && getItem(itemKey) ? itemKey : null;
}
