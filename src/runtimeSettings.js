// Runtime ayar kaydı. Kaynak fair_stand_settings (catalog bootstrap).
// Item satırı ve stand zarfı değildir.

let runtimeSettings = null;

function requireBoolean(raw, key) {
  if (raw[key] !== true && raw[key] !== false) {
    throw new TypeError(`Fair Stand settings.${key} must be a boolean.`);
  }
  return raw[key];
}

export function initializeRuntimeSettings(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('Fair Stand settings bootstrap payload is invalid.');
  }
  const maxImageUploadMb = Number(raw.maxImageUploadMb);
  if (!Number.isInteger(maxImageUploadMb) || maxImageUploadMb <= 0) {
    throw new TypeError('Fair Stand settings.maxImageUploadMb must be a positive integer.');
  }
  runtimeSettings = Object.freeze({
    maxImageUploadMb,
    exportButtonVisible: requireBoolean(raw, 'exportButtonVisible'),
    importButtonVisible: requireBoolean(raw, 'importButtonVisible'),
  });
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

export function isExportButtonVisible() {
  return getRuntimeSettings().exportButtonVisible === true;
}

export function isImportButtonVisible() {
  return getRuntimeSettings().importButtonVisible === true;
}

/** Markup starts hidden; call after bootstrap so buttons never flash then vanish. */
export function applyArchiveButtonVisibility(documentRef) {
  const exportButton = documentRef?.querySelector?.('#export-project');
  const importButton = documentRef?.querySelector?.('#import-project');
  if (!exportButton || !importButton) {
    throw new Error('Fair Stand archive buttons are missing from the document.');
  }
  exportButton.hidden = !isExportButtonVisible();
  importButton.hidden = !isImportButtonVisible();
}
