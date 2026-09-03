# A00 Audit Baseline Evidence

Audit section: `A00 — Audit bootstrap / baseline`
Audit date: `2026-09-03`
Baseline branch: `ROG`
Baseline SHA: `6a702b000ffb3f9977f6e0853e23e840285eb60e`
Baseline tree SHA: `678de4daa0250dfc9c8f7fc0a80252e0c02fe4a7`
Audit working branch: `audit/full-system-a00`

## A00.01 — Frozen baseline

GitHub `ROG` resolved to commit `6a702b000ffb3f9977f6e0853e23e840285eb60e`. The audit baseline is frozen to that commit. Audit conclusions must state the SHA they were checked against.

## A00.02 — Fresh audit branch

`audit/full-system-a00` was created from current `ROG` after resolving the baseline SHA above. No prior audit conclusion is imported from an older branch.

## A00.03 — Baseline CI

Canonical ROG push CI:

- workflow: `CI`
- run number: `74`
- run id: `33786201978`
- head SHA: `6a702b000ffb3f9977f6e0853e23e840285eb60e`
- result: `success`

The workflow order at baseline is: checkout with `fetch-depth: 0` → Node 22 → change-contract gate → `npm ci` → `npm test` → `npm run build`.

## A00.04 — Repository snapshot

The baseline recursive Git tree is pinned by tree SHA `678de4daa0250dfc9c8f7fc0a80252e0c02fe4a7`.

The requested audit roots are present and were snapshotted from ROG:

- repository root
- `src/`
- `test/`
- `tests/`
- `scripts/`
- `.github/`
- `public/`

Important bootstrap observations only (not domain conclusions):

- both `test/` and `tests/` exist;
- `.github/change-contract.json` and `.github/workflows/ci.yml` exist;
- `scripts/verify-change-contract.mjs` exists alongside historical/operational scripts;
- `public/` contains deployable static assets and models.

Classification of those contents belongs to later audit sections; nothing here certifies them as correct or current.

## A00.05 — Package/build snapshot

`package.json` at baseline:

- package version: `0.1.0`
- module mode: ESM (`type: module`)
- scripts:
  - `dev`: `vite`
  - `contract:verify`: `node scripts/verify-change-contract.mjs`
  - `test`: `node --test`
  - `build`: `vite build`
  - `preview`: `vite preview`
- runtime dependencies:
  - `jszip`: `^3.10.1`
  - `three`: `^0.184.0`
- dev dependency:
  - `vite`: `^8.0.16`
- lockfile version: `3`
- CI Node major: `22`

Exact lockfile state is pinned by blob SHA `f151efd6222152f326718e9fd23bec2b2b2ef768`.

## A00.06 — Historical conclusion isolation

Bootstrap policy: historical documents, old reviews, old milestones, cleanup notes, previous assistant statements and prior audit conclusions are evidence candidates only. They do not become current audit conclusions unless re-verified against the frozen/current SHA in their relevant section.

This specifically prevents bootstrap from inheriting stale conclusions before `A01` and later domain audits execute.

## A00.07 — Findings index readiness

`SYSTEM_AUDIT_CHECKLIST.md` already contains the canonical Findings Index and finding record format (`F-XXX`, severity, domain, evidence, impact, decision, fix PR, retest). No finding was created during A00 because bootstrap established references only.

## A00 result

`A00` is complete with no finding. Next strict item: `A01.01`.
