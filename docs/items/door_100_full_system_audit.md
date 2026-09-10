# door_100 — Full System Audit

**Scope:** `Version2` current runtime + Item Contract architecture  
**Item:** `door_100`  
**Physical child Item:** `door_leaf_100`  
**Purpose:** canonical system inventory, source-of-truth map, verified BOM behavior and open gaps.

---

## 1. Executive summary

`door_100` is correctly modeled as the canonical 100 cm **composite door Item**. It is not the physical wooden door leaf. The physical leaf remains the separate canonical child Item `door_leaf_100`.

The base production recipe is:

```text
profile_91            ×1
upright_346_5         ×2
panel_98              ×3
connector_start       ×2
connector_single      ×5
door_leaf_100         ×1
```

A verified product rule also exists for the **inner-corner** case. When the door recipe is resolved with inner-corner relationship context, the final BOM must be:

```text
profile_91            ×1
upright_346_5         ×2
panel_corner_92       ×3
connector_start       ×2
connector_single      ×3
connector_corner      ×2
door_leaf_100         ×1
```

The exact delta is:

```text
panel_98 ×3          → panel_corner_92 ×3
connector_single ×5  → connector_single ×3 + connector_corner ×2
connector_start ×2   → unchanged
```

This audit originally described the corner rule only as a panel substitution. That description was incomplete. The connector composition change above is now the canonical verified rule.

The implementation stores this delta inside the existing `door:100` recipe variant metadata in `src/moduleRecipes.js`; it does not duplicate the full recipe or hide door-specific quantities in renderer/UI code. `src/itemBom.js` can resolve the same canonical inner-corner variant recursively when recipe context is supplied.

**Current overall status:** `PASS WITH OPEN INTEGRATION/REGRESSION GAPS`.

---

## 2. What `door_100` is

`door_100` is the catalog/runtime parent Item selected and placed by the user.

Canonical parent responsibilities:

- `itemKey = door_100`
- name `Depo Kapısı 100`
- `type = door`
- `unit = adet`
- nominal parent width `100 cm`
- catalog identity
- project-instance root state
- recipe/composition pointer
- participation in shared wall behavior
- ownership of the module's nested project state

Conceptually:

```text
door_100
→ composition.mode = recipe
→ moduleType = door
→ nominalWidthCm = 100
→ src/moduleRecipes.js / door:100
```

---

## 3. What `door_100` is not

`door_100` is not the physical door leaf and must not duplicate the leaf's intrinsic product properties.

| Property / concern | Canonical owner |
|---|---|
| wooden material | `door_leaf_100` |
| physical leaf width/height/thickness | `door_leaf_100` |
| product default white color | `door_leaf_100` |
| user-selected leaf color/image | project child surface state |
| base + inner-corner recipe quantities | `src/moduleRecipes.js` |
| move/collision/reflow algorithms | shared behavior/placement/reflow core |
| procedural mesh details | `src/scene3d.js` |
| pricing/cost | pricing layer, not Item BOM |

---

## 4. `door_leaf_100`

Verified child product meaning:

```text
itemKey      = door_leaf_100
type         = door-leaf
dimensions   = 100 × 200 × 8 cm
material     = ahşap
defaultColor = white
unit         = adet
```

Capabilities:

```text
color    = true
image    = true
glass    = false
lightbox = false
mesh     = false
```

The project instance may override leaf appearance without changing the canonical product definition.

---

## 5. Canonical source-of-truth map

| Concern | Canonical owner |
|---|---|
| parent identity/name/type/nominal width/composition pointer | `src/items.js` |
| catalog descriptor | `src/catalog.js` derived from canonical Item |
| runtime module instance / nested state | `src/designState.js` |
| behavior family | `src/moduleBehavior.js` |
| placement | `src/modulePlacement.js` |
| move | `src/moduleMove.js` |
| wall relationships / reflow | `src/wallReflow.js` + placement relationship flow |
| recipe quantities and recipe variants | `src/moduleRecipes.js` |
| recursive BOM expansion | `src/itemBom.js` |
| leaf production properties | `src/productionParts.js` |
| leaf capabilities | `src/itemCapabilities.js` |
| renderer | `src/scene3d.js` |
| persistence/restore | project restore + `normalizeModuleItemState()` |

