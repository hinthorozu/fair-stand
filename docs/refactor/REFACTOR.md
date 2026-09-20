# Fair Stand — Item mimarisi refactor günlüğü

Bu dosya Item mimarisine geçişin tek merkezi değişiklik kaydıdır. Audit dökümü değildir; yalnız gerçekten uygulanan adımlar ve o adımdan sonra geçerli kurallar yazılır.

- Item modeli: `docs/refactor/ITEMS.md`
- Katalog mekanizması: `docs/refactor/CATALOG.md`

---

## 2026-09-20 — Legacy inner-corner + nominalModuleWidthCm kaldırıldı

`nominalModuleWidthCm` / `nominal_module_width_cm` runtime, seed, API ve DB kolonundan silindi. `composition.innerCorner`, `panelVariant: 'inner-corner'` ve inner-corner replacement tabloları kaldırıldı. `expandRecipe` yalnız `composition.items` döner. Eski bootstrap payload’da bu alanlar görülürse registry onları düşürür; BOM değişmez.

Korunan: 96 `itemKey`, `panel_corner_*` Item kayıtları, `panelRole`, fiziksel `dimensions` / `sceneDimensions`, normal `wall_200` → `panel_197` × 7. Yeni köşe-duyarlı BOM eklenmedi.

---

## 2026-09-17 — Kapı kanadı width helper kalktı

### Kapsam

`DOOR_LEAF_ITEM_KEYS_BY_MODULE_WIDTH` ve `getDoorLeafItem` silindi. Factory ve `normalizeModuleItemState` kapı kanadını `getItem('door_leaf_100')` ile çözer. Tek kapı `door_100`; 100 dışı `createDoorModuleState` zaten `null`. `surface.itemKey` aynı `door_leaf_100`.

Dokunulmayan: `door_100` / `door_leaf_100` satırları, BOM miktarları, persist schema, renderer `getItem(surface.itemKey)`.

---

## 2026-09-20 — İç-köşe expand ölçü kullanmaz

`expandRecipe` inner-corner’da `nominalModuleWidthCm` okumaz. Inner yoksa (`composition.innerCorner` / `panelItemKey` yok) düz reçete döner, throw yok. Inner varsa reçetedeki tek `panelRole=straight` satırı `innerCorner.panelItemKey` ile değişir; ek satırlar `itemReplacements`.

Dokunulmayan: `composition.items` miktarları, `innerCorner.panelItemKey` değerleri, Item kaydındaki `nominalModuleWidthCm` alanı.

---

## 2026-09-17 — Düz child listesi ve iç-köşe Item’da

### Kapsam

Düz BOM child listesi ve iç-köşe verisi tek kaynak `src/items.js`. `moduleRecipes.js` ikinci ürün tablosu değil; yalnız `expandRecipe` / panelRole eşlemesi kalır. `itemBom` `getItem(parent).composition.items` zorunlu; `catalogRecipe.items` fallback yok.

28 recipe parent `composition.items` (miktar değişmedi). İç-köşe `composition.innerCorner` (recipe.variants birebir): düz wall 50/100/150/200, short-up-1/2 aynı genişlikte aynı köşe paneli, `door_100` / `wall_showcase_100_2` / `wall_showcase_100_3` (`panel_corner_92` + `itemReplacements`). BASE, desk_banko, separator: innerCorner yok.

Raw BOM debug kapı dışındaki type+width yolları `resolveItemBom(itemKey)`. Furniture kümeleri BOM’a açılmaz. `getStraightWallNominalWidthForProfileItem` silindi (src caller yoktu).

Dokunulmayan: Catalog projection, factory/UI, persist `itemKey`, 28 düz listedeki quantity’ler, `composition.mode` / `moduleType` sadeleştirme, VIDEO_WALL, shelf/base-wall recipe (zaten null).

---

## 2026-09-17 — Recipe parent `composition.items`

### Kapsam

28 `composition.mode === 'recipe'` parent, `furniture_sofa_set_classic` gibi `composition.items` taşır. Satırlar mevcut `moduleRecipes` child listesinin kopyasıdır; miktar uydurulmadı. `itemBom` tabanı Item `items`; `expandRecipe` iç-köşe panel/connector varyantını uygular.

Dokunulmayan: 96 `itemKey`, Catalog projection, factory/UI, inner-corner kuralları, `moduleRecipes.js` sahipliği (nominal genişlik / varyant).

---

## 2026-09-17 — Kovalar boşaldı; satırlar ITEMS içinde

### Kapsam

`LEAF_ITEMS` … `COMPOSITE_ITEMS` yok. 96 satır `export const ITEMS` bloğunda. `getItem` / `listFloorItems` / type helper’lar `ITEMS` okur.

Dokunulmayan: 96 Item satırı, Catalog projection, recipe/BOM miktarları, factory/UI davranışı.

---

## 2026-09-17 — Tek ITEMS registry

### Kapsam

Dokuz kova (`LEAF_ITEMS` … `COMPOSITE_ITEMS`) public export değil. Tek tablo `ITEMS`. `getItem` / `listRegisteredItems` bu tablodan okur. `listLeafItems` / `listCompositeItems` kalktı. Testler `getItem` / `listRegisteredItems` / `EXPECTED` key listeleri.

