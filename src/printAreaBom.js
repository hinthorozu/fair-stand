import { WALL_PANEL_BAND_PITCH_CM } from './wallPanelBand.js';

const REGION_EPSILON = 0.02;

const SECTION_DEFS = Object.freeze([
  Object.freeze({ id: 'image', label: 'Görseller' }),
  Object.freeze({ id: 'lightbox', label: 'Lightbox' }),
  Object.freeze({ id: 'mesh', label: 'Delikli branda' }),
  Object.freeze({ id: 'foam', label: 'Strafor logo' }),
]);

function nearly(a, b) {
  return Math.abs(Number(a) - Number(b)) <= REGION_EPSILON;
}

function roundCm(value) {
  return Math.round(Number(value));
}

function areaM2(widthCm, heightCm) {
  return (widthCm * heightCm) / 10000;
}

function moduleWidthCm(module) {
  const width = Number(module?.widthCm);
  return Number.isFinite(width) && width > 0 ? width : null;
}

function collectStripFaces(modules) {
  const faces = [];
  modules.forEach((module, moduleIndex) => {
    const widthCm = moduleWidthCm(module);
    if (widthCm == null) return;
    const strips = Array.isArray(module?.strips) ? module.strips : [];
    strips.forEach((strip, fallbackIndex) => {
      if (!strip || typeof strip !== 'object') return;
      const stripIndex = Number.isInteger(strip.stripIndex) ? strip.stripIndex : fallbackIndex;
      faces.push({
        moduleIndex,
        stripIndex,
        widthCm,
        imageAssetId: strip.imageAssetId || null,
        transform: strip.imageTransform && typeof strip.imageTransform === 'object'
          ? strip.imageTransform
          : null,
        fabricGroupId: strip.fabricGroupId || null,
        fabricType: strip.fabricType === 'mesh' ? 'mesh' : 'lightbox',
        fabricImageAssetId: strip.fabricImageAssetId || null,
        fabricColor: typeof strip.fabricColor === 'string' ? strip.fabricColor : null,
      });
    });
  });
  return faces;
}

function assetSubject(assetId) {
  const id = typeof assetId === 'string' ? assetId.trim() : '';
  return id ? { kind: 'asset', id } : null;
}

function colorSubject(color) {
  const value = typeof color === 'string' ? color.trim().toLowerCase() : '';
  return value ? { kind: 'color', id: value } : null;
}

function piece(widthCm, heightCm, subject = null) {
  const width = roundCm(widthCm);
  const height = roundCm(heightCm);
  if (!(width > 0) || !(height > 0)) return null;
  return {
    widthCm: width,
    heightCm: height,
    subjectKind: subject?.kind ?? null,
    subjectId: subject?.id ?? null,
  };
}

function imagePieces(faces) {
  const printed = faces.filter((face) => face.imageAssetId && !face.fabricGroupId);
  const pieces = [];
  const horizontal = [];
  const rect = [];
  for (const face of printed) {
    const mode = face.transform?.mode;
    if (mode === 'horizontal-group') horizontal.push(face);
    else if (mode === 'rect-group') rect.push(face);
    else {
      const single = piece(face.widthCm, WALL_PANEL_BAND_PITCH_CM, assetSubject(face.imageAssetId));
      if (single) pieces.push(single);
    }
  }
  pieces.push(...clusterHorizontal(horizontal));
  pieces.push(...clusterRect(rect));
  return pieces;
}

