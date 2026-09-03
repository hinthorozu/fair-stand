# A03 — Repository architecture / ownership audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No product/runtime fix in this evidence commit.

## Primary ownership map (`src/`)

| File | Primary responsibility | Secondary / coupling notes |
|---|---|---|
| `assetStore.js` | persistence / IndexedDB assets | shares DB schema constants with projectStore |
| `autoDepot.js` | feature composition | generates depot plan/specs |
| `automaticWall.js` | composition / wall planning | stand geometry dependent |
| `autosaveController.js` | persistence lifecycle | UI status callback only |
| `catalog.js` | catalog identity / nominal metadata | descriptor resolution |
| `colorEditor.css` | UI styling | — |
| `colorEditorController.js` | UI/color editor controller | color conversion/apply callback |
| `colorEditorInputs.js` | UI input normalization | numeric color inputs |
| `colorUtils.js` | color conversion utility | editor support |
| `cornerPlacement.js` | placement geometry | corner logic |
| `designState.js` | module/project editable state factories | currently also a few module-type summary helpers |
| `featureContracts.js` | feature contract registry | architecture/composition metadata |
| `groundLayout.js` | scene/ground layout utility | renderer-facing |
| `helpGuide.css` | UI styling | — |
| `helpGuide.js` | help UI | dynamic overlay/guide |
| `horizontalImageLayout.js` | image layout policy | state/renderer bridge |
| `imageActions.css` | UI styling | image controls |
| `imageAssetReferences.js` | asset-reference traversal | persistence cleanup support |
| `imageFit.js` | image fit geometry | renderer/image support |
| `main.js` | application orchestration | also owns module factory routing, project/archive flows, asset UI, feature wiring |
| `moduleBehavior.js` | module behavior registry | canonical behavior source |
| `moduleContextMenu.js` | module context UI | catalog/behavior capability presentation |
| `moduleContracts.js` | module contract registry | joins catalog + behavior + BOM policy |
| `moduleDragSidebar.js` | catalog drag UI | embeds presentation previews |
| `moduleMove.js` | placement/move planning | continuous wall movement |
| `modulePlacement.js` | placement/snap/collision core | contains type-specific geometric/policy branches |
| `moduleRecipes.js` | BOM recipes | production derivation |
| `placementFeedback.js` | placement UI feedback | pointer/status presentation |
| `productionParts.js` | canonical production parts | BOM source |
| `projectNaming.js` | project naming UI/policy | DOM modal/controller |
| `projectStore.js` | persistence / project IndexedDB | duplicates DB constants/open logic with assetStore |
| `projectSwitch.js` | project-switch UI policy | confirmation text + condition |
| `projectUi.js` | project UI state/loading | button/overlay helper |
| `rawBomDebug.js` | BOM debug surface | development/debug ownership |
| `rectImageLayout.js` | image rectangle layout | renderer/state bridge |
| `rectSelection.js` | selection geometry | interaction utility |
| `scene3d.js` | renderer + scene interaction | also mutates editable state and contains placement pointer/routing policy |
| `selectionFeedback.js` | selection feedback formatting | module capability presentation |
| `sidebarController.js` | sidebar UI | — |
| `stageFeedback.js` | stage/wall UI feedback | — |
| `standCapacity.js` | stand-bound validation | placement/composition input validation |
| `standSetup.js` | stand setup validation/config | also owns one scene-surround constant |
| `style.css` | global UI styling | — |
| `systemChangeContract.js` | development/change governance | change-gate schema + path mapping |
| `theme.js` | visual theme constants | renderer/UI shared |
| `tvConfig.js` | TV canonical dimensions/config | catalog/state shared |
| `uiFeedback.js` | generic UI status observers | DOM mutation observer |
| `viewCube.js` | camera/view-cube renderer UI | scene interaction |
| `viewKeyboardShortcuts.js` | keyboard command resolution | view/rotation interaction |
| `wall.js` | straight-wall composition utility | older/simple composition path |
| `wallReflow.js` | continuous wall placement/reflow | placement core |

Count: 51 `src/` files mapped.

## Findings

### F-010 — P1 — hidden runtime module-construction registry in `main.js`

**Domains:** architecture, catalog, state, tests, change-gate

