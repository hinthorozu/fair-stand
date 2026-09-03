# Fair Stand — Full System Audit Findings Ledger

Audit baseline: `ROG e7647326668ab25c96f3a3139f0d855c03176325`
Mode: **AUDIT COMPLETE / REMEDIATION IN PROGRESS**

Detailed audit evidence lives under `audit/evidence/`. Remediation closure evidence lives under `audit/remediation/`.

## Summary

- Total findings: **46** (`F-001` … `F-046`)
- Open findings: **44**
- Closed findings: **2**
- Open P0: **0**
- Open P1: **19**
- Open P2: **25**
- Open P3: **0**
- Remediation progress: **A00 closed; A01 in progress**

## Findings

| ID | Sev | Summary | Status |
|---|---|---|---|
| F-001 | P1 | `SYSTEM_MODULE_CATALOG.md` stale versus runtime catalog/BOM policy | **CLOSED** — `audit/remediation/A01_F001_CLOSURE.md` |
| F-002 | P2 | Historical/repository-progress docs can be mistaken for current truth | **CLOSED** — `audit/remediation/A01_F002_CLOSURE.md` |
| F-003 | P2 | Roadmaps duplicate canonical production dimensions/recipe facts | OPEN |
| F-004 | P2 | README/developer entrypoint predates universal change-gate workflow | OPEN |
| F-005 | P1 | Change-gate path/domain wall incomplete; 20/51 `src/` files have zero mandatory mapping | OPEN |
| F-006 | P1 | Canonical rule/gate Markdown not protected by change gate | OPEN |
| F-007 | P2 | `test/` and `tests/` outside change-gate guarded-file governance | OPEN |
| F-008 | P2 | Targeted regression declaration can be empty; test impact not machine-required | OPEN |
| F-009 | P2 | Local `contract:verify` can skip diff enforcement outside CI/env input | OPEN |
| F-010 | P1 | `main.js` contains parallel/hidden runtime module-state construction registry | OPEN |
| F-011 | P1 | Module-specific placement/interaction policy fragmented outside behavior contract | OPEN |
| F-012 | P2 | Stand scene-surround rule duplicated between setup and renderer | OPEN |
| F-013 | P2 | Exact catalog identity ambiguous for normal vs vine separators when `catalogKey` absent | OPEN |
| F-014 | P1 | 17 active module contracts require final BOM classification | OPEN / DECISION_REQUIRED |
| F-015 | P1 | `allowSideInsert:false` declared but not enforced by context/runtime insertion | OPEN |
| F-016 | P2 | Right-wall corner orientation conflict: 90° helper vs 270° active placement/reflow | OPEN |
| F-017 | P2 | Renderer directly mutates persistent editable state | OPEN |
| F-018 | P2 | Structural strip/panel count duplicated between catalog and state factories | OPEN |
| F-019 | P1 | Catalog/runtime dimensions duplicated/hard-coded in state factories | OPEN |
| F-020 | P1 | Pending autosave can be cancelled/lost during project switch/open | OPEN |
| F-021 | P2 | Project `version` exists without canonical validation/migration pipeline | OPEN |
| F-022 | P2 | No complete persistence round-trip contract for every special module family | OPEN |
| F-023 | P2 | Whole-project deletion not atomic across project and asset stores | OPEN |
| F-024 | P2 | Model-load failure can leave invisible modules; rejected loader promises stay cached | OPEN |
| F-025 | P1 | Production entrypoint loads visible `rawBomDebug.js` UI | OPEN |
| F-026 | P2 | User-visible standards/feature facts duplicated as static HTML text | OPEN |
| F-027 | P1 | “Duvarı temizle” deletes all modules beyond label/confirmation scope | OPEN |
| F-028 | P1 | “Tüm Özellikleri Kaldır” can fail when `illuminated-foam` exists | OPEN |
| F-029 | P1 | Active automatic-wall composition has no explicit feature contract | OPEN |
| F-030 | P1 | No canonical project-level Final BOM generator | OPEN |
| F-031 | P1 | Relationship/corner connector parts not derived from project relationships | OPEN |
| F-032 | P2 | IndexedDB schema/migration ownership duplicated across stores | OPEN |
| F-033 | P2 | ~30.64 MiB parked/unreferenced assets under `public/` ship with production | OPEN |
| F-034 | P2 | Public model/asset provenance and license inventory incomplete | OPEN / DECISION_REQUIRED |
| F-035 | P2 | ZIP archive version/schema has no shared canonical owner/migration registry | OPEN |
| F-036 | P1 | Imported project/module state persisted without structural domain validation | OPEN |
| F-037 | P1 | ZIP/image import lacks explicit count/size/resource limits/content policy | OPEN |
| F-038 | P2 | Dependency/security advisory scanning not enforced in CI | OPEN |
| F-039 | P2 | Dynamic modal/context-menu focus/accessibility semantics inconsistent | OPEN |
| F-040 | P1 | No real browser E2E harness covers critical user workflows | OPEN |
| F-041 | P1 | ROG unprotected; green CI/change gate not enforced before merge/direct push | OPEN |
| F-042 | P1 | Server deploy path not commit-pinned and weaker than CI gate/test chain | OPEN |
| F-043 | P2 | Public repository has no explicit root software license decision/file | OPEN / DECISION_REQUIRED |
| F-044 | P2 | Many merged/superseded branches remain | OPEN |
| F-045 | P2 | Historical source-rewriting patch scripts remain beside canonical tooling | OPEN |
| F-046 | P2 | No lint/format/static-quality gate in canonical CI chain | OPEN |

## Cross-domain remediation clusters

1. Governance wall: F-005/F-006/F-007/F-041/F-042.
2. Persistence/schema/data safety: F-020/F-021/F-022/F-023/F-032/F-035/F-036/F-037.
3. Module identity/state construction: F-010/F-013/F-018/F-019.
4. Behavior/placement: F-011/F-015/F-016.
5. BOM: F-014/F-025/F-029/F-030/F-031.
6. Browser/UI accessibility: F-027/F-028/F-039/F-040.
7. Assets/repository/security hygiene: F-033/F-034/F-038/F-043/F-044/F-045/F-046.

A finding is `CLOSED` only after implementation, targeted regression where applicable, full test/build, PR CI and required post-merge verification evidence.
