# 01 — Entry points

**Kanıt:** `index.html`, `package.json`, `.github/workflows/ci.yml`, `playwright.config.mjs`, GitNexus File IMPORTS (`main.js` → 29 `src/` dosyası), grep `new Worker` = 0.

## Tarayıcı

| Entry | Kanıt |
| --- | --- |
| `index.html` → `/src/main.js` | satır 158 `type=module` |
| `index.html` → `/src/projectActionSaveGuard.js` | satır 159; dosya sonu `bindProjectActionSaveGuard()` |
| Vite `index.html` | `npm run dev` / `build` / `preview` |

`main.js` `projectActionSaveGuard.js` import etmez. HTML ikinci entry. Knip “yalnız test” okuması false-positive olur.

Dinamik import:

- `import('./rawBomDebug.js')` — `import.meta.env.DEV && ?rawBom` (`main.js:62-63`)
- `import('jszip')` — zip import/export

## package.json script

| Script | Komut | Sınıf |
| --- | --- | --- |
| `dev` | vite | USED |
| `build` | vite build | USED (CI) |
| `preview` | vite preview | USED |
| `test` | node --test | USED (CI) |
| `contract:verify` | `scripts/verify-change-contract.mjs` | USED (CI ilk adım) |
| `syntax:check` | `scripts/check-src-syntax.mjs` | USED (CI) |
| `audit:deps` | npm audit | USED (CI) |
| `e2e` / `e2e:deps` / `e2e:install` | Playwright | USED (CI; Knip unused file false-positive) |

## scripts/

| Dosya | package.json | CI | Sınıf |
| --- | --- | --- | --- |
| `verify-change-contract.mjs` | `contract:verify` | evet | SCRIPT_ONLY_ACTIVE |
| `change-impact-analysis.mjs` | yok | dolaylı | SCRIPT_ONLY_ACTIVE |
| `check-src-syntax.mjs` | `syntax:check` | evet | SCRIPT_ONLY_ACTIVE |
| `install-server.sh` | yok | yok | SCRIPT_ONLY_ACTIVE (deploy; hygiene test) |
| `add-tv-sizes.py` | yok | yok | SCRIPT_ONLY_STALE |
| `add-video-wall-2x2.py` | yok | yok | SCRIPT_ONLY_STALE |
| `fix-tv-screen-face.py` | yok | yok | SCRIPT_ONLY_STALE |
| `video-wall-build-trigger.txt` | yok | yok | SCRIPT_ONLY_STALE |
| `patch-video-wall-2x2.cjs` | — | — | önceki cleanup’ta silindi (`CLEANUP_PHASE_1.md`) |
| `patch-video-wall-single-image.cjs` | — | — | aynı |

## Test / e2e

| Entry | Keşif |
| --- | --- |
| `npm test` | Node varsayılan glob: `test/**/*.test.js`, `tests/*.test.js` |
| `npm run e2e` | `playwright.config.mjs` `testDir: './e2e'` — 26 spec **USED** |
| `playwright.config.mjs` | Knip unused file → **USED** |

## CI

`.github/workflows/ci.yml`: `contract:verify` → `npm ci` → `audit:deps` → `syntax:check` → `npm test` → `build` → `e2e:deps` → Chromium → `npm run e2e`. Push/PR dalı: `RefactorItem`.

## Production grafına girmeyen src (HTML/main transitif değil)

Cypher + import grep:

- `src/groundLayout.js` — yalnız `test/groundLayout.test.js` (GitNexus IMPORTS 1)
- `src/featureContracts.js` — `test/systemDevelopmentContract.test.js` (`getFeatureContract` incoming yalnız o test)
- `src/moduleContracts.js` — 19 test, 0 `src/` importer
- `src/cornerPlacement.js` — `test/cornerPlacement.test.js`, `test/rightWallOrientation.test.js`
- `src/systemChangeContract.js` — `scripts/verify-change-contract.mjs`, `test/systemChangeGate.test.js`

## Worker

`new Worker` eşleşmesi 0.
