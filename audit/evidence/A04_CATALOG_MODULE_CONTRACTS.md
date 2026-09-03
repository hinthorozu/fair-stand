# A04 — Catalog + module contracts audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Global contract results

### A04.01 — catalog key/object coverage

Current source contains 45 intended catalog keys and every listed key resolves to a `MODULE_CATALOG` descriptor. No current missing descriptor was found.

**Audit status:** `AUDITED_OK` for current data.

Test-hardening note is deferred to A18: current tests strongly validate the key list but do not independently assert that an accidental extra object property in `MODULE_CATALOG` is impossible/invisible.

### A04.02 — groups

The five visible groups (`Panel & Duvar`, `Raf & Vitrin`, `Banko & Baza`, `Extra`, `Elektronik & Aydınlatma`) collectively cover the current 45-key list without an invalid key in the current source.

**Audit status:** `AUDITED_OK`.

### A04.03 / A04.04 / A04.05 / A04.06 — module contracts

`MODULE_CONTRACT_ASSIGNMENTS` has one assignment per current catalog key and no stale assignment. `systemDevelopmentContract.test.js` machine-checks:

- missing/stale assignments,
- required contract sections,
- profile existence,
- state/persistence/appearance/renderer/runtime/composition/BOM/test policy,
- behavior basics,
- actual recipe resolution for recipe-backed contracts.

Profiles are explicit and no catalog module relies on the unknown behavior fallback.

**Audit status:** `AUDITED_OK` for contract presence/resolution. Runtime-construction enforcement is separately captured by F-010.

### A04.07 — non-catalog runtime registry

`NON_CATALOG_MODULE_CONTRACTS` currently contains `illuminated-foam`, and the system contract test resolves it with wall-overlay behavior and required image appearance.

No second active non-catalog runtime module was identified in the current source/catalog audit.

**Audit status:** `AUDITED_OK`.

### A04.08 — catalog identity after persistence / ambiguous descriptors

**Finding F-013 — P2 — legacy descriptor identity is ambiguous for vine separators.**

Current catalog-driven creation attaches `catalogKey`, so normal current save/load retains exact catalog identity. However load also tries to repair older states lacking `catalogKey` via `resolveModuleCatalogKey()`.

Normal and vine separators share the same `type: separator` + width and differ by `modelFile`. The resolver does not include `modelFile` in its normalized/matching descriptor. Therefore a legacy state without `catalogKey` cannot uniquely resolve:

- `wall_separator_100` vs `wall_separator_100_sarmasik`,
- `wall_separator_50` vs `wall_separator_50_sarmasik`.

The existing catalog single-source test verifies explicit `catalogKey` resolution but does not cover this ambiguous legacy descriptor case.

**Audit status:** `GAP` — F-013.

## BOM decision root finding

### F-014 — P1 / DECISION_REQUIRED — 17 active module contracts have no final BOM classification

This is **not a runtime-rendering bug**. It is a product/BOM completion decision.

Current `UNRESOLVED_EXISTING_BOM_POLICY` intentionally marks the following active runtime modules as `decision-required` until each is classified as canonical recipe, commercial item, or explicit exclusion:

- M030–M045 (16 catalog entries),
- M046 `illuminated-foam` (non-catalog runtime module).

Until those decisions exist, these module rows cannot be marked `AUDITED_OK` across the full identity→BOM chain and a complete final BOM cannot claim explicit policy for them.

This single root finding represents all 17 rows; no duplicate per-module finding is created.

## Shared evidence used for per-module ledger

- Identity/groups: `src/catalog.js`
- State factories/defaults: `src/designState.js`
- Behavior: `src/moduleBehavior.js` + `test/moduleBehaviorContract.test.js`
- Contract/profile/BOM policy: `src/moduleContracts.js` + `test/systemDevelopmentContract.test.js`
- Recipes: `src/moduleRecipes.js` + recipe family tests
- Renderer families: `src/scene3d.js`
- External model assets: `public/models/`
- Current runtime construction path: `main.js:createCatalogModuleState()` (architectural gap F-010)
- Persistence identity repair: `main.js:restoreProject()` + `resolveModuleCatalogKey()`

## Per-module ledger

Legend:

- `AUDITED_OK`: all inspected A04 dimensions have a current explicit policy and no module-specific A04 blocker.
- `GAP`: an actual catalog/identity contract gap affects the row.
- `DECISION_REQUIRED`: runtime contract exists, but final BOM classification is intentionally unresolved under F-014.

