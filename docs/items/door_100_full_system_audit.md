# door_100 — Full System Audit

**Scope:** `Version2` current runtime and Item Contract architecture  
**Item:** `door_100`  
**Related physical child Item:** `door_leaf_100`  
**Audit mode:** analysis/documentation only; this document does not itself change runtime behavior.

---

## 1. Executive summary

`door_100` has been migrated to the new Item system substantially correctly. The current architecture separates the catalog/runtime composite door module from the physical door leaf, uses canonical Item identity for catalog/state/BOM ownership, restores canonical identity on legacy project load, and resolves the base production recipe recursively through the Item BOM layer.

The core model is now:

```text
door_100
= catalog/runtime composite door module

  ├─ profile_91 × 1
  ├─ upright_346_5 × 2
  ├─ panel_98 × 3
  ├─ connector_start × 2
  ├─ connector_single × 5
  └─ door_leaf_100 × 1
```

The physical door leaf is a separate canonical Item:

```text
door_leaf_100
= physical wooden door leaf
= 100 × 200 × 8 cm
= default product color: white
= unit: adet
```

The parent/child split, property ownership, catalog cutover, state construction, persistence normalization, renderer boundary and base recursive BOM are all structurally sound.

However, the audit found open gaps that prevent treating the whole identity → relationship → BOM → regression chain as fully closed:

1. `moduleContracts.js` resolves `door_100` with `composition.mode = standalone`, while the canonical Item itself is explicitly recipe/composite and creates/owns a child `door_leaf_100` surface relationship. This is a contract-semantics mismatch.
2. `resolveItemBom('door_100')` resolves the base recipe but has no runtime relationship/variant context, so it cannot by itself express the door recipe's `panel_corner_92` inner-corner variant.
3. Door-specific browser E2E coverage verifies canonical creation identity but does not cover the full door lifecycle: movement, rotation, side insertion/reflow, relationship/corner behavior, leaf color/image editing, duplication, persistence round-trip and relationship-aware BOM.
4. Existing `door_100` documentation describes the migrated architecture well but does not explicitly record the two open contract/BOM boundaries above.

**Overall audit status:** `PASS WITH OPEN GAPS`.

---

## 2. What `door_100` is

`door_100` is not the physical wooden door leaf. It is the canonical 100 cm composite door module selected and placed by the user.

Canonical responsibilities of `door_100`:

- canonical `itemKey = door_100`
- product/module name `Depo Kapısı 100`
- runtime family `type = door`
- nominal width `100 cm`
- catalog identity
- project-instance state root
- recipe/composition pointer
- behavior-family participation
- parent ownership of the door module's editable/project state

The Item-level composition is recipe-backed and points to the canonical door recipe.

Conceptually:

```text
Item: door_100
    ↓
composition.mode = recipe
    ↓
moduleType = door
nominalWidthCm = 100
    ↓
moduleRecipes.js
```

---

## 3. What `door_100` is not

The following physical properties do **not** belong canonically to the parent `door_100` Item:

| Property | Canonical owner |
|---|---|
| wooden material | `door_leaf_100` |
| physical leaf width | `door_leaf_100` |
| physical leaf height | `door_leaf_100` |
| physical leaf thickness | `door_leaf_100` |
| product default white color | `door_leaf_100` |
| user-selected leaf color | project instance child surface |
| user-selected leaf image | project instance child surface |
| door recipe quantities | `moduleRecipes.js` |
| move/collision/reflow algorithms | behavior/placement core |
| procedural mesh implementation | `scene3d.js` |
| pricing/cost values | pricing/costing layer, not BOM |

This separation is intentional and correct. Copying the door leaf's physical dimensions/material/default color into `door_100` would create a second implicit business source and would violate canonical Item ownership.

---

## 4. Canonical source-of-truth map

