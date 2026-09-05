# A21 F-041 closure

Finding: **F-041 — ROG unprotected; green CI/change gate not enforced before merge/direct push**

Status: **CLOSED / REPOSITORY RULESET VERIFIED**

## Root cause

At the audit baseline, the canonical `ROG` branch did not have an enforced repository rule requiring pull-request flow and green canonical CI before changes could land. That allowed governance to depend on convention instead of an enforced server-side branch rule.

## Remediation

GitHub repository ruleset **`Protect ROG`** (ruleset id `22234684`) is now active and targets exactly `refs/heads/ROG`.

The live ruleset enforces:

- pull requests before changes can land on `ROG`,
- required status check `verify`,
- strict required-status-check policy,
- branch deletion prevention,
- non-fast-forward update prevention,
- no bypass actors; current user bypass is `never`.

The repository branch API also reports `ROG` as protected. Protection is implemented through the repository ruleset rather than relying on the legacy/classic branch-protection configuration.

No application runtime, persistence, schema, renderer, placement, Item/BOM, catalog, import/export, build output or deployment behavior is changed by this closure bookkeeping.

## Verification

Live GitHub repository configuration was read directly before closure:

- ruleset name: `Protect ROG`,
- ruleset target: branch,
- enforcement: `active`,
- included ref: `refs/heads/ROG`,
- pull-request rule present,
- required-status-check rule present,
- required check: `verify`,
- strict required-status-check policy: `true`,
- deletion rule present,
- non-fast-forward rule present,
- bypass actors: none,
- `current_user_can_bypass`: `never`.

The closure PR itself must pass the canonical `verify` CI before merge, providing an additional operational check that the protected-branch workflow remains compatible with the repository's current governance chain.

## Result

`ROG` is no longer an unprotected branch. GitHub now enforces PR-based integration and the canonical green `verify` check at the branch boundary, while also preventing deletion and non-fast-forward updates without bypass actors.

A21 remains a broader `GAP` section because F-043, F-044, F-045 and F-046 are separate open repository-hygiene findings.

**F-041 is CLOSED.**
