import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const anchor = `  scene.add(keyLight);\n\n  const outerFloor = new THREE.Mesh(`;
if (!source.includes(anchor)) throw new Error('scene3d light/floor anchor not found');

const environment = `  scene.add(keyLight);\n\n  // FAZ 4: lightweight 3D exhibition-hall environment. The stand and its platform\n  // remain real scene geometry; this group only supplies the surrounding hall.\n  const exhibitionHall = new THREE.Group();\n  exhibitionHall.name = 'exhibition-hall-environment';\n\n  const hallFloor = new THREE.Mesh(\n    new THREE.PlaneGeometry(140, 140),\n    new THREE.MeshStandardMaterial({ color: 0x777a7d, roughness: 0.82, metalness: 0.08 }),\n  );\n  hallFloor.rotation.x = -Math.PI / 2;\n  hallFloor.position.y = -0.012;\n  hallFloor.receiveShadow = true;\n  exhibitionHall.add(hallFloor);\n\n  // Curved inward-facing shell gives a continuous hall horizon while allowing a\n  // top camera to keep seeing the real floor instead of hitting a ceiling plane.\n  const hallShell = new THREE.Mesh(\n    new THREE.CylinderGeometry(68, 68, 18, 64, 1, true),\n    new THREE.MeshStandardMaterial({\n      color: 0x202428,\n      roughness: 0.96,\n      metalness: 0.04,\n      side: THREE.BackSide,\n    }),\n  );\n  hallShell.position.y = 9;\n  exhibitionHall.add(hallShell);\n\n  // Horizontal architectural bands break up the background like exhibition-hall\n  // wall panels. They are deliberately low-poly and cheap to render.\n  for (const y of [3.2, 6.2, 9.2]) {\n    const band = new THREE.Mesh(\n      new THREE.TorusGeometry(67.72, 0.055, 4, 64),\n      new THREE.MeshBasicMaterial({ color: 0x4b5156, toneMapped: false }),\n    );\n    band.rotation.x = Math.PI / 2;\n    band.position.y = y;\n    exhibitionHall.add(band);\n  }\n\n  // Suspended luminous strips suggest a fair-hall roof from normal/front views.\n  // They do not form a solid ceiling, so bird's-eye views still show the floor.\n  const ceilingLights = new THREE.Group();\n  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xdde6e8, toneMapped: false });\n  for (let row = -3; row <= 3; row += 1) {\n    for (let col = -4; col <= 4; col += 1) {\n      const strip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.035, 0.07), lightMaterial);\n      strip.position.set(col * 7.5, 11.8, row * 8.5);\n      ceilingLights.add(strip);\n    }\n  }\n  exhibitionHall.add(ceilingLights);\n  scene.add(exhibitionHall);\n\n  const outerFloor = new THREE.Mesh(`;
source = source.replace(anchor, environment);

const stageAnchor = `    const centerX = widthM / 2;\n    const centerZ = depthM / 2;`;
if (!source.includes(stageAnchor)) throw new Error('createStage center anchor not found');
source = source.replace(stageAnchor, `${stageAnchor}\n\n    // Keep the surrounding hall centered on the current stand, independent of stand size.\n    exhibitionHall.position.set(centerX, 0, centerZ);`);

fs.writeFileSync(path, source);
