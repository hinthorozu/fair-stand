import {
  getFloorItem,
  getItem,
  resolveStandFloorItemKey,
} from './items.js';
import { resolveItemBom } from './itemBom.js';
import {
  applyGlassPanelSplit,
  collectPanelSurfaces,
  summarizeGlassMoves,
} from './panelGlassBom.js';
import {
  applyCornerPanelSwap,
  applyRelationshipBomAdjustments,
  applyWallShortBomDeltas,
  detectRelationshipJoints,
  planWallShortRelationshipBom,
} from './relationshipBom.js';
import { applyBaseRunBom, isBaseRunItemKey } from './baseRunBom.js';
import { collectPrintAreas } from './printAreaBom.js';
import { resolveSplitFloorBomLines } from './floorArea.js';

function freezeLine(line) {
  return Object.freeze({
    itemKey: line.itemKey,
    name: line.item?.name ?? line.name ?? line.itemKey,
    quantity: line.quantity,
    unit: line.unit,
    material: line.material ?? null,
  });
}

function aggregateLines(lineLists) {
  const aggregated = new Map();
  for (const lines of lineLists) {
    for (const line of lines) {
      const key = `${line.itemKey}\u0000${line.unit}`;
      const current = aggregated.get(key);
      if (current) {
        current.quantity += line.quantity;
      } else {
        aggregated.set(key, { ...line });
      }
    }
  }
  return Array.from(aggregated.values(), (line) => Object.freeze(line));
}

function resolveModuleEntry(moduleState, index, { panelSwap = null } = {}) {
  const moduleId = moduleState?.id ?? null;
  const itemKey = moduleState?.itemKey ?? null;

  if (!itemKey) {
    return Object.freeze({
      moduleId,
      index,
      itemKey: null,
      name: moduleState?.type ? `type:${moduleState.type}` : 'unknown',
      type: moduleState?.type ?? null,
      status: 'unresolved',
      lines: Object.freeze([]),
      message: 'Modülde itemKey yok.',
    });
  }

  const item = getItem(itemKey);
  const name = item?.name ?? itemKey;

  try {
    const recipeLines = resolveItemBom(itemKey, 1);
    const surfaces = collectPanelSurfaces(moduleState);
    const split = applyGlassPanelSplit(recipeLines, surfaces);
    const lines = panelSwap
      ? applyCornerPanelSwap(split.lines, panelSwap, surfaces)
      : split.lines;
    return Object.freeze({
      moduleId,
      index,
      itemKey,
      name,
      type: item?.type ?? moduleState?.type ?? null,
      status: 'ok',
      lines: Object.freeze(lines.map(freezeLine)),
      glassMoved: Object.freeze(split.moved),
      message: null,
    });
  } catch (error) {
    return Object.freeze({
      moduleId,
      index,
      itemKey,
      name,
      type: item?.type ?? moduleState?.type ?? null,
      status: 'unresolved',
      lines: Object.freeze([]),
      message: error?.message || 'Bu Item için üretim reçetesi çözülemedi.',
    });
  }
}

function floorAreaM2(stand) {
  const xCm = Number(stand?.xCm);
  const yCm = Number(stand?.yCm);
  if (!(xCm > 0) || !(yCm > 0)) return null;
  return (xCm * yCm) / 10000;
}

function floorTileCount(stand, item) {
  const xCm = Number(stand?.xCm);
  const yCm = Number(stand?.yCm);
  const tileW = Number(item?.dimensions?.widthCm);
  const tileD = Number(item?.dimensions?.depthCm);
  if (!(xCm > 0) || !(yCm > 0) || !(tileW > 0) || !(tileD > 0)) return null;
  return Math.ceil(xCm / tileW) * Math.ceil(yCm / tileD);
}

/**
 * Existing print-area section totals. The area math stays in printAreaBom.
 * These keys only name the production leaf that receives that total.
 */
const PRINT_PRODUCTION_ITEM_KEYS = Object.freeze({
  image: 'digital_print',
  mesh: 'mesh_fabric',
  lightbox: 'lightbox_fabric',
  foam: 'foam_logo',
});

function resolvePrintProductionLines(printAreas) {
  const lines = [];
  for (const section of printAreas) {
    const itemKey = PRINT_PRODUCTION_ITEM_KEYS[section.id];
    if (!itemKey) continue;
    lines.push(...resolveItemBom(itemKey, section.totalAreaM2));
  }
  return lines;
}

function isFloorAreaUnit(unit) {
  return unit === 'm2' || unit === 'metre_kare';
}

function canonicalFloorUnit(unit) {
  const text = String(unit ?? '').trim().toLowerCase().replaceAll('²', '2').replaceAll('^', '');
  if (isFloorAreaUnit(text) || text === 'adet') return text;
  return null;
}

/**
 * Selected stand floor → one aggregated line.
 * Any item_type=floor uses its catalog unit: m2 and metre_kare are stand area, adet is whole tiles.
 */
