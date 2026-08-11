import fs from 'node:fs';

// Render quality integration trigger.
// Fix Render button clickability without blocking scene interactions.
{
  const path = 'src/style.css';
  let source = fs.readFileSync(path, 'utf8');
  source = source.replace(
    '.viewport-render-button { margin-left: auto; white-space: nowrap; font-weight: 700; }',
    '.viewport-render-button { margin-left: auto; white-space: nowrap; font-weight: 700; pointer-events: auto; }',
  );
  fs.writeFileSync(path, source);
}

// Improve Three.js color management and current-view capture quality.
{
  const path = 'src/scene3d.js';
  let source = fs.readFileSync(path, 'utf8');

  source = source.replace(
    "  renderer.shadowMap.enabled = true;\n  renderer.shadowMap.type = THREE.PCFSoftShadowMap;",
    "  renderer.outputColorSpace = THREE.SRGBColorSpace;\n  renderer.toneMapping = THREE.ACESFilmicToneMapping;\n  renderer.toneMappingExposure = 1.08;\n  renderer.shadowMap.enabled = true;\n  renderer.shadowMap.type = THREE.PCFSoftShadowMap;",
  );

  source = source.replace(
    '  keyLight.shadow.mapSize.set(2048, 2048);',
    '  keyLight.shadow.mapSize.set(4096, 4096);',
  );

  source = source.replace(
    '  async function captureCurrentViewPng({ scale = 2 } = {}) {',
    '  async function captureCurrentViewPng({ scale = 3 } = {}) {',
  );

  source = source.replace(
    '    const safeScale = Math.min(3, Math.max(1, Number(scale) || 2));',
    '    const safeScale = Math.min(3, Math.max(1, Number(scale) || 3));',
  );

  fs.writeFileSync(path, source);
}

// Use 3x supersampling from the UI action.
{
  const path = 'src/main.js';
  let source = fs.readFileSync(path, 'utf8');
  source = source.replace(
    'const result = await scene3d.captureCurrentViewPng({ scale: 2 });',
    'const result = await scene3d.captureCurrentViewPng({ scale: 3 });',
  );
  fs.writeFileSync(path, source);
}