---

## 6. Runtime state shape

Conceptual door module state:

```text
module
├─ id
├─ itemKey = door_100
├─ catalogKey = door_100
├─ type = door
├─ widthCm = 100
├─ placement
├─ strips[]
└─ surface
   ├─ itemKey = door_leaf_100
   ├─ color
   ├─ imageAssetId
   └─ imageTransform
```

Parent and physical child identities are therefore separate and canonical.

---

## 7. Behavior and renderer boundary

Because `door_100.type = door`, it uses the existing shared wall behavior family:

- wall placement
- 50 cm move snap
- 90° rotation step
- segment collision
- standard magnetic snap
- wall capacity participation
- side insertion
- continuous reflow

The procedural renderer may have technical geometry values but is not the owner of BOM/product truth.

---

## 8. Persistence and migration

Legacy project state is normalized so that a 100 cm door receives canonical parent and child identities when missing:

```text
parent itemKey  = door_100
surface.itemKey = door_leaf_100
```

Existing user color/image overrides are preserved. No active-runtime requirement was found for retaining `DOOR_100` as a parallel alias.

---

## 9. Base recipe and recursive BOM

Base recipe:

```text
profile_91            ×1
upright_346_5         ×2
panel_98              ×3
connector_start       ×2
connector_single      ×5
door_leaf_100         ×1
```

Base recursive Item BOM:

```js
resolveItemBom('door_100')
```

The resolver follows the canonical Item composition into the recipe, recursively resolves child Items, validates positive quantities, requires canonical leaf units, aggregates identical leaf lines and rejects cyclic composition.

Pricing is not performed in this layer.

---

## 10. Verified inner-corner recipe

### Product truth

A door at the verified inner-corner recipe state uses:

```text
profile_91            ×1
upright_346_5         ×2
panel_corner_92       ×3
connector_start       ×2
connector_single      ×3
connector_corner      ×2
door_leaf_100         ×1
```

### Canonical ownership

`src/moduleRecipes.js` keeps the straight recipe as the base and records only the corner delta:

- existing semantic panel variant replaces `panel_98` with `panel_corner_92` 1:1, preserving quantity 3;
- recipe variant replacement changes `connector_single ×5` into `connector_single ×3 + connector_corner ×2`;
- `connector_start ×2` is inherited unchanged from the base recipe.

The unchanged profile, upright, start connector and door leaf are not copied into a second full corner recipe.

### Canonical resolver calls

Expanded recipe:

```js
getExpandedModuleRecipe('door', 100, { panelVariant: 'inner-corner' })
```

Recursive Item BOM:

```js
resolveItemBom('door_100', 1, { panelVariant: 'inner-corner' })
```

The default call remains backward-compatible and resolves the straight/base BOM.

---

## 11. `panel_98` runtime surface concern — not a bug

The editable upper strip state does not need to carry `itemKey=panel_98` as a separate project Item state. Existing panel documentation classifies production panel identity as terminal production/BOM truth while editable surface state remains an editor/render layer.

This does not justify deriving production BOM from visual strip state.

---

# OPEN / RESOLVED FINDINGS

## F-D100-01 — Module contract composition semantics

**Status:** `OPEN`  
**Class:** contract-semantic gap; runtime break not demonstrated.

Canonical Item composition is recipe/composite, while the shared resolved module contract can still report:

```text
composition.mode = standalone
bom.mode = recipe
```

This is semantically ambiguous in the new Item architecture. It should eventually be made explicit whether module-contract `composition` means a different runtime orchestration concept or must align with Item composition.

This change does not alter that contract because it is independent from the newly verified corner BOM product rule.

---

## F-D100-02 — Inner-corner BOM representation

**Status:** `RECIPE/BOM RESOLVER PART RESOLVED`

The previous audit correctly found that the old Item resolver could only return the base recipe, but its description of the desired corner output was incomplete.