Dokunulmayan: 96 Item satırı, Catalog projection, recipe/BOM miktarları, factory/UI davranışı.

---

## 2026-09-17 — ITEMS.md runtime field kuyruğu

### Kapsam

`docs/refactor/ITEMS.md` en üstüne `src/items.js` 96 satır taraması kondu. Tablo onaylı şema değil; alanlar zamanla ayrı kararla şemaya alınacak. Item satırları ve runtime kod değişmedi.

Dokunulmayan: `src/items.js`, Catalog, recipe/BOM, factory.

---

## 2026-09-17 — Catalog kartı ince projection

### Kapsam

`getCatalogItem` / `listCatalogItems` yalnız `{ itemKey, label, catalogPreview }` döner. Factory DTO Catalog’da yoktur. `createModuleStateFromDescriptor` Item’ı `resolveItemKey` + `getItem` ile çözer; sahne ölçüleri `resolveSceneDimensions`. Catalog preview silüeti `moduleDragSidebar.js` içinde Item’dan hydrate edilir.

Dokunulmayan: `CATALOG_CATEGORIES`, `CATALOG_PREVIEWS` allowlist, 58 üye ve kategori sırası, Item satırları, recipe/BOM, `STAND_DIMENSIONS` / `MODULE_WIDTHS_CM`.

---

## 2026-09-17 — MODULE_CATALOG snapshot export kalktı

### Kapsam

`MODULE_CATALOG` / `MODULE_CATALOG_KEYS` / `MODULE_CATALOG_GROUPS` `src/catalog.js` export değil. Testler `getCatalogItem` / `listCatalogItems` / `listCatalogGroups`. Kart içeriği, 58 üye ve kategori sırası değişmedi.

Dokunulmayan: Catalog projection gövdesi, `getModuleCatalogItem` / `getModuleCatalogLabel`, Item satırları, recipe/BOM, UI.

---

## 2026-09-17 — MODULE_WIDTHS_CM catalog.js’ten çıktı

### Kapsam

Düz duvar compose genişlikleri `src/standDimensions.js` `MODULE_WIDTHS_CM`. `STAND_DIMENSIONS` objesine gömülmedi. Caller: `wall.js` `composeStraightWall`, `standStandardsCopy.js`. `src/catalog.js` export etmez.

Değerler aynı: `[50, 100, 150, 200]` (cm).

Dokunulmayan: Catalog projection API, `STAND_DIMENSIONS` değerleri, Item satırları, recipe/BOM, `validateWallLength` hardcoded 50, `designState` persist alanları.

---

## 2026-09-17 — resolveItemKey Catalog re-export kalktı

### Kapsam

`resolveItemKey` yalnız `src/items.js`. `src/catalog.js` `export { resolveItemKey }` yok. `designState.js` / `main.js` ve testler `items.js`’ten okur. Fonksiyon gövdesi değişmedi.

Dokunulmayan: Catalog projection, `MODULE_WIDTHS_CM`, `STAND_DIMENSIONS`, Item satırları, recipe/BOM, `designState` persist alanları.

---

## 2026-09-17 — STAND_DIMENSIONS catalog.js’ten çıktı

### Kapsam

Stand zarfı sabiti `src/standDimensions.js`. Caller’lar oradan okur. `src/catalog.js` `STAND_DIMENSIONS` export etmez.

Değerler aynı: height 3.5, depth 0.1, stripCount 7, stripHeight 0.5, frameWidth 0.055, frameDepth 0.1 (metre).

Dokunulmayan: Catalog projection API, `MODULE_WIDTHS_CM`, Item satırları, `designState` `STRIP_COUNT = 7`.

---

## 2026-09-17 — catalog.js ölü ölçü alias’ları

### Kapsam

`src/catalog.js` içindeki Item ölçü kopyaları ve çağrılmayan `flatPanelKey` silindi. Catalog projection API değişmedi.

Dokunulmayan: `CATALOG_CATEGORIES`, `CATALOG_PREVIEWS`, `getCatalogItem` / `listCatalogItems` / `listCatalogGroups`, `MODULE_CATALOG*`, `STAND_DIMENSIONS`, `MODULE_WIDTHS_CM`, `resolveItemKey` re-export, Item satırları, recipe/BOM, UI.

### Silinen

- `COUNTER_DIMENSIONS`, furniture `*_DIMENSIONS`, `MINI_FRIDGE_DIMENSIONS`, `COAT_RACK_DIMENSIONS`, `PLASTIC_TRASH_BIN_DIMENSIONS`, `TV_42_DIMENSIONS`, `flatPanelKey`, `getFurnitureClusterQuantity` catalog import
- `BASE_DIMENSIONS`, `LED_FLOODLIGHT_DIMENSIONS`, `SHELF_DIMENSIONS` (testler `getItem`)

### Düzeltme

2026-09-16 kaydı `createShelfModule` için `SHELF_DIMENSIONS.heightsByCountCm[2]` yazıyordu; renderer Item `dimensions` okur. Export yok.

Sözleşme: `docs/refactor/CATALOG.md` — `src/catalog.js` dosya sınırı.

---

