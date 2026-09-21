# Mekanizma ve parametre raporu

188 property = 188 mekanizma **değildir**. Aşağıdaki gruplar kod kanıtlıdır. Kanıtsız yerde BELLİ DEĞİL.

Her property **birincil** bir çalışan işe bağlandı. Aynı alan başka dosyada da okunabilir; ikinci mekanizma uydurulmadı.

HTML: [`MEKANIZMA_PARAMETRE.html`](MEKANIZMA_PARAMETRE.html)

## Özet

- Mekanizma sayısı: **21**
- Property: **188**
- Eşleşen: **188**
- Eşleşmeyen: **0**

| mekanizma | property adedi |
|---|---:|
| [`item-kimlik`](#item-kimlik) Item kimliği | 6 |
| [`kanonik-olcu`](#kanonik-olcu) Kanonik ölçü kaydı | 9 |
| [`katalog-yerlestirme`](#katalog-yerlestirme) Katalog kartı ve sürükle-bırak | 10 |
| [`modul-sozlesme`](#modul-sozlesme) Modül sözleşmesi | 9 |
| [`modul-davranis`](#modul-davranis) Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | 26 |
| [`yuzey-renk-gorsel`](#yuzey-renk-gorsel) Yüzey rengi ve görseli | 6 |
| [`cam-kumas`](#cam-kumas) Cam panel ve kumaş (lightbox/mesh) | 2 |
| [`yuzey-capability-tablosu`](#yuzey-capability-tablosu) Item yüzey capability tablosu | 5 |
| [`bom-recipe`](#bom-recipe) BOM ve recipe | 30 |
| [`modul-factory`](#modul-factory) Runtime module state fabrikası | 11 |
| [`proje-kayit`](#proje-kayit) Proje kaydı | 2 |
| [`sahne-renderer`](#sahne-renderer) 3D çizim dalı | 14 |
| [`tv-video-wall`](#tv-video-wall) TV / video wall ölçüsü | 26 |
| [`raf-isigi`](#raf-isigi) Raf altı ışık | 2 |
| [`isikli-strafor`](#isikli-strafor) Işıklı strafor | 4 |
| [`zemin`](#zemin) Zemin seçimi ve boyası | 2 |
| [`strip-occupancy`](#strip-occupancy) Şerit doluluğu | 8 |
| [`vitrin-govde`](#vitrin-govde) Vitrin gövdesi | 8 |
| [`short-up`](#short-up) Short-up duvar varyantı | 2 |
| [`sahne-feature`](#sahne-feature) Sahne feature sözleşmesi | 1 |
| [`audit-kanit`](#audit-kanit) Audit kanıt sütunu (çalışan mekanizma değil) | 5 |
| **toplam** | **188** |

## Factory type davranış değerleri

Kaynak: `getModuleBehavior({ type })`. Counter 45° override (düz 100/150/200) bu tabloda yok.

| type | placement | rotationStepDeg | defaultRotationDeg | moveSnapCm | collision | magneticSnap |
|---|---|---:|---:|---:|---|---|
| `flat-panel` | wall | 90 | 0 | 50 | segment | standard |
| `base` | free | 90 | 0 | 50 | footprint | standard |
| `base-wall` | wall | 90 | 0 | 50 | segment | standard |
| `counter` | free | 90 | 0 | 50 | footprint | standard |
| `separator` | wall | 90 | 0 | 50 | segment | standard |
| `shelf` | wall | 90 | 0 | 50 | segment | standard |
| `sofa-set-classic` | free | 90 | 0 | 10 | footprint | standard |
| `sofa-single-classic` | free | 45 | 0 | 10 | none | none |
| `sofa-double-classic` | free | 90 | 0 | 10 | none | none |
| `coffee-table-classic` | free | 90 | 0 | 10 | none | none |
| `table-chair-set-eames` | free | 90 | 0 | 10 | none | none |
| `chair` | free | 90 | 0 | 10 | none | none |
| `table-glass` | free | 90 | 0 | 10 | none | none |
| `bar-stool` | free | 45 | 270 | 10 | none | none |
| `mini-fridge` | free | 90 | 0 | 10 | none | none |
| `kettle` | free | 90 | 0 | 10 | none | none |
| `coat-rack` | free | 90 | 0 | 10 | none | none |
| `upright` | free | 90 | 0 | 50 | footprint | short-up-joint |
| `profile` | wall | 90 | 0 | 50 | segment | standard |
| `plastic-trash-bin` | free | 90 | 0 | 10 | none | none |
| `indoor-plant-1` | free | 90 | 0 | 10 | footprint | standard |
| `tv` | wall-overlay | 90 | 0 | 10 | none | none |
| `led-floodlight` | top | 90 | 0 | 20 | none | none |
| `door` | wall | 90 | 0 | 50 | segment | standard |
| `showcase-2` | wall | 90 | 0 | 50 | segment | standard |
| `showcase-3` | wall | 90 | 0 | 50 | segment | standard |
| `illuminated-foam` | wall-overlay | 90 | 0 | 10 | none | none |

## Mekanizmalar

<a id="item-kimlik"></a>

### Item kimliği

**Property adedi:** 6

**Sade açıklama:** Her fiziksel öğenin tek adı itemKey’dir. Sistem ürünü bu anahtarla bulur.

**Nerede:** `src/items.js` `getItem` / `listRegisteredItems`. Persist: `modules[].itemKey`, zemin `stand.itemKey`.

**Owner:** `src/items.js`

| parametre | kodda gerçek değer |
|---|---|
| `kayıtlı item sayısı` | 104 |
| `type (kayıtlı, tekil)` | bar-stool, base, base-top, base-wall, chair, coat-rack, coffee-table-classic, connector, counter, counter-top, door, door-leaf, flat-panel, floor, illuminated-foam, indoor-plant-1, kettle, led-floodlight, mini-fridge, panel, plastic-trash-bin, profile, separator, separator-panel, shelf, shelf-accessory, showcase-2, showcase-3, showcase-accessory, showcase-board, sofa-double-classic, sofa-set-classic, sofa-single-classic, table-chair-set-eames, table-glass, tv, upright |
| `registry map` | LEAF_ITEMS, COMMERCIAL_ITEMS, FURNITURE_ITEMS, INDOOR_PLANT_ITEMS, WALL_MEDIA_ITEMS, TOP_LIGHT_ITEMS, NON_CATALOG_ITEMS, FLOOR_ITEMS, COMPOSITE_ITEMS |

Property listesi:

- `itemKey`
- `name`
- `type`
- `registry`
- `state.itemKey`
- `state.type`

<a id="kanonik-olcu"></a>

### Kanonik ölçü kaydı

**Property adedi:** 9

**Sade açıklama:** Item kaydında duran cm ölçüleri. Kendi başına UI değildir; factory, yerleştirme ve çizim bu sayıları okur.

**Nerede:** `src/items.js` `dimensions.*`. Factory `Number(item.dimensions…)` kopyalar.

**Owner:** `src/items.js`

| parametre | kodda gerçek değer |
|---|---|
| `dimensions anahtarları (item kayıtlarında görülen)` | catalogHeightCm, depthCm, heightCm, lengthCm, mountHeightCm, screenHeightCm, screenWidthCm, tableDiameterCm, thicknessCm, wallGapCm, widthCm |
| `dikme lengthCm` | upright_346_5=346.5 · upright_99=99 · upright_49_5=49.5 |
| `MODULE_WIDTHS_CM` | 50, 100, 150, 200 |
| `led_floodlight.mountHeightCm` | 350 |
| `led_floodlight width/depth/height cm` | 50 / 20 / 35 |

Property listesi:

- `static.dimensions.catalogHeightCm`
- `static.dimensions.depthCm`
- `static.dimensions.heightCm`
- `static.dimensions.lengthCm`
- `static.dimensions.mountHeightCm`
- `static.dimensions.tableDiameterCm`
- `static.dimensions.thicknessCm`
- `static.dimensions.wallGapCm`
- `static.dimensions.widthCm`

<a id="katalog-yerlestirme"></a>

### Katalog kartı ve sürükle-bırak

**Property adedi:** 10

**Sade açıklama:** Sol menüden sahneye modül bırakmak. Kart yoksa kullanıcı o item’ı sürükleyemez.

**Nerede:** `src/catalog.js` `MODULE_CATALOG` / `MODULE_CATALOG_GROUPS`, `src/moduleDragSidebar.js`.

**Owner:** `src/catalog.js`

| parametre | kodda gerçek değer |
|---|---|
| `MODULE_CATALOG_KEYS sayısı` | 64 |
| `MODULE_CATALOG nesne anahtarı` | 64 |
| `gruplar` | Panel & Duvar (12) · Panel Ek Modül (13) · Raf & Vitrin (8) · Banko & Baza (9) · Extra (16) · Elektronik & Aydınlatma (6) |

Property listesi:

- `catalog.present`
- `catalog.inKeysList`
- `catalog.groups`
- `catalog.depthCm`
- `catalog.heightCm`
- `catalog.itemKey`
- `catalog.label`
- `catalog.type`
- `catalog.widthCm`
- `ui.sidebar`

<a id="modul-sozlesme"></a>

### Modül sözleşmesi

**Property adedi:** 9

**Sade açıklama:** Katalogdaki item’a bağlı politika: renk/görsel yetkisi, renderer sınıfı, BOM kipi. Kullanıcı tabloyu değiştirmez.

**Nerede:** `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` + `MODULE_CONTRACT_PROFILES`.

**Owner:** `src/moduleContracts.js`

| parametre | kodda gerçek değer |
|---|---|
| `profile` | wall-editable / wall-color-only / free-editable / free-model-color / free-model-fixed / wall-media / top-light / wall-overlay-image |
| `appearance.color (profilden)` | editable / fixed / halo-only / state-backed |
| `appearance.image (profilden)` | editable / none / renderer-managed / required |
| `renderer.mode (profilden)` | model / procedural / procedural-or-model / procedural-or-specialized / specialized-media / specialized-overlay |
| `bom.mode (assignment)` | decision-required / recipe / self |
| `assignment sayısı` | 64 |

Property listesi:

- `contract.present`
- `contract.profile`
- `contract.appearance.color`
- `contract.appearance.image`
- `contract.renderer.mode`
- `contract.runtime.mode`
- `contract.composition.mode`
- `contract.state.owner`
- `contract.state.persistence`

<a id="modul-davranis"></a>

### Modül davranışı (yerleşim, dönüş, çarpışma, ghost)

**Property adedi:** 26

**Sade açıklama:** Modülün sahneye nasıl konduğu: duvar mı serbest mi, kaç cm kaydığı, kaç derece döndüğü, çarpışıp çarpışmadığı.

**Nerede:** Placement/snap/collision: `src/moduleBehavior.js` `TYPE_BEHAVIORS` / `getModuleBehavior`. Sahne Z: Item kolonları, `docs/refactor/ROTATION.md`, getter `getModuleRotationStepDeg` / `getModuleDefaultRotationDeg`. Tüketici: `src/modulePlacement.js`, `src/viewKeyboardShortcuts.js` (Shift+R), `src/moduleContextMenu.js`.

**Owner:** placement/collision `src/moduleBehavior.js`; rotation Item + `docs/refactor/ROTATION.md`

| parametre | kodda gerçek değer |
|---|---|
| `placement (factory type tablosu)` | free / top / wall / wall-overlay |
| `rotationStepDeg` | Item kolonu; type kaydı yok. Çoğu yerleşen 90; 45: düz banko 100/150/200, sofa-single, bar-stool. Sözleşme `ROTATION.md`. |
| `defaultRotationDeg` | Item kolonu. Çoğu 0; L-banko ve bar-stool 270. |
| `sideInsertRotation` | Item kolonu `inherit` / `default`. Leaf 35 satırda trio yok. |
| `izinli açılar MODULE_PLACEMENT_ROTATIONS` | 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315° (normalize ızgarası; Item adımı serbest sayı) |
| `moveSnapCm (type kaydı)` | 10 cm → sofa-set-classic, sofa-single-classic, sofa-double-classic, coffee-table-classic, table-chair-set-eames, chair, table-glass, bar-stool, mini-fridge, kettle, coat-rack, plastic-trash-bin, indoor-plant-1, tv, illuminated-foam · 20 cm → led-floodlight · 50 cm → flat-panel, base, base-wall, counter, separator, shelf, upright, profile, door, showcase-2, showcase-3 |
| `MODULE_PLACEMENT_SNAP_CM` | 50 cm |
| `duvar manyetik mesafe` | 50 cm |
| `komşu snap` | 30 cm |
| `collisionDepth sabiti` | 10 cm (STAND_DIMENSIONS.depth×100) |
| `collision` | footprint / none / segment |
| `magneticSnap` | none / short-up-joint / standard |
| `ghost` | kind=silhouette; renderer=module-silhouette; opacity=0.38 |
| `TYPE_BEHAVIORS dışı kayıtlı type (DEFAULT_BEHAVIOR=WALL_BEHAVIOR)` | base-top, connector, counter-top, door-leaf, floor, panel, separator-panel, shelf-accessory, showcase-accessory, showcase-board |

Property listesi:

- `behavior.allowSideInsert`
- `behavior.boundarySnap`
- `behavior.collision`
- `behavior.collisionDepth`
- `behavior.collisionHeight`
- `behavior.connectionEndpoint`
- `item.defaultRotationDeg`
- `behavior.endpointContact`
- `behavior.ghost.kind`
- `behavior.ghost.opacity`
- `behavior.ghost.renderer`
- `behavior.magneticSnap`
- `behavior.moveSnapCm`
- `behavior.overlapWithTypes`
- `behavior.placement`
- `item.rotationStepDeg`
- `item.sideInsertRotation`
- `behavior.supportsWallOverlayMount`
- `behavior.wallCapacity`
- `behavior.explicitTypeEntry`
- `behavior.collisionHeightRange`
- `ui.contextMenu.delete`
- `ui.contextMenu.duplicate`
- `ui.contextMenu.add`
- `ui.editable.placement`
- `ui.editable.rotation`

<a id="yuzey-renk-gorsel"></a>

### Yüzey rengi ve görseli

**Property adedi:** 6

**Sade açıklama:** Seçilen paneli boyamak veya görsel basmak. Renk hex; görsel asset id.

**Nerede:** `src/main.js` `applyActiveColorToSelection`, `src/scene3d.js` `applyColor` / `applyImage`, `src/designState.js` `applyColorOverride`.

**Owner:** `src/designState.js + src/scene3d.js`

| parametre | kodda gerçek değer |
|---|---|
| `DEFAULT_PANEL_COLOR` | #ffffff |
| `led_floodlight surface.color` | #17191c |
| `createDefaultImageTransform` | {"mode":"single","offsetX":0,"offsetY":0,"repeatX":1,"repeatY":1,"rotation":0} |

Property listesi:

- `static.defaultColor`
- `state.faces`
- `state.strips`
- `state.surface`
- `ui.editable.color`
- `ui.editable.image`

<a id="cam-kumas"></a>

### Cam panel ve kumaş (lightbox/mesh)

**Property adedi:** 2

**Sade açıklama:** Panel yüzeyini cama veya kumaşa çevirmek. Kapı yeteneği tablosu bunu yapmaz; koşul `selectionMode === 'panel'`.

**Nerede:** `src/scene3d.js` `supportsGlass` / `supportsFabric`, `src/surfaceStateBinding.js` `applyGlassOverride`, `src/moduleContextMenu.js` toggle-glass / toggle-fabric.

**Owner:** `src/scene3d.js`

| parametre | kodda gerçek değer |
|---|---|
| `supportsGlass koşulu` | selectionMode === 'panel' (capability tablosu değil) |
| `fabricType` | lightbox / mesh |
| `GLASS_APPEARANCE.opacity` | 0.48 |
| `GLASS_APPEARANCE.color` | 0xd7e9ed |
| `GLASS_APPEARANCE.roughness` | 0.16 |
| `TABLE_GLASS_APPEARANCE.opacity` | 0.42 |

Property listesi:

- `ui.editable.glass`
- `ui.editable.fabric`

<a id="yuzey-capability-tablosu"></a>

### Item yüzey capability tablosu

**Property adedi:** 5

**Sade açıklama:** Type’a göre color/image/glass bayrakları. Bugün cam/kumaş hep false. Yalnız kapı kanadı color+image true.

**Nerede:** `src/itemCapabilities.js` `getItemSurfaceCapabilities`.

**Owner:** `src/itemCapabilities.js`

| parametre | kodda gerçek değer |
|---|---|
| `door-leaf` | {"color":true,"image":true,"glass":false,"lightbox":false,"mesh":false} |
| `diğer type (ör. panel_98)` | {"color":false,"image":false,"glass":false,"lightbox":false,"mesh":false} |
| `tabloda type sayısı` | 1 (yalnız door-leaf); diğerleri NO_SURFACE_CAPABILITIES |

Property listesi:

- `capabilities.color`
- `capabilities.image`
- `capabilities.glass`
- `capabilities.lightbox`
- `capabilities.mesh`

<a id="bom-recipe"></a>

### BOM ve recipe

**Property adedi:** 30

**Sade açıklama:** Üretilecek parça listesi. Duvar/kapı/raf parent’ı child itemKey × adet satırına açar. Miktar uydurulmaz; recipe satırı kanoniktir.

**Nerede:** `src/itemBom.js` `resolveItemBom`, `src/moduleRecipes.js` `getExpandedModuleRecipe`.

**Owner:** `src/itemBom.js + src/moduleRecipes.js`

| parametre | kodda gerçek değer |
|---|---|
| `nominalWidthCm (MODULE_WIDTHS_CM)` | 50, 100, 150, 200 |
| `unit (item.unit dolu olanlar)` | adet |
| `unit alanı olmayan itemKey` | furniture_sofa_set_classic, furniture_sofa_single_classic, furniture_sofa_double_classic, furniture_coffee_table_classic, furniture_table_chair_set_eames, chair_eames, glass_table, furniture_bar_stool_classic, EXTRA_INDOOR_PLANT_1, EXTRA_LONG_PLANTER_100, EXTRA_LONG_PLANTER_150, EXTRA_LONG_PLANTER_200, TV_42, TV_55, TV_65, VIDEO_WALL_2X2, VIDEO_WALL_3X3, led_floodlight, illuminated-foam, karolaj, hali, parke-acik, parke-sari, parke-beton, BASE_100, BASE_150, BASE_200, desk_banko_100, desk_banko_150, desk_banko_200, desk_banko_100_L, desk_banko_150_L, desk_banko_200_L, wall_50, wall_100, wall_150, wall_200, wall_200_short_up_2, wall_150_short_up_2, wall_100_short_up_2, wall_50_short_up_2, wall_200_short_up_1, wall_150_short_up_1, wall_100_short_up_1, wall_50_short_up_1, wall_base_100, wall_base_150, wall_base_200, wall_separator_50, wall_separator_100, wall_separator_50_sarmasik, wall_separator_100_sarmasik, wall_shelf_2_100, wall_shelf_2_150, wall_shelf_2_200, wall_shelf_3_100, wall_shelf_3_150, wall_shelf_3_200 |
| `connectorType (item kaydı)` | corner / double / single / start |
| `connectionMode (çözülen recipe)` | straight |
| `shelfCount (item kaydı)` | 2 / 3 |
| `shelfCount (recipe)` | 2 / 3 |
| `panelRole` | inner-corner / straight |
| `profil catalogWidth vs lengthCm` | profile_41_5: lengthCm=41.5 → catalogWidthCm=50 · profile_91: lengthCm=91 → catalogWidthCm=100 · profile_140_5: lengthCm=140.5 → catalogWidthCm=150 · profile_190: lengthCm=190 → catalogWidthCm=200 |
| `connector_double recipe child` | yok (hiçbir çözülen recipe satırında yok) |
| `recipe çözülemeyen parent` | yok |

Property listesi:

- `static.composition.items`
- `static.composition.mode`
- `static.composition.moduleType`
- `static.composition.nominalWidthCm`
- `static.composition.options.shape`
- `static.composition.options.shelfCount`
- `static.connectorType`
- `static.nominalModuleWidthCm`
- `static.panelRole`
- `static.shelfCount`
- `static.unit`
- `catalog.shelfCount`
- `catalog.unit`
- `contract.bom.mode`
- `contract.bom.source`
- `contract.bom.reason`
- `state.shelfCount`
- `bom.ok`
- `bom.error`
- `bom.lineCount`
- `bom.lines`
- `recipe.id`
- `recipe.moduleType`
- `recipe.connectionMode`
- `recipe.innerCornerPanelItemKey`
- `parents.recipe`
- `parents.innerCorner`
- `parents.replacement`
- `parents.cluster`
- `profile.catalogWidthCm`

<a id="modul-factory"></a>

### Runtime module state fabrikası

**Property adedi:** 11

**Sade açıklama:** Katalogdan veya sahneden gelen type için `modules[]` nesnesi üretir. Type tabloda yoksa state yoktur.

**Nerede:** `src/designState.js` `MODULE_STATE_FACTORIES` / `createModuleStateFromDescriptor`.

**Owner:** `src/designState.js`

| parametre | kodda gerçek değer |
|---|---|
| `MODULE_STATE_TYPES` | flat-panel, base, base-wall, counter, separator, shelf, sofa-set-classic, sofa-single-classic, sofa-double-classic, coffee-table-classic, table-chair-set-eames, chair, table-glass, bar-stool, mini-fridge, kettle, coat-rack, upright, profile, plastic-trash-bin, indoor-plant-1, tv, led-floodlight, door, showcase-2, showcase-3, illuminated-foam |
| `kayıtlı type, factory yok` | base-top, connector, counter-top, door-leaf, floor, panel, separator-panel, shelf-accessory, showcase-accessory, showcase-board |
| `TV default sizeInch` | 42 (createTvModuleState parametre default) |
| `shape (item kaydı)` | L |
| `chairCount (Eames küme)` | 4 |

Property listesi:

- `static.shape`
- `catalog.shape`
- `factory.fn`
- `factory.ok`
- `factory.reason`
- `factory.stateKeys`
- `state.chairCount`
- `state.depthCm`
- `state.heightCm`
- `state.shape`
- `state.widthCm`

<a id="proje-kayit"></a>

### Proje kaydı

**Property adedi:** 2

**Sade açıklama:** Tüm proje nesnesini IndexedDB’ye yazar. Alan listesi (whitelist) yoktur.

**Nerede:** `src/projectStore.js` `saveProject`, `src/main.js` `buildProjectSnapshot`.

**Owner:** `src/projectStore.js`

| parametre | kodda gerçek değer |
|---|---|
| `IndexedDB store adı` | projects |
| `zorunlu alan` | project.id (yoksa throw) |
| `zemin persist` | stand.itemKey (resolveStandFloorItemKey fallback karolaj) |

Property listesi:

- `persist.projectBlob`
- `persist.path`

<a id="sahne-renderer"></a>

### 3D çizim dalı

**Property adedi:** 14

**Sade açıklama:** Type’a göre mesh/GLB çizen fonksiyon. Çöp kutusu indoor-plant çizicisini paylaşır.

**Nerede:** `src/scene3d.js` `createRenderableModule`.

**Owner:** `src/scene3d.js`

| parametre | kodda gerçek değer |
|---|---|
| `STAND_DIMENSIONS.height` | 3.5 m = 350 cm |
| `STAND_DIMENSIONS.depth` | 0.1 m = 10 cm |
| `STAND_DIMENSIONS.frameWidth / frameDepth` | 0.055 m / 0.1 m |
| `ALUMINUM_PROFILE_COLOR` | #D0D3D4 |
| `material (item kaydı)` | ahşap / alüminyum / cam / mdf / sunta |

Property listesi:

- `static.material`
- `static.modelFile`
- `static.modelRotationYDeg`
- `static.preserveModelScale`
- `static.visualRotationYDeg`
- `catalog.modelFile`
- `catalog.modelRotationYDeg`
- `catalog.preserveModelScale`
- `catalog.visualRotationYDeg`
- `state.modelFile`
- `state.modelRotationYDeg`
- `state.preserveModelScale`
- `state.visualRotationYDeg`
- `renderer.fn`

<a id="tv-video-wall"></a>

### TV / video wall ölçüsü

**Property adedi:** 26

**Sade açıklama:** Ekran inç ve panel ızgarasından cm ölçü üretir. Kullanıcı inç slider’ı yok; ayrı itemKey konur.

**Nerede:** `src/items.js` `resolveWallMediaMetrics`, `src/designState.js` `createTvModuleState`.

**Owner:** `src/items.js`

| parametre | kodda gerçek değer |
|---|---|
| `sizeInch (item kaydı)` | 42 / 55 / 65 |
| `TV_SIZE_INCH_TO_ITEM_KEY` | 42→TV_42, 55→TV_55, 65→TV_65 |
| `çözülmüş ekran cm` | TV_42: 42" ekran 93×52.3 cm, widthCm=93, ızgara 1×1, panel 93×52.3 · TV_55: 55" ekran 121.8×68.5 cm, widthCm=121.8, ızgara 1×1, panel 121.8×68.5 · TV_65: 65" ekran 143.9×80.9 cm, widthCm=143.9, ızgara 1×1, panel 143.9×80.9 · VIDEO_WALL_2X2: 55" ekran 217×122 cm, widthCm=217, ızgara 2×2, panel 108.5×61 · VIDEO_WALL_3X3: 55" ekran 325.5×183 cm, widthCm=325.5, ızgara 3×3, panel 108.5×61 |

Property listesi:

- `static.dimensions.screenHeightCm`
- `static.dimensions.screenWidthCm`
- `static.sizeInch`
- `static.videoWall.cols`
- `static.videoWall.panelScreenHeightCm`
- `static.videoWall.panelScreenWidthCm`
- `static.videoWall.rows`
- `catalog.panelScreenHeightCm`
- `catalog.panelScreenWidthCm`
- `catalog.screenHeightCm`
- `catalog.screenWidthCm`
- `catalog.sizeInch`
- `catalog.videoWallCols`
- `catalog.videoWallRows`
- `state.panelScreenHeightCm`
- `state.panelScreenWidthCm`
- `state.screenHeightCm`
- `state.screenWidthCm`
- `state.sizeInch`
- `state.videoWallCols`
- `state.videoWallRows`
- `media.widthCm`
- `media.screenWidthCm`
- `media.screenHeightCm`
- `media.videoWallRows`
- `media.videoWallCols`

<a id="raf-isigi"></a>

### Raf altı ışık

**Property adedi:** 2

**Sade açıklama:** Duvar rafında LED’i aç/kapa. Varsayılan kapalı.

**Nerede:** `src/moduleContextMenu.js` `toggle-shelf-light`, `src/main.js` `shelfLightingOn`, `src/scene3d.js` `createShelfModule`.

**Owner:** `src/designState.js`

| parametre | kodda gerçek değer |
|---|---|
| `shelfLightingOn default` | false |
| `koşul` | module.type === 'shelf' (context menu toggle-shelf-light) |

Property listesi:

- `state.shelfLightingOn`
- `ui.editable.shelfLight`

<a id="isikli-strafor"></a>

### Işıklı strafor

**Property adedi:** 4

**Sade açıklama:** Duvara asılan ışıklı pano: zorunlu görsel, hale rengi, boyut.

**Nerede:** `src/designState.js` `createIlluminatedFoamModuleState`, context menu `resize-foam`.

**Owner:** `src/designState.js`

| parametre | kodda gerçek değer |
|---|---|
| `itemKey` | illuminated-foam (NON_CATALOG_ITEMS; MODULE_CATALOG yok) |
| `kayıt ölçü (cm)` | 200 × 50 × depth 3.5; wallGapCm=1.5 |
| `haloColor default` | #ffffff |
| `haloColor regex` | /^#[0-9a-fA-F]{6}$/ |
| `min widthCm (Math.max)` | 10 |
| `min heightCm (Math.max)` | 5 |
| `moveSnapCm` | 10 cm |
| `placement` | wall-overlay |

Property listesi:

- `state.haloColor`
- `state.imageAssetId`
- `state.wallGapCm`
- `ui.editable.foamResize`

<a id="zemin"></a>

### Zemin seçimi ve boyası

**Property adedi:** 2

**Sade açıklama:** Stand zemin malzemesini seçmek. Karolaj/halı boyanır; parke boyanmaz.

**Nerede:** `src/main.js` `#floor-type` / `assignStandFloorItem`, `src/scene3d.js` `setFloorType` / `setFloorColor`.

**Owner:** `src/items.js FLOOR_ITEMS + src/main.js`

| parametre | kodda gerçek değer |
|---|---|
| `floor itemKey` | karolaj, hali, parke-acik, parke-sari, parke-beton |
| `paintable + defaultColor` | karolaj paintable=true defaultColor=#e9edf1 · hali paintable=true defaultColor=#8b8f94 · parke-acik paintable=false defaultColor=#e8dfd1 · parke-sari paintable=false defaultColor=#c4a480 · parke-beton paintable=false defaultColor=#625f58 |
| `karolaj ızgara cm` | 100 × 100 |
| `fallback` | karolaj |

Property listesi:

- `static.paintable`
- `ui.editable.floorSelect`

<a id="strip-occupancy"></a>

### Şerit doluluğu

**Property adedi:** 8

**Sade açıklama:** Bazı modüller duvarın bütün 7 şeridini değil, üstten N şeridi kaplar (TV, strafor).

**Nerede:** `src/stripOccupancy.js` `resolveModuleStripOccupancy`. Stand şerit sayısı `STAND_DIMENSIONS.stripCount`.

**Owner:** `src/stripOccupancy.js`

| parametre | kodda gerçek değer |
|---|---|
| `stand stripCount` | 7 |
| `stripHeight` | 0.5 m = 50 cm |
| `align (item kaydı)` | top |
| `item.stripOccupancy.stripCount` | 1 / 2 |

Property listesi:

- `static.stripOccupancy.align`
- `static.stripOccupancy.stripCount`
- `catalog.stripOccupancy.align`
- `catalog.stripOccupancy.stripCount`
- `behavior.stripOccupancyResolved`
- `state.stripOccupancy`
- `state.stripOccupancy.align`
- `state.stripOccupancy.stripCount`

<a id="vitrin-govde"></a>

### Vitrin gövdesi

**Property adedi:** 8

**Sade açıklama:** 2 veya 3 gözlü vitrinin yan/yatay sunta ve cam raf child’ları. Gövde tek renkte boyanır.

**Nerede:** `src/items.js` `getShowcaseBodyDefinition`, `src/designState.js` `createShowcaseModuleState`.

**Owner:** `src/items.js`

| parametre | kodda gerçek değer |
|---|---|
| `eyeCount (item kaydı)` | 2 / 3 |
| `bodyItems alanları` | sideItemKey, horizontalItemKey, glassShelfItemKey |

Property listesi:

- `static.bodyItems.glassShelfItemKey`
- `static.bodyItems.horizontalItemKey`
- `static.bodyItems.sideItemKey`
- `static.eyeCount`
- `catalog.eyeCount`
- `state.bodySurface`
- `state.eyeCount`
- `parents.showcaseBody`

<a id="short-up"></a>

### Short-up duvar varyantı

**Property adedi:** 2

**Sade açıklama:** Kısa dikme ailesi: short-up-1 (49,5 cm dikme) ve short-up-2 (99 cm dikme). Joint snap hedefi.

**Nerede:** `src/items.js` `isShortUpFamilyDescriptor`, `src/moduleBehavior.js` `magneticSnap: short-up-joint`.

**Owner:** `src/items.js`

| parametre | kodda gerçek değer |
|---|---|
| `variant (item kaydı)` | short-up-1 / short-up-2 |
| `recipe dikme (çözülen recipe child)` | short-up-1 recipe → upright_49_5; short-up-2 recipe → upright_99 |
| `moduleType` | wall-short-up-1 / wall-short-up-2 |

Property listesi:

- `static.variant`
- `catalog.variant`

<a id="sahne-feature"></a>

### Sahne feature sözleşmesi

**Property adedi:** 1

**Sade açıklama:** Stand kurulurken otomatik duvar veya depo içeriği üretmek. Item form alanı değil.

**Nerede:** `src/featureContracts.js` `FEATURE_CONTRACTS`, `src/automaticWall.js`, `src/autoDepot.js`.

**Owner:** `src/featureContracts.js`

| parametre | kodda gerçek değer |
|---|---|
| `feature id` | automatic-depot, automatic-wall |
| `automatic-depot sizeKey` | 100x100 = 100×100 cm (1 × 1 m) · 150x100 = 150×100 cm (1,5 × 1 m) · 200x100 = 200×100 cm (2 × 1 m) · 200x200 = 200×200 cm (2 × 2 m) |
| `planAutomaticDepot sizeKey default` | 100x100 |
| `automatic-depot içerik catalog keys` | MINI_FRIDGE_AVANTI, KETTLE, COAT_RACK, PLASTIC_TRASH_BIN |

Property listesi:

- `featureContracts`

<a id="audit-kanit"></a>

### Audit kanıt sütunu (çalışan mekanizma değil)

**Property adedi:** 5

**Sade açıklama:** Önceki taramanın rg/definition sonucu. Runtime’da okunmaz. Silinmedi; 188 sütunun parçası.

**Nerede:** `docs/items/audit` üreticisi + `rg` itemKey taraması.

**Owner:** `docs/items/audit`

| parametre | kodda gerçek değer |
|---|---|
| `çalışan parametre` | yok — önceki taramanın rg/definition sütunu; runtime okumaz |

Property listesi:

- `docs.definition`
- `tests.srcHits`
- `tests.unitHits`
- `tests.e2eHits`
- `tests.docHits`

## Property → mekanizma

| property | mekanizma |
|---|---|
| `itemKey` | Item kimliği (`item-kimlik`) |
| `name` | Item kimliği (`item-kimlik`) |
| `type` | Item kimliği (`item-kimlik`) |
| `registry` | Item kimliği (`item-kimlik`) |
| `static.bodyItems.glassShelfItemKey` | Vitrin gövdesi (`vitrin-govde`) |
| `static.bodyItems.horizontalItemKey` | Vitrin gövdesi (`vitrin-govde`) |
| `static.bodyItems.sideItemKey` | Vitrin gövdesi (`vitrin-govde`) |
| `static.composition.items` | BOM ve recipe (`bom-recipe`) |
| `static.composition.mode` | BOM ve recipe (`bom-recipe`) |
| `static.composition.moduleType` | BOM ve recipe (`bom-recipe`) |
| `static.composition.nominalWidthCm` | BOM ve recipe (`bom-recipe`) |
| `static.composition.options.shape` | BOM ve recipe (`bom-recipe`) |
| `static.composition.options.shelfCount` | BOM ve recipe (`bom-recipe`) |
| `static.connectorType` | BOM ve recipe (`bom-recipe`) |
| `static.defaultColor` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `static.dimensions.catalogHeightCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.depthCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.heightCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.lengthCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.mountHeightCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.screenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.dimensions.screenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.dimensions.tableDiameterCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.thicknessCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.wallGapCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.dimensions.widthCm` | Kanonik ölçü kaydı (`kanonik-olcu`) |
| `static.eyeCount` | Vitrin gövdesi (`vitrin-govde`) |
| `static.material` | 3D çizim dalı (`sahne-renderer`) |
| `static.modelFile` | 3D çizim dalı (`sahne-renderer`) |
| `static.modelRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `static.nominalModuleWidthCm` | BOM ve recipe (`bom-recipe`) |
| `static.paintable` | Zemin seçimi ve boyası (`zemin`) |
| `static.panelRole` | BOM ve recipe (`bom-recipe`) |
| `static.preserveModelScale` | 3D çizim dalı (`sahne-renderer`) |
| `static.shape` | Runtime module state fabrikası (`modul-factory`) |
| `static.shelfCount` | BOM ve recipe (`bom-recipe`) |
| `static.sizeInch` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.stripOccupancy.align` | Şerit doluluğu (`strip-occupancy`) |
| `static.stripOccupancy.stripCount` | Şerit doluluğu (`strip-occupancy`) |
| `static.unit` | BOM ve recipe (`bom-recipe`) |
| `static.variant` | Short-up duvar varyantı (`short-up`) |
| `static.videoWall.cols` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.videoWall.panelScreenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.videoWall.panelScreenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.videoWall.rows` | TV / video wall ölçüsü (`tv-video-wall`) |
| `static.visualRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `catalog.present` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.inKeysList` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.groups` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.depthCm` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.eyeCount` | Vitrin gövdesi (`vitrin-govde`) |
| `catalog.heightCm` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.itemKey` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.label` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.modelFile` | 3D çizim dalı (`sahne-renderer`) |
| `catalog.modelRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `catalog.panelScreenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.panelScreenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.preserveModelScale` | 3D çizim dalı (`sahne-renderer`) |
| `catalog.screenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.screenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.shape` | Runtime module state fabrikası (`modul-factory`) |
| `catalog.shelfCount` | BOM ve recipe (`bom-recipe`) |
| `catalog.sizeInch` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.stripOccupancy.align` | Şerit doluluğu (`strip-occupancy`) |
| `catalog.stripOccupancy.stripCount` | Şerit doluluğu (`strip-occupancy`) |
| `catalog.type` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `catalog.unit` | BOM ve recipe (`bom-recipe`) |
| `catalog.variant` | Short-up duvar varyantı (`short-up`) |
| `catalog.videoWallCols` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.videoWallRows` | TV / video wall ölçüsü (`tv-video-wall`) |
| `catalog.visualRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `catalog.widthCm` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `contract.present` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.profile` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.appearance.color` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.appearance.image` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.renderer.mode` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.runtime.mode` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.composition.mode` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.bom.mode` | BOM ve recipe (`bom-recipe`) |
| `contract.bom.source` | BOM ve recipe (`bom-recipe`) |
| `contract.bom.reason` | BOM ve recipe (`bom-recipe`) |
| `contract.state.owner` | Modül sözleşmesi (`modul-sozlesme`) |
| `contract.state.persistence` | Modül sözleşmesi (`modul-sozlesme`) |
| `behavior.allowSideInsert` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.boundarySnap` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.collision` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.collisionDepth` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.collisionHeight` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.connectionEndpoint` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `item.defaultRotationDeg` | Sahne Z (`docs/refactor/ROTATION.md`) |
| `behavior.endpointContact` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.ghost.kind` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.ghost.opacity` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.ghost.renderer` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.magneticSnap` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.moveSnapCm` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.overlapWithTypes` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.placement` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `item.rotationStepDeg` | Sahne Z (`docs/refactor/ROTATION.md`) |
| `item.sideInsertRotation` | Sahne Z (`docs/refactor/ROTATION.md`) |
| `behavior.supportsWallOverlayMount` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.wallCapacity` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.explicitTypeEntry` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.collisionHeightRange` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `behavior.stripOccupancyResolved` | Şerit doluluğu (`strip-occupancy`) |
| `capabilities.color` | Item yüzey capability tablosu (`yuzey-capability-tablosu`) |
| `capabilities.image` | Item yüzey capability tablosu (`yuzey-capability-tablosu`) |
| `capabilities.glass` | Item yüzey capability tablosu (`yuzey-capability-tablosu`) |
| `capabilities.lightbox` | Item yüzey capability tablosu (`yuzey-capability-tablosu`) |
| `capabilities.mesh` | Item yüzey capability tablosu (`yuzey-capability-tablosu`) |
| `factory.fn` | Runtime module state fabrikası (`modul-factory`) |
| `factory.ok` | Runtime module state fabrikası (`modul-factory`) |
| `factory.reason` | Runtime module state fabrikası (`modul-factory`) |
| `factory.stateKeys` | Runtime module state fabrikası (`modul-factory`) |
| `state.bodySurface` | Vitrin gövdesi (`vitrin-govde`) |
| `state.chairCount` | Runtime module state fabrikası (`modul-factory`) |
| `state.depthCm` | Runtime module state fabrikası (`modul-factory`) |
| `state.eyeCount` | Vitrin gövdesi (`vitrin-govde`) |
| `state.faces` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `state.haloColor` | Işıklı strafor (`isikli-strafor`) |
| `state.heightCm` | Runtime module state fabrikası (`modul-factory`) |
| `state.imageAssetId` | Işıklı strafor (`isikli-strafor`) |
| `state.itemKey` | Item kimliği (`item-kimlik`) |
| `state.modelFile` | 3D çizim dalı (`sahne-renderer`) |
| `state.modelRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `state.panelScreenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.panelScreenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.preserveModelScale` | 3D çizim dalı (`sahne-renderer`) |
| `state.screenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.screenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.shape` | Runtime module state fabrikası (`modul-factory`) |
| `state.shelfCount` | BOM ve recipe (`bom-recipe`) |
| `state.shelfLightingOn` | Raf altı ışık (`raf-isigi`) |
| `state.sizeInch` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.stripOccupancy` | Şerit doluluğu (`strip-occupancy`) |
| `state.stripOccupancy.align` | Şerit doluluğu (`strip-occupancy`) |
| `state.stripOccupancy.stripCount` | Şerit doluluğu (`strip-occupancy`) |
| `state.strips` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `state.surface` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `state.type` | Item kimliği (`item-kimlik`) |
| `state.videoWallCols` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.videoWallRows` | TV / video wall ölçüsü (`tv-video-wall`) |
| `state.visualRotationYDeg` | 3D çizim dalı (`sahne-renderer`) |
| `state.wallGapCm` | Işıklı strafor (`isikli-strafor`) |
| `state.widthCm` | Runtime module state fabrikası (`modul-factory`) |
| `bom.ok` | BOM ve recipe (`bom-recipe`) |
| `bom.error` | BOM ve recipe (`bom-recipe`) |
| `bom.lineCount` | BOM ve recipe (`bom-recipe`) |
| `bom.lines` | BOM ve recipe (`bom-recipe`) |
| `recipe.id` | BOM ve recipe (`bom-recipe`) |
| `recipe.moduleType` | BOM ve recipe (`bom-recipe`) |
| `recipe.connectionMode` | BOM ve recipe (`bom-recipe`) |
| `recipe.innerCornerPanelItemKey` | BOM ve recipe (`bom-recipe`) |
| `parents.recipe` | BOM ve recipe (`bom-recipe`) |
| `parents.innerCorner` | BOM ve recipe (`bom-recipe`) |
| `parents.replacement` | BOM ve recipe (`bom-recipe`) |
| `parents.cluster` | BOM ve recipe (`bom-recipe`) |
| `parents.showcaseBody` | Vitrin gövdesi (`vitrin-govde`) |
| `media.widthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `media.screenWidthCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `media.screenHeightCm` | TV / video wall ölçüsü (`tv-video-wall`) |
| `media.videoWallRows` | TV / video wall ölçüsü (`tv-video-wall`) |
| `media.videoWallCols` | TV / video wall ölçüsü (`tv-video-wall`) |
| `profile.catalogWidthCm` | BOM ve recipe (`bom-recipe`) |
| `renderer.fn` | 3D çizim dalı (`sahne-renderer`) |
| `ui.sidebar` | Katalog kartı ve sürükle-bırak (`katalog-yerlestirme`) |
| `ui.contextMenu.delete` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `ui.contextMenu.duplicate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `ui.contextMenu.add` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `ui.editable.color` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `ui.editable.image` | Yüzey rengi ve görseli (`yuzey-renk-gorsel`) |
| `ui.editable.glass` | Cam panel ve kumaş (lightbox/mesh) (`cam-kumas`) |
| `ui.editable.fabric` | Cam panel ve kumaş (lightbox/mesh) (`cam-kumas`) |
| `ui.editable.shelfLight` | Raf altı ışık (`raf-isigi`) |
| `ui.editable.foamResize` | Işıklı strafor (`isikli-strafor`) |
| `ui.editable.floorSelect` | Zemin seçimi ve boyası (`zemin`) |
| `ui.editable.placement` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `ui.editable.rotation` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) (`modul-davranis`) |
| `persist.projectBlob` | Proje kaydı (`proje-kayit`) |
| `persist.path` | Proje kaydı (`proje-kayit`) |
| `featureContracts` | Sahne feature sözleşmesi (`sahne-feature`) |
| `docs.definition` | Audit kanıt sütunu (çalışan mekanizma değil) (`audit-kanit`) |
| `tests.srcHits` | Audit kanıt sütunu (çalışan mekanizma değil) (`audit-kanit`) |
| `tests.unitHits` | Audit kanıt sütunu (çalışan mekanizma değil) (`audit-kanit`) |
| `tests.e2eHits` | Audit kanıt sütunu (çalışan mekanizma değil) (`audit-kanit`) |
| `tests.docHits` | Audit kanıt sütunu (çalışan mekanizma değil) (`audit-kanit`) |

## Hardcode örnekleri

### createUprightModuleState tek itemKey

src/designState.js createUprightModuleState → getItem('upright_346_5'); factory: upright: () => createUprightModuleState()

kayıtlı dikmeler: upright_346_5=346.5; upright_99=99; upright_49_5=49.5. Factory yalnız upright_346_5 üretir.

### Düz banko 45° yalnız 100/150/200

Item seed (`docs/refactor/ROTATION.md`): `desk_banko_100/150/200` step 45; `desk_banko_*_L` step 90 default 270. `STRAIGHT_COUNTER_WIDTHS_CM` ve type ezmesi yok.

### bar-stool ve tekli koltuk 45°

Item seed (`docs/refactor/ROTATION.md`): `furniture_bar_stool_classic` 45/270/default; `furniture_sofa_single_classic` 45/0/inherit. TYPE_BEHAVIORS rotation yok.

### LED tavan yerleşimi

TYPE_BEHAVIORS led-floodlight; TOP_LIGHT_ITEMS.led_floodlight dimensions

placement=top, moveSnapCm=20, wallCapacity=exclude; sahne Z Item (`led_floodlight` step 90). ölçü width/depth/height/mountHeightCm = 50/20/35/350; surface.color=#17191c

### plastic-trash-bin renderer dalı indoor-plant ile ortak

src/scene3d.js createRenderableModule: type === 'indoor-plant-1' || type === 'plastic-trash-bin'

ayrı createPlasticTrashBinModule adı yok; createIndoorPlantModule içinde type ayrımı var

### Cam yetkisi capability tablosundan gelmez

scene3d supportsGlass = selectionMode === 'panel'; itemCapabilities glass/lightbox/mesh hep false

door-leaf: {"color":true,"image":true,"glass":false,"lightbox":false,"mesh":false}; panel_98: {"color":false,"image":false,"glass":false,"lightbox":false,"mesh":false}

### Zemin fallback karolaj

src/items.js resolveStandFloorItemKey; src/scene3d.js currentFloorType = getFloorItem('karolaj').itemKey

karolaj

### Ghost opaklığı tek değer

DEFAULT_GHOST_BEHAVIOR opacity: 0.38 (tüm TYPE_BEHAVIORS ghost bu nesneyi paylaşır)

{"kind":"silhouette","renderer":"module-silhouette","opacity":0.38}

### connector_double varsayılan recipe’de yok

getExpandedModuleRecipe taraması; LEAF_ITEMS.connector_double kayıtlı, CONNECTOR_BY_TYPE.double eşler

çözülen recipe satırlarında connector_double yok

### Profil catalog genişliği ≠ lengthCm

getStraightWallNominalWidthForProfileItem: düz duvar recipe içindeki profil → recipe.nominalWidthCm

profile_41_5 lengthCm=41.5 catalogWidthCm=50; profile_91 lengthCm=91 catalogWidthCm=100; profile_140_5 lengthCm=140.5 catalogWidthCm=150; profile_190 lengthCm=190 catalogWidthCm=200

### designState şerit sayısı

Tam boy şerit `STAND_DIMENSIONS.stripCount` — `fair_stand_dimensions` bootstrap kaydı. Ayrı `STRIP_COUNT` sabiti yok.

STAND_DIMENSIONS.stripCount=7 (seed)

### Factory tablosunda olmayan kayıtlı type

MODULE_STATE_FACTORIES anahtarları vs listRegisteredItems().type

base-top, connector, counter-top, door-leaf, floor, panel, separator-panel, shelf-accessory, showcase-accessory, showcase-board

### separatorDefaultColor genişlik ayrımı

src/designState.js separatorDefaultColor: widthCm === 50 → separator_panel_48_5, aksi → separator_panel_98

50 cm ayrı; diğer genişlikler 98 cm panele düşer