function groupBy(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

function clusterHorizontal(faces) {
  const pieces = [];
  for (const row of groupBy(faces, (face) => `${face.imageAssetId}\u0000${face.stripIndex}`).values()) {
    const sorted = [...row].sort((a, b) => a.moduleIndex - b.moduleIndex || a.stripIndex - b.stripIndex);
    let current = [];
    const flush = () => {
      if (!current.length) return;
      const made = piece(
        current.reduce((sum, face) => sum + face.widthCm, 0),
        WALL_PANEL_BAND_PITCH_CM,
        assetSubject(current[0].imageAssetId),
      );
      if (made) pieces.push(made);
      current = [];
    };
    for (const face of sorted) {
      const prev = current.at(-1);
      const continues = prev
        && face.moduleIndex === prev.moduleIndex + 1
        && nearly(face.transform.regionStart, prev.transform.regionStart + prev.transform.regionWidth);
      if (prev && !continues) flush();
      current.push(face);
    }
    flush();
  }
  return pieces;
}

function regionsContinueHorizontally(left, right) {
  return nearly(left.transform.regionStartY, right.transform.regionStartY)
    && nearly(left.transform.regionHeight, right.transform.regionHeight)
    && nearly(right.transform.regionStartX, left.transform.regionStartX + left.transform.regionWidth);
}

function regionsContinueVertically(upper, lower) {
  return nearly(upper.transform.regionStartX, lower.transform.regionStartX)
    && nearly(upper.transform.regionWidth, lower.transform.regionWidth)
    && nearly(lower.transform.regionStartY, upper.transform.regionStartY + upper.transform.regionHeight);
}

function clusterRect(faces) {
  const pieces = [];
  for (const cells of groupBy(faces, (face) => face.imageAssetId).values()) {
    const indexByKey = new Map(cells.map((cell, index) => [`${cell.moduleIndex}:${cell.stripIndex}`, index]));
    const parent = cells.map((_, index) => index);
    const find = (index) => {
      let cursor = index;
      while (parent[cursor] !== cursor) cursor = parent[cursor];
      let compress = index;
      while (parent[compress] !== cursor) {
        const next = parent[compress];
        parent[compress] = cursor;
        compress = next;
      }
      return cursor;
    };
    const union = (left, right) => {
      const rootLeft = find(left);
      const rootRight = find(right);
      if (rootLeft !== rootRight) parent[rootRight] = rootLeft;
    };
    cells.forEach((cell, index) => {
      const right = indexByKey.get(`${cell.moduleIndex + 1}:${cell.stripIndex}`);
      if (right != null && regionsContinueHorizontally(cell, cells[right])) union(index, right);
      const lower = indexByKey.get(`${cell.moduleIndex}:${cell.stripIndex + 1}`);
      if (lower != null && regionsContinueVertically(cell, cells[lower])) union(index, lower);
    });
    for (const members of groupBy(cells, (cell) => find(cells.indexOf(cell))).values()) {
      const widths = new Map();
      const strips = new Set();
      for (const member of members) {
        widths.set(member.moduleIndex, member.widthCm);
        strips.add(member.stripIndex);
      }
      const made = piece(
        [...widths.values()].reduce((sum, width) => sum + width, 0),
        strips.size * WALL_PANEL_BAND_PITCH_CM,
        assetSubject(members[0].imageAssetId),
      );
      if (made) pieces.push(made);
    }
  }
  return pieces;
}

function fabricSubject(cells) {
  for (const cell of cells) {
    const asset = assetSubject(cell.fabricImageAssetId);
    if (asset) return asset;
  }
  for (const cell of cells) {
    const color = colorSubject(cell.fabricColor);
    if (color) return color;
  }
  return null;
}

function fabricPieces(faces, kind) {
  const members = faces.filter((face) => face.fabricGroupId && face.fabricType === kind);
  const pieces = [];
  for (const cells of groupBy(members, (face) => face.fabricGroupId).values()) {
    const widths = new Map();
    const strips = new Set();
    for (const cell of cells) {
      widths.set(cell.moduleIndex, cell.widthCm);
      strips.add(cell.stripIndex);
    }
    const made = piece(
      [...widths.values()].reduce((sum, width) => sum + width, 0),
      strips.size * WALL_PANEL_BAND_PITCH_CM,
      fabricSubject(cells),
    );
    if (made) pieces.push(made);
  }
  return pieces;
}

function foamPieces(modules) {
  const pieces = [];
  for (const module of modules) {
    if (module?.type !== 'illuminated-foam' && module?.itemKey !== 'illuminated-foam') continue;
    const made = piece(module.widthCm, module.heightCm, assetSubject(module.imageAssetId));
    if (made) pieces.push(made);
  }
  return pieces;
}

function subjectKey(item) {
  return `${item.subjectKind ?? ''}\u0000${item.subjectId ?? ''}`;
}

function lookupAssetName(assetNames, assetId) {
  if (!assetNames || !assetId) return '';
  const raw = assetNames instanceof Map ? assetNames.get(assetId) : assetNames[assetId];
  return typeof raw === 'string' ? raw.trim() : '';
}

function subjectName(item, assetNames) {
  if (item.subjectKind === 'asset') return lookupAssetName(assetNames, item.subjectId) || 'Görsel';
  if (item.subjectKind === 'color') return item.subjectId;
  return '';
}

function aggregatePieces(pieces, assetNames) {
  const bySize = new Map();
  for (const item of pieces) {
    const key = `${subjectKey(item)}\u0000${item.widthCm}\u0000${item.heightCm}`;
    const current = bySize.get(key) ?? {
      widthCm: item.widthCm,
      heightCm: item.heightCm,
      quantity: 0,
      areaM2: areaM2(item.widthCm, item.heightCm),
      subjectKind: item.subjectKind,
      subjectId: item.subjectId,
      name: subjectName(item, assetNames),
    };
    current.quantity += 1;
    current.totalAreaM2 = current.quantity * current.areaM2;
    bySize.set(key, current);
  }
  return [...bySize.values()]
    .sort((a, b) => (
      String(a.name ?? '').localeCompare(String(b.name ?? ''), 'tr')
      || b.widthCm - a.widthCm
      || b.heightCm - a.heightCm
      || b.quantity - a.quantity
    ))
    .map((line) => Object.freeze({ ...line }));
}

function section(id, label, pieces, assetNames) {
  const lines = aggregatePieces(pieces, assetNames);
  if (!lines.length) return null;
  const totalAreaM2 = lines.reduce((sum, line) => sum + line.totalAreaM2, 0);
  return Object.freeze({
    id,
    label,
    totalAreaM2,
    lines: Object.freeze(lines),
  });
}

/**
 * Print pieces for the production list.
 * Panel size is module width by 50 cm bands. A grouped image or fabric block is one piece.
 * Fabric prints are not also counted as panel images.
 */
export function collectPrintAreas(modules = [], assetNames = null) {
  const list = Array.isArray(modules) ? modules : [];
  const faces = collectStripFaces(list);
  const built = [
    section('image', 'Görseller', imagePieces(faces), assetNames),
    section('lightbox', 'Lightbox', fabricPieces(faces, 'lightbox'), assetNames),
    section('mesh', 'Delikli branda', fabricPieces(faces, 'mesh'), assetNames),
    section('foam', 'Strafor logo', foamPieces(list), assetNames),
  ].filter(Boolean);
  const order = new Map(SECTION_DEFS.map((entry, index) => [entry.id, index]));
  built.sort((a, b) => order.get(a.id) - order.get(b.id));
  return Object.freeze(built);
}
