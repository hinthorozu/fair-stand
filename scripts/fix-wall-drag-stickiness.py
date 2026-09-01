from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')

old = """    const pointedModule = pickModuleAt(clientX, clientY)?.moduleGroup?.userData?.moduleState;
    const pointedWallId = pointedModule?.placement?.wallId;
    const targetWallId = allowedWalls.includes(pointedWallId) ? pointedWallId : null;
    const candidateWalls = targetWallId ? [targetWallId] : allowedWalls;
    const intersections = [];
"""
new = """    const targetWallId = allowedWalls.includes(preferredWallId) ? preferredWallId : null;
    const candidateWalls = allowedWalls;
    const intersections = [];
"""
if old not in s:
    raise SystemExit('wall overlay candidate block not found')
s = s.replace(old, new, 1)

old = """    if (!intersections.length) return null;
    intersections.sort((a, b) => a.distance - b.distance);
    const { wallId, hit } = intersections[0];
"""
new = """    if (!intersections.length) return null;
    intersections.sort((a, b) => a.distance - b.distance);
    const preferredIntersection = targetWallId
      ? intersections.find((entry) => entry.wallId === targetWallId)
      : null;
    const { wallId, hit } = preferredIntersection ?? intersections[0];
"""
if old not in s:
    raise SystemExit('wall overlay intersection selection block not found')
s = s.replace(old, new, 1)

old = """        const nearestWall = wallDistances[0];
        const wallSnapDistanceCm = 30;
        if (nearestWall && nearestWall.distanceCm <= wallSnapDistanceCm) {
          return { wallId: nearestWall.wallId, xCm, yCm, mode: 'wall' };
        }
"""
new = """        const nearestWall = wallDistances[0];
        const wallSnapDistanceCm = 30;
        const preferredWall = wallDistances.find((entry) => entry.wallId === preferredWallId);
        const snapWall = preferredWall && preferredWall.distanceCm <= wallSnapDistanceCm
          ? preferredWall
          : nearestWall;
        if (snapWall && snapWall.distanceCm <= wallSnapDistanceCm) {
          return { wallId: snapWall.wallId, xCm, yCm, mode: 'wall' };
        }
"""
if old not in s:
    raise SystemExit('top fixture snap selection block not found')
s = s.replace(old, new, 1)

old = """    if (isWallOverlayModule(moduleState.type)) {
      const pointedModule = pickModuleAt(event.clientX, event.clientY)?.moduleGroup?.userData?.moduleState;
      const pointedOnWall = ['back', 'left', 'right'].includes(pointedModule?.placement?.wallId);
      if (!pointedOnWall) {
        const placement = getFreeTvPlacement(
          event.clientX,
          event.clientY,
          moduleState,
          dragSession.preferredRotationZDeg,
        );
        if (!placement) {
          disposePlacementGhost();
          dragSession.preview = null;
          showPlacementFeedback('TV\\'yi aktif stand alanında sürükle.', {
            clientX: event.clientX,
            clientY: event.clientY,
          });
          return;
        }
        dragSession.preview = {
          placement,
          valid: true,
          message: null,
          plan: {
            ok: true,
            movingPlacement: { ...placement },
            placements: new Map([[moduleState.id, { ...placement }]]),
          },
          snap: { mode: 'free' },
        };
        showPlacementGhost(moduleState, placement, true);
        clearPlacementFeedback();
        return;
      }
      const wallPoint = getWallOverlayDragPoint(
        event.clientX,
        event.clientY,
        pointedModule.placement.wallId,
        moduleState,
      );
      if (!wallPoint) {
        disposePlacementGhost();
        dragSession.preview = null;
        showPlacementFeedback('TV bu yüzeye taşınamadı.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }
"""
new = """    if (isWallOverlayModule(moduleState.type)) {
      const currentWallId = ['back', 'left', 'right'].includes(dragSession.preview?.placement?.wallId)
        ? dragSession.preview.placement.wallId
        : (['back', 'left', 'right'].includes(moduleState.placement?.wallId) ? moduleState.placement.wallId : null);
      const wallPoint = getWallOverlayDragPoint(
        event.clientX,
        event.clientY,
        currentWallId,
        moduleState,
      );
      if (!wallPoint) {
        const placement = getFreeTvPlacement(
          event.clientX,
          event.clientY,
          moduleState,
          dragSession.preferredRotationZDeg,
        );
        if (!placement) {
          disposePlacementGhost();
          dragSession.preview = null;
          showPlacementFeedback('TV\\'yi aktif stand alanında sürükle.', {
            clientX: event.clientX,
            clientY: event.clientY,
          });
          return;
        }
        dragSession.preview = {
          placement,
          valid: true,
          message: null,
          plan: {
            ok: true,
            movingPlacement: { ...placement },
            placements: new Map([[moduleState.id, { ...placement }]]),
          },
          snap: { mode: 'free' },
        };
        showPlacementGhost(moduleState, placement, true);
        clearPlacementFeedback();
        return;
      }
"""
if old not in s:
    raise SystemExit('wall overlay placement drag block not found')
s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')

# Contract test: wall drag must honor current/preferred surface before switching.
t = Path('test/wallDragStickiness.test.js')
t.write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('wall overlay drag prefers its current wall while that wall intersection remains valid', () => {
  assert.match(source, /const targetWallId = allowedWalls\.includes\(preferredWallId\) \? preferredWallId : null/);
  assert.match(source, /const preferredIntersection = targetWallId/);
  assert.match(source, /preferredIntersection \?\? intersections\[0\]/);
});

test('wall overlay move uses the dragged module current wall instead of the module under the pointer', () => {
  assert.match(source, /const currentWallId = \['back', 'left', 'right'\]\.includes\(dragSession\.preview\?\.placement\?\.wallId\)/);
  assert.match(source, /getWallOverlayDragPoint\([\s\S]*?currentWallId,[\s\S]*?moduleState/);
});

test('top fixture keeps preferred wall when both walls are within the existing 30 cm snap zone', () => {
  assert.match(source, /const wallSnapDistanceCm = 30/);
  assert.match(source, /const preferredWall = wallDistances\.find\(\(entry\) => entry\.wallId === preferredWallId\)/);
  assert.match(source, /const snapWall = preferredWall && preferredWall\.distanceCm <= wallSnapDistanceCm/);
});
""", encoding='utf-8')
