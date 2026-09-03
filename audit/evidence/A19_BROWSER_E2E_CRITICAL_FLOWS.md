# A19 — Browser E2E / critical user-flow audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Result

A19 is **inspected and classified**, but it is not green. The repository does not contain a real browser automation harness, so critical flows cannot be claimed end-to-end verified from the current automated test system.

Root finding: **F-040 — P1 — no real browser E2E harness**.

## Critical-flow classification

- A19.01 cold startup/no console exception: `GAP` — no browser smoke.
- A19.02 create stand for all stand types: `GAP` end-to-end; planners/unit tests exist.
- A19.03 add each catalog module through user UI: `GAP`; F-013 shows UI paths can already diverge.
- A19.04 drag/drop/ghost/placement: `GAP`; geometry tests exist, browser interaction proof absent.
- A19.05 rotate/move/invalid recovery: `GAP`; strong unit/source regressions, no browser sequence proof.
- A19.06 delete/duplicate/add-side/context actions: `GAP`; F-015/F-027/F-028 are direct UI/runtime findings.
- A19.07 color/image/glass/fabric/mesh/light controls: `GAP`; source/unit coverage only.
- A19.08 illuminated-foam creation/resize/halo/save: `GAP`; no full browser persistence flow.
- A19.09 automatic depot composition: `GAP` end-to-end; planner tests exist.
- A19.10 save/reload/open project: `GAP`; F-020/F-022.
- A19.11 project switch with pending autosave: `GAP`; F-020.
- A19.12 project delete + asset cleanup: `GAP`; F-023.
- A19.13 export/import round-trip: `GAP`; F-021/F-022/F-035/F-036/F-037.
- A19.14 model-load failure fallback: `GAP`; F-024.
- A19.15 keyboard shortcuts while inputs focused: `GAP` at browser level; resolver tests exist.
- A19.16 dialogs/context focus: `GAP`; F-039.
- A19.17 render PNG: `GAP`; no browser canvas/download automation.
- A19.18 repeated project switching/memory: `GAP`; no browser memory instrumentation.
- A19.19 raw BOM debug not production: `GAP`; F-025 proves opposite.
- A19.20 console/network/model asset errors in deployed build: `GAP`; no automated deployed smoke.

Section audit status: **GAP — inspected, not executable/green under current test architecture**.
