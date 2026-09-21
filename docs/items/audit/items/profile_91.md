# profile_91

- **name:** Profil 91 cm
- **type:** `profile`
- **registry map:** `LEAF_ITEMS`
- **kanonik bakış:** `src/items.js` `LEAF_ITEMS['profile_91']` + `getItem('profile_91')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `defaultColor` | 13685716 (`#d0d3d4`) | item kaydı |
| `dimensions.lengthCm` | 91 | item kaydı |
| `dimensions.thicknessCm` | 8 | item kaydı |
| `itemKey` | profile_91 | item kaydı |
| `material` | alüminyum | item kaydı |
| `name` | Profil 91 cm | item kaydı |
| `type` | profile | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Panel Ek Modül`

| catalog alan | değer |
|---|---|
| `depthCm` | 8 |
| `heightCm` | 8 |
| `itemKey` | profile_91 |
| `label` | Profil 91 cm |
| `type` | profile |
| `widthCm` | 100 |

## 3. Modül sözleşmesi

- profil: `free-editable`
- appearance.color: `editable`
- appearance.image: `editable`
- renderer.mode: `procedural`
- runtime.mode: `static`
- composition.mode (profil): `standalone`
- BOM mode: `self`
- BOM source: src/itemBom.js
- state.owner: `src/designState.js`
- persistence: `project-state`

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **var**

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | evet | TYPE_BEHAVIORS[type] + item descriptor override |
| `boundarySnap` | stand-edge | TYPE_BEHAVIORS[type] + item descriptor override |
| `collision` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | Item kolon (`docs/refactor/ROTATION.md`) |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | separator | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | wall | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
| `supportsWallOverlayMount` | evet | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
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

- factory fonksiyon: `createProfileModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "profile_91",
  "type": "profile",
  "widthCm": 100,
  "depthCm": 8,
  "heightCm": 350
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `profile_91` | 1 | `adet` |
- profil katalog genişliği (straight-wall recipe nominalWidthCm): **100** — `getStraightWallNominalWidthForProfileItem`

## 8. Bu item'ı kullanan parent'lar

### recipe child
- `{"parentKey":"door_100","quantity":1,"recipeId":"door-100","variant":"straight"}`
- `{"parentKey":"BASE_100","quantity":4,"recipeId":"base-100","variant":null}`
- `{"parentKey":"desk_banko_100","quantity":3,"recipeId":"counter-100","variant":null}`
- `{"parentKey":"desk_banko_100_L","quantity":5,"recipeId":"counter-l-100","variant":null}`
- `{"parentKey":"desk_banko_150_L","quantity":1,"recipeId":"counter-l-150","variant":null}`
- `{"parentKey":"wall_100","quantity":2,"recipeId":"wall-straight-100","variant":"straight"}`
- `{"parentKey":"wall_100_short_up_2","quantity":2,"recipeId":"wall-short-up-2-100","variant":"straight"}`
- `{"parentKey":"wall_100_short_up_1","quantity":2,"recipeId":"wall-short-up-1-100","variant":"straight"}`
- `{"parentKey":"wall_base_100","quantity":4,"recipeId":"base-wall-100","variant":"straight"}`
- `{"parentKey":"wall_separator_100","quantity":2,"recipeId":"separator-100","variant":"straight"}`
- `{"parentKey":"wall_separator_100_sarmasik","quantity":2,"recipeId":"separator-100","variant":"straight"}`
- `{"parentKey":"wall_shelf_2_100","quantity":2,"recipeId":"shelf-wall-100-2","variant":"straight"}`
- `{"parentKey":"wall_shelf_3_100","quantity":2,"recipeId":"shelf-wall-100-3","variant":"straight"}`
- `{"parentKey":"wall_showcase_100_2","quantity":4,"recipeId":"showcase-2-100","variant":"straight"}`
- `{"parentKey":"wall_showcase_100_3","quantity":4,"recipeId":"showcase-3-100","variant":"straight"}`


## 9. Renderer / UI / persistence

- renderer: `scene3d.js createProfileModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | resolveModuleContract().appearance.color=editable (free-editable) |
| `image` | evet | resolveModuleContract().appearance.image=editable |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=wall; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `free-editable` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`profile`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/profile_91.md`
- src dosyaları (4): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`, `src/moduleRecipes.js`
- unit/integration (21): `test/counterRecipes.test.js`, `test/baseWallRecipes.test.js`, `test/baseRecipes.test.js`, `test/baseItemsContract.test.js`, `test/wallShowcaseItemContract.test.js`, `test/wallShelfItemsContract.test.js`, `test/wallSeparatorItemsContract.test.js`, `test/wallFlatPanelItemsContract.test.js`, `test/wallBaseItemsContract.test.js`, `test/uprightFieldPlacement.test.js`, `test/showcaseRecipes.test.js`, `test/separatorRecipes.test.js`, `test/profilesItemContract.test.js`, `test/profileIntrinsicProperties.test.js`, `test/profileFieldPlacement.test.js`, `test/profile190ItemContract.test.js`, `test/moduleRecipes.test.js`, `test/lCounter150Contract.test.js`, `test/lCounter100Contract.test.js`, `test/doorCompositeItemContract.test.js`, `test/deskBankoItemsContract.test.js`
- e2e (0): —
- docs (20): 20 dosya
- ui/other: `fair-stand-base-family-migration-handoff.md`, `SYSTEM_MODULE_CATALOG.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

