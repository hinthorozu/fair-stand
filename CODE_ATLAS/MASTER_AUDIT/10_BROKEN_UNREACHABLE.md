# 10 — Broken / unreachable

| ID | Bulgu | Kanıt | Severity |
| --- | --- | --- | --- |
| B1 | Unresolved JS import | knip unresolved [] | yok |
| B2 | Circular import | GitNexus cycleCount 0 | yok |
| B3 | `src/tvConfig.js` | dosya yok; A02/TV current-system MD path | LOW stale doc |
| B4 | `createTvCatalogItem` | `src/` 0; eski patch script silindi | n/a |
| B5 | `sizeInch` src 0 | audit MD hâlâ catalog.sizeInch | LOW |
| B6 | `shelfCount` Item 0 | audit static.shelfCount | LOW |
| B7 | `getRecipeInnerCornerPanelKey` src | cleanup kaldırıldı; property audit MD hâlâ “src read” yazabilir | LOW stale doc |
| B8 | groundLayout sahneye bağlı değil | IMPORTS test-only | MEDIUM unreachable renderer |
| B9 | BOM production UI unreachable | DEV flag | MEDIUM ürün |
| B10 | Worker | 0 | INFO |
| B11 | Invalid fallback | expandRecipe köşe key yoksa no-op; geçersiz panel throw | kasıtlı |
| B12 | Change-contract vs Version2 | dal `main.js`/`scene3d.js` değiştirir; mevcut contract behavior/renderer `not-applicable` | MEDIUM gate (dal-seviye); bu audit source değiştirmedi |

Impossible branch: kanıtlanmadı (CFG/PDG indeks yok; `explain` pdg gerektirir).
