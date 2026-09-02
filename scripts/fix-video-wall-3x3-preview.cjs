const fs = require('fs');
const path = 'src/moduleDragSidebar.js';
let s = fs.readFileSync(path, 'utf8');

const cssNeedle = `    .module-drag-tv.is-video-wall::after { display:none; }\n`;
if (!s.includes(cssNeedle)) throw new Error('Video wall CSS insertion point not found');
const cssPatch = `    .module-drag-tv.is-video-wall::after { display:none; }\n    .module-drag-tv.is-video-wall.is-video-wall-3x3::before { background:linear-gradient(to right,transparent calc(33.333% - 1px),#111 33.333%,transparent calc(33.333% + 1px),transparent calc(66.667% - 1px),#111 66.667%,transparent calc(66.667% + 1px)),linear-gradient(to bottom,transparent calc(33.333% - 1px),#111 33.333%,transparent calc(33.333% + 1px),transparent calc(66.667% - 1px),#111 66.667%,transparent calc(66.667% + 1px)),#dbeafe; }\n`;
s = s.replace(cssNeedle, cssPatch);

const jsNeedle = `    if (Number(module.videoWallRows) > 1 || Number(module.videoWallCols) > 1) body.classList.add('is-video-wall');\n`;
if (!s.includes(jsNeedle)) throw new Error('Video wall preview JS insertion point not found');
const jsPatch = `    if (Number(module.videoWallRows) > 1 || Number(module.videoWallCols) > 1) body.classList.add('is-video-wall');\n    if (Number(module.videoWallRows) === 3 && Number(module.videoWallCols) === 3) body.classList.add('is-video-wall-3x3');\n`;
s = s.replace(jsNeedle, jsPatch);

fs.writeFileSync(path, s);
