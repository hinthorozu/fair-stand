# 06 — Dokunma listesi

False-positive, bilinçli support veya hub. Silme/refactor bu turda yok.

## TEST_SUPPORT

| Path | Kanıt |
| --- | --- |
| `src/groundLayout.js` | Import yalnız `test/groundLayout.test.js`; scene3d 0 |
| `src/cornerPlacement.js` | `test/cornerPlacement.test.js`, `test/rightWallOrientation.test.js` |
| `test/recipeParentItemKey.js` | type+width → itemKey; production ITEMS değil |
| `recipeView.variants` | Test projeksiyonu |
| `getConnectorItemKey` / `resolveConnectorBom` | Test API; connector data live |

## GOVERNANCE

| Path | Kanıt |
| --- | --- |
| `src/featureContracts.js` | SYSTEM_DEVELOPMENT_CONTRACT §2; 1 test caller |
| `src/moduleContracts.js` | 19 test; 0 src import; 0 process |
| `src/systemChangeContract.js` | verify script + gate testleri |
| `ITEM_CONTRACT.md` / `SYSTEM_*` MD | Canonical metin |

## SCRIPT_ONLY_ACTIVE

| Path | Kanıt |
| --- | --- |
| `scripts/verify-change-contract.mjs` | `npm run contract:verify` + CI |
| `scripts/change-impact-analysis.mjs` | verify çağırır |
| `scripts/check-src-syntax.mjs` | `syntax:check` |
| `scripts/install-server.sh` | hygiene test |

## SCRIPT_ONLY_STALE (silme kararı ayrı)

`scripts/archive/add-tv-sizes.py`, `add-video-wall-2x2.py`, `fix-tv-screen-face.py`, `video-wall-build-trigger.txt`

## RUNTIME_ACTIVE (hub — impact CRITICAL/HIGH ≠ bug)

| Symbol | Graph |
| --- | --- |
| `getItem` | 60 direct / 79 process CRITICAL |
| `getModuleBehavior` | 21 / 45 CRITICAL |
| `createModuleStateFromDescriptor` | 4 / 5 CRITICAL |
| `createStandScene` | 1 caller LOW; dosya 7803 LOC |
| `planContinuousWallLayout` | production insert/reflow |
| `resolveItemBom` | DEV UI + unit |
| `CATALOG_PREVIEW_RENDERERS[...]` | dinamik USED |

## DYNAMIC_USAGE

| Pattern | Not |
| --- | --- |
| `CATALOG_PREVIEW_RENDERERS[catalogPreview]` | whitelist; graph CALLS eksik olabilir |
| `createStandScene` return methods | main.js property call; zero-caller ≠ unused |
| `import.meta.env.DEV && ?rawBom` | production’da ölü, DEV’de live |

## KNIP FALSE-POSITIVE

`e2e/*.spec.mjs`, `playwright.config.mjs`, internal exports (`STAND_AXES`, `PROJECT_ARCHIVE_VERSION`, `validateImported*`).