## 2026-09-17 — leaf shelf Catalog + panel-seam overlay

### Kapsam

Mevcut leaf Item `shelf_100` / `shelf_150` / `shelf_200` Catalog’da `shelf-showcase` (Raf & Vitrin) altında görünür. Sahnede tek fiziksel raf tahtasıdır. Duvar/panel overlay attachment; Z snap panel internal seam.

Geri getirilmeyen: `wall_shelf_*` composite Item, yeni wall_shelf parent, `SHELF_WIDTH_TO_ITEM_KEY`, `lengthCm→widthCm` cross-field fallback.

Dokunulmayan: `wall_showcase_100_2` / `wall_showcase_100_3`, `glass_shelf`, vitrin recipe/BOM, shelf lighting mekanizması (korundu).

### Davranış

- `sceneDimensions.widthCm` 100/150/200; `heightCm=1.8`; `depthCm` fiziksel 38
- `MODULE_STATE_FACTORIES.shelf` exact `itemKey`
- `TYPE_BEHAVIORS.shelf`: `wall-overlay`, `wallCapacity: exclude`, `overlaySnap: panel-seam`
- Geçerli seam: `getStandInternalSeamHeightsCm()` = strip index 1..stripCount-1 (50..300). 0 ve 350 yok.
- Raf alt yüzeyi seam’de; overlay merkez = seam + thickness/2
- Identity: exact `itemKey` → `getItem`; type/width/shelfCount tahmini yok
- Yatay: wall-overlay pointer placement; raf sığdığı wall/panel support span içinde kalır (`shelf.widthCm <= host.widthCm`); host başlangıcına zorlanmaz
- Drop yalnız geçerli seam’de

### Sayılar

kayıtlı Item 96; catalogVisible=true 58; gizli 38 (`VIDEO_WALL_PANEL` dahil); projection 58; COMPOSITE_ITEMS 28; BOM recipe 28; self BOM 12; shelf-showcase 5.

---

## 2026-09-16 — wall_base composite Item kaldırıldı

### Kapsam

Silinen Item: `wall_base_100`, `wall_base_150`, `wall_base_200` (Panel Bazalı 100 / 150 / 200).

Dokunulmayan: `BASE_100` / `BASE_150` / `BASE_200`, leaf `base_top_107_50` / `base_top_157_50` / `base_top_206_50`, `profile_*` / `upright_*` / `panel_*` / `connector_*`, shelf tarafı, genel `base-wall` type/renderer/preview.

### Dead code (yalnız bu 3 Item’a hizmet ediyordu)

- `WALL_BASE_WIDTH_TO_ITEM_KEY`, `resolveBaseWallItemKey`, `createBaseWallModuleState`, `MODULE_STATE_FACTORIES['base-wall']`, `normalizeModuleItemState` type `base-wall` dalı
- `base-wall:100` / `base-wall:150` / `base-wall:200` recipe
- üç `MODULE_CONTRACT_ASSIGNMENTS` kaydı
- `rawBomDebug` Panel Bazalı recipe dalı

### Kalan base-wall mekanizması

- `TYPE_BEHAVIORS['base-wall']`
- `createBaseWallModule` renderer + `scene3d` type dispatch
- `CATALOG_PREVIEWS` / `CATALOG_PREVIEW_RENDERERS['base-wall']` / CSS `.module-drag-base-wall`
- `selectionFeedback` type `base-wall` metni
- `usesWallBackboneCollisionDepth` (type-level)

### Sayılar

kayıtlı Item 96; catalogVisible=true 55; gizli 41 (`VIDEO_WALL_PANEL` dahil); projection 55; COMPOSITE_ITEMS 28; BOM recipe 28; panel-wall 9.

### Tarihsel audit

`docs/items/audit/**` ve `docs/items/current-system/wall_base_*.md` regenerate edilmedi.

---

## 2026-09-16 — wall_shelf composite Item ve shelfCount kaldırıldı

### Kapsam

Silinen Item: `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`.

Silinen alan: `shelfCount` (Item, composition.options, Catalog projection, identity, factory, recipe, renderer userData). Yerine yeni field veya duplicate metadata yazılmadı. Yeni wall_shelf Item üretilmedi.

Dokunulmayan: leaf `shelf_100` / `shelf_150` / `shelf_200`, `wall_showcase_*`, `eyeCount`, `stripOccupancy`, `nominalModuleWidthCm`, `composition.moduleType` alanı, `Recipe.nominalWidthCm`, `sceneDimensions`/`dimensions` şeması.

### Dead code (yalnız bu 6 Item’a hizmet ediyordu)

- `isWallShelfCompositeItem`, `resolveShelfItemKey`, `createShelfModuleState`, `MODULE_STATE_FACTORIES.shelf`, `normalizeModuleItemState` shelf dalı
- altı `shelf:{width}:{count}` recipe + `getModuleRecipe` shelf dalı
- `rawBomDebug` “N raflı” recipe dalı

### Kalan shelf mekanizması

- leaf `shelf_*` + `getItem(itemKey)`
- `createShelfModule` renderer (Item `dimensions`; `SHELF_DIMENSIONS` yok)
- `TYPE_BEHAVIORS.shelf`
- `CATALOG_PREVIEW_RENDERERS.shelf` (catalogPreview `'shelf'` artık görünür Item’da yok)
- context-menu `toggle-shelf-light` / `shelfLightingOn`

