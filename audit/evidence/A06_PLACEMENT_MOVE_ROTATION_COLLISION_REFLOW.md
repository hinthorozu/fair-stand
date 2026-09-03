# A06 — Placement / move / rotation / collision / reflow audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Core sources inspected

- `src/modulePlacement.js`
- `src/moduleMove.js`
- `src/wallReflow.js`
- `src/cornerPlacement.js`
- placement/move/reflow tests
- scene drag/drop integration paths

## Checklist results

### A06.01 — coordinate convention

Placement state consistently stores `xCm`, `yCm`, `zCm`, `rotationZDeg`, `wallId`. X/Y are plan-ground coordinates and Z is vertical offset. Renderer converts plan Y into Three.js world Z while keeping vertical height in Three.js Y, which is an implementation transform rather than a persisted-coordinate violation.

**Status:** `AUDITED_OK`.

### A06.02 — new placement infrastructure

Catalog drag/drop and context insertion route through `snapPlacementToStand`, `validatePlacementAgainstModules`, continuous wall insertion or free-side insertion. Automatic wall/depot programmatic paths generate placements through their own planners but preserve the same persisted placement schema.

Hidden module-specific selection of special algorithms remains root finding F-011.

**Status:** `GAP` by F-011.

### A06.03 — drag vs programmatic constraints

Drag preview validates before final drop; final drop reuses preview result. Context/catalog insertion uses placement planners before mutating `currentModules`. Programmatic automatic composition has separate planner contracts and is audited in A11.

No direct evidence was found of a current drag path committing a placement that preview rejected.

**Status:** `AUDITED_OK` for current drag/final equivalence; A11 owns composition parity.

### A06.04 — move invariants

`planContinuousModuleMove()` removes the moving module, validates desired placement, and either commits direct placement or reflows through `planContinuousWallInsertion`. Free movement validation is done by placement core in scene interaction.

**Status:** `AUDITED_OK` for current core, with special-type policy fragmentation under F-011.

### A06.05 — rotation invariants

Rotation helpers normalize to 45° increments and preserve module center. Behavior supplies requested rotation step. Placement tests cover 45° straight counters, cardinal walls, center-preserving rotation and right-wall facing.

**Status:** `AUDITED_OK` for active path.

### A06.06 — collision preview/final

The drag result contains the validated plan/placements used by drop; continuous insertion/move and free validation share `validatePlacementAgainstModules`.

**Status:** `AUDITED_OK`, while special collision/endpoint rules remain F-011.

### A06.07 — wall capacity

Continuous wall capacity comes from `getContinuousWallSegments/Capacity`; stage composition has a feature-specific capacity helper. No contradictory active runtime capacity result was found at this stage; A11/A23 cross-checks feature composition against placement capacity.

**Status:** `AUDITED_OK` provisionally, cross-domain retest A23.

### A06.08 / A06.09 — deletion gaps and reflow scope

Deletion in main removes only the selected module and rebuilds the scene; it does not invoke compact/reflow. Reflow planners only shift the collision chain needed for an insertion/move and keep unaffected modules in place. Existing wall-reflow tests cover forward/backward/local chain behavior.

**Status:** `AUDITED_OK`.

### A06.10 — corner placement

### F-016 — P2 — stale/conflicting right-wall orientation in `cornerPlacement.js`

The active canonical placement snap test states that the right wall faces inward at **270°**, and `wallReflow.js:createPlacement()` also creates right-wall placements at 270°.

`cornerPlacement.js:createWallPlacement()` creates both left and right side-wall placements at **90°**. Its own regression test explicitly expects right-wall corner wrap at 90°.

Therefore the repository contains two contradictory implementations/tests for the same right-wall orientation rule. Current main flow appears to use wall reflow rather than this helper; A22 will determine whether `cornerPlacement.js` is orphaned/dead. Regardless, it is a conflicting implementation that can mislead future development.

**Status:** `GAP` — F-016.

### A06.11 — free object bounds

For free modules with meaningful depth, placement uses rotated half-extents; for structural thin segments it validates segment bounds. Current tests cover free-grid placement, strict furniture bounds, magnetic connections and rotations.

**Status:** `AUDITED_OK` for current rules.

### A06.12 — wall-overlay relation

TV/illuminated-foam placements persist `wallId`, plan coordinates, rotation and `zCm`; load rebuild reads those values. Special wall-overlay/free-support behavior is not fully declarative and is captured by F-011. Persistence round-trip details are audited in A08/A09.

**Status:** `GAP` by F-011 pending persistence cross-check.

### A06.13 — numeric invalid transforms

Core placement rejects non-finite/invalid width and stand sizes. State factories constrain current catalog dimensions. `createModulePlacement()` normalizes non-numeric placement fields to zero, which is permissive but does not itself create NaN transforms. Import trust-boundary validation is audited later in A14/A15.

**Status:** `AUDITED_OK` for internally-created state; external/import data deferred.

### A06.14 — deterministic failure reasons

Placement, move and reflow planners return `{ok:false,message}` with explicit failure causes; UI surfaces those messages.

**Status:** `AUDITED_OK`.

## Section conclusion

- New finding: F-016 P2.
- Root finding reused: F-011 P1.
- No fixes performed.

Section audit status: **GAP**.
Next audit section: **A07 — State model + factories**.
