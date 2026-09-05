# A04 F-013 closure

Finding: **F-013 — Exact catalog identity ambiguous for normal vs vine separators when `catalogKey` is absent**

Status: **CLOSED / POST-MERGE VERIFIED**

## Remediation

- `src/catalog.js` now includes `modelFile` in normalized catalog identity matching.
- Legacy/keyless separator descriptors can therefore distinguish:
  - `wall_separator_100` from `wall_separator_100_sarmasik`,
  - `wall_separator_50` from `wall_separator_50_sarmasik`.
- `src/designState.js` canonical construction resolves catalog identity from the input descriptor and attaches a valid canonical `catalogKey` whenever the runtime module corresponds to a catalog product.
- Canonical construction omits `catalogKey` for true non-catalog runtime objects instead of persisting null/undefined identity.
- `src/main.js` restore normalization repairs missing/invalid catalog identity when it can be resolved and deletes unresolved identity fields.
- `illuminated-foam` remains the explicit non-catalog runtime object and therefore remains keyless.
- No catalog dimensions, module factory geometry, placement arithmetic, renderer appearance or BOM classification was intentionally changed by F-013.

## Regression evidence

Targeted coverage includes:

- `test/catalogSingleSource.test.js` — verifies exact normal versus vine separator resolution through `modelFile`.
- `test/moduleStateConstructionRegistry.test.js` — verifies all 45 catalog descriptors receive their canonical `catalogKey` without callers explicitly supplying the key; non-catalog illuminated foam has no `catalogKey` property; automatic-equivalent descriptors resolve canonical identity.
- `e2e/f010-module-construction.spec.mjs` — Chromium verifies persisted automatic-wall modules and real catalog-picker creation carry canonical catalog identity.

The full unit/integration suite and production build passed on the final PR head and again after merge.

## Integration with current ROG

PR #53 was originally prepared before A03/F-012 closure. Before merge it was synchronized with the then-current `ROG` (`d6f9b32e50948b257226e5414074cc95be7246e0`). The only overlapping changed file was `.github/change-contract.json`; A03 runtime changes were preserved unchanged.

After synchronization, the change gate required two newly reachable A03 review surfaces (`test/sceneSurroundSingleSource.test.js` and `audit/remediation/A03_CLOSURE.md`) to be declared. The declaration was updated and the final PR CI passed completely. This was governance metadata alignment, not a product regression.

## CI and merge evidence

- implementation PR: **#53 — Enforce canonical catalogKey identity**
- final implementation head: `0f6b95f5163bc30377862882a7e5bf6724b65463`
- final PR CI: **#225 / run `33976413653` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- merged to `ROG` as `238c2946d9e09451f22d040dd04a340cde7991a9`
- post-merge `ROG` CI: **#226 / run `33976491702` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Result

F-013 satisfies the repository closure rule: implementation, targeted regression, full suite, build, PR CI, merge and post-merge verification are complete.

**F-013 is CLOSED.**

A04 remains open because **F-014 — 17 active module contracts require final BOM classification** remains `OPEN / DECISION_REQUIRED`.
