# A02 F-009 closure

Finding: **F-009 — local `contract:verify` can skip diff enforcement outside CI/env input**

Status: **CLOSED pending post-merge ROG verification**

Remediation:
- removed the schema-only success path outside CI.
- local verification resolves committed changes from a ROG/base merge-base.
- local verification unions staged, unstaged, and untracked files.
- `CHANGE_GATE_BASE=<git-ref>` provides an explicit base override.
- inability to resolve a local base fails closed instead of silently skipping enforcement.
- output reports the actual diff source used.

Targeted regression:
- `test/systemChangeGateLocalDiff.test.js` creates a real temporary git repository and proves:
  - an untracked guarded source without contract update is rejected,
  - staged source + unstaged contract changes are unioned and accepted,
  - committed guarded changes are enforced against an explicit base.
- `test/systemChangeGateCiContract.test.js` continues to protect the canonical CI gate ordering.

Documentation:
- `SYSTEM_CHANGE_GATE.md` now documents current F-005..F-009 path coverage, mandatory targeted tests, and local diff behavior.

Validation:
- implementation PR #44 CI run #127: Change contract gate, install, full test, and build all passed.
- final branch CI after section-closure bookkeeping must pass before merge.
- post-merge ROG CI must pass before A03 remediation begins.
