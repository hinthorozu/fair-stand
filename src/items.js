import { getProductionItem } from './productionParts.js';

// Standalone commercial products own their verified product defaults.
export const COMMERCIAL_ITEMS = Object.freeze({
  COAT_RACK: Object.freeze({
    itemKey: 'COAT_RACK', name: 'Askılık', type: 'coat-rack',
    dimensions: Object.freeze({ widthCm: 43, depthCm: 43, heightCm: 180 }),
    modelFile: 'coat_rack.glb',
  }),
  KETTLE: Object.freeze({
    itemKey: 'KETTLE', name: 'Kettle', type: 'kettle',
    dimensions: Object.freeze({ widthCm: 24, depthCm: 19, heightCm: 25 }),
    modelFile: 'kettle.glb',
  }),
  MINI_FRIDGE_AVANTI: Object.freeze({
    itemKey: 'MINI_FRIDGE_AVANTI', name: 'Mini Buzdolabı', type: 'mini-fridge',
    dimensions: Object.freeze({ widthCm: 50, depthCm: 50, heightCm: 66 }),
    modelFile: '80s_avanti_mini_fridge.glb',
  }),
  PLASTIC_TRASH_BIN: Object.freeze({
    itemKey: 'PLASTIC_TRASH_BIN', name: 'Çöp Kutusu', type: 'plastic-trash-bin',
    dimensions: Object.freeze({ widthCm: 40, depthCm: 40, heightCm: 60 }),
    modelFile: 'plastic_trash_bin.glb', preserveModelScale: false,
    modelRotationYDeg: 0, visualRotationYDeg: -90,
  }),
});

export function getCommercialItemForType(type) {
  return Object.values(COMMERCIAL_ITEMS).find((item) => item.type === type) ?? null;
}

// Extra furniture. Tekil Item'lar kendi type'ına sahip. Eames ve klasik koltuk takımları child Item kümesidir.
// BOM decision-required — unit/moduleRecipes uydurulmaz.
export const FURNITURE_ITEMS = Object.freeze({
  furniture_sofa_set_classic: Object.freeze({
    itemKey: 'furniture_sofa_set_classic',
    name: 'Koltuk Takımı',
    type: 'sofa-set-classic',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 150,
      heightCm: 78,
    }),
    composition: Object.freeze({
      items: Object.freeze([
        Object.freeze({ itemKey: 'furniture_sofa_double_classic', quantity: 1 }),
        Object.freeze({ itemKey: 'furniture_sofa_single_classic', quantity: 2 }),
        Object.freeze({ itemKey: 'furniture_coffee_table_classic', quantity: 1 }),
      ]),
    }),
  }),
  furniture_sofa_single_classic: Object.freeze({
    itemKey: 'furniture_sofa_single_classic',
    name: 'Tekli Koltuk',
    type: 'sofa-single-classic',
    dimensions: Object.freeze({
      widthCm: 65,
      depthCm: 45,
      heightCm: 78,
    }),
    visualRotationYDeg: -135,
  }),
  furniture_sofa_double_classic: Object.freeze({
    itemKey: 'furniture_sofa_double_classic',
    name: 'Çiftli Koltuk',
    type: 'sofa-double-classic',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 45,
      heightCm: 78,
    }),
    visualRotationYDeg: -45,
  }),
  furniture_coffee_table_classic: Object.freeze({
    itemKey: 'furniture_coffee_table_classic',
    name: 'Sehpa',
    type: 'coffee-table-classic',
    dimensions: Object.freeze({
      widthCm: 60,
      depthCm: 42,
      heightCm: 38,
    }),
  }),
  furniture_table_chair_set_eames: Object.freeze({
    itemKey: 'furniture_table_chair_set_eames',
    name: 'Eames Masa Sandalye Takımı',
    type: 'table-chair-set-eames',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 150,
      heightCm: 82,
    }),
    composition: Object.freeze({
      items: Object.freeze([
        Object.freeze({ itemKey: 'glass_table', quantity: 1 }),
        Object.freeze({ itemKey: 'chair_eames', quantity: 4 }),
      ]),
    }),
  }),
  chair_eames: Object.freeze({
    itemKey: 'chair_eames',
    name: 'Eames Sandalye',
    type: 'chair',
    dimensions: Object.freeze({
      widthCm: 46,
      depthCm: 58,
      heightCm: 82,
    }),
  }),
  glass_table: Object.freeze({
    itemKey: 'glass_table',
    name: 'Cam Masa',
    type: 'table-glass',
    dimensions: Object.freeze({
      widthCm: 75,
      depthCm: 75,
      heightCm: 74,
      tableDiameterCm: 75,
    }),
  }),
  furniture_bar_stool_classic: Object.freeze({
    itemKey: 'furniture_bar_stool_classic',
    name: 'Bar Taburesi',
    type: 'bar-stool',
    dimensions: Object.freeze({
      widthCm: 60,
      depthCm: 55,
      heightCm: 121,
    }),
  }),
});

