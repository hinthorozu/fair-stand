from pathlib import Path
p = Path('src/moduleContextMenu.js')
s = p.read_text()
old = """const PICKER_MODULE_KEYS = [
  'PANEL_200',
  'PANEL_150',
  'PANEL_100',
  'PANEL_50',
  'SEPARATOR_100',
  'SEPARATOR_50',
  'DOOR_100',
  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
  'SHELF_3_200',
  'SHELF_2_200',
  'SHELF_3_150',
  'SHELF_2_150',
  'SHELF_3_100',
  'SHELF_2_100',
];
"""
new = """const PICKER_MODULE_KEYS = [
  'PANEL_200',
  'PANEL_150',
  'PANEL_100',
  'PANEL_50',
  'SEPARATOR_100',
  'SEPARATOR_50',
  'DOOR_100',
  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
  'SHELF_3_200',
  'SHELF_2_200',
  'SHELF_3_150',
  'SHELF_2_150',
  'SHELF_3_100',
  'SHELF_2_100',
  'SOFA_SET',
  'TABLE_CHAIR_SET',
  'BAR_STOOL',
  'LED_FLOODLIGHT',
  'BASE_200',
  'BASE_150',
  'BASE_100',
  'COUNTER_200',
  'COUNTER_150',
  'COUNTER_100',
];
"""
if old not in s:
    raise SystemExit('picker key block not found')
p.write_text(s.replace(old, new))
# trigger
