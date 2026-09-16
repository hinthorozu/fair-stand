# panel_197

- **name:** Panel 197 × 47 cm
- **type:** `panel`
- **registry map:** `LEAF_ITEMS`
- **kanonik bakış:** `src/items.js` `LEAF_ITEMS['panel_197']` + `getItem('panel_197')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.heightCm` | 47 | item kaydı |
| `dimensions.thicknessCm` | 0.8 | item kaydı |
| `dimensions.widthCm` | 197 | item kaydı |
| `itemKey` | panel_197 | item kaydı |
| `material` | sunta | item kaydı |
| `name` | Panel 197 × 47 cm | item kaydı |
| `nominalModuleWidthCm` | 200 | item kaydı |
| `panelRole` | straight | item kaydı |
| `type` | panel | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **yok** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **yok**
- grup: yok

## 3. Modül sözleşmesi

- **resolveModuleContract:** `null`
- **explicit assignment:** yok
- Neden: katalog dışı leaf/floor item; `resolveModuleContract` yalnız `MODULE_CATALOG` veya `NON_CATALOG_MODULE_CONTRACTS` anahtarını çözer (`src/moduleContracts.js` `resolveModuleContract`).

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **yok — DEFAULT_BEHAVIOR (WALL_BEHAVIOR) fallback**
- **Not:** `hasExplicitModuleBehavior` false. `getModuleBehavior` `DEFAULT_BEHAVIOR = WALL_BEHAVIOR` döner. Bu type sahneye modül olarak çıkmıyorsa davranış pratikte kullanılmaz; fallback yine de kodda vardır.

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | evet | DEFAULT_BEHAVIOR |
| `boundarySnap` | stand-edge | DEFAULT_BEHAVIOR |
| `collision` | segment | DEFAULT_BEHAVIOR |
| `collisionDepth` | physical | DEFAULT_BEHAVIOR |
| `collisionHeight` | full | DEFAULT_BEHAVIOR |
| `connectionEndpoint` | segment | DEFAULT_BEHAVIOR |
| `defaultRotationDeg` | 0 | DEFAULT_BEHAVIOR |
| `endpointContact` | standard | DEFAULT_BEHAVIOR |
| `ghost.kind` | silhouette | DEFAULT_BEHAVIOR |
| `ghost.opacity` | 0.38 | DEFAULT_BEHAVIOR |
| `ghost.renderer` | module-silhouette | DEFAULT_BEHAVIOR |
| `magneticSnap` | standard | DEFAULT_BEHAVIOR |
| `moveSnapCm` | 50 | DEFAULT_BEHAVIOR |
| `overlapWithTypes` | [] | DEFAULT_BEHAVIOR |
| `placement` | wall | DEFAULT_BEHAVIOR |
| `rotationStepDeg` | 90 | DEFAULT_BEHAVIOR |
| `sideInsertRotation` | inherit | DEFAULT_BEHAVIOR |
| `supportsWallOverlayMount` | evet | DEFAULT_BEHAVIOR |
| `wallCapacity` | include | DEFAULT_BEHAVIOR |
| collisionHeightRange | `{"minCm":0,"maxCm":47}` | `getModuleCollisionHeightRangeCm` |
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

- factory fonksiyon: yok
- factory çıktısı yok: MODULE_STATE_FACTORIES içinde type yok: panel

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `panel_197` | 1 | `adet` |

## 8. Bu item'ı kullanan parent'lar

### recipe child
- `{"parentKey":"BASE_200","quantity":2,"recipeId":"base-200","variant":null}`
- `{"parentKey":"desk_banko_200","quantity":2,"recipeId":"counter-200","variant":null}`
- `{"parentKey":"desk_banko_200_L","quantity":4,"recipeId":"counter-l-200","variant":null}`
- `{"parentKey":"wall_200","quantity":7,"recipeId":"wall-straight-200","variant":"straight"}`
- `{"parentKey":"wall_200_short_up_2","quantity":2,"recipeId":"wall-short-up-2-200","variant":"straight"}`
- `{"parentKey":"wall_200_short_up_1","quantity":1,"recipeId":"wall-short-up-1-200","variant":"straight"}`
- `{"parentKey":"wall_base_200","quantity":7,"recipeId":"base-wall-200","variant":"straight"}`
- `{"parentKey":"wall_shelf_2_200","quantity":7,"recipeId":"shelf-wall-200-2","variant":"straight"}`
- `{"parentKey":"wall_shelf_3_200","quantity":7,"recipeId":"shelf-wall-200-3","variant":"straight"}`


## 9. Renderer / UI / persistence

- renderer: createRenderableModule bu type için `null` döner (modül değil)
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
4. Davranış: TYPE_BEHAVIORS[`panel`] yok, DEFAULT_BEHAVIOR.
5. Kendi factory state'i yok; parent recipe/BOM veya zemin `stand.itemKey` üzerinden yaşar.

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/panel_197.md`
- src dosyaları (2): `src/items.js`, `src/moduleRecipes.js`
- unit/integration (13): `test/deskBankoItemsContract.test.js`, `test/panelCorner192ItemContract.test.js`, `test/panel197ItemContract.test.js`, `test/moduleRecipes.test.js`, `test/counterRecipes.test.js`, `test/lCounter200Contract.test.js`, `test/boardMaterialItemContract.test.js`, `test/baseWallRecipes.test.js`, `test/baseRecipes.test.js`, `test/baseItemsContract.test.js`, `test/wallShelfItemsContract.test.js`, `test/wallFlatPanelItemsContract.test.js`, `test/wallBaseItemsContract.test.js`
- e2e (0): —
- docs (17): 17 dosya
- ui/other: —

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.
- Bu type için `createRenderableModule` dalı yok; leaf olarak sahneye çıkmaz.