export function getFurnitureItemForType(type) {
  return Object.values(FURNITURE_ITEMS).find((item) => item.type === type) ?? null;
}

// Üst profil LED projektör. Tekil katalog Item. BOM decision-required — unit/recipe uydurulmaz.
export const TOP_LIGHT_ITEMS = Object.freeze({
  led_floodlight: Object.freeze({
    itemKey: 'led_floodlight',
    name: 'LED Projektör',
    type: 'led-floodlight',
    dimensions: Object.freeze({
      widthCm: 50,
      depthCm: 20,
      heightCm: 35,
      mountHeightCm: 350,
    }),
  }),
});

export function getTopLightItemForType(type) {
  return Object.values(TOP_LIGHT_ITEMS).find((item) => item.type === type) ?? null;
}

// Katalog dışı SVG → ışıklı strafor. itemKey type ile aynıdır; MODULE_CATALOG kaydı yoktur.
export const NON_CATALOG_ITEMS = Object.freeze({
  'illuminated-foam': Object.freeze({
    itemKey: 'illuminated-foam',
    name: 'Işıklı Strafor / Logo',
    type: 'illuminated-foam',
    dimensions: Object.freeze({
      widthCm: 200,
      heightCm: 50,
      depthCm: 3.5,
      wallGapCm: 1.5,
    }),
  }),
});

// Zemin kaplamaları modül değildir; stand.floorType = itemKey. Katalog/recipe yok.
export const FLOOR_ITEMS = Object.freeze({
  karolaj: Object.freeze({
    itemKey: 'karolaj',
    name: 'Karolaj',
    type: 'floor',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 100 }),
    defaultColor: '#e9edf1',
    paintable: true,
  }),
  hali: Object.freeze({
    itemKey: 'hali',
    name: 'Halı',
    type: 'floor',
    defaultColor: '#8b8f94',
    paintable: true,
  }),
  'parke-acik': Object.freeze({
    itemKey: 'parke-acik',
    name: 'Beyaz Meşe',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 140, depthCm: 16 }),
    defaultColor: '#e8dfd1',
    paintable: false,
  }),
  'parke-sari': Object.freeze({
    itemKey: 'parke-sari',
    name: 'Sarı Meşe',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 140, depthCm: 16 }),
    defaultColor: '#ddb24f',
    paintable: false,
  }),
  'parke-beton': Object.freeze({
    itemKey: 'parke-beton',
    name: 'Beton Parke',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 112, depthCm: 28 }),
    defaultColor: '#625f58',
    paintable: false,
  }),
});

export function listFloorItems() {
  return Object.values(FLOOR_ITEMS);
}

export function getFloorItem(floorType) {
  return FLOOR_ITEMS[floorType] ?? null;
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

export function getFurnitureClusterQuantity(item, childItemKey) {
  const entry = item?.composition?.items?.find((row) => row.itemKey === childItemKey);
  return entry == null ? null : Number(entry.quantity);
}

// Yapay bitki / uzun saksı ailesi. Hepsi type `indoor-plant-1`; ayrım itemKey + ölçü/modelFile.
// BOM decision-required — composition/recipe uydurulmaz.
export const INDOOR_PLANT_ITEMS = Object.freeze({
  EXTRA_INDOOR_PLANT_1: Object.freeze({
    itemKey: 'EXTRA_INDOOR_PLANT_1',
    name: 'Yapay Çiçek 1',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 60, depthCm: 60, heightCm: 120 }),
    // Katalogda modelFile yoktu; factory default runtime `indoor_plants.glb` kullanır.
    // Item'da modelFile tutulmaz ki catalog resolve width/depth ile tek aday kalsın.
    modelRotationYDeg: 0,
    preserveModelScale: false,
  }),
  EXTRA_LONG_PLANTER_100: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_100',
    name: 'Uzun Saksı 100',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),
  EXTRA_LONG_PLANTER_150: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_150',
    name: 'Uzun Saksı 150',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_150x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),
  EXTRA_LONG_PLANTER_200: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_200',
    name: 'Uzun Saksı 200',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_200x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),
});

