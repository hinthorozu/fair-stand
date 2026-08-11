from pathlib import Path
import re

html_path = Path('index.html')
text = html_path.read_text(encoding='utf-8')

labels = ['Proje', 'Stand Tipi', 'Düz duvar', 'Modül ekle', 'Seçili yüzey', 'Standartlar']
for label in labels:
    pattern = re.compile(
        r'<section class="(?P<classes>panel-card[^"]*)">\s*<h2>' + re.escape(label) + r'</h2>(?P<body>.*?)</section>',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit(f'panel not found: {label}')
    classes = match.group('classes')
    body = match.group('body')
    open_attr = ' open' if label == 'Proje' else ''
    replacement = (
        f'<details class="{classes} collapsible-panel"{open_attr}>\n'
        f'          <summary class="panel-summary"><span>{label}</span><span class="panel-chevron" aria-hidden="true"></span></summary>\n'
        f'          <div class="panel-card-content">{body}\n          </div>\n'
        f'        </details>'
    )
    text = text[:match.start()] + replacement + text[match.end():]

html_path.write_text(text, encoding='utf-8')

css_path = Path('src/style.css')
styles = css_path.read_text(encoding='utf-8')
anchor = '''.panel-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px;
  border: 1px solid #dde2e8;
  border-radius: 14px;
  background: #ffffff;
}
'''
if anchor not in styles:
    raise SystemExit('panel-card css anchor not found')

addition = anchor + '''
.collapsible-panel {
  display: block;
  padding: 0;
  overflow: hidden;
}

.panel-summary {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  color: #222b3b;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.panel-summary::-webkit-details-marker {
  display: none;
}

.panel-summary:hover {
  background: #f8fafc;
}

.panel-chevron {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-right: 2px solid #7a8494;
  border-bottom: 2px solid #7a8494;
  transform: rotate(45deg) translate(-2px, -2px);
  transition: transform 160ms ease;
}

.collapsible-panel[open] > .panel-summary .panel-chevron {
  transform: rotate(225deg) translate(-1px, -1px);
}

.panel-card-content {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0 14px 14px;
}

.collapsible-panel:not([open]) > .panel-card-content {
  display: none;
}

.collapsible-panel[open] > .panel-summary {
  padding-bottom: 10px;
}
'''
styles = styles.replace(anchor, addition, 1)
css_path.write_text(styles, encoding='utf-8')
