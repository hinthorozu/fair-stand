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
s = s.replace(rendererNeedle, rendererNeedle + `\n  const composer = new EffectComposer(renderer);\n  composer.addPass(new RenderPass(scene, camera));\n  const foamBloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.25, 0.58, 1.05);\n  foamBloomPass.threshold = 1.05;\n  foamBloomPass.strength = 1.25;\n  foamBloomPass.radius = 0.58;\n  composer.addPass(foamBloomPass);\n`);

const renderMatches = s.match(/renderer\.render\(scene, camera\);/g) || [];
if (renderMatches.length !== 1) throw new Error(`expected one renderer.render, found ${renderMatches.length}`);
s = s.replace('renderer.render(scene, camera);', 'composer.render();');

const sizeRegex = /renderer\.setSize\(([^;]+)\);/g;
let sizeCount = 0;
s = s.replace(sizeRegex, (match, args) => {
  sizeCount += 1;
  return `${match}\n    composer.setSize(${args});`;
});
if (!sizeCount) throw new Error('renderer.setSize not found');

const haloMaterialOld = `            new THREE.MeshBasicMaterial({\n              color: 0xffffff,\n              transparent: true,\n              opacity: 0.58,\n              depthWrite: false,\n              toneMapped: false,\n              blending: THREE.AdditiveBlending,\n            }),`;
const haloMaterialNew = `            new THREE.MeshBasicMaterial({\n              color: new THREE.Color().setRGB(4.0, 4.0, 4.0),\n              transparent: true,\n              opacity: 0.72,\n              depthWrite: false,\n              toneMapped: false,\n              blending: THREE.AdditiveBlending,\n            }),`;
if (!s.includes(haloMaterialOld)) throw new Error('halo material block not found');
s = s.replace(haloMaterialOld, haloMaterialNew);

fs.writeFileSync(p, s);
