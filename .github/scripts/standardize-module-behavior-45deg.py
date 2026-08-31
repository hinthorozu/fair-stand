from pathlib import Path
import re

# --- 1) Central module behavior registry ---
behavior = r'''const DEFAULT_BEHAVIOR = Object.freeze({
  placement: 'wall',
  moveSnapCm: 50,
  rotationStepDeg: 90,
  defaultRotationDeg: 0,
  allowSideInsert: true,
  collision: 'segment',
});

const TYPE_BEHAVIORS = Object.freeze({
  counter: Object.freeze({
    placement: 'free',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  base: Object.freeze({
    placement: 'free',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'sofa-set-classic': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'table-chair-set-eames': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'bar-stool': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'led-floodlight': Object.freeze({
    placement: 'top',
    moveSnapCm: 20,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'none',
  }),
});

const STRAIGHT_COUNTER_WIDTHS_CM = new Set([100, 150, 200]);

function normalizeDescriptor(moduleOrType) {
  if (typeof moduleOrType === 'string') return { type: moduleOrType };
  return moduleOrType ?? {};
}

export function getModuleBehavior(moduleOrType) {
  const module = normalizeDescriptor(moduleOrType);
  const type = module.type ?? null;
  const base = TYPE_BEHAVIORS[type] ?? DEFAULT_BEHAVIOR;

  // Only the verified straight Banko family (100/150/200) gets 45-degree turns.
  if (
    type === 'counter'
    && module.shape !== 'L'
    && STRAIGHT_COUNTER_WIDTHS_CM.has(Number(module.widthCm))
  ) {
    return { ...base, rotationStepDeg: 45 };
  }

  return base;
}

export function getModuleRotationStepDeg(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).rotationStepDeg) || 90;
}

export function getModuleDefaultRotationDeg(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).defaultRotationDeg) || 0;
}

export function getModuleMoveSnapCm(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).moveSnapCm) || 50;
}

export function isFreePlacementModule(moduleOrType) {
  return getModuleBehavior(moduleOrType).placement === 'free';
}

export function isTopPlacementModule(moduleOrType) {
  return getModuleBehavior(moduleOrType).placement === 'top';
}
'''
Path('src/moduleBehavior.js').write_text(behavior)

# --- 2) moduleDragSidebar: standard default rotation + per-module R step ---
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
if "./moduleBehavior.js" not in s:
    s = s.replace(
        "import { ALUMINUM_PROFILE_COLOR } from './theme.js';\n",
        "import { ALUMINUM_PROFILE_COLOR } from './theme.js';\nimport { getModuleDefaultRotationDeg, getModuleRotationStepDeg } from './moduleBehavior.js';\n",
        1,
    )
s = s.replace(
    "hint.textContent = 'Kartı sahneye sürükle · R: +90° · Shift+R: -90° · 50 cm grid';",
    "hint.textContent = 'Kartı sahneye sürükle · R/Shift+R: modül standardına göre döndür · grid modüle göre';",
)
s = s.replace(
    "activeRotationZDeg = state.type === 'bar-stool' ? 270 : 0;",
    "activeRotationZDeg = getModuleDefaultRotationDeg(state);",
)
s = s.replace(
    "const deltaDeg = event.shiftKey ? -90 : 90;\n    activeRotationZDeg = ((activeRotationZDeg + deltaDeg) % 360 + 360) % 360;",
    "const rotationStepDeg = getModuleRotationStepDeg(activeModuleState);\n    const deltaDeg = event.shiftKey ? -rotationStepDeg : rotationStepDeg;\n    activeRotationZDeg = ((activeRotationZDeg + deltaDeg) % 360 + 360) % 360;",
)
p.write_text(s)

# --- 3) main: default placement rotation from registry ---
p = Path('src/main.js')
s = p.read_text()
if "./moduleBehavior.js" not in s:
    insert_after = "import { getContinuousWallSegments, planContinuousWallInsertion } from './wallReflow.js';\n"
    s = s.replace(insert_after, insert_after + "import { getModuleDefaultRotationDeg } from './moduleBehavior.js';\n", 1)
