# A23 — Cross-domain conflict matrix

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Purpose

A23 checks whether apparently separate A00-A22 findings are actually the same root cause, and whether one fix could create a second-domain regression. Duplicate findings are not opened when an earlier root already owns the conflict.

## Cross-domain matrix

| Root | Domains crossing | Conflict |
|---|---|---|
| F-005/F-006/F-007 | governance → architecture/docs/tests | change gate cannot force declarations for every canonical governance/test change |
| F-010 | catalog → state → UI/composition | catalog/contract can be complete while runtime factory dispatcher is omitted |
| F-011/F-015/F-016 | behavior → placement → UI/renderer | declared behavior and actual insertion/orientation/special geometry policy are not one enforced model |
| F-013 | catalog identity → persistence → contract/BOM | ambiguous legacy descriptor can lose exact vine-separator identity |
| F-017/F-019 | catalog/state → renderer → persistence | duplicated dimensions/direct scene mutation allow renderer/state drift after refactor/catalog change |
| F-020/F-022/F-023/F-032 | UI lifecycle → autosave → IndexedDB | project switching/deletion/schema ownership are not one transactional persistence boundary |
| F-025/F-030/F-031 | UI → BOM → production | debug selected-module recipe display can look like Final BOM while no project/relationship BOM exists |
| F-029 | feature contract → composition → persistence/BOM | automatic wall creates coordinated modules without explicit feature contract/impact surface |
| F-033/F-034 | assets → deploy → performance/legal | public-file placement controls shipped payload; provenance inventory is incomplete |
| F-035/F-036/F-037 | import schema → state/storage → security/availability | archive version/basic manifest checks do not validate domain state or bound resource usage |
| F-039/F-040 | UI/accessibility → browser testing | focus/keyboard issues cannot be reliably guarded without browser interaction tests |
| F-041/F-042 | CI/change gate → repository/deploy governance | CI can be green while merge/direct-push/deploy paths do not require the same checks |

## High-risk remediation dependencies

1. **Persistence cluster:** fix F-020/F-021/F-022/F-023/F-032/F-035/F-036 together under an explicit project schema/transaction strategy; isolated patches can create incompatible saves.
2. **Module identity/factory cluster:** F-010/F-013/F-019 should be solved before adding more catalog families; otherwise new module work increases parallel registries.
3. **Placement/behavior cluster:** F-011/F-015/F-016 should share one declarative policy extension rather than type-specific UI patches.
4. **BOM cluster:** F-014/F-030/F-031 must distinguish product policy decisions from algorithm implementation; do not invent commercial/excluded classifications.
5. **Governance cluster:** F-005/F-006/F-007/F-041/F-042 must be aligned so the code gate, GitHub merge wall and deploy wall enforce the same contract.
6. **Browser verification cluster:** F-040 should land before claiming fixes to destructive actions, persistence, import/export, focus or model failure are fully closed.

## P0 check

No P0/root cause requiring emergency rollback or evidence of current catastrophic data corruption/security compromise was identified. P1 findings remain numerous and block a clean remediation/release sign-off.

## Checklist result

Every A00-A22 finding was cross-linked to its owning domain/root. No new independent A23 finding was necessary.

Section audit status: **GAP — cross-domain analysis complete; no fix performed.**
