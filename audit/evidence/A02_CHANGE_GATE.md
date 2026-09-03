# A02 Audit Evidence — Universal Change Gate

Audit section: `A02 — Universal change gate`
Audit date: `2026-09-03`
Checked ROG SHA: `dda455183e5c713cb55a24232436cfd39c68ce7b`
Audit branch: `audit/full-system-a02`

## Summary

The universal change gate is real and active in canonical CI, but it is not yet a complete all-surfaces wall.

New findings:

- `F-005` P1 — guarded runtime sources can have no path-required domain; 20/51 current `src/` files resolve zero mandatory impact domains, and other files have incomplete/accidental mappings.
- `F-006` P1 — canonical rule/gate Markdown documents are outside guarded-file detection; the gate's own human-readable contract can change without a change declaration.
- `F-007` P2 — `test/` and `tests/` are outside guarded-file detection; gate regression tests can be changed/removed without a declaration.
- `F-008` P2 — targeted regression tests are not machine-required; `tests.targeted: []` is valid and `impact.tests` may be `not-applicable`.
- `F-009` P2 — local `npm run contract:verify` validates schema only and skips diff enforcement unless CI/event variables or `CHANGE_GATE_FILES` are supplied.

Existing findings from A01 remain open: F-001..F-004.

No gate code was fixed during this audit section.

---

## A02.01 — Impact domain schema completeness

Status: `AUDITED_OK`

Canonical source: `src/systemChangeContract.js` blob `13a6a89d2fe51e6a5d15c10ad5b5e44fa5eda183`.

`SYSTEM_IMPACT_DOMAINS` contains exactly 17 machine-readable domains:

`catalog, behavior, state, placement, renderer, persistence, bom, ui, composition, assets, storage, importExport, performance, accessibility, architecture, security, tests`.

`validateSystemChangeContract()` derives missing/unknown decision validation from that same array. `test/systemChangeGate.test.js` explicitly removes `security` and verifies the missing-domain failure.

The human-readable list in `SYSTEM_CHANGE_GATE.md` matches this machine list; that correspondence was already checked in A01.04.

---

## A02.02 — Change kinds and mandatory domains

Status: `AUDITED_OK` with the test-policy caveat recorded separately as `F-008`.

Supported kinds:

`module, feature, ui-control, state-change, renderer-change, persistence-change, bom-change, architecture, tooling, bugfix, refactor`.

Machine constraints:

- `ui-control` → UI affected
- `state-change` → state affected
- `renderer-change` → renderer affected
- `persistence-change` → persistence affected
- `bom-change` → BOM affected
- `architecture/tooling` → architecture affected
- `module` → at least one of catalog/behavior/state/renderer affected
- `feature` → at least one of composition/behavior/UI/state affected
- every valid declaration → at least one impact domain affected

File-aware requirements are a second layer and are audited below.

---

## A02.03 — Guarded-file detection for runtime/delivery entry points

Status: `AUDITED_OK` for broad runtime/delivery inclusion, with governance/test exclusions tracked by F-006/F-007.

`isGuardedChangeFile()` includes:

- `index.html`
- `package.json`
- `package-lock.json`
- all `src/**`
- all `public/**`
- all `scripts/**`
- `.github/workflows/**`
- `vite.config*`

Therefore current product/runtime JS/CSS under `src/`, static public assets and delivery/build surfaces all trigger the requirement that `.github/change-contract.json` change in the same CI diff.

This does **not** mean the correct impact domain is forced; that is the separate F-005 gap.

---

## A02.04–A02.12 — Path-aware domain coverage

### Directly mapped areas that are structurally present

- catalog: `src/catalog.js` → `catalog`
- behavior/placement core: `moduleBehavior.js`, `moduleMove.js`, `modulePlacement.js`, `wallReflow.js`, `cornerPlacement.js` → `behavior + placement`
- state: `designState.js` → `state + persistence`
- renderer: `scene3d.js`, `viewCube.js` → `renderer`
- storage/persistence: `projectStore.js`, `assetStore.js`, `imageAssetReferences.js` → `persistence + storage`
- BOM: `moduleRecipes.js`, `productionParts.js`, `rawBomDebug.js` → `bom`
- composition: `autoDepot.js`, `automaticWall.js`, `featureContracts.js` → `composition`
- assets: all `public/**` → `assets`
- delivery/tooling: package/lock/scripts/workflows/vite config and selected contract files → `architecture`
- UI: `index.html`, selected UI/controller files and the `Ui|UI|Controller|Feedback` filename pattern → `ui`

### Finding F-005 — incomplete path-domain wall

Severity: `P1`
Domain: `architecture / change-gate coverage`
Status: `OPEN`

All current `src/**` files are guarded, but `requiredDomainsForFile()` returns zero mandatory domains for **20 of the 51 current source files**:

