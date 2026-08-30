from pathlib import Path

# Default module state color -> white.
p = Path('src/designState.js')
s = p.read_text()
old = """export function createBeigeSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set-beige',
    widthCm: 150,
    depthCm: 150,
    heightCm: 78,
    surface: {
      id: createId('surface'),
      color: '#e7ddca',
    },
  };
}
"""
new = """export function createBeigeSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set-beige',
    widthCm: 150,
    depthCm: 150,
    heightCm: 78,
    surface: {
      id: createId('surface'),
      color: '#ffffff',
    },
  };
}
"""
if old not in s:
    raise SystemExit('beige sofa state block not found')
p.write_text(s.replace(old, new, 1))

# Runtime texture treatment: neutralize upholstery while preserving warm wooden pixels.
p = Path('src/scene3d.js')
s = p.read_text()
anchor = "function createBeigeSofaSetModule(moduleState, moduleIndex) {"
if anchor not in s:
    raise SystemExit('beige sofa renderer anchor not found')
helper = r"""
const beigeWhiteUpholsteryTextureCache = new WeakMap();

function createBeigeWhiteUpholsteryTexture(sourceTexture) {
  if (!sourceTexture?.image || typeof document === 'undefined') return sourceTexture;
  const cached = beigeWhiteUpholsteryTextureCache.get(sourceTexture);
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

  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const a = pixels[index + 3];
    if (a === 0) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? (max - min) / max : 0;
    const brightness = max / 255;

    // Wooden legs/details are distinctly warmer and more saturated than the fabric.
    // Keep those pixels unchanged; only neutralize the beige upholstery.
    const isWood = (
      brightness > 0.12
      && brightness < 0.86
      && saturation > 0.20
      && r > g * 1.035
      && g > b * 1.035
    );
    if (isWood || brightness < 0.08) continue;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const whiteLevel = Math.max(188, Math.min(248, 222 + (luminance - 160) * 0.34));
    pixels[index] = whiteLevel;
    pixels[index + 1] = whiteLevel;
    pixels[index + 2] = whiteLevel;
  }

  context.putImageData(imageData, 0, 0);
  const texture = sourceTexture.clone();
  texture.image = canvas;
  texture.needsUpdate = true;
  beigeWhiteUpholsteryTextureCache.set(sourceTexture, texture);
  return texture;
}

function cloneBeigeSofaMaterial(material) {
  if (!material) return material;
  const cloned = material.clone?.() ?? material;
  if (cloned.map) cloned.map = createBeigeWhiteUpholsteryTexture(cloned.map);
  if (cloned.color) cloned.color.set('#ffffff');
  return cloned;
}

"""
if 'const beigeWhiteUpholsteryTextureCache = new WeakMap();' not in s:
    s = s.replace(anchor, helper + anchor, 1)

old_material = """        if (Array.isArray(object.material)) {
          object.material = object.material.map((material) => material?.clone?.() ?? material);
        } else if (object.material) {
          object.material = object.material.clone();
        }
        colorTargets.push(object);
"""
new_material = """        if (Array.isArray(object.material)) {
          object.material = object.material.map(cloneBeigeSofaMaterial);
        } else if (object.material) {
          object.material = cloneBeigeSofaMaterial(object.material);
        }
        colorTargets.push(object);
"""
if old_material not in s:
    raise SystemExit('beige sofa material clone block not found')
s = s.replace(old_material, new_material, 1)
p.write_text(s)