### Sayılar

kayıtlı Item 99; catalogVisible=true 58; gizli 41 (`VIDEO_WALL_PANEL` dahil); projection 58; COMPOSITE_ITEMS 31; BOM recipe 31; shelf-showcase 2.

### Tarihsel audit

`docs/items/audit/**` ve `docs/items/current-system/wall_shelf_*.md` regenerate edilmedi.

---

## 2026-09-16 — Tekrarlayan özel ölçü alanlarının canonical dimensions’a indirgenmesi

### Kaldırılan Item alanları

| Eski alan | Yeni kaynak |
|---|---|
| `dimensions.screenWidthCm` | `dimensions.widthCm` |
| `dimensions.screenHeightCm` | `dimensions.heightCm` |
| `dimensions.catalogHeightCm` | Catalog/runtime `resolveSceneDimensions(item).heightCm`; yeni field yok. TV kart CSS (`module-drag-tv`) değişmedi |
| `dimensions.tableDiameterCm` | `dimensions.widthCm` |
| `videoWall.panelScreenWidthCm` | `VIDEO_WALL_PANEL.dimensions.widthCm` |
| `videoWall.panelScreenHeightCm` | `VIDEO_WALL_PANEL.dimensions.heightCm` |
| `sizeInch` | kimlik `itemKey` (`TV_42` / `TV_55` / `TV_65`); görünen ad `TV 42"` / `TV 55"` / `TV 65"` |
| `composition.nominalWidthCm` | `item.dimensions.widthCm` (`itemBom.resolveRecipe` recipe lookup) |

### Yeni Item

`VIDEO_WALL_PANEL` — `catalogVisible: false`, `name: Video Wall Panel`, `dimensions.widthCm: 108.5`, `dimensions.heightCm: 61`. `depthCm` mevcut kaynakta yok; yazılmadı. `VIDEO_WALL_2X2` / `VIDEO_WALL_3X3` `videoWall.panelItemKey: 'VIDEO_WALL_PANEL'` ile paneli okur. `rows` / `cols` kaldı.

### Dokunulmayanlar

`mountHeightCm`, `wallGapCm`, `nominalModuleWidthCm`, `composition.moduleType`, `Recipe.nominalWidthCm`, `videoWall.rows` / `videoWall.cols`, `sceneDimensions` şeması.

### Doğrulama

- kayıtlı Item 105; catalogVisible=true 64; gizli 41 (`VIDEO_WALL_PANEL` dahil)
- `test/canonicalDimensionDedup.test.js` src runtime eski field yasakları + `wall_200` BOM `dimensions.widthCm`
- `npm test`: 776 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`canonical-dimension-dedup`)
- targeted E2E: `e2e/wall-media-items-contract.spec.mjs`, `e2e/furniture-items-contract.spec.mjs`, `e2e/smoke.spec.mjs`, `e2e/wall-flat-panel-items-contract.spec.mjs` — 22 passed

---

## 2026-09-16 — Item physical dimensions ve sceneDimensions override ayrımı

### Neden yapıldı

Item ölçüleri dağınıktı. Profil sahne genişliği Recipe `nominalWidthCm` ve `catalogWidthCm` üzerinden okunuyordu. Dikme oturumu thickness→width/depth, length→height çapraz remap ile üretiliyordu. Catalog kendi footprint’ini bar-stock kuralıyla yazıyordu.

### Yeni kural

Her Item kendi ölçü bilgisinin canonical kaynağıdır. İki katman, aynı field seti:

```text
dimensions        = gerçek/fiziksel ürün ölçüleri
sceneDimensions   = scene/runtime override

canonical fields: widthCm, depthCm, heightCm, lengthCm, thicknessCm

effective scene field:
  sceneDimensions.field ?? dimensions.field ?? MISSING
```

Aynı field adı yoksa fallback yoktur. `lengthCm` width olmaz. `thicknessCm` depth olmaz.

### Kaldırılan kaynaklar

- `catalogWidthCm` (dört profil Item’ından silindi)
- `createProfileModuleState` / `normalizeModuleItemState` / `createProfileModule` → `getStraightWallNominalWidthForProfileItem`
- Catalog `assignCatalogFootprint` bar-stock remap ve `catalogWidthCm`
- `getItemIdentityFields` `catalogWidthCm` ve thickness/length remap

### Yazılan sceneDimensions (mevcut runtime davranışına göre)

- dört profil: `{ widthCm: 50|100|150|200, depthCm: 8, heightCm: 350 }`
- `upright_346_5`: `{ widthCm: 8, depthCm: 8, heightCm: 346.5 }` — renderer 10×10×350 görsel zarfı ayrı kavramdır
- tam boy wall/separator/shelf/showcase/door: `{ depthCm: 10, heightCm: 350 }` (width physical’dan)
- short_up: `{ depthCm: 10 }` — height occupancy’dedir, 350 yazılmaz
- TV: `{ heightCm: screenHeightCm }`; video wall: `{ widthCm, heightCm }` panel × ızgara
- `wall_base_*` physical  width×50×350 ile aynı; sceneDimensions yazılmadı

