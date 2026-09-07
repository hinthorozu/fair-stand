`separator_panel_98` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:22`:

```text
partId = separator_panel_98
name = Separatör Paneli 98 × 47 cm
type = separator-panel
unit = adet
dimensions = 98 × 47 × 0.8 cm
nominalModuleWidthCm = 100
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi, project-state instance'ı veya ayrı runtime module type mevcut kodda yoktur.

# 2. Recipe kullanımları

`separator_panel_98` normal BOM `items` kalemi olarak iki recipe'de geçer:

| Recipe | Miktar | Kaynak |
|---|---:|---|
| `separator-50` | 3 | `src/moduleRecipes.js:49-51` |
| `separator-100` | 7 | `src/moduleRecipes.js:52-54` |

İlgili catalog anahtarları: `wall_separator_50`, `wall_separator_50_sarmasik`, `wall_separator_100`, `wall_separator_100_sarmasik`. Bunların state `type='separator'` ve genişlikleri üzerinden aynı recipe resolver kullanılır.

# 3. Resolver / production metadata

`src/moduleRecipes.js:107-116` separator için `${moduleType}:${nominalWidthCm}` lookup'ını kullanır. `119-130` normal recipe item'larını `getProductionPart(item.partId)` ile genişletir.

```text
separator 50 veya 100
→ getModuleRecipe('separator', width)
→ separator_panel_98 × 3 veya ×7
→ expandRecipe()
→ getProductionPart('separator_panel_98')
```

# 4. State

`src/designState.js:47-58` separator module state'i `id`, `type`, `widthCm`, `modelFile` ve generic `surface` state taşır. Production `separator_panel_98` partId state içinde yoktur.

# 5. Renderer

`src/scene3d.js:6817-6917` `createSeparatorModule()` separator görünümünü procedural olarak iki dikey frame, üst/alt rail ve 36 yatay slat üzerinden kurar. Production 98 × 47 × 0.8 cm metadata renderer tarafından okunmaz. `scene3d.js` productionParts/moduleRecipes import etmez (`1-33`) ve mesh/surface `userData` içinde `separator_panel_98` partId bulunmaz.

# 6. BOM / UI tüketimi

`src/rawBomDebug.js:84-88` `Separatör 50|100 cm` seçim metnini separator recipe resolver'a yollar; `35-55` expanded recipe satırlarını ekranda gösterir.

Sonuç olarak:

```text
Separatör 50 → 3 × Separatör Paneli 98 × 47 cm
Separatör 100 → 7 × Separatör Paneli 98 × 47 cm
```

Raw BOM state'i doğrudan okumaz; selection-info metnini regex ile parse eder.

# 7. Persistence

`src/main.js:1263-1264,1326+` generic separator state'i snapshot/restore eder; `src/projectStore.js` proje state'ini saklar. State içinde production partId olmadığı için ayrı `separator_panel_98` instance'ı persistence'a yazılmaz.

# 8. Ownership

`src/moduleContracts.js:4-7` recipe BOM source olarak `src/moduleRecipes.js` tanımlar.

```text
production metadata → src/productionParts.js
recipe + quantity   → src/moduleRecipes.js
BOM policy          → src/moduleContracts.js
Raw BOM UI          → src/rawBomDebug.js
renderer            → src/scene3d.js (ayrı procedural sistem)
```

`src/systemChangeContract.js:110-122` production/recipe dosyalarını BOM, rawBomDebug'ı BOM+UI, scene3d'yi renderer/state domainlerinde sınıflandırır.

# 9. Testler

- `test/separatorRecipes.test.js:7-10` production adı doğrulanır.
- `12-21` separator50 → `separator_panel_98 × 3`.
- `23-32` separator100 → `separator_panel_98 × 7`.
- Aynı test dosyasındaki expanded recipe testi production metadata çözümünü doğrular.

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

`separator_panel_98` mevcut BOM/production zincirinde aktif bir partId'dir; state/render/persistence tarafında production identity ile doğrudan bağlı değildir.

**Kod zinciri burada bitiyor.**