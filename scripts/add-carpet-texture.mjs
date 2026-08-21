import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const activeFloorAnchor = `  activeFloor.receiveShadow = true;\n  activeFloor.castShadow = true;\n  activeFloor.visible = false;\n  scene.add(activeFloor);`;

const carpetTextureCode = `  activeFloor.receiveShadow = true;\n  activeFloor.castShadow = true;\n  activeFloor.visible = false;\n  scene.add(activeFloor);\n\n  // Lightweight procedural carpet texture: neutral fibers multiplied by the chosen\n  // carpet color, plus a subtle bump map so grazing light reads as real textile.\n  // Generated in-browser to avoid another heavy image asset or network request.\n  function createCarpetTexturePair() {\n    const size = 256;\n    const colorCanvas = document.createElement('canvas');\n    const bumpCanvas = document.createElement('canvas');\n    colorCanvas.width = colorCanvas.height = size;\n    bumpCanvas.width = bumpCanvas.height = size;\n\n    const colorCtx = colorCanvas.getContext('2d');\n    const bumpCtx = bumpCanvas.getContext('2d');\n    const colorImage = colorCtx.createImageData(size, size);\n    const bumpImage = bumpCtx.createImageData(size, size);\n\n    // Deterministic pseudo-random field keeps the texture stable across rebuilds.\n    let seed = 0x5f3759df;\n    const random = () => {\n      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;\n      return seed / 0xffffffff;\n    };\n\n    for (let y = 0; y < size; y += 1) {\n      for (let x = 0; x < size; x += 1) {\n        const i = (y * size + x) * 4;\n        const fine = (random() - 0.5) * 34;\n        const fiber = Math.sin((x * 0.72) + (y * 0.18)) * 5;\n        const value = Math.max(72, Math.min(184, 128 + fine + fiber));\n        const bump = Math.max(88, Math.min(168, 128 + fine * 0.9 + fiber * 1.5));\n\n        colorImage.data[i] = value;\n        colorImage.data[i + 1] = value;\n        colorImage.data[i + 2] = value;\n        colorImage.data[i + 3] = 255;\n        bumpImage.data[i] = bump;\n        bumpImage.data[i + 1] = bump;\n        bumpImage.data[i + 2] = bump;\n        bumpImage.data[i + 3] = 255;\n      }\n    }\n\n    colorCtx.putImageData(colorImage, 0, 0);\n    bumpCtx.putImageData(bumpImage, 0, 0);\n\n    const colorMap = new THREE.CanvasTexture(colorCanvas);\n    const bumpMap = new THREE.CanvasTexture(bumpCanvas);\n    [colorMap, bumpMap].forEach((texture) => {\n      texture.wrapS = THREE.MirroredRepeatWrapping;\n      texture.wrapT = THREE.MirroredRepeatWrapping;\n      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();\n      texture.needsUpdate = true;\n    });\n    colorMap.colorSpace = THREE.SRGBColorSpace;\n    return { colorMap, bumpMap };\n  }\n\n  const carpetTextures = createCarpetTexturePair();`;

if (!source.includes('function createCarpetTexturePair()')) {
  if (!source.includes(activeFloorAnchor)) throw new Error('activeFloor anchor not found');
  source = source.replace(activeFloorAnchor, carpetTextureCode);
}

const carpetBranch = `    if (resolved === 'hali') {\n      material.color.set(floorColors.hali);\n      material.roughness = 1;\n      material.metalness = 0;\n    } else if (PARQUET_TYPES.has(resolved)) {`;

const carpetBranchReplacement = `    if (resolved === 'hali') {\n      material.color.set(floorColors.hali);\n      material.roughness = 1;\n      material.metalness = 0;\n      material.map = carpetTextures.colorMap;\n      material.bumpMap = carpetTextures.bumpMap;\n      material.bumpScale = 0.018;\n      if (stageLayout) {\n        const repeatX = Math.max(2, stageLayout.widthM / 0.7);\n        const repeatY = Math.max(2, stageLayout.depthM / 0.7);\n        carpetTextures.colorMap.repeat.set(repeatX, repeatY);\n        carpetTextures.bumpMap.repeat.set(repeatX, repeatY);\n      }\n    } else if (PARQUET_TYPES.has(resolved)) {\n      material.map = null;\n      material.bumpMap = null;\n      material.bumpScale = 0;`;

if (!source.includes('material.map = carpetTextures.colorMap')) {
  if (!source.includes(carpetBranch)) throw new Error('carpet branch anchor not found');
  source = source.replace(carpetBranch, carpetBranchReplacement);
}

const parquetElseAnchor = `    } else {\n      material.color.set(floorColors.karolaj);\n      material.roughness = 0.92;\n      material.metalness = 0;\n    }\n    material.needsUpdate = true;`;

const parquetElseReplacement = `    } else {\n      material.color.set(floorColors.karolaj);\n      material.roughness = 0.92;\n      material.metalness = 0;\n      material.map = null;\n      material.bumpMap = null;\n      material.bumpScale = 0;\n    }\n    material.needsUpdate = true;`;

if (!source.includes('material.bumpScale = 0;\n    }\n    material.needsUpdate = true;')) {
  if (!source.includes(parquetElseAnchor)) throw new Error('default floor branch anchor not found');
  source = source.replace(parquetElseAnchor, parquetElseReplacement);
}

fs.writeFileSync(path, source);
