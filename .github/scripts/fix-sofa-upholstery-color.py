from pathlib import Path
import re
p=Path('src/scene3d.js')
s=p.read_text()
old_apply="""      const colorTargets = mesh.userData.colorTargets?.length
        ? mesh.userData.colorTargets
        : [mesh];

      colorTargets.forEach((target) => {
        if (!target?.material) return;
        target.material.map?.dispose?.();
        target.material.map = null;
        target.material.color.set(surfaceState?.isGlass ? GLASS_SURFACE_COLOR : hexColor);
        target.material.needsUpdate = true;
      });
"""
new_apply="""      const colorTargets = mesh.userData.colorTargets?.length
        ? mesh.userData.colorTargets
        : [mesh];

      if (mesh.userData.moduleType === 'sofa-set-beige') {
        colorTargets.forEach((target) => applyBeigeSofaUpholsteryColor(target, hexColor));
        return;
      }

      colorTargets.forEach((target) => {
        if (!target?.material) return;
        target.material.map?.dispose?.();
        target.material.map = null;
        target.material.color.set(surfaceState?.isGlass ? GLASS_SURFACE_COLOR : hexColor);
        target.material.needsUpdate = true;
      });
"""
if old_apply not in s: raise SystemExit('applyColor block not found')
s=s.replace(old_apply,new_apply,1)
pattern=r"const beigeWhiteUpholsteryTextureCache = new WeakMap\(\);.*?function cloneBeigeSofaMaterial\(material\) \{.*?\n\}\n\nfunction createBeigeSofaSetModule"
replacement="""const beigeUpholsteryTextureCache = new WeakMap();

function normalizeSofaColor(hexColor = '#ffffff') {
  const raw = String(hexColor || '#ffffff').trim();
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw.toLowerCase() : '#ffffff';
}

function createBeigeUpholsteryTexture(sourceTexture, hexColor = '#ffffff') {
  if (!sourceTexture?.image || typeof document === 'undefined') return sourceTexture;
  const colorKey = normalizeSofaColor(hexColor);
  let colorCache = beigeUpholsteryTextureCache.get(sourceTexture);
  if (!colorCache) {
    colorCache = new Map();
    beigeUpholsteryTextureCache.set(sourceTexture, colorCache);
  }
  const cached = colorCache.get(colorKey);
  if (cached) return cached;

  const image = sourceTexture.image;
  const width = Number(image.width || image.videoWidth || 0);
  const height = Number(image.height || image.videoHeight || 0);
  if (!width || !height) return sourceTexture;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return sourceTexture;

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const targetR = parseInt(colorKey.slice(1, 3), 16);
  const targetG = parseInt(colorKey.slice(3, 5), 16);
  const targetB = parseInt(colorKey.slice(5, 7), 16);

  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    if (pixels[index + 3] === 0) continue;

    // GLB atlasında gerçek ahşap ayaklar kumaştan belirgin biçimde daha koyu,
    // sıcak ve doygun kahverengi. Sadece bu dar aralığı dokunulmaz bırak.
    const isWood = (
      r < 185
      && g < 150
      && b < 120
      && r > g * 1.08
      && g > b * 1.05
      && r - b > 34
    );
    if (isWood) continue;

    // Döşeme tek renk olsun. Modelin formunu texture lekesi değil sahne ışığı verir.
    pixels[index] = targetR;
    pixels[index + 1] = targetG;
    pixels[index + 2] = targetB;
  }

  context.putImageData(imageData, 0, 0);
  const texture = sourceTexture.clone();
  texture.image = canvas;
  texture.needsUpdate = true;
  colorCache.set(colorKey, texture);
  return texture;
}

function cloneBeigeSofaMaterial(material, upholsteryColor = '#ffffff') {
  if (!material) return material;
  const cloned = material.clone?.() ?? material;
  cloned.userData = { ...(cloned.userData || {}), sofaSourceMap: material.map || null };
  if (material.map) cloned.map = createBeigeUpholsteryTexture(material.map, upholsteryColor);
  if (cloned.color) cloned.color.set('#ffffff');
  return cloned;
}

function applyBeigeSofaUpholsteryColor(target, hexColor) {
  if (!target?.material) return;
  const materials = Array.isArray(target.material) ? target.material : [target.material];
  materials.forEach((material) => {
    if (!material) return;
    const sourceMap = material.userData?.sofaSourceMap;
    if (sourceMap) {
      const nextMap = createBeigeUpholsteryTexture(sourceMap, hexColor);
      if (material.map && material.map !== nextMap && material.map !== sourceMap) {
        material.map.dispose?.();
      }
      material.map = nextMap;
      material.color?.set('#ffffff');
    } else {
      material.color?.set(hexColor);
    }
    material.needsUpdate = true;
  });
}

function createBeigeSofaSetModule"""
s2,n=re.subn(pattern,replacement,s,count=1,flags=re.S)
if n != 1: raise SystemExit(f'sofa texture block replacement count={n}')
s=s2
s=s.replace("object.material = object.material.map(cloneBeigeSofaMaterial);","object.material = object.material.map((material) => cloneBeigeSofaMaterial(material, moduleState.surface?.color ?? '#ffffff'));",1)
s=s.replace("object.material = cloneBeigeSofaMaterial(object.material);","object.material = cloneBeigeSofaMaterial(object.material, moduleState.surface?.color ?? '#ffffff');",1)
p.write_text(s)
