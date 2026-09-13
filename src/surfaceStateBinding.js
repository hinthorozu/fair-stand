/**
 * Renderer mesh'i kalıcı yüzey durumunun kopyasını tutar.
 * Kalıcı yazı yalnız bu bağın persistent nesnesi (designState / kayıt ağacı) üzerinedir.
 */

const FABRIC_KEYS = Object.freeze([
  'fabricGroupId',
  'fabricColor',
  'fabricImageAssetId',
  'fabricImageFit',
  'fabricLightingOn',
  'fabricType',
  'fabricOwnerSurfaceIds',
  'fabricOwnerModuleIds',
]);

export function cloneSurfaceStateForRenderer(canonical) {
  if (!canonical || typeof canonical !== 'object') return null;
  return structuredClone(canonical);
}

export function bindRendererSurfaceState(canonical) {
  if (!canonical || typeof canonical !== 'object') {
    return {
      surfaceState: null,
      persistentSurfaceState: null,
    };
  }
  return {
    persistentSurfaceState: canonical,
    surfaceState: cloneSurfaceStateForRenderer(canonical),
  };
}

export function syncRendererSurfaceState(rendererCopy, persistent) {
  if (!rendererCopy || !persistent || typeof rendererCopy !== 'object' || typeof persistent !== 'object') {
    return rendererCopy ?? null;
  }
  Object.keys(rendererCopy).forEach((key) => {
    if (!(key in persistent)) delete rendererCopy[key];
  });
  Object.entries(persistent).forEach(([key, value]) => {
    rendererCopy[key] = value != null && typeof value === 'object'
      ? structuredClone(value)
      : value;
  });
  return rendererCopy;
}

export function applyGlassOverride(surfaceState, isGlass) {
  if (!surfaceState) return null;
  surfaceState.isGlass = Boolean(isGlass);
  return surfaceState;
}

export function clearFabricFields(surfaceState) {
  if (!surfaceState) return null;
  FABRIC_KEYS.forEach((key) => {
    delete surfaceState[key];
  });
  return surfaceState;
}
