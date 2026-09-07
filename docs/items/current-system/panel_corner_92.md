`panel_corner_92` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:17`:

```text
partId = panel_corner_92
name = İç Köşe Paneli 92 × 47 cm
type = panel
unit = adet
dimensions = 92 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 100
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi veya project-state instance mevcut runtime kodunda yoktur.

# 2. Gerçek recipe referansları

`panel_corner_92` normal `recipe.items` kalemi değildir; 7 recipe'de `variants.innerCornerPanelPartId` olarak geçer:

| Recipe | Kaynak |
|---|---|
| `wall-straight-100` | `src/moduleRecipes.js:7-9` |
| `door-100` | `19-21` |
| `shelf-wall-100-2` | `23-25` |
| `shelf-wall-100-3` | `32-34` |
| `showcase-2-100` | `42-44` |
| `showcase-3-100` | `45-47` |
| `base-wall-100` | `78-80` |

İlgili catalog anahtarları: `wall_100`, `DOOR_100`, `wall_shelf_2_100`, `wall_shelf_3_100`, `wall_showcase_100_2`, `wall_showcase_100_3`, `wall_base_100`.

# 3. Resolver / lookup davranışı

`src/moduleRecipes.js:107-116` recipe seçimini yapar. `expandRecipe()` (`119-122`) yalnız `recipe.items.map(...)` üzerinde `getProductionPart(item.partId)` çağırır; `variants.innerCornerPanelPartId` alanını genişletmez.

```text
recipe.variants.innerCornerPanelPartId = panel_corner_92
→ recipe metadata olarak kalır
→ expanded.items içine girmez
→ getProductionPart('panel_corner_92') otomatik çağrılmaz
```

# 4. State

İlgili wall/door/shelf/showcase/base-wall state'leri `src/designState.js` içinde generic `strips`, `surface` ve `faces` taşır (`35-149`). Production `panel_corner_92` kimliği state'e yazılmaz.

# 5. Renderer

`src/scene3d.js` `productionParts.js` / `moduleRecipes.js` import etmez (`1-33`). Duvar ve türevleri module ölçüsü + generic state'ten procedural oluşturulur. `innerCornerPanelPartId` alanını okuyup 92 cm corner production paneline özel mesh/identity oluşturan renderer veya placement kodu mevcut runtime kodunda yoktur.

# 6. BOM / UI runtime tüketimi

`src/rawBomDebug.js:35-55` yalnız `recipe.items` listesini gösterir. `variants` okuması yoktur. Bu nedenle `panel_corner_92` Raw BOM terminal satırı olmaz.

Mevcut kodda placement'a göre `panel_98` miktarını azaltıp `panel_corner_92` ekleyen bir runtime BOM resolver da bulunmadı.

# 7. Persistence

`src/main.js:1263-1264,1326+` module state snapshot/restore yapar. Production corner panel state içinde olmadığı için ayrı `panel_corner_92` instance'ı persistence'a yazılmaz.

# 8. Ownership

```text
production metadata → src/productionParts.js
variant metadata    → src/moduleRecipes.js
BOM policy          → src/moduleContracts.js
Raw BOM UI          → src/rawBomDebug.js (variant tüketmiyor)
renderer            → src/scene3d.js (ayrı)
```

# 9. Testler

- `test/moduleRecipes.test.js:54-70` wall100 corner variant.
- `74-85` door100 corner variant.
- `87-138` shelf100 2/3 raf corner variant.
- `test/showcaseRecipes.test.js:24,38` showcase-2/3 corner variant.
- `test/baseWallRecipes.test.js:6-29` base-wall100 corner variant.
- `test/moduleRecipes.test.js:20-27` 92 cm production panel genişliği doğrulanır.

Çalıştırılan ortak hedefli set: **49 test / 49 pass / 0 fail**.

# 10. Sonuç

```text
production partId                 EVET
production metadata               EVET
normal recipe items kalemi        HAYIR
recipe variant metadata           EVET
variant runtime BOM substitution  HAYIR
standalone catalog item           HAYIR
project-state production instance HAYIR
render mesh partId identity       HAYIR
persistence production instance   HAYIR
Raw BOM terminal satırı           HAYIR
```

`panel_corner_92` production registry ve recipe variant metadata'da mevcut; bu metadata'yı gerçek placement-aware BOM dönüşümüne çeviren runtime tüketici yoktur.

**Kod zinciri burada bitiyor.**