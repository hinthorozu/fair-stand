# A02 / F-005 Remediation Closure

Finding: `F-005` — Change-gate path/domain wall incomplete; 20/51 audited `src/` files had zero mandatory mapping.
Severity: `P1`
Status: **CLOSED**

## Fix

- Replaced the partial path rules and filename-pattern fallback in `src/systemChangeContract.js` with `SOURCE_FILE_REQUIRED_DOMAINS`.
- Explicitly classified all **51 current `src/` files** using the ownership map established by `audit/evidence/A03_ARCHITECTURE.md`.
- Previously unmapped high-value sources now have mandatory domains, including `main.js`, `tvConfig.js`, `standSetup.js`, `standCapacity.js`, `viewKeyboardShortcuts.js`, `colorEditorInputs.js`, `groundLayout.js`, and `wall.js`.
- Multi-responsibility orchestration/renderer sources require their known cross-domain impacts instead of a single accidental filename-derived classification.
- Removed the generic `Controller|Feedback => ui` mapping as the ownership authority; UI/controller files are classified explicitly.

## Regression guard

`test/systemChangeGate.test.js` now enumerates the real `src/` directory and asserts:

1. every current source file has exactly one explicit map entry,
2. every entry resolves at least one required impact domain,
3. every mapped domain belongs to the canonical 17-domain schema,
4. high-risk sources carry ownership-appropriate domains,
5. `main.js` cannot silently drop its known cross-domain responsibilities.

A future `src` file added without classification therefore fails the regression suite.

## Verification

PR: `#40 — Fix F-005 complete source impact-domain mapping`
Implementation head before closure records: `dc8f654106cc7454042421f3fa217deb610e4143`
PR CI run: `#107` / `33801523370`

Verified successful steps:

- Change contract gate: passed
- Install dependencies: passed
- Full `npm test`: passed, including the new source-map regression
- `npm run build`: passed

No runtime product behavior or stored-project schema was changed.

## Result

The F-005 condition is removed: current source files can no longer be guarded while carrying zero mandatory impact domains, and new source files cannot enter the repository without an explicit ownership/domain classification.
