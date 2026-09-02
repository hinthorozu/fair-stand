const fs = require('fs');
const p = 'src/scene3d.js';
let s = fs.readFileSync(p, 'utf8');

const importNeedle = "import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';\n";
if (!s.includes(importNeedle)) throw new Error('SVGLoader import not found');
s = s.replace(importNeedle, importNeedle +
  "import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';\n" +
  "import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';\n" +
  "import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';\n");

const rendererNeedle = "  container.appendChild(renderer.domElement);\n";
if (!s.includes(rendererNeedle)) throw new Error('renderer append not found');
s = s.replace(rendererNeedle, rendererNeedle + `\n  const composer = new EffectComposer(renderer);\n  const renderPass = new RenderPass(scene, camera);\n  composer.addPass(renderPass);\n  const foamBloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.15, 0.62, 1.05);\n  foamBloomPass.threshold = 1.05;\n  foamBloomPass.strength = 1.15;\n  foamBloomPass.radius = 0.62;\n  composer.addPass(foamBloomPass);\n`);

const loopRender = `    renderer.render(scene, camera);\n  });\n\n  async function captureCurrentViewPng`;
const loopBloom = `    renderPass.camera = camera;\n    composer.render();\n  });\n\n  async function captureCurrentViewPng`;
if (!s.includes(loopRender)) throw new Error('editor animation render not found');
s = s.replace(loopRender, loopBloom);

const resizeNeedle = `    renderer.setSize(width, height, false);\n    updateCameraProjection(width, height);`;
const resizeBloom = `    renderer.setSize(width, height, false);\n    composer.setSize(width, height);\n    updateCameraProjection(width, height);`;
if (!s.includes(resizeNeedle)) throw new Error('editor resize block not found');
s = s.replace(resizeNeedle, resizeBloom);

const haloMaterialOld = `            new THREE.MeshBasicMaterial({\n              color: 0xffffff,\n              transparent: true,\n              opacity: 0.58,\n              depthWrite: false,\n              toneMapped: false,\n              blending: THREE.AdditiveBlending,\n            }),`;
const haloMaterialNew = `            new THREE.MeshBasicMaterial({\n              color: new THREE.Color().setRGB(4.0, 4.0, 4.0),\n              transparent: true,\n              opacity: 0.72,\n              depthWrite: false,\n              toneMapped: false,\n              blending: THREE.AdditiveBlending,\n            }),`;
if (!s.includes(haloMaterialOld)) throw new Error('halo material block not found');
s = s.replace(haloMaterialOld, haloMaterialNew);

fs.writeFileSync(p, s);