// Wall-mounted media products share the single `tv` behavior family. Ordinary TVs are
// parametric by verified screen size; widthCm is that same screen width so placement
// bounds match the rendered box. Video walls derive totals from panel size x grid.
export const WALL_MEDIA_ITEMS = Object.freeze({
  TV_42: Object.freeze({
    itemKey: 'TV_42', name: 'TV 42"', type: 'tv', sizeInch: 42,
    dimensions: Object.freeze({
      widthCm: 93.0, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3,
    }),
  }),
  TV_55: Object.freeze({
    itemKey: 'TV_55', name: 'TV 55"', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({
      widthCm: 121.8, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 121.8, screenHeightCm: 68.5,
    }),
  }),
  TV_65: Object.freeze({
    itemKey: 'TV_65', name: 'TV 65"', type: 'tv', sizeInch: 65,
    dimensions: Object.freeze({
      widthCm: 143.9, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 143.9, screenHeightCm: 80.9,
    }),
  }),
  VIDEO_WALL_2X2: Object.freeze({
    itemKey: 'VIDEO_WALL_2X2', name: 'Video Wall 2×2', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({ depthCm: 5 }),
    videoWall: Object.freeze({ rows: 2, cols: 2, panelScreenWidthCm: 108.5, panelScreenHeightCm: 61 }),
  }),
  VIDEO_WALL_3X3: Object.freeze({
    itemKey: 'VIDEO_WALL_3X3', name: 'Video Wall 3×3', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({ depthCm: 5 }),
    videoWall: Object.freeze({ rows: 3, cols: 3, panelScreenWidthCm: 108.5, panelScreenHeightCm: 61 }),
  }),
});

// Canonical resolver for wall-media metrics consumed by catalog, state factory and
// selection feedback. Video-wall totals are derived from panel size x grid; ordinary
// TV totals are the verified screen dimensions.
export function resolveWallMediaMetrics(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? WALL_MEDIA_ITEMS[itemOrKey] : itemOrKey;
  if (!item || item.type !== 'tv') return null;
  const depthCm = Number(item.dimensions?.depthCm);
  const base = {
    itemKey: item.itemKey, type: item.type, label: item.name, sizeInch: item.sizeInch, depthCm,
  };
  if (item.videoWall) {
    const { rows, cols, panelScreenWidthCm, panelScreenHeightCm } = item.videoWall;
    const screenWidthCm = panelScreenWidthCm * cols;
    const screenHeightCm = panelScreenHeightCm * rows;
    return Object.freeze({
      ...base,
      widthCm: screenWidthCm,
      catalogHeightCm: screenHeightCm,
      screenWidthCm,
      screenHeightCm,
      videoWallRows: rows,
      videoWallCols: cols,
      panelScreenWidthCm,
      panelScreenHeightCm,
    });
  }
  // Placement footprint must match the rendered screen — same rule as video walls.
  const { catalogHeightCm, screenWidthCm, screenHeightCm } = item.dimensions;
  return Object.freeze({
    ...base,
    widthCm: screenWidthCm,
    catalogHeightCm,
    screenWidthCm,
    screenHeightCm,
    videoWallRows: 1,
    videoWallCols: 1,
    panelScreenWidthCm: screenWidthCm,
    panelScreenHeightCm: screenHeightCm,
  });
}

