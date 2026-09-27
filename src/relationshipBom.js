/**
 * F-031: end-to-end doubles and inner-corner connectors for full-height walls.
 * Base junctions and short-up stay out of scope.
 *
 * Locked pairs are wall with wall, door, separator (including sarmaşık), showcase-2, or showcase-3.
 * Connector counts are the locked face deltas. A short separator recipe does not scale them.
 * Corner connectors apply only to a module whose front face looks at the other module.
 * A module sitting on the back keeps its singles and does not take corner connectors.
 */

import { getItem, isShortUpFamilyDescriptor } from './items.js';
import { resolveItemBom } from './itemBom.js';

const EPSILON_CM = 0.001;

/**
 * Wall ↔ wall end-to-end, per joint (both sides keep 6 singles, 7 become doubles).
 */
export const END_TO_END_JOINT_DELTAS = Object.freeze({
  upright_346_5: -1,
  connector_single: -14,
  connector_double: 7,
});

const FULL_HEIGHT_FLAT_WALL_RE = /^wall_(50|100|150|200)_350$/;
const SEPARATOR_RE = /^wall_separator_(50|100)_350(_sarmasik)?$/;

const LOCKED_WALL_PAIRS = new Set([
  'door|wall',
  'separator|wall',
  'showcase-2|wall',
  'showcase-3|wall',
  'wall|wall',
]);

const STRAIGHT_TO_CORNER_PANEL = Object.freeze({
  panel_48_5: 'panel_corner_42_5',
  panel_98: 'panel_corner_92',
  panel_147_5: 'panel_corner_142_5',
  panel_197: 'panel_corner_192',
});

const recipeSingleCache = new Map();

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

/** Scene yaw: 0 front +Y, 90 right +X, 180 back −Y, 270 left −X. Local +Z is the panel face. */
function frontNormal(rotationZDeg) {
  const rot = normalizeRotationZDeg(rotationZDeg);
  const theta = rot * Math.PI / 180;
  return { x: Math.sin(theta), y: Math.cos(theta) };
}

function pairKey(roleA, roleB) {
  return [roleA, roleB].sort().join('|');
}

/**
 * Full-height düz panel walls only (not short-up / door / separator / showcase).
 */
export function isEndToEndBomWallModule(module) {
  return relationshipBomRole(module) === 'wall';
}

/**
 * @returns {'wall'|'door'|'separator'|'showcase-2'|'showcase-3'|null}
 */
export function relationshipBomRole(module) {
  const itemKey = module?.itemKey ?? null;
  if (!itemKey) return null;
  const item = getItem(itemKey);
  if (!item) return null;
  if (isShortUpFamilyDescriptor(item) || isShortUpFamilyDescriptor(module)) return null;

  if (FULL_HEIGHT_FLAT_WALL_RE.test(itemKey) && item.type === 'flat-panel') return 'wall';
  if (itemKey === 'wall_door_100_350') return 'door';
  if (SEPARATOR_RE.test(itemKey)) return 'separator';
  if (itemKey === 'wall_showcase_100_2_350') return 'showcase-2';
  if (itemKey === 'wall_showcase_100_3_350') return 'showcase-3';
  return null;
}

function resolveModuleWidthCm(module) {
  const fromState = Number(module?.widthCm);
  if (Number.isFinite(fromState) && fromState > 0) return fromState;
  const item = getItem(module?.itemKey);
  const fromItem = Number(item?.dimensions?.widthCm ?? item?.sceneDimensions?.widthCm);
  if (Number.isFinite(fromItem) && fromItem > 0) return fromItem;
  return null;
}

function moduleIdentity(module, index) {
  return module?.id ?? `idx:${index}`;
}

/**
 * Centerline segment in the same shape as modulePlacement ground segments.
 */
export function getWallBomSegment(module) {
  if (!relationshipBomRole(module)) return null;
  const placement = module?.placement;
  const widthCm = resolveModuleWidthCm(module);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  const front = frontNormal(placement.rotationZDeg);
  if (isVerticalRotation(placement.rotationZDeg)) {
    return Object.freeze({
      itemKey: module.itemKey,
      axis: 'y',
      fixedCm: x,
      startCm: y,
      endCm: y + widthCm,
      frontX: front.x,
      frontY: front.y,
    });
  }

  return Object.freeze({
    itemKey: module.itemKey,
    axis: 'x',
    fixedCm: y,
    startCm: x,
    endCm: x + widthCm,
    frontX: front.x,
    frontY: front.y,
  });
}

