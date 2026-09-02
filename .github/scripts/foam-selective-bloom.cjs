const fs = require('fs');
const p = 'src/scene3d.js';
let s = fs.readFileSync(p, 'utf8');

const importNeedle = "import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';\n";
if (!s.includes(importNeedle)) throw new Error('SVGLoader import not found');
s = s.replace(importNeedle, importNeedle +
  "import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';\n" +
  "import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';\n" +
  "import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';\n" +
  "import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';\n");

const rendererNeedle = "  container.appendChild(renderer.domElement);\n";
if (!s.includes(rendererNeedle)) throw new Error('renderer append not found');
const composerBlock = `\n  const FOAM_BLOOM_LAYER = 1;\n  const bloomRenderPass = new RenderPass(scene, camera);\n  const foamBloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.35, 0.68, 1.0);\n  foamBloomPass.threshold = 1.0;\n  foamBloomPass.strength = 1.35;\n  foamBloomPass.radius = 0.68;\n  const bloomComposer = new EffectComposer(renderer);\n  bloomComposer.renderToScreen = false;\n  bloomComposer.setPixelRatio(Math.min(editorPixelRatio, 0.75));\n  bloomComposer.addPass(bloomRenderPass);\n  bloomComposer.addPass(foamBloomPass);\n\n  const finalRenderPass = new RenderPass(scene, camera);\n  const finalPass = new ShaderPass(\n    new THREE.ShaderMaterial({\n      uniforms: {\n        baseTexture: { value: null },\n        bloomTexture: { value: bloomComposer.renderTarget2.texture },\n      },\n      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',\n      fragmentShader: 'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main(){ gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv); }',\n    }),\n    'baseTexture',\n  );\n  const finalComposer = new EffectComposer(renderer);\n  finalComposer.addPass(finalRenderPass);\n  finalComposer.addPass(finalPass);\n`;
s = s.replace(rendererNeedle, rendererNeedle + composerBlock);

const resizeNeedle = `    renderer.setSize(width, height, false);\n    updateCameraProjection(width, height);`;
const resizeNew = `    renderer.setSize(width, height, false);\n    bloomComposer.setSize(width, height);\n    finalComposer.setSize(width, height);\n    updateCameraProjection(width, height);`;
if (!s.includes(resizeNeedle)) throw new Error('resize block not found');
s = s.replace(resizeNeedle, resizeNew);

const loopNeedle = `    renderer.render(scene, camera);\n  });\n\n  async function captureCurrentViewPng`;
const loopNew = `    const previousLayerMask = camera.layers.mask;\n    camera.layers.set(FOAM_BLOOM_LAYER);\n    bloomRenderPass.camera = camera;\n    bloomComposer.render();\n    camera.layers.set(0);\n    finalRenderPass.camera = camera;\n    finalComposer.render();\n    camera.layers.mask = previousLayerMask;\n  });\n\n  async function captureCurrentViewPng`;
if (!s.includes(loopNeedle)) throw new Error('editor render loop not found');
s = s.replace(loopNeedle, loopNew);

const groupNeedle = "      const raw = new THREE.Group();\n      const haloShapeGroup = new THREE.Group();\n      let meshCount = 0;";
const groupNew = "      const raw = new THREE.Group();\n      const haloContourGroup = new THREE.Group();\n      let meshCount = 0;";
if (!s.includes(groupNeedle)) throw new Error('halo group block not found');
s = s.replace(groupNeedle, groupNew);

const haloMeshBlock = `          const haloMesh = new THREE.Mesh(\n            new THREE.ShapeGeometry(shape, 8),\n            new THREE.MeshBasicMaterial({\n              color: 0xffffff,\n              transparent: true,\n              opacity: 0.58,\n              depthWrite: false,\n              toneMapped: false,\n              blending: THREE.AdditiveBlending,\n            }),\n          );\n          haloShapeGroup.add(haloMesh);`;
const haloContourBlock = `          const addHaloContour = (points) => {\n            if (!points || points.length < 2) return;\n            const geometry = new THREE.BufferGeometry().setFromPoints(\n              points.map((point) => new THREE.Vector3(point.x, point.y, 0)),\n            );\n            const line = new THREE.LineLoop(\n              geometry,\n              new THREE.LineBasicMaterial({\n                color: new THREE.Color().setRGB(5.0, 5.0, 5.0),\n                toneMapped: false,\n                transparent: false,\n                depthWrite: false,\n              }),\n            );\n            line.layers.set(1);\n            haloContourGroup.add(line);\n          };\n          addHaloContour(shape.getSpacedPoints(72));\n          shape.holes.forEach((hole) => addHaloContour(hole.getSpacedPoints(40)));`;
if (!s.includes(haloMeshBlock)) throw new Error('old halo mesh block not found');
s = s.replace(haloMeshBlock, haloContourBlock);

const haloPlaceBlock = `      const halo = haloShapeGroup;\n      halo.scale.set(scale * 1.025, -scale * 1.025, 1);\n      halo.position.set(\n        -center.x * scale * 1.025,\n        center.y * scale * 1.025,\n        -Math.max(0.003, wallGapM * 0.72),\n      );\n      visualRoot.add(halo);`;
const haloPlaceNew = `      const halo = haloContourGroup;\n      halo.scale.set(scale, -scale, 1);\n      halo.position.set(\n        -center.x * scale,\n        center.y * scale,\n        -Math.max(0.003, wallGapM * 0.72),\n      );\n      visualRoot.add(halo);`;
if (!s.includes(haloPlaceBlock)) throw new Error('halo placement block not found');
s = s.replace(haloPlaceBlock, haloPlaceNew);

fs.writeFileSync(p, s);
