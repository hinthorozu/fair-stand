const fs = require('fs');
const path = 'src/catalog.js';
let s = fs.readFileSync(path, 'utf8');
const start = s.indexOf('  VIDEO_WALL_2X2: Object.freeze({');
const end = s.indexOf('  TV_65: createTvCatalogItem', start);
if (start < 0 || end < 0) throw new Error('Video wall catalog blocks not found');
const block = `  VIDEO_WALL_2X2: Object.freeze({
    ...createTvCatalogItem(TV_55_DEFINITION),
    widthCm: 108.5 * 2,
    heightCm: 61 * 2,
    screenWidthCm: 108.5 * 2,
    screenHeightCm: 61 * 2,
    panelScreenWidthCm: 108.5,
    panelScreenHeightCm: 61,
    videoWallRows: 2,
    videoWallCols: 2,
    label: 'Video Wall 2×2',
  }),
  VIDEO_WALL_3X3: Object.freeze({
    ...createTvCatalogItem(TV_55_DEFINITION),
    widthCm: 108.5 * 3,
    heightCm: 61 * 3,
    screenWidthCm: 108.5 * 3,
    screenHeightCm: 61 * 3,
    panelScreenWidthCm: 108.5,
    panelScreenHeightCm: 61,
    videoWallRows: 3,
    videoWallCols: 3,
    label: 'Video Wall 3×3',
  }),
`;
s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(path, s);