export const COMPOSITE_ITEMS = Object.freeze({
  door_100: Object.freeze({
    itemKey: 'door_100',
    name: 'Depo Kapısı 100',
    type: 'door',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'door',
      nominalWidthCm: 100,
    }),
  }),
  // Free-standing baza parents share type `base` and resolve BOM via moduleRecipes
  // `base:100|150|200`. Child Item quantities stay in the recipe; wall_base_* parents
  // are a separate type/recipe family that happens to reuse the same base_top_* keys.
  BASE_100: Object.freeze({
    itemKey: 'BASE_100',
    name: 'Baza 100',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 100,
    }),
  }),
  BASE_150: Object.freeze({
    itemKey: 'BASE_150',
    name: 'Baza 150',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 150,
    }),
  }),
  BASE_200: Object.freeze({
    itemKey: 'BASE_200',
    name: 'Baza 200',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 200,
    }),
  }),
  // Free-standing banko parents share type `counter`. Straight and L variants are
  // separate itemKeys; child quantities stay in moduleRecipes (counter:* / counter-l:*).
  desk_banko_100: Object.freeze({
    itemKey: 'desk_banko_100',
    name: 'Banko 100',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 100,
    }),
  }),
  desk_banko_150: Object.freeze({
    itemKey: 'desk_banko_150',
    name: 'Banko 150',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 150,
    }),
  }),
  desk_banko_200: Object.freeze({
    itemKey: 'desk_banko_200',
    name: 'Banko 200',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 200,
    }),
  }),
  desk_banko_100_L: Object.freeze({
    itemKey: 'desk_banko_100_L',
    name: 'Köşe Banko 100×100',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 100, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 100,
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  desk_banko_150_L: Object.freeze({
    itemKey: 'desk_banko_150_L',
    name: 'Köşe Banko 150×150',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 150, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 150,
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  desk_banko_200_L: Object.freeze({
    itemKey: 'desk_banko_200_L',
    name: 'Köşe Banko 200×200',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 200, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      nominalWidthCm: 200,
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  // Straight flat-panel wall parents. Child quantities stay in moduleRecipes
  // straight-wall entries (50/100/150/200); Raw BOM UI path unchanged.
  wall_50: Object.freeze({
    itemKey: 'wall_50',
    name: 'Düz Panel 50',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
      nominalWidthCm: 50,
    }),
  }),
  wall_100: Object.freeze({
    itemKey: 'wall_100',
    name: 'Düz Panel 100',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
      nominalWidthCm: 100,
    }),
  }),
  wall_150: Object.freeze({
    itemKey: 'wall_150',
    name: 'Düz Panel 150',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 150 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
      nominalWidthCm: 150,
    }),
  }),
  wall_200: Object.freeze({
    itemKey: 'wall_200',
    name: 'Düz Panel 200',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 200 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
      nominalWidthCm: 200,
    }),
  }),
  // Panel Bazalı parent'lar (type base-wall). Child miktarları moduleRecipes
  // base-wall:100|150|200 satırlarında kalır; Raw BOM UI dokunulmaz.
  wall_base_100: Object.freeze({
    itemKey: 'wall_base_100',
    name: 'Panel Bazalı 100',
    type: 'base-wall',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base-wall',
      nominalWidthCm: 100,
    }),
  }),
  wall_base_150: Object.freeze({
    itemKey: 'wall_base_150',
    name: 'Panel Bazalı 150',
    type: 'base-wall',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base-wall',
      nominalWidthCm: 150,
    }),
  }),
  wall_base_200: Object.freeze({
    itemKey: 'wall_base_200',
    name: 'Panel Bazalı 200',
    type: 'base-wall',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base-wall',
      nominalWidthCm: 200,
    }),
  }),
  // Separatör parent'lar (type separator). Child miktarları moduleRecipes
  // separator:50|100 satırlarında; sarmasık aynı genişlik recipe'sini paylaşır.
  wall_separator_50: Object.freeze({
    itemKey: 'wall_separator_50',
    name: 'Separatör 50',
    type: 'separator',
    dimensions: Object.freeze({ widthCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
      nominalWidthCm: 50,
    }),
  }),
  wall_separator_100: Object.freeze({
    itemKey: 'wall_separator_100',
    name: 'Separatör 100',
    type: 'separator',
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
      nominalWidthCm: 100,
    }),
  }),
  wall_separator_50_sarmasik: Object.freeze({
    itemKey: 'wall_separator_50_sarmasik',
    name: 'Separatör 50 Sarmaşık',
    type: 'separator',
    modelFile: 'wall_separator_50_sarmasik.glb',
    dimensions: Object.freeze({ widthCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
      nominalWidthCm: 50,
    }),
  }),
  wall_separator_100_sarmasik: Object.freeze({
    itemKey: 'wall_separator_100_sarmasik',
    name: 'Separatör 100 Sarmaşık',
    type: 'separator',
    modelFile: 'wall_separator_100_sarmasik.glb',
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
      nominalWidthCm: 100,
    }),
  }),
  // Raflı duvar parent'lar (type shelf). Child miktarları moduleRecipes
  // shelf:{width}:{shelfCount} satırlarında kalır; Raw BOM UI dokunulmaz.
  wall_shelf_2_100: Object.freeze({
    itemKey: 'wall_shelf_2_100',
    name: 'Raf 100 · 2 Raf',
    type: 'shelf',
    shelfCount: 2,
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 100,
      options: Object.freeze({ shelfCount: 2 }),
    }),
  }),
  wall_shelf_2_150: Object.freeze({
    itemKey: 'wall_shelf_2_150',
    name: 'Raf 150 · 2 Raf',
    type: 'shelf',
    shelfCount: 2,
    dimensions: Object.freeze({ widthCm: 150 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 150,
      options: Object.freeze({ shelfCount: 2 }),
    }),
  }),
  wall_shelf_2_200: Object.freeze({
    itemKey: 'wall_shelf_2_200',
    name: 'Raf 200 · 2 Raf',
    type: 'shelf',
    shelfCount: 2,
    dimensions: Object.freeze({ widthCm: 200 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 200,
      options: Object.freeze({ shelfCount: 2 }),
    }),
  }),
  wall_shelf_3_100: Object.freeze({
    itemKey: 'wall_shelf_3_100',
    name: 'Raf 100 · 3 Raf',
    type: 'shelf',
    shelfCount: 3,
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 100,
      options: Object.freeze({ shelfCount: 3 }),
    }),
  }),
  wall_shelf_3_150: Object.freeze({
    itemKey: 'wall_shelf_3_150',
    name: 'Raf 150 · 3 Raf',
    type: 'shelf',
    shelfCount: 3,
    dimensions: Object.freeze({ widthCm: 150 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 150,
      options: Object.freeze({ shelfCount: 3 }),
    }),
  }),
  wall_shelf_3_200: Object.freeze({
    itemKey: 'wall_shelf_3_200',
    name: 'Raf 200 · 3 Raf',
    type: 'shelf',
    shelfCount: 3,
    dimensions: Object.freeze({ widthCm: 200 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'shelf',
      nominalWidthCm: 200,
      options: Object.freeze({ shelfCount: 3 }),
    }),
  }),
  wall_showcase_100_2: Object.freeze({
    itemKey: 'wall_showcase_100_2',
    name: '2 Gözlü Vitrin 100',
    type: 'showcase-2',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    eyeCount: 2,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_94_6_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-2',
      nominalWidthCm: 100,
    }),
  }),
  wall_showcase_100_3: Object.freeze({
    itemKey: 'wall_showcase_100_3',
    name: '3 Gözlü Vitrin 100',
    type: 'showcase-3',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    eyeCount: 3,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_143_5_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-3',
      nominalWidthCm: 100,
    }),
  }),
});

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

  const sideItem = getProductionItem(item.bodyItems?.sideItemKey);
  const horizontalItem = getProductionItem(item.bodyItems?.horizontalItemKey);
  const glassShelfItem = getProductionItem(item.bodyItems?.glassShelfItemKey);
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
  return COMMERCIAL_ITEMS[itemKey]
    ?? FURNITURE_ITEMS[itemKey]
    ?? INDOOR_PLANT_ITEMS[itemKey]
    ?? WALL_MEDIA_ITEMS[itemKey]
    ?? TOP_LIGHT_ITEMS[itemKey]
    ?? NON_CATALOG_ITEMS[itemKey]
    ?? FLOOR_ITEMS[itemKey]
    ?? COMPOSITE_ITEMS[itemKey]
    ?? getProductionItem(itemKey);
}

export function listCompositeItems() {
  return Object.values(COMPOSITE_ITEMS);
}
