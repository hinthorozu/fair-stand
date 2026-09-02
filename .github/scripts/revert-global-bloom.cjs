const fs = require('fs');
const p = 'src/scene3d.js';
let s = fs.readFileSync(p, 'utf8');

for (const line of [
  "import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';\n",
  "import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';\n",
  "import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';\n",
]) s = s.replace(line, '');

const composerBlock = `  const composer = new EffectComposer(renderer);\n  const renderPass = new RenderPass(scene, camera);\n  composer.addPass(renderPass);\n  const foamBloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.15, 0.62, 1.05);\n  foamBloomPass.threshold = 1.05;\n  foamBloomPass.strength = 1.15;\n  foamBloomPass.radius = 0.62;\n  composer.addPass(foamBloomPass);\n\n`;
s = s.replace(composerBlock, '');
s = s.replace('    composer.setSize(width, height);\n', '');
s = s.replace('    renderPass.camera = camera;\n    composer.render();', '    renderer.render(scene, camera);');
s = s.replace('color: new THREE.Color().setRGB(4.0, 4.0, 4.0),', 'color: 0xffffff,');
s = s.replace('opacity: 0.72,', 'opacity: 0.58,');

if (s.includes('EffectComposer') || s.includes('UnrealBloomPass') || s.includes('composer.render()')) throw new Error('global bloom remnants remain');
fs.writeFileSync(p, s);
