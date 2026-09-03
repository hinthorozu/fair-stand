# A01 Audit Evidence — Canonical Docs + Source of Truth

Audit section: `A01 — Canonical docs + source-of-truth`
Audit date: `2026-09-03`
Checked ROG SHA: `6b9a4400f10d8a1957ffd52dbc6a8da3f0141af5`
Audit branch: `audit/full-system-a01`

## Summary

A01 completed the documentation/source-of-truth audit. Global product and architecture contracts are broadly aligned with current runtime ownership, but four documentation/process drifts were found.

Findings:

- `F-001` P1 — `SYSTEM_MODULE_CATALOG.md` is materially stale versus runtime catalog.
- `F-002` P2 — historical repository review/progress documents are not visibly archived/historical and contain superseded current-state statements.
- `F-003` P2 — roadmap documents duplicate canonical production numeric values and recipe facts from code.
- `F-004` P2 — developer entrypoint documentation predates the universal change gate.

No runtime code was changed or fixed during this audit section.

---

## A01.01 — PROJECT_RULES.md

Status: `AUDITED_OK`

Evidence:

- `PROJECT_RULES.md` blob: `4ce07780206186f2c5b6930af72a9bceb4ce6493`
- `src/moduleBehavior.js` blob: `d466d8c0d9e08853791ff84bddbb85d6d94a01e3`
- `src/modulePlacement.js` blob: `381eda7c096997fb29a4a8cd81ebd62f61d3342d`
- `src/catalog.js` blob: `b4514b445e6a70a38dcfb7a8c4d516089b3ce565`
- `src/productionParts.js` blob: `d86a57c312912e769006f639bd7d038326f7a3dd`

Result:

- X/Y ground and Z-height convention remains the documented logical model.
- Module-specific move/rotation/collision/ghost values are delegated to `moduleBehavior.js`, not globally frozen in the rules document.
- Placement algorithms remain in placement/core code.
- Catalog nominal measurements and production/BOM measurements are explicitly separated.
- Deletion-gap/no-auto-compaction remains a global invariant to be verified later in A06; the document itself no longer contains the old invalid global 90-degree/50-cm behavior assumptions.

No stale global invariant was identified in this document during A01.

---

## A01.02 — ARCHITECTURE_RULES.md

Status: `AUDITED_OK`

Evidence:

- `ARCHITECTURE_RULES.md` blob: `4b378d811cc34f2cb237bedc4bc94d8ed884bd68`
- `src/moduleBehavior.js`
- `src/modulePlacement.js`
- `src/designState.js` blob: `98e3eeba8f98d63831a3be55745c7478d412ed17`
- `src/moduleRecipes.js`
- `src/productionParts.js`

The documented ownership boundaries correspond to real runtime layers: catalog, behavior, placement/core, state, renderer boundary and recipe/production parts. Whether individual runtime files violate these boundaries is intentionally deferred to A03; A01 confirms the architecture document itself describes the current intended ownership model.

---

## A01.03 — SYSTEM_DEVELOPMENT_CONTRACT.md

Status: `GAP` — see `F-004`.

The owner references in the document are real and current:

- catalog → `src/catalog.js`
- module policy → `src/moduleContracts.js`
- feature/composition → `src/featureContracts.js`
- behavior → `src/moduleBehavior.js` + placement core
- state → `src/designState.js`
- recipes → `src/moduleRecipes.js`
- production parts → `src/productionParts.js`
- automatic depot → `src/autoDepot.js`
- contract tests → `test/` plus existing `tests/`

However, this document still calls itself the mandatory development contract while its mandatory work sequence does not point the developer to the newer universal `SYSTEM_CHANGE_GATE.md` / `.github/change-contract.json` step. CI enforces the gate, but the human/AI entrypoint documentation is split.

---

## A01.04 — SYSTEM_CHANGE_GATE.md ↔ systemChangeContract.js

Status: `AUDITED_OK`

Evidence:

- `SYSTEM_CHANGE_GATE.md` blob: `c155e2805ad68c4b481ade1a43c7b3ef8381ff37`
- `src/systemChangeContract.js` blob: `13a6a89d2fe51e6a5d15c10ad5b5e44fa5eda183`

The documented 17 impact domains exactly match `SYSTEM_IMPACT_DOMAINS`:

`catalog, behavior, state, placement, renderer, persistence, bom, ui, composition, assets, storage, importExport, performance, accessibility, architecture, security, tests`.

Detailed path coverage quality is not certified here; it is the scope of A02.

---

## A01.05 — MODULE_BEHAVIOR_STANDARD.md

