from pathlib import Path
import re

scene_path = Path("src/scene3d.js")
with scene_path.open("r", encoding="utf-8", newline="") as handle:
    scene = handle.read()

newline = "\r\n" if "\r\n" in scene else "\n"

start_marker = "  function getSurfaceSelectionPlaneMeta(surface) {"
end_marker = "  function selectRectangleTo"
start = scene.find(start_marker)
end = scene.find(end_marker, start + len(start_marker))
if start < 0 or end < 0:
    raise SystemExit("selection-plane function markers not found")

function_text = """  function getSurfaceSelectionPlaneMeta(surface) {
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

""".replace("\n", newline)

scene = scene[:start] + function_text + scene[end:]

old_guard_re = re.compile(
    r"if\s*\(\s*!anchorMeta\s*\|\|\s*!targetMeta\s*\|\|\s*anchorMeta\.wallId\s*!==\s*targetMeta\.wallId\s*\)\s*return;"
)
new_guard = "if (!anchorMeta || !targetMeta || anchorMeta.planeKey !== targetMeta.planeKey) return;"
if new_guard not in scene:
    scene, guard_count = old_guard_re.subn(new_guard, scene, count=1)
    if guard_count != 1:
        raise SystemExit("selection plane guard not found")

old_filter_re = re.compile(
    r"\.filter\(\(entry\)\s*=>\s*entry\.meta\?\.wallId\s*===\s*anchorMeta\.wallId\);"
)
new_filter = ".filter((entry) => entry.meta?.planeKey === anchorMeta.planeKey);"
if new_filter not in scene:
    scene, filter_count = old_filter_re.subn(new_filter, scene, count=1)
    if filter_count != 1:
        raise SystemExit("selection plane filter not found")

with scene_path.open("w", encoding="utf-8", newline="") as handle:
    handle.write(scene)
