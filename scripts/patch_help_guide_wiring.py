from pathlib import Path

path = Path('src/main.js')
data = path.read_bytes()
newline = b'\r\n' if b'\r\n' in data else b'\n'

replacements = [
    (
        b"import './imageActions.css';" + newline,
        b"import './imageActions.css';" + newline + b"import './helpGuide.css';" + newline,
        b"import './helpGuide.css';",
    ),
    (
        b"import { createStandScene } from './scene3d.js';" + newline,
        b"import { createStandScene } from './scene3d.js';" + newline + b"import { initHelpGuide } from './helpGuide.js';" + newline,
        b"import { initHelpGuide } from './helpGuide.js';",
    ),
    (
        b"initializeAssetLibrary();" + newline + b"refreshProjectList()",
        b"initializeAssetLibrary();" + newline + b"initHelpGuide();" + newline + b"refreshProjectList()",
        b"initHelpGuide();",
    ),
]

for old, new, marker in replacements:
    if marker in data:
        continue
    if old not in data:
        raise SystemExit(f'Expected wiring anchor not found: {old!r}')
    data = data.replace(old, new, 1)

path.write_bytes(data)
