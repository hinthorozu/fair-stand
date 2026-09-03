export const CHANGE_CONTRACT_SCHEMA_VERSION = 1;

export const SYSTEM_CHANGE_KINDS = Object.freeze([
  'module',
  'feature',
  'ui-control',
  'state-change',
  'renderer-change',
  'persistence-change',
  'bom-change',
  'architecture',
  'tooling',
  'bugfix',
  'refactor',
]);

export const SYSTEM_IMPACT_DOMAINS = Object.freeze([
  'catalog',
  'behavior',
  'state',
  'placement',
  'renderer',
  'persistence',
  'bom',
  'ui',
  'composition',
  'assets',
  'storage',
  'importExport',
  'performance',
  'accessibility',
  'architecture',
  'security',
  'tests',
]);

export const SYSTEM_IMPACT_DECISIONS = Object.freeze([
  'affected',
  'not-applicable',
]);

const KIND_REQUIRED_DOMAINS = Object.freeze({
  'ui-control': Object.freeze(['ui']),
  'state-change': Object.freeze(['state']),
  'renderer-change': Object.freeze(['renderer']),
  'persistence-change': Object.freeze(['persistence']),
  'bom-change': Object.freeze(['bom']),
  architecture: Object.freeze(['architecture']),
  tooling: Object.freeze(['architecture']),
});

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

