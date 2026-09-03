# A02 / F-006 Remediation Closure

Finding: `F-006` — Canonical rule/gate Markdown documents were outside guarded-file detection.
Severity: `P1`
Status: **CLOSED**

## Fix

`src/systemChangeContract.js` now declares `GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS` and treats the following files as guarded architecture surfaces:

- `README.md`
- `PROJECT_RULES.md`
- `ARCHITECTURE_RULES.md`
- `SYSTEM_DEVELOPMENT_CONTRACT.md`
- `SYSTEM_CHANGE_GATE.md`
- `MODULE_BEHAVIOR_STANDARD.md`
- `SYSTEM_AUDIT_CHECKLIST.md`

Changes to any of these files now require `.github/change-contract.json` in the same guarded diff and require `impact.architecture = affected`.

Planning/history documents such as `ROADMAP.md` are intentionally not pulled into this governance-specific rule.

## Regression guard

`test/systemChangeGate.test.js` verifies:

1. all seven governance/developer-entrypoint documents are guarded,
2. each requires the architecture impact domain,
3. `README.md` and `SYSTEM_CHANGE_GATE.md` can no longer bypass the universal declaration,
4. non-governance planning Markdown remains outside this specific guard.

## Verification

PR: `#41 — Fix F-006 guard canonical governance documents`
Implementation head before closure records: `bbccef67434dbfdf317c8a6e6e2d1a5d8add0397`
PR CI run: `#112` / `33802087763`

Verified successful steps:

- Change contract gate: passed
- Install dependencies: passed
- Full `npm test`: passed
- `npm run build`: passed

No runtime product behavior or stored-project schema changed.

## Result

The human/AI governance contract and the machine gate can no longer drift through a docs-only change without an explicit architecture-impact declaration.
