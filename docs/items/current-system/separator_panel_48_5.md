`separator_panel_48_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:21`:

```text
partId = separator_panel_48_5
name = Separatör Paneli 48,5 × 47 cm
type = separator-panel
unit = adet
dimensions = 48.5 × 47 × 0.8 cm
nominalModuleWidthCm = 50
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi, project-state instance'ı veya ayrı runtime module type mevcut kodda yoktur.

# 2. Recipe kullanımı

`separator_panel_48_5` normal BOM `items` kalemi olarak yalnız `separator-50` recipe'sinde kullanılır:

`src/moduleRecipes.js:49-51`

```text
separator-50
profile_41_5 × 2
upright_346_5 × 2
separator_panel_48_5 × 1
separator_panel_98 × 3
connector_start × 2
connector_single × 7
```

Resolver girdisi `getModuleRecipe('separator', 50)`'dir. İlgili catalog anahtarları `wall_separator_50` ve `wall_separator_50_sarmasik` olup ikisi de `type='separator', widthCm=50` üzerinden aynı recipe resolver'a gider.

# 3. Resolver / production metadata

`src/moduleRecipes.js:107-116` separator için fallback `${moduleType}:${nominalWidthCm}` anahtarıyla `separator:50` recipe'sini döndürür. `119-130` `separator_panel_48_5` item'ını `getProductionPart()` ile metadata'ya genişletir.

```text
separator module width 50
→ getModuleRecipe('separator',50)
→ { partId:'separator_panel_48_5', quantity:1 }
→ expandRecipe()
→ getProductionPart('separator_panel_48_5')
```

# 4. State

`src/designState.js:47-58` separator state'i yalnız `id`, `type='separator'`, `widthCm`, `modelFile` ve generic `surface` rengi taşır. Production `separator_panel_48_5` partId state'e yazılmaz.

# 5. Renderer

`src/scene3d.js:6817-6917` `createSeparatorModule()` separator geometrisini `STAND_DIMENSIONS`, `widthCm` ve 36 yatay slat ile procedural üretir. `scene3d.js` productionParts/moduleRecipes import etmez (`1-33`). Selector `userData` içinde module/surface bilgileri vardır; `separator_panel_48_5` partId yoktur.

Bu nedenle recipe'deki fiziksel separator panel ile sahnedeki slat geometrisi arasında production identity bağı mevcut runtime kodunda yoktur.

# 6. BOM / UI tüketimi

`src/rawBomDebug.js:84-88` selection metnindeki `Separatör 50 cm` ifadesini `renderRecipe('separator',50,...)` çağrısına çevirir. `35-55` expanded recipe items'ı `quantity × production part name` biçiminde gösterir.

Desteklenen 50 cm separator seçiminde Raw BOM çıktısında:

```text
1 × Separatör Paneli 48,5 × 47 cm
```

satırı oluşabilir.

# 7. Persistence

`src/main.js:1263-1264,1326+` generic separator module state'ini snapshot/restore eder; `src/projectStore.js` proje state'ini saklar. Production partId state içinde olmadığı için ayrı `separator_panel_48_5` instance'ı persistence'a yazılmaz.

# 8. Ownership

```text
production metadata → src/productionParts.js
recipe + quantity   → src/moduleRecipes.js
BOM policy          → src/moduleContracts.js
Raw BOM UI          → src/rawBomDebug.js
renderer            → src/scene3d.js (ayrı procedural temsil)
```

# 9. Testler

- `test/separatorRecipes.test.js:7-10` production adı doğrulanır.
- `test/separatorRecipes.test.js:12-21` separator50 recipe içinde `separator_panel_48_5 × 1` doğrulanır.

Çalıştırılan ortak hedefli set: **49 test / 49 pass / 0 fail**.

# 10. Sonuç

```text
production partId                 EVET
production metadata               EVET
recipe BOM kalemi                 EVET
standalone catalog item           HAYIR
project-state production instance HAYIR
render mesh partId identity       HAYIR
persistence production instance   HAYIR
Raw BOM tüketimi                  EVET
```

`separator_panel_48_5` BOM/production tarafında aktif, state/render/persistence tarafında ise production identity taşımayan ayrı procedural temsil vardır.

**Kod zinciri burada bitiyor.**