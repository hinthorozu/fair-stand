import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { listRegisteredItems } from '../src/items.js';
import { CATALOG_PREVIEW_KIND_FIXTURE } from '../test/fixtures/catalogPreviewKinds.mjs';

const seed = JSON.parse(readFileSync(new URL('../test/fixtures/itemCatalogSeed.json', import.meta.url), 'utf8'));
const CATALOG_CATEGORIES = seed.categories.map((category) => ({
  id: category.catalog_index,
  catalogName: category.catalog_name,
  catalogIndex: category.catalog_index,
}));
const CATALOG_PREVIEW_IDS = CATALOG_PREVIEW_KIND_FIXTURE.map((preview) => preview.id);

function colorToInt(value) {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string') {
    const hex = value.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(hex)) return Number.parseInt(hex, 16);
  }
  throw new Error(`Unsupported defaultColor: ${value}`);
}

function num(value) {
  return value == null ? null : Number(value);
}

const EXTRA_MODELS = {
  chair_eames: 'eames_chair.glb',
  furniture_bar_stool_classic: 'bar_chair.glb',
  furniture_sofa_single_classic: 'bej_koltuk_1_ciftli_2_tekli.glb',
  furniture_sofa_double_classic: 'bej_koltuk_1_ciftli_2_tekli.glb',
  EXTRA_INDOOR_PLANT_1: 'indoor_plants.glb',
};

function py(value, indent = 0) {
  const pad = ' '.repeat(indent);
  if (value === null) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((entry) => `${pad}    ${py(entry, indent + 4)},`).join('\n')}\n${pad}]`;
  }
  const keys = Object.keys(value);
  if (!keys.length) return '{}';
  return `{\n${keys.map((key) => `${pad}    ${JSON.stringify(key)}: ${py(value[key], indent + 4)},`).join('\n')}\n${pad}}`;
}

const items = listRegisteredItems();
const payload = {
  categories: CATALOG_CATEGORIES.map((category) => ({
    catalog_name: category.catalogName,
    catalog_index: category.catalogIndex,
  })),
  preview_kinds: CATALOG_PREVIEW_IDS.map((previewId) => ({
    sort_index: previewId,
  })),
  items: items.map((item) => {
    const assets = [];
    const modelFile = item.modelFile || EXTRA_MODELS[item.itemKey] || null;
    if (modelFile) assets.push({ asset_role: 'model', relative_path: modelFile });
    if (item.type === 'tv') {
      assets.push({ asset_role: 'default_screen', relative_path: 'tv-screen.jpg' });
    }
    const composition = item.composition || null;
    return {
      item_key: item.itemKey,
      name: item.name,
      item_type: item.type,
      unit: item.unit ?? null,
      catalog_visible: item.catalogVisible === true,
      category_index: item.catalogVisible ? item.categoryId : null,
      catalog_item_index: item.catalogVisible ? item.catalogItemIndex : null,
      preview_id: item.catalogVisible ? item.previewId : null,
      material: item.material ?? null,
      default_color: colorToInt(item.defaultColor ?? null),
      panel_role: item.panelRole ?? null,
      connector_type: item.connectorType ?? null,
      preserve_model_scale: Object.hasOwn(item, 'preserveModelScale') ? Boolean(item.preserveModelScale) : null,
      model_rotation_y_deg: num(item.modelRotationYDeg),
      visual_rotation_y_deg: num(item.visualRotationYDeg),
      rotation_step_deg: Object.hasOwn(item, 'rotationStepDeg') ? num(item.rotationStepDeg) : null,
      default_rotation_deg: Object.hasOwn(item, 'defaultRotationDeg') ? num(item.defaultRotationDeg) : null,
      side_insert_rotation: item.sideInsertRotation ?? null,
      composition_mode: composition?.mode ?? null,
      composition_module_type: composition?.moduleType ?? null,
      paintable: Object.hasOwn(item, 'paintable') ? Boolean(item.paintable) : null,
      shape: item.shape ?? null,
      variant: item.variant ?? null,
      eye_count: item.eyeCount ?? null,
      dimensions: item.dimensions
        ? {
            width_cm: num(item.dimensions.widthCm),
            depth_cm: num(item.dimensions.depthCm),
            height_cm: num(item.dimensions.heightCm),
            length_cm: num(item.dimensions.lengthCm),
            thickness_cm: num(item.dimensions.thicknessCm),
            mount_height_cm: num(item.dimensions.mountHeightCm),
            wall_gap_cm: num(item.dimensions.wallGapCm),
          }
        : null,
      scene_dimensions: item.sceneDimensions
        ? {
            width_cm: num(item.sceneDimensions.widthCm),
            depth_cm: num(item.sceneDimensions.depthCm),
            height_cm: num(item.sceneDimensions.heightCm),
          }
        : null,
      strip_occupancy: item.stripOccupancy
        ? { align: item.stripOccupancy.align, strip_count: item.stripOccupancy.stripCount }
        : null,
      components: (composition?.items || []).map((row, index) => ({
        child_item_key: row.itemKey,
        quantity: row.quantity,
        sort_order: index,
      })),
      video_wall: item.videoWall
        ? {
            rows: item.videoWall.rows,
            cols: item.videoWall.cols,
            panel_item_key: item.videoWall.panelItemKey,
          }
        : null,
      body_parts: item.bodyItems
        ? [
            { body_role: 'side', child_item_key: item.bodyItems.sideItemKey },
            { body_role: 'horizontal', child_item_key: item.bodyItems.horizontalItemKey },
            { body_role: 'glass_shelf', child_item_key: item.bodyItems.glassShelfItemKey },
          ]
        : [],
      assets,
    };
  }),
};

const here = dirname(fileURLToPath(import.meta.url));
const pythonPath = resolve(here, '../../fair-crm/backend/app/modules/fair_stand/infrastructure/catalog_seed_data.py');
const jsonPath = resolve(here, '../test/fixtures/itemCatalogSeed.json');
mkdirSync(dirname(pythonPath), { recursive: true });
writeFileSync(
  pythonPath,
  '"""Canonical Fair Stand catalog seed rows generated from fair-stand Item/Category masters."""\n\nCATALOG_SEED = '
    + py(payload)
    + '\n',
);
mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(payload)}\n`);

const componentCount = payload.items.reduce((sum, item) => sum + item.components.length, 0);
const assetCount = payload.items.reduce((sum, item) => sum + item.assets.length, 0);
console.log(JSON.stringify({
  items: payload.items.length,
  visible: payload.items.filter((item) => item.catalog_visible).length,
  components: componentCount,
  assets: assetCount,
  videoWalls: payload.items.filter((item) => item.video_wall).length,
  bodyParents: payload.items.filter((item) => item.body_parts.length).length,
}, null, 2));
