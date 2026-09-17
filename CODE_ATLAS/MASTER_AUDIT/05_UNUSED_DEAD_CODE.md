# 05 — Unused / dead code

Sınıflar: USED | PROVEN_UNUSED | LIKELY_UNUSED | TEST_ONLY | SCRIPT_ONLY_ACTIVE | SCRIPT_ONLY_STALE | GOVERNANCE | UNCERTAIN_DYNAMIC.

Knip tek başına kanıt değil. GitNexus 0 caller + grep + HTML/dynamic.

## PROVEN_UNUSED

Bu taramada **tam dosya/sembol silinebilir, hiçbir bağ yok** aday: **0**.

En yakınlar TEST_ONLY / SCRIPT_ONLY_STALE; test, gate veya docs bağı var.

## Knip unused files → hüküm

| Aday | Knip | Graph/runtime | Sınıf |
| --- | --- | --- | --- |
| `playwright.config.mjs` | unused file | `npm run e2e`, CI | USED |
| `e2e/*.spec.mjs` (26) | unused file | Playwright testDir | USED |
| patch-video-wall `*.cjs` | unused file | cleanup silindi | n/a |

## Knip unused exports → hüküm

| Sembol | Graph | Grep | Sınıf |
| --- | --- | --- | --- |
| `STAND_AXES` | context incoming `{}` | `validateStandAxisCapacity` iç `includes` | USED (internal); dış import 0 |
| `PROJECT_ARCHIVE_VERSION` | iç ACCESS | zip import | USED (internal) |
| `validateImportedModuleState` | CALLS from validateImportedProjectState | zip | USED (internal) |
| `validateImportedStandState` | aynı | floor+setup | USED (internal) |
| src `getRecipeInnerCornerPanelKey` | 0 caller | **export kaldırıldı** (cleanup) | n/a |

## src dosyaları — production import 0

| Dosya | Graph | Sınıf |
| --- | --- | --- |
| `groundLayout.js` | IMPORTS: 1 test; impact 1; process [] | TEST_ONLY |
| `featureContracts.js` | getFeatureContract incoming 1 test; process [] | GOVERNANCE |
| `moduleContracts.js` | resolveModuleContract 19 test, 0 process | GOVERNANCE |
| `cornerPlacement.js` | 2 test; process [] | TEST_ONLY |
| `systemChangeContract.js` | script + gate tests | SCRIPT_ONLY_ACTIVE |

## Fonksiyon / API

| Sembol | Sınıf | Kanıt |
| --- | --- | --- |
| `getConnectorItemKey` / `resolveConnectorBom` | TEST_ONLY | js import yalnız `connectorBom.test.js`; data ITEMS’te USED |
| `resolveItemBom` | TEST_ONLY + DEV | itemBom ← rawBomDebug; main dinamik DEV |
| `getItemSurfaceCapabilities` | USED | door-leaf; diğer type NO_SURFACE |
| `createGroundLayout` | TEST_ONLY | scene3d 0 |
| `resolveAdjacentPlacement` | TEST_ONLY | wallReflow live |

## Script

| Dosya | Sınıf |
| --- | --- |
| verify/change-impact/syntax-check | SCRIPT_ONLY_ACTIVE |
| install-server.sh | SCRIPT_ONLY_ACTIVE |
| add-tv-sizes.py, add-video-wall-2x2.py, fix-tv-screen-face.py | SCRIPT_ONLY_STALE |
| video-wall-build-trigger.txt | SCRIPT_ONLY_STALE |

## Dependency

| Paket | Sınıf |
| --- | --- |
| `three`, `jszip`, `vite` | USED |
| Playwright binary (knip unused binary) | USED (e2e:deps + CI) |

## UNCERTAIN_DYNAMIC

`CATALOG_PREVIEW_RENDERERS[catalogPreview]` — sabit whitelist, runtime string. Graph CALLS eksik olabilir; **USED**.

scene3d return-object method’ları (`clearSelection` vb.) façade; zero-caller ≠ unused.

## Dead branch

`itemBom` `composition.mode !== 'recipe' → null` — furniture cluster kasıtlı. Impossible branch kanıtlanmadı.

`new Worker` 0.
