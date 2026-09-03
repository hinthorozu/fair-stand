# A20 — Build / CI / deploy audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Current canonical CI

`.github/workflows/ci.yml` runs on ROG push and PR to ROG with Node 22:

1. checkout with full history,
2. `npm run contract:verify`,
3. `npm ci`,
4. `npm test`,
5. `npm run build`.

Latest canonical ROG push run for baseline SHA `e764732...` is run #83 / id `33792514084`; every listed step completed successfully.

## Findings

### F-041 — P1 — ROG is not protected; green CI is not merge/direct-push enforced

ROG reports `protected:false`. The CI workflow executes and can fail, but repository governance does not currently require the check before a human with write/merge permission updates ROG. Therefore the universal change gate is technically active but not a complete governance wall.

### F-042 — P1 — server deployment path does not enforce the canonical CI/gate contract and is not commit-pinned

`scripts/install-server.sh` runs in whatever branch is checked out on the server, changes origin, then executes `git pull --ff-only`, `npm ci`, and `npm run build` before serving `dist/` through nginx. It does **not**:

- explicitly checkout/verify ROG,
- pin an audited commit SHA,
- run `npm run contract:verify`,
- run `npm test` before deployment.

A server checkout on an unintended branch or a direct-pushed commit can therefore be built/deployed through a path weaker than canonical CI.

## Positive controls

- CI uses deterministic `npm ci`.
- Node 22 is explicit.
- CI full-history checkout supports diff-aware change gate.
- test precedes build.
- server installer uses strict shell flags, validates nginx, handles SSL and uses `npm ci`.
- Vite config intentionally splits Three.js vendor code.

## Checklist results

- A20.01 deterministic install: `AUDITED_OK` in CI/deploy (`npm ci`).
- A20.02 test/build order: `AUDITED_OK` in CI.
- A20.03 change gate before tests: `AUDITED_OK` in CI.
- A20.04 current baseline CI green: `AUDITED_OK`.
- A20.05 CI required before merge: `GAP` — F-041.
- A20.06 direct push bypass prevented: `GAP` — F-041.
- A20.07 deploy reproducible/pinned: `GAP` — F-042.
- A20.08 deploy runs same verification chain: `GAP` — F-042.
- A20.09 build config intentional: `AUDITED_OK` for current Vite config.
- A20.10 production deploy smoke/rollback automation: `DECISION_REQUIRED`; installer performs HTTPS reachability check but no release artifact/rollback contract is present.

Section audit status: **GAP**.