| Concern | Canonical owner | Runtime consumer(s) |
|---|---|---|
| `door_100` identity | `src/items.js` | catalog, state, BOM |
| parent type | `src/items.js` | catalog/state/behavior/renderer |
| nominal parent width | `src/items.js` | catalog/state/recipe resolution |
| parent composition pointer | `src/items.js` | `src/itemBom.js` |
| catalog descriptor | `src/catalog.js` | picker/runtime creation |
| runtime module instance | `src/designState.js` | project/scene |
| instance `id` | state creation | project instance identity |
| placement family | `src/moduleBehavior.js` | placement/move core |
| move snap | `src/moduleBehavior.js` | movement core |
| rotation policy | `src/moduleBehavior.js` | placement/runtime |
| collision strategy | `src/moduleBehavior.js` | placement core |
| side insertion/reflow | behavior + `wallReflow.js` | runtime layout |
| production recipe quantities | `src/moduleRecipes.js` | BOM |
| recursive Item BOM expansion | `src/itemBom.js` | BOM consumer/debug UI |
| physical leaf properties | `src/productionParts.js` / canonical production Item | state/render/BOM |
| leaf capabilities | `src/itemCapabilities.js` | context menu/UI |
| leaf instance appearance | child surface in project state | renderer |
| context-menu capabilities | context menu + Item capabilities | UI |
| procedural door geometry | `src/scene3d.js` | Three.js scene |
| save/load normalization | project restore + `normalizeModuleItemState()` | persistence |

The important architectural result is that catalog and runtime do not need to redefine the parent Item's intrinsic identity/name/type/nominal width as independent business constants.

---

## 5. Parent/child state model

A created door module is conceptually structured like this:

```text
module instance
├─ id                       project instance identity
├─ itemKey = door_100       canonical parent Item
├─ catalogKey = door_100    catalog identity
├─ type = door
├─ widthCm = 100
├─ placement
├─ strips[]                 editable upper panel surfaces
└─ surface
   ├─ itemKey = door_leaf_100
   ├─ color
   ├─ imageAssetId
   └─ imageTransform
```

This establishes two distinct identities:

```text
door_100       = complete composite door module

door_leaf_100  = physical door leaf contained by the module
```

That distinction is correct and should remain explicit.

---

## 6. `door_leaf_100` ownership

The physical child Item owns the verified physical product data.

Expected canonical meaning:

```text
itemKey: door_leaf_100
type: door-leaf
dimensions: 100 × 200 × 8 cm
material: ahşap
defaultColor: white
unit: adet
```

The parent should not duplicate those properties.

The instance surface may override appearance without mutating the canonical product definition:

```text
canonical default
    ↓
instance surface.color / image
    ↓
persisted project override
    ↓
renderer
```

This is the correct canonical-default → project-override → renderer flow.

---

## 7. Appearance and capabilities

`door_leaf_100` supports editable leaf appearance through Item capabilities.

Current capability intent:

```text
color    = true
image    = true
glass    = false
lightbox = false
mesh     = false
```

Therefore the leaf can receive user color/image overrides, but should not expose unrelated panel transformations such as glass/lightbox/mesh conversion.

The capability decision belongs to Item/capability ownership, not a second hardcoded `if (door)` business rule in the renderer or menu.

---

## 8. Placement, move, rotation, collision and reflow

`door_100` participates in the wall behavior family through `type = door`.

Current intended behavior includes:

| Behavior | Door behavior |
|---|---|
| placement | wall |
| move snap | 50 cm |
| rotation step | 90° |
| default rotation | 0° |
| collision | segment-based wall logic |
| magnetic snap | standard wall behavior |
| wall capacity | consumes continuous wall capacity |
| side insertion | supported |
| continuous reflow | supported |

The algorithms are not owned by the Item itself. They are delegated to the behavior/placement/reflow core, which is the correct architectural boundary.

Conceptual chain:

```text
moduleBehavior.js
    ↓
modulePlacement.js
    ↓
moduleMove.js
    ↓
wallReflow.js
```

No separate door-only movement/collision engine should be introduced unless the verified product behavior truly requires it.

