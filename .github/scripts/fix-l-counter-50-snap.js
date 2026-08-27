import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing patch target: ${label}`);
  return text.replace(from, to);
}

const placementFile = 'src/modulePlacement.js';
let placement = fs.readFileSync(placementFile, 'utf8');

const helperMarker = 'function pointIsSegmentEndpoint(segment, coordinateCm) {';
const helpers = `function isLCounterModule(module) {
  return module?.type === 'counter' && module?.shape === 'L';
}

function createGroundSegmentFromWorldPoints(startPoint, endPoint) {
  const dx = Number(endPoint.xCm) - Number(startPoint.xCm);
  const dy = Number(endPoint.yCm) - Number(startPoint.yCm);
  if (![dx, dy].every(Number.isFinite)) return null;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      axis: 'x',
      fixedCm: (Number(startPoint.yCm) + Number(endPoint.yCm)) / 2,
      startCm: Math.min(Number(startPoint.xCm), Number(endPoint.xCm)),
      endCm: Math.max(Number(startPoint.xCm), Number(endPoint.xCm)),
    };
  }

  return {
    axis: 'y',
    fixedCm: (Number(startPoint.xCm) + Number(endPoint.xCm)) / 2,
    startCm: Math.min(Number(startPoint.yCm), Number(endPoint.yCm)),
    endCm: Math.max(Number(startPoint.yCm), Number(endPoint.yCm)),
  };
}

function getLCounterCollisionSegments(module) {
  if (!isLCounterModule(module)) return [];
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  const depthCm = Number(module?.depthCm);
  if (!placement || !Number.isFinite(widthCm) || !Number.isFinite(depthCm) || widthCm <= 0 || depthCm <= 0) {
    return [];
  }

  const armCm = 50;
  const rotationDeg = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const vertical = isVerticalModuleRotation(rotationDeg);
  const placementX = Number(placement.xCm);
  const placementY = Number(placement.yCm);
  if (!Number.isFinite(placementX) || !Number.isFinite(placementY)) return [];

  const centerX = placementX + (vertical ? 0 : widthCm / 2);
  const centerY = placementY + (vertical ? widthCm / 2 : 0);
  const radians = rotationDeg * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const toWorld = (localX, localY) => ({
    xCm: centerX + localX * cos + localY * sin,
    yCm: centerY - localX * sin + localY * cos,
  });
  const createLocalSegment = (x1, y1, x2, y2) => createGroundSegmentFromWorldPoints(
    toWorld(x1, y1),
    toWorld(x2, y2),
  );

  const armModule = { ...module, depthCm: armCm, shape: null };
  return [
    createLocalSegment(
      -widthCm / 2,
      -depthCm / 2 + armCm / 2,
      widthCm / 2,
      -depthCm / 2 + armCm / 2,
    ),
    createLocalSegment(
      widthCm / 2 - armCm / 2,
      -depthCm / 2,
      widthCm / 2 - armCm / 2,
      depthCm / 2,
    ),
  ].filter(Boolean).map((segment) => ({ segment, module: armModule }));
}

function getModuleCollisionSegments(module) {
  const lSegments = getLCounterCollisionSegments(module);
  if (lSegments.length) return lSegments;
  const segment = getGroundSegment(module);
  return segment ? [{ segment, module }] : [];
}