s = s.replace(
    "rotationZDeg: moduleState.type === 'bar-stool' ? 270 : 0,",
    "rotationZDeg: getModuleDefaultRotationDeg(moduleState),",
)
p.write_text(s)

# --- 4) modulePlacement: behavior-driven snap + 45-degree geometry ---
p = Path('src/modulePlacement.js')
s = p.read_text()
if "./moduleBehavior.js" not in s:
    s = s.replace(
        "import { STAND_DIMENSIONS } from './catalog.js';\n",
        "import { STAND_DIMENSIONS } from './catalog.js';\nimport { getModuleMoveSnapCm } from './moduleBehavior.js';\n",
        1,
    )
s = s.replace(
    "export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90, 180, 270]);",
    "export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 45, 90, 135, 180, 225, 270, 315]);",
)
old_norm = '''export function normalizeModuleRotationZDeg(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const quarterTurns = Math.round(number / 90);
  return ((quarterTurns * 90) % 360 + 360) % 360;
}'''
new_norm = '''export function normalizeModuleRotationZDeg(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const eighthTurns = Math.round(number / 45);
  return ((eighthTurns * 45) % 360 + 360) % 360;
}'''
if old_norm not in s:
    raise SystemExit('normalizeModuleRotationZDeg block not found')
s = s.replace(old_norm, new_norm, 1)

s = s.replace(
    "export function getModulePlacementSnapCm(moduleType) {\n  return moduleType === 'sofa-set-classic' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool'\n    ? 10\n    : MODULE_PLACEMENT_SNAP_CM;\n}",
    "export function getModulePlacementSnapCm(moduleType) {\n  return getModuleMoveSnapCm(moduleType);\n}",
)

# Helpers after isVerticalModuleRotation.
needle = '''export function isVerticalModuleRotation(rotationZDeg) {
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  return rotation === 90 || rotation === 270;
}
'''
helpers = needle + '''\nfunction isCardinalModuleRotation(rotationZDeg) {
  return normalizeModuleRotationZDeg(rotationZDeg) % 90 === 0;
}

function getPlacementCenterCm(placement, widthCm) {
  if (!placement) return null;
  const width = Number(widthCm);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  return {
    xCm: x + (vertical ? 0 : width / 2),
    yCm: y + (vertical ? width / 2 : 0),
  };
}

function placementFromCenterCm({ centerXCm, centerYCm, widthCm, rotationZDeg, template = {} }) {
  const width = Number(widthCm);
  const vertical = isVerticalModuleRotation(rotationZDeg);
  return createModulePlacement({
    ...template,
    xCm: vertical ? centerXCm : centerXCm - width / 2,
    yCm: vertical ? centerYCm - width / 2 : centerYCm,
    rotationZDeg,
    wallId: template.wallId ?? 'free',
  });
}

function getRotatedHalfExtentsCm(widthCm, depthCm, rotationZDeg) {
  const width = Number(widthCm);
  const depth = Number(depthCm);
  const radians = normalizeModuleRotationZDeg(rotationZDeg) * Math.PI / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return {
    halfX: (cos * width + sin * depth) / 2,
    halfY: (sin * width + cos * depth) / 2,
  };
}
'''
if needle not in s:
    raise SystemExit('isVertical block not found')
s = s.replace(needle, helpers, 1)

# Replace rotate center math with helper-based center preservation.
pattern = re.compile(r"export function rotateModulePlacementAroundCenter\(placement, widthCm, deltaDeg = 90, depthCm = null\) \{.*?\n\}", re.S)
m = pattern.search(s)
if not m:
    raise SystemExit('rotateModulePlacementAroundCenter not found')
new_rotate = '''export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90, depthCm = null) {
  if (!placement) return null;
  const width = Number(widthCm);
  if (!Number.isFinite(width) || width <= 0) return null;
  const center = getPlacementCenterCm(placement, width);
  if (!center) return null;

  const nextRotation = rotateModuleRotationZDeg(placement.rotationZDeg, deltaDeg);
  return placementFromCenterCm({
    centerXCm: center.xCm,
    centerYCm: center.yCm,
    widthCm: width,
    rotationZDeg: nextRotation,
    template: placement,
  });
}'''
s = s[:m.start()] + new_rotate + s[m.end():]

