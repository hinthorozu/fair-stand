const fs = require('fs');
const path = 'src/catalog.js';
let s = fs.readFileSync(path, 'utf8');

const old2x2 = `  VIDEO_WALL_2X2: Object.freeze({\n    ...createTvCatalogItem(TV_55_DEFINITION),\n    widthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    heightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    screenWidthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    screenHeightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    panelScreenWidthCm: TV_55_DEFINITION.screenWidthCm,\n    panelScreenHeightCm: TV_55_DEFINITION.screenHeightCm,\n    videoWallRows: 2,\n    videoWallCols: 2,\n    label: 'Video Wall 2×2 · 4×55\\"',\n  }),`;

const newWalls = `  VIDEO_WALL_2X2: Object.freeze({\n    ...createTvCatalogItem(TV_55_DEFINITION),\n    widthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    heightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    screenWidthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    screenHeightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    panelScreenWidthCm: TV_55_DEFINITION.screenWidthCm,\n    panelScreenHeightCm: TV_55_DEFINITION.screenHeightCm,\n    videoWallRows: 2,\n    videoWallCols: 2,\n    label: 'Video Wall 2×2',\n  }),\n  VIDEO_WALL_3X3: Object.freeze({\n    ...createTvCatalogItem(TV_55_DEFINITION),\n    widthCm: TV_55_DEFINITION.screenWidthCm * 3,\n    heightCm: TV_55_DEFINITION.screenHeightCm * 3,\n    screenWidthCm: TV_55_DEFINITION.screenWidthCm * 3,\n    screenHeightCm: TV_55_DEFINITION.screenHeightCm * 3,\n    panelScreenWidthCm: TV_55_DEFINITION.screenWidthCm,\n    panelScreenHeightCm: TV_55_DEFINITION.screenHeightCm,\n    videoWallRows: 3,\n    videoWallCols: 3,\n    label: 'Video Wall 3×3',\n  }),`;

if (!s.includes(old2x2)) throw new Error('2x2 catalog block not found');
s = s.replace(old2x2, newWalls);

const oldKeys = `  'TV_55',\n  'VIDEO_WALL_2X2',\n  'TV_65',`;
const newKeys = `  'TV_55',\n  'VIDEO_WALL_2X2',\n  'VIDEO_WALL_3X3',\n  'TV_65',`;
if (!s.includes(oldKeys)) throw new Error('catalog keys block not found');
s = s.replace(oldKeys, newKeys);

const oldGroup = `keys: Object.freeze(['TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'TV_65', 'LED_FLOODLIGHT'])`;
const newGroup = `keys: Object.freeze(['TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'VIDEO_WALL_3X3', 'TV_65', 'LED_FLOODLIGHT'])`;
if (!s.includes(oldGroup)) throw new Error('electronics group not found');
s = s.replace(oldGroup, newGroup);

fs.writeFileSync(path, s);
