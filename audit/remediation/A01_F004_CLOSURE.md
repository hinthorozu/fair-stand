# A01 / F-004 Remediation Closure

Finding: `F-004 — README/developer entrypoint predates universal change-gate workflow`
Severity: P2
Branch: `remediation/a01-f004-developer-entrypoint`
PR: `#39`
Starting ROG: `f19f55358bdfe64e9d6786eb674fb7d85d33f2a6`

## Fix

- README now documents `npm run contract:verify` and the canonical CI order.
- README onboarding now includes `SYSTEM_CHANGE_GATE.md`, `.github/change-contract.json`, `SYSTEM_DEVELOPMENT_CONTRACT.md`, `SYSTEM_AUDIT_CHECKLIST.md` and current audit/remediation trackers.
- New module/feature/core work is documented as beginning with universal impact classification before domain implementation.
- `SYSTEM_DEVELOPMENT_CONTRACT.md` now explicitly hands off from the universal change gate and requires the same declaration → domain contract → targeted regression → full test/build → PR CI → post-merge ROG CI flow.
- Added `test/developerEntrypointDocs.test.js` to guard these developer-entrypoint requirements.

## Verification

Implementation head: `0b142ee3aad941c7bd0c6beadb988c5e7a1f748a`
PR CI: `#101 / 33800264473`

- change contract gate: passed
- npm ci: passed
- npm test: passed (includes developer-entrypoint documentation regression)
- npm run build: passed

## Result

`F-004: CLOSED`

A01 section revalidation is recorded separately in `audit/remediation/A01_CLOSURE.md`. Post-merge ROG CI is required before A01 is considered fully closed.
