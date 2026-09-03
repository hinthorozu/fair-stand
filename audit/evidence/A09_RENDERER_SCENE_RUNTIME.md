# A09 — Renderer / scene / runtime-derived behavior audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Renderer architecture observed

`scene3d.js` currently owns:

- Three.js scene/cameras/controls/render loop
- stage/floor/grid/wall guides
- procedural module renderers
- GLB model loaders and cached templates
- TV/media/illuminated-foam renderers
- selection/raycasting/context-menu context creation
- drag preview/drop planning integration
- surface appearance mutation and texture application
- renderer-side resource disposal

This concentration is functional but creates several cross-domain ownership couplings already tracked in F-011/F-017.

## Findings

### F-024 — P2 — model load failure leaves model-backed modules effectively invisible with console-only failure

Several GLB-backed module renderers create a transparent selection proxy, then asynchronously attach the actual GLB. On load failure the handlers generally only `console.warn(...)`; no visible fallback geometry/status is promoted to the user.

Examples include indoor plant, coat rack, kettle and other cached GLB families. Because the proxy material is intentionally invisible, a missing/corrupt/unavailable model can leave a persisted module occupying placement/collision space without visible product geometry.

The cached loader promises are also retained after rejection, so a transient first load failure remains a rejected cached promise for subsequent attempts during that page session.

This is a resilience/observability finding, not evidence that committed public assets are currently missing.

## Checklist results

- **A09.01 state-driven rebuild:** `AUDITED_OK` for current module families. Rebuild consumes module state plus canonical catalog/config values.
- **A09.02 renderer only visualizes:** `GAP` — F-017; scene3d directly mutates persistent editable surface state.
- **A09.03 GLB/procedural availability:** `GAP` — committed model paths inspected, but failure fallback/feedback is inadequate (F-024). Asset existence/license is A13/A21.
- **A09.04 renderer-only appearance hacks:** `GAP` — renderer contains many visual constants appropriately, but module-specific interaction/placement routing is also embedded; F-011. Runtime dimension duplication for LED/model families references F-019.
- **A09.05 loading failure:** `GAP` — F-024.
- **A09.06 async race / stale scene:** `GAP/P2 observation` — some async model attach paths check `group.parent` before attaching after load, while others do not. Detached-group attachment is primarily a resource-lifecycle/performance risk; A17 classifies it rather than opening a duplicate here.
- **A09.07 disposal:** `IN_SCOPE_A17` — explicit disposal helpers exist; full geometry/material/texture/shared-template correctness audited in performance section.
- **A09.08 repeated stage rebuild:** `AUDITED_OK` at functional level — stage/wall groups and selection are cleared/rebuilt rather than knowingly accumulated. Resource correctness deferred A17.
- **A09.09 resize/DPR:** `AUDITED_OK` at current code level — renderer pixel ratio is capped (1 coarse / 1.5 otherwise), camera fit uses container aspect, resize logic exists. Browser E2E validates actual resize A19.
- **A09.10 capture/render:** `AUDITED_OK` at source level — current-view PNG capture temporarily uses requested scale and restores editor dimensions/state; actual browser export is A19.
- **A09.11 specialized renderers:** `GAP` only where common ownership rules are bypassed: F-011, F-017, F-019. No additional one-off persistent rule was separated into a new finding.
- **A09.12 runtime-only behavior:** `AUDITED_OK` for current module set — no live clock/timer module currently exists. Shelf/fabric/foam settings that affect future rebuild are intentionally persistent.

## Cross-domain conflicts

- Scene surround constant duplication: F-012.
- Placement/type policy in renderer: F-011.
- Persistent state mutation in renderer: F-017.
- State/catalog runtime dimensions: F-019.
- Catalog identity ambiguity can affect renderer labels/contracts but is rooted at F-013.

Section audit status: **GAP**.
Next audit section: **A10 — UI controls / inputs / menus / shortcuts / feedback**.