### Canonical method

`resolveSceneDimensions(item)` — consumer’lar ayrı fallback yazmaz.

### Bilinçli sınırlar / LEGACY

- Özel physical alanlar (`screenWidthCm`, `catalogHeightCm`, `mountHeightCm`, `tableDiameterCm`, `wallGapCm`) bu turda 5 alana zorla taşınmadı
- TV Catalog kart yüksekliği UI-only `catalogHeightCm=350` (media metrics); runtime scene height ekrandır
- Ghost numeric-width yolu ve Item scene height MISSING (short_up occupancy) STAND zarfına düşebilir — Item-specific SOT değildir
- `MODULE_COLLISION_DEPTH_CM` wall_base omurga ve genel stand standardı olarak kalır
- 6 Item physical dimensions eksik: `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `shelf_leg`, `hali` — tahmin yazılmadı

### Doğrulama

- kayıtlı Item 104; catalogVisible=true 64; projection 64
- physical `dimensions` 98; `sceneDimensions` 35; MISSING_PHYSICAL 6
- `test/itemSceneDimensions.test.js` same-field / cross-remap / catalogWidthCm / Recipe yasakları
- targeted dimension + catalog + profile/upright/shelf contract testleri: geçti
- `npm test`: 775 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-item-projection`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

Rotation / color / image / lighting / delete / global `type` kaldırma / SQLite / BOM composition redesign / Catalog preview redesign / renderer architecture bu turda yok.

---

## 2026-09-16 — Catalog preview seçiminin type’tan Item config’e taşınması

### Eski yapı

`createModuleCatalogPreview()` Catalog kart silüetini `module.type` zinciriyle seçiyordu:

- `if (module.type === 'shelf' | sofa-set-classic | sofa-single-classic | sofa-double-classic | coffee-table-classic | table-chair-set-eames | chair | table-glass | bar-stool | mini-fridge | coat-rack | plastic-trash-bin | indoor-plant-1 | kettle | tv | led-floodlight | upright | profile | base-wall | base | counter | separator | door | showcase-2 | showcase-3)`
- `indoor-plant-1` + `modelFile` regex → long planter
- `separator` + `modelFile` → vine CSS
- `tv` + `videoWallRows/Cols` → video-wall CSS
- `showcase-2` / `showcase-3` → `dataset.eyes`
- eşleşmeyen her şey → flat-panel (sessiz type fallback)

Catalog UI “type neymiş?” diye kart tipi, ikon ve CSS kararı veriyordu.

### Yeni yapı

64 görünür Item’a `catalogPreview` yazıldı. Renderer map:

```text
CATALOG_PREVIEW_RENDERERS[item.catalogPreview]
```

Item kendi Catalog görünümünü tarif eder. Catalog yalnız okur ve gösterir.

Güncellenen Item: **64 / 64** görünür. Gizli 40 Item’da `catalogPreview` alanı yok.

Dağılım: `flat-panel` 12, `counter` 6, `shelf` 6, `profile` 4, `tv` 3, `base` 3, `base-wall` 3, `long-planter` 3, `video-wall` 2, `separator` 2, `separator-vine` 2, `showcase` 2; kalan 16 key tek Item (`upright`, `door`, `kettle`, `coat-rack`, `mini-fridge`, `plastic-trash-bin`, `sofa-set`, `sofa-single`, `sofa-double`, `coffee-table`, `table-chair-set`, `chair`, `glass-table`, `bar-stool`, `indoor-plant`, `floodlight`).

### Kaldırılan fallback

- `type` → preview
- `type` → CSS class
- `itemKey` hardcode preview map
- registry group → preview
- görünür Item’da eksik `catalogPreview` için sessiz type fallback

`catalogVisible === true` ve `catalogPreview` yok/bilinmiyor → `getCatalogItem` / `listCatalogItems` fail-fast.

Projection `type` alanı `createModuleStateFromDescriptor` factory uyumu için durur; Catalog UI preview seçiminde kullanılmaz. Global `type` kaldırılmaz.

### Doğrulama