Status: `AUDITED_OK`

Evidence:

- doc blob: `dee718d9ce80b92893c2143cc89492566e83b185`
- runtime blob: `d466d8c0d9e08853791ff84bddbb85d6d94a01e3`

The document matches the current behavior contract fields and concepts:

- placement
- moveSnapCm
- rotationStepDeg
- defaultRotationDeg
- allowSideInsert
- collision
- ghost
- explicit catalog-type coverage
- non-catalog fallback
- wall/free/wall-overlay/top placement modes
- segment/footprint/none collision strategies
- descriptor-aware centralized overrides

The documented default ghost `{ kind: silhouette, renderer: module-silhouette, opacity: 0.38 }` also matches code.

---

## A01.06 — SYSTEM_MODULE_CATALOG.md

Status: `GAP` — `F-001`.

### Finding F-001

Severity: `P1`
Domain: `documentation / catalog / BOM source-of-truth`
Status: `OPEN`

Evidence:

- stale document blob: `04285925e3ee57a8312468f75084b3ad7f469fa6`
- current catalog blob: `b4514b445e6a70a38dcfb7a8c4d516089b3ce565`

The document explicitly claims:

- total catalog modules = `28`
- `24` with BOM recipes
- `4` without BOM

Current `MODULE_CATALOG_KEYS` contains `45` entries.

The stale document also contains superseded identity data, including `furniture_table_chair_set_minyon` / `table-chair-set`, while current catalog uses `furniture_table_chair_set_eames` / `table-chair-set-eames`.

Current runtime catalog includes many entries absent from the document, including ivy separators, L counters, depot fixtures, plants/long planters, TV sizes, video walls and other extras.

Impact:

A human or AI can use this document as a supposed current ROG reference and make incorrect catalog/BOM conclusions. In particular, the old `24 / 4` BOM count is not accepted as current audit truth. Current BOM coverage will be independently audited in A12.

Decision: `fix-now recommended after audit/user instruction`; do not silently edit during audit.

---

## A01.07 — ROADMAP.md active plan truth

Status: `GAP` — `F-003`.

The master roadmap's phase labels are internally coherent with its linked phase-4 plan: FAZ 1/2/3 closed, FAZ 4 active, FAZ 5/6 planned. No old render work is being presented as current FAZ 4.

However the master roadmap also stores a `Doğrulanmış üretim bilgileri` block containing fixed physical production dimensions and a full 50-cm wall recipe. Those facts already have canonical runtime owners in `productionParts.js` / `moduleRecipes.js`. This violates the intended “roadmap is plan, code is runtime production truth” separation and creates drift risk. See `F-003`.

---

## A01.08 — PRODUCT_FUTURE.md

Status: `AUDITED_OK`

Evidence blob: `aa1a6940f5957f00b7b98b9a8a4bbd625ac1f832`

The document explicitly classifies itself as future requirements/data needs, directs active priority to roadmap documents, and labels field rules as data requiring validation. It does not claim its unverified rules are current runtime constraints.

---

## A01.09 — RENDER_FUTURE_BACKLOG.md

Status: `AUDITED_OK`

Evidence blob: `f5845e53e77ac6d7f255a64b27232f06066e130e`

The document explicitly states that the old render “FAZ 4” label is obsolete, current FAZ 4 is recipe/parametric/connection-graph work, and render work is future-only until reactivated through the roadmap.

---

## A01.10 — Historical documentation classification

Status: `GAP` — `F-002`.

### Finding F-002

Severity: `P2`
Domain: `documentation / repository history`
Status: `OPEN`

Evidence:

- `FRESH_REPOSITORY_REVIEW.md` blob `5767e856e75130d76ac3aa6698163c91a08aa238`
- `REPOSITORY_CLEANUP_PROGRESS.md` blob `13904e826b7f459d1672e28c13d3791fdc2d7b67`
- `MILESTONES.md` blob `8e0dbcf0fd2355b272e32ad36942b997ad4e708c`
- `Changelog.md` blob `31769e11fcff59ab908bd9553baef5e788922773`

`MILESTONES.md` is correctly marked as a historical closure record and redirects active phase truth to roadmap files. `Changelog.md` identifies itself as a chronological history.

By contrast:

- `FRESH_REPOSITORY_REVIEW.md` is not marked historical and still says current `PROJECT_RULES.md` incorrectly globalizes 90-degree rotation / 50-cm movement, even though the current `PROJECT_RULES.md` was already corrected.
- `REPOSITORY_CLEANUP_PROGRESS.md` presents itself as the checkpoint for “where we left off / next work” and ends with color-editor controller PR/canonical CI still pending, while many later PRs are already merged.

