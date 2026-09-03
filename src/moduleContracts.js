import { MODULE_CATALOG, resolveModuleCatalogKey } from './catalog.js';
import { getModuleBehavior } from './moduleBehavior.js';

const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});

const UNRESOLVED_EXISTING_BOM_POLICY = Object.freeze({
  mode: 'decision-required',
  source: null,
  reason: 'Existing module has no canonical BOM policy yet; decide recipe, commercial-item, or explicit exclusion before Final BOM integration.',
});

const STANDARD_TEST_POLICY = Object.freeze({
  contract: 'required',
  regression: 'required-on-behavior-change',
  fullSuite: 'required',
  build: 'required',
});

export const MODULE_CONTRACT_PROFILES = Object.freeze({
  'wall-editable': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'editable', image: 'editable' }),
    renderer: Object.freeze({ mode: 'procedural-or-specialized' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'wall-color-only': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'editable', image: 'none' }),
    renderer: Object.freeze({ mode: 'procedural-or-model' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'free-editable': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'editable', image: 'editable' }),
    renderer: Object.freeze({ mode: 'procedural' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'free-model-color': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'editable', image: 'none' }),
    renderer: Object.freeze({ mode: 'model' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'free-model-fixed': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'fixed', image: 'none' }),
    renderer: Object.freeze({ mode: 'model' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'wall-media': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'fixed', image: 'renderer-managed' }),
    renderer: Object.freeze({ mode: 'specialized-media' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'top-light': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'state-backed', image: 'none' }),
    renderer: Object.freeze({ mode: 'procedural' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
  'wall-overlay-image': Object.freeze({
    state: Object.freeze({ owner: 'src/designState.js', persistence: 'project-state' }),
    appearance: Object.freeze({ color: 'halo-only', image: 'required' }),
    renderer: Object.freeze({ mode: 'specialized-overlay' }),
    runtime: Object.freeze({ mode: 'static' }),
    composition: Object.freeze({ mode: 'standalone' }),
    tests: STANDARD_TEST_POLICY,
  }),
});

function assignment(profile, bom) {
  return Object.freeze({ profile, bom });
}

export const MODULE_CONTRACT_ASSIGNMENTS = Object.freeze({
  wall_200: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_150: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_100: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_50: assignment('wall-editable', RECIPE_BOM_POLICY),

  wall_separator_100: assignment('wall-color-only', RECIPE_BOM_POLICY),
  wall_separator_50: assignment('wall-color-only', RECIPE_BOM_POLICY),
  wall_separator_100_sarmasik: assignment('wall-color-only', RECIPE_BOM_POLICY),
  wall_separator_50_sarmasik: assignment('wall-color-only', RECIPE_BOM_POLICY),

  wall_showcase_100_3: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_showcase_100_2: assignment('wall-editable', RECIPE_BOM_POLICY),

  wall_shelf_3_200: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_shelf_3_150: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_shelf_3_100: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_shelf_2_200: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_shelf_2_150: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_shelf_2_100: assignment('wall-editable', RECIPE_BOM_POLICY),

  wall_base_200: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_base_150: assignment('wall-editable', RECIPE_BOM_POLICY),
  wall_base_100: assignment('wall-editable', RECIPE_BOM_POLICY),
  DOOR_100: assignment('wall-editable', RECIPE_BOM_POLICY),

  desk_banko_200: assignment('free-editable', RECIPE_BOM_POLICY),
  desk_banko_150: assignment('free-editable', RECIPE_BOM_POLICY),
  desk_banko_100: assignment('free-editable', RECIPE_BOM_POLICY),
  desk_banko_200_L: assignment('free-editable', RECIPE_BOM_POLICY),
  desk_banko_150_L: assignment('free-editable', RECIPE_BOM_POLICY),
  desk_banko_100_L: assignment('free-editable', RECIPE_BOM_POLICY),
  BASE_200: assignment('free-editable', RECIPE_BOM_POLICY),
  BASE_150: assignment('free-editable', RECIPE_BOM_POLICY),
  BASE_100: assignment('free-editable', RECIPE_BOM_POLICY),

  furniture_sofa_set_classic: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),
  furniture_table_chair_set_eames: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),
  furniture_bar_stool_classic: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),
  DEPOT_MINI_FRIDGE_AVANTI: assignment('free-model-fixed', UNRESOLVED_EXISTING_BOM_POLICY),
  DEPOT_KETTLE: assignment('free-model-fixed', UNRESOLVED_EXISTING_BOM_POLICY),
  DEPOT_COAT_RACK: assignment('free-model-fixed', UNRESOLVED_EXISTING_BOM_POLICY),
  EXTRA_INDOOR_PLANT_1: assignment('free-model-fixed', UNRESOLVED_EXISTING_BOM_POLICY),
  EXTRA_LONG_PLANTER_100: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),
  EXTRA_LONG_PLANTER_150: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),
  EXTRA_LONG_PLANTER_200: assignment('free-model-color', UNRESOLVED_EXISTING_BOM_POLICY),

  TV_42: assignment('wall-media', UNRESOLVED_EXISTING_BOM_POLICY),
  TV_55: assignment('wall-media', UNRESOLVED_EXISTING_BOM_POLICY),
  VIDEO_WALL_2X2: assignment('wall-media', UNRESOLVED_EXISTING_BOM_POLICY),
  VIDEO_WALL_3X3: assignment('wall-media', UNRESOLVED_EXISTING_BOM_POLICY),
  TV_65: assignment('wall-media', UNRESOLVED_EXISTING_BOM_POLICY),
  LED_FLOODLIGHT: assignment('top-light', UNRESOLVED_EXISTING_BOM_POLICY),
});

