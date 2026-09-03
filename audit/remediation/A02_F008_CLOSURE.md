# A02 F-008 closure

Finding: **F-008 — targeted regression declaration can be empty; test impact not machine-required**

Status: **CLOSED pending post-merge ROG verification**

Remediation:
- every change contract must mark `impact.tests` as `affected`.
- `tests.targeted` must contain at least one non-empty targeted regression path.
- existing `tests.fullSuite = true` and `tests.build = true` requirements remain mandatory.
- negative regressions reject `tests: not-applicable`, an empty targeted list, and blank targeted entries.

Targeted regression:
- `test/systemChangeGate.test.js`

Validation:
- implementation PR CI run #122: Change contract gate, install, full test, and build all passed.
- final branch CI after closure-ledger updates must pass before merge.
- post-merge ROG CI must pass before F-009 begins.
