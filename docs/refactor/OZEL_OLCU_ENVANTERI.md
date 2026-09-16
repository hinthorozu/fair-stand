# Canonical 5 dışı ölçü envanteri

**Baseline:** `RefactorItem` @ `8462b92` (PR #172 merge)  
**Tarih:** 2026-09-16  
**Kapsam:** `src/` runtime kod + Item / Recipe / Catalog kayıtları  
**Bu belge:** yalnız analiz. Kod değişikliği yok. Silme / rename / yeni mimari önerisi yok.

Canonical 5 özel alan listesine alınmadı:

- `widthCm`
- `depthCm`
- `heightCm`
- `lengthCm`
- `thicknessCm`

Bunlar başka alandan türetildiyse yalnız zincir yazıldı.

**Sayım kuralı:** aynı isim birden fazla Item’da tekrar etse 1 field. Global config ayrı. Hardcoded literal ayrı site.

---

## Özet sayılar

| Küme | Sayı |
|---|---|
| Item üzerindeki özel named field/property | **17** |
| Global named dimension constant/config | **40** |
| Hardcoded spatial source (literal cluster) | **28** |
| Duplicate / ambiguous durum | **16** |

---

## Kategori anahtarı

| Kod | Anlam |
|---|---|
| A | PHYSICAL ITEM MEASUREMENT |
| B | SCENE FOOTPRINT |
| C | PLACEMENT / OFFSET / MOUNT |
| D | INTERNAL SUBCOMPONENT MEASUREMENT |
| E | CATALOG / UI PRESENTATION |
| F | BOM / COMPOSITION / NOMINAL |
| G | RENDERER-ONLY / MODEL FIT |
| H | SYSTEM SPACING / GRID / SNAP |
| I | DUPLICATE / LEGACY / AMBIGUOUS |

---

## Tablo

| Ad | Tür | Dosya | Item/Scope | Birim | Ne işe yarıyor | Source | Consumer | Kategori | Canonical 5 ile ilişki |
|---|---|---|---|---|---|---|---|---|---|
| `dimensions.screenWidthCm` | Item field | `src/items.js` | TV_42, TV_55, TV_65 | cm | Ekran genişliği; identity | Item.dimensions | `resolveWallMediaMetrics` → factory/catalog/renderer/identity | D (+ I) | TV’de `dimensions.widthCm` ile aynı sayı |
| `dimensions.screenHeightCm` | Item field | `src/items.js` | TV_42 / 55 / 65 | cm | Ekran yüksekliği | Item.dimensions | metrics, factory `state.screenHeightCm`, overlay z, renderer | D | `sceneDimensions.heightCm` ile aynı sayı |
| `dimensions.catalogHeightCm` | Item field | `src/items.js` | TV_42 / 55 / 65 | cm | Catalog kart yüksekliği | Item.dimensions = 350 | Catalog `descriptor.heightCm`; factory/scene **okumaz** | E | Canonical height değil; scene height `screenHeightCm` |
| `dimensions.tableDiameterCm` | Item field | `src/items.js` | `glass_table` | cm | Yuvarlak tabla çapı | Item.dimensions = 75 | `addProceduralGlassTable` | I | `widthCm` ve `depthCm` da 75; proxy `widthCm` kullanır |
| `dimensions.mountHeightCm` | Item field | `src/items.js` | `led_floodlight` | cm | Üst profil bağlama metni | Item.dimensions = 350 | `selectionFeedback`; `LED_FLOODLIGHT_DIMENSIONS` | C | Placement `zCm` bu alanı okumaz; STAND height 350 kullanır |
| `dimensions.wallGapCm` | Item field | `src/items.js` | `illuminated-foam` | cm | Duvar yüzü–gövde boşluğu | Item.dimensions = 1.5 | factory → `state.wallGapCm` → renderer Z | C | Canonical depth ayrı (3.5) |
| `videoWall.panelScreenWidthCm` | nested Item | `src/items.js` | VIDEO_WALL_2X2 / 3X3 | cm | Tek panel ekran eni | `videoWall` = 108.5 | metrics `screenWidthCm = panel × cols` | D | Scene `widthCm` = 217 / 325.5 |
| `videoWall.panelScreenHeightCm` | nested Item | `src/items.js` | VIDEO_WALL_2X2 / 3X3 | cm | Tek panel ekran boyu | `videoWall` = 61 | metrics `screenHeightCm = panel × rows` | D | Scene `heightCm` = 122 / 183 |
| `videoWall.rows` | nested Item | `src/items.js` | 2 video wall | unitless | Izgara satır | 2 / 3 | metrics, renderer panel grid | D | height üretimi |
| `videoWall.cols` | nested Item | `src/items.js` | 2 video wall | unitless | Izgara sütun | 2 / 3 | metrics, renderer panel grid | D | width üretimi |
| `sizeInch` | Item root | `src/items.js` | 5 wall-media | inch | Ticari diyagonal / identity | 42 / 55 / 65 | factory, catalog, `resolveItemKey` | A | cm üretmez |
| `nominalModuleWidthCm` | Item root | `src/items.js` | 23 leaf | cm | Leaf’in hangi nominal modüle bağlandığı | 50 / 100 / 150 / 200 | `getShelfLeafItem`, `getDoorLeafItem` | F | Leaf physical width/length ayrı |
| `composition.nominalWidthCm` | nested Item | `src/items.js` | 37 composite | cm | Recipe anahtarı | 50 / 100 / 150 / 200 | `itemBom` → `getExpandedModuleRecipe` | F | Composite `dimensions.widthCm` ile aynı sayı, farklı anlam |
| `stripOccupancy.align` | nested Item | `src/items.js` | 8 short-up | enum | Şerit hizası | `'top'` | `stripOccupancy.js` collision height + hanging preview | B | Canonical height yok (short-up) |
| `stripOccupancy.stripCount` | nested Item | `src/items.js` | 8 short-up | count | Kaplanan şerit | 1 veya 2 | occupancy height = count × STAND.stripHeight | B | Scene height yazılmaz |
| `shelfCount` | Item root | `src/items.js` | 6 raf duvar | count | Raf adedi / recipe key | 2 / 3 | factory, identity, `SHELF_DIMENSIONS.heightsByCountCm` | F | Y konumları Item’da yok |
| `eyeCount` | Item root | `src/items.js` | 2 vitrin | count | Açık göz / şerit sayısı | 2 / 3 | showcase renderer opening + cam raf Y | D | STAND strip grid üzerinden |
| `placement.xCm/yCm/zCm` | runtime | `src/modulePlacement.js` | her modül | cm | Konum | factory/drag | scene3d `applyPlacementToGroup` | C | Item field değil |
| `stand.xCm/yCm` | scene state | `src/standSetup.js` | stand | cm | Stand alanı | kullanıcı input, 50 katı | placement bounds, AutoDepot | H | Item değil |
| `Recipe.nominalWidthCm` | Recipe field | `src/moduleRecipes.js` | 46 recipe satırı | cm | Recipe genişlik anahtarı | 50 / 100 / 150 / 200 | BOM; runtime factory **okumaz** | F | Item composition ile kopya |
| `TV_42_DIMENSIONS.moduleWidthCm` | catalog alias | `src/catalog.js` | TV_42 | cm | metrics.widthCm kopyası | `resolveWallMediaMetrics` | export; runtime factory okumaz | E | = screenWidthCm = widthCm |
| `STAND_DIMENSIONS` | global object | `src/catalog.js` | stand/renderer | m | Stand zarfı + şerit + çerçeve | height 3.5, depth 0.1, stripCount 7, stripHeight 0.5, frameWidth 0.055, frameDepth 0.1 | ghost, collision fallback, overlay, panel/shelf/door/showcase mesh | H (+ I Item-specific sızıntı) | Wall scene depth/height ile 10/350 çakışır |
| `MODULE_WIDTHS_CM` | global array | `src/catalog.js` | duvar kompozisyonu | cm | `[50, 100, 150, 200]` | literal | `wall.js` `composeStraightWall` | H | Recipe/Item nominal ile aynı küme |
| `SHELF_DIMENSIONS` | global object | `src/catalog.js` | raf ailesi | cm | `widthsCm`, `heightsByCountCm` `{2:[100,150], 3:[100,150,200]}` | literal | `createShelfModule` raf Y | I | Raf leaf `lengthCm` 100/150/200 ile widths kopya; Y Item’da yok |
| `COUNTER_DIMENSIONS` | global alias | `src/catalog.js` | desk_banko_* | cm | Item canonical kopyası | `getItem('desk_banko_*').dimensions` | **src consumer yok** | I | Canonical 5 wrapper |
| `BASE_DIMENSIONS` | global alias | `src/catalog.js` | BASE_* | cm | Item canonical kopyası | Item.dimensions | test | I | Canonical 5 wrapper |
| `AUTO_DEPOT_SIZES` | global object | `src/autoDepot.js` | depo planı | cm | 100×100 / 150×100 / 200×100 / 200×200 | literal | `planAutomaticDepot` | H | Item değil |
| `MODULE_COLLISION_DEPTH_CM` | global const | `src/modulePlacement.js` | wall-backbone + fallback | cm | `STAND.depth * 100` = 10 | STAND | collision depth, thin-join, edge offset | B/H | Wall `sceneDimensions.depthCm` 10 ile aynı sayı |
| `MODULE_PLACEMENT_SNAP_CM` | global const | `src/modulePlacement.js` | default snap | cm | 50 | literal | `snapCm` default | H | |
| `MODULE_WALL_SNAP_DISTANCE_CM` | global const | `src/modulePlacement.js` | duvar manyetik | cm | 50 | literal | wall snap | H | |
| `MODULE_NEIGHBOR_SNAP_DISTANCE_CM` | global const | `src/modulePlacement.js` | komşu manyetik | cm | 30 | literal | neighbor snap | H | |
| `WALL_OVERLAY_DEFAULT_CENTER_CM` | global const | `src/modulePlacement.js` | tv/foam overlay | cm | 175 | literal | `clampWallOverlayZCm` | C | scene3d `1.75` m ile aynı değer, ayrı literal |
| `moveSnapCm` | type behavior | `src/moduleBehavior.js` | type aileleri | cm | 50 / 10 / 20 | TYPE_BEHAVIORS | drag snap | H | floodlight 20 ayrı literal de scene3d’de |
| `STRIP_COUNT` | local const | `src/designState.js` | panel strip state | count | 7 | literal | factory strip dizisi | I | `STAND_DIMENSIONS.stripCount` ile aynı, ayrı sabit |
| `SCENE_SURROUND_M` | global const | `src/sceneDimensions.js` | sahne çevresi | m | 1 | literal | stage size | H | Item `sceneDimensions` değil |
| `MIN/MAX/STEP_STAND_*` | global const | `src/standSetup.js` | stand input | cm | 50 / 5000 / 50 | literal | `validateStandSetup` | H | |
| `PANEL_VERTICAL_PROFILE_WIDTH_M` | renderer const | `src/scene3d.js` | duvar ailesi mesh | m | 0.040 | literal | panel/shelf/door/showcase/counter iç genişlik | G | Item thickness 8 cm dikme ile aynı şey değil |
| `PANEL_RAIL_HEIGHT_M` | renderer const | `src/scene3d.js` | yatay ray | m | 0.004 | literal | panel yükseklik hesabı | G | |
| `PANEL_VERTICAL_CLEARANCE_M` | renderer const | `src/scene3d.js` | ray-panel boşluk | m | 0 | literal | panelHeight | G | |
| `ACTIVE_PLATFORM_HEIGHT_M` | renderer const | `src/scene3d.js` | zemin platform | m | 0.05 | literal | world Y, overlay hit | H | |
| `FLOOR_TOP_EPSILON_M` | renderer const | `src/scene3d.js` | zemin çizgi Y | m | 0.006 | literal | parquet/tile lines | G | |
| `EAMES_CHAIR_TARGET_HEIGHT_M` | renderer const | `src/scene3d.js` | masa+sandalye seti sandalye | m | 0.82 | literal | Box3 uniform scale | G | `chair_eames.heightCm` 82 ile aynı sayı, set path Item height okumaz |
| `DEFAULT_VIEW_MIN_DISTANCE` | renderer const | `src/scene3d.js` | kamera | sahne birimi | 9 | literal | orbit min | H | Item değil |

---

## Item özel alanları — teknik not

### `screenWidthCm` — D / I

- **Yer:** `WALL_MEDIA_ITEMS.*.dimensions` (3 TV). Video wall Item.dimensions’ta yok; metrics `panel × cols` üretir.
- **Tip/değer:** number cm. 93.0 / 121.8 / 143.9. VW türetilmiş: 217 / 325.5.
- **Yazan:** Item kaydı. Runtime: `createTvModuleState` `metrics.screenWidthCm`.
- **Okuyan:** `resolveWallMediaMetrics`, Catalog projection, `resolveItemKey` (tv ayrımı), `createTvModule` (`|| 93` fallback).
- **Etki:** TV’de `metrics.widthCm = screenWidthCm` → `applySceneFootprint` `state.widthCm`. Collision/placement bu `state.widthCm` kullanır. Renderer ekran mesh’i `screenWidthCm` okur.
- Physical ekran: evet. Scene footprint: TV’de evet (width kopyası). BOM: hayır.
- **Kaldırılırsa:** TV identity + renderer ekran eni + metrics.width kopar.

### `screenHeightCm` — D

- **Değer:** 52.3 / 68.5 / 80.9. VW: 122 / 183.
- **Zincir:** Item → metrics → `state.screenHeightCm` + `sceneDimensions.heightCm` (TV’de aynı sayı) → `state.heightCm`. Overlay z hesabı `screenHeightCm ?? heightCm ?? 52.3`. Renderer ekran boyu.
- Physical ekran: evet. Catalog kart yüksekliği değil.

### `catalogHeightCm` — E (TV); video-wall metrics’te I

- **Kayıt:** yalnız 3 TV Item.dimensions, hepsi **350**.
- Catalog: `descriptor.heightCm = media.catalogHeightCm` (TV kartı 350).
- Factory `applySceneFootprint` bu alanı okumaz. Scene height TV’de `sceneDimensions.heightCm` (= ekran).
- Video wall Item.dimensions’ta `catalogHeightCm` **yok**. `resolveWallMediaMetrics` VW için `catalogHeightCm: screenHeightCm` üretir (122/183). Aynı isim TV’de stand-yüksekliği kartı, VW’de toplam ekran.
- **AMBIGUOUS isim:** TV Catalog UI 350 vs VW türetilmiş ekran yüksekliği.

### `tableDiameterCm` — I (physical çap + canonical kopya)

- `glass_table.dimensions`: width 75, depth 75, height 74, **tableDiameterCm 75**.
- Görsel silindir: `tableDiameterCm ?? widthCm`. Hit proxy: `widthCm / 200`. Collision `state.widthCm/depthCm` (canonical).
- **Kaldırılırsa:** tabla görseli `widthCm`’e düşer; footprint bozulmaz.

### `mountHeightCm` — C (metin; placement SOT değil)

- `led_floodlight.dimensions.mountHeightCm = 350`. Body `heightCm = 35`.
- Catalog projection **kopyalamaz** (`lightingItemsContract`: catalog/state’te yok).
- Okuyan: `selectionFeedback` cümlesi; `LED_FLOODLIGHT_DIMENSIONS` (test).
- Placement: `snapTopFixturePlacement` / drag `zCm: Math.round(STAND_DIMENSIONS.height * 100)` = 350. `main.js` duplicate `zCm: 350` literal.
- **AMBIGUOUS:** alan adı montaj yüksekliği; runtime montaj STAND height / hardcoded 350.

### `wallGapCm` — C

- `illuminated-foam.dimensions.wallGapCm = 1.5`. Factory `state.wallGapCm`. Renderer `wallGapCm || 1.5` → Z ofset. Canonical depth 3.5 ayrı.

### `videoWall.panelScreenWidthCm` / `panelScreenHeightCm` / `rows` / `cols` — D

- 2X2: 2×2 × 108.5×61 → scene `{widthCm:217, heightCm:122}`.
- 3X3: 325.5×183.
- Kod çarpımı scene kaydıyla **eşit**.
- `sizeInch: 55` her iki VW’de var; panel diyagonalinden türetilmez.

### `sizeInch` — A

- 42 / 55 / 65.
- `TV_SIZE_INCH_TO_ITEM_KEY` yalnız 42→TV_42, 55→TV_55, 65→TV_65.
- Video wall **itemKey** ister.
- Identity’de `sizeInch` + `screenWidthCm` TV_55 vs VW ayrımı yapar.
- **AMBIGUOUS:** VW `sizeInch: 55` panel 108.5×61 ile üretilmez; TV_55 ile aynı inch, farklı ekran.

### `nominalModuleWidthCm` — F

- 23 leaf. BOM/composition anahtarı. Factory scene width buradan gelmez.
- `getShelfLeafItem(moduleState.widthCm)` leaf’i bu alanla eşler.

### `composition.nominalWidthCm` — F

- 37 composite. `itemBom.resolveRecipe` → Recipe.
- Composite `dimensions.widthCm` ile sayı çoğu kez aynı; anlam recipe key.

### `stripOccupancy` — B

- 8 short-up. `{align:'top', stripCount:1|2}`.
- Height = `stripCount * STAND.stripHeightCm` (50).
- `getModuleCollisionHeightRangeCm` önce occupancy.
- Scene `heightCm` yazılmaz (`sceneDimensions` yalnız `depthCm:10`).
- Preview: `68 * stripCount / stand.stripCount` px.

### `shelfCount` — F

- 6 Item.
- Renderer Y: **`SHELF_DIMENSIONS.heightsByCountCm`**, leaf `dimensions` değil.
- Leaf `depthCm:38`, `thicknessCm:1.8` board geometrisi.

### `eyeCount` — D

- 2 / 3.
- Opening: `eyeCount===3 ? startStrip 1 : 2`, `openingStripCount = eyeCount`.
- Cam raf Y opening band içinde.

---

## Item’a ait olanlar (canonical 5 hariç)

Hepsi kodda doğrulandı.

| Alan | Item property? | Konum | Kaç Item |
|---|---|---|---|
| `screenWidthCm` | evet | `dimensions` | 3 (TV). VW’de dimensions’ta yok, metrics üretir |
| `screenHeightCm` | evet | `dimensions` | 3 TV |
| `catalogHeightCm` | evet | `dimensions` | 3 TV |
| `tableDiameterCm` | evet | `dimensions` | 1 |
| `mountHeightCm` | evet | `dimensions` | 1 |
| `wallGapCm` | evet | `dimensions` | 1 |
| `panelScreenWidthCm` | evet | `videoWall` nested | 2 |
| `panelScreenHeightCm` | evet | `videoWall` nested | 2 |
| `videoWall.rows/cols` | evet | nested | 2 |
| `sizeInch` | evet | **root** (dimensions değil) | 5 |
| `nominalModuleWidthCm` | evet | **root** | 23 |
| `composition.nominalWidthCm` | evet | nested config | 37 |
| `stripOccupancy` | evet | nested `{align, stripCount}` | 8 |
| `shelfCount` | evet | root | 6 |
| `eyeCount` | evet | root | 2 |

`preserveModelScale` (5 Item, boolean) ölçü field değil; GLB’nin Box3 ile sığdırılıp sığdırılmayacağını seçer.

---

## Item dışındaki ölçü kaynakları

### Recipe — `src/moduleRecipes.js`

- Her recipe `nominalWidthCm` (46 satır).
- Shelf recipe ayrıca `shelfCount`.
- `getStraightWallNominalWidthForProfileItem`: tanımlı; **src çağıranı yok** (PR #172 sonrası factory/catalog yasak). Testler `doesNotMatch`.

### Catalog — `src/catalog.js`

- TV path: `descriptor.heightCm = catalogHeightCm` (350), `widthCm = media.widthCm` (ekran).
- Diğerleri: `assignCatalogFootprint` → `resolveSceneDimensions` (canonical 5 same-field).
- `TV_42_DIMENSIONS.heightCm` = catalogHeightCm (scene height değil).
- `COUNTER_DIMENSIONS`: **hiçbir src dosyası import etmez**.
- `BASE_DIMENSIONS` / `LED_FLOODLIGHT_DIMENSIONS` / furniture `*_DIMENSIONS`: Item.dimensions re-export.
- `glass_table_DIMENSIONS` `tableDiameterCm` içerir.

### Globals

STAND / MODULE_WIDTHS / SHELF / snap / collision / surround / stand min-max-step / STRIP_COUNT / PANEL_* / platform.

### Renderer — `src/scene3d.js`

- Upright görsel: `STAND` `BoxGeometry(frameDepth, frameHeight, frameDepth)` = **10×350×10 cm**. Scene state 8×8×346.5. Yorum: üretim değişmez.
- Profile görsel: STAND height/depth ray; scene width 50/100/150/200.
- TV fallback literal: `93`, `52.3`, depth `5`. Overlay `centerYM = 1.75`.
- Foam fallback: width 200, height 50, depth 3.5, gap 1.5, `centerYM = 1.75`.
- Glass table procedural: tabla kalınlığı 0.018 m, gövde 0.035–0.045×0.70, kaide 0.22/0.24×0.035 — Item’da yok.
- Coffee table procedural benzer + `z: 0.10`.
- Floodlight procedural metreler (0.13, 0.305, …) — `dimensions.width/depth/height` proxy kutu; mesh Item cm okumaz.
- Sofa: `chairGapM = 0.20`; Box3 fit `sizeCorrection` 1.40 / 1.25.
- İç genişlik `- 0.012`; panelDepth `depth - 0.026`; doorPanel `- 0.018`.
- Box3: fridge height-fit; indoor-plant `preserveModelScale===false` ise min-axis fit; Eames set `EAMES_CHAIR_TARGET_HEIGHT_M`; coat-rack/kettle/bar-stool bbox center, scale yok.

### Collision / snap

- Collision depth: wall-backbone → 10; değilse `module.depthCm` → `resolveSceneDimensions.depthCm` → STAND 10.
- Collision height: occupancy → `module.heightCm` → scene height → STAND 350 LEGACY.
- Snap: 50 / 30 / type `moveSnapCm` 50/10/20; top fixture ayrıca `stepCm = 20`.

### Model bbox

GLB ölçü SOT değil. `preserveModelScale: true` (3 saksı) mesh native; `false` Item w/d/h kutusuna sığdırır.

### Scene state

- `stand.xCm/yCm`
- `placement.xCm/yCm/zCm`
- overlay `zCm` 175 merkezli clamp
- `imageTransform.offsetX/Y` **UV**, cm değil — spatial field sayılmadı

### AutoDepot

`AUTO_DEPOT_SIZES` + local `gapCm = 6` + `door(..., widthCm: 100)` + 150/200 ön yüzde 50/100 panel. İçerik w/d Item.dimensions.

### Catalog UI preview — `src/moduleDragSidebar.js`

`previewWidthPx = round((widthCm/350)*68)`, min 12, fallback 24. Raf `top` px `[47,37,27]`. CSS yükseklikleri (68, 34, …) cm değil.

### Floor

- `karolaj` tile `widthCm` grid
- parke `lengthCm` / `depthCm` plank
- hali repeat `stageM / 0.7`
- `hali` physical dimensions **yok**

---

## Special field → canonical / runtime zincir

```text
screenWidthCm (TV dimensions)
→ resolveWallMediaMetrics().widthCm
→ applySceneFootprint → moduleState.widthCm
→ placement interval / collision / catalog width
→ identity (tv hariç width kullanılır; tv’de screenWidthCm identity)

screenHeightCm (TV dimensions)
→ metrics.screenHeightCm
→ state.screenHeightCm
→ sceneDimensions.heightCm (aynı sayı, ayrı kayıt) → state.heightCm
→ overlay clamp + collision height
→ renderer ekran yüksekliği (ayrı okuma: screenHeightCm ?? heightCm ?? 52.3)

catalogHeightCm (TV 350)
→ resolveWallMediaMetrics().catalogHeightCm
→ Catalog descriptor.heightCm
→ scene/factory/collision YOK

videoWall.panelScreen* × rows/cols
→ metrics.screenWidth/Height + metrics.widthCm
→ Item.sceneDimensions.width/height (kayıtlı, çarpımla eşit)
→ applySceneFootprint state.width/height
→ collision / overlay
→ renderer panel grid (panelScreen* ayrı)

tableDiameterCm
→ addProceduralGlassTable radius
→ scene footprint ETKİLENMİYOR (state width/depth canonical 75)

mountHeightCm
→ selectionFeedback metni
→ placement zCm ETKİLENMİYOR
→ STAND_DIMENSIONS.height * 100  ve/veya literal 350 → placement.zCm → group.position.y

wallGapCm
→ state.wallGapCm
→ createIlluminatedFoamModule Z ofset
→ width/height/depth canonical; gap footprint değil

stripOccupancy.stripCount + align
→ getStripOccupancyHeightRangeCm
→ stripCount * STAND.stripHeightCm (50)
→ collision min/max
→ renderer hanging frame Y
→ state.heightCm yazılmıyor

nominalModuleWidthCm
→ getShelfLeafItem / getDoorLeafItem
→ leaf physical length/width (canonical)
→ shelf board mesh
→ composite scene width değil

composition.nominalWidthCm
→ itemBom → Recipe
→ leaf quantity listesi
→ runtime state.widthCm değil (factory resolveSceneDimensions)

sizeInch
→ createTvModuleState key (TV_42/55/65)
→ resolveItemKey
→ cm yok

shelfCount
→ Recipe key + SHELF_DIMENSIONS.heightsByCountCm
→ raf Y (100/150/200 cm)
→ leaf thickness/depth canonical

eyeCount
→ openingStartStrip / openingStripCount
→ cam raf Y
```

---

## Duplicate / çakışma (karar yok, kanıt)

| # | SOURCE A | SOURCE B | Aynı mı? | Consumer | Hangisi kayıtlı SOT gibi duruyor |
|---|---|---|---|---|---|
| 1 | TV `screenWidthCm` | TV `dimensions.widthCm` | evet (93 / 121.8 / 143.9) | metrics her ikisini de okur; width metrics’te screen’den yazılır | Item’da iki kopya |
| 2 | TV `screenHeightCm` | `sceneDimensions.heightCm` | evet | footprint scene; renderer screen ?? height | İki kopya |
| 3 | TV `catalogHeightCm` 350 | scene `heightCm` 52.3 / 68.5 / 80.9 | **hayır** | Catalog kart vs collision/render | Farklı anlam, benzer isim |
| 4 | VW metrics `catalogHeightCm` | TV `catalogHeightCm` | **hayır** (122/183 vs 350) | Catalog `descriptor.heightCm` | Aynı field adı, farklı semantik |
| 5 | VW `sceneDimensions` 217×122 / 325.5×183 | `panel × grid` | evet | factory scene; renderer panel | Kayıt + türetim birlikte |
| 6 | `tableDiameterCm` 75 | `widthCm` / `depthCm` 75 | evet | görsel çap vs proxy/collision kutu | İki kopya |
| 7 | `mountHeightCm` 350 | `STAND.height*100` ve `zCm: 350` | sayı evet, okuma yolu hayır | feedback vs placement | Placement STAND/literal |
| 8 | `composition.nominalWidthCm` | Recipe `nominalWidthCm` | evet (eşleşen satır) | BOM | Item composition + Recipe tablosu |
| 9 | `nominalModuleWidthCm` | parent `dimensions.widthCm` / MODULE_WIDTHS | 50/100/150/200 kümesi | leaf lookup vs scene | Leaf physical (48.5 vs 50) farklı |
| 10 | `STRIP_COUNT = 7` | `STAND_DIMENSIONS.stripCount = 7` | evet | factory strips vs occupancy/renderer | İki sabit |
| 11 | Wall `sceneDimensions.depthCm/heightCm` 10/350 | STAND 0.1 m / 3.5 m | evet | factory scene vs renderer çerçeve | Item scene + global |
| 12 | `MODULE_COLLISION_DEPTH_CM` 10 | wall scene depth 10 | evet | backbone her zaman constant | Global, Item değil |
| 13 | `WALL_OVERLAY_DEFAULT_CENTER_CM` 175 | scene3d `1.75` | evet | clamp vs hit offset | İki literal |
| 14 | `SHELF_DIMENSIONS.widthsCm` | `shelf_* .lengthCm` / module width | 100/150/200 | renderer Y ayrı map | widths kopya; Y yalnız global |
| 15 | `COUNTER_DIMENSIONS` | `desk_banko_*.dimensions` | evet | A unused, B factory | Dead alias |
| 16 | Upright mesh 10×10×350 | scene 8×8×346.5 + physical length 346.5 / thickness 8 | **hayır** | renderer STAND; collision scene | Bilinçli görsel ezme |

`getStraightWallNominalWidthForProfileItem` artık footprint üretmez; profil `sceneDimensions.widthCm` 50/100/150/200.

---

## Hardcoded spatial (named const değil)

1. TV renderer `93` / `52.3` / `5`
2. Foam `200` / `50` / `3.5` / `1.5`
3. Overlay `defaultCenterM = 1.75` (3 site)
4. Foam/TV `STAND.depth/2 + 0.0015`
5. `innerWidth - 0.012`
6. `panelDepth = depth - 0.026`
7. `doorPanelHeight - 0.018`
8. Glass/coffee procedural metreler
9. Floodlight procedural metreler
10. Sofa `chairGapM = 0.20`, scale 1.40/1.25, table `z: 0.10`
11. AutoDepot `gapCm = 6`, kapı 100, 50/100 ön panel
12. `wall.js` min/step 50
13. `main.js` floodlight duplicate `zCm: 350`, `deltaCm: 20`
14. Carpet repeat `/ 0.7`
15. Preview `(width/350)*68`, raf px 47/37/27
16. Halo plane `* 1.10` / `* 1.18`
17. Camera `near = max(55, diagonal*1.25+18)`
18. Foam factory `Math.max(10|5, …)`
19. Ghost min depth 0.02 / 0.08
20. Top fixture `stepCm = 20` (scene3d, behavior 20 ile paralel)
21. `EPSILON_CM = 0.001` (placement + wallReflow + moduleMove)
22. Showcase `openingStartStrip` 1 veya 2
23. Box3 derived size (fridge, plant, sofa, eames set, foam SVG)
24. `ACTIVE_WALL_GUIDE_*` 0.045 / 0.018
25. Floor `FLOOR_TOP_EPSILON_M`
26. `PANEL_VERTICAL_PROFILE_WIDTH_M` 0.040 (4 cm dikey profil görseli)
27. Kettle Y = `MINI_FRIDGE heightCm` (canonical okuma, hardcoded değil)
28. `createDefaultImageTransform` UV 0/1 — spatial cm değil

---

## 17 soru

1. **Canonical 5 dışında kaç named spatial field?** Item kaydında **17**. Runtime ek isimler: `placement.xCm/yCm/zCm`, `stand.xCm/yCm`, Catalog `moduleWidthCm` → toplam unique name **23**. ModuleState, Item özel alanlarının kopyasını da taşır (`screen*`, `panelScreen*`, `videoWallRows/Cols`, `sizeInch`, `wallGapCm`).

2. **Kaçı Item’a ait?** **17** named Item field.

3. **Kaçı Item dışında?** Global named config **40**; Recipe `nominalWidthCm` (composition’ın kopyası); 28 hardcoded site; scene placement/stand.

4. **Kaçı physical (A)?** Doğrudan ürün ölçüsü: `sizeInch`, `screenWidthCm`, `screenHeightCm`, `tableDiameterCm`, `panelScreenWidthCm`, `panelScreenHeightCm` → **6**. (Screen/panel aynı zamanda alt parça.)

5. **Kaçı scene footprint (B)?** Item’da `stripOccupancy` (**2** alt alan). Footprint’in asıl cm’i canonical `sceneDimensions` / `state.width|depth|height` (bu raporda sayılmadı). Collision fallback STAND 350/10 Item dışı B/H.

6. **Kaçı placement/offset (C)?** Item: `mountHeightCm`, `wallGapCm` (**2**). Runtime: placement xyz, overlay 175/1.75, AutoDepot gap 6.

7. **Kaçı Catalog/UI (E)?** `catalogHeightCm` (3 TV); `TV_42_DIMENSIONS`; preview px formülü; Catalog `descriptor.heightCm` TV path.

8. **Kaçı renderer/model-only (G)?** PANEL_* / platform / floor epsilon / EAMES 0.82 / sofa correction / upright-profile STAND mesh / floodlight-glass procedural / Box3 fit / preview CSS.

9. **Kaçı BOM/Recipe nominal (F)?** `nominalModuleWidthCm`, `composition.nominalWidthCm`, Recipe `nominalWidthCm`, `shelfCount` (recipe key).

10. **Kaçı duplicate/ambiguous?** **16** tablo satırı.

11. **Canonical 5’e değer üreten özel alanlar:**
    - `screenWidthCm` → `widthCm` (metrics + TV kayıtlı width kopyası)
    - `screenHeightCm` → `sceneDimensions.heightCm` → `state.heightCm`
    - `panel × rows/cols` → metrics width/height ve kayıtlı `sceneDimensions` width/height
    - `catalogHeightCm` canonical scene height **üretmez**
    - `tableDiameterCm` canonical **üretmez**
    - `stripOccupancy` canonical height **yazmaz**; collision height üretir

12. **Yalnız alt parça:** `panelScreen*`, `videoWall.rows/cols` (ızgara), `eyeCount`, leaf board/shelf thickness kullanımı, `wallGapCm` (boşluk, ürün gövdesi değil). TV `screen*` hem alt parça hem (width/height üzerinden) footprint.

13. **Hâlâ Item-specific spatial taşıyan globaller:** `SHELF_DIMENSIONS.heightsByCountCm` (raf Y); `SHELF_DIMENSIONS.widthsCm` (raf genişlik kopyası); upright/profile renderer’ın STAND 10×350 görseli (Item scene 8×346.5 / 50–200×8×350 ile çakışır); `TV_42_DIMENSIONS` / `LED_FLOODLIGHT_DIMENSIONS.mountHeightCm`; `EAMES_CHAIR_TARGET_HEIGHT_M` (sandalye 82 cm). `COUNTER_DIMENSIONS` Item kopyası ama **kullanılmıyor**.

14. **Hardcoded ölçüler:** yukarıdaki 28 site.

15. **Sistem-global, Item’a taşınmamalı (mevcut kullanım):** `SCENE_SURROUND_M`, stand min/max/step, snap 50/30, `EPSILON_CM`, `ACTIVE_PLATFORM_HEIGHT_M`, kamera min distance, `MODULE_WIDTHS_CM` duvar kompozisyon grid’i, `AUTO_DEPOT_SIZES` (depo planı, tek Item değil), `STAND_DIMENSIONS.stripCount/stripHeight/frame*` stand sistemi. `STAND.height/depth` hem stand zarfı hem Item-specific fallback — bu **I**.

16. **İsim / kullanım uyuşmazlığı:**
    - `catalogHeightCm`: TV’de kart 350, VW metrics’te ekran toplamı
    - `mountHeightCm`: placement okumaz
    - `tableDiameterCm`: proxy `widthCm` kullanır
    - VW `sizeInch: 55`: panelden türetilmez
    - `MODULE_COLLISION_DEPTH_CM`: hem omurga sabiti hem genel fallback
    - `TV_42_DIMENSIONS.heightCm`: scene height değil, catalogHeightCm

17. **Kod değişikliği:** analiz turunda yapılmadı. Bu dosya o raporun Markdown kaydıdır.
