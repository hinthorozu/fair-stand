const fs = require('fs');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) throw new Error(`${label} insertion point not found`);
  return text.replace(needle, replacement);
}

// designState.js
{
  const path = 'src/designState.js';
  let s = read(path);
  const marker = 'export function createTvModuleState(sizeInch = 42, descriptor = {}) {';
  if (!s.includes('export function createIlluminatedFoamModuleState(')) {
    const block = `export function createIlluminatedFoamModuleState(imageAssetId, descriptor = {}) {\n  const widthCm = Math.max(10, Number(descriptor.widthCm) || 200);\n  const heightCm = Math.max(5, Number(descriptor.heightCm) || 50);\n  return {\n    id: createId('module'),\n    type: 'illuminated-foam',\n    imageAssetId,\n    widthCm,\n    heightCm,\n    depthCm: 3.5,\n    wallGapCm: 1.5,\n  };\n}\n\n`;
    s = replaceOnce(s, marker, block + marker, 'designState');
  }
  write(path, s);
}

// moduleBehavior.js
{
  const path = 'src/moduleBehavior.js';
  let s = read(path);
  const marker = `  tv: Object.freeze({\n`;
  if (!s.includes("'illuminated-foam': Object.freeze")) {
    const block = `  'illuminated-foam': Object.freeze({\n    placement: 'wall-overlay',\n    moveSnapCm: 10,\n    rotationStepDeg: 90,\n    defaultRotationDeg: 0,\n    allowSideInsert: false,\n    collision: 'none',\n  }),\n`;
    s = replaceOnce(s, marker, block + marker, 'moduleBehavior');
  }
  write(path, s);
}

// scene3d.js
{
  const path = 'src/scene3d.js';
  let s = read(path);
  if (!s.includes("SVGLoader from 'three/addons/loaders/SVGLoader.js'")) {
    s = replaceOnce(
      s,
      "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\n",
      "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\nimport { SVGLoader } from 'three/addons/loaders/SVGLoader.js';\n",
      'SVGLoader import',
    );
  }

  const dispatchNeedle = `    if (moduleState.type === 'tv') {\n      return createTvModule(moduleState, moduleIndex);\n    }\n`;
  if (!s.includes("moduleState.type === 'illuminated-foam'")) {
    const dispatchPatch = `    if (moduleState.type === 'illuminated-foam') {\n      return createIlluminatedFoamModule(moduleState, moduleIndex, getAssetUrl(moduleState.imageAssetId));\n    }\n` + dispatchNeedle;
    s = replaceOnce(s, dispatchNeedle, dispatchPatch, 'scene dispatch');
  }

  const tvMarker = 'function createTvModule(moduleState, moduleIndex) {';
  if (!s.includes('function createIlluminatedFoamModule(')) {
    const helper = `function createIlluminatedFoamModule(moduleState, moduleIndex, assetUrl) {\n  const widthM = Math.max(0.1, Number(moduleState.widthCm || 200) / 100);\n  const heightM = Math.max(0.05, Number(moduleState.heightCm || 50) / 100);\n  const depthM = Math.max(0.005, Number(moduleState.depthCm || 3.5) / 100);\n  const wallGapM = Math.max(0, Number(moduleState.wallGapCm || 1.5) / 100);\n  const centerYM = 1.75;\n  const wallFrontM = STAND_DIMENSIONS.depth / 2 + 0.0015;\n  const bodyBackZM = wallFrontM + wallGapM;\n  const centerZM = bodyBackZM + depthM / 2;\n\n  const group = new THREE.Group();\n  const hitbox = new THREE.Mesh(\n    new THREE.BoxGeometry(widthM, heightM, depthM),\n    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),\n  );\n  hitbox.position.set(0, centerYM, centerZM);\n  hitbox.userData.kind = 'surface';\n  hitbox.userData.surfaceId = moduleState.id + ':illuminated-foam';\n  hitbox.userData.moduleId = moduleState.id;\n  hitbox.userData.moduleType = 'illuminated-foam';\n  hitbox.userData.moduleIndex = moduleIndex;\n  hitbox.userData.widthCm = Number(moduleState.widthCm) || 200;\n  hitbox.userData.acceptsImage = false;\n  hitbox.userData.selectionMode = 'module';\n  group.add(hitbox);\n\n  const visualRoot = new THREE.Group();\n  visualRoot.position.set(0, centerYM, bodyBackZM);\n  group.add(visualRoot);\n\n  if (assetUrl) {\n    const loader = new SVGLoader();\n    loader.loadAsync(assetUrl).then((data) => {\n      const raw = new THREE.Group();\n      let meshCount = 0;\n      data.paths.forEach((path) => {\n        const style = path.userData?.style ?? {};\n        const fill = style.fill;\n        const fillOpacity = Number(style.fillOpacity ?? style.opacity ?? 1);\n        if (!fill || fill === 'none' || fill === 'transparent' || fillOpacity < 0.5) return;\n        const shapes = SVGLoader.createShapes(path);\n        shapes.forEach((shape) => {\n          const geometry = new THREE.ExtrudeGeometry(shape, {\n            depth: 1,\n            bevelEnabled: false,\n            curveSegments: 10,\n          });\n          const material = new THREE.MeshStandardMaterial({\n            color: new THREE.Color(fill),\n            roughness: 0.72,\n            metalness: 0,\n          });\n          const mesh = new THREE.Mesh(geometry, material);\n          mesh.scale.z = depthM;\n          mesh.castShadow = true;\n          mesh.receiveShadow = true;\n          raw.add(mesh);\n          meshCount += 1;\n        });\n      });\n\n      if (!meshCount) return;\n      const box = new THREE.Box3().setFromObject(raw);\n      const size = box.getSize(new THREE.Vector3());\n      const center = box.getCenter(new THREE.Vector3());\n      if (!(size.x > 0 && size.y > 0)) return;\n      const scale = Math.min(widthM / size.x, heightM / size.y);\n      raw.position.set(-center.x, -center.y, 0);\n      raw.scale.set(scale, -scale, 1);\n      visualRoot.add(raw);\n\n      const lightCount = 5;\n      for (let i = 0; i < lightCount; i += 1) {\n        const t = lightCount === 1 ? 0.5 : i / (lightCount - 1);\n        const light = new THREE.PointLight(0xffffff, 1.8, 0.55, 2);\n        light.position.set((t - 0.5) * widthM * 0.82, 0, -wallGapM * 0.55);\n        visualRoot.add(light);\n      }\n    }).catch((error) => {\n      console.warn('Işıklı strafor SVG yüklenemedi:', error);\n    });\n  }\n\n  group.userData.selectionBounds = Object.freeze({\n    widthM,\n    heightM,\n    depthM,\n    centerX: hitbox.position.x,\n    centerY: hitbox.position.y,\n    centerZ: hitbox.position.z,\n  });\n  return { group, surfaces: [hitbox] };\n}\n\n`;
    s = replaceOnce(s, tvMarker, helper + tvMarker, 'foam renderer');
  }
  write(path, s);
}

