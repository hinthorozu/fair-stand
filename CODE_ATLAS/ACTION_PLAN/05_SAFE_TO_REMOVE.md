# 05 — SAFE_TO_REMOVE

**Adet: 0.**

Bu turda `PROVEN_UNUSED` ve bağsız silinebilir dosya/sembol/alan **yok**.

GitNexus sıfır caller, knip unused file/export, docs-only path tek başına yeterli değil.

## Neden liste boş

| Aday | Neden SAFE değil |
| --- | --- |
| `src/groundLayout.js` | Unit test + change-gate map |
| `src/cornerPlacement.js` | 2 test; 270° karşılaştırma |
| `src/featureContracts.js` | Canonical SoT kaydı + governance test |
| `src/moduleContracts.js` | 19 test + SoT tablosu |
| `getConnectorItemKey` | connectorBom.test.js |
| `STAND_AXES` | iç `includes` |
| `PROJECT_ARCHIVE_VERSION` / `validateImported*` | iç CALLS |
| `e2e/*.spec.mjs` / `playwright.config.mjs` | Playwright + CI |
| `CATALOG_PREVIEW_RENDERERS` | dinamik lookup USED |
| `composition.moduleType` / `options` | ITEMS + contract test |
| `scripts/*.py` | F-045 açık; elle zarar riski |
| `video-wall-build-trigger.txt` | `RELEASE_HARDENING_ROADMAP.md` listeler |
| patch `*.cjs` | Zaten silindi (MA-034) |
| src `getRecipeInnerCornerPanelKey` | Zaten silindi |

Şüpheli adaylar listeye alınmadı.
