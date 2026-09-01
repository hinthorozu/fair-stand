from pathlib import Path
p=Path('src/moduleDragSidebar.js')
s=p.read_text()
css="""    .module-drag-tv { position:relative; width:66px; height:54px; }
    .module-drag-tv::before { content:''; position:absolute; left:4px; top:3px; width:58px; height:36px; box-sizing:border-box; border:4px solid #26292d; border-radius:2px; background:#f8fafc; box-shadow:0 2px 5px rgba(15,23,42,.12); }
    .module-drag-tv::after { content:''; position:absolute; left:22px; top:39px; width:22px; height:5px; background:#30343a; box-shadow:0 7px 0 -1px #30343a; clip-path:polygon(27% 0,73% 0,86% 100%,100% 100%,100% 100%,0 100%,14% 100%); }
"""
anchor="    .module-drag-floodlight { position:relative; width:52px; height:52px; }\n"
if css not in s:
    if anchor not in s: raise SystemExit('css anchor missing')
    s=s.replace(anchor, css+anchor)
branch="""  if (module.type === 'tv') {
    const body = document.createElement('div');
    body.className = 'module-drag-tv';
    preview.appendChild(body);
    return preview;
  }

"""
anchor2="  if (module.type === 'led-floodlight') {\n"
if branch not in s:
    if anchor2 not in s: raise SystemExit('branch anchor missing')
    s=s.replace(anchor2, branch+anchor2)
p.write_text(s)

t=Path('test/tv42Module.test.js')
ts=t.read_text()
extra="""\ntest('TV catalog preview uses a dedicated TV silhouette instead of panel strips', () => {\n  const source = fs.readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');\n  assert.match(source, /module-drag-tv/);\n  assert.match(source, /module\.type === 'tv'/);\n  assert.match(source, /body\.className = 'module-drag-tv'/);\n});\n"""
if "TV catalog preview uses a dedicated TV silhouette" not in ts:
    ts += extra
t.write_text(ts)