# Strict-depth free boundary: use actual rotated AABB.
old_bounds = '''    const strictDepth = hasStrictDepthBounds(depthCm);
    if (strictDepth) {
      const halfDepth = Number(depthCm) / 2;
      if (vertical) {
        if (x - halfDepth < 0 || x + halfDepth > xLimit || y < 0 || y + width > yLimit) {
          return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
        }
      } else if (x < 0 || x + width > xLimit || y - halfDepth < 0 || y + halfDepth > yLimit) {
        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
      }
    } else {'''
new_bounds = '''    const strictDepth = hasStrictDepthBounds(depthCm);
    if (strictDepth) {
      const center = getPlacementCenterCm(placement, width);
      const extents = getRotatedHalfExtentsCm(width, depthCm, rotation);
      if (
        !center
        || center.xCm - extents.halfX < -EPSILON_CM
        || center.xCm + extents.halfX > xLimit + EPSILON_CM
        || center.yCm - extents.halfY < -EPSILON_CM
        || center.yCm + extents.halfY > yLimit + EPSILON_CM
      ) {
        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
      }
    } else {'''
if old_bounds not in s:
    raise SystemExit('strict boundary block not found')
s = s.replace(old_bounds, new_bounds, 1)

# Add SAT helpers before placementsOverlap and use them for non-cardinal rotations.
needle = "export function placementsOverlap(moduleA, moduleB) {\n"
sat_helpers = '''function getOrientedFootprint(module) {
  const placement = module?.placement;
  const width = Number(module?.widthCm);
  const depth = getModuleCollisionDepthCm(module);
  if (!placement || !Number.isFinite(width) || width <= 0 || !Number.isFinite(depth) || depth <= 0) return null;
  const center = getPlacementCenterCm(placement, width);
  if (!center) return null;
  const radians = normalizeModuleRotationZDeg(placement.rotationZDeg) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    center,
    axes: [
      { x: cos, y: -sin },
      { x: sin, y: cos },
    ],
    half: [width / 2, depth / 2],
  };
}

function orientedFootprintsOverlap(moduleA, moduleB) {
  const a = getOrientedFootprint(moduleA);
  const b = getOrientedFootprint(moduleB);
  if (!a || !b) return false;
  const delta = {
    x: b.center.xCm - a.center.xCm,
    y: b.center.yCm - a.center.yCm,
  };
  const axes = [...a.axes, ...b.axes];
  return axes.every((axis) => {
    const centerDistance = Math.abs(delta.x * axis.x + delta.y * axis.y);
    const radiusA = a.half[0] * Math.abs(a.axes[0].x * axis.x + a.axes[0].y * axis.y)
      + a.half[1] * Math.abs(a.axes[1].x * axis.x + a.axes[1].y * axis.y);
    const radiusB = b.half[0] * Math.abs(b.axes[0].x * axis.x + b.axes[0].y * axis.y)
      + b.half[1] * Math.abs(b.axes[1].x * axis.x + b.axes[1].y * axis.y);
    return centerDistance < radiusA + radiusB - EPSILON_CM;
  });
}

'''
if needle not in s:
    raise SystemExit('placementsOverlap marker not found')
s = s.replace(needle, sat_helpers + needle, 1)
s = s.replace(
    "export function placementsOverlap(moduleA, moduleB) {\n  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;",
    "export function placementsOverlap(moduleA, moduleB) {\n  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;\n  const angleA = normalizeModuleRotationZDeg(moduleA?.placement?.rotationZDeg);\n  const angleB = normalizeModuleRotationZDeg(moduleB?.placement?.rotationZDeg);\n  if (!isLCounterModule(moduleA) && !isLCounterModule(moduleB) && (!isCardinalModuleRotation(angleA) || !isCardinalModuleRotation(angleB))) {\n    return orientedFootprintsOverlap(moduleA, moduleB);\n  }",
    1,
)

