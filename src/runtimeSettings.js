// Runtime ayar kaydı. Kaynak fair_stand_settings (catalog bootstrap).
// Item satırı ve stand zarfı değildir.

let runtimeSettings = null;

export function initializeRuntimeSettings(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('Fair Stand settings bootstrap payload is invalid.');
  }
  const maxImageUploadMb = Number(raw.maxImageUploadMb);
  if (!Number.isInteger(maxImageUploadMb) || maxImageUploadMb <= 0) {
    throw new TypeError('Fair Stand settings.maxImageUploadMb must be a positive integer.');
  }
  runtimeSettings = Object.freeze({ maxImageUploadMb });
}

export function resetRuntimeSettings() {
  runtimeSettings = null;
}

export function getRuntimeSettings() {
  if (!runtimeSettings) {
    throw new Error('Fair Stand settings are not bootstrapped.');
  }
  return runtimeSettings;
}

export function getMaxImageUploadMb() {
  return getRuntimeSettings().maxImageUploadMb;
}

export function getMaxImageUploadBytes() {
  return getMaxImageUploadMb() * 1024 * 1024;
}

export function formatImageUploadTooLargeMessage() {
  return `Görsel en fazla ${getMaxImageUploadMb()} MB olabilir.`;
}
