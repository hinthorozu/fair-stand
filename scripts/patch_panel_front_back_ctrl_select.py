from pathlib import Path
import re

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')

# Ctrl/Cmd range selection used to reject every module whose placement.wallId was
# "free". That made wall-backed rows selectable while freestanding/front rows
# silently returned before building the range. Describe both wall planes and
# coplanar free rows with one stable planeKey instead.
pattern = re.compile(
    r"  function getSurfaceSelectionPlaneMeta\(surface\) \{\n.*?\n  \}\n\n  function selectRectangleTo",
    re.DOTALL,
)
replacement = """  function getSurfaceSelectionPlaneMeta(surface) {
    if (!surface || surface.userData?.selectionMode !== 'panel') return null;
    const moduleGroup = findModuleGroup(surface);
    const moduleState = moduleGroup?.userData?.moduleState;
    const placement = moduleState?.placement ?? moduleGroup?.userData?.placement;
    const wallId = placement?.wallId ?? null;
    const moduleId = surface.userData.moduleId ?? moduleState?.id ?? null;

    if (['back', 'left', 'right'].includes(wallId)) {
      const pathCm = wallId === 'back'
        ? Number(placement.xCm)
        : Number(placement.yCm);
      if (!Number.isFinite(pathCm)) return null;
      return {
        wallId,
        planeKey: `wall:${wallId}`,
        pathCm,
        moduleId,
      };
    }

    // Ön/serbest sıradaki modüller placement.wallId === 'free' olur. Aynı
    // fiziksel doğrultu ve aynı çapraz koordinattaki modülleri tek seçim
    // düzlemi say; başka bir serbest sıraya Ctrl seçiminin taşmasını engelle.
    if (wallId !== 'free') return null;
    const xCm = Number(placement.xCm);
    const yCm = Number(placement.yCm);
    if (!Number.isFinite(xCm) || !Number.isFinite(yCm)) return null;

    const rotationZDeg = normalizeModuleRotationZDeg(placement.rotationZDeg);
    const vertical = isVerticalModuleRotation(rotationZDeg);
    const pathCm = vertical ? yCm : xCm;
    const crossCm = vertical ? xCm : yCm;
    const axis = vertical ? 'y' : 'x';
    const quantizedCrossCm = Math.round(crossCm * 10) / 10;

    return {
      wallId,
      planeKey: `free:${axis}:${quantizedCrossCm}`,
      pathCm,
      moduleId,
    };
  }

  function selectRectangleTo"""
scene, count = pattern.subn(replacement, scene, count=1)
if count != 1:
    raise SystemExit(f'expected one selection-plane function, found {count}')

old_guard = "if (!anchorMeta || !targetMeta || anchorMeta.wallId !== targetMeta.wallId) return;"
new_guard = "if (!anchorMeta || !targetMeta || anchorMeta.planeKey !== targetMeta.planeKey) return;"
if old_guard not in scene:
    raise SystemExit('selection plane guard not found')
scene = scene.replace(old_guard, new_guard, 1)

old_filter = ".filter((entry) => entry.meta?.wallId === anchorMeta.wallId);"
new_filter = ".filter((entry) => entry.meta?.planeKey === anchorMeta.planeKey);"
if old_filter not in scene:
    raise SystemExit('selection plane filter not found')
scene = scene.replace(old_filter, new_filter, 1)

scene_path.write_text(scene, encoding='utf-8')
