export const FEATURE_CONTRACTS = Object.freeze({
  automaticDepot: Object.freeze({
    id: 'automatic-depot',
    kind: 'scene-composition',
    owner: 'src/autoDepot.js',
    trigger: Object.freeze({
      mode: 'explicit-stage-option',
      contentToggle: 'includeContents',
    }),
    inputs: Object.freeze([
      'standType',
      'standXCm',
      'standYCm',
      'sizeKey',
      'includeContents',
    ]),
    creates: Object.freeze({
      structuralKinds: Object.freeze(['wall', 'door']),
      contentKinds: Object.freeze(['mini-fridge', 'kettle', 'coat-rack', 'plastic-trash-bin']),
      contentCatalogKeys: Object.freeze(['DEPOT_PLASTIC_TRASH_BIN']),
    }),
    placement: Object.freeze({
      owner: 'src/autoDepot.js',
      rule: 'planned-inside-stand-and-depot-footprint-without-floor-fixture-overlap',
    }),
    persistence: Object.freeze({
      mode: 'generated-modules-enter-project-state',
    }),
    tests: Object.freeze({
      contract: 'required',
      regressionFiles: Object.freeze(['tests/autoDepot.test.js', 'test/plasticTrashBinModule.test.js']),
      fullSuite: 'required',
      build: 'required',
    }),
  }),
});

export function getFeatureContract(featureId) {
  return Object.values(FEATURE_CONTRACTS).find((contract) => contract.id === featureId) ?? null;
}
