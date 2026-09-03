# A11 — Feature + scene composition / automation audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Active composition/features identified

1. **automatic depot** — `src/autoDepot.js`
2. **automatic stand wall** — `src/automaticWall.js` + `src/wall.js` + `src/wallReflow.js`
3. **automatic back-wall replacement around depot** — `composeAutomaticBackWallWithDepot()` as depot/stage integration

## Automatic depot

`FEATURE_CONTRACTS.automaticDepot` explicitly declares:

- feature id/kind/owner
- trigger and input list
- structural outputs: wall + door
- optional content: mini-fridge + kettle + coat-rack
- placement owner/rule
- persistence mode
- regression source / test/build requirements

System contract test compares actual planner content kinds against contract. Legacy `tests/autoDepot.test.js` plus current `test/` orientation/depot front/back tests cover major shape/orientation cases.

**Status:** `AUDITED_OK` at composition-contract level, with runtime factory routing dependency F-010 and BOM decisions F-014 for generated equipment.

## Finding

### F-029 — P1 — automatic stand-wall composition has no explicit feature contract

Stage creation automatically composes and places multiple wall modules through `composeAutomaticStandWall()`. This is a multi-module scene composition/automation under the same development-contract definition that requires a feature/composition contract.

`featureContracts.js` currently contains only `automatic-depot`; there is no explicit `automatic-wall` / `automatic-stand-wall` contract declaring:

- trigger
- inputs
- output module family
- placement owner
- persistence semantics
- dependencies on stand type/capacity
- regression sources

The implementation itself is structured and uses canonical wall/reflow helpers, but the governance contract layer does not describe this active automation. A future change can therefore alter automatic stage wall generation without the domain-specific feature-contract test that automatic depot receives.

## Checklist results

- **A11.01 feature inventory:** `AUDITED_OK` — active multi-module composition paths identified above.
- **A11.02 contract presence:** `GAP` — F-029 for automatic wall.
- **A11.03 declared inputs:** automatic depot `AUDITED_OK`; automatic wall `GAP` F-029.
- **A11.04 generated modules/state path:** automatic depot and automatic wall create normal module state and enter `currentModules`; however factory routing is duplicated in `main.js` — F-010.
- **A11.05 placement core:** automatic wall delegates to wallReflow placement. Auto-depot owns deliberate free-layout geometry; hidden type-specific fixture behavior connects to F-011.
- **A11.06 persistence:** generated modules are serialized like user-added modules; `currentStand.depot` stores configuration. `AUDITED_OK`, with general schema F-021/F-022.
- **A11.07 BOM:** generated structural modules use recipe policies; generated depot equipment remains `decision-required` under F-014.
- **A11.08 regression:** automatic depot has contract + several planner tests; automatic wall has implementation tests (`automaticWall.test.js` etc.) but no feature contract — F-029.
- **A11.09 failure rollback:** invalid depot plan is rejected before current project reset. Automatic wall/custom depot-back failures occur later in stage creation, but with validated 50cm-step setup and supported depot sizes the current planners’ required divisibility is satisfied. No independently reproducible partial-state bug established here.

Section audit status: **GAP**.
Next audit section: **A12 — BOM / recipes / production parts**.
