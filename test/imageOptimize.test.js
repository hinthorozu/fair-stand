import test from 'node:test';
import assert from 'node:assert/strict';
import {
  IMAGE_UPLOAD_TYPE_MESSAGE,
  MAX_IMAGE_LONG_EDGE_PX,
  assertImageUploadAllowed,
  chooseOptimizedImageType,
  formatImageUploadTooLargeMessage,
  getMaxImageUploadBytes,
  isImageUploadWithinSizeLimit,
  prepareUploadedImage,
  sampleHasTransparency,
  scaleToMaxLongEdge,
} from '../src/imageOptimize.js';
import { initializeRuntimeSettings } from '../src/runtimeSettings.js';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';

function imageDataFromAlpha(alphas) {
  const data = new Uint8ClampedArray(alphas.length * 4);
  for (let i = 0; i < alphas.length; i += 1) {
    data[i * 4] = 10;
    data[i * 4 + 1] = 20;
    data[i * 4 + 2] = 30;
    data[i * 4 + 3] = alphas[i];
  }
  return { data, width: alphas.length, height: 1 };
}

test('görsel tavanı bootstrapped MB değerini byte olarak kullanır', () => {
  const maxBytes = getMaxImageUploadBytes();
  assert.equal(maxBytes, 5 * 1024 * 1024);
  assert.equal(isImageUploadWithinSizeLimit(maxBytes), true);
  assert.equal(isImageUploadWithinSizeLimit(maxBytes + 1), false);
  assert.throws(
    () => assertImageUploadAllowed({ type: 'image/png', size: maxBytes + 1 }),
    (error) => error.message === formatImageUploadTooLargeMessage(),
  );
  assert.throws(
    () => assertImageUploadAllowed({ type: 'application/pdf', size: 12 }),
    (error) => error.message === IMAGE_UPLOAD_TYPE_MESSAGE,
  );
  try {
    initializeRuntimeSettings({ maxImageUploadMb: 2 });
    assert.equal(getMaxImageUploadBytes(), 2 * 1024 * 1024);
    assert.equal(formatImageUploadTooLargeMessage(), 'Görsel en fazla 2 MB olabilir.');
  } finally {
    loadCanonicalItemCatalog();
  }
});

test('uzun kenar 1536 üstünü orantılı küçültür', () => {
  assert.equal(MAX_IMAGE_LONG_EDGE_PX, 1536);
  assert.deepEqual(scaleToMaxLongEdge(800, 600), { width: 800, height: 600, scaled: false });
  assert.deepEqual(scaleToMaxLongEdge(3072, 1536), { width: 1536, height: 768, scaled: true });
  assert.deepEqual(scaleToMaxLongEdge(1024, 4096), { width: 384, height: 1536, scaled: true });
});

test('şeffaf piksel varsa JPEG seçilmez', () => {
  assert.equal(sampleHasTransparency(imageDataFromAlpha([255, 255])), false);
  assert.equal(sampleHasTransparency(imageDataFromAlpha([255, 0])), true);
  assert.equal(sampleHasTransparency(imageDataFromAlpha([128])), true);
  assert.equal(chooseOptimizedImageType({ hasAlpha: true, webpSupported: true }), 'image/webp');
  assert.equal(chooseOptimizedImageType({ hasAlpha: true, webpSupported: false }), 'image/png');
  assert.equal(chooseOptimizedImageType({ hasAlpha: false, webpSupported: false }), 'image/jpeg');
});

test('SVG rasterize edilmez; tavan yine geçerlidir', async () => {
  const svg = new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'logo.svg', { type: 'image/svg+xml' });
  const prepared = await prepareUploadedImage(svg);
  assert.equal(prepared.optimized, false);
  assert.equal(prepared.blob, svg);
  assert.equal(prepared.type, 'image/svg+xml');
});

test('şeffaf görsel JPEG yazmaz, orijinal dosyayı saklamaz', async () => {
  const original = new File([Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8])], 'logo.png', { type: 'image/png' });
  Object.defineProperty(original, 'size', { value: 80 });
  const encoded = new Blob([Uint8Array.from([9, 9, 9])], { type: 'image/webp' });
  let decodedSize = null;
  let encodedType = null;

  const prepared = await prepareUploadedImage(original, {
    decode: async () => ({ width: 2000, height: 1000, close() {} }),
    createCanvas: (width, height) => {
      decodedSize = { width, height };
      return {
        getContext: () => ({
          clearRect() {},
          drawImage() {},
          getImageData: () => imageDataFromAlpha([255, 0, 255, 255]),
        }),
      };
    },
    supportsWebp: () => true,
    encode: async (_canvas, type) => {
      encodedType = type;
      return encoded;
    },
  });

  assert.deepEqual(decodedSize, { width: 1536, height: 768 });
  assert.equal(encodedType, 'image/webp');
  assert.equal(prepared.optimized, true);
  assert.equal(prepared.blob, encoded);
  assert.equal(prepared.type, 'image/webp');
  assert.notEqual(prepared.blob, original);
});