- kayıtlı Item 104; catalogVisible=true 64; projection 64
- 64/64 `catalogPreview` mevcut; gizli 40’ta alan yok
- `test/catalogPreviewConfig.test.js`: type branch yok; 64 kök CSS sınıf regression
- catalogItemProjection / catalogDomainBoundary / itemCatalogFields korundu
- targeted catalog + ilgili preview contract testleri: geçti
- `npm test`: 753 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-item-projection`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti
- GitHub CI `verify` (`b8ff36b`): geçti

### Sonraki adım

Rotation / color / image / lighting / delete / collision / placement / Item Contract mimari refactor / Recipe-BOM refactor / global `type` kaldırma / SQLite bu turda yok.

---

## 2026-09-16 — Catalog domain sınırının runtime mekanizmalarından ayrılması

### Neden yapıldı

Catalog, Item runtime repository’si haline gelmişti. AutoDepot ölçüleri `getCatalogItem` + `catalogVisible` üzerinden okunuyordu. ModuleContracts Item varlığını Catalog projection’a bağlıyordu. Catalog profil kart genişliğini Recipe’den öğreniyordu.

### Kaldırılan bağımlılıklar

- AutoDepot → Catalog: `getCatalogItem` / `MODULE_CATALOG` / `catalogVisible` kaldırıldı
- ModuleContracts → Catalog: `getCatalogItem` kaldırıldı; string `itemKey` `getItem` ile doğrulanır
- Catalog → Recipe: `getStraightWallNominalWidthForProfileItem` kaldırıldı

### Yeni veri kaynakları

- AutoDepot: `getItem('MINI_FRIDGE_AVANTI' | 'COAT_RACK' | 'KETTLE' | 'PLASTIC_TRASH_BIN')` → `item.dimensions.widthCm/depthCm/heightCm`
- ModuleContracts: `getItem(itemKey)` Item master varlığı; descriptor gelirse `resolveItemKey` (Item identity, Catalog üyeliği değil)
- `resolveItemKey` Catalog’dan `src/items.js` Item-domain helper’ına taşındı. `catalogVisible` kontrolü identity çözümlemesine girmez. Catalog re-export yoktur.

### Yeni Item alanı

`catalogWidthCm` — yalnız dört profil Item’ında:

- `profile_41_5` → 50
- `profile_91` → 100
- `profile_140_5` → 150
- `profile_190` → 200

Fiziksel `dimensions.lengthCm` değildir. Katalog kartı / serbest profil oturum genişliğidir. Recipe’den türetilmez.

### Dependency yönü

```text
Item → Catalog
Item → AutoDepot
Item → ModuleContract
Item → Recipe/BOM
```

Yasak: AutoDepot → Catalog, ModuleContract → Catalog, BOM → Catalog, Recipe → Catalog, Catalog → Recipe.

### Doğrulama

- kayıtlı Item 104; catalogVisible=true 64; projection 64
- hardcoded katalog Item key listesi: 0
- 64/64 catalog descriptor regression korundu
- `catalogVisible=false` ≠ Item runtime’da yok
- AutoDepot includeContents konum/ölçü regression’ı birebir
- architecture boundary: `test/catalogDomainBoundary.test.js`
- targeted: catalogItemProjection / catalogCategories / itemCatalogFields / catalogSingleSource / catalogDomainBoundary / autoDepotOrientation / tests/autoDepot — geçti
- `npm test`: 749 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-item-projection`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti
- GitHub CI `verify` (`efec8e1`): geçti

### Sonraki adım

Rotation / color / image / lighting / delete / collision / placement / Item Contract mimari refactor / Recipe-BOM refactor / registry temizliği / SQLite bu turda yok.

---

## 2026-09-16 — MODULE_CATALOG Item tekrarının kaldırılması

### Eski yapı

64 katalog kartı `src/catalog.js` içinde `MODULE_CATALOG` hardcoded key listesi + `create*CatalogItem` builder’ları ile ikinci kez tanımlanıyordu. Item kaydı varken kart descriptor’ı ayrı tutuluyordu.

### Kaldırılan duplicate kaynak

- `MODULE_CATALOG = { wall_200: createFlatPanelCatalogItem('wall_200'), ... }` literal 64 key
- `createFlatPanelCatalogItem`, `createUprightCatalogItem`, `createProfileCatalogItem`, `createShelfCatalogItem`, `createCounterCatalogItem`, `createBaseCatalogItem`, `createBaseWallCatalogItem`, `createSeparatorCatalogItem`, `createWallMediaCatalogItem`, `createTopLightCatalogItem`, `createCommercialCatalogItem`, `createIndoorPlantCatalogItem`, `createFurnitureCatalogItem`

### Yeni canonical method

- `getCatalogItem(itemKey)` — `catalogVisible=true` Item’dan catalog descriptor
- `listCatalogItems()` — görünür Item’lar, kategori `catalogIndex` + `catalogItemIndex` sırası
- `listCatalogGroups()` aynı üyelik alanlarını okur; UI `getCatalogItem` ile kart üretir

### Item’a taşınan gerçek alanlar

Yok. Descriptor alanları zaten Item’da duruyordu (`name`, `dimensions`, `modelFile`, `eyeCount`, `sizeInch`, `videoWall`, `stripOccupancy`, `shape`, `shelfCount`, `variant`, rotation metadata). Projection alias’ı Item’a kopyalanmadı (`label` = `name`; kök `widthCm` = `dimensions.widthCm` veya türetilmiş oturum).

Profil kart `widthCm` Item’da yoktur; düz duvar reçetesi `nominalWidthCm` türevidir. Dikme `thicknessCm`/`lengthCm` → kare oturum. TV/video-wall `resolveWallMediaMetrics` türevidir.

### Compatibility export

`MODULE_CATALOG` / `MODULE_CATALOG_KEYS` / `MODULE_CATALOG_GROUPS` kaldı; hardcoded liste değildir, `listCatalogItems` / `listCatalogGroups` türevidir. Mevcut testler bu export’u okumaya devam eder.

### Doğrulama

