from pathlib import Path

index = Path('index.html')
text = index.read_text()
old = '      <aside class="sidebar">\n        <div class="sidebar-intro">'
new = '      <aside class="sidebar" id="sidebar">\n        <button id="sidebar-toggle" class="sidebar-toggle" type="button" aria-label="Menüyü kapat" aria-expanded="true" title="Menüyü kapat">‹</button>\n        <div class="sidebar-intro">'
assert old in text
index.write_text(text.replace(old, new, 1))

style = Path('src/style.css')
text = style.read_text()
text = text.replace('  grid-template-columns: 330px minmax(0, 1fr);', '  grid-template-columns: 330px minmax(0, 1fr);\n  transition: grid-template-columns 180ms ease;')
needle = '''.sidebar {\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  overflow-y: auto;\n  padding: 22px;\n  background: rgba(250, 251, 252, 0.98);\n  border-right: 1px solid #d9dee5;\n  box-shadow: 6px 0 22px rgba(17, 24, 39, 0.04);\n}\n'''
replacement = needle + '''\n.sidebar-toggle {\n  position: fixed;\n  z-index: 20;\n  top: 12px;\n  left: 292px;\n  width: 28px;\n  height: 42px;\n  padding: 0;\n  border-radius: 8px;\n  font-size: 25px;\n  line-height: 1;\n  box-shadow: 0 3px 12px rgba(17, 24, 39, 0.16);\n  transition: left 180ms ease, transform 120ms ease;\n}\n\n#app.sidebar-collapsed {\n  grid-template-columns: 0 minmax(0, 1fr);\n}\n\n#app.sidebar-collapsed .sidebar {\n  overflow: visible;\n  padding: 0;\n  border-right: 0;\n  box-shadow: none;\n}\n\n#app.sidebar-collapsed .sidebar > :not(.sidebar-toggle) {\n  display: none;\n}\n\n#app.sidebar-collapsed .sidebar-toggle {\n  left: 10px;\n}\n'''
assert needle in text
style.write_text(text.replace(needle, replacement, 1))

main = Path('src/main.js')
text = main.read_text()
needle = "const viewport = document.querySelector('#viewport');\n"
replacement = "const appElement = document.querySelector('#app');\nconst sidebarToggleButton = document.querySelector('#sidebar-toggle');\n" + needle
assert needle in text
text = text.replace(needle, replacement, 1)

marker = "const projectLoadingDetail = document.querySelector('#project-loading-detail');\n"
addition = marker + '''\nfunction setSidebarCollapsed(collapsed) {\n  appElement?.classList.toggle('sidebar-collapsed', collapsed);\n  if (sidebarToggleButton) {\n    sidebarToggleButton.textContent = collapsed ? '›' : '‹';\n    sidebarToggleButton.setAttribute('aria-expanded', String(!collapsed));\n    sidebarToggleButton.setAttribute('aria-label', collapsed ? 'Menüyü aç' : 'Menüyü kapat');\n    sidebarToggleButton.title = collapsed ? 'Menüyü aç' : 'Menüyü kapat';\n  }\n  window.dispatchEvent(new Event('resize'));\n}\n\nsidebarToggleButton?.addEventListener('click', () => {\n  setSidebarCollapsed(!appElement?.classList.contains('sidebar-collapsed'));\n});\n'''
assert marker in text
main.write_text(text.replace(marker, addition, 1))