The verified corner transformation is now represented canonically and tested:

```text
panel_98 ×3          → panel_corner_92 ×3
connector_single ×5  → connector_single ×3 + connector_corner ×2
connector_start ×2   → unchanged
```

`resolveItemBom` now accepts root recipe options and can produce the exact terminal inner-corner BOM.

### Remaining integration boundary

The inspected current runtime still needs one explicit canonical owner for translating an actual project relationship/placement state into:

```text
panelVariant = inner-corner
```

The BOM rule itself is no longer missing; the remaining question is the automatic **relationship → recipe-context** integration. That mapping must not be guessed from renderer meshes or sidebar text.

### Deferred architecture decision — resolve once at Final BOM integration

This gap is intentionally deferred until the canonical **Final BOM** integration after the Item-by-Item migration work is complete. It must **not** be solved by adding separate `door_100`-specific relationship detection or per-Item controller/UI adapters during individual Item migrations unless a genuine runtime blocker requires it.

The intended shared flow is:

```text
Project Items
→ canonical Item-to-Item relationships
→ shared relationship resolver
→ shared recipe/BOM context (for example: inner-corner)
→ each Item's own canonical recipe variant
→ recursive Item BOM
→ Final BOM
```

The shared layer owns only the relationship/context decision. Each Item continues to own its own production transformation inside its canonical recipe. For example, `door_100` owns the verified connector/panel delta above; the common relationship layer must not duplicate those quantities.

This mechanism is expected to be reusable by every relationship-aware Item family that needs it — including `wall_*`, shelf/raf variants, showcase/vitrin variants and future corner-aware Items — rather than being reimplemented for each Item.

**Migration follow-up rule:** after the new Item system has been migrated across the intended Item set, revisit these Item audit reports together during Final BOM integration and close each remaining `relationship → recipe-context → BOM` gap against the single shared mechanism.

---

## F-D100-03 — Door-specific browser regression coverage

**Status:** `OPEN`

Existing browser coverage verifies picker creation and canonical parent/child identity. Generic unit coverage protects important wall/reflow behavior.

Door-specific browser scenarios still do not comprehensively cover:

- move/snap
- rotation
- side insertion
- continuous reflow
- actual corner relationship
- collision through UI
- leaf color/image edit
- context-menu capability
- duplicate preserving nested leaf overrides
- save/reload round-trip
- relationship-triggered corner BOM

The new unit/contract regression does protect both exact base BOM and exact inner-corner recipe/BOM quantities.

---

## F-D100-04 — Door documentation completeness

**Status:** `RESOLVED FOR VERIFIED CORNER RULE`

`docs/items/current-system/door_100.md`, `docs/items/definitions/door_100.md` and this audit now record the complete verified corner BOM including connector changes and the remaining automatic relationship-context boundary.

---

# Final classification

```text
Canonical Item identity              PASS
Parent / door_leaf separation        PASS
Canonical property ownership         PASS
Catalog cutover                      PASS
Factory / state                      PASS
Persistence migration                PASS
Behavior family                      PASS
Renderer boundary                    PASS
Base recipe                          PASS
Base recursive BOM                   PASS
Inner-corner recipe rule             PASS
Inner-corner recursive BOM API       PASS
Pricing separation                   PASS

Module composition semantics         OPEN GAP
Auto relationship → BOM context      OPEN INTEGRATION GAP
Door-specific full browser coverage  OPEN REGRESSION GAP
Door docs for verified corner rule   PASS

Overall                              PASS WITH OPEN INTEGRATION/REGRESSION GAPS
```

## Non-negotiable verified corner BOM

For future work, the following product rule must not regress:

```text
NORMAL door_100
profile_91            ×1
upright_346_5         ×2
panel_98              ×3
connector_start       ×2
connector_single      ×5
door_leaf_100         ×1

INNER-CORNER door_100
profile_91            ×1
upright_346_5         ×2
panel_corner_92       ×3
connector_start       ×2
connector_single      ×3
connector_corner      ×2
door_leaf_100         ×1
```
