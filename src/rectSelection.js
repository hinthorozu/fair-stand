function normalizePoint(point) {
  return {
    moduleIndex: Number(point?.moduleIndex),
    stripIndex: Number(point?.stripIndex),
  };
}

export function createRectSelection(items, anchorPoint, targetPoint) {
  if (!Array.isArray(items) || !items.length) {
    return { ok: false, message: 'Seçilebilir panel bulunamadı.' };
  }

  const anchor = normalizePoint(anchorPoint);
  const target = normalizePoint(targetPoint);

  if (
    !Number.isInteger(anchor.moduleIndex)
    || !Number.isInteger(anchor.stripIndex)
    || !Number.isInteger(target.moduleIndex)
    || !Number.isInteger(target.stripIndex)
  ) {
    return { ok: false, message: 'Seçim başlangıç veya bitiş noktası geçersiz.' };
  }

  const minModuleIndex = Math.min(anchor.moduleIndex, target.moduleIndex);
  const maxModuleIndex = Math.max(anchor.moduleIndex, target.moduleIndex);
  const minStripIndex = Math.min(anchor.stripIndex, target.stripIndex);
  const maxStripIndex = Math.max(anchor.stripIndex, target.stripIndex);

  const columnCount = maxModuleIndex - minModuleIndex + 1;
  const rowCount = maxStripIndex - minStripIndex + 1;
  const expectedCount = columnCount * rowCount;

  const entries = items
    .filter((item) => (
      item.moduleIndex >= minModuleIndex
      && item.moduleIndex <= maxModuleIndex
      && item.stripIndex >= minStripIndex
      && item.stripIndex <= maxStripIndex
    ))
    .sort((a, b) => (
      a.stripIndex - b.stripIndex
      || a.moduleIndex - b.moduleIndex
    ));

  const coordinateCount = new Set(
    entries.map((item) => `${item.moduleIndex}:${item.stripIndex}`),
  ).size;

  if (entries.length !== expectedCount || coordinateCount !== expectedCount) {
    return {
      ok: false,
      message: 'Seçim alanında eksik panel var; yalnızca tam dikdörtgen bloklar seçilebilir.',
    };
  }

  return {
    ok: true,
    entries,
    panelCount: expectedCount,
    columnCount,
    rowCount,
    bounds: {
      minModuleIndex,
      maxModuleIndex,
      minStripIndex,
      maxStripIndex,
    },
  };
}

export function describeRectSelection(items) {
  if (!Array.isArray(items) || !items.length) {
    return { columnCount: 0, rowCount: 0, panelCount: 0 };
  }

  const moduleIndices = items.map((item) => item.moduleIndex);
  const stripIndices = items.map((item) => item.stripIndex);

  return {
    columnCount: Math.max(...moduleIndices) - Math.min(...moduleIndices) + 1,
    rowCount: Math.max(...stripIndices) - Math.min(...stripIndices) + 1,
    panelCount: items.length,
  };
}