export const NON_CATALOG_MODULE_CONTRACTS = Object.freeze({
  'illuminated-foam': Object.freeze({
    profile: 'wall-overlay-image',
    bom: UNRESOLVED_EXISTING_BOM_POLICY,
  }),
});

function mergeProfile(profile, assignmentRecord) {
  if (!profile || !assignmentRecord) return null;
  return {
    state: { ...profile.state, ...(assignmentRecord.state ?? {}) },
    appearance: { ...profile.appearance, ...(assignmentRecord.appearance ?? {}) },
    renderer: { ...profile.renderer, ...(assignmentRecord.renderer ?? {}) },
    runtime: { ...profile.runtime, ...(assignmentRecord.runtime ?? {}) },
    composition: { ...profile.composition, ...(assignmentRecord.composition ?? {}) },
    tests: { ...profile.tests, ...(assignmentRecord.tests ?? {}) },
    bom: { ...(assignmentRecord.bom ?? {}) },
  };
}

export function hasExplicitModuleContract(moduleKey) {
  return Object.hasOwn(MODULE_CONTRACT_ASSIGNMENTS, moduleKey);
}

export function resolveModuleContract(moduleKeyOrDescriptor) {
  if (typeof moduleKeyOrDescriptor === 'string' && Object.hasOwn(NON_CATALOG_MODULE_CONTRACTS, moduleKeyOrDescriptor)) {
    const assignmentRecord = NON_CATALOG_MODULE_CONTRACTS[moduleKeyOrDescriptor];
    const profile = MODULE_CONTRACT_PROFILES[assignmentRecord.profile];
    return {
      id: moduleKeyOrDescriptor,
      catalogKey: null,
      type: moduleKeyOrDescriptor,
      profile: assignmentRecord.profile,
      ...mergeProfile(profile, assignmentRecord),
      behavior: getModuleBehavior(moduleKeyOrDescriptor),
    };
  }

  const catalogKey = typeof moduleKeyOrDescriptor === 'string' && MODULE_CATALOG[moduleKeyOrDescriptor]
    ? moduleKeyOrDescriptor
    : resolveModuleCatalogKey(moduleKeyOrDescriptor);
  if (!catalogKey) return null;

  const descriptor = MODULE_CATALOG[catalogKey];
  const assignmentRecord = MODULE_CONTRACT_ASSIGNMENTS[catalogKey];
  if (!descriptor || !assignmentRecord) return null;

  const profile = MODULE_CONTRACT_PROFILES[assignmentRecord.profile];
  if (!profile) return null;

  return {
    id: catalogKey,
    catalogKey,
    type: descriptor.type,
    profile: assignmentRecord.profile,
    ...mergeProfile(profile, assignmentRecord),
    behavior: getModuleBehavior({ ...descriptor, catalogKey }),
  };
}
