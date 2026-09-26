/**
 * F-031 phase 1: end-to-end (side-by-side) BOM adjustments for full-height flat walls.
 * Corners, base junctions, and short-up are out of scope.
 */

import { getItem, isShortUpFamilyDescriptor } from './items.js';

const EPSILON_CM = 0.001;

/**
 * Locked product deltas per end-to-end joint (wall_200+wall_200 example).
 *
 * Physical layout on a joined run:
 * - Outer free upright faces → connector_single (outward)
 * - Bottom rail → connector_start
 * - Shared middle upright face → connector_double (replaces paired singles)
 */
export const END_TO_END_JOINT_DELTAS = Object.freeze({
  upright_346_5: -1,
  connector_single: -14,
  connector_double: 7,
});

const FULL_HEIGHT_FLAT_WALL_RE = /^wall_(50|100|150|200)_350$/;

function nearlyEqual(a, b) {
  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;
}

function normalizeRotationZDeg(rotationZDeg) {
  const value = Number(rotationZDeg);
  if (!Number.isFinite(value)) return 0;
  const normalized = ((value % 360) + 360) % 360;
  return normalized;
}

function isVerticalRotation(rotationZDeg) {
  const rot = normalizeRotationZDeg(rotationZDeg);
  return nearlyEqual(rot, 90) || nearlyEqual(rot, 270);
}

/**
 * Full-height düz panel walls only (not short-up / door / separator / showcase).
 */
export function isEndToEndBomWallModule(module) {
  const itemKey = module?.itemKey ?? null;
  if (!itemKey || !FULL_HEIGHT_FLAT_WALL_RE.test(itemKey)) return false;
  const item = getItem(itemKey);
  if (!item || item.type !== 'flat-panel') return false;
  if (isShortUpFamilyDescriptor(item) || isShortUpFamilyDescriptor(module)) return false;
  return true;
}

function resolveModuleWidthCm(module) {
  const fromState = Number(module?.widthCm);
  if (Number.isFinite(fromState) && fromState > 0) return fromState;
  const fromItem = Number(getItem(module?.itemKey)?.dimensions?.widthCm
    ?? getItem(module?.itemKey)?.sceneDimensions?.widthCm);
  if (Number.isFinite(fromItem) && fromItem > 0) return fromItem;
  return null;
}

/**
 * Centerline segment in the same shape as modulePlacement ground segments.
 */
export function getWallBomSegment(module) {
  if (!isEndToEndBomWallModule(module)) return null;
  const placement = module?.placement;
  const widthCm = resolveModuleWidthCm(module);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  if (isVerticalRotation(placement.rotationZDeg)) {
    return Object.freeze({
      moduleId: module.id ?? null,
      itemKey: module.itemKey,
      axis: 'y',
      fixedCm: x,
      startCm: y,
      endCm: y + widthCm,
    });
  }

  return Object.freeze({
    moduleId: module.id ?? null,
    itemKey: module.itemKey,
    axis: 'x',
    fixedCm: y,
    startCm: x,
    endCm: x + widthCm,
  });
}

function endpointsTouch(a, b) {
  return nearlyEqual(a.endCm, b.startCm) || nearlyEqual(a.startCm, b.endCm);
}

function segmentsOverlapLongitudinally(a, b) {
  return a.startCm < b.endCm - EPSILON_CM && b.startCm < a.endCm - EPSILON_CM;
}

/**
 * Collinear end-to-end joints between eligible walls. Order-independent.
 * @returns {ReadonlyArray<{ moduleIds: [string, string], itemKeys: [string, string] }>}
 */
