from pathlib import Path

# scene3d: real 3D aluminum frame color comes from one shared constant.
p = Path('src/scene3d.js')
s = p.read_text()
if "import { ALUMINUM_PROFILE_COLOR } from './theme.js';" not in s:
    s = s.replace("import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';\n", "import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';\nimport { ALUMINUM_PROFILE_COLOR } from './theme.js';\n")
s = s.replace('const FRAME_COLOR = 0x9aa0a6;', 'const FRAME_COLOR = ALUMINUM_PROFILE_COLOR;')
p.write_text(s)

# Context picker previews: use the same aluminum color.
p = Path('src/moduleContextMenu.js')
s = p.read_text()
if "import { ALUMINUM_PROFILE_COLOR } from './theme.js';" not in s:
    s = s.replace("import { MODULE_CATALOG } from './catalog.js';\n", "import { MODULE_CATALOG } from './catalog.js';\nimport { ALUMINUM_PROFILE_COLOR } from './theme.js';\n")
s = s.replace("frame.style.border = '5px solid #6f767d';", "frame.style.border = `5px solid ${ALUMINUM_PROFILE_COLOR}`;")
s = s.replace("shelf.style.border = '1px solid #9aa0a6';", "shelf.style.border = `1px solid ${ALUMINUM_PROFILE_COLOR}`;")
s = s.replace("opening.style.borderTop = '2px solid #747b82';", "opening.style.borderTop = `2px solid ${ALUMINUM_PROFILE_COLOR}`;")
s = s.replace("opening.style.borderBottom = '2px solid #747b82';", "opening.style.borderBottom = `2px solid ${ALUMINUM_PROFILE_COLOR}`;")
s = s.replace("door.style.borderTop = '3px solid #747b82';", "door.style.borderTop = `3px solid ${ALUMINUM_PROFILE_COLOR}`;")
p.write_text(s)

# Sidebar drag previews: all aluminum/profile borders use one shared constant.
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
if "import { ALUMINUM_PROFILE_COLOR } from './theme.js';" not in s:
    s = s.replace("import { MODULE_CATALOG } from './catalog.js';\n", "import { MODULE_CATALOG } from './catalog.js';\nimport { ALUMINUM_PROFILE_COLOR } from './theme.js';\n")
for color in ['#8a929a', '#747b82', '#7b838c', '#9aa0a6']:
    s = s.replace(color, '${ALUMINUM_PROFILE_COLOR}')
p.write_text(s)

# CSS-based context picker previews read the same runtime CSS variable.
p = Path('src/style.css')
s = p.read_text()
s = s.replace('border: 5px solid #6f767d;', 'border: 5px solid var(--aluminum-profile-color);')
s = s.replace('border-bottom: 2px solid #747b82;', 'border-bottom: 2px solid var(--aluminum-profile-color);')
p.write_text(s)

# trigger
