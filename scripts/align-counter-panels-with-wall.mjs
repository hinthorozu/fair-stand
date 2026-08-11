import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');
const start = source.indexOf('function createCounterModule(');
const end = source.indexOf('\nfunction createShelfModule(', start);
if (start < 0 || end < 0) throw new Error('createCounterModule block not found');

let block = source.slice(start, end);

block = block.replace(
  "  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 5);\n  const panelHeightM = Math.max((frameHeightM - profileM * 3) / 2, 0.05);\n  const frontPanelWidthM = Math.max(widthM - profileM * 2, 0.05);\n  const sidePanelWidthM = Math.max(depthM - profileM * 2, 0.05);",
  "  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);\n  // Banko panel aralıkları duvar panel sistemiyle birebir aynı mantığı kullanır.\n  const railHeightM = PANEL_RAIL_HEIGHT_M;\n  const stripHeightM = frameHeightM / 2;\n  const panelHeightM = Math.max(\n    stripHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M,\n    0.05,\n  );\n  const frontPanelWidthM = Math.max(widthM - profileM * 2 - 0.012, 0.05);\n  const sidePanelWidthM = Math.max(depthM - profileM * 2 - 0.012, 0.05);"
);

block = block.replace(
  "  // Bottom, middle and top rails create two stacked panel openings.\n  const railYs = [profileM / 2, frameHeightM / 2, frameHeightM - profileM / 2];\n  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM);",
  "  // Duvar modülündeki gibi 4 mm yatay raylar: alt, orta ve üst.\n  const railYs = [0, stripHeightM, frameHeightM];\n  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);\n  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, railHeightM, frameDepthM);"
);

block = block.replace(
  "      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),",
  "      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),"
);

block = block.replace(
  "  const sideRailGeometry = new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM);",
  "  const sideRailGeometry = new THREE.BoxGeometry(frameDepthM, railHeightM, sidePanelWidthM);"
);

block = block.replace(
  "  const lowerY = profileM + panelHeightM / 2;\n  const upperY = frameHeightM - profileM - panelHeightM / 2;",
  "  const lowerY = stripHeightM / 2;\n  const upperY = stripHeightM + stripHeightM / 2;"
);

if (block.includes('profileM * 5')) throw new Error('old counter panel height formula remains');
if (block.includes('new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM)')) throw new Error('old 4 cm front rail remains');
if (block.includes('new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM)')) throw new Error('old 4 cm side rail remains');

source = source.slice(0, start) + block + source.slice(end);
fs.writeFileSync(path, source);
