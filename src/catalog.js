export const STAND_DIMENSIONS = Object.freeze({
  height: 3.5,
  depth: 0.1,
  stripCount: 7,
  stripHeight: 0.5,
  frameWidth: 0.055,
  frameDepth: 0.1,
});

export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);

export const COUNTER_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 100,
  widthsCm: Object.freeze([100, 150, 200]),
});

export const BASE_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 50,
  widthsCm: Object.freeze([100, 150, 200]),
});

export const SHELF_DIMENSIONS = Object.freeze({
  projectionCm: 38,
  thicknessCm: 3,
  widthsCm: Object.freeze([100, 150, 200]),
  heightsByCountCm: Object.freeze({
    2: Object.freeze([100, 150]),
    3: Object.freeze([100, 150, 200]),
  }),
});

export const furniture_sofa_set_classic_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 80,
  loveseatWidthCm: 150,
  chairWidthCm: 65,
  tableDiameterCm: 60,
});

export const furniture_table_chair_set_minyon_DIMENSIONS = Object.freeze({
  widthCm: 120,
  depthCm: 120,
  heightCm: 90,
  chairWidthCm: 46,
  chairDepthCm: 46,
  tableDiameterCm: 75,
  tableHeightCm: 74,
});

export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});

export const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 20,
  heightCm: 35,
  mountHeightCm: 350,
});

export const MODULE_CATALOG = Object.freeze({
  wall_50: { type: 'flat-panel', widthCm: 50, label: 'Düz Panel 50' },
  wall_100: { type: 'flat-panel', widthCm: 100, label: 'Düz Panel 100' },
  wall_150: { type: 'flat-panel', widthCm: 150, label: 'Düz Panel 150' },
  wall_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' },

  wall_showcase_100_3: { type: 'showcase-3', widthCm: 100, label: '3 Gözlü Vitrin 100' },
  wall_showcase_100_2: { type: 'showcase-2', widthCm: 100, label: '2 Gözlü Vitrin 100' },
  wall_shelf_2_100: { type: 'shelf', widthCm: 100, shelfCount: 2, label: 'Raf 100 · 2 Raf' },
  wall_shelf_3_100: { type: 'shelf', widthCm: 100, shelfCount: 3, label: 'Raf 100 · 3 Raf' },
  wall_shelf_2_150: { type: 'shelf', widthCm: 150, shelfCount: 2, label: 'Raf 150 · 2 Raf' },
  wall_shelf_3_150: { type: 'shelf', widthCm: 150, shelfCount: 3, label: 'Raf 150 · 3 Raf' },
  wall_shelf_2_200: { type: 'shelf', widthCm: 200, shelfCount: 2, label: 'Raf 200 · 2 Raf' },
  wall_shelf_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },
  furniture_sofa_set_classic: { type: 'sofa-set', widthCm: 150, depthCm: 150, heightCm: 80, label: 'Koltuk Takımı' },
  furniture_table_chair_set_minyon: { type: 'table-chair-set', widthCm: 120, depthCm: 120, heightCm: 90, label: 'Masa Sandalye Takımı' },
  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },
  LED_FLOODLIGHT: { type: 'led-floodlight', widthCm: 50, depthCm: 20, heightCm: 35, label: 'LED Projektör' },
  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },

  desk_banko_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },
  desk_banko_100_L: { type: 'counter', shape: 'L', widthCm: 100, depthCm: 100, heightCm: 100, label: 'Köşe Banko 100×100' },
  desk_banko_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },
  desk_banko_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },
  BASE_100: { type: 'base', widthCm: 100, depthCm: 50, heightCm: 50, label: 'Baza 100' },
  BASE_150: { type: 'base', widthCm: 150, depthCm: 50, heightCm: 50, label: 'Baza 150' },
  BASE_200: { type: 'base', widthCm: 200, depthCm: 50, heightCm: 50, label: 'Baza 200' },
  wall_base_100: { type: 'base-wall', widthCm: 100, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 100' },
  wall_base_150: { type: 'base-wall', widthCm: 150, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 150' },
  wall_base_200: { type: 'base-wall', widthCm: 200, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 200' },
  wall_separator_100: { type: 'separator', widthCm: 100, label: 'Separatör 100' },
  wall_separator_50: { type: 'separator', widthCm: 50, label: 'Separatör 50' },
});

export const MODULE_CATALOG_KEYS = Object.freeze([
  'wall_200',
  'wall_150',
  'wall_100',
  'wall_50',
  'wall_separator_100',
  'wall_separator_50',
  'DOOR_100',
  'wall_showcase_100_3',
  'wall_showcase_100_2',
  'wall_shelf_3_200',
  'wall_shelf_2_200',
  'wall_shelf_3_150',
  'wall_shelf_2_150',
  'wall_shelf_3_100',
  'wall_shelf_2_100',
  'furniture_sofa_set_classic',
  'furniture_table_chair_set_minyon',
  'furniture_bar_stool_classic',
  'LED_FLOODLIGHT',
  'wall_base_200',
  'wall_base_150',
  'wall_base_100',
  'BASE_200',
  'BASE_150',
  'BASE_100',
  'desk_banko_200',
  'desk_banko_150',
  'desk_banko_100',
  'desk_banko_100_L',
]);

export function flatPanelKey(widthCm) {
  return `wall_${widthCm}`;
}