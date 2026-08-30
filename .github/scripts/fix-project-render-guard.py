from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')

old_dispatch = """      } else {
        module = createFlatPanelModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      }

      const widthCm = Number(moduleState.widthCm);
"""
new_dispatch = """      } else if (moduleState.type === 'flat-panel') {
        module = createFlatPanelModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else {
        console.warn('Desteklenmeyen modül tipi atlandı:', moduleState.type, moduleState.id);
        return;
      }

      const widthCm = Number(moduleState.widthCm);
"""
if old_dispatch not in s:
    raise SystemExit('buildWall dispatcher block not found')
s = s.replace(old_dispatch, new_dispatch, 1)

old_surface = """    const surfaceState = moduleState.strips[stripIndex];
    const isGlass = Boolean(surfaceState.isGlass);
"""
new_surface = """    const surfaceState = moduleState.strips?.[stripIndex];
    if (!surfaceState) {
      console.warn('Eksik panel strip state atlandı:', moduleState.type, moduleState.id, stripIndex);
      continue;
    }
    const isGlass = Boolean(surfaceState.isGlass);
"""
if old_surface not in s:
    raise SystemExit('flat panel strip block not found')
s = s.replace(old_surface, new_surface, 1)

p.write_text(s, encoding='utf-8')
