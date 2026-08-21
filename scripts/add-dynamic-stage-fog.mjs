import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const fogAnchor = `  scene.background = new THREE.Color(0x5f6265);\n  scene.fog = new THREE.Fog(0x5f6265, 55, 90);`;
const fogReplacement = `  scene.background = new THREE.Color(0x5f6265);\n  scene.fog = new THREE.Fog(0x5f6265, 55, 90);\n\n  // Keep atmospheric depth outside the editable stand. Fog distances are updated only\n  // when the stage size changes, so this adds no per-frame CPU work or extra draw calls.\n  function updateStageFog(widthM, depthM) {\n    const diagonalM = Math.hypot(Number(widthM) || 0, Number(depthM) || 0);\n    const near = Math.max(55, diagonalM * 1.25 + 18);\n    const far = Math.max(90, near + Math.max(35, diagonalM * 0.8));\n    scene.fog.near = near;\n    scene.fog.far = far;\n  }`;

if (!scene.includes('function updateStageFog(widthM, depthM)')) {
  if (!scene.includes(fogAnchor)) throw new Error('fog anchor not found');
  scene = scene.replace(fogAnchor, fogReplacement);
}

const stageAnchor = `    if (!Number.isFinite(widthM) || !Number.isFinite(depthM) || widthM <= 0 || depthM <= 0) {\n      return { ok: false, message: 'Geçerli bir X ve Y ölçüsü gerekli.' };\n    }\n\n    disposeWall();`;
const stageReplacement = `    if (!Number.isFinite(widthM) || !Number.isFinite(depthM) || widthM <= 0 || depthM <= 0) {\n      return { ok: false, message: 'Geçerli bir X ve Y ölçüsü gerekli.' };\n    }\n\n    updateStageFog(widthM, depthM);\n\n    disposeWall();`;

if (!scene.includes('    updateStageFog(widthM, depthM);')) {
  if (!scene.includes(stageAnchor)) throw new Error('createStage anchor not found');
  scene = scene.replace(stageAnchor, stageReplacement);
}

fs.writeFileSync(scenePath, scene);
