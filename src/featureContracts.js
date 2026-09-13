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
      contentCatalogKeys: Object.freeze([
        'MINI_FRIDGE_AVANTI',
        'KETTLE',
        'COAT_RACK',
        'PLASTIC_TRASH_BIN',
      ]),
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
  automaticWall: Object.freeze({
    id: 'automatic-wall',
    kind: 'scene-composition',
    owner: 'src/automaticWall.js',
    trigger: Object.freeze({
      mode: 'non-island-stage-create',
    }),
    inputs: Object.freeze([
      'lengthCm',
      'standType',
      'standXCm',
      'standYCm',
    ]),
    creates: Object.freeze({
      structuralKinds: Object.freeze(['flat-panel']),
    }),
    placement: Object.freeze({
      owner: 'src/wallReflow.js',
      rule: 'planContinuousWallLayout',
    }),
    persistence: Object.freeze({
      mode: 'generated-modules-enter-project-state',
    }),
    tests: Object.freeze({
      contract: 'required',
      regressionFiles: Object.freeze(['test/automaticWall.test.js']),
      fullSuite: 'required',
      build: 'required',
    }),
  }),
});

export function getFeatureContract(featureId) {
  return Object.values(FEATURE_CONTRACTS).find((contract) => contract.id === featureId) ?? null;
}
