# 12 — Hotspots

GitNexus `impact` (tests off unless noted). `risk` = edit gate. `createStandScene` risk LOW ≠ dosya riski düşük.

| Symbol / file | Fan-in (direct) | Process | Graph risk | Gerçek maliyet |
| --- | --- | --- | --- | --- |
| `getItem` | 60 | 79 | CRITICAL | Item hub; her akış |
| `getModuleBehavior` | 21 | 45 | CRITICAL | placement/drag |
| `createModuleStateFromDescriptor` | 4 | 5 | CRITICAL | state giriş; sharedAxes LOW |
| `createStandScene` | 1 | 7 (context) | LOW upstream | ~4700 satır façade; HIGH bakım |
| `src/items.js` | 88 file importers (önceki cypher) | GetItem terminal | — | 96 Item tek tablo |
| `src/main.js` | HTML | restore/drop/save | — | orkestrasyon |
| `src/modulePlacement.js` | 21 importers | snap/collision | HIGH | |
| `src/designState.js` | 45 importers | factories | HIGH | |
| `resolveItemKey` | yüksek CALLS | identity | HIGH | |
| `getCatalogItem` | yüksek CALLS | catalog | HIGH | |
| `openConfiguratorDb` | persist | RestoreProject | HIGH | |
| `resolveModuleContract` | 19 (tests on) | 0 | HIGH | **yalnız test** |
| `resolveItemBom` | 1 | 1 RenderItemBom | LOW | DEV |
| `createGroundLayout` | 1 test | 0 | LOW | TEST_ONLY |
| `resolveAdjacentPlacement` | 2 test | 0 | LOW | TEST_ONLY |
| `STAND_AXES` | 0 graph | 0 | UNKNOWN | iç kullanım |

Tek caller + yüksek iç sorumluluk: `createStandScene` (main.js), `createStandScene.buildWall`.

Regression yüzeyi: `ITEMS` satırı / `getModuleBehavior` / factories / scene3d mesh.

**Yorum:** impact process listesi `deleteImageAsset` gibi uzak walk’lar içerir (getItem terminal). Bu, Item değişikliğinin persist zincirini de kestiğini gösterir; her process “Item bug” demek değildir.