`;
if (!placement.includes('function isLCounterModule(module) {')) {
  placement = replaceOnce(placement, helperMarker, helpers + helperMarker, 'L counter segment helpers');
}

const overlapStart = placement.indexOf('export function placementsOverlap(moduleA, moduleB) {');
const overlapEnd = placement.indexOf('export function validatePlacementAgainstModules({', overlapStart);
if (overlapStart < 0 || overlapEnd < 0) throw new Error('Missing placementsOverlap block');
const overlapReplacement = `function collisionSegmentsOverlap(a, moduleA, b, moduleB) {
  const depthA = getModuleCollisionDepthCm(moduleA);
  const depthB = getModuleCollisionDepthCm(moduleB);

  if (a.axis === b.axis) {
    const longitudinalOverlap = a.startCm < b.endCm - EPSILON_CM
      && b.startCm < a.endCm - EPSILON_CM;
    if (!longitudinalOverlap) return false;

    const centerLineGapCm = Math.abs(a.fixedCm - b.fixedCm);
    const requiredGapCm = (depthA + depthB) / 2;
    return centerLineGapCm < requiredGapCm - EPSILON_CM;
  }

  const horizontal = a.axis === 'x' ? a : b;
  const vertical = a.axis === 'y' ? a : b;
  const horizontalModule = a.axis === 'x' ? moduleA : moduleB;
  const verticalModule = a.axis === 'y' ? moduleA : moduleB;
  const horizontalDepth = getModuleCollisionDepthCm(horizontalModule);
  const verticalDepth = getModuleCollisionDepthCm(verticalModule);
  const intersectionX = vertical.fixedCm;
  const intersectionY = horizontal.fixedCm;
  const onHorizontal = intersectionX >= horizontal.startCm - EPSILON_CM
    && intersectionX <= horizontal.endCm + EPSILON_CM;
  const onVertical = intersectionY >= vertical.startCm - EPSILON_CM
    && intersectionY <= vertical.endCm + EPSILON_CM;

  if (onHorizontal && onVertical) {
    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);
    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);

    const counterModule = usesLogicalFixtureEndpoint(horizontalModule?.type)
      ? horizontalModule
      : (usesLogicalFixtureEndpoint(verticalModule?.type) ? verticalModule : null);
    if (counterModule) {
      const counterIsHorizontal = counterModule === horizontalModule;
      const counterSegment = counterIsHorizontal ? horizontal : vertical;
      const thinModule = counterIsHorizontal ? verticalModule : horizontalModule;
      const counterIntersectionCm = counterIsHorizontal ? intersectionX : intersectionY;
      const thinDepthCm = getModuleCollisionDepthCm(thinModule);
      const logicalCounterEndpointJoin = thinDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM
        && pointIsSegmentEndpoint(counterSegment, counterIntersectionCm);
      if (logicalCounterEndpointJoin) return false;
    }

    const thinEndpointJoin = horizontalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM
      && verticalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
    if (!thinEndpointJoin) return true;
    return !horizontalEndpoint && !verticalEndpoint;
  }

  const verticalHalfDepth = verticalDepth / 2;
  const horizontalHalfDepth = horizontalDepth / 2;
  const physicalXOverlap = intersectionX > horizontal.startCm - verticalHalfDepth + EPSILON_CM
    && intersectionX < horizontal.endCm + verticalHalfDepth - EPSILON_CM;
  const physicalYOverlap = intersectionY > vertical.startCm - horizontalHalfDepth + EPSILON_CM
    && intersectionY < vertical.endCm + horizontalHalfDepth - EPSILON_CM;
  return physicalXOverlap && physicalYOverlap;
}

export function placementsOverlap(moduleA, moduleB) {
  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;
  const segmentsA = getModuleCollisionSegments(moduleA);
  const segmentsB = getModuleCollisionSegments(moduleB);
  if (!segmentsA.length || !segmentsB.length) return false;

  return segmentsA.some((entryA) => segmentsB.some((entryB) => collisionSegmentsOverlap(
    entryA.segment,
    entryA.module,
    entryB.segment,
    entryB.module,
  )));
}