function endpointsTouch(a, b) {
  return nearlyEqual(a.endCm, b.startCm) || nearlyEqual(a.startCm, b.endCm);
}

function segmentsOverlapLongitudinally(a, b) {
  return a.startCm < b.endCm - EPSILON_CM && b.startCm < a.endCm - EPSILON_CM;
}

function endpointPoints(segment) {
  if (segment.axis === 'x') {
    return [
      { xCm: segment.startCm, yCm: segment.fixedCm },
      { xCm: segment.endCm, yCm: segment.fixedCm },
    ];
  }
  return [
    { xCm: segment.fixedCm, yCm: segment.startCm },
    { xCm: segment.fixedCm, yCm: segment.endCm },
  ];
}

function pointsTouch(a, b) {
  return nearlyEqual(a.xCm, b.xCm) && nearlyEqual(a.yCm, b.yCm);
}

function segmentEndpoints(segment) {
  if (segment.axis === 'x') {
    return {
      start: { xCm: segment.startCm, yCm: segment.fixedCm },
      end: { xCm: segment.endCm, yCm: segment.fixedCm },
    };
  }
  return {
    start: { xCm: segment.fixedCm, yCm: segment.startCm },
    end: { xCm: segment.fixedCm, yCm: segment.endCm },
  };
}

function pointKey(point) {
  const quantize = (value) => Math.round(Number(value) / EPSILON_CM);
  return `${quantize(point.xCm)}\u0000${quantize(point.yCm)}`;
}

function cornerEndpointsTouch(a, b) {
  return sharedEndpoint(a, b) != null;
}

function sharedEndpoint(a, b) {
  const endsA = segmentEndpoints(a);
  const endsB = segmentEndpoints(b);
  for (const sideA of ['start', 'end']) {
    for (const sideB of ['start', 'end']) {
      if (pointsTouch(endsA[sideA], endsB[sideB])) {
        return { point: endsA[sideA], sideA, sideB };
      }
    }
  }
  return null;
}

function pointOnSegmentInterior(segment, point) {
  if (segment.axis === 'x') {
    if (!nearlyEqual(point.yCm, segment.fixedCm)) return false;
    return point.xCm > segment.startCm + EPSILON_CM && point.xCm < segment.endCm - EPSILON_CM;
  }
  if (!nearlyEqual(point.xCm, segment.fixedCm)) return false;
  return point.yCm > segment.startCm + EPSILON_CM && point.yCm < segment.endCm - EPSILON_CM;
}

function teeHit(branch, host) {
  const ends = segmentEndpoints(branch);
  for (const side of ['start', 'end']) {
    if (pointOnSegmentInterior(host, ends[side])) {
      return { point: ends[side], branchSide: side };
    }
  }
  return null;
}

function recipeSingleCount(itemKey) {
  if (recipeSingleCache.has(itemKey)) return recipeSingleCache.get(itemKey);
  let count = 0;
  try {
    const line = resolveItemBom(itemKey, 1).find((entry) => entry.itemKey === 'connector_single');
    count = line ? Number(line.quantity) : 0;
  } catch {
    count = 0;
  }
  recipeSingleCache.set(itemKey, count);
  return count;
}

function endToEndKeep(role, partnerRole) {
  if ((role === 'wall' || role === 'separator') && (partnerRole === 'wall' || partnerRole === 'separator')) {
    return 6;
  }
  if (role === 'wall' && partnerRole === 'door') return 6;
  if (role === 'door' && partnerRole === 'wall') return 2;
  if (role === 'wall' && partnerRole === 'showcase-2') return 8;
  if (role === 'showcase-2' && partnerRole === 'wall') return 4;
  if (role === 'wall' && partnerRole === 'showcase-3') return 9;
  if (role === 'showcase-3' && partnerRole === 'wall') return 3;
  return null;
}

function endToEndDoubles(roleA, roleB) {
  const key = pairKey(roleA, roleB);
  if (key === 'wall|wall' || key === 'separator|wall') return 7;
  if (key === 'door|wall') return 3;
  if (key === 'showcase-2|wall') return 5;
  if (key === 'showcase-3|wall') return 4;
  return null;
}

