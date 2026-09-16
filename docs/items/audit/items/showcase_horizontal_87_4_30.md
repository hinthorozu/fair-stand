# showcase_horizontal_87_4_30

- **name:** Vitrin Yatay Sunta 87,4 × 30 cm
- **type:** `showcase-board`
- **registry map:** `LEAF_ITEMS`
- **kanonik bakış:** `src/items.js` `LEAF_ITEMS['showcase_horizontal_87_4_30']` + `getItem('showcase_horizontal_87_4_30')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `defaultColor` | 16777215 (`#ffffff`) | item kaydı |
| `dimensions.depthCm` | 30 | item kaydı |
| `dimensions.lengthCm` | 87.4 | item kaydı |
| `dimensions.thicknessCm` | 1.8 | item kaydı |
| `itemKey` | showcase_horizontal_87_4_30 | item kaydı |
| `material` | sunta | item kaydı |
| `name` | Vitrin Yatay Sunta 87,4 × 30 cm | item kaydı |
| `type` | showcase-board | item kaydı |
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

- factory fonksiyon: yok
- factory çıktısı yok: MODULE_STATE_FACTORIES içinde type yok: showcase-board

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `showcase_horizontal_87_4_30` | 1 | `adet` |

## 8. Bu item'ı kullanan parent'lar

### recipe child
- `{"parentKey":"wall_showcase_100_2","quantity":2,"recipeId":"showcase-2-100","variant":"straight"}`
- `{"parentKey":"wall_showcase_100_3","quantity":2,"recipeId":"showcase-3-100","variant":"straight"}`

### showcase bodyItems
- `{"parentKey":"wall_showcase_100_2","role":"horizontalItemKey","source":"bodyItems"}`
- `{"parentKey":"wall_showcase_100_3","role":"horizontalItemKey","source":"bodyItems"}`


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
4. Davranış: TYPE_BEHAVIORS[`showcase-board`] yok, DEFAULT_BEHAVIOR.
5. Kendi factory state'i yok; parent recipe/BOM veya zemin `stand.itemKey` üzerinden yaşar.

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/showcase_horizontal_87_4_30.md`
- src dosyaları (2): `src/items.js`, `src/moduleRecipes.js`
- unit/integration (5): `test/moduleRecipes.test.js`, `test/boardMaterialItemContract.test.js`, `test/wallShowcaseItemContract.test.js`, `test/showcaseRecipes.test.js`, `test/showcaseBodyBoardsItemContract.test.js`
- e2e (0): —
- docs (8): 8 dosya
- ui/other: —

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.
- Bu type için `createRenderableModule` dalı yok; leaf olarak sahneye çıkmaz.

