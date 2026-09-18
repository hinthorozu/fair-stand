let hostDocument = typeof document !== 'undefined' ? document : null;

export function setFairStandHostDocument(nextDocument) {
  hostDocument = nextDocument || (typeof document !== 'undefined' ? document : null);
}

export function getFairStandHostDocument() {
  return hostDocument || (typeof document !== 'undefined' ? document : null);
}

export function getFairStandHostWindow() {
  const doc = getFairStandHostDocument();
  return doc?.defaultView ?? (typeof window !== 'undefined' ? window : globalThis);
}