---

## 9. Renderer boundary

The renderer recognizes the door runtime family and creates a specialized/procedural door representation.

Conceptually:

```text
moduleState.type === 'door'
    ↓
createDoorModule(...)
```

The renderer must consume canonical/project state but must not become the owner of product/BOM truth.

Important distinction:

- `door_leaf_100` physical dimensions are production/product truth.
- renderer geometry may use implementation-specific dimensions/transforms to fit the visual frame.
- renderer mesh values must not silently replace canonical production dimensions.

The current architecture broadly respects this boundary.

---

## 10. Persistence and legacy normalization

The migrated system supports loading older door states and repairing canonical identity.

Conceptual restore path:

```text
persisted modules
    ↓
clone project state
    ↓
normalizeModuleItemState()
    ↓
legacy door type + width=100 detected
    ↓
parent itemKey = door_100
    ↓
child surface itemKey = door_leaf_100
    ↓
catalog identity resolved
```

The normalization should add missing canonical identity without overwriting valid user appearance overrides.

This is the correct compatibility strategy: normalize identity and missing canonical structure, preserve user-owned persisted values.

No door-specific active-runtime legacy identity break was identified in this audit.

---

## 11. Canonical production recipe

The verified base recipe for the 100 cm door is:

| Item | Quantity |
|---|---:|
| `profile_91` | 1 |
| `upright_346_5` | 2 |
| `panel_98` | 3 |
| `connector_start` | 2 |
| `connector_single` | 5 |
| `door_leaf_100` | 1 |

The recipe also identifies the inner-corner panel variant:

```text
innerCornerPanelItemKey = panel_corner_92
```

This distinction matters for relationship-derived BOM behavior and is the source of one open gap described below.

---

## 12. Recursive Item BOM behavior

The new Item BOM path is conceptually:

```text
resolveItemBom('door_100')
    ↓
getItem('door_100')
    ↓
composition.mode === 'recipe'
    ↓
getModuleRecipe('door', 100)
    ↓
recipe child identities
    ↓
getItem(child)
    ↓
recurse if composite
    ↓
terminal Item → itemKey + quantity + unit
    ↓
aggregate identical lines
```

The resolver also rejects cyclic composition.

This means the recursive composite BOM mechanism is real runtime code, not documentation-only architecture.

The base `door_100` recipe resolves correctly through this path.

---

## 13. BOM and pricing separation

The Item BOM layer should emit product requirements, not prices.

Expected terminal BOM data is limited to concepts such as:

```text
itemKey
quantity
unit
canonical item metadata
```

Pricing/costing must remain a separate layer.

The inspected `door_100` path follows that separation.

---

# OPEN FINDINGS

## F-D100-01 — Module contract composition semantics mismatch

**Severity:** P1/P2 architecture/contract gap  
**Runtime currently broken:** not demonstrated  
**Contract consistency:** incomplete

### Observed state

The canonical Item says:

```text
door_100
composition.mode = recipe
```

The module contract uses the shared `wall-editable` profile, whose composition policy is:

```text
composition.mode = standalone
```

The door assignment adds recipe BOM policy but does not override module-contract composition.

Therefore the resolved module contract can effectively say:

```text
composition.mode = standalone
bom.mode = recipe
```

while the canonical Item is explicitly composite/recipe and creates/owns a `door_leaf_100` child surface relationship.

### Why this matters

The system development contract describes composition/dependencies in terms of whether a module creates/contains other Items/modules/components and what parent/child relationships exist.

Under that meaning, `door_100` is not purely standalone.

At minimum, one of the following must eventually be made explicit:

1. `door_100` overrides module composition with an appropriate composite/child policy; or
2. module-contract `composition` is explicitly redefined as a different concept from Item composition, with a machine-checkable rule that removes the ambiguity.

### Existing test gap

Current generic module-contract regression verifies that `contract.composition.mode` exists, not that it agrees with canonical Item composition/dependency reality.

