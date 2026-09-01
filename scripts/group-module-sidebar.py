from pathlib import Path

path = Path('src/moduleDragSidebar.js')
text = path.read_text()

old_styles = """    .module-drag-catalog { display:flex; flex-direction:column; gap:8px; }\n    .module-drag-hint { margin:0; color:#7a8494; font-size:10px; line-height:1.45; }\n    .module-drag-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }\n"""
new_styles = """    .module-drag-catalog { display:flex; flex-direction:column; gap:8px; }\n    .module-drag-hint { margin:0; color:#7a8494; font-size:10px; line-height:1.45; }\n    .module-drag-groups { display:flex; flex-direction:column; gap:7px; }\n    .module-drag-group { overflow:hidden; border:1px solid #d9dee5; border-radius:10px; background:#fff; }\n    .module-drag-group > summary { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 10px; color:#364152; font-size:11px; font-weight:700; cursor:pointer; user-select:none; list-style:none; }\n    .module-drag-group > summary::-webkit-details-marker { display:none; }\n    .module-drag-group > summary::after { content:'▸'; color:#7a8494; font-size:12px; transition:transform .15s ease; }\n    .module-drag-group[open] > summary::after { transform:rotate(90deg); }\n    .module-drag-group[open] > summary { border-bottom:1px solid #e6eaf0; }\n    .module-drag-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; padding:7px; }\n"""
if old_styles not in text:
    raise SystemExit('styles anchor not found')
text = text.replace(old_styles, new_styles, 1)

old_root = """  const grid = document.createElement('div');\n  grid.className = 'module-drag-grid';\n  root.append(hint, grid);\n  anchorButton.parentElement.insertBefore(root, anchorButton);\n\n  let enabled = false;\n"""
new_root = """  const groupsRoot = document.createElement('div');\n  groupsRoot.className = 'module-drag-groups';\n  root.append(hint, groupsRoot);\n  anchorButton.parentElement.insertBefore(root, anchorButton);\n\n  const groupDefinitions = [\n    {\n      label: 'Panel & Duvar',\n      keys: ['wall_200', 'wall_150', 'wall_100', 'wall_50', 'wall_separator_100', 'wall_separator_50', 'wall_base_200', 'wall_base_150', 'wall_base_100', 'DOOR_100'],\n    },\n    {\n      label: 'Raf & Vitrin',\n      keys: ['wall_showcase_100_3', 'wall_showcase_100_2', 'wall_shelf_3_200', 'wall_shelf_3_150', 'wall_shelf_3_100', 'wall_shelf_2_200', 'wall_shelf_2_150', 'wall_shelf_2_100'],\n    },\n    {\n      label: 'Banko & Baza',\n      keys: ['desk_banko_200', 'desk_banko_150', 'desk_banko_100', 'desk_banko_200_L', 'desk_banko_150_L', 'desk_banko_100_L', 'BASE_200', 'BASE_150', 'BASE_100'],\n    },\n    {\n      label: 'Mobilya',\n      keys: ['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic'],\n    },\n    {\n      label: 'Elektronik & Aydınlatma',\n      keys: ['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT'],\n    },\n  ];\n\n  const groupGridByKey = new Map();\n  groupDefinitions.forEach((group, index) => {\n    const details = document.createElement('details');\n    details.className = 'module-drag-group';\n    details.open = index === 0;\n\n    const summary = document.createElement('summary');\n    summary.textContent = group.label;\n\n    const grid = document.createElement('div');\n    grid.className = 'module-drag-grid';\n    details.append(summary, grid);\n    groupsRoot.appendChild(details);\n    group.keys.forEach((moduleKey) => groupGridByKey.set(moduleKey, grid));\n  });\n\n  let enabled = false;\n"""
if old_root not in text:
    raise SystemExit('root anchor not found')
text = text.replace(old_root, new_root, 1)

old_append = """      grid.appendChild(card);\n      return card;\n"""
new_append = """      const targetGrid = groupGridByKey.get(moduleKey);\n      if (!targetGrid) {\n        throw new Error(`Module catalog group missing for ${moduleKey}`);\n      }\n      targetGrid.appendChild(card);\n      return card;\n"""
if old_append not in text:
    raise SystemExit('append anchor not found')
text = text.replace(old_append, new_append, 1)

path.write_text(text)
