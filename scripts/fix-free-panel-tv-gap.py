from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
old = """      return {
        wallId: 'free',
        pointerXCm: hit.x * 100,
        pointerYCm: hit.z * 100,
        rotationZDeg,
        zCm,
        freePanelSupport: true,
        supportModuleId: pointedModuleState.id,
      };"""
new = """      const supportVertical = isVerticalModuleRotation(supportRotationZDeg);
      // Use the picked surface only for the along-panel coordinate and height.
      // Along the panel thickness axis, keep the overlay on the support module's
      // center line. createTvModule already offsets the 5 cm TV body to the wall face;
      // feeding the visible face coordinate here would apply that offset twice and
      // leave a visible gap between a free panel and the TV.
      const supportCenterXCm = Number(pointedModuleState.placement.xCm || 0);
      const supportCenterYCm = Number(pointedModuleState.placement.yCm || 0);

      return {
        wallId: 'free',
        pointerXCm: supportVertical ? supportCenterXCm : hit.x * 100,
        pointerYCm: supportVertical ? hit.z * 100 : supportCenterYCm,
        rotationZDeg,
        zCm,
        freePanelSupport: true,
        supportModuleId: pointedModuleState.id,
      };"""
if old not in text:
    raise SystemExit('free panel support return block not found')
path.write_text(text.replace(old, new, 1))
