import { getItem } from './items.js';
import { resolveItemBom } from './itemBom.js';

function freezeLine(line) {
  return Object.freeze({
    itemKey: line.itemKey,
    name: line.item?.name ?? line.itemKey,
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

function resolveModuleEntry(moduleState, index) {
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
    const lines = resolveItemBom(itemKey, 1).map(freezeLine);
    return Object.freeze({
      moduleId,
      index,
      itemKey,
      name,
      type: item?.type ?? moduleState?.type ?? null,
      status: 'ok',
      lines: Object.freeze(lines),
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

/**
 * Project modules → per-module BOM tree rows + unresolved + aggregated leaf totals.
 * @param {Array<{ id?: string, itemKey?: string, type?: string }>} modules
 */
export function resolveProjectBom(modules = []) {
  const list = Array.isArray(modules) ? modules : [];
  const moduleEntries = list.map((moduleState, index) => resolveModuleEntry(moduleState, index));
  const okEntries = moduleEntries.filter((entry) => entry.status === 'ok');
  const unresolved = moduleEntries
    .filter((entry) => entry.status === 'unresolved')
    .map((entry) => Object.freeze({
      moduleId: entry.moduleId,
      index: entry.index,
      itemKey: entry.itemKey,
      name: entry.name,
      message: entry.message,
    }));

  return Object.freeze({
    modules: Object.freeze(moduleEntries),
    unresolved: Object.freeze(unresolved),
    lines: Object.freeze(aggregateLines(okEntries.map((entry) => entry.lines))),
  });
}