The door Item contract test verifies the Item recipe and BOM policy but does not currently machine-compare the resolved module-contract composition against the Item's composite relationship.

### Status

`OPEN GAP`

---

## F-D100-02 — Relationship/corner-aware BOM context is missing from `resolveItemBom`

**Severity:** P1/P2 BOM architecture gap  
**Base BOM:** correct  
**Relationship-derived BOM:** not fully represented by Item resolver

### Observed state

The canonical door recipe supports an inner-corner panel variant:

```text
base panel: panel_98
inner-corner panel: panel_corner_92
```

The expanded recipe layer can apply panel variants when appropriate context is supplied.

However:

```text
resolveItemBom('door_100')
```

receives only the Item identity/quantity and resolves the canonical base composition. It has no runtime placement/relationship/corner context parameter.

Therefore the Item BOM resolver alone cannot express the `panel_98 → panel_corner_92` relationship-derived substitution.

### Why this matters

The Item Contract checklist explicitly requires variant/relationship-derived BOM to be classified and verified when product composition depends on runtime relationships.

Without relationship context, the new Item BOM path can be correct for the base recipe while still being insufficient for a corner-installed door.

### Required follow-up

Before declaring the BOM migration fully closed, determine the canonical relationship-aware BOM design. The solution should not derive BOM from renderer meshes or ad-hoc UI state.

A proper design should define:

- what relationship/context input the BOM layer receives,
- which layer owns conversion from project relationships to recipe variant context,
- how `panel_corner_92` is selected,
- how the result remains deterministic and testable,
- how base and relationship-derived BOM are distinguished.

### Status

`OPEN GAP`

---

## F-D100-03 — Door-specific browser E2E coverage is incomplete

**Severity:** P2 regression gap

### Existing browser evidence

Current browser coverage verifies that adding the door from the picker creates canonical state including parent `door_100` and child `door_leaf_100` identity.

That is valuable but not sufficient to protect the whole migrated lifecycle.

### Missing/insufficient door-specific browser scenarios

| Scenario | Door-specific E2E status |
|---|---|
| picker → canonical create | covered |
| wall move/snap | missing |
| rotation | missing |
| side insertion | missing |
| continuous reflow | missing |
| corner relationship | missing |
| collision through actual UI | missing |
| leaf color edit | missing |
| leaf image edit | missing |
| context-menu capability | missing |
| duplicate with nested leaf overrides | missing |
| save → reload appearance/identity round-trip | missing |
| relationship-aware BOM | missing |

Generic unit tests cover important wall/reflow algorithms, but they do not substitute for a door-specific real-browser flow using the actual canonical door state, menu, persistence and renderer integration.

### Recommended targeted E2E scope

A robust door regression should eventually exercise at least:

```text
picker create
→ verify door_100 / door_leaf_100 identity
→ edit leaf color/image
→ move/rotate
→ side insert / reflow
→ exercise corner relationship
→ duplicate
→ save/reload
→ verify identity + overrides
→ verify correct base/relationship-aware BOM
```

The exact number of specs may be split for maintainability, but the lifecycle needs explicit coverage.

### Status

`OPEN GAP`

---

## F-D100-04 — Documentation does not yet record the open semantic/BOM boundaries

**Severity:** P2/P3 documentation gap

Existing files under:

```text
docs/items/current-system/door_100.md
docs/items/definitions/door_100.md
```

correctly document most of the migrated architecture, including identity, parent/child separation, state, behavior, persistence, recipe, renderer boundary and recursive BOM.

However, they should not imply complete closure without noting:

1. Item composition is recipe/composite while module-contract composition currently resolves through a `standalone` profile.
2. `resolveItemBom('door_100')` resolves base composition without runtime relationship/corner context.
3. Door-specific browser regression does not yet protect the full lifecycle.

This audit document records those gaps until the canonical docs/contracts/tests are updated.

### Status

`OPEN GAP`

---