export function resolveFloorBomLine(stand) {
  if (!stand) return null;
  const item = getFloorItem(resolveStandFloorItemKey(stand));
  if (!item || item.type !== 'floor') return null;

  const unit = canonicalFloorUnit(item.unit);
  if (!unit) return null;

  const quantity = isFloorAreaUnit(unit)
    ? floorAreaM2(stand)
    : floorTileCount(stand, item);
  if (quantity == null || !(quantity > 0)) return null;

  return Object.freeze({
    itemKey: item.itemKey,
    name: item.name,
    quantity,
    unit,
    material: item.material ?? null,
  });
}

function moduleIdentity(moduleState, index) {
  return moduleState?.id ?? `idx:${index}`;
}

function absorbPanelSwaps(swaps, { fullIds = [], strips = [] } = {}) {
  for (const moduleId of fullIds) {
    if (moduleId) swaps.set(moduleId, { all: true });
  }
  for (const entry of strips) {
    if (!entry?.moduleId || swaps.get(entry.moduleId)?.all) continue;
    const current = swaps.get(entry.moduleId);
    const indexes = new Set(current?.stripIndexes ?? []);
    for (const index of entry.stripIndexes ?? []) indexes.add(index);
    if (indexes.size) swaps.set(entry.moduleId, { stripIndexes: [...indexes] });
  }
}

function unresolvedFrom(moduleEntries) {
  return moduleEntries
    .filter((entry) => entry.status === 'unresolved')
    .map((entry) => Object.freeze({
      moduleId: entry.moduleId,
      index: entry.index,
      itemKey: entry.itemKey,
      name: entry.name,
      message: entry.message,
    }));
}

/**
 * Project modules → per-module BOM + unresolved + aggregated leaf totals.
 * Applies locked wall joints, then baza rows and same-width host backs.
 * @param {Array<{ id?: string, itemKey?: string, type?: string, placement?: object, widthCm?: number }>} modules
 * @param {Map<string, string> | Record<string, string> | null} assetNames
 */
export function resolveProjectBom(modules = [], stand = null, assetNames = null) {
  const list = Array.isArray(modules) ? modules : [];
  const joints = detectRelationshipJoints(list);
  const wallShort = planWallShortRelationshipBom(list);
  let moduleEntries = list.map((moduleState, index) => resolveModuleEntry(moduleState, index));
  const wallLinesOf = () => moduleEntries
    .filter((entry) => entry.status === 'ok' && !isBaseRunItemKey(entry.itemKey))
    .map((entry) => entry.lines);
  const preview = applyRelationshipBomAdjustments(
    aggregateLines(wallLinesOf()),
    joints,
  );

  const swaps = new Map();
  absorbPanelSwaps(swaps, {
    fullIds: wallShort.swapModuleIds,
    strips: wallShort.panelSwaps,
  });
  if (preview.appliedJointCount > 0) {
    absorbPanelSwaps(swaps, {
      fullIds: preview.swapModuleIds,
      strips: preview.panelSwaps,
    });
  }
  if (swaps.size > 0) {
    moduleEntries = list.map((moduleState, index) => {
      const panelSwap = swaps.get(moduleIdentity(moduleState, index));
      return panelSwap
        ? resolveModuleEntry(moduleState, index, { panelSwap })
        : moduleEntries[index];
    });
  }

  const adjusted = applyRelationshipBomAdjustments(
    aggregateLines(wallLinesOf()),
    joints,
  );
  const wallShortLines = applyWallShortBomDeltas(adjusted.lines, wallShort);
  const baza = applyBaseRunBom(list);
  const glassNotes = summarizeGlassMoves(
    moduleEntries
      .filter((entry) => entry.status === 'ok' && !isBaseRunItemKey(entry.itemKey))
      .flatMap((entry) => entry.glassMoved ?? []),
  );
  const splitFloorLines = stand?.floorArea ? resolveSplitFloorBomLines(stand) : null;
  const floorLine = splitFloorLines ? null : resolveFloorBomLine(stand);
  const printAreas = collectPrintAreas(list, assetNames);
  const lines = aggregateLines([
    wallShortLines,
    baza.lines,
    splitFloorLines ?? (floorLine ? [floorLine] : []),
    resolvePrintProductionLines(printAreas),
  ]);

  return Object.freeze({
    modules: Object.freeze(moduleEntries),
    unresolved: Object.freeze(unresolvedFrom(moduleEntries)),
    joints: Object.freeze(joints),
    relationshipNotes: Object.freeze([...adjusted.notes, ...wallShort.notes, ...baza.notes, ...glassNotes]),
    appliedJointCount: adjusted.appliedJointCount,
    appliedEndToEndCount: adjusted.appliedEndToEndCount,
    appliedCornerCount: adjusted.appliedCornerCount,
    appliedTeeCount: adjusted.appliedTeeCount,
    lines: Object.freeze(lines.map(freezeLine)),
    printAreas,
  });
}