- kayıtlı Item 104; catalogVisible=true 64; projection 64
- hardcoded katalog Item key listesi: 0
- 64/64 descriptor regression: itemKey/label/widthCm/depthCm/heightCm/type/modelFile/eyeCount/shelfCount/shape/variant/stripOccupancy/unit/TV alanları birebir
- kategori sayısı/sırası/adları/üye sayısı/Item sırası değişmedi
- `npm test`: 740 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-item-projection`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

SQLite/API yok. Rotation/color/image bu turda yok.

---

## 2026-09-16 — Catalog category modelinin merkezileştirilmesi

### Neden yapıldı

Modül Kataloğu kategori yapısı hardcoded `MODULE_CATALOG_GROUPS` (yalnız `label` + `keys`) olarak duruyordu. Kategori kimliği, UI adı ve yukarıdan aşağıya sıra ayrı canonical alanlar değildi. Item.catalogCategory key’leri vardı ama kategori tanımı merkezi Catalog modelinde açık değildi.

### Hangi eski yapı değişti

- Kaldırılan hardcoded kaynak: `src/catalog.js` içindeki `MODULE_CATALOG_GROUPS` literal listesi (`label` + `keys`)
- Kaldırılan ikinci hardcoded üyelik listesi: ayrı `MODULE_CATALOG_KEYS` literal dizisi
- Sidebar / picker artık `MODULE_CATALOG_GROUPS` sabitini okumaz; `listCatalogGroups()` ve `group.catalogName` okur

### Yeni alanlar

Catalog (canonical kaynak `CATALOG_CATEGORIES`):

- `catalogKey` — stabil kategori kimliği; Item.catalogCategory bu değere bağlanır
- `catalogName` — Modül Ekle panelindeki kategori adı
- `catalogIndex` — kategorilerin 1 tabanlı yukarıdan aşağıya sırası

Item bağlantısı değişmedi: `catalogVisible`, `catalogCategory` → `catalogKey`, `catalogItemIndex` (kategori içi sıra).

Yeni method’lar: `listCatalogCategories()`, `getCatalogCategory(catalogKey)`, `listCatalogGroups()`.

### Gerçek catalogKey’ler

Bu turda yeni key uydurulmadı. Key’ler önceki turda Item kayıtlarına yazılan `catalogCategory` değerleridir.

| catalogKey | catalogName | catalogIndex | Item sayısı |
|---|---|---|---|
| `panel-wall` | Panel & Duvar | 1 | 12 |
| `panel-addon` | Panel Ek Modül | 2 | 13 |
| `shelf-showcase` | Raf & Vitrin | 3 | 8 |
| `counter-base` | Banko & Baza | 4 | 9 |
| `extra` | Extra | 5 | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 | 6 |

`MODULE_CATALOG_KEYS` artık `listCatalogGroups().flatMap(keys)` türevidir. Global snapshot sırası kategori sırasına hizalandı (eski literal KEYS listesinde raf/vitrin, `wall_base` / `door_100` satırlarından önce duruyordu). Modül Ekle UI kategori sırası, kategori adları ve kategori içi Item sırası değişmedi.

### Yeni kural

- Katalog yalnız UI organizasyonudur
- Kategori adı yalnız `catalogName`
- Kategori sırası yalnız `catalogIndex`
- `catalogCategory` yalnız `catalogKey` saklar; label saklamaz
- `type` / Item Contract / registry grubu kategori belirlemez
- `catalogCategory` rotation / color / image / collision / renderer / placement belirlemez

### Doğrulama

- Catalog category sayısı: 6 (önceki grup sayısıyla aynı)
- `catalogKey` benzersiz: %100
- `catalogName` boş: 0
- `catalogIndex` null: 0
- duplicate `catalogIndex`: 0
- `catalogIndex` sırası: 1..6 kesintisiz
- geçersiz `catalogKey` bakan Item: 0
- `catalogVisible=true` ve geçersiz category: 0
- kategori UI sırası / adları / kategori içi Item sırası / görünen Item sayısı (64): değişmedi
- `npm test`: 737 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-category-model`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

`listCatalogItems()` henüz ayrı export değildir. Kart descriptor’ı hâlâ `MODULE_CATALOG` üzerindendir. SQLite/API bu turda yoktur.

---

## 2026-09-16 — Item katalog metadata alanları

### Amaç

Katalog görünürlüğünü ve katalog içi konumu Item’ın kendi verisine taşımak. Bu tur katalog UI’yı yeni alanlardan okutmaz; yalnız 104 Item kaydını hazırlar.

### Yapılan değişiklikler

- Eklenen Item alanları: `catalogVisible`, `catalogCategory`, `catalogItemIndex`
- Değer kaynağı: canlı `MODULE_CATALOG_GROUPS` üyeliği ve `MODULE_CATALOG_KEYS` ile aynı grup içi UI sırası
- Kaldırılan alan yok
- `createCommercialCatalogItem` bu üç alanı katalog descriptor’ına kopyalamaz; `MODULE_CATALOG` şekli korunur
- Etkilenen dosyalar: `src/items.js`, `src/catalog.js`, `test/itemCatalogFields.test.js`, `test/shelfLegItemContract.test.js`

Canonical `catalogCategory` key’leri (mevcut 6 grup, yeni grup yok):