function bodyDirectionFromPoint(segment, point) {
  const ends = segmentEndpoints(segment);
  if (pointsTouch(ends.start, point)) {
    return segment.axis === 'x' ? { x: 1, y: 0 } : { x: 0, y: 1 };
  }
  if (pointsTouch(ends.end, point)) {
    return segment.axis === 'x' ? { x: -1, y: 0 } : { x: 0, y: -1 };
  }
  return null;
}

/** The other module's body lies on this module's front face. */
function partnerOnFront(self, partner, point) {
  if (!self || !partner || !point || self.axis === partner.axis) return false;
  const body = bodyDirectionFromPoint(partner, point);
  if (!body) return true;
  return body.x * self.frontX + body.y * self.frontY > 0;
}

function cornerCharge(participant, partners, point) {
  const side = cornerSide(participant.role, recipeSingleCount(participant.itemKey));
  if (!side) return null;
  const faces = partners.some((partner) => partnerOnFront(participant, partner, point));
  return {
    singleRemove: faces ? side.singleRemove : 0,
    cornerAdd: faces ? side.cornerAdd : 0,
    swapPanels: side.swapPanels,
  };
}

function cornerSide(role, singles) {
  const available = Math.max(0, Number(singles) || 0);
  if (role === 'wall' || role === 'separator') {
    return {
      singleRemove: Math.min(6, Math.max(0, available - 7)),
      cornerAdd: 6,
      swapPanels: role === 'wall',
    };
  }
  if (role === 'door') {
    return { singleRemove: Math.min(2, available), cornerAdd: 2, swapPanels: true };
  }
  if (role === 'showcase-2') {
    return { singleRemove: Math.min(4, available), cornerAdd: 4, swapPanels: true };
  }
  if (role === 'showcase-3') {
    return { singleRemove: Math.min(3, available), cornerAdd: 3, swapPanels: true };
  }
  return null;
}

function jointAdjustment(joint) {
  if (joint.kind === 'tee') {
    let single = 0;
    let corner = 0;
    const swapModuleIds = [];
    for (const participant of joint.participants) {
      if (participant.payCorner === false) continue;
      const others = joint.participants.filter((entry) => entry.moduleId !== participant.moduleId);
      const side = cornerCharge(participant, others, joint.point);
      if (!side) continue;
      single -= side.singleRemove;
      corner += side.cornerAdd;
      if (side.swapPanels) swapModuleIds.push(participant.moduleId);
    }
    const upright = -(Math.max(joint.participants.length, 2) - 1);
    return { upright, single, double: 0, corner, swapModuleIds };
  }

  const [a, b] = joint.participants;
  if (!LOCKED_WALL_PAIRS.has(pairKey(a.role, b.role))) return null;

  if (joint.kind === 'end-to-end') {
    const keepA = endToEndKeep(a.role, b.role);
    const keepB = endToEndKeep(b.role, a.role);
    const doubles = endToEndDoubles(a.role, b.role);
    if (keepA == null || keepB == null || doubles == null) return null;
    const removeA = Math.max(0, recipeSingleCount(a.itemKey) - keepA);
    const removeB = Math.max(0, recipeSingleCount(b.itemKey) - keepB);
    return {
      upright: -1,
      single: -(removeA + removeB),
      double: doubles,
      corner: 0,
      swapModuleIds: [],
    };
  }

  if (joint.kind === 'corner') {
    const sideA = cornerCharge(a, [b], joint.point);
    const sideB = cornerCharge(b, [a], joint.point);
    if (!sideA || !sideB) return null;
    return {
      upright: -1,
      single: -(sideA.singleRemove + sideB.singleRemove),
      double: 0,
      corner: sideA.cornerAdd + sideB.cornerAdd,
      swapModuleIds: [
        ...(sideA.swapPanels ? [a.moduleId] : []),
        ...(sideB.swapPanels ? [b.moduleId] : []),
      ],
    };
  }

  return null;
}

function collectSegments(modules) {
  const segments = [];
  modules.forEach((module, index) => {
    const role = relationshipBomRole(module);
    const segment = role ? getWallBomSegment(module) : null;
    if (!role || !segment) return;
    segments.push({
      ...segment,
      role,
      moduleId: moduleIdentity(module, index),
    });
  });
  return segments;
}