1. `src/colorEditor.css`
2. `src/colorEditorInputs.js`
3. `src/colorUtils.js`
4. `src/groundLayout.js`
5. `src/helpGuide.css`
6. `src/horizontalImageLayout.js`
7. `src/imageActions.css`
8. `src/imageFit.js`
9. `src/main.js`
10. `src/projectNaming.js`
11. `src/projectSwitch.js`
12. `src/rectImageLayout.js`
13. `src/rectSelection.js`
14. `src/standCapacity.js`
15. `src/standSetup.js`
16. `src/style.css`
17. `src/theme.js`
18. `src/tvConfig.js`
19. `src/viewKeyboardShortcuts.js`
20. `src/wall.js`

This is not merely naming ambiguity. Fresh source evidence shows these files own meaningful product behavior:

- `main.js` imports and orchestrates scene rendering, catalog resolution, automatic depot/wall composition, module state factories, asset storage, project storage, placement, wall reflow, behavior, autosave, project switching and UI controls. Yet its path requires no domain.
- `autosaveController.js` owns persistence timing and persist calls, but the generic `Controller` filename regex makes it require only `ui`; persistence is not path-forced.
- `tvConfig.js` defines canonical TV size/type/screen dimensions consumed by catalog/render logic, but requires no domain.
- `standSetup.js` defines stand type labels, valid dimension range/step and scene dimensions, but requires no domain.
- `standCapacity.js` validates actual stand capacity and failure semantics, but requires no domain.
- `viewKeyboardShortcuts.js` defines keyboard behavior and editable-target suppression, but requires no UI/accessibility/behavior domain.
- `colorEditorInputs.js` validates/normalizes user-entered color values, but requires no UI/security/state domain.
- `groundLayout.js` defines scene grid sizing/positioning, but requires no renderer/placement domain.
- `wall.js` validates/constructs straight-wall composition, but requires no behavior/composition domain.

Impact:

For any zero-mapped guarded file, CI still forces `.github/change-contract.json` to be edited, but a developer can mark an unrelated impact domain `affected` and mark the real domain(s) `not-applicable`; the verifier has no path-derived contradiction to reject it. For partially mapped files, a false declaration can similarly omit important secondary impacts.

This defeats the intended “false not-applicable is blocked by code” guarantee for a substantial portion of runtime sources.

Decision: expand path/domain ownership systematically after the audit identifies canonical responsibilities; A03/A22/A23 should feed the final map.

Item consequences:

- A02.04 catalog path coverage: `GAP` because catalog-adjacent canonical `tvConfig.js` is unmapped.
- A02.05 behavior/placement coverage: `GAP` because `groundLayout.js`, `standCapacity.js`, `standSetup.js`, `wall.js` and other related sources are not path-forced.
- A02.06 state/persistence/storage coverage: `GAP` because `autosaveController.js`, `projectSwitch.js` and central orchestration are not correctly forced.
- A02.07 renderer coverage: `GAP` because image layout/fit and TV config helpers are not mapped.
- A02.08 UI coverage: `GAP` because CSS, `colorEditorInputs.js`, `viewKeyboardShortcuts.js` and `main.js` are not UI-forced.
- A02.09 BOM coverage: `AUDITED_OK` for the current canonical BOM sources known at this stage.
- A02.10 composition coverage: `AUDITED_OK` for current explicit composition owners known at this stage.
- A02.11 public assets: `AUDITED_OK` — every `public/**` path requires assets.
- A02.12 build/tooling/delivery: `AUDITED_OK` for package/lock/scripts/workflows/vite configuration.

A23.14 will re-run this mapping after every canonical owner is discovered by later sections.

---

## A02.13 — Declaration omission detection in CI diffs

Status: `AUDITED_OK`

Canonical verifier: `scripts/verify-change-contract.mjs` blob `65e2d93d4b4194a8bcb88a1282b1de415782baa4`.

For pull requests, the verifier diffs PR base SHA → HEAD. For pushes, it diffs event before → after. If at least one guarded file changed and `.github/change-contract.json` is not in the changed file set, it exits non-zero.

CI uses checkout `fetch-depth: 0`, so the PR/push diff has the required history. Executable negative-path regression depth will be assessed later in A18.

---

## A02.14 — False `not-applicable` on mapped high-risk paths

Status: `AUDITED_OK` **for paths that have a required-domain mapping**.

For every changed guarded path, the verifier collects `requiredDomainsForFile(path)`. Every collected domain must be `impact[domain] === 'affected'`; otherwise CI exits non-zero.

F-005 documents the important limitation: an unmapped or incompletely mapped file cannot benefit from this second wall.

---

## A02.15 — Risk / migration / rollback / test declaration validation

