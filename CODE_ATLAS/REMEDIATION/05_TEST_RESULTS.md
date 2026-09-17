# 05 — Test results

## Targeted (paket sonrası)

| Suite | Sonuç |
| --- | --- |
| `test/systemChangeGateCiContract.test.js` | geçti |
| `test/systemChangeGateLocalDiff.test.js` (GitHub `CHANGE_GATE_BASE` override dahil) | geçti |
| Inner-corner contract + `moduleRecipes` + `showcaseRecipes` | geçti |
| `test/autoDepot.test.js` / `test/moduleBehavior.test.js` | geçti (ilk autoDepot syntax kopya hatası düzeltildi) |
| `test/scene3dPublicContract.test.js` | geçti (CRLF + `scene3d.js` import regex) |
| `test/systemDevelopmentContract.test.js` | geçti |

## Full validation

| Komut | Sonuç |
| --- | --- |
| `npm run syntax:check` | geçti |
| `npm test` | **779 pass / 0 fail** (`duration_ms` ~8878) |
| `npm run build` | geçti (Vite 8; chunk-size uyarı pre-existing) |
| `npm run contract:verify` | geçti; `Diff source: local git diff against refs/remotes/origin/Version2 + staged/unstaged/untracked`; `Guarded files: 119`; path-required: architecture, tests, composition, placement, catalog, state, persistence, bom, behavior, renderer, ui, assets, storage, importExport, performance |

## E2E / Playwright

Çalıştırılmadı. Bu tur UI/runtime behavior değiştirmedi. `package.json` `e2e` / `e2e:deps` var; `@playwright/test` kalıcı dependency değil (`npm run e2e:deps` ile kurulur).

## Regression

Production expectation değiştirilmedi. Test kırıkları test/parser kopyasıydı.
