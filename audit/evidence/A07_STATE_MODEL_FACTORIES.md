# A07 — State model + factories audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Project-level persisted state inventory

`buildProjectSnapshot()` persists:

- `id`
- `name`
- `version` (currently literal `1`)
- `createdAt`
- `stand`
- `modules`

Stand state currently carries fields such as:

- stand type and dimensions
- derived scene dimensions returned by setup
- floor type / optional floor color
- automatic depot configuration

Module state is polymorphic by runtime type. Common fields include module `id`, `type`, dimensions, optional `catalogKey`, optional `placement`; specialized families add editable surfaces/strips/faces, model metadata, lighting, media geometry, illuminated-foam asset/halo data, etc.

## Findings

### F-017 — P2 — renderer owns direct mutations of persistent editable state

**Domains:** state, renderer, architecture, persistence

Architecture rules say state carries persistent/editable product state and renderer visualizes it rather than becoming the persistent-rule owner.

Current scene surfaces keep references to state objects (`surfaceState`) and `scene3d` methods directly mutate persistent fields for operations including color, image assignment/removal, glass/fabric/mesh state and related image transforms. Main often calls these renderer methods rather than a state-domain mutation API.

This works because renderer objects reference the same state objects later serialized by `buildProjectSnapshot()`, but mutation ownership is split between `main.js`, `designState.js` helpers and `scene3d.js`. A renderer refactor can therefore silently change persistence semantics.

This finding is structural/ownership, not evidence that current saved values are lost.

### F-018 — P2 — structural panel count is duplicated between catalog geometry and state factory

`catalog.js:STAND_DIMENSIONS.stripCount` is currently 7. `designState.js` independently declares `STRIP_COUNT = 7` and state factories use it for flat panels, shelves, showcases and base-wall strips; door state separately derives its three upper panels by literal indexes 4..6.

Renderer reads `STAND_DIMENSIONS.stripCount/stripHeight` while state factories read their own 7. The values agree today but a future one-sided geometry change can create missing or extra persistent panel state versus rendered panels.

### F-019 — P1 — catalog dimensions are duplicated/hard-coded in multiple state factories

Several state factories ignore some/all descriptor dimensions and recreate the same product numbers independently, for example furniture, mini-fridge, kettle, coat-rack, base/base-wall depths/heights and LED floodlight. `createCatalogModuleState()` then calls those fixed factories.

Consequently changing an authoritative catalog descriptor can leave persisted placement/render state on old factory dimensions. Some families (TV, long planter, separator) already pass descriptor data, demonstrating the safer pattern, but coverage is inconsistent.

This is distinct from the intentional nominal-vs-physical-vs-BOM distinction: these duplicated values are used as runtime module state dimensions and are not explicitly labeled as a separate physical geometry source.

## Checklist results

- **A07.01 project fields:** `AUDITED_OK` — inventory above.
- **A07.02 module fields:** `AUDITED_OK` — all current state families/factories inspected; per-family shapes are explicit in `designState.js`.
- **A07.03 one owner/default:** `GAP` — F-017, F-018, F-019.
- **A07.04 complete defaults:** `AUDITED_OK` for internally-created current modules; factories reject unsupported shelf/counter/door sizes and create required editable surface state.
- **A07.05 runtime-derived persistence:** `GAP/P2 observation` — setup snapshot retains `sceneWidthM/sceneDepthM`, which are derivable from X/Y and surround. This is redundant but not given a separate finding yet; A08/A14 schema audit determines whether normalization/versioning makes it dangerous.
- **A07.06 renderer refs in JSON:** `AUDITED_OK` — project snapshot deep-clones plain stand/modules; Three.js objects, selected surfaces, object URLs and renderer refs are not serialized.
- **A07.07 legacy/missing fields:** `GAP` — restoration performs only `catalogKey` repair; no centralized state normalizer/schema migrator exists. Root classification is deferred to A08/A14 where project version/schema is audited.
- **A07.08 IDs:** `AUDITED_OK` for internal create/duplicate — UUID when available; duplication regenerates module and editable-surface IDs. Import IDs are audited A14.
- **A07.09 UI text as state:** `AUDITED_OK` — labels/status strings are presentation; primary state uses typed fields/IDs.
- **A07.10 predictable mutation ownership:** `GAP` — F-017.

## Cross-domain references

- Catalog identity attachment outside factories: F-010/F-013.
- Hidden placement policy: F-011.
- Project schema/version normalization: A08/A14, do not duplicate here.

Section audit status: **GAP**.
Next audit section: **A08 — Persistence / autosave / project isolation**.