Status: `GAP` — `F-008`.

Risk, migration and rollback have machine validation:

- risk level must be low/medium/high and notes non-empty
- migration required must be boolean and notes non-empty
- rollback must be non-empty
- fullSuite must be true
- build must be true

### Finding F-008 — targeted regression policy is not enforced

Severity: `P2`
Domain: `tests / change contract`
Status: `OPEN`

`validateSystemChangeContract()` only checks `Array.isArray(contract.tests.targeted)`. An empty array is valid. It also does not require `impact.tests === 'affected'` for meaningful code changes.

This conflicts with the human contract's mandatory sequence to identify targeted tests before implementation, and weakens the intended “a button/module/feature change must say what regression protects it” rule.

Impact:

A change can pass the universal declaration with zero targeted tests and rely only on the existing full suite/build, even when a new behavior has no specific regression guard.

Decision: later harden schema/policy after deciding exact exceptions for pure docs/tooling changes.

---

## A02.16 — The gate protects itself

Status: `GAP` — `F-006` + `F-007`.

### Finding F-006 — canonical rule/gate docs are unguarded

Severity: `P1`
Domain: `architecture / governance`
Status: `OPEN`

`isGuardedChangeFile()` does not include root Markdown rule/contract files. Therefore a change only to any of these can pass the change-gate step without modifying `.github/change-contract.json`:

- `PROJECT_RULES.md`
- `ARCHITECTURE_RULES.md`
- `SYSTEM_DEVELOPMENT_CONTRACT.md`
- `SYSTEM_CHANGE_GATE.md`
- `MODULE_BEHAVIOR_STANDARD.md`
- other canonical policy Markdown

The existing gate test explicitly asserts `README.md` is unguarded, which confirms this is current behavior rather than an ambiguous path match.

Most importantly, `SYSTEM_CHANGE_GATE.md` — the human-readable contract for the gate itself — can be weakened or changed without an architecture-impact declaration.

Impact:

Machine gate code remains protected under `src/` / `scripts/` / workflows, but human/AI rule truth can drift independently from machine enforcement, undermining the “read rules first” model.

Decision: canonical governance docs should become guarded architecture/process surfaces.

### Finding F-007 — gate tests are unguarded

Severity: `P2`
Domain: `tests / governance`
Status: `OPEN`

`test/**` and legacy `tests/**` are not guarded by `isGuardedChangeFile()`. Thus `test/systemChangeGate.test.js` and `test/systemChangeGateCiContract.test.js` can be changed or removed in a test-only PR without any change declaration.

Impact:

CI still runs the resulting test suite, but weakening/removing the gate's own regression tests does not require an explicit `tests/architecture` impact declaration. The `tests` impact domain therefore does not govern test-only changes.

Decision: guard test surfaces, with path/domain rules appropriate to test-only changes.

---

## A02.17 — Guarded source paths missing path-domain mapping

Status: `GAP` — `F-005`.

Current count: **20 / 51 source files completely unmapped** by `requiredDomainsForFile()` while still guarded by `isGuardedChangeFile()`.

This count is pinned to ROG SHA `dda455183e5c713cb55a24232436cfd39c68ce7b` and must be recomputed after later architecture/file-by-file sections.

---

## A02.18 — Local verifier behavior (audit-discovered item)

Status: `GAP` — `F-009`.

### Finding F-009

Severity: `P2`
Domain: `tooling / developer workflow`
Status: `OPEN`

`npm run contract:verify` calls `scripts/verify-change-contract.mjs`. When neither `CHANGE_GATE_FILES` nor GitHub event environment variables are present, `changedFilesFromEnvironment()` returns null and the script explicitly prints:

`System change contract schema is valid. Diff enforcement skipped outside CI.`

It exits successfully after schema validation.

Impact:

A human/AI can modify guarded source files locally, leave the change declaration stale, run the documented verifier and receive a green command. Canonical CI will still catch the omission later, so this is not a production bypass; it is a pre-PR enforcement gap relative to the intended “declare before implementation” workflow.

Decision: later make the local command derive working-tree/base changes by default or provide a separate explicitly named schema-only mode.

---

## A02.19 — Test-only change governance (audit-discovered item)

Status: `GAP` — `F-007` / `F-008`.

The `tests` domain exists in the schema, but test files themselves are unguarded and targeted tests may be empty. Test governance is therefore not yet a closed loop.

---

# A02 result

Section status: `GAP` (audit complete; five new findings open)

Counts after A02:

- Open P0: 0
- Open P1: 3 (`F-001`, `F-005`, `F-006`)
- Open P2: 6 (`F-002`, `F-003`, `F-004`, `F-007`, `F-008`, `F-009`)
- Open P3: 0
- Decision required: 0

Next strict audit item: `A03.01`.
