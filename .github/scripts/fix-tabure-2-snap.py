from pathlib import Path

path = Path('src/modulePlacement.js')
text = path.read_text()
old = "return moduleType === 'sofa-set-classic' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool'\n    ? 10"
new = "return moduleType === 'sofa-set-classic' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool' || moduleType === 'bar-stool-2'\n    ? 10"
if old not in text:
    raise SystemExit('target not found')
path.write_text(text.replace(old, new, 1))
