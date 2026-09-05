# A03 F-011 closure

Finding: **F-011 — Module-specific placement/interaction policy fragmented outside behavior contract**

Status: **CLOSED / POST-MERGE VERIFIED**

## Remediation

- `src/moduleBehavior.js` is now the canonical declarative owner of module-specific placement/interaction policy selection.
- `src/modulePlacement.js` consumes behavior selectors for magnetic snap, logical fixture endpoints, base-wall collision depth, thin-wall endpoint contact, wall-inner-face boundary behavior, relationship-specific overlap, side-insert rotation strategy, wall capacity and related placement policy instead of maintaining private module-type registries/selectors.
- `src/scene3d.js` no longer owns the `freePanelSupportTypes` registry; wall-overlay support selection routes through `supportsWallOverlayMount(...)` while the existing renderer/support geometry remains unchanged.
- `src/main.js` no longer selects the top-fixture duplicate path through `sourceModule.type === 'led-floodlight'`; it routes through `isTopPlacementModule(...)` while preserving the existing 20 cm side offset, `zCm: 350`, clamp logic and wall-axis geometry.
- The pre-F-011 kettle declaration remains `collision: 'none'`. The remediation preserves the pre-existing runtime placement collision semantics while expressing the kettle/mini-fridge stacking relationship declaratively through behavior policy.
- Geometric algorithms remain in placement/rendering core; this finding changed policy ownership, not product geometry or intended interaction semantics.

## Regression evidence

Targeted unit/integration coverage includes:

- `test/moduleBehaviorContract.test.js` — protects the expanded canonical behavior contract.
- `test/moduleBehaviorPolicy.test.js` — verifies F-011 policy selectors, the kettle compatibility contract, removal of private placement registries, the wall-overlay capability, and the `main.js` top-fixture routing boundary.
- `test/modulePlacement.test.js` and `test/depotFreeDragSnap.test.js` — protect placement/snap behavior through the canonical selectors.
- `test/kettle.test.js` and `test/miniFridge.test.js` — protect the existing kettle/fridge placement relationship without changing the kettle declaration.
- `test/baseModule.test.js`, `test/lCounterPlacement.test.js`, `test/indoorPlants.test.js`, `test/ledFloodlightModule.test.js`, and `test/tv42Module.test.js` — protect representative special-policy module families.
- `test/illuminatedFoamModule.test.js` — validates wall-overlay behavior through the canonical policy API rather than stale implementation-location coupling.
- `e2e/f011-module-behavior.spec.mjs` — Chromium regression covers representative real catalog free-placement behavior. Its mini-fridge grid assertion validates physical footprint edges, matching the merged 50×50×66 mini-fridge contract.

## Full-system impact review

The accepted F-011 change contract ran under schemaVersion 2 full-system impact discovery and reviewed the discovered runtime/code dependents, tests, docs/contracts and linked findings.

- **F-015 remains OPEN.** Side-insert enforcement is an independent finding; F-011 only centralized the policy selection surfaces it touched.
- **F-016 remains OPEN.** The right-wall 90°/270° orientation conflict remains an independent finding and was not closed by F-011.
- **F-012 remains OPEN.** It is the remaining A03 architecture finding and is next in section order.
- No A04+ finding is closed by this remediation.

## CI and merge evidence

- implementation PR: **#49 — Close F-011: centralize module placement policy**
- final implementation head: `c2bfcd4e1a173bcf463cff8e1e0c1e43378acf5b`
- PR CI: **#211 / run `33952651314` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `934ca39a19453e8660f9cdbae81ce000e91edae1`
- post-merge `ROG` CI: **#212 / run `33953247234` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Result

F-011 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge, and post-merge verification are complete.

**F-011 is CLOSED.** A03 remains in progress with **F-012** next.