function freezeParticipant(segment, { payCorner = true } = {}) {
  return Object.freeze({
    moduleId: segment.moduleId,
    itemKey: segment.itemKey,
    role: segment.role,
    payCorner,
    axis: segment.axis,
    fixedCm: segment.fixedCm,
    startCm: segment.startCm,
    endCm: segment.endCm,
    frontX: segment.frontX,
    frontY: segment.frontY,
  });
}

function freezeJoint(kind, a, b, point) {
  const ordered = a.moduleId < b.moduleId ? [a, b] : [b, a];
  return Object.freeze({
    kind,
    point: point ? Object.freeze({ xCm: point.xCm, yCm: point.yCm }) : null,
    pointKey: point ? pointKey(point) : null,
    moduleIds: Object.freeze([ordered[0].moduleId, ordered[1].moduleId]),
    itemKeys: Object.freeze([ordered[0].itemKey, ordered[1].itemKey]),
    participants: Object.freeze([
      freezeParticipant(ordered[0]),
      freezeParticipant(ordered[1]),
    ]),
  });
}

function freezeTeeJoint(participants, point) {
  const ordered = [...participants].sort((a, b) => (a.moduleId < b.moduleId ? -1 : 1));
  return Object.freeze({
    kind: 'tee',
    point: Object.freeze({ xCm: point.xCm, yCm: point.yCm }),
    pointKey: pointKey(point),
    moduleIds: Object.freeze(ordered.map((entry) => entry.moduleId)),
    itemKeys: Object.freeze(ordered.map((entry) => entry.itemKey)),
    participants: Object.freeze(ordered.map((entry) => Object.freeze({ ...entry }))),
  });
}

function pairRecord(kind, a, b, point) {
  return { kind, a, b, point };
}

/**
 * Collinear end-to-end, perpendicular inner corners, and tee joints.
 * A third module on the same point turns that point into one tee: no doubles.
 * Order-independent. Only locked wall pairs are returned.
 */
export function detectRelationshipJoints(modules = []) {
  const list = Array.isArray(modules) ? modules : [];
  const segments = collectSegments(list);
  const pairRecords = [];
  const interiorHits = [];
  const seen = new Set();

  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const a = segments[i];
      const b = segments[j];
      if (!LOCKED_WALL_PAIRS.has(pairKey(a.role, b.role))) continue;

      const pairId = a.moduleId < b.moduleId
        ? `${a.moduleId}\u0000${b.moduleId}`
        : `${b.moduleId}\u0000${a.moduleId}`;
      if (seen.has(pairId)) continue;

      if (a.axis === b.axis) {
        if (!nearlyEqual(a.fixedCm, b.fixedCm)) continue;
        if (segmentsOverlapLongitudinally(a, b)) continue;
        if (!endpointsTouch(a, b)) continue;
        const shared = sharedEndpoint(a, b);
        if (!shared) continue;
        seen.add(pairId);
        pairRecords.push(pairRecord('end-to-end', a, b, shared.point));
        continue;
      }

      const shared = sharedEndpoint(a, b);
      if (shared) {
        seen.add(pairId);
        pairRecords.push(pairRecord('corner', a, b, shared.point));
        continue;
      }

      const branchOnB = teeHit(a, b);
      const branchOnA = teeHit(b, a);
      const hit = branchOnB
        ? { branch: a, host: b, point: branchOnB.point }
        : (branchOnA ? { branch: b, host: a, point: branchOnA.point } : null);
      if (!hit) continue;
      seen.add(pairId);
      interiorHits.push(hit);
    }
  }

  return Object.freeze(foldRelationshipJoints(pairRecords, interiorHits));
}

