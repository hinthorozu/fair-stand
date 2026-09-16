# `static.material`

**Özellik ID:** `static.material`
**İnsan tarafından anlaşılır adı:** Kanonik malzeme etiketi
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `alüminyum` | `sunta` | `mdf` | `ahşap` | `cam` (yalnız bu kayıtlar)

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :987 [read]

## Okuyan yerler

- `src/items.js` `if` :987 [read]
- `src/scene3d.js` `setFloorType` :617 [read]
- `src/scene3d.js` `if` :636 [read]
- `src/scene3d.js` `setFloorColor` :671 [read]
- `src/scene3d.js` `retainWallTexturesForRebuild` :889 [read]
- `src/scene3d.js` `disposeObject` :1363 [read]
- `src/scene3d.js` `destroyPlacementGhost` :1862 [read]
- `src/scene3d.js` `createFallbackPlacementGhost` :1976 [read]
- `src/scene3d.js` `showPlacementGhost` :2040 [read]
- `src/scene3d.js` `applyColor` :3094 [read]
- `src/scene3d.js` `clearFabricOverlays` :3128 [read]
- `src/scene3d.js` `suspendFabricSurface` :3144 [read]
- `src/scene3d.js` `restoreFabricSurface` :3156 [read]
- `src/scene3d.js` `applyFabricOverlayLighting` :3297 [read]
- `src/scene3d.js` `loadFabricOverlayImage` :3337 [read]
- `src/scene3d.js` `loadSingleImageOnSurface` :3806 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3844 [read]
- `src/scene3d.js` `applyImageAsset` :3931 [read]
- `src/scene3d.js` `clearImage` :4090 [read]
- `src/scene3d.js` `resize` :4563 [read]
- `src/scene3d.js` `createBarStoolModule` :5721 [read]
- `src/scene3d.js` `makeBeigeSofaBodyWhite` :6051 [read]
- `src/scene3d.js` `centerZ` :6099 [read]
- `src/scene3d.js` `applyBeigeSofaBodyColor` :6121 [read]
- `src/theme.js` `getMaterialAppearance` :37 [read]
- `src/viewCube.js` `switch` :194 [read]
- `src/viewCube.js` `dispose` :308 [read]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :39 [test]
- `test/baseTopsItemContract.test.js` `for` :75 [test]
- `test/boardMaterialItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/boardMaterialItemContract.test.js` `for` :37 [test]
- `test/coverModeExclusivity.test.js` (dosya düzeyi) :19 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :18 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/glassShelfItemContract.test.js` `for` :47 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :15 [test]
- `test/lightboxFabric.test.js` (dosya düzeyi) :33 [test]
- `test/lightboxFabricLighting.test.js` (dosya düzeyi) :15 [test]
- `test/lightboxFabricPerformance.test.js` (dosya düzeyi) :8 [test]
- `test/materialAppearance.test.js` (dosya düzeyi) :27 [test]
- `test/profileIntrinsicProperties.test.js` (dosya düzeyi) :13 [test]
- `test/profileIntrinsicProperties.test.js` `for` :19 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/separatorPanelsItemContract.test.js` `for` :68 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :25 [test]
- `test/shelfItemsItemContract.test.js` `for` :62 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :22 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :34 [test]
- `test/uprightIntrinsicProperties.test.js` (dosya düzeyi) :8 [test]
- `test/uprightIntrinsicProperties.test.js` `for` :13 [test]
- `test/wallShowcaseItemContract.test.js` `for` :80 [test]
- `e2e/plastic-trash-bin-module.spec.mjs` `if` :131 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/scene3d.js` `disposeGroundObject` :528 [write]
- `src/scene3d.js` `for` :594 [write]
- `src/scene3d.js` `setFloorType` :615 [write]
- `src/scene3d.js` `if` :633 [write]
- `src/scene3d.js` `setFloorColor` :672 [write]
- `src/scene3d.js` `retainWallTexturesForRebuild` :885 [write]
- `src/scene3d.js` `disposeObject` :1361 [write]
- `src/scene3d.js` `createFallbackPlacementGhost` :1969 [write]
- `src/scene3d.js` `applyColor` :3116 [write]
- `src/scene3d.js` `clearFabricOverlays` :3129 [write]
- `src/scene3d.js` `suspendFabricSurface` :3146 [write]
- `src/scene3d.js` `restoreFabricSurface` :3158 [write]
- `src/scene3d.js` `applyFabricOverlayLighting` :3296 [write]
- `src/scene3d.js` `if` :5161 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5726 [write]
- `src/scene3d.js` `createEamesChairModule` :5799 [write]
- `src/scene3d.js` `makeBeigeSofaBodyWhite` :6055 [write]
- `src/viewCube.js` `createViewCube` :58 [write]
- `src/viewCube.js` `dispose` :305 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **34** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `door-leaf`, `shelf`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **29**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **4**
- src dosyaları: `src/items.js`, `src/scene3d.js`, `src/theme.js`, `src/viewCube.js`

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :987 [read]
- `src/scene3d.js` `disposeGroundObject` :528 [write]
- `src/scene3d.js` `for` :594 [write]
- `src/scene3d.js` `setFloorType` :615 [write]
- `src/scene3d.js` `setFloorType` :617 [read]
- `src/scene3d.js` `if` :633 [write]
- `src/scene3d.js` `if` :636 [read]
- `src/scene3d.js` `setFloorColor` :671 [read]
- `src/scene3d.js` `setFloorColor` :672 [write]
- `src/scene3d.js` `retainWallTexturesForRebuild` :885 [write]
- `src/scene3d.js` `retainWallTexturesForRebuild` :889 [read]
- `src/scene3d.js` `disposeObject` :1361 [write]
- `src/scene3d.js` `disposeObject` :1363 [read]
- `src/scene3d.js` `destroyPlacementGhost` :1862 [read]
- `src/scene3d.js` `createFallbackPlacementGhost` :1969 [write]
- `src/scene3d.js` `createFallbackPlacementGhost` :1976 [read]
- `src/scene3d.js` `showPlacementGhost` :2040 [read]
- `src/scene3d.js` `applyColor` :3094 [read]
- `src/scene3d.js` `applyColor` :3116 [write]
- `src/scene3d.js` `clearFabricOverlays` :3128 [read]
- `src/scene3d.js` `clearFabricOverlays` :3129 [write]
- `src/scene3d.js` `suspendFabricSurface` :3144 [read]
- `src/scene3d.js` `suspendFabricSurface` :3146 [write]
- `src/scene3d.js` `restoreFabricSurface` :3156 [read]
- `src/scene3d.js` `restoreFabricSurface` :3158 [write]
- `src/scene3d.js` `applyFabricOverlayLighting` :3296 [write]
- `src/scene3d.js` `applyFabricOverlayLighting` :3297 [read]
- `src/scene3d.js` `loadFabricOverlayImage` :3337 [read]
- `src/scene3d.js` `loadSingleImageOnSurface` :3806 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3844 [read]
- `src/scene3d.js` `applyImageAsset` :3931 [read]
- `src/scene3d.js` `clearImage` :4090 [read]
- `src/scene3d.js` `resize` :4563 [read]
- `src/scene3d.js` `if` :5161 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5721 [read]
- `src/scene3d.js` `createBarStoolModule` :5726 [write]
- `src/scene3d.js` `createEamesChairModule` :5799 [write]
- `src/scene3d.js` `makeBeigeSofaBodyWhite` :6051 [read]
- `src/scene3d.js` `makeBeigeSofaBodyWhite` :6055 [write]
- `src/scene3d.js` `centerZ` :6099 [read]
- `src/scene3d.js` `applyBeigeSofaBodyColor` :6121 [read]
- `src/theme.js` `getMaterialAppearance` :37 [read]
- `src/viewCube.js` `createViewCube` :58 [write]
- `src/viewCube.js` `switch` :194 [read]
- `src/viewCube.js` `dispose` :305 [write]
- `src/viewCube.js` `dispose` :308 [read]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :39 [test]
- `test/baseTopsItemContract.test.js` `for` :75 [test]
- `test/boardMaterialItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/boardMaterialItemContract.test.js` `for` :37 [test]
- `test/coverModeExclusivity.test.js` (dosya düzeyi) :19 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :18 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/glassShelfItemContract.test.js` `for` :47 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :15 [test]
- `test/lightboxFabric.test.js` (dosya düzeyi) :33 [test]
- `test/lightboxFabricLighting.test.js` (dosya düzeyi) :15 [test]
- `test/lightboxFabricPerformance.test.js` (dosya düzeyi) :8 [test]
- `test/materialAppearance.test.js` (dosya düzeyi) :27 [test]
- `test/profileIntrinsicProperties.test.js` (dosya düzeyi) :13 [test]
- `test/profileIntrinsicProperties.test.js` `for` :19 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/separatorPanelsItemContract.test.js` `for` :68 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :25 [test]
- `test/shelfItemsItemContract.test.js` `for` :62 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :22 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :34 [test]
- `test/uprightIntrinsicProperties.test.js` (dosya düzeyi) :8 [test]
- `test/uprightIntrinsicProperties.test.js` `for` :13 [test]
- `test/wallShowcaseItemContract.test.js` `for` :80 [test]
- `e2e/plastic-trash-bin-module.spec.mjs` `if` :131 [test]

- indeks: 28 / 188
