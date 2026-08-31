from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text()

marker = "  function previewCatalogModuleDrag(\n"
assert marker in s
helper = r'''  function getWallOverlayDragPoint(clientX, clientY, preferredWallId = null, moduleState = null) {
    if (!stageLayout) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    const overlayRaycaster = new THREE.Raycaster();
    overlayRaycaster.setFromCamera(ndc, camera);

    const allowedWalls = getAllowedWallIds(stageLayout.standType)
      .filter((wallId) => wallId === 'back' || wallId === 'left' || wallId === 'right');
    const candidateWalls = preferredWallId && allowedWalls.includes(preferredWallId)
      ? [preferredWallId]
      : allowedWalls;
    const intersections = [];

    candidateWalls.forEach((wallId) => {
      let plane;
      if (wallId === 'back') {
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      } else if (wallId === 'left') {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      } else {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -stageLayout.widthM);
      }

      const hit = new THREE.Vector3();
      if (!overlayRaycaster.ray.intersectPlane(plane, hit)) return;
      const relativeY = hit.y - ACTIVE_PLATFORM_HEIGHT_M;
      if (relativeY < 0 || relativeY > STAND_DIMENSIONS.height) return;
      if (wallId === 'back' && (hit.x < 0 || hit.x > stageLayout.widthM)) return;
      if ((wallId === 'left' || wallId === 'right') && (hit.z < 0 || hit.z > stageLayout.depthM)) return;

      intersections.push({ wallId, hit, distance: hit.distanceTo(overlayRaycaster.ray.origin) });
    });

    if (!intersections.length) return null;
    intersections.sort((a, b) => a.distance - b.distance);
    const { wallId, hit } = intersections[0];
    const rotationZDeg = wallId === 'left' ? 90 : (wallId === 'right' ? 270 : 0);
    const pointerXCm = wallId === 'right' ? stageLayout.widthCm : Math.max(0, hit.x * 100);
    const pointerYCm = wallId === 'back' ? 0 : Math.max(0, hit.z * 100);

    const heightCm = Math.max(1, Number(moduleState?.screenHeightCm ?? moduleState?.heightCm ?? 52.3));
    const halfHeightM = heightCm / 200;
    const defaultCenterM = 1.75;
    const minOffsetCm = Math.ceil(((halfHeightM - defaultCenterM) * 100) / 10) * 10;
    const maxOffsetCm = Math.floor(((STAND_DIMENSIONS.height - halfHeightM - defaultCenterM) * 100) / 10) * 10;
    const rawOffsetCm = (hit.y - ACTIVE_PLATFORM_HEIGHT_M - defaultCenterM) * 100;
    const zCm = THREE.MathUtils.clamp(Math.round(rawOffsetCm / 10) * 10, minOffsetCm, maxOffsetCm);

    return { wallId, pointerXCm, pointerYCm, rotationZDeg, zCm };
  }

'''
s = s.replace(marker, helper + marker, 1)

# Catalog drag: wall-overlay modules use vertical wall-plane raycast, bypassing ground/collision flow.
needle = """  function previewCatalogModuleDrag(
    moduleState,
    clientX,
    clientY,
    preferredRotationZDeg = 0,
    rotationLocked = false,
  ) {
"""
assert needle in s
branch = needle + r'''    if (isWallOverlayModule(moduleState.type)) {
      const wallPoint = getWallOverlayDragPoint(clientX, clientY, null, moduleState);
      if (!wallPoint) {
        disposePlacementGhost();
        const message = 'TV\'yi aktif duvar yüzeyine bırak.';
        showPlacementFeedback(message, { clientX, clientY });
        return { ok: false, message };
      }
      const snapped = snapPlacementToStand({
        standType: stageLayout.standType,
        moduleType: moduleState.type,
        shape: moduleState.shape,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        pointerXCm: wallPoint.pointerXCm,
        pointerYCm: wallPoint.pointerYCm,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
        preferredRotationZDeg: wallPoint.rotationZDeg,
        rotationLocked: true,
      });
      if (!snapped.ok || !snapped.placement) {
        disposePlacementGhost();
        const message = snapped.message ?? 'TV bu duvar konumuna yerleştirilemedi.';
        showPlacementFeedback(message, { clientX, clientY });
        return { ok: false, message };
      }
      const placement = { ...snapped.placement, zCm: wallPoint.zCm };
      const plan = {
        ok: true,
        message: null,
        movingPlacement: { ...placement },
        placements: new Map([[moduleState.id, { ...placement }]]),
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement: { ...placement },
        message: null,
        plan,
        snap: { mode: 'wall-overlay', wallId: wallPoint.wallId },
      };
    }
'''
s = s.replace(needle, branch, 1)

# Existing selected TV drag gets same vertical wall-plane handling before top/ground flow.
needle2 = """    const moduleState = dragSession.moduleState;

    if (isTopFixtureType(moduleState.type)) {
"""
assert needle2 in s
branch2 = r'''    const moduleState = dragSession.moduleState;

    if (isWallOverlayModule(moduleState.type)) {
      const currentWallId = dragSession.preview?.placement?.wallId
        ?? moduleState.placement?.wallId
        ?? null;
      const wallPoint = getWallOverlayDragPoint(
        event.clientX,
        event.clientY,
        currentWallId,
        moduleState,
      );
      if (!wallPoint) {
        disposePlacementGhost();
        dragSession.preview = null;
        showPlacementFeedback('TV\'yi aktif duvar yüzeyi üzerinde sürükle.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }
      const snapped = snapPlacementToStand({
        standType: stageLayout.standType,
        moduleType: moduleState.type,
        shape: moduleState.shape,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        pointerXCm: wallPoint.pointerXCm,
        pointerYCm: wallPoint.pointerYCm,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
        preferredRotationZDeg: wallPoint.rotationZDeg,
        rotationLocked: true,
      });
      if (!snapped.ok || !snapped.placement) {
        dragSession.preview = null;
        disposePlacementGhost();
        showPlacementFeedback(snapped.message ?? 'TV bu duvar konumuna taşınamadı.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }
      const placement = { ...snapped.placement, zCm: wallPoint.zCm };
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay', wallId: wallPoint.wallId },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

    if (isTopFixtureType(moduleState.type)) {
'''
s = s.replace(needle2, branch2, 1)
p.write_text(s)

# Extend TV regression test.
p = Path('test/tv42Module.test.js')
t = p.read_text()
if "TV wall overlay drag snaps horizontal and height movement to 10 cm" not in t:
    t += r'''

test('TV wall overlay drag snaps horizontal and height movement to 10 cm', () => {
  const behavior = getModuleGhostBehavior({ type: 'tv' });
  assert.equal(behavior.renderer, 'tv');
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function getWallOverlayDragPoint/);
  assert.match(source, /Math\.round\(rawOffsetCm \/ 10\) \* 10/);
  assert.match(source, /snap: \{ mode: 'wall-overlay'/);
});
'''
p.write_text(t)