## 14. Investigated concern that is **not** a bug: `panel_98` strip state identity

The door contains three editable upper strip surfaces corresponding to production panels in the recipe.

The runtime strip state does not necessarily carry a separate project-instance `itemKey = panel_98` for each surface.

This initially looks like an Item migration omission, but the inspected `panel_98` contract/documentation establishes a deliberate boundary:

- `panel_98` is a canonical production/BOM Item.
- the editable visual surface is stored inside the parent module state.
- the surface is not a separate project entity merely because the BOM contains a `panel_98` line.
- editor initial surface color is not automatically the same concept as a product-level canonical `defaultColor`.

Therefore this is **not** classified as a `door_100` migration bug.

---

## 15. Checklist result

| Checklist area | Result | Notes |
|---|---|---|
| canonical identity | PASS | `door_100` |
| parent type | PASS | `door` |
| canonical nominal width | PASS | 100 cm |
| project instance identity separation | PASS | instance `id` remains separate |
| parent/child Item split | PASS | `door_100` / `door_leaf_100` |
| intrinsic child properties | PASS | owned by `door_leaf_100` |
| catalog cutover | PASS | canonical Item data consumed |
| state factory | PASS | canonical parent/leaf identity created |
| default appearance ownership | PASS | child Item default → instance override |
| placement | PASS | wall family |
| move/snap | PASS | behavior family |
| rotation | PASS | behavior family |
| collision | PASS | wall/segment core |
| side insertion | PASS | supported through wall behavior |
| reflow | PASS at core behavior level | generic wall reflow tested |
| context menu capability ownership | PASS | Item capability driven |
| renderer boundary | PASS | renderer consumes state, not BOM owner |
| persistence | PASS | project state persisted |
| legacy normalization | PASS | canonical identities repaired |
| duplicate/delete general ownership | PASS structurally | targeted door browser coverage incomplete |
| base recipe | PASS | verified quantities |
| recursive Item BOM | PASS | base recipe resolves recursively |
| cycle protection | PASS | resolver rejects cyclic composition |
| pricing separation | PASS | BOM not pricing owner |
| module composition semantics | **GAP** | standalone vs composite ambiguity |
| relationship-derived/corner BOM | **GAP** | Item resolver lacks context |
| door-specific full browser regression | **GAP** | lifecycle coverage incomplete |
| canonical docs completeness | **PARTIAL** | open gaps not yet reflected |

---

## 16. Final audit decision

The migration succeeded in the most important architectural areas:

```text
canonical parent identity
+ physical child identity
+ correct property ownership
+ catalog/state cutover
+ compatibility normalization
+ behavior-family integration
+ renderer separation
+ base recursive BOM
```

No evidence was found that the active runtime still treats `door_100` itself as the physical 100 × 200 × 8 wooden door leaf.

The correct model is:

```text
door_100
= user/catalog-selected composite 100 cm door module

door_leaf_100
= physical wooden leaf contained by that module
```

The Item should therefore remain classified as successfully migrated at the canonical identity/property level.

It should **not yet be treated as fully closed across the entire Item Contract checklist** until the following are resolved:

1. module-contract composition semantics,
2. relationship/corner-aware BOM resolution,
3. targeted full door browser regression,
4. canonical documentation updates after those decisions.

**Final status:** `PASS WITH OPEN GAPS`.

---

## 17. Follow-up order

Recommended order when implementation work is authorized:

1. Decide/fix `door_100` module composition semantics without inventing a second Item truth.
2. Define canonical relationship-aware Item BOM context and cover `panel_corner_92` substitution.
3. Add targeted unit/contract regression for the two rules above.
4. Add door-specific browser E2E lifecycle coverage.
5. Update `docs/items/current-system/door_100.md` and `docs/items/definitions/door_100.md` to reflect the final resolved architecture.
6. Re-run the full Item Contract checklist against fresh `Version2` HEAD and only then mark the entire door lifecycle fully closed.
