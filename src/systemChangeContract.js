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

function frozenDomains(...domains) {
  return Object.freeze(domains);
}

// Explicit ownership-derived map for every current source file. A new src file
// intentionally has no fallback: the regression suite must classify it before CI can pass.
export const SOURCE_FILE_REQUIRED_DOMAINS = Object.freeze({
  'src/assetStore.js': frozenDomains('persistence', 'storage'),
  'src/autoDepot.js': frozenDomains('composition', 'placement'),
  'src/automaticWall.js': frozenDomains('composition', 'placement'),
  'src/autosaveController.js': frozenDomains('persistence'),
  'src/catalog.js': frozenDomains('catalog'),
  'src/colorEditor.css': frozenDomains('ui'),
  'src/colorEditorController.js': frozenDomains('ui'),
  'src/colorEditorInputs.js': frozenDomains('ui'),
  'src/colorUtils.js': frozenDomains('ui'),
  'src/cornerPlacement.js': frozenDomains('behavior', 'placement'),
  'src/designState.js': frozenDomains('state', 'persistence'),
  'src/featureContracts.js': frozenDomains('architecture', 'composition'),
  'src/groundLayout.js': frozenDomains('renderer', 'placement'),
  'src/helpGuide.css': frozenDomains('ui'),
  'src/helpGuide.js': frozenDomains('ui', 'accessibility'),
  'src/horizontalImageLayout.js': frozenDomains('renderer', 'state'),
  'src/imageActions.css': frozenDomains('ui'),
  'src/imageAssetReferences.js': frozenDomains('persistence', 'storage'),
  'src/imageFit.js': frozenDomains('renderer'),
  'src/main.js': frozenDomains(
    'architecture',
    'catalog',
    'behavior',
    'state',
    'placement',
    'renderer',
    'persistence',
    'ui',
    'composition',
    'assets',
    'storage',
    'importExport',
  ),
  'src/moduleBehavior.js': frozenDomains('behavior'),
  'src/moduleContextMenu.js': frozenDomains('ui', 'catalog', 'behavior'),
  'src/moduleContracts.js': frozenDomains('architecture', 'catalog', 'behavior', 'bom'),
  'src/moduleDragSidebar.js': frozenDomains('ui', 'catalog'),
  'src/moduleMove.js': frozenDomains('behavior', 'placement'),
  'src/modulePlacement.js': frozenDomains('behavior', 'placement'),
  'src/moduleRecipes.js': frozenDomains('bom'),
  'src/placementFeedback.js': frozenDomains('ui', 'placement'),
  'src/productionParts.js': frozenDomains('bom'),
  'src/projectNaming.js': frozenDomains('ui'),
  'src/projectStore.js': frozenDomains('persistence', 'storage'),
  'src/projectSwitch.js': frozenDomains('ui', 'persistence'),
  'src/projectUi.js': frozenDomains('ui'),
  'src/rawBomDebug.js': frozenDomains('bom', 'ui'),
  'src/rectImageLayout.js': frozenDomains('renderer', 'state'),
  'src/rectSelection.js': frozenDomains('ui'),
  'src/scene3d.js': frozenDomains('renderer', 'state', 'placement', 'behavior', 'performance'),
  'src/selectionFeedback.js': frozenDomains('ui'),
  'src/sidebarController.js': frozenDomains('ui'),
  'src/stageFeedback.js': frozenDomains('ui'),
  'src/standCapacity.js': frozenDomains('placement', 'composition'),
  'src/standSetup.js': frozenDomains('placement', 'composition', 'renderer'),
  'src/style.css': frozenDomains('ui'),
  'src/systemChangeContract.js': frozenDomains('architecture'),
  'src/theme.js': frozenDomains('ui', 'renderer'),
  'src/tvConfig.js': frozenDomains('catalog', 'state', 'renderer'),
  'src/uiFeedback.js': frozenDomains('ui', 'accessibility'),
  'src/viewCube.js': frozenDomains('renderer', 'ui'),
  'src/viewKeyboardShortcuts.js': frozenDomains('behavior', 'ui', 'accessibility'),
  'src/wall.js': frozenDomains('composition', 'placement'),
  'src/wallReflow.js': frozenDomains('behavior', 'placement'),
});

// Human/AI governance surfaces are themselves part of the architecture contract.
// They must not be weakened or drift without the same explicit change declaration.
export const GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS = Object.freeze({
  'README.md': frozenDomains('architecture'),
  'PROJECT_RULES.md': frozenDomains('architecture'),
  'ARCHITECTURE_RULES.md': frozenDomains('architecture'),
  'SYSTEM_DEVELOPMENT_CONTRACT.md': frozenDomains('architecture'),
  'SYSTEM_CHANGE_GATE.md': frozenDomains('architecture'),
  'MODULE_BEHAVIOR_STANDARD.md': frozenDomains('architecture'),
  'SYSTEM_AUDIT_CHECKLIST.md': frozenDomains('architecture'),
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

    if (contract.impact.tests !== 'affected') {
      errors.push('All changes must mark tests as affected.');
    }

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
    if (!isNonEmptyStringArray(contract.tests.targeted)) {
      errors.push('tests.targeted must contain at least one targeted regression test.');
    }
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
    || Object.hasOwn(GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS, path)
    || path.startsWith('src/')
    || path.startsWith('public/')
    || path.startsWith('scripts/')
    || path.startsWith('test/')
    || path.startsWith('tests/')
    || path.startsWith('.github/workflows/')
    || path.startsWith('vite.config');
}

export function requiredDomainsForFile(path) {
  const required = new Set([
    ...(SOURCE_FILE_REQUIRED_DOMAINS[path] ?? []),
    ...(GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS[path] ?? []),
  ]);

  if (path === 'index.html') required.add('ui');
  if (path.startsWith('public/')) required.add('assets');
  if (path.startsWith('test/') || path.startsWith('tests/')) required.add('tests');

  if (
    path === 'package.json'
    || path === 'package-lock.json'
    || path.startsWith('scripts/')
    || path.startsWith('.github/workflows/')
    || path.startsWith('vite.config')
  ) {
    required.add('architecture');
  }

  return [...required];
}
