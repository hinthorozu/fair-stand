import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const oldPixelRatio = `  const renderer = new THREE.WebGLRenderer({ antialias: true });\n  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));`;
const newPixelRatio = `  const renderer = new THREE.WebGLRenderer({ antialias: true });\n  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;\n  const editorPixelRatio = coarsePointer\n    ? Math.min(window.devicePixelRatio, 1)\n    : Math.min(window.devicePixelRatio, 1.5);\n  renderer.setPixelRatio(editorPixelRatio);`;

if (!source.includes(oldPixelRatio)) throw new Error('Renderer pixel-ratio block not found');
source = source.replace(oldPixelRatio, newPixelRatio);

const oldShadow = `  keyLight.shadow.mapSize.set(4096, 4096);`;
const newShadow = `  // 2K is visually sufficient for the editor and cuts the directional shadow map\n  // memory/fill cost to one quarter of the previous 4K allocation.\n  keyLight.shadow.mapSize.set(2048, 2048);`;
if (!source.includes(oldShadow)) throw new Error('Shadow-map size block not found');
source = source.replace(oldShadow, newShadow);

const oldLoop = `  renderer.setAnimationLoop(() => {\n    controls.update();\n    viewCube.update();\n    renderer.render(scene, camera);\n  });`;
const newLoop = `  // Keep interaction smooth, but do not burn the GPU rendering a static editor at\n  // monitor refresh rate. OrbitControls reports camera movement; while idle we only\n  // refresh occasionally so asynchronous texture/material updates still appear quickly.\n  const activeFrameIntervalMs = coarsePointer ? (1000 / 30) : (1000 / 50);\n  const idleFrameIntervalMs = 250;\n  let lastRenderAt = -Infinity;\n  const lastCubePosition = new THREE.Vector3(Number.NaN, Number.NaN, Number.NaN);\n  const lastCubeQuaternion = new THREE.Quaternion(Number.NaN, Number.NaN, Number.NaN, Number.NaN);\n\n  renderer.setAnimationLoop((now) => {\n    const controlsChanged = Boolean(controls.update());\n    const activelyDragging = Boolean(dragSession?.dragging);\n    const frameInterval = (controlsChanged || activelyDragging)\n      ? activeFrameIntervalMs\n      : idleFrameIntervalMs;\n    if (now - lastRenderAt < frameInterval) return;\n    lastRenderAt = now;\n\n    const cameraChanged = !camera.position.equals(lastCubePosition)\n      || !camera.quaternion.equals(lastCubeQuaternion);\n    if (cameraChanged) {\n      viewCube.update();\n      lastCubePosition.copy(camera.position);\n      lastCubeQuaternion.copy(camera.quaternion);\n    }\n    renderer.render(scene, camera);\n  });`;
if (!source.includes(oldLoop)) throw new Error('Animation loop block not found');
source = source.replace(oldLoop, newLoop);

fs.writeFileSync(path, source);