export function validateSystemChangeContract(contract) {
  const errors = [];

  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    return ['Contract must be an object.'];
  }

  if (contract.schemaVersion !== CHANGE_CONTRACT_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${CHANGE_CONTRACT_SCHEMA_VERSION}.`);
  }

  if (!isNonEmptyString(contract.id)) errors.push('id is required.');
  if (!SYSTEM_CHANGE_KINDS.includes(contract.kind)) errors.push(`Unknown kind: ${contract.kind ?? '<missing>'}.`);
  if (!isNonEmptyString(contract.summary)) errors.push('summary is required.');
  if (!isNonEmptyStringArray(contract.owners)) errors.push('owners must contain at least one canonical owner.');
  if (!isNonEmptyStringArray(contract.sourceOfTruth)) errors.push('sourceOfTruth must contain at least one canonical source.');

  if (!contract.impact || typeof contract.impact !== 'object' || Array.isArray(contract.impact)) {
    errors.push('impact map is required.');
  } else {
    const declaredDomains = Object.keys(contract.impact);
    const missingDomains = SYSTEM_IMPACT_DOMAINS.filter((domain) => !Object.hasOwn(contract.impact, domain));
    const unknownDomains = declaredDomains.filter((domain) => !SYSTEM_IMPACT_DOMAINS.includes(domain));

    if (missingDomains.length) errors.push(`Missing impact decisions: ${missingDomains.join(', ')}.`);
    if (unknownDomains.length) errors.push(`Unknown impact domains: ${unknownDomains.join(', ')}.`);

    for (const domain of SYSTEM_IMPACT_DOMAINS) {
      if (!Object.hasOwn(contract.impact, domain)) continue;
      if (!SYSTEM_IMPACT_DECISIONS.includes(contract.impact[domain])) {
        errors.push(`${domain} must be affected or not-applicable.`);
      }
    }

    const affectedCount = SYSTEM_IMPACT_DOMAINS.filter((domain) => contract.impact[domain] === 'affected').length;
    if (affectedCount === 0) errors.push('At least one impact domain must be affected.');

    for (const requiredDomain of KIND_REQUIRED_DOMAINS[contract.kind] ?? []) {
      if (contract.impact[requiredDomain] !== 'affected') {
        errors.push(`${contract.kind} changes must mark ${requiredDomain} as affected.`);
      }
    }

    if (contract.kind === 'module') {
      const moduleDomains = ['catalog', 'behavior', 'state', 'renderer'];
      if (!moduleDomains.some((domain) => contract.impact[domain] === 'affected')) {
        errors.push('module changes must affect at least one of catalog, behavior, state, or renderer.');
      }
    }

    if (contract.kind === 'feature') {
      const featureDomains = ['composition', 'behavior', 'ui', 'state'];
      if (!featureDomains.some((domain) => contract.impact[domain] === 'affected')) {
        errors.push('feature changes must affect at least one of composition, behavior, ui, or state.');
      }
    }
  }

  if (!contract.tests || typeof contract.tests !== 'object' || Array.isArray(contract.tests)) {
    errors.push('tests policy is required.');
  } else {
    if (!Array.isArray(contract.tests.targeted)) errors.push('tests.targeted must be an array.');
    if (contract.tests.fullSuite !== true) errors.push('tests.fullSuite must be true.');
    if (contract.tests.build !== true) errors.push('tests.build must be true.');
  }

  if (!contract.risk || typeof contract.risk !== 'object' || Array.isArray(contract.risk)) {
    errors.push('risk declaration is required.');
  } else {
    if (!['low', 'medium', 'high'].includes(contract.risk.level)) errors.push('risk.level must be low, medium, or high.');
    if (!isNonEmptyString(contract.risk.notes)) errors.push('risk.notes is required.');
  }

  if (!contract.migration || typeof contract.migration !== 'object' || Array.isArray(contract.migration)) {
    errors.push('migration declaration is required.');
  } else {
    if (typeof contract.migration.required !== 'boolean') errors.push('migration.required must be boolean.');
    if (!isNonEmptyString(contract.migration.notes)) errors.push('migration.notes is required.');
  }

  if (!isNonEmptyString(contract.rollback)) errors.push('rollback plan is required.');

  return errors;
}

export function isGuardedChangeFile(path) {
  return path === 'index.html'
    || path === 'package.json'
    || path === 'package-lock.json'
    || path.startsWith('src/')
    || path.startsWith('public/')
    || path.startsWith('scripts/')
    || path.startsWith('.github/workflows/')
    || path.startsWith('vite.config');
}

export function requiredDomainsForFile(path) {
  const required = new Set();

  if (path === 'index.html') required.add('ui');
  if (path === 'src/catalog.js') required.add('catalog');

  if ([
    'src/moduleBehavior.js',
    'src/moduleMove.js',
    'src/modulePlacement.js',
    'src/wallReflow.js',
    'src/cornerPlacement.js',
  ].includes(path)) {
    required.add('behavior');
    required.add('placement');
  }

  if (path === 'src/designState.js') {
    required.add('state');
    required.add('persistence');
  }

  if (path === 'src/scene3d.js' || path === 'src/viewCube.js') required.add('renderer');

  if (['src/projectStore.js', 'src/assetStore.js', 'src/imageAssetReferences.js'].includes(path)) {
    required.add('persistence');
    required.add('storage');
  }

  if (['src/moduleRecipes.js', 'src/productionParts.js', 'src/rawBomDebug.js'].includes(path)) required.add('bom');

  if (['src/autoDepot.js', 'src/automaticWall.js', 'src/featureContracts.js'].includes(path)) required.add('composition');

  if (path.startsWith('public/')) required.add('assets');

  if (
    path === 'package.json'
    || path === 'package-lock.json'
    || path.startsWith('scripts/')
    || path.startsWith('.github/workflows/')
    || path.startsWith('vite.config')
    || path === 'src/systemChangeContract.js'
    || path === 'src/moduleContracts.js'
  ) {
    required.add('architecture');
  }

  if (
    path === 'src/projectUi.js'
    || path === 'src/moduleContextMenu.js'
    || path === 'src/moduleDragSidebar.js'
    || path === 'src/helpGuide.js'
    || path === 'src/sidebarController.js'
    || /(?:Ui|UI|Controller|Feedback)\.js$/.test(path)
  ) {
    required.add('ui');
  }

  return [...required];
}