function foldRelationshipJoints(pairRecords, interiorHits) {
  const byPoint = new Map();
  for (const record of pairRecords) {
    const key = pointKey(record.point);
    if (!byPoint.has(key)) byPoint.set(key, []);
    byPoint.get(key).push(record);
  }

  const joints = [];
  const consumedPoints = new Set();

  for (const [key, records] of byPoint) {
    const modulesAtPoint = new Map();
    for (const record of records) {
      modulesAtPoint.set(record.a.moduleId, record.a);
      modulesAtPoint.set(record.b.moduleId, record.b);
    }
    const hasEndToEnd = records.some((record) => record.kind === 'end-to-end');
    const hasPerpendicular = records.some((record) => record.kind !== 'end-to-end');
    if (modulesAtPoint.size >= 3 || (hasEndToEnd && hasPerpendicular)) {
      joints.push(freezeTeeJoint(
        [...modulesAtPoint.values()].map((segment) => freezeParticipant(segment, { payCorner: true })),
        records[0].point,
      ));
      consumedPoints.add(key);
      continue;
    }
    for (const record of records) {
      joints.push(freezeJoint(record.kind, record.a, record.b, record.point));
    }
  }

  const interiorByPoint = new Map();
  for (const hit of interiorHits) {
    const key = pointKey(hit.point);
    if (consumedPoints.has(key) || byPoint.has(key)) continue;
    if (!interiorByPoint.has(key)) interiorByPoint.set(key, []);
    interiorByPoint.get(key).push(hit);
  }

  for (const hits of interiorByPoint.values()) {
    const participants = [freezeParticipant(hits[0].host, { payCorner: false })];
    const seenHosts = new Set([hits[0].host.moduleId]);
    for (const hit of hits) {
      if (hit.host.moduleId !== hits[0].host.moduleId) continue;
      if (seenHosts.has(hit.branch.moduleId)) continue;
      seenHosts.add(hit.branch.moduleId);
      participants.push(freezeParticipant(hit.branch, { payCorner: true }));
    }
    joints.push(freezeTeeJoint(participants, hits[0].point));
  }

  return joints;
}

/**
 * Collinear end-to-end joints between eligible modules. Order-independent.
 */
export function detectEndToEndJoints(modules = []) {
  return Object.freeze(
    detectRelationshipJoints(modules).filter((joint) => joint.kind === 'end-to-end'),
  );
}

function lineKey(itemKey, unit) {
  return `${itemKey}\u0000${unit}`;
}

function quantityOf(lines, itemKey, unit = 'adet') {
  const found = lines.find((line) => line.itemKey === itemKey && line.unit === unit);
  return found ? Number(found.quantity) : 0;
}

function buildPlan(joints) {
  const plan = {
    upright: 0,
    single: 0,
    double: 0,
    corner: 0,
    endCount: 0,
    cornerCount: 0,
    endUpright: 0,
    endSingle: 0,
    endDouble: 0,
    cornerUpright: 0,
    cornerSingle: 0,
    cornerConnectors: 0,
    teeCount: 0,
    teeUpright: 0,
    teeSingle: 0,
    teeCorners: 0,
    swapModuleIds: [],
  };

  for (const joint of joints) {
    const adjustment = jointAdjustment(joint);
    if (!adjustment) continue;
    plan.upright += adjustment.upright;
    plan.single += adjustment.single;
    plan.double += adjustment.double;
    plan.corner += adjustment.corner;
    if (joint.kind === 'corner') {
      plan.cornerCount += 1;
      plan.cornerUpright += Math.abs(adjustment.upright);
      plan.cornerSingle += Math.abs(adjustment.single);
      plan.cornerConnectors += adjustment.corner;
      plan.swapModuleIds.push(...adjustment.swapModuleIds);
    } else if (joint.kind === 'tee') {
      plan.teeCount += 1;
      plan.teeUpright += Math.abs(adjustment.upright);
      plan.teeSingle += Math.abs(adjustment.single);
      plan.teeCorners += adjustment.corner;
      plan.swapModuleIds.push(...adjustment.swapModuleIds);
    } else {
      plan.endCount += 1;
      plan.endUpright += Math.abs(adjustment.upright);
      plan.endSingle += Math.abs(adjustment.single);
      plan.endDouble += adjustment.double;
    }
  }

  plan.swapModuleIds = [...new Set(plan.swapModuleIds)];
  return plan;
}

function applyDeltas(lines, plan) {
  const byKey = new Map();
  for (const line of lines) {
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
      item,
    });
  }

  adjust('upright_346_5', plan.upright);
  adjust('connector_single', plan.single);
  adjust('connector_double', plan.double);
  adjust('connector_corner', plan.corner);

  return Array.from(byKey.values())
    .filter((line) => Number(line.quantity) > 0)
    .map((line) => Object.freeze(line));
}

