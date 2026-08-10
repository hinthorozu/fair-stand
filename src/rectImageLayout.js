function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function isContiguous(values) {
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] !== values[index - 1] + 1) return false;
  }
  return true;
}

function nearlyEqual(a, b, epsilon = 1e-6) {
  return Math.abs(a - b) <= epsilon;
}

export function createRectImageLayout(items) {
  if (!Array.isArray(items) || items.length < 2) {
    return { ok: false, message: 'Birleşik görsel için en az 2 panel seç.' };
  }

  const moduleIndices = uniqueSorted(items.map((item) => item.moduleIndex));
  const stripIndices = uniqueSorted(items.map((item) => item.stripIndex));

  if (!moduleIndices.length || !stripIndices.length) {
    return { ok: false, message: 'Seçili panel koordinatları geçersiz.' };
  }

  if (!isContiguous(moduleIndices) || !isContiguous(stripIndices)) {
    return { ok: false, message: 'Birleşik görsel alanı bitişik bir dikdörtgen olmalı.' };
  }

  const expectedCount = moduleIndices.length * stripIndices.length;
  if (items.length !== expectedCount) {
    return { ok: false, message: 'Birleşik görsel alanında boşluk veya eksik panel olamaz.' };
  }

  const cells = new Map();
  for (const item of items) {
    const key = `${item.moduleIndex}:${item.stripIndex}`;
    if (cells.has(key)) {
      return { ok: false, message: 'Aynı panel birden fazla kez seçilmiş.' };
    }
    cells.set(key, item);
  }

  for (const moduleIndex of moduleIndices) {
    for (const stripIndex of stripIndices) {
      if (!cells.has(`${moduleIndex}:${stripIndex}`)) {
        return { ok: false, message: 'Seçim tam bir dikdörtgen blok oluşturmalı.' };
      }
    }
  }

  const columnWidths = new Map();
  for (const moduleIndex of moduleIndices) {
    const first = cells.get(`${moduleIndex}:${stripIndices[0]}`);
    const width = Number(first?.width);
    if (!(width > 0)) {
      return { ok: false, message: 'Seçili panel genişliği geçersiz.' };
    }

    for (const stripIndex of stripIndices) {
      const cellWidth = Number(cells.get(`${moduleIndex}:${stripIndex}`)?.width);
      if (!(cellWidth > 0) || !nearlyEqual(cellWidth, width)) {
        return { ok: false, message: 'Aynı sütundaki panel genişlikleri eşleşmiyor.' };
      }
    }
    columnWidths.set(moduleIndex, width);
  }

  const rowHeights = new Map();
  for (const stripIndex of stripIndices) {
    const first = cells.get(`${moduleIndices[0]}:${stripIndex}`);
    const height = Number(first?.height);
    if (!(height > 0)) {
      return { ok: false, message: 'Seçili panel yüksekliği geçersiz.' };
    }

    for (const moduleIndex of moduleIndices) {
      const cellHeight = Number(cells.get(`${moduleIndex}:${stripIndex}`)?.height);
      if (!(cellHeight > 0) || !nearlyEqual(cellHeight, height)) {
        return { ok: false, message: 'Aynı sıradaki panel yükseklikleri eşleşmiyor.' };
      }
    }
    rowHeights.set(stripIndex, height);
  }

  const totalWidth = moduleIndices.reduce(
    (sum, moduleIndex) => sum + columnWidths.get(moduleIndex),
    0,
  );
  const totalHeight = stripIndices.reduce(
    (sum, stripIndex) => sum + rowHeights.get(stripIndex),
    0,
  );

  if (!(totalWidth > 0) || !(totalHeight > 0)) {
    return { ok: false, message: 'Birleşik görsel alanının ölçüleri geçersiz.' };
  }

  const columnStarts = new Map();
  let cursorX = 0;
  for (const moduleIndex of moduleIndices) {
    columnStarts.set(moduleIndex, cursorX / totalWidth);
    cursorX += columnWidths.get(moduleIndex);
  }

  const rowStarts = new Map();
  let cursorY = 0;
  for (const stripIndex of stripIndices) {
    rowStarts.set(stripIndex, cursorY / totalHeight);
    cursorY += rowHeights.get(stripIndex);
  }

  const entries = items.map((item) => ({
    ...item,
    regionStartX: columnStarts.get(item.moduleIndex),
    regionWidth: columnWidths.get(item.moduleIndex) / totalWidth,
    regionStartY: rowStarts.get(item.stripIndex),
    regionHeight: rowHeights.get(item.stripIndex) / totalHeight,
  }));

  return {
    ok: true,
    columnCount: moduleIndices.length,
    rowCount: stripIndices.length,
    panelCount: entries.length,
    totalWidth,
    totalHeight,
    groupAspect: totalWidth / totalHeight,
    entries,
  };
}
