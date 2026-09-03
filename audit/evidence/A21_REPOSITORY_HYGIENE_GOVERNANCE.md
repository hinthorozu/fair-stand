# A21 — Repository hygiene / governance audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Current repository state

- GitHub visibility: **public**.
- Default branch: ROG.
- Open pull requests at audit time: **0**.
- Open issues at audit time: **0**.
- Many historical feature/fix/refactor/docs/audit branches remain after their work was merged or superseded.
- repository root has no `LICENSE`/`COPYING` file in the inspected tree.

## Findings

### F-043 — P2 — public repository has no explicit repository-level license decision/file

The repository is publicly visible but the audited tree has no root software license. This does not change copyright ownership, but it leaves reuse/distribution terms unclear. Asset attribution has a separate incomplete inventory under F-034.

### F-044 — P2 — branch hygiene has accumulated substantial superseded history

The branch inventory still contains numerous old merged/superseded `fix/`, `refactor/`, `docs/`, `cleanup/` and temporary audit branches, including multiple empty audit-sweep variants at the baseline ROG SHA. This does not break runtime, but increases operational ambiguity and the chance of humans/automation selecting stale work as current.

### F-045 — P2 — one-off source-rewriting patch scripts remain beside canonical tooling

`scripts/` contains historical one-off patch/add/fix scripts that directly rewrite canonical source files using string replacement. Example: `patch-video-wall-2x2.cjs` edits `catalog.js`, `designState.js`, `main.js` and `scene3d.js`. These scripts are not package lifecycle commands and are not declared current migrations. Manual re-execution against modern source could bypass normal architecture decisions or reintroduce old code.

### F-046 — P2 — no lint/format/static-quality gate is part of the canonical command chain

`package.json` exposes dev, contract verify, test, build and preview only. There is no lint, formatter-check or type/static-analysis command in canonical CI. Existing tests provide many architecture/source guards, but general static-quality drift is not automatically checked.

## Positive controls

- canonical CI is consolidated to one workflow.
- current open PR/issue queues are empty.
- historical cleanup/progress documents explicitly record many completed cleanup slices.
- one-off patch scripts are not invoked by `package.json` or canonical CI.

## Checklist results

- A21.01 open PR/issue inventory: `AUDITED_OK`.
- A21.02 stale/superseded branches: `GAP` — F-044.
- A21.03 one-off scripts: `GAP` — F-045.
- A21.04 documentation status drift: `GAP` — F-001/F-002/F-003/F-004.
- A21.05 repository license/public decision: `GAP` — F-043.
- A21.06 third-party asset attribution: `GAP/DECISION_REQUIRED` — F-034.
- A21.07 generated/build artifacts committed: `AUDITED_OK` for inspected tree; `dist/` is not tracked.
- A21.08 static quality tooling: `GAP` — F-046.
- A21.09 canonical CI count/ownership: `AUDITED_OK`.
- A21.10 branch governance: `GAP` — F-041/F-044.

Section audit status: **GAP**.