function adjustmentNotes(plan) {
  const notes = [];
  if (plan.endCount) {
    notes.push(
      `Yan yana birleşim: ${plan.endCount} eklem (−${plan.endUpright} dikme, −${plan.endSingle} tekli, +${plan.endDouble} çiftli).`,
    );
  }
  if (plan.cornerCount) {
    notes.push(
      `İç köşe: ${plan.cornerCount} eklem (−${plan.cornerUpright} dikme, −${plan.cornerSingle} tekli, +${plan.cornerConnectors} köşe aparatı).`,
    );
  }
  if (plan.teeCount) {
    notes.push(
      `T birleşim: ${plan.teeCount} eklem (−${plan.teeUpright} dikme, −${plan.teeSingle} tekli, +${plan.teeCorners} köşe aparatı, çiftli yok).`,
    );
  }
  return notes;
}

/**
 * Apply locked end-to-end and inner-corner deltas to aggregated leaf lines.
 * Panel substitution is separate: swapModuleIds lists modules whose straight panels become corner panels.
 * If upright or single quantity would go negative, skips every joint.
 */
export function applyRelationshipBomAdjustments(lines = [], joints = []) {
  const baseLines = Array.isArray(lines) ? lines.map((line) => ({ ...line })) : [];
  const jointList = Array.isArray(joints) ? joints : [];
  const plan = buildPlan(jointList);

  if (plan.endCount + plan.cornerCount + plan.teeCount === 0) {
    return Object.freeze({
      lines: Object.freeze(baseLines.map((line) => Object.freeze(line))),
      appliedJointCount: 0,
      appliedEndToEndCount: 0,
      appliedCornerCount: 0,
      appliedTeeCount: 0,
      swapModuleIds: Object.freeze([]),
      notes: Object.freeze([]),
    });
  }

  const uprightNeed = Math.abs(plan.upright);
  const singleNeed = Math.abs(plan.single);
  const uprightHave = quantityOf(baseLines, 'upright_346_5');
  const singleHave = quantityOf(baseLines, 'connector_single');

  if (uprightHave < uprightNeed || singleHave < singleNeed) {
    return Object.freeze({
      lines: Object.freeze(baseLines.map((line) => Object.freeze(line))),
      appliedJointCount: 0,
      appliedEndToEndCount: 0,
      appliedCornerCount: 0,
      appliedTeeCount: 0,
      swapModuleIds: Object.freeze([]),
      notes: Object.freeze([
        `Birleşim düzeltmesi atlandı: yetersiz stok (dikme ${uprightHave}/${uprightNeed}, tekli ${singleHave}/${singleNeed}).`,
      ]),
    });
  }

  return Object.freeze({
    lines: Object.freeze(applyDeltas(baseLines, plan)),
    appliedJointCount: plan.endCount + plan.cornerCount + plan.teeCount,
    appliedEndToEndCount: plan.endCount,
    appliedCornerCount: plan.cornerCount,
    appliedTeeCount: plan.teeCount,
    swapModuleIds: Object.freeze(plan.swapModuleIds),
    notes: Object.freeze(adjustmentNotes(plan)),
  });
}

/**
 * Apply end-to-end joint deltas. Corner joints in the same list are applied too.
 */
export function applyEndToEndBomAdjustments(lines = [], joints = []) {
  return applyRelationshipBomAdjustments(lines, joints);
}

/** Straight or cam panel key → inner-corner panel key. Separator panels are not mapped. */
export function cornerPanelKey(itemKey) {
  if (STRAIGHT_TO_CORNER_PANEL[itemKey]) return STRAIGHT_TO_CORNER_PANEL[itemKey];
  if (typeof itemKey === 'string' && itemKey.startsWith('panel_cam_')) {
    const corner = STRAIGHT_TO_CORNER_PANEL[`panel_${itemKey.slice('panel_cam_'.length)}`];
    if (!corner) return null;
    return `panel_corner_cam_${corner.slice('panel_corner_'.length)}`;
  }
  return null;
}

export function applyCornerPanelSwap(lines = []) {
  return lines.map((line) => {
    const nextKey = cornerPanelKey(line?.itemKey);
    if (!nextKey) return line;
    const item = getItem(nextKey);
    if (!item) return line;
    return {
      ...line,
      itemKey: nextKey,
      name: item.name,
      material: item.material ?? null,
      item,
    };
  });
}

export function applyCornerPanelSwapToSurfaces(surfaces = []) {
  return surfaces.map((surface) => {
    if (!surface || typeof surface !== 'object') return surface;
    const nextKey = cornerPanelKey(surface.itemKey);
    if (!nextKey || !getItem(nextKey)) return surface;
    return { ...surface, itemKey: nextKey };
  });
}
