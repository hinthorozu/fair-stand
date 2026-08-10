export const STAND_DIMENSIONS = Object.freeze({
  height: 3.5,
  depth: 0.1,
  stripCount: 7,
  stripHeight: 0.5,
  frameWidth: 0.055,
  frameDepth: 0.11,
});

export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);

export const MODULE_CATALOG = Object.freeze({
  PANEL_50: { type: 'flat-panel', widthCm: 50, label: 'Düz Panel 50' },
  PANEL_100: { type: 'flat-panel', widthCm: 100, label: 'Düz Panel 100' },
  PANEL_150: { type: 'flat-panel', widthCm: 150, label: 'Düz Panel 150' },
  PANEL_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' },

  // Sonraki milestone için katalogda şimdiden yer ayırıyoruz.
  SHOWCASE_3_100: { type: 'showcase-3', widthCm: 100, label: '3 Raflı Vitrin 100' },
  SHOWCASE_2_100: { type: 'showcase-2', widthCm: 100, label: '2 Raflı Vitrin 100' },
  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },
  SEPARATOR_100: { type: 'separator', widthCm: 100, label: 'Separatör 100' },
  SEPARATOR_50: { type: 'separator', widthCm: 50, label: 'Separatör 50' },
});

export function flatPanelKey(widthCm) {
  return `PANEL_${widthCm}`;
}