# Non-cardinal free placement: place by rotated AABB center, still store in legacy anchor form.
needle = '''  const strictDepth = hasStrictDepthBounds(depthCm);
  const halfDepth = strictDepth ? Number(depthCm) / 2 : 0;
  const minX = vertical && strictDepth ? halfDepth : 0;'''
replacement = '''  const strictDepth = hasStrictDepthBounds(depthCm);
  const halfDepth = strictDepth ? Number(depthCm) / 2 : 0;

  if (strictDepth && !isCardinalModuleRotation(rotation)) {
    const extents = getRotatedHalfExtentsCm(width, depthCm, rotation);
    if (xLimit < extents.halfX * 2 || yLimit < extents.halfY * 2) return null;
    const centerXCm = clamp(snapCm(pointerX, placementSnapCm), extents.halfX, xLimit - extents.halfX);
    const centerYCm = clamp(snapCm(pointerY, placementSnapCm), extents.halfY, yLimit - extents.halfY);
    return placementFromCenterCm({
      centerXCm,
      centerYCm,
      widthCm: width,
      rotationZDeg: rotation,
      template: { wallId: 'free' },
    });
  }

  const minX = vertical && strictDepth ? halfDepth : 0;'''
if needle not in s:
    raise SystemExit('createFreePlacement strict block not found')
s = s.replace(needle, replacement, 1)

# Avoid old axis-only magnetic snapping at 45/135/etc.
needle = '''  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);
  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';'''
replacement = '''  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);
  if (!isCardinalModuleRotation(resolvedRotation)) return null;
  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';'''
if needle not in s:
    raise SystemExit('snapPlacementToModules rotation marker not found')
s = s.replace(needle, replacement, 1)

# Free side insertion: arbitrary angle vector, preserving target rotation.
pattern = re.compile(r"function getVisualRightAxisDirection\(rotationZDeg\) \{.*?\n\}\n\nexport function createFreeSidePlacement\(\{.*?\n\}", re.S)
m = pattern.search(s)
if not m:
    raise SystemExit('free side placement block not found')
new_side = '''function getVisualRightVector(rotationZDeg) {
  const radians = normalizeModuleRotationZDeg(rotationZDeg) * Math.PI / 180;
  return { x: Math.cos(radians), y: -Math.sin(radians) };
}

export function createFreeSidePlacement({
  sourcePlacement,
  sourceWidthCm,
  insertedWidthCm,
  side = 'right',
} = {}) {
  if (!sourcePlacement || (side !== 'left' && side !== 'right')) return null;
  const sourceWidth = Number(sourceWidthCm);
  const insertedWidth = Number(insertedWidthCm);
  if (![sourceWidth, insertedWidth].every(Number.isFinite) || sourceWidth <= 0 || insertedWidth <= 0) return null;

  const rotationZDeg = normalizeModuleRotationZDeg(sourcePlacement.rotationZDeg);
  const sourceCenter = getPlacementCenterCm(sourcePlacement, sourceWidth);
  if (!sourceCenter) return null;
  const right = getVisualRightVector(rotationZDeg);
  const direction = side === 'right' ? 1 : -1;
  const centerDistance = (sourceWidth + insertedWidth) / 2;

  return placementFromCenterCm({
    centerXCm: sourceCenter.xCm + right.x * centerDistance * direction,
    centerYCm: sourceCenter.yCm + right.y * centerDistance * direction,
    widthCm: insertedWidth,
    rotationZDeg,
    template: {
      zCm: sourcePlacement.zCm ?? 0,
      wallId: 'free',
    },
  });
}'''
s = s[:m.start()] + new_side + s[m.end():]

# Ensure validation receives module type/shape in free-side plan.
s = s.replace(
    "      depthCm: module.depthCm,\n      moduleId: module.id,\n      modules: [...modules, ...plannedModules],",
    "      depthCm: module.depthCm,\n      moduleId: module.id,\n      moduleType: module.type,\n      shape: module.shape,\n      modules: [...modules, ...plannedModules],",
)
p.write_text(s)

