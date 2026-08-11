import fs from 'node:fs';

const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');

function replaceOnce(oldText, newText) {
  if (s.includes(newText)) return;
  if (!s.includes(oldText)) throw new Error(`Anchor not found:\n${oldText.slice(0, 180)}`);
  s = s.replace(oldText, newText);
}

replaceOnce(
  `const STAGE_SURROUND_M = 1;\nconst SELECTION_COLOR = 0x2563eb;`,
  `const STAGE_SURROUND_M = 1;\n// Aktif stand zemini fuar salonu zemininden 5 cm yukarıda duran platformdur.\nconst ACTIVE_PLATFORM_HEIGHT_M = 0.05;\nconst SELECTION_COLOR = 0x2563eb;`,
);

replaceOnce(
`  const activeFloor = new THREE.Mesh(\n    new THREE.PlaneGeometry(1, 1),\n    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.92 }),\n  );\n  activeFloor.rotation.x = -Math.PI / 2;\n  activeFloor.receiveShadow = true;\n  activeFloor.visible = false;\n  scene.add(activeFloor);`,
`  const activeFloor = new THREE.Mesh(\n    new THREE.BoxGeometry(1, ACTIVE_PLATFORM_HEIGHT_M, 1),\n    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.92 }),\n  );\n  activeFloor.receiveShadow = true;\n  activeFloor.castShadow = true;\n  activeFloor.visible = false;\n  scene.add(activeFloor);`,
);

replaceOnce(
`      0, 0.008, 0, widthM, 0.008, 0,\n      widthM, 0.008, 0, widthM, 0.008, depthM,\n      widthM, 0.008, depthM, 0, 0.008, depthM,\n      0, 0.008, depthM, 0, 0.008, 0,`,
`      0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0, widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0,\n      widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0, widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM,\n      widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM, 0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM,\n      0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM, 0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0,`,
);

replaceOnce(
`        guide.position.set(widthM / 2, 0.02, 0);\n      } else if (wallId === 'left') {\n        guide.position.set(0, 0.02, depthM / 2);\n      } else {\n        guide.position.set(widthM, 0.02, depthM / 2);`,
`        guide.position.set(widthM / 2, ACTIVE_PLATFORM_HEIGHT_M + 0.02, 0);\n      } else if (wallId === 'left') {\n        guide.position.set(0, ACTIVE_PLATFORM_HEIGHT_M + 0.02, depthM / 2);\n      } else {\n        guide.position.set(widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.02, depthM / 2);`,
);

replaceOnce(
`    activeFloor.scale.set(widthM, depthM, 1);\n    activeFloor.position.set(centerX, 0.002, centerZ);`,
`    activeFloor.scale.set(widthM, 1, depthM);\n    activeFloor.position.set(centerX, ACTIVE_PLATFORM_HEIGHT_M / 2, centerZ);`,
);

replaceOnce(
`  const wallRoot = new THREE.Group();\n  wallRoot.position.set(0, 0, 0);`,
`  const wallRoot = new THREE.Group();\n  // Duvarlar ve tüm stand modülleri platformun üst kotundan başlar.\n  wallRoot.position.set(0, ACTIVE_PLATFORM_HEIGHT_M, 0);`,
);

fs.writeFileSync(path, s);

const testPath = 'test/raisedPlatform.test.js';
if (!fs.existsSync(testPath)) {
  fs.writeFileSync(testPath, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\n\ntest('aktif stand platformu 5 cm yükseltilir ve wallRoot aynı kota taşınır', () => {\n  const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(scene, /const ACTIVE_PLATFORM_HEIGHT_M = 0\\.05;/);\n  assert.match(scene, /new THREE\\.BoxGeometry\\(1, ACTIVE_PLATFORM_HEIGHT_M, 1\\)/);\n  assert.match(scene, /activeFloor\\.position\\.set\\(centerX, ACTIVE_PLATFORM_HEIGHT_M \\/ 2, centerZ\\)/);\n  assert.match(scene, /wallRoot\\.position\\.set\\(0, ACTIVE_PLATFORM_HEIGHT_M, 0\\)/);\n});\n`);
}
