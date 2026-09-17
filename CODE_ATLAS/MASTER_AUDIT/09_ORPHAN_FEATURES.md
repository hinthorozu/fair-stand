# 09 — Orphan features

Orphan = implementation var, production runtime entry yok.

| Feature | Implementation | Runtime entry | Sınıf |
| --- | --- | --- | --- |
| Ground grid layout | `createGroundLayout` | scene3d 0; HTML 0 | orphan renderer helper; TEST_ONLY |
| Feature contract registry | `FEATURE_CONTRACTS` | autoDepot/automaticWall okumaz | GOVERNANCE orphan-to-runtime |
| Module contract profiles | `resolveModuleContract` | 0 src import | GOVERNANCE; test hub |
| Adjacent corner placement | `resolveAdjacentPlacement` | insert/reflow başka dosya | TEST_ONLY planner |
| Connector BOM API | `resolveConnectorBom` | recipe items doğrudan itemKey | TEST_ONLY API |
| Kullanıcı BOM paneli | resolveItemBom + rawBomDebug | yalnız DEV `?rawBom` | DEV-only; production UX orphan |
| src inner-corner export | silindi | expandRecipe inline | n/a |
| shelfCount Item alanı | yok | — | docs orphan |
| sizeInch | yok | TV dimensions | docs orphan |
| tvConfig.js | docs | dosya yok | doc ghost |

UI var handler yok: DOM id’ler `main.js` querySelector ile bağlanır; bu taramada **kanıtlı kopuk button** yok (UNCERTAIN: her id taranmadı tek tek — `visibleUiContract.test.js` kısmi koruma).

Registry var consumer yok: FEATURE_CONTRACTS, MODULE_CONTRACT_ASSIGNMENTS (test consumer var).

Test var production path yok: groundLayout, cornerPlacement, connectorBom, moduleContracts, featureContracts, recipeView.variants.
