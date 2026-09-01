from pathlib import Path
import re


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing expected block: {label}')
    return text.replace(old, new, 1)


# catalog.js: groups, identity and display labels have one owner.
path = Path('src/catalog.js')
text = path.read_text(encoding='utf-8')
marker = "export function flatPanelKey(widthCm) {"
if 'export const MODULE_CATALOG_GROUPS' not in text:
    block = r'''export const MODULE_CATALOG_GROUPS = Object.freeze([
  Object.freeze({
    label: 'Panel & Duvar',
    keys: Object.freeze(['wall_200', 'wall_150', 'wall_100', 'wall_50', 'wall_separator_100', 'wall_separator_50', 'wall_base_200', 'wall_base_150', 'wall_base_100', 'DOOR_100']),
  }),
  Object.freeze({
    label: 'Raf & Vitrin',
    keys: Object.freeze(['wall_showcase_100_3', 'wall_showcase_100_2', 'wall_shelf_3_200', 'wall_shelf_3_150', 'wall_shelf_3_100', 'wall_shelf_2_200', 'wall_shelf_2_150', 'wall_shelf_2_100']),
  }),
  Object.freeze({
    label: 'Banko & Baza',
    keys: Object.freeze(['desk_banko_200', 'desk_banko_150', 'desk_banko_100', 'desk_banko_200_L', 'desk_banko_150_L', 'desk_banko_100_L', 'BASE_200', 'BASE_150', 'BASE_100']),
  }),
  Object.freeze({
    label: 'Mobilya',
    keys: Object.freeze(['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic']),
  }),
  Object.freeze({
    label: 'Depo',
    keys: Object.freeze(['DEPOT_MINI_FRIDGE_AVANTI', 'DEPOT_KETTLE']),
  }),
  Object.freeze({
    label: 'Elektronik & Aydınlatma',
    keys: Object.freeze(['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT']),
  }),
]);

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeCatalogDescriptor(descriptor) {
  const nested = descriptor?.moduleState && typeof descriptor.moduleState === 'object'
    ? descriptor.moduleState
    : null;
  const source = nested ?? descriptor ?? {};
  return {
    catalogKey: source.catalogKey ?? descriptor?.catalogKey ?? null,
    type: source.type ?? source.moduleType ?? descriptor?.type ?? descriptor?.moduleType ?? null,
    widthCm: optionalNumber(source.widthCm ?? descriptor?.widthCm),
    depthCm: optionalNumber(source.depthCm ?? descriptor?.depthCm),
    shape: source.shape ?? source.counterShape ?? descriptor?.shape ?? descriptor?.counterShape ?? null,
    shelfCount: optionalNumber(source.shelfCount ?? descriptor?.shelfCount),
    sizeInch: optionalNumber(source.sizeInch ?? descriptor?.sizeInch),
    screenWidthCm: optionalNumber(source.screenWidthCm ?? descriptor?.screenWidthCm),
  };
}

export function resolveModuleCatalogKey(descriptor) {
  const normalized = normalizeCatalogDescriptor(descriptor);
  if (normalized.catalogKey && MODULE_CATALOG[normalized.catalogKey]) return normalized.catalogKey;
  if (!normalized.type) return null;

  const candidates = MODULE_CATALOG_KEYS.filter(
    (moduleKey) => MODULE_CATALOG[moduleKey]?.type === normalized.type,
  );
  if (!candidates.length) return null;

  const matches = candidates.filter((moduleKey) => {
    const item = MODULE_CATALOG[moduleKey];
    if (normalized.widthCm !== null && optionalNumber(item.widthCm) !== null && optionalNumber(item.widthCm) !== normalized.widthCm) return false;
    if (normalized.depthCm !== null && optionalNumber(item.depthCm) !== null && optionalNumber(item.depthCm) !== normalized.depthCm) return false;
    if ((normalized.shape !== null || item.shape != null) && (item.shape ?? null) !== normalized.shape) return false;
    if ((normalized.shelfCount !== null || item.shelfCount != null) && optionalNumber(item.shelfCount) !== normalized.shelfCount) return false;
    if (normalized.sizeInch !== null && optionalNumber(item.sizeInch) !== null && optionalNumber(item.sizeInch) !== normalized.sizeInch) return false;
    if (normalized.type === 'tv' && normalized.sizeInch === null && normalized.screenWidthCm !== null && optionalNumber(item.screenWidthCm) !== normalized.screenWidthCm) return false;
    return true;
  });

  if (matches.length === 1) return matches[0];
  if (candidates.length === 1) return candidates[0];
  return null;
}

export function getModuleCatalogItem(descriptor) {
  const moduleKey = resolveModuleCatalogKey(descriptor);
  return moduleKey ? MODULE_CATALOG[moduleKey] ?? null : null;
}

export function getModuleCatalogLabel(descriptor) {
  return getModuleCatalogItem(descriptor)?.label
    ?? (typeof descriptor?.label === 'string' ? descriptor.label : null)
    ?? 'Modül';
}

'''
    text = replace_once(text, marker, block + marker, 'catalog helper insertion point')