// main.js
{
  const path = 'src/main.js';
  let s = read(path);
  if (!s.includes('  createIlluminatedFoamModuleState,\n')) {
    s = replaceOnce(
      s,
      '  createIndoorPlantModuleState,\n',
      '  createIndoorPlantModuleState,\n  createIlluminatedFoamModuleState,\n',
      'main import',
    );
  }

  const menuNeedle = `assetContextMenu.innerHTML = \`\n  <div class="module-context-title">Görsel</div>\n  <button type="button" data-asset-action="delete" class="danger">Sil</button>\n\`;`;
  if (!s.includes('data-asset-action="illuminated-foam"')) {
    const menuPatch = `assetContextMenu.innerHTML = \`\n  <div class="module-context-title">Görsel</div>\n  <button type="button" data-asset-action="illuminated-foam">Işıklı Strafora Dönüştür</button>\n  <button type="button" data-asset-action="delete" class="danger">Sil</button>\n\`;`;
    s = replaceOnce(s, menuNeedle, menuPatch, 'asset menu');
  }

  const openMenuNeedle = `  assetContextAssetId = assetId;\n  assetContextMenu.querySelector('.module-context-title').textContent = \`Görsel · \${asset.name}\`;\n  assetContextMenu.hidden = false;\n`;
  if (!s.includes("foamAction.hidden = !isSvg")) {
    const openMenuPatch = `  assetContextAssetId = assetId;\n  assetContextMenu.querySelector('.module-context-title').textContent = \`Görsel · \${asset.name}\`;\n  const foamAction = assetContextMenu.querySelector('[data-asset-action="illuminated-foam"]');\n  const isSvg = asset.type === 'image/svg+xml' || /\\.svg$/i.test(asset.name || '');\n  if (foamAction) foamAction.hidden = !isSvg;\n  assetContextMenu.hidden = false;\n`;
    s = replaceOnce(s, openMenuNeedle, openMenuPatch, 'asset menu visibility');
  }

  const tvSelectionNeedle = `      if (moduleType === 'tv') {\n`;
  if (!s.includes("moduleType === 'illuminated-foam'")) {
    const foamSelection = `      if (moduleType === 'illuminated-foam') {\n        const foamState = currentModules[moduleIndex];\n        selectionInfo.textContent = \`Modül \${moduleIndex + 1} · Işıklı Strafor · \${Number(foamState?.depthCm) || 3.5} cm kalınlık · duvardan \${Number(foamState?.wallGapCm) || 1.5} cm boşluk.\`;\n        return;\n      }\n\n`;
    s = replaceOnce(s, tvSelectionNeedle, foamSelection + tvSelectionNeedle, 'selection label');
  }

  const deleteListenerNeedle = `assetContextMenu.querySelector('[data-asset-action="delete"]').addEventListener('click', () => {`;
  if (!s.includes('async function beginIlluminatedFoamAssetDrag(')) {
    const dragBlock = `let illuminatedFoamAssetDragCleanup = null;\n\nfunction getSvgAspectRatioFromText(svgText) {\n  const documentNode = new DOMParser().parseFromString(svgText, 'image/svg+xml');\n  if (documentNode.querySelector('parsererror')) return 4;\n  const svg = documentNode.documentElement;\n  const viewBox = (svg.getAttribute('viewBox') || '').trim().split(/[\\s,]+/).map(Number);\n  if (viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0) {\n    return viewBox[2] / viewBox[3];\n  }\n  const width = Number.parseFloat(svg.getAttribute('width'));\n  const height = Number.parseFloat(svg.getAttribute('height'));\n  return width > 0 && height > 0 ? width / height : 4;\n}\n\nasync function beginIlluminatedFoamAssetDrag(assetId) {\n  const asset = imageAssets.get(assetId);\n  if (!asset) return false;\n  const isSvg = asset.type === 'image/svg+xml' || /\\.svg$/i.test(asset.name || '');\n  if (!isSvg) {\n    assetStatus.textContent = 'Işıklı Strafor için SVG görsel kullan.';\n    return false;\n  }\n  if (!currentStand) {\n    assetStatus.textContent = 'Önce stand sahnesini oluştur.';\n    return false;\n  }\n\n  if (illuminatedFoamAssetDragCleanup) illuminatedFoamAssetDragCleanup();\n\n  const svgText = await asset.blob.text();\n  const aspect = Math.max(0.1, getSvgAspectRatioFromText(svgText));\n  const widthCm = 200;\n  const heightCm = Math.max(10, widthCm / aspect);\n  const moduleState = createIlluminatedFoamModuleState(asset.id, { widthCm, heightCm });\n  let lastPreview = null;\n\n  const onPointerMove = (event) => {\n    lastPreview = scene3d.previewCatalogModuleDrag(moduleState, event.clientX, event.clientY, 0, false);\n  };\n  const cleanup = () => {\n    document.removeEventListener('pointermove', onPointerMove, true);\n    document.removeEventListener('pointerup', onPointerUp, true);\n    document.removeEventListener('keydown', onKeyDown, true);\n    scene3d.clearCatalogModuleDrag();\n    illuminatedFoamAssetDragCleanup = null;\n  };\n  const onPointerUp = (event) => {\n    const result = scene3d.dropCatalogModuleDrag(moduleState, event.clientX, event.clientY, 0, false);\n    if (!result.ok || !result.placement) {\n      assetStatus.textContent = result.message || 'Işıklı Strafor bu konuma bırakılamadı.';\n      return;\n    }\n    moduleState.placement = { ...result.placement };\n    currentModules.push(moduleState);\n    cleanup();\n    rebuildWall({ resetView: false });\n    assetStatus.textContent = 'Işıklı Strafor sahneye eklendi · 3,5 cm kalınlık · 1,5 cm ışık boşluğu.';\n  };\n  const onKeyDown = (event) => {\n    if (event.key !== 'Escape') return;\n    event.preventDefault();\n    cleanup();\n    assetStatus.textContent = 'Işıklı Strafor yerleştirme iptal edildi.';\n  };\n\n  document.addEventListener('pointermove', onPointerMove, true);\n  document.addEventListener('pointerup', onPointerUp, true);\n  document.addEventListener('keydown', onKeyDown, true);\n  illuminatedFoamAssetDragCleanup = cleanup;\n  assetStatus.textContent = 'Işıklı Strafor hazır · mouse ile duvara götür ve tıkla.';\n  return Boolean(lastPreview) || true;\n}\n\nassetContextMenu.querySelector('[data-asset-action="illuminated-foam"]').addEventListener('click', () => {\n  const assetId = assetContextAssetId;\n  closeAssetContextMenu();\n  if (assetId) void beginIlluminatedFoamAssetDrag(assetId);\n});\n\n`;
    s = replaceOnce(s, deleteListenerNeedle, dragBlock + deleteListenerNeedle, 'foam drag handler');
  }
  write(path, s);
}

// smoke tests for the feature contract
fs.writeFileSync('test/illuminatedFoamModule.test.js', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\ntest('illuminated foam keeps fixed physical offsets and SVG loader', () => {\n  const design = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');\n  const behavior = readFileSync(new URL('../src/moduleBehavior.js', import.meta.url), 'utf8');\n  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');\n  assert.match(design, /type: 'illuminated-foam'/);\n  assert.match(design, /depthCm: 3\\.5/);\n  assert.match(design, /wallGapCm: 1\\.5/);\n  assert.match(behavior, /'illuminated-foam': Object\\.freeze/);\n  assert.match(behavior, /placement: 'wall-overlay'/);\n  assert.match(behavior, /moveSnapCm: 10/);\n  assert.match(scene, /SVGLoader/);\n  assert.match(scene, /fillOpacity < 0\\.5/);\n  assert.match(main, /Işıklı Strafora Dönüştür/);\n  assert.match(main, /previewCatalogModuleDrag/);\n});\n`);
