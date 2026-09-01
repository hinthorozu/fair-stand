from pathlib import Path

path = Path('src/scene3d.js')
s = path.read_text()

old = '''  function getGroundPoint(clientX, clientY) {
    if (!activeFloor.visible) return null;
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(activeFloor, false)[0];
    if (!hit) return null;
    return {
      xCm: hit.point.x * 100,
      yCm: hit.point.z * 100,
    };
  }
'''
new = old + '''\n  function getDragPlanePoint(clientX, clientY, worldY) {
    if (!Number.isFinite(Number(worldY))) return null;
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -Number(worldY));
    const point = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, point)) return null;
    return {
      xCm: point.x * 100,
      yCm: point.z * 100,
    };
  }
'''
if old not in s:
    raise SystemExit('getGroundPoint block not found')
s = s.replace(old, new, 1)

old = '''    controls.enabled = false;
    dragSession = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moduleGroup: picked.moduleGroup,
      moduleState,
      dragging: false,
      preview: null,
      preferredRotationZDeg: normalizeModuleRotationZDeg(moduleState.placement?.rotationZDeg),
      rotationLocked: false,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
    };
'''
new = '''    controls.enabled = false;
    const dragRotationZDeg = normalizeModuleRotationZDeg(moduleState.placement?.rotationZDeg);
    const dragVertical = isVerticalModuleRotation(dragRotationZDeg);
    const moduleWidthCm = Number(moduleState.widthCm) || 0;
    const moduleCenterXCm = Number(moduleState.placement?.xCm || 0) + (dragVertical ? 0 : moduleWidthCm / 2);
    const moduleCenterYCm = Number(moduleState.placement?.yCm || 0) + (dragVertical ? moduleWidthCm / 2 : 0);
    const dragPlaneY = Number(picked.hit?.point?.y);
    const dragStartPoint = getDragPlanePoint(event.clientX, event.clientY, dragPlaneY);
    dragSession = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moduleGroup: picked.moduleGroup,
      moduleState,
      dragging: false,
      preview: null,
      preferredRotationZDeg: dragRotationZDeg,
      rotationLocked: false,
      dragPlaneY,
      dragAnchorOffsetXCm: dragStartPoint ? moduleCenterXCm - dragStartPoint.xCm : 0,
      dragAnchorOffsetYCm: dragStartPoint ? moduleCenterYCm - dragStartPoint.yCm : 0,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
    };
'''
if old not in s:
    raise SystemExit('dragSession block not found')
s = s.replace(old, new, 1)

old = '''    const ground = getGroundPoint(event.clientX, event.clientY);
    if (!ground) {
      disposePlacementGhost();
      dragSession.preview = null;
      showPlacementFeedback('Modülü aktif stand alanına bırak.', {
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return;
    }

    const snapped = snapPlacementToStand({
'''
new = '''    const anchoredPoint = moduleState.placement?.wallId === 'free'
      ? getDragPlanePoint(event.clientX, event.clientY, dragSession.dragPlaneY)
      : null;
    const ground = anchoredPoint
      ? {
          xCm: anchoredPoint.xCm + Number(dragSession.dragAnchorOffsetXCm || 0),
          yCm: anchoredPoint.yCm + Number(dragSession.dragAnchorOffsetYCm || 0),
        }
      : getGroundPoint(event.clientX, event.clientY);
    if (!ground) {
      disposePlacementGhost();
      dragSession.preview = null;
      showPlacementFeedback('Modülü aktif stand alanına bırak.', {
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return;
    }

    const snapped = snapPlacementToStand({
'''
if old not in s:
    raise SystemExit('generic drag ground block not found')
s = s.replace(old, new, 1)

path.write_text(s)