`;
placement = placement.slice(0, overlapStart) + overlapReplacement + placement.slice(overlapEnd);

placement = replaceOnce(
  placement,
  `  moduleId = null,\n  moduleType = null,\n  modules = [],\n`,
  `  moduleId = null,\n  moduleType = null,\n  shape = null,\n  modules = [],\n`,
  'validation shape argument',
);
placement = replaceOnce(
  placement,
  `    id: moduleId,\n    type: moduleType,\n    widthCm,\n`,
  `    id: moduleId,\n    type: moduleType,\n    shape,\n    widthCm,\n`,
  'candidate shape',
);
placement = replaceOnce(
  placement,
  `export function snapPlacementToModules({\n  moduleId = null,\n  moduleType = null,\n  widthCm,\n`,
  `export function snapPlacementToModules({\n  moduleId = null,\n  moduleType = null,\n  shape = null,\n  widthCm,\n`,
  'snap shape argument',
);
placement = replaceOnce(
  placement,
  `      moduleId,\n      moduleType,\n      modules,\n`,
  `      moduleId,\n      moduleType,\n      shape,\n      modules,\n`,
  'snap validation shape',
);

const modulesLoopMarker = `  modules.forEach((targetModule) => {\n    if (!targetModule?.placement || targetModule.id === moduleId) return;\n    const target = getGroundSegment(targetModule);\n`;
const thinHelper = `  const addThinTargetCandidates = (target, targetModuleForDepth, targetModuleId) => {
    if (!target) return;

    if (target.axis === movingAxis) {
      if (movingAxis === 'x') {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.endCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.startCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
      } else {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.endCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.startCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
      }
      return;
    }

    const targetDepthCm = getModuleCollisionDepthCm(targetModuleForDepth);
    const thinMovingModule = movingDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
    const matchesFixtureSide = thinMovingModule
      && usesLogicalFixtureEndpoint(targetModuleForDepth?.type)
      && targetDepthCm > MODULE_COLLISION_DEPTH_CM + EPSILON_CM
      && nearlyEqual(width, targetDepthCm);

    if (matchesFixtureSide) {
      [target.startCm, target.endCm].forEach((endpointCm) => {
        const placement = createModulePlacement({
          xCm: movingAxis === 'y' ? endpointCm : target.fixedCm - width / 2,
          yCm: movingAxis === 'y' ? target.fixedCm - width / 2 : endpointCm,
          zCm: 0,
          rotationZDeg: resolvedRotation,
          wallId: 'free',
        });
        placement.wallId = inferPlacementWallId({ placement, standType, standXCm });
        addCandidate(placement, targetModuleId, 'fixture-side', -2);
      });
    }

    getSegmentSnapCoordinates(target).forEach((coordinateCm) => {
      const pointXCm = target.axis === 'x' ? coordinateCm : target.fixedCm;
      const pointYCm = target.axis === 'y' ? coordinateCm : target.fixedCm;
      const targetEndpoint = nearlyEqual(coordinateCm, target.startCm)
        || nearlyEqual(coordinateCm, target.endCm);
      const snapKind = targetEndpoint ? 'corner' : 'tee';
      const priority = targetEndpoint ? 1 : 2;

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'start',
        standType,
        standXCm,
      }), targetModuleId, snapKind, priority);

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'end',
        standType,
        standXCm,
      }), targetModuleId, snapKind, priority);
    });
  };

  modules.forEach((targetModule) => {
    if (!targetModule?.placement || targetModule.id === moduleId) return;
    if (!strictMovingDepth && isLCounterModule(targetModule)) {
      getLCounterCollisionSegments(targetModule).forEach(({ segment, module: armModule }) => {
        addThinTargetCandidates(segment, armModule, targetModule.id);
      });
      return;
    }
    const target = getGroundSegment(targetModule);
`;
placement = replaceOnce(placement, modulesLoopMarker, thinHelper, 'L target snap handling');

fs.writeFileSync(placementFile, placement);

let scene = fs.readFileSync('src/scene3d.js', 'utf8');
scene = scene.replaceAll(
  '      moduleType: moduleState.type,\n',
  '      moduleType: moduleState.type,\n      shape: moduleState.shape,\n',
);
fs.writeFileSync('src/scene3d.js', scene);

let main = fs.readFileSync('src/main.js', 'utf8');
main = replaceOnce(
  main,
  `      widthCm: moduleState.widthCm,\n      moduleId: moduleState.id,\n      modules: [...currentModules, ...planned],\n`,
  `      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      moduleId: moduleState.id,\n      moduleType: moduleState.type,\n      shape: moduleState.shape,\n      modules: [...currentModules, ...planned],\n`,
  'append placement metadata',
);
fs.writeFileSync('src/main.js', main);

const testFile = 'test/lCounterPlacement.test.js';
fs.writeFileSync(testFile, `import test from 'node:test';
import assert from 'node:assert/strict';
import { placementsOverlap, snapPlacementToModules } from '../src/modulePlacement.js';

for (const size of [100, 150, 200]) {
  test(\`Köşe Banko \${size} empty inner area is not treated as a solid rectangle\`, () => {
    const counter = {
      id: \`l-counter-\${size}\`,
      type: 'counter',
      shape: 'L',
      widthCm: size,
      depthCm: size,
      placement: { xCm: 200, yCm: 400, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    };
    const voidStartY = 400 - size / 2 + 50;
    const panelInVoid = {
      id: 'panel-in-void',
      type: 'flat-panel',
      widthCm: 50,
      placement: { xCm: 225, yCm: voidStartY, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    };
    const panelOnReturnArm = {
      id: 'panel-on-arm',
      type: 'flat-panel',
      widthCm: 50,
      placement: { xCm: 200 + size - 25, yCm: 400 - 25, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    };

    assert.equal(placementsOverlap(counter, panelInVoid), false);
    assert.equal(placementsOverlap(counter, panelOnReturnArm), true);
  });

  test(\`Düz Panel 50 snaps flush to exposed short side of Köşe Banko \${size}\`, () => {
    const frontArmCenterY = 400 - size / 2 + 25;
    const counter = {
      id: \`l-counter-\${size}\`,
      type: 'counter',
      shape: 'L',
      widthCm: size,
      depthCm: size,
      placement: { xCm: 200, yCm: 400, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    };

    const result = snapPlacementToModules({
      moduleId: 'panel-50',
      moduleType: 'flat-panel',
      widthCm: 50,
      pointerXCm: 200,
      pointerYCm: frontArmCenterY,
      rotationZDeg: 90,
      modules: [counter],
      standType: 'island',
      standXCm: 1200,
      standYCm: 1200,
    });

    assert.equal(result?.snapKind, 'fixture-side');
    assert.deepEqual(result?.placement, {
      xCm: 200,
      yCm: frontArmCenterY - 25,
      zCm: 0,
      rotationZDeg: 90,
      wallId: 'free',
    });
  });
}
`);