export function detectEndToEndJoints(modules = []) {
  const list = Array.isArray(modules) ? modules : [];
  const segments = [];
  for (const module of list) {
    const segment = getWallBomSegment(module);
    if (segment) segments.push(segment);
  }

  const joints = [];
  const seen = new Set();

  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const a = segments[i];
      const b = segments[j];
      if (a.axis !== b.axis) continue;
      if (!nearlyEqual(a.fixedCm, b.fixedCm)) continue;
      if (segmentsOverlapLongitudinally(a, b)) continue;
      if (!endpointsTouch(a, b)) continue;

      const idA = a.moduleId ?? `idx:${i}`;
      const idB = b.moduleId ?? `idx:${j}`;
      const key = idA < idB ? `${idA}\u0000${idB}` : `${idB}\u0000${idA}`;
      if (seen.has(key)) continue;
      seen.add(key);

      joints.push(Object.freeze({
        moduleIds: Object.freeze(idA < idB ? [idA, idB] : [idB, idA]),
        itemKeys: Object.freeze(
          idA < idB ? [a.itemKey, b.itemKey] : [b.itemKey, a.itemKey],
        ),
        kind: 'end-to-end',
      }));
    }
  }

  return Object.freeze(joints);
}

function lineKey(itemKey, unit) {
  return `${itemKey}\u0000${unit}`;
}

function quantityOf(lines, itemKey, unit = 'adet') {
  const found = lines.find((line) => line.itemKey === itemKey && line.unit === unit);
  return found ? Number(found.quantity) : 0;
}

/**
 * Apply end-to-end joint deltas to aggregated leaf lines.
 * If any resulting quantity would go negative, skips all joint deltas and reports notes.
 */
export function applyEndToEndBomAdjustments(lines = [], joints = []) {
  const jointList = Array.isArray(joints) ? joints : [];
  const baseLines = Array.isArray(lines) ? lines.map((line) => ({ ...line })) : [];
  const notes = [];

  if (jointList.length === 0) {
    return Object.freeze({
      lines: Object.freeze(baseLines.map((line) => Object.freeze(line))),
      appliedJointCount: 0,
      notes: Object.freeze(notes),
    });
  }

  const jointCount = jointList.length;
  const uprightNeed = jointCount * Math.abs(END_TO_END_JOINT_DELTAS.upright_346_5);
  const singleNeed = jointCount * Math.abs(END_TO_END_JOINT_DELTAS.connector_single);
  const uprightHave = quantityOf(baseLines, 'upright_346_5');
  const singleHave = quantityOf(baseLines, 'connector_single');

  if (uprightHave < uprightNeed || singleHave < singleNeed) {
    notes.push(
      `Yan yana düzeltme atlandı: yetersiz stok (upright ${uprightHave}/${uprightNeed}, single ${singleHave}/${singleNeed}).`,
    );
    return Object.freeze({
      lines: Object.freeze(baseLines.map((line) => Object.freeze(line))),
      appliedJointCount: 0,
      notes: Object.freeze(notes),
    });
  }

  const byKey = new Map();
  for (const line of baseLines) {
    byKey.set(lineKey(line.itemKey, line.unit), { ...line });
  }

  function adjust(itemKey, delta, unit = 'adet') {
    if (!delta) return;
    const key = lineKey(itemKey, unit);
    const current = byKey.get(key);
    if (current) {
      current.quantity += delta;
      return;
    }
    if (delta < 0) return;
    const item = getItem(itemKey);
    byKey.set(key, {
      itemKey,
      name: item?.name ?? itemKey,
      quantity: delta,
      unit,
      material: item?.material ?? null,
    });
  }

  for (let i = 0; i < jointCount; i += 1) {
    adjust('upright_346_5', END_TO_END_JOINT_DELTAS.upright_346_5);
    adjust('connector_single', END_TO_END_JOINT_DELTAS.connector_single);
    adjust('connector_double', END_TO_END_JOINT_DELTAS.connector_double);
  }

  notes.push(`Yan yana birleşim: ${jointCount} eklem (−${uprightNeed} dikme, −${singleNeed} tekli, +${jointCount * END_TO_END_JOINT_DELTAS.connector_double} çiftli).`);

  const nextLines = Array.from(byKey.values())
    .filter((line) => Number(line.quantity) > 0)
    .map((line) => Object.freeze(line));

  return Object.freeze({
    lines: Object.freeze(nextLines),
    appliedJointCount: jointCount,
    notes: Object.freeze(notes),
  });
}
