# A02 F-007 closure

Finding: **F-007 — `test/` and `tests/` outside change-gate guarded-file governance**

Status: **IMPLEMENTED — awaiting final PR CI, merge, and post-merge ROG CI**

Remediation:
- `test/**` is now a guarded change surface.
- legacy `tests/**` is now a guarded change surface.
- both paths require the `tests` impact domain.
- regression coverage proves both guarded status and mandatory `tests` impact.

Targeted regression:
- `test/systemChangeGate.test.js`

Closure requires:
- PR CI: Change contract gate + install + full test + build green.
- merge to fresh `ROG`.
- post-merge ROG CI green.
