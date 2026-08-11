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
  projectionCm: 30,
  thicknessCm: 3,
  widthsCm: Object.freeze([100, 150, 200]),
  heightsByCountCm: Object.freeze({
    2: Object.freeze([100, 150]),
    3: Object.freeze([100, 150, 200]),
  }),
});

export const SOFA_SET_DIMENSIONS = Object.freeze({
  widthCm: 250,
  depthCm: 250,
  heightCm: 80,
  loveseatWidthCm: 160,
  chairWidthCm: 65,
  tableDiameterCm: 60,
});

export const MODULE_CATALOG = Object.freeze({
  PANEL_50: { type: 'flat-panel', widthCm: 50, label: 'Düz Panel 50' },
  PANEL_100: { type: 'flat-panel', widthCm: 100, label: 'Düz Panel 100' },
  PANEL_150: { type: 'flat-panel', widthCm: 150, label: 'Düz Panel 150' },
  PANEL_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' },

  SHOWCASE_3_100: { type: 'showcase-3', widthCm: 100, label: '3 Gözlü Vitrin 100' },
  SHOWCASE_2_100: { type: 'showcase-2', widthCm: 100, label: '2 Gözlü Vitrin 100' },
  SHELF_2_100: { type: 'shelf', widthCm: 100, shelfCount: 2, label: 'Raf 100 · 2 Raf' },
  SHELF_3_100: { type: 'shelf', widthCm: 100, shelfCount: 3, label: 'Raf 100 · 3 Raf' },
  SHELF_2_150: { type: 'shelf', widthCm: 150, shelfCount: 2, label: 'Raf 150 · 2 Raf' },
  SHELF_3_150: { type: 'shelf', widthCm: 150, shelfCount: 3, label: 'Raf 150 · 3 Raf' },
  SHELF_2_200: { type: 'shelf', widthCm: 200, shelfCount: 2, label: 'Raf 200 · 2 Raf' },
  SHELF_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },
  SOFA_SET: { type: 'sofa-set', widthCm: 250, depthCm: 250, heightCm: 80, label: 'Koltuk Takımı' },
  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },

  COUNTER_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },
  COUNTER_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },
  COUNTER_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },
  BASE_100: { type: 'base', widthCm: 100, depthCm: 50, heightCm: 50, label: 'Baza 100' },
  BASE_150: { type: 'base', widthCm: 150, depthCm: 50, heightCm: 50, label: 'Baza 150' },
  BASE_200: { type: 'base', widthCm: 200, depthCm: 50, heightCm: 50, label: 'Baza 200' },
  SEPARATOR_100: { type: 'separator', widthCm: 100, label: 'Separatör 100' },
  SEPARATOR_50: { type: 'separator', widthCm: 50, label: 'Separatör 50' },
});

export function flatPanelKey(widthCm) {
  return `PANEL_${widthCm}`;
}
