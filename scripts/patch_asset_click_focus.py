from pathlib import Path

p = Path('src/main.js')
with p.open('r', encoding='utf-8', newline='') as f:
    raw = f.read()
nl = '\r\n' if '\r\n' in raw else '\n'
s = raw.replace('\r\n', '\n')

old = """function setActiveAsset(assetId) {\n  activeAssetId = assetId;\n  renderAssetLibrary();\n  const asset = imageAssets.get(assetId);\n"""
new = """function setActiveAsset(assetId, { focus = false } = {}) {\n  activeAssetId = assetId;\n  renderAssetLibrary();\n  if (focus && assetId) {\n    const activeTile = [...assetLibraryElement.querySelectorAll('.asset-tile')]\n      .find((tile) => tile.dataset.assetId === assetId);\n    activeTile?.focus({ preventScroll: true });\n  }\n  const asset = imageAssets.get(assetId);\n"""
if s.count(old) != 1:
    raise SystemExit('setActiveAsset block not found')
s = s.replace(old, new, 1)

old_click = """      button.addEventListener('click', () => {\n        closeAssetContextMenu();\n        setActiveAsset(asset.id);\n      });\n"""
new_click = """      button.addEventListener('click', () => {\n        closeAssetContextMenu();\n        setActiveAsset(asset.id, { focus: true });\n      });\n"""
if s.count(old_click) != 1:
    raise SystemExit('asset click block not found')
s = s.replace(old_click, new_click, 1)

old_ctx = """        setActiveAsset(asset.id);\n        button.focus({ preventScroll: true });\n        openAssetContextMenu(asset.id, event.clientX, event.clientY);\n"""
new_ctx = """        setActiveAsset(asset.id, { focus: true });\n        openAssetContextMenu(asset.id, event.clientX, event.clientY);\n"""
if s.count(old_ctx) != 1:
    raise SystemExit('asset context focus block not found')
s = s.replace(old_ctx, new_ctx, 1)

with p.open('w', encoding='utf-8', newline='') as f:
    f.write(s.replace('\n', nl))

# Static regression assertion.
t = Path('test/imageAssetDeletion.test.js')
text = t.read_text(encoding='utf-8')
needle = "  assert.match(main, /button\\.addEventListener\\('contextmenu'/);\n"
replacement = needle + "  assert.match(main, /setActiveAsset\\(asset\\.id, \\{ focus: true \\}\\)/);\n"
if replacement not in text:
    if text.count(needle) != 1:
        raise SystemExit('test anchor not found')
    text = text.replace(needle, replacement, 1)
t.write_text(text, encoding='utf-8')
print('asset click focus fix applied')
