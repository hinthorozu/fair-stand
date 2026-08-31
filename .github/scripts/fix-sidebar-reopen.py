from pathlib import Path

index = Path('index.html')
text = index.read_text()
text = text.replace('      <aside class="sidebar" id="sidebar">\n        <button id="sidebar-toggle" class="sidebar-toggle" type="button" aria-label="Menüyü kapat" aria-expanded="true" title="Menüyü kapat">‹</button>\n', '      <button id="sidebar-toggle" class="sidebar-toggle" type="button" aria-label="Menüyü kapat" aria-expanded="true" title="Menüyü kapat">‹</button>\n      <aside class="sidebar" id="sidebar">\n', 1)
index.write_text(text)

style = Path('src/style.css')
text = style.read_text()
text = text.replace("#app.sidebar-collapsed .sidebar > :not(.sidebar-toggle) {\n  display: none;\n}\n\n#app.sidebar-collapsed .sidebar-toggle {\n  left: 10px;\n}\n", "#app.sidebar-collapsed .sidebar > * {\n  display: none;\n}\n\n#app.sidebar-collapsed > .sidebar-toggle {\n  left: 10px;\n}\n", 1)
text = text.replace('.sidebar-toggle {\n  position: fixed;\n  z-index: 20;', '.sidebar-toggle {\n  position: fixed;\n  z-index: 1000;', 1)
style.write_text(text)