| key | grup label | Item sayısı |
|---|---|---|
| `panel-wall` | Panel & Duvar | 12 |
| `panel-addon` | Panel Ek Modül | 13 |
| `shelf-showcase` | Raf & Vitrin | 8 |
| `counter-base` | Banko & Baza | 9 |
| `extra` | Extra | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 |

`wall_200`: `catalogVisible=true`, `catalogCategory=panel-wall`, `catalogItemIndex=1` (grupta ilk kart).
`panel_197`: `catalogVisible=false`, `catalogCategory=null`, `catalogItemIndex=null`.

### Yeni kural

- `catalogVisible`: Item sol katalogda gösterilecek mi
- `catalogCategory`: Item’ın ait olduğu katalog category key; yalnız UI gruplamasıdır, runtime behavior belirlemez
- `catalogItemIndex`: kendi kategorisi içinde 1 tabanlı sıra
- Bu üç alan type’tan, Item Contract’tan veya registry grubundan türetilmez
- Her Item kendi değerini taşır; ayrı assignment tablosu yoktur
- Katalogda görünmeyen Item: `false / null / null`
- Bu turda katalog UI hâlâ `MODULE_CATALOG_GROUPS` okur

### Doğrulama

- Toplam Item: 104 / 104
- `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanı: 104 / 104
- `catalogVisible=true`: 64 (canlı katalog Item sayısıyla aynı)
- visible=true olup category veya index null: 0
- visible=false olup category veya index dolu: 0
- Aynı kategoride duplicate index: 0
- Her kategoride index 1..N kesintisiz
- Katalog grup sırası, grup içi Item sırası ve görünen Item sayısı değişmedi
- `npm test`: 732 pass / 0 fail
- `npm run build`: geçti
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

Katalog UI’yı `MODULE_CATALOG_GROUPS` yerine Item’daki `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanlarından okutmak. Bu adım henüz yapılmaz.

---

## 2026-09-16 — Katalog teknik sözleşmesi

### Amaç

Katalog mekanizmasını kalıcı tek belgede sabitlemek ve refactor günlüğünü `docs/refactor/` altına almak.

### Yapılan değişiklikler

- Eklenen: `docs/refactor/CATALOG.md` (katalog canonical sözleşmesi)
- Taşınan: değişiklik günlüğü `docs/REFACTOR.md` → `docs/refactor/REFACTOR.md`
- `docs/REFACTOR.md` yönlendirme bırakır
- Katalog UI, Item Contract, recipe, behavior, DB/API bu adımda değişmez
- Etkilenen dosyalar: `docs/refactor/CATALOG.md`, `docs/refactor/REFACTOR.md`, `docs/REFACTOR.md`, `test/itemCatalogFields.test.js`

### Yeni kural

- Refactor adımlarının tek günlüğü `docs/refactor/REFACTOR.md`
- Katalog nasıl çalışır / nasıl çalışmalıdır: yalnız `docs/refactor/CATALOG.md`
- Mevcut UI hâlâ `MODULE_CATALOG_GROUPS` okur; `listCatalogItems` / `listCatalogGroups` henüz yoktur

### Doğrulama

- `test/itemCatalogFields.test.js` category key tablosunu canlı gruplarla karşılaştırır
- `listCatalogItems` / `listCatalogGroups` src içinde yok
- `npm test`: 733 pass / 0 fail
- Katalog UI sırası ve Item alanları önceki adımla aynı kalır

### Sonraki adım

`listCatalogItems` / `listCatalogGroups` eklemek ve UI’yı bu API’den okutmak. Bu adım henüz yapılmaz.

---

## 2026-09-16 — Item canonical sözleşmesi

### Amaç

Yeni Item modelinin yaşayan teknik sözleşmesini `docs/refactor/ITEMS.md` altında tutmak. Audit dökümü değildir; yalnız onaylanmış alanlar yazılır.

### Yapılan değişiklikler

- Eklenen: `docs/refactor/ITEMS.md`
- Onaylı şemaya alınan Item alanları: `itemKey`, `catalogVisible`, `catalogCategory`, `catalogItemIndex`
- Eski 188 property / type / registry alanları şemaya taşınmadı
- Catalog ayrıntısı `CATALOG.md`’de kalır; ITEMS.md yalnız config bağlantısını tutar
- Etkilenen dosyalar: `docs/refactor/ITEMS.md`, `docs/refactor/REFACTOR.md`, `docs/REFACTOR.md`, `test/itemCatalogFields.test.js`

### Yeni kural

- Item modelinin tek güncel cevabı `docs/refactor/ITEMS.md`
- Yeni Item alanı/config aynı commit içinde ITEMS.md’ye yazılır
- Gerçekleşmemiş method veya config gerçekleşmiş gibi yazılmaz
- Rotation / color / image / lighting / delete mekanizmaları henüz belirlenmedi

### Doğrulama

- `test/itemCatalogFields.test.js` ITEMS.md katalog alanlarını ve “henüz yok” kaydını doğrular
- `npm test`: 734 pass / 0 fail
- Katalog UI değişmez

### Sonraki adım

`listCatalogItems` / `listCatalogGroups` eklemek. ITEMS.md bağlantı satırı o commit’te “mevcut” yapılır.