`main.js:createCatalogModuleState()` contains a long `module.type` dispatch that selects the state factory for every catalog family. This is a second registry that must be updated independently of:

- `MODULE_CATALOG`,
- `MODULE_CONTRACT_ASSIGNMENTS`,
- `moduleBehavior`,
- state factories themselves.

The generic system-development contract tests prove catalog/contract/behavior/BOM contract coverage, but they do not prove that every catalog entry can pass through this runtime construction dispatcher. A new type can therefore be contract-complete yet fail to instantiate if this dispatcher is omitted.

Automatic-depot and automatic-wall generation also call factories directly through separate paths rather than a single canonical module-state construction registry.

**Cross-domain rule:** Later A04/A07/A11 occurrences that derive from this same parallel construction routing should reference F-010 rather than create duplicate findings.

### F-011 — P1 — module-specific placement policy is fragmented beyond the behavior contract

**Domains:** architecture, behavior, placement, renderer, tests

`moduleBehavior.js` is the declared source for placement mode, move snap, rotation step/default, side insertion, collision and ghost strategy. However additional module-specific placement policy exists in placement/scene interaction code, including examples such as:

- mini-fridge/kettle/coat-rack magnetic-snap exceptions,
- counter/base logical fixture endpoints,
- base-wall collision-depth/connect behavior,
- indoor-plant endpoint handling,
- mini-fridge/kettle stacking exception,
- LED floodlight top-fixture handling,
- wall-overlay/free-support routing and support-type list inside `scene3d.js`.

Some of these are legitimate geometric algorithms, but the contract cannot currently express/declare the policy that selects them. Therefore a module can have an apparently complete behavior contract while still depending on hidden type checks elsewhere.

**Cross-domain rule:** A05/A06/A09 should classify the specific branches, but use F-011 as the root finding unless an independent runtime bug is discovered.

### F-012 — P2 — stand scene-surround rule is duplicated

**Domains:** architecture, state/setup, renderer

`standSetup.js` owns `STAND_SURROUND_M = 1` and derives `sceneWidthM/sceneDepthM`. `scene3d.js` separately owns `STAGE_SURROUND_M = 1` and uses it for stage framing/grid/view extents. They currently agree numerically but are independent constants representing the same physical surround concept. A one-sided change can make setup/output messaging and rendered scene framing disagree.

## Architecture conclusions by checklist item

- A03.01: completed — all 51 src files mapped.
- A03.02: GAP — `main.js` and especially `scene3d.js` carry multiple major responsibilities; F-010/F-011 capture the dangerous rule ownership, not file size alone.
- A03.03: GAP — main is not orchestration-only because it owns runtime module factory routing; F-010.
- A03.04: GAP — scene3d legitimately owns renderer routing, but also owns module-specific placement/interaction policy and direct state mutation; F-011.
- A03.05: GAP — common placement infrastructure exists, but product-specific selection of special geometry/policies is fragmented; F-011.
- A03.06: GAP/structural — editable surface/module state is intentionally passed into scene meshes, but renderer methods directly mutate editable surface/placement state. This is not recorded as a separate finding because it is part of the renderer/interaction ownership concentration; A09 will determine whether it causes an independent correctness issue.
- A03.07: AUDITED_OK at architecture level — no BOM source was observed deriving production quantities from UI/renderer; BOM-specific proof deferred to A12.
- A03.08: GAP — type-specific branches classified; renderer branches are legitimate for rendering, while state-construction and placement-policy branches produce F-010/F-011.
- A03.09: GAP — duplicate scene surround constant; F-012. Other numeric duplication is checked in A04/A05/A12/A23 before creating any additional root finding.
- A03.10: AUDITED_OK for inspected dependency direction — no import cycle was identified in the canonical source ownership chain; scene3d imports drag-preview helpers, while those helpers do not import scene3d back.
- A03.11: AUDITED_OK at architecture level — project snapshots serialize plain stand/module state; selections, scene objects, object URLs and Three.js runtime refs are not included. Persistence details audited again in A07/A08.
- A03.12: GAP — placement exceptions exist and are tested individually in several places, but there is no complete declarative architecture inventory tying every exception to a module contract; F-011.

Section audit status: **GAP — inspection complete for A03; no fix performed.**
Next strict audit section: **A04 — Catalog + module contracts**.
