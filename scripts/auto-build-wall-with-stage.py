from pathlib import Path

index = Path('index.html')
s = index.read_text()
start = s.index('        <details class="panel-card collapsible-panel">\n          <summary class="panel-summary"><span>Düz duvar</span>')
end = s.index('        <details class="panel-card collapsible-panel">\n          <summary class="panel-summary"><span>Modül ekle</span>', start)
s = s[:start] + s[end:]
index.write_text(s)

p = Path('src/main.js')
s = p.read_text()
s = s.replace("const wallLengthInput = document.querySelector('#wall-length');\nconst buildWallButton = document.querySelector('#build-wall');\n", "")
s = s.replace("const wallResult = document.querySelector('#wall-result');\n", "")
s = s.replace("  wallLengthInput.disabled = !enabled;\n  buildWallButton.disabled = !enabled;\n", "")
s = s.replace("  wallLengthInput.max = String(capacityCm);\n  wallLengthInput.value = String(capacityCm);\n", "")
s = s.replace("  wallResult.textContent = message;\n  wallResult.classList.toggle('error', isError);\n", "  if (isError) console.warn(message);\n")
s = s.replace("    syncWallLengthFromSetup(result);\n", "")
s = s.replace("  syncWallLengthFromSetup(setup);\n", "")
s = s.replace("    syncWallLengthFromSetup(currentStand);\n", "")
old = """  setStandEditingEnabled(true);\n  renderWallResult('Duvar boş.');\n\n  const label = STAND_TYPE_LABELS[setup.standType];\n"""
new = """  setStandEditingEnabled(true);\n\n  const automaticWall = composeAutomaticStandWall({\n    lengthCm: getAutomaticWallCapacityCm({\n      standType: setup.standType,\n      standXCm: setup.xCm,\n      standYCm: setup.yCm,\n    }),\n    standType: setup.standType,\n    standXCm: setup.xCm,\n    standYCm: setup.yCm,\n  });\n  if (!automaticWall.ok) {\n    renderStageResult(automaticWall.message, true);\n    return;\n  }\n  currentModules = automaticWall.widths.map((widthCm, index) => {\n    const moduleState = createFlatPanelModuleState(widthCm);\n    moduleState.placement = { ...automaticWall.placements[index] };\n    return moduleState;\n  });\n  rebuildWall({ resetView: true });\n\n  const label = STAND_TYPE_LABELS[setup.standType];\n"""
if old not in s:
    raise SystemExit('stage insertion target not found')
s = s.replace(old, new)
start = s.index('function confirmExistingScene(message) {')
end = s.index("clearWallButton.addEventListener('click', () => {", start)
s = s[:start] + s[end:]
p.write_text(s)

# trigger workflow
