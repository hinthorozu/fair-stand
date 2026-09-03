# A05 — Module behavior audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Behavior registry inventory

Canonical owner: `src/moduleBehavior.js`.

Current explicit runtime types:

- flat-panel
- showcase-3
- showcase-2
- shelf
- door
- base-wall
- separator
- counter
- base
- sofa-set-classic
- table-chair-set-eames
- bar-stool
- mini-fridge
- kettle
- coat-rack
- indoor-plant-1
- illuminated-foam
- tv
- led-floodlight

Current behavior dimensions:

- `placement`
- `moveSnapCm`
- `rotationStepDeg`
- `defaultRotationDeg`
- `allowSideInsert`
- `collision`
- `ghost`

Descriptor-aware overrides:

- L counter default rotation = 270°
- straight 100/150/200 counter rotation step = 45°

## Checklist results

### A05.01 / A05.02 / A05.03 — profiles/types/fallback

All 19 current runtime types are explicit in `TYPE_BEHAVIORS`, including `illuminated-foam`. `test/moduleBehaviorContract.test.js` derives unique catalog runtime types and fails if any catalog type is not explicit. Unknown non-catalog types remain distinguishable via `hasExplicitModuleBehavior()`.

**Status:** `AUDITED_OK`.

### A05.04 — movement snap

Snap values are declared centrally and consumed through `getModuleMoveSnapCm()` in placement/move interaction paths. No second module-type snap table was identified.

**Status:** `AUDITED_OK` for canonical values. Hidden special placement algorithms remain under F-011.

### A05.05 — rotation step/default/limits

Rotation step/default are centralized in behavior registry, including descriptor-aware counter overrides. Existing rotation regression tests protect special counter/bar-stool behavior.

The current behavior schema has no bounded min/max/direction policy; no current module contract in the 45+1 audited set requires such a bound, so this is not a present bug.

**Status:** `AUDITED_OK` for current module set.

### A05.06 — collision

Collision strategy is centrally declared (`segment`, `footprint`, `none`) and placement core reads it. However module-specific geometry/endpoint/stacking rules remain distributed outside the declarative contract; root finding F-011 already covers that ownership gap.

**Status:** `GAP` by F-011, no duplicate finding.

### A05.07 — ghost

All behaviors resolve a ghost (explicit or central default). `scene3d` routes placement ghost creation through `getModuleGhostBehavior()` and builds real module silhouette with fallback box.

**Status:** `AUDITED_OK`.

### A05.08 — side insertion

### F-015 — P1 — `allowSideInsert` is declared but not enforced

`MODULE_BEHAVIOR_STANDARD.md` explicitly defines:

> `allowSideInsert`: whether context left/right insertion is allowed.

Current behavior declares `allowSideInsert:false` for `illuminated-foam` and `tv`.

But the context menu always renders and handles:

- `add-right`
- `add-left`
- `duplicate-right`
- `duplicate-left`

without reading module behavior or `allowSideInsert`. The main insertion planners likewise do not reject the operation based on this behavior field.

Therefore the behavior contract can claim side insertion is forbidden while UI/runtime still offers and attempts it. This is a contract-to-runtime enforcement gap, not merely missing documentation.

**Status:** `GAP` — F-015.

### A05.09 — selectability/deleteability

Select/delete are currently global editor capabilities rather than per-module behavior fields. No current module declares a contradictory module-specific policy. That is acceptable under the existing contract, though A10/A16 will audit interaction/accessibility details.

**Status:** `AUDITED_OK` for current declared contract.

### A05.10 — hidden behavior overrides

Type-specific placement/interaction decisions exist in `modulePlacement.js`, `scene3d.js`, and a LED duplication path in `main.js`. These are already grouped under F-011. The specific algorithms will be enumerated again in A06/A09 only as evidence against the same root finding.

**Status:** `GAP` — F-011.

## Section conclusion

A05 inspection is complete.

- New finding: F-015 P1.
- Reused root finding: F-011 P1.
- No fix performed.

Section audit status: **GAP**.
Next audit section: **A06 — Placement / move / rotation / collision / reflow**.