| ID | Catalog key | Status | A04 result |
|---|---|---|---|
| M001 | `wall_200` | `AUDITED_OK` | explicit catalog/contract/behavior/state/renderer/recipe |
| M002 | `wall_150` | `AUDITED_OK` | same flat-panel family, width-specific recipe |
| M003 | `wall_100` | `AUDITED_OK` | same flat-panel family, width-specific recipe |
| M004 | `wall_50` | `AUDITED_OK` | same flat-panel family, width-specific recipe |
| M005 | `wall_separator_100` | `GAP` | current creation OK; legacy descriptor identity conflicts with M007 — F-013 |
| M006 | `wall_separator_50` | `GAP` | current creation OK; legacy descriptor identity conflicts with M008 — F-013 |
| M007 | `wall_separator_100_sarmasik` | `GAP` | model asset exists; legacy descriptor cannot distinguish modelFile — F-013 |
| M008 | `wall_separator_50_sarmasik` | `GAP` | model asset exists; legacy descriptor cannot distinguish modelFile — F-013 |
| M009 | `wall_showcase_100_3` | `AUDITED_OK` | explicit 3-eye state/renderer/recipe |
| M010 | `wall_showcase_100_2` | `AUDITED_OK` | explicit 2-eye state/renderer/recipe |
| M011 | `wall_shelf_3_200` | `AUDITED_OK` | shelfCount 3 explicit; recipe + renderer lighting state |
| M012 | `wall_shelf_3_150` | `AUDITED_OK` | shelfCount 3 explicit; recipe |
| M013 | `wall_shelf_3_100` | `AUDITED_OK` | shelfCount 3 explicit; recipe |
| M014 | `wall_shelf_2_200` | `AUDITED_OK` | shelfCount 2 explicit; recipe |
| M015 | `wall_shelf_2_150` | `AUDITED_OK` | shelfCount 2 explicit; recipe |
| M016 | `wall_shelf_2_100` | `AUDITED_OK` | shelfCount 2 explicit; recipe |
| M017 | `wall_base_200` | `AUDITED_OK` | explicit base-wall state/renderer/recipe; placement special policy tracked F-011 |
| M018 | `wall_base_150` | `AUDITED_OK` | same family; placement special policy tracked F-011 |
| M019 | `wall_base_100` | `AUDITED_OK` | same family; placement special policy tracked F-011 |
| M020 | `DOOR_100` | `AUDITED_OK` | explicit door state/renderer/recipe |
| M021 | `desk_banko_200` | `AUDITED_OK` | straight counter state/renderer/recipe |
| M022 | `desk_banko_150` | `AUDITED_OK` | straight counter state/renderer/recipe |
| M023 | `desk_banko_100` | `AUDITED_OK` | straight counter state/renderer/recipe |
| M024 | `desk_banko_200_L` | `AUDITED_OK` | L shape explicit in catalog/state/behavior/renderer/recipe |
| M025 | `desk_banko_150_L` | `AUDITED_OK` | L shape explicit in catalog/state/behavior/renderer/recipe |
| M026 | `desk_banko_100_L` | `AUDITED_OK` | L shape explicit in catalog/state/behavior/renderer/recipe |
| M027 | `BASE_200` | `AUDITED_OK` | explicit base state/renderer/recipe; endpoint special policy tracked F-011 |
| M028 | `BASE_150` | `AUDITED_OK` | same base family |
| M029 | `BASE_100` | `AUDITED_OK` | same base family |
| M030 | `furniture_sofa_set_classic` | `DECISION_REQUIRED` | runtime/model/color contract exists; BOM unresolved — F-014 |
| M031 | `furniture_table_chair_set_eames` | `DECISION_REQUIRED` | runtime/model/color contract + model asset; BOM unresolved — F-014 |
| M032 | `furniture_bar_stool_classic` | `DECISION_REQUIRED` | runtime/model/color contract + model asset; BOM unresolved — F-014 |
| M033 | `DEPOT_MINI_FRIDGE_AVANTI` | `DECISION_REQUIRED` | runtime/model-fixed contract + model asset; BOM unresolved — F-014; placement exception under F-011 |
| M034 | `DEPOT_KETTLE` | `DECISION_REQUIRED` | runtime/model-fixed contract + model asset; BOM unresolved — F-014; placement exception under F-011 |
| M035 | `DEPOT_COAT_RACK` | `DECISION_REQUIRED` | runtime/model-fixed contract + model asset; BOM unresolved — F-014; placement exception under F-011 |
| M036 | `EXTRA_INDOOR_PLANT_1` | `DECISION_REQUIRED` | runtime/model-fixed state/renderer; BOM unresolved — F-014 |
| M037 | `EXTRA_LONG_PLANTER_100` | `DECISION_REQUIRED` | dedicated model asset + editable-color profile; BOM unresolved — F-014 |
| M038 | `EXTRA_LONG_PLANTER_150` | `DECISION_REQUIRED` | dedicated model asset + editable-color profile; BOM unresolved — F-014 |
| M039 | `EXTRA_LONG_PLANTER_200` | `DECISION_REQUIRED` | dedicated model asset + editable-color profile; BOM unresolved — F-014 |
| M040 | `TV_42` | `DECISION_REQUIRED` | specialized TV state/renderer; BOM unresolved — F-014; overlay policy under F-011 |
| M041 | `TV_55` | `DECISION_REQUIRED` | shared canonical TV config/state/renderer; BOM unresolved — F-014 |
| M042 | `VIDEO_WALL_2X2` | `DECISION_REQUIRED` | explicit rows/cols/panel screen geometry; BOM unresolved — F-014 |
| M043 | `VIDEO_WALL_3X3` | `DECISION_REQUIRED` | explicit rows/cols/panel screen geometry; BOM unresolved — F-014 |
| M044 | `TV_65` | `DECISION_REQUIRED` | shared canonical TV config/state/renderer; BOM unresolved — F-014 |
| M045 | `LED_FLOODLIGHT` | `DECISION_REQUIRED` | top-light state/renderer contract; BOM unresolved — F-014; top-fixture policy under F-011 |
| M046 | `illuminated-foam` | `DECISION_REQUIRED` | explicit noncatalog contract/state/renderer/tests; BOM unresolved — F-014; wall-overlay policy under F-011 |

## Important cross-domain notes

- F-010 is not repeated 45 times. It is the single architectural risk that module creation is routed by a hidden parallel registry in `main.js`.
- F-011 is not repeated per special placement module. A05/A06/A09 will enumerate concrete policy branches under the same root finding.
- External model license/attribution completeness is not decided here; A13/A21 owns that audit.
- `DECISION_REQUIRED` does not mean the module is broken in the editor. It means its final BOM policy is not yet canonically decided.

Section audit status: **GAP / DECISION_REQUIRED — inspection complete for A04; no fix performed.**
Next strict audit section: **A05 — Module behavior**.
