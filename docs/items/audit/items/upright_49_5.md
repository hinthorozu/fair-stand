# upright_49_5

- **name:** Dikme 49,5 cm
- **type:** `upright`
- **registry map:** `LEAF_ITEMS`
- **kanonik bakış:** `src/items.js` `LEAF_ITEMS['upright_49_5']` + `getItem('upright_49_5')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `defaultColor` | 13685716 (`#d0d3d4`) | item kaydı |


| `itemKey` | upright_49_5 | item kaydı |
| `material` | alüminyum | item kaydı |
| `name` | Dikme 49,5 cm | item kaydı |
| `type` | upright | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.
| `dimensions.widthCm` | 8 | item kaydı |
| `dimensions.depthCm` | 8 | item kaydı |
| `dimensions.heightCm` | 49.5 | item kaydı |
## 2. Katalog

- MODULE_CATALOG kaydı: **yok** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **yok**
- grup: yok

## 3. Modül sözleşmesi

- **resolveModuleContract:** `null`
- **explicit assignment:** yok
- Neden: katalog dışı leaf/floor item; `resolveModuleContract` yalnız `MODULE_CATALOG` veya `NON_CATALOG_MODULE_CONTRACTS` anahtarını çözer (`src/moduleContracts.js` `resolveModuleContract`).

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **var**

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `boundarySnap` | stand-edge | TYPE_BEHAVIORS[type] + item descriptor override |
| `collision` | footprint | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | Item kolon (`docs/refactor/ROTATION.md`) |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | short-up-joint | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | flat-panel, profile, counter | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | exclude | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":350}` | `getModuleCollisionHeightRangeCm` |
| stripOccupancy resolved | `null` | `resolveModuleStripOccupancy` |

## 5. Yüzey yetenekleri (`getItemSurfaceCapabilities`)

| bayrak | değer |
|---|---|
| `color` | false |
| `image` | false |
| `glass` | false |
| `lightbox` | false |
| `mesh` | false |

- Type `door-leaf` dışında tablo `NO_SURFACE_CAPABILITIES` (hepsi false). Parent duvar renk/görsel yetkisi `itemCapabilities` değil, `moduleContracts.appearance` + `scene3d` `selectionMode`/`accepts*` üzerinden gider.

## 6. Factory / runtime state

- factory fonksiyon: `createUprightModuleState`
- factory çıktısı yok: createUprightModuleState() sabit getItem('upright_346_5') kullanır; upright_49_5 üretilmez.

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `upright_49_5` | 1 | `adet` |

## 8. Bu item'ı kullanan parent'lar

### recipe child
- `{"parentKey":"BASE_100","quantity":4,"recipeId":"base-100","variant":null}`
- `{"parentKey":"BASE_150","quantity":4,"recipeId":"base-150","variant":null}`
- `{"parentKey":"BASE_200","quantity":4,"recipeId":"base-200","variant":null}`
- `{"parentKey":"wall_200_short_up_1","quantity":2,"recipeId":"wall-short-up-1-200","variant":"straight"}`
- `{"parentKey":"wall_150_short_up_1","quantity":2,"recipeId":"wall-short-up-1-150","variant":"straight"}`
- `{"parentKey":"wall_100_short_up_1","quantity":2,"recipeId":"wall-short-up-1-100","variant":"straight"}`
- `{"parentKey":"wall_50_short_up_1","quantity":2,"recipeId":"wall-short-up-1-50","variant":"straight"}`
- `{"parentKey":"wall_base_100","quantity":2,"recipeId":"base-wall-100","variant":"straight"}`
- `{"parentKey":"wall_base_150","quantity":2,"recipeId":"base-wall-150","variant":"straight"}`
- `{"parentKey":"wall_base_200","quantity":2,"recipeId":"base-wall-200","variant":"straight"}`


## 9. Renderer / UI / persistence

- renderer: `scene3d.js createUprightModule`
- sidebar kartı: yok
- persistence yolu: doğrudan persist yok (parent BOM/recipe içinde)
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | hayır | kanonik kayıt alanı; runtime yüzey yok veya appearance.color=fixed/none |
| `image` | hayır | kanonik kayıt alanı; runtime image yok veya appearance.image=none |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | hayır | katalog/modül state yok |
| `rotation` | hayır | modül davranışı yok veya yerleştirilemez |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor yok.
3. Sözleşme yok.
4. Davranış: TYPE_BEHAVIORS[`upright`] var.
5. Kendi factory state'i yok; parent recipe/BOM veya zemin `stand.itemKey` üzerinden yaşar.

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/upright_49_5.md`
- src dosyaları (2): `src/items.js`, `src/moduleRecipes.js`
- unit/integration (9): `test/moduleRecipes.test.js`, `test/baseWallRecipes.test.js`, `test/upright3465ItemContract.test.js`, `test/baseRecipes.test.js`, `test/baseItemsContract.test.js`, `test/uprightIntrinsicProperties.test.js`, `test/upright99And495ItemContract.test.js`, `test/wallFlatPanelItemsContract.test.js`, `test/wallBaseItemsContract.test.js`
- e2e (0): —
- docs (9): 9 dosya
- ui/other: `fair-stand-base-family-migration-handoff.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.
- Katalogda yok; `createUprightModuleState` bu itemKey'i üretmez.

