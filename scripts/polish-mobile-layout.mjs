import fs from 'node:fs';

const stylePath = 'src/style.css';
const scenePath = 'src/scene3d.js';

let style = fs.readFileSync(stylePath, 'utf8');
let scene = fs.readFileSync(scenePath, 'utf8');

if (!scene.includes("projectionControl.className = 'projection-control';")) {
  scene = scene.replace(
    "  const projectionControl = document.createElement('div');\n  projectionControl.setAttribute('aria-label', 'Kamera projeksiyonu');",
    "  const projectionControl = document.createElement('div');\n  projectionControl.className = 'projection-control';\n  projectionControl.setAttribute('aria-label', 'Kamera projeksiyonu');",
  );
}

const marker = '/* Mobile editor layout polish */';
if (!style.includes(marker)) {
  style += `\n\n${marker}\n@media (max-width: 680px) {\n  body {\n    min-height: 100dvh;\n    overflow: hidden;\n  }\n\n  #app {\n    grid-template-columns: 1fr;\n    grid-template-rows: minmax(360px, 62dvh) minmax(0, 38dvh);\n    width: 100vw;\n    height: 100dvh;\n    min-height: 0;\n    overflow: hidden;\n  }\n\n  .viewport-wrap {\n    grid-row: 1;\n    min-height: 0;\n    overflow: hidden;\n    border-bottom: 1px solid #d9dee5;\n  }\n\n  #viewport {\n    min-height: 0;\n  }\n\n  .sidebar {\n    grid-row: 2;\n    min-height: 0;\n    overflow-y: auto;\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n    padding: 10px 12px calc(18px + env(safe-area-inset-bottom));\n    gap: 8px;\n    border: 0;\n    box-shadow: none;\n    background: rgba(250, 251, 252, 0.99);\n  }\n\n  .sidebar-intro {\n    display: none;\n  }\n\n  .panel-card {\n    padding: 10px 11px;\n    border-radius: 11px;\n  }\n\n  .panel-summary {\n    min-height: 28px;\n    font-size: 13px;\n  }\n\n  .panel-card-content {\n    gap: 7px;\n  }\n\n  .viewport-toolbar {\n    top: 8px;\n    left: 8px;\n    right: auto;\n    padding: 6px;\n    border-radius: 10px;\n    background: rgba(17, 24, 39, 0.72);\n  }\n\n  .viewport-render-button {\n    min-height: 34px;\n    margin: 0;\n    padding: 7px 10px;\n    border-radius: 8px;\n    font-size: 11px;\n  }\n\n  .view-cube {\n    top: 8px;\n    right: 8px;\n    width: 88px;\n    gap: 2px;\n    padding: 4px;\n    transform: none;\n    border-radius: 10px;\n    background: rgba(255,255,255,.9);\n  }\n\n  .view-cube-canvas,\n  .view-cube-canvas canvas {\n    width: 78px !important;\n    height: 78px !important;\n  }\n\n  .view-cube-home {\n    width: 34px;\n    height: 30px;\n    min-height: 30px;\n  }\n\n  .projection-control {\n    right: 8px !important;\n    bottom: 8px !important;\n    gap: 3px !important;\n    padding: 3px !important;\n    border-radius: 8px !important;\n    background: rgba(255,255,255,.92) !important;\n  }\n\n  .projection-control button {\n    min-height: 34px !important;\n    height: 34px !important;\n    padding: 0 10px !important;\n    font-size: 11px !important;\n  }\n\n  .stand-type-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 6px;\n  }\n\n  .stand-type-card {\n    min-height: 44px;\n    padding: 7px 6px;\n  }\n\n  .stand-type-thumb {\n    height: 38px;\n  }\n\n  .project-actions {\n    gap: 6px;\n  }\n\n  button {\n    min-height: 42px;\n  }\n\n  .module-picker-backdrop {\n    align-items: end;\n    padding: 0;\n  }\n\n  .module-picker {\n    width: 100%;\n    max-height: 82dvh;\n    padding: 14px 12px calc(16px + env(safe-area-inset-bottom));\n    border-radius: 16px 16px 0 0;\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0;\n  }\n\n  .module-catalog-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 8px;\n    margin-top: 12px;\n  }\n\n  .module-catalog-card {\n    min-height: 168px;\n    gap: 8px;\n    padding: 8px;\n  }\n\n  .module-card-preview {\n    min-height: 112px;\n    padding: 6px;\n  }\n\n  .module-context-menu {\n    width: min(260px, calc(100vw - 20px));\n  }\n}\n\n@media (max-width: 420px) {\n  #app {\n    grid-template-rows: minmax(340px, 60dvh) minmax(0, 40dvh);\n  }\n\n  .view-cube {\n    width: 82px;\n  }\n\n  .view-cube-canvas,\n  .view-cube-canvas canvas {\n    width: 72px !important;\n    height: 72px !important;\n  }\n\n  .projection-control button {\n    padding: 0 8px !important;\n  }\n}\n`;
}

if (!scene.includes("projectionControl.className = 'projection-control';")) {
  throw new Error('Projection control class could not be added');
}
if (!style.includes(marker)) {
  throw new Error('Mobile layout CSS could not be appended');
}

fs.writeFileSync(scenePath, scene);
fs.writeFileSync(stylePath, style);
