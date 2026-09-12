# base_top_107_50 — Current System Inventory

Bu belge güncel sistemde `base_top_107_50` Item'ını yeni Item Contract checklist'ine göre eksiksiz envanterler.

## 1. Kimlik / sınıflandırma
- Kanonik kimlik: `itemKey = base_top_107_50`.
- `type = base-top`, `unit = adet`.
- Tekil, parametrik olmayan production/BOM Item'ıdır.
- Standalone catalog kaydı yoktur; parent catalog Item'ları `BASE_100` ve `wall_base_100`'dır.

## 2. Intrinsic / default Item properties
Kanonik kaynak `src/productionParts.js` → `PRODUCTION_PARTS.base_top_107_50`.

- `name = Baza Üstü 107 × 50 cm`
- `dimensions.widthCm = 107`
- `dimensions.depthCm = 50`
- `dimensions.thicknessCm = 1.8`
- `material = sunta`
- `defaultColor = 0xffffff`
- `nominalModuleWidthCm = 100`

`material` ve `defaultColor` opsiyonel Item metadata alanlarıdır; bu Item için doğrulanmış oldukları için kanonik Item üzerinde tutulurlar. Kanonik default, explicit proje/runtime veya specialized renderer override ile ezilebilir; override Item default'unu değiştirmez.

## 3. State / default state
Ayrı `base_top_107_50` project instance state'i yoktur. Parent `base` / `base-wall` state'i `src/designState.js` tarafından oluşturulur. Leaf top'un mutable state'i ve ayrı project `id`'si yoktur.

## 4. Factory / creation
Bağımsız leaf factory **UYGULANMIYOR**. Item production metadata olarak `getProductionItem('base_top_107_50')` ile resolve edilir; parent instance'ı ilgili base/base-wall factory/state yolu oluşturur.

## 5. Placement
Leaf production top bağımsız placement hedefi değildir: **UYGULANMIYOR**. Placement parent base/base-wall Item/module davranışıdır.

## 6. Move
Bağımsız move davranışı yoktur: **UYGULANMIYOR**. Parent hareket ettiğinde top procedural temsilin parçası olarak birlikte hareket eder.

## 7. Rotation
Bağımsız rotation/rotation-step/default-rotation yoktur: **UYGULANMIYOR**. Parent behavior geçerlidir.

## 8. Snap / collision / connection
Leaf top için bağımsız snap, collision, boundary, endpoint veya side-insert capability yoktur: **UYGULANMIYOR**.

## 9. Selection / sol click / drag
Leaf production Item ayrı selectable scene entity değildir: **UYGULANMIYOR**. Selection ve drag parent base/base-wall seviyesindedir.

## 10. Sağ click / context menu
Leaf top için ayrı context menu yoktur: **UYGULANMIYOR**. Sil/çoğalt/taşı/döndür gibi komutlar parent Item/module interaction'ına aittir.

## 11. Delete / duplicate / keyboard
Leaf top ayrı instance olmadığı için bağımsız delete/duplicate/keyboard lifecycle'ı yoktur: **UYGULANMIYOR**.

## 12. Persistence
Leaf production top ayrı entity olarak persist edilmez. Parent module state proje snapshot/save-load akışında saklanır. Leaf identity recipe + kanonik production Item üzerinden yeniden resolve edilir.

## 13. Relationships / reflow
Kanonik leaf parent-child/neighbor/host/reflow state'i tutulmaz: **UYGULANMIYOR**. Quantity/composition ownership parent recipe'dedir.

## 14. BOM / composition
`base_top_107_50` tam iki aktif parent recipe'de kanonik `itemKey` ile `×1` kullanılır:
- `base:100` / `base-100`
- `base-wall:100` / `base-wall-100`

`src/moduleRecipes.js` recipe owner'dır. Expansion `getRecipeItemKey()` → `getProductionItem()` ile kanonik Item metadata'sını tüketir. Leaf başka Item'lardan oluşmaz.

## 15. Renderer / asset / override sınırı
`src/scene3d.js#createBaseModule()` top'u procedural çizer. Renderer'ın kendi `topThicknessM = 0.035`, overhang ve `color: 0xffffff` değerleri specialized render temsilidir; kanonik production ölçüsü `107 × 50 × 1.8 cm`, malzeme `sunta`, default renk `0xffffff` Item'da kalır. Renderer override edebilir ve business/BOM source-of-truth değildir.

## 16. Runtime owners
```text
canonical Item metadata → src/productionParts.js
recipe / quantity       → src/moduleRecipes.js
BOM policy              → src/moduleContracts.js
parent state            → src/designState.js
parent persistence      → src/main.js + src/projectStore.js
renderer override       → src/scene3d.js
Raw BOM consumer        → src/rawBomDebug.js
```

## 17. Regression
`test/baseTopsItemContract.test.js`, `test/baseRecipes.test.js` ve `test/baseWallRecipes.test.js` kanonik identity, intrinsic metadata, recipe quantity ve expanded metadata parity'sini korur.

## 18. Açık durum / karar
- Intrinsic/default property ownership: **VAR**.
- Kanonik BOM consumer cutover: **VAR**.
- Renderer override: **VAR ve izinli**.
- Ayrı leaf behavior/state/persistence: **UYGULANMIYOR**; parent seviyesinin sorumluluğudur.
- Material/defaultColor için duplicate business source-of-truth yoktur; renderer görünümü explicit override sınırıdır.