# --- 5) scene3d: consume standard behavior for fixture class and R step ---
p = Path('src/scene3d.js')
s = p.read_text()
if "./moduleBehavior.js" not in s:
    marker = "import {\n  planContinuousModuleInsert,\n  planContinuousModuleMove,\n} from './moduleMove.js';\n"
    s = s.replace(marker, marker + "import { getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule } from './moduleBehavior.js';\n", 1)
s = re.sub(
    r"function isFloorFixtureType\(type\) \{.*?\n\}\n\nfunction isTopFixtureType\(type\) \{.*?\n\}",
    "function isFloorFixtureType(type) {\n  return isFreePlacementModule(type);\n}\n\nfunction isTopFixtureType(type) {\n  return isTopPlacementModule(type);\n}",
    s,
    count=1,
    flags=re.S,
)
old = '''    const nextPlacement = rotateModulePlacementAroundCenter(
      moduleState.placement,
      moduleState.widthCm,
      deltaDeg,
      moduleState.depthCm,
    );'''
new = '''    const stepDeg = getModuleRotationStepDeg(moduleState);
    const effectiveDeltaDeg = deltaDeg < 0 ? -stepDeg : stepDeg;
    const nextPlacement = rotateModulePlacementAroundCenter(
      moduleState.placement,
      moduleState.widthCm,
      effectiveDeltaDeg,
      moduleState.depthCm,
    );'''
if old not in s:
    raise SystemExit('rotateSelectedModule call not found')
s = s.replace(old, new, 1)
p.write_text(s)

# --- 6) Add regression tests for behavior registry and 45-degree placement math ---
test = r'''import { describe, expect, it } from 'vitest';
import {
  getModuleBehavior,
  getModuleDefaultRotationDeg,
  getModuleMoveSnapCm,
  getModuleRotationStepDeg,
} from '../src/moduleBehavior.js';
import {
  createModulePlacement,
  normalizeModuleRotationZDeg,
  rotateModulePlacementAroundCenter,
  validateModulePlacement,
} from '../src/modulePlacement.js';

describe('module behavior registry', () => {
  it('gives straight 100/150/200 counters 45 degree rotation steps', () => {
    for (const widthCm of [100, 150, 200]) {
      expect(getModuleRotationStepDeg({ type: 'counter', shape: 'straight', widthCm })).toBe(45);
    }
    expect(getModuleRotationStepDeg({ type: 'counter', shape: 'L', widthCm: 150 })).toBe(90);
  });

  it('keeps Bar Taburesi at 10 cm snap, 45 degree turns and 270 default', () => {
    const stool = { type: 'bar-stool', widthCm: 60 };
    expect(getModuleMoveSnapCm(stool)).toBe(10);
    expect(getModuleRotationStepDeg(stool)).toBe(45);
    expect(getModuleDefaultRotationDeg(stool)).toBe(270);
    expect(getModuleBehavior(stool).placement).toBe('free');
  });
});

describe('45 degree placement', () => {
  it('preserves module center while rotating 45 degrees', () => {
    const start = createModulePlacement({ xCm: 100, yCm: 100, rotationZDeg: 0, wallId: 'free' });
    const next = rotateModulePlacementAroundCenter(start, 100, 45, 50);
    expect(next.rotationZDeg).toBe(45);
    expect(next.xCm).toBe(100);
    expect(next.yCm).toBe(100);
  });

  it('normalizes eighth turns instead of forcing quarter turns', () => {
    expect(normalizeModuleRotationZDeg(44)).toBe(45);
    expect(normalizeModuleRotationZDeg(136)).toBe(135);
    expect(normalizeModuleRotationZDeg(315)).toBe(315);
  });

  it('uses rotated footprint for stand bounds', () => {
    const placement = createModulePlacement({ xCm: 0, yCm: 25, rotationZDeg: 45, wallId: 'free' });
    const result = validateModulePlacement({
      placement,
      widthCm: 100,
      depthCm: 50,
      standType: 'island',
      standXCm: 300,
      standYCm: 300,
    });
    expect(result.ok).toBe(false);
  });
});
'''
Path('tests/moduleBehavior.test.js').write_text(test)

print('Module behavior registry + 45-degree rotation standardization applied.')
