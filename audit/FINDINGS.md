# Fair Stand — Full System Audit Findings Ledger

Audit baseline: `ROG e7647326668ab25c96f3a3139f0d855c03176325`
Audit branch: `audit/full-system-a00-a24-sweep`
Mode: **AUDIT COMPLETE / REMEDIATION IN PROGRESS**

This is the canonical finding index for the A00–A24 full-system audit. Detailed evidence lives in `audit/evidence/Axx_*.md`. No finding in this file is considered fixed until a remediation change has targeted regression evidence, full tests, build and required CI/retest evidence.

## Summary

- Open findings: **46** (`F-001` … `F-046`)
- P0: **0**
- P1: **20**
- P2: **26**
- P3: **0**
- Remediation progress: **A00 CLOSED / NO FIX REQUIRED**
- Findings closed so far: **0** — A00 originated no finding

## Findings

| ID | Sev | Summary | Evidence | Status |
|---|---|---|---|---|
| F-001 | P1 | `SYSTEM_MODULE_CATALOG.md` is materially stale versus the 45-entry runtime catalog and current BOM reality | `A01_DOCS_SOURCE_OF_TRUTH.md` | OPEN |
| F-002 | P2 | Historical/repository-progress docs can be mistaken for current source-of-truth | `A01_DOCS_SOURCE_OF_TRUTH.md` | OPEN |
| F-003 | P2 | Roadmaps duplicate canonical production dimensions/recipe facts maintained in code | `A01_DOCS_SOURCE_OF_TRUTH.md` | OPEN |
| F-004 | P2 | README/developer entrypoint predates the universal change-gate workflow | `A01_DOCS_SOURCE_OF_TRUTH.md` | OPEN |
| F-005 | P1 | Change-gate path/domain wall is incomplete; 20/51 current `src/` files have zero mandatory impact-domain mapping | `A02_CHANGE_GATE.md` | OPEN |
| F-006 | P1 | Canonical rule/gate Markdown is not protected by the change gate | `A02_CHANGE_GATE.md` | OPEN |
| F-007 | P2 | `test/` and `tests/` are outside change-gate guarded-file governance | `A02_CHANGE_GATE.md` | OPEN |
| F-008 | P2 | Targeted regression declaration can be empty and test impact is not machine-required | `A02_CHANGE_GATE.md` | OPEN |
| F-009 | P2 | Local `contract:verify` can succeed while skipping diff enforcement outside CI/env input | `A02_CHANGE_GATE.md` | OPEN |
| F-010 | P1 | `main.js` contains a parallel/hidden runtime module-state construction registry | `A03_ARCHITECTURE.md` | OPEN |
| F-011 | P1 | Module-specific placement/interaction policy is fragmented outside the declared behavior contract | `A03_ARCHITECTURE.md`, `A05_MODULE_BEHAVIOR.md`, `A06_*` | OPEN |
| F-012 | P2 | Stand scene-surround rule is duplicated between setup and renderer | `A03_ARCHITECTURE.md` | OPEN |
| F-013 | P2 | Exact catalog identity can be ambiguous for normal vs vine separators when `catalogKey` is absent; UI creation paths can diverge | `A04_CATALOG_MODULE_CONTRACTS.md` | OPEN |
| F-014 | P1 | 17 active module contracts still require final BOM classification (`M030–M046`) | `A04_CATALOG_MODULE_CONTRACTS.md`, `A12_BOM_RECIPES_PRODUCTION.md` | OPEN / DECISION_REQUIRED |
| F-015 | P1 | `allowSideInsert:false` is declared but context/runtime side insertion does not enforce it | `A05_MODULE_BEHAVIOR.md` | OPEN |
| F-016 | P2 | Right-wall corner orientation convention conflicts: helper expects 90° while active placement/reflow uses 270° | `A06_PLACEMENT_MOVE_ROTATION_COLLISION_REFLOW.md` | OPEN |
| F-017 | P2 | Renderer directly mutates persistent editable state, splitting state-mutation ownership | `A07_STATE_MODEL_FACTORIES.md`, `A09_RENDERER_SCENE_RUNTIME.md` | OPEN |
| F-018 | P2 | Structural strip/panel count is duplicated between catalog geometry and state factories | `A07_STATE_MODEL_FACTORIES.md` | OPEN |
| F-019 | P1 | Catalog/runtime dimensions are duplicated or hard-coded in multiple state factories | `A07_STATE_MODEL_FACTORIES.md` | OPEN |
| F-020 | P1 | Pending autosave can be cancelled/lost during project switch/open | `A08_PERSISTENCE_AUTOSAVE_ISOLATION.md` | OPEN |
| F-021 | P2 | Project `version` exists without a canonical validation/migration pipeline | `A08_PERSISTENCE_AUTOSAVE_ISOLATION.md`, `A14_*` | OPEN |
| F-022 | P2 | No complete persistence round-trip contract covers every special module family | `A08_PERSISTENCE_AUTOSAVE_ISOLATION.md`, `A18_*` | OPEN |
| F-023 | P2 | Whole-project deletion is not atomic across project and asset stores | `A08_PERSISTENCE_AUTOSAVE_ISOLATION.md` | OPEN |
| F-024 | P2 | GLB/model load failure can leave invisible model-backed modules with console-only feedback; rejected loader promises stay cached | `A09_RENDERER_SCENE_RUNTIME.md` | OPEN |
| F-025 | P1 | Production entrypoint loads visible `rawBomDebug.js` debug UI | `A10_UI_CONTROLS.md`, `A12_*` | OPEN |
| F-026 | P2 | User-visible standards/feature facts are duplicated as static HTML text | `A10_UI_CONTROLS.md` | OPEN |
| F-027 | P1 | “Duvarı temizle” deletes all modules, exceeding its label/confirmation scope | `A10_UI_CONTROLS.md` | OPEN |
| F-028 | P1 | “Tüm Özellikleri Kaldır” can fail for the whole scene when `illuminated-foam` exists | `A10_UI_CONTROLS.md` | OPEN |
| F-029 | P1 | Active automatic-wall composition has no explicit feature contract | `A11_FEATURE_COMPOSITION.md` | OPEN |
| F-030 | P1 | No canonical project-level Final BOM generator exists | `A12_BOM_RECIPES_PRODUCTION.md` | OPEN |
| F-031 | P1 | Relationship/corner connector parts are not derived from project module relationships | `A12_BOM_RECIPES_PRODUCTION.md` | OPEN |
| F-032 | P2 | IndexedDB schema/version/store migration ownership is duplicated across project/asset stores | `A13_STORAGE_ASSETS_REFERENCES.md` | OPEN |
| F-033 | P2 | ~30.64 MiB of parked/unreferenced assets under `public/` ships with production | `A13_STORAGE_ASSETS_REFERENCES.md`, `A17_*` | OPEN |
| F-034 | P2 | Public model/asset provenance and license inventory is incomplete | `A13_STORAGE_ASSETS_REFERENCES.md`, `A21_*` | OPEN / DECISION_REQUIRED |
| F-035 | P2 | ZIP archive version/schema has no shared canonical owner/migration registry | `A14_IMPORT_EXPORT_ARCHIVE_SCHEMA.md` | OPEN |
| F-036 | P1 | Imported project/module state is persisted without structural domain validation | `A14_IMPORT_EXPORT_ARCHIVE_SCHEMA.md`, `A15_*` | OPEN |
| F-037 | P1 | ZIP/image import has no explicit archive/asset count/size/resource limits or content policy | `A14_IMPORT_EXPORT_ARCHIVE_SCHEMA.md`, `A15_*` | OPEN |
| F-038 | P2 | Dependency/security advisory scanning is not enforced in canonical CI | `A15_SECURITY_VALIDATION_TRUST.md` | OPEN |
| F-039 | P2 | Dynamic modal/context-menu focus and accessibility semantics are incomplete/inconsistent | `A16_ACCESSIBILITY_KEYBOARD_FOCUS.md` | OPEN |
| F-040 | P1 | No real browser E2E harness covers critical user workflows | `A18_TEST_REGRESSION_ARCHITECTURE.md`, `A19_BROWSER_E2E_CRITICAL_FLOWS.md` | OPEN |
| F-041 | P1 | ROG is unprotected; green CI/change gate is not enforced before merge/direct push | `A20_BUILD_CI_DEPLOY.md` | OPEN |
| F-042 | P1 | Server deploy path is not commit-pinned and does not enforce the same gate/test chain as CI | `A20_BUILD_CI_DEPLOY.md` | OPEN |
| F-043 | P2 | Public repository has no explicit root software license decision/file | `A21_REPOSITORY_HYGIENE_GOVERNANCE.md` | OPEN / DECISION_REQUIRED |
| F-044 | P2 | Many merged/superseded branches remain and create operational ambiguity | `A21_REPOSITORY_HYGIENE_GOVERNANCE.md` | OPEN |
| F-045 | P2 | Historical one-off source-rewriting patch scripts remain beside canonical tooling | `A21_REPOSITORY_HYGIENE_GOVERNANCE.md`, `A22_*` | OPEN |
| F-046 | P2 | No lint/format/static-quality gate exists in the canonical command/CI chain | `A21_REPOSITORY_HYGIENE_GOVERNANCE.md` | OPEN |

## Cross-domain remediation clusters

These are dependency groups, not extra findings:

1. **Governance wall:** F-005, F-006, F-007, F-041, F-042.
2. **Persistence/schema/data safety:** F-020, F-021, F-022, F-023, F-032, F-035, F-036, F-037.
3. **Module identity/state construction:** F-010, F-013, F-018, F-019.
4. **Behavior/placement:** F-011, F-015, F-016.
5. **BOM:** F-014, F-025, F-029, F-030, F-031.
6. **Browser/UI accessibility:** F-027, F-028, F-039, F-040.
7. **Assets/repository/security hygiene:** F-033, F-034, F-038, F-043, F-044, F-045, F-046.

Detailed cross-domain conflict reasoning: `audit/evidence/A23_CROSS_DOMAIN_CONFLICT_MATRIX.md`.
Final audit classification: `audit/evidence/A24_FINAL_CLOSURE.md`.

## Closure rule

The detection/audit phase is complete. Remediation is **in progress**. A00 is closed with no fix required. Do not change any finding status from `OPEN` until the corresponding fix has been implemented and independently retested under the audit closure rules.