path.write_text(text, encoding='utf-8')


# moduleDragSidebar.js: group membership and preview use catalog-owned data.
path = Path('src/moduleDragSidebar.js')
text = path.read_text(encoding='utf-8')
if "MODULE_CATALOG_GROUPS" not in text.split('\n', 1)[0]:
    text = replace_once(
        text,
        "import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from './catalog.js';",
        "import { MODULE_CATALOG, MODULE_CATALOG_GROUPS, MODULE_CATALOG_KEYS } from './catalog.js';",
        'sidebar catalog import',
    )
if 'const groupDefinitions = MODULE_CATALOG_GROUPS;' not in text:
    text, count = re.subn(
        r"  const groupDefinitions = \[.*?\n  \];\n\n  const groupGridByKey",
        "  const groupDefinitions = MODULE_CATALOG_GROUPS;\n\n  const groupGridByKey",
        text,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise SystemExit('could not replace sidebar group definitions')
text = text.replace('const state = createModuleState?.(module);', 'const state = createModuleState?.(module, moduleKey);')
path.write_text(text, encoding='utf-8')


# moduleContextMenu.js: title and card preview come from the same catalog source.
path = Path('src/moduleContextMenu.js')
text = path.read_text(encoding='utf-8')
if 'getModuleCatalogLabel' not in text.split('\n', 1)[0]:
    text = replace_once(
        text,
        "import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from './catalog.js';",
        "import { getModuleCatalogLabel, MODULE_CATALOG, MODULE_CATALOG_KEYS } from './catalog.js';",
        'context catalog import',
    )
text = re.sub(r"\nconst MODULE_LABELS = \{.*?\n\};\n\n", "\n", text, count=1, flags=re.S)
if 'return getModuleCatalogLabel(context);' not in text:
    text, count = re.subn(
        r"  function describeModule\(context\) \{.*?\n  \}\n\n  function getSelectionCounts",
        "  function describeModule(context) {\n    return getModuleCatalogLabel(context);\n  }\n\n  function getSelectionCounts",
        text,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise SystemExit('could not replace context describeModule')
path.write_text(text, encoding='utf-8')


# scene3d.js: drag badge name + icon use the catalog label and the exact catalog preview renderer.
path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')
if 'getModuleCatalogItem' not in text.split('\n', 5)[2]:
    text = replace_once(
        text,
        "import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';",
        "import { getModuleCatalogItem, getModuleCatalogLabel, SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';",
        'scene catalog import',
    )
if "import { createModuleCatalogPreview } from './moduleDragSidebar.js';" not in text:
    text = replace_once(
        text,
        "import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule, isWallOverlayModule } from './moduleBehavior.js';",
        "import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule, isWallOverlayModule } from './moduleBehavior.js';\nimport { createModuleCatalogPreview } from './moduleDragSidebar.js';",
        'scene preview import',
    )
text = re.sub(
    r"\n  function getDragModuleLabel\(moduleState\) \{.*?\n  \}\n\n  function disposeDragBadge",
    "\n  function disposeDragBadge",
    text,
    count=1,
    flags=re.S,
)
if "previewSlot.dataset.signature" not in text:
    new_badge = r'''  function updateDragBadge(moduleState, clientX, clientY) {
    if (!dragBadge) {
      dragBadge = document.createElement('div');
      dragBadge.style.cssText = [
        'position:fixed',
        'z-index:10000',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'padding:7px 9px',
        'border:1px solid #d9dee5',
        'border-radius:9px',
        'background:rgba(255,255,255,.94)',
        'box-shadow:0 8px 24px rgba(15,23,42,.16)',
        'color:#364152',
        'font:600 11px/1.2 system-ui,sans-serif',
        'pointer-events:none',
        'user-select:none',
      ].join(';');

      const previewSlot = document.createElement('div');
      previewSlot.dataset.role = 'preview-slot';
      previewSlot.style.cssText = 'width:66px;height:58px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:0 0 66px';
      const label = document.createElement('span');
      label.dataset.role = 'label';
      dragBadge.append(previewSlot, label);
      document.body.appendChild(dragBadge);
    }

    const catalogItem = getModuleCatalogItem(moduleState) ?? moduleState;
    const labelText = getModuleCatalogLabel(moduleState);
    const previewSlot = dragBadge.querySelector('[data-role="preview-slot"]');
    const label = dragBadge.querySelector('[data-role="label"]');
    if (label) label.textContent = labelText;

    if (previewSlot) {
      const signature = `${moduleState?.catalogKey ?? ''}|${labelText}|${moduleState?.type ?? ''}|${moduleState?.widthCm ?? ''}|${moduleState?.shelfCount ?? ''}|${moduleState?.sizeInch ?? ''}`;
      if (previewSlot.dataset.signature !== signature) {
        previewSlot.dataset.signature = signature;
        previewSlot.innerHTML = '';
        const preview = createModuleCatalogPreview(catalogItem);
        preview.style.width = '66px';
        preview.style.height = '58px';
        preview.style.flex = '0 0 66px';
        preview.style.background = 'transparent';
        preview.style.borderRadius = '0';
        previewSlot.appendChild(preview);
      }
    }

    dragBadge.style.left = `${clientX + 18}px`;
    dragBadge.style.top = `${clientY + 18}px`;
  }
'''
    text, count = re.subn(
        r"  function updateDragBadge\(moduleState, clientX, clientY\) \{.*?\n  \}\n\n  function clearPlacementDrag",
        new_badge + "\n  function clearPlacementDrag",
        text,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise SystemExit('could not replace drag badge renderer')
old_context = """    const supportsGlass = surface?.userData.selectionMode === 'panel';
    return {
      moduleIndex: moduleGroup.userData.moduleIndex,
      moduleId: moduleGroup.userData.moduleId,
      type: moduleGroup.userData.type,
      widthCm: moduleGroup.userData.widthCm,"""
if old_context in text:
    new_context = """    const supportsGlass = surface?.userData.selectionMode === 'panel';
    const moduleState = moduleGroup.userData.moduleState ?? {};
    return {
      moduleIndex: moduleGroup.userData.moduleIndex,
      moduleId: moduleGroup.userData.moduleId,
      catalogKey: moduleState.catalogKey ?? null,
      type: moduleState.type ?? moduleGroup.userData.type,
      widthCm: moduleState.widthCm ?? moduleGroup.userData.widthCm,
      depthCm: moduleState.depthCm ?? moduleGroup.userData.depthCm,
      shape: moduleState.shape ?? null,
      shelfCount: moduleState.shelfCount ?? null,
      sizeInch: moduleState.sizeInch ?? null,
      screenWidthCm: moduleState.screenWidthCm ?? null,"""
    text = text.replace(old_context, new_context, 1)
path.write_text(text, encoding='utf-8')


# main.js: every module state carries the catalog key; old saved projects are migrated on load.
path = Path('src/main.js')
text = path.read_text(encoding='utf-8')
if "import { resolveModuleCatalogKey } from './catalog.js';" not in text:
    text = replace_once(
        text,
        "import { createStandScene } from './scene3d.js';",
        "import { createStandScene } from './scene3d.js';\nimport { resolveModuleCatalogKey } from './catalog.js';",
        'main catalog import',
    )
text = text.replace(
    "function createCatalogModuleState(module, { preservePlacement = false } = {}) {",
    "function createCatalogModuleState(module, { preservePlacement = false, catalogKey = null } = {}) {",
    1,
)
if 'state.catalogKey = catalogKey ?? resolveModuleCatalogKey(module);' not in text:
    text = replace_once(
        text,
        "  if (state && preservePlacement && module.placement) {\n    state.placement = { ...module.placement };\n  }\n  return state;",
        "  if (state) state.catalogKey = catalogKey ?? resolveModuleCatalogKey(module);\n  if (state && preservePlacement && module.placement) {\n    state.placement = { ...module.placement };\n  }\n  return state;",
        'catalog state catalogKey',
    )
text = text.replace(
    "  createModuleState: (module) => createCatalogModuleState(module),",
    "  createModuleState: (module, moduleKey) => createCatalogModuleState(module, { catalogKey: moduleKey }),",
)
if 'if (!moduleState.catalogKey) moduleState.catalogKey = resolveModuleCatalogKey(moduleState);' not in text:
    text = replace_once(
        text,
        "  currentModules = cloneProjectState(project.modules) || [];",
        "  currentModules = cloneProjectState(project.modules) || [];\n  currentModules.forEach((moduleState) => {\n    if (!moduleState.catalogKey) moduleState.catalogKey = resolveModuleCatalogKey(moduleState);\n  });",
        'restore catalogKey migration',
    )
path.write_text(text, encoding='utf-8')


# Regression coverage for all current and future catalog entries.
Path('test/catalogSingleSource.test.js').write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  getModuleCatalogLabel,
  MODULE_CATALOG,
  MODULE_CATALOG_GROUPS,
  MODULE_CATALOG_KEYS,
  resolveModuleCatalogKey,
} from '../src/catalog.js';

test('every catalog module belongs to exactly one catalog group', () => {
  const groupedKeys = MODULE_CATALOG_GROUPS.flatMap((group) => group.keys);
  assert.equal(groupedKeys.length, MODULE_CATALOG_KEYS.length);
  assert.deepEqual([...groupedKeys].sort(), [...MODULE_CATALOG_KEYS].sort());
  assert.equal(new Set(groupedKeys).size, groupedKeys.length);
});

test('every catalog module resolves its single-source key and label', () => {
  MODULE_CATALOG_KEYS.forEach((moduleKey) => {
    const module = MODULE_CATALOG[moduleKey];
    assert.ok(module, moduleKey);
    assert.equal(resolveModuleCatalogKey({ ...module, catalogKey: moduleKey }), moduleKey);
    assert.equal(getModuleCatalogLabel({ ...module, catalogKey: moduleKey }), module.label);
  });
});

test('left catalog, context catalog and drag badge share catalog presentation source', () => {
  const sidebar = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  const contextMenu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

  assert.match(sidebar, /MODULE_CATALOG_GROUPS/);
  assert.match(contextMenu, /createModuleCatalogPreview/);
  assert.match(contextMenu, /getModuleCatalogLabel/);
  assert.match(scene, /createModuleCatalogPreview/);
  assert.match(scene, /getModuleCatalogLabel/);
  assert.doesNotMatch(scene, /function getDragModuleLabel/);
});
''', encoding='utf-8')
