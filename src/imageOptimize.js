import { isAllowedImportImageType } from './projectImportValidation.js';

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_LONG_EDGE_PX = 1536;
export const IMAGE_ENCODE_QUALITY = 0.75;
export const IMAGE_UPLOAD_TOO_LARGE_MESSAGE = 'Görsel en fazla 5 MB olabilir.';
export const IMAGE_UPLOAD_TYPE_MESSAGE = 'Yalnız image/* görsel dosyası yükle.';
export const IMAGE_OPTIMIZE_FAILED_MESSAGE = 'Görsel küçültülemedi.';

const SVG_TYPE = 'image/svg+xml';

export function isImageUploadWithinSizeLimit(byteLength) {
  return Number(byteLength) <= MAX_IMAGE_UPLOAD_BYTES;
}

export function scaleToMaxLongEdge(width, height, maxEdge = MAX_IMAGE_LONG_EDGE_PX) {
  const w = Math.max(1, Math.round(Number(width) || 0));
  const h = Math.max(1, Math.round(Number(height) || 0));
  const longEdge = Math.max(w, h);
  if (longEdge <= maxEdge) {
    return { width: w, height: h, scaled: false };
  }
  const scale = maxEdge / longEdge;
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
    scaled: true,
  };
}

export function sampleHasTransparency(imageData) {
  const pixels = imageData?.data;
  if (!pixels || pixels.length < 4) return false;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 255) return true;
  }
  return false;
}

export function chooseOptimizedImageType({ hasAlpha, webpSupported }) {
  if (hasAlpha) return webpSupported ? 'image/webp' : 'image/png';
  return webpSupported ? 'image/webp' : 'image/jpeg';
}

export function assertImageUploadAllowed(file) {
  if (!file) throw new Error(IMAGE_UPLOAD_TYPE_MESSAGE);
  if (!isAllowedImportImageType(file.type)) {
    throw new Error(IMAGE_UPLOAD_TYPE_MESSAGE);
  }
  if (!isImageUploadWithinSizeLimit(file.size)) {
    throw new Error(IMAGE_UPLOAD_TOO_LARGE_MESSAGE);
  }
}

function defaultCreateCanvas(width, height) {
  if (typeof OffscreenCanvas === 'function') {
    return new OffscreenCanvas(width, height);
  }
  if (typeof document?.createElement === 'function') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  throw new Error(IMAGE_OPTIMIZE_FAILED_MESSAGE);
}

function defaultSupportsWebp() {
  if (typeof document?.createElement !== 'function') return false;
  try {
    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    return probe.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

function defaultEncode(canvas, type, quality) {
  if (typeof canvas.convertToBlob === 'function') {
    return canvas.convertToBlob({ type, quality });
  }
  if (typeof canvas.toBlob === 'function') {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error(IMAGE_OPTIMIZE_FAILED_MESSAGE));
      }, type, quality);
    });
  }
  return Promise.reject(new Error(IMAGE_OPTIMIZE_FAILED_MESSAGE));
}

export async function prepareUploadedImage(file, io = {}) {
  assertImageUploadAllowed(file);
  if (file.type === SVG_TYPE) {
    return { blob: file, type: file.type, optimized: false };
  }

  const decode = io.decode ?? ((source) => createImageBitmap(source));
  const createCanvas = io.createCanvas ?? defaultCreateCanvas;
  const supportsWebp = io.supportsWebp ?? defaultSupportsWebp;
  const encode = io.encode ?? defaultEncode;

  const bitmap = await decode(file);
  try {
    const target = scaleToMaxLongEdge(bitmap.width, bitmap.height);
    const canvas = createCanvas(target.width, target.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error(IMAGE_OPTIMIZE_FAILED_MESSAGE);
    context.clearRect(0, 0, target.width, target.height);
    context.drawImage(bitmap, 0, 0, target.width, target.height);
    const hasAlpha = sampleHasTransparency(
      context.getImageData(0, 0, target.width, target.height),
    );
    const type = chooseOptimizedImageType({
      hasAlpha,
      webpSupported: Boolean(supportsWebp()),
    });
    const quality = type === 'image/png' ? undefined : IMAGE_ENCODE_QUALITY;
    const blob = await encode(canvas, type, quality);
    if (!blob) throw new Error(IMAGE_OPTIMIZE_FAILED_MESSAGE);
    if (!target.scaled && blob.size >= file.size) {
      return { blob: file, type: file.type, optimized: false };
    }
    return { blob, type: blob.type || type, optimized: true };
  } finally {
    bitmap.close?.();
  }
}