Impact:

A new AI/human can mistake superseded audit/progress documents for current repository state and reopen already-resolved work.

Decision: mark/archive/redirect explicitly in a later fix PR.

---

## A01.11 — LEGACY_TRASH.md isolation

Status: `AUDITED_OK` for documentation/source-of-truth isolation.

Evidence:

- `LEGACY_TRASH.md` blob `cd86ec48ce560d1cd32087548652f068614bfbc4`
- `src/standCapacity.js` blob `cfb05f380fea5bc5fe52e464022ba898d72a217e`
- current catalog/behavior sources

The legacy file explicitly says its unverified field rules must not be coded until validated. No runtime import/reference to `LEGACY_TRASH.md` exists. The current stand-capacity implementation checks actual active stand bounds rather than the legacy approximate 4m/5–6m support rules.

The current catalog has explicit shelf variants, but A01 found no canonical runtime rule stating the legacy “maximum 3 shelves” sentence itself is consumed as an unverified global constraint. Deeper behavior/parametric checks remain in their later audit sections.

---

## A01.12 — Competing duplicated numeric/business rules

Status: `GAP` — `F-001` and `F-003`.

### Finding F-003

Severity: `P2`
Domain: `documentation / production source-of-truth`
Status: `OPEN`

Evidence:

- `ROADMAP.md` blob `8b5afd0e31bc6172cb94cd6d5c5614e7aa61bb3d`
- `ROADMAP_PHASE_4.md` blob `ef7800f2747d69688206e05491e2a0037a92b493`
- `src/productionParts.js` blob `d86a57c312912e769006f639bd7d038326f7a3dd`
- `src/moduleRecipes.js` current ROG

Examples duplicated in roadmap Markdown and code include:

- upright length `346.5 cm` and thickness `8 cm`
- panel height `47 cm` / thickness `0.8 cm`
- straight panel widths `48.5 / 98 / 147.5 / 197`
- inner-corner widths `42.5 / 92 / 142.5 / 192`
- profile lengths `41.5 / 91 / 140.5 / 190`
- 50-cm straight-wall recipe quantities and part identities

These values currently match code, but matching today does not remove the competing-source risk. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md` and `SYSTEM_DEVELOPMENT_CONTRACT.md` all establish that runtime values should not be maintained as independent fixed Markdown truth.

Impact:

A production dimension can later change in code while roadmap/reference prose remains silently stale, producing exactly the source-of-truth drift this audit is intended to prevent.

Decision: roadmap should reference canonical part/recipe sources rather than manually reproduce fixed production datasets, unless a generated snapshot mechanism is explicitly adopted.

---

## A01.13 — README / developer entrypoint (audit-discovered checklist item)

Status: `GAP` — `F-004`.

### Finding F-004

Severity: `P2`
Domain: `documentation / development process`
Status: `OPEN`

Evidence:

- `README.md` blob `5a5f4b519c3fd12af182b364848305b65c76a9b6`
- `SYSTEM_DEVELOPMENT_CONTRACT.md` blob `81d32ed1791cf097587f71abfcf1c1512b45c5c6`
- `.github/workflows/ci.yml` current ROG
- `SYSTEM_CHANGE_GATE.md` / `src/systemChangeContract.js`

Drift:

- README command list does not show `npm run contract:verify`.
- README describes canonical CI as `npm ci → npm test → npm run build`, while current CI executes the change-contract gate before install/test/build.
- README repository-document map omits `SYSTEM_DEVELOPMENT_CONTRACT.md`, `SYSTEM_CHANGE_GATE.md` and `SYSTEM_AUDIT_CHECKLIST.md`.
- README “new module” flow does not tell a human/AI to declare the universal change contract first.
- `SYSTEM_DEVELOPMENT_CONTRACT.md` calls itself the mandatory development contract, but its mandatory sequence does not explicitly hand off to the newer universal change gate/change declaration.

Impact:

CI still blocks many undeclared code changes, so this is not an enforcement bypass by itself. But a human/AI following the documented entrypoint receives an incomplete process and can waste work before CI rejects it.

Decision: update documentation entrypoint in a later fix PR.

---

# A01 result

Section status: `GAP` (audit complete, four findings open)

Counts after A01:

- Open P0: 0
- Open P1: 1 (`F-001`)
- Open P2: 3 (`F-002`, `F-003`, `F-004`)
- Open P3: 0
- Decision required: 0

Next strict audit item: `A02.01`.
