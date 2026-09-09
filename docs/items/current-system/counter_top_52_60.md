# counter_top_52_60 — Current System Inventory

Bu belge güncel `Version2` sisteminde `counter_top_52_60` Item'ını Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
- `itemKey = counter_top_52_60`, `type = counter-top`, `unit = adet`.
- Tekil, parametrik olmayan production/BOM leaf Item'dır.
- Standalone catalog/project entity değildir; parent kullanım `desk_banko_100_L` / `counter-l-100` içindedir.

## 2. Intrinsic / default Item properties
Canonical kaynak `src/productionParts.js` → `PRODUCTION_PARTS.counter_top_52_60`.
- `name = Banko Üstü 52 × 60 cm`
- `dimensions.widthCm = 52`
- `dimensions.depthCm = 60`
- `dimensions.thicknessCm = 1.8`
- `defaultColor = 0xf8fafc`
- `nominalModuleWidthCm = 100`
- `material`: doğrulanmış canonical ürün değeri yok; değer uydurulmaz.

Canonical default explicit project/runtime veya specialized renderer override ile ezilebilir; canonical sahiplik Item'da kalır.

## 3. State / default state
Ayrı leaf project state/id yoktur. Parent L100 counter state `createCounterModuleState(100,{shape:'L'})` ile type/shape/width/depth/height ve editable face state taşır.

## 4. Factory / creation
Bağımsız leaf factory **UYGULANMIYOR**. Leaf `getProductionItem('counter_top_52_60')` ile production metadata olarak resolve edilir.

## 5. Placement
Leaf bağımsız placement hedefi değildir. Parent L counter `placement=free` kullanır.

## 6. Move
Leaf bağımsız move etmez. Parent L100 `moveSnapCm=50` ile taşınır; top parent ile birlikte hareket eder.

## 7. Rotation
Leaf rotation capability'si yoktur. Parent L100 `rotationStepDeg=90`, `defaultRotationDeg=270` kullanır.

## 8. Snap / collision / connection
Leaf bağımsız snap/collision taşımaz. Parent counter `collision=footprint`, `magneticSnap=standard`, `connectionEndpoint=logical-fixture`, `boundarySnap=stand-edge` kullanır.

## 9. Selection / sol click / drag
Leaf top ayrı selectable scene entity değildir. Selection/drag parent counter surface/module seviyesindedir.

## 10. Sağ click / context menu
Leaf için ayrı context menu yoktur. Parent menu `Sil`, `Çoğalt Sol/Sağ`, `Ekle Sol/Sağ` lifecycle komutlarını module üzerinde uygular.

## 11. Delete / duplicate / keyboard
Leaf ayrı instance olmadığı için bağımsız lifecycle **UYGULANMIYOR**; parent lifecycle geçerlidir.

## 12. Persistence
Leaf ayrı persist edilmez. Parent counter `modules` state'i project snapshot/save-load akışında saklanır; leaf recipe + canonical Item ile BOM aşamasında resolve edilir.

## 13. Relationships / reflow
Leaf için ayrı relationship/reflow state yoktur; quantity/composition parent recipe ownership'idir.

## 14. BOM / composition
Tam 1 aktif parent recipe: `counter-l-100` → `counter_top_52_60 ×1`. Canonical `itemKey` kullanılır; expansion canonical Item metadata'sını tüketir. Leaf tekildir.

## 15. Renderer / asset / override sınırı
`createLCounterModule()` L100'de ikinci top'u doğrudan `0.52 × 0.60` render geometry ile üretir; `topThicknessM=0.04`, `color=0xf8fafc`. Bunlar specialized render override'dır. Canonical `52 × 60 × 1.8 cm` ve default renk Item'da kalır. Ayrı asset yoktur.

## 16. Runtime owners
```text
canonical Item metadata → src/productionParts.js
recipe / quantity       → src/moduleRecipes.js
parent state            → src/designState.js
parent behavior         → src/moduleBehavior.js
selection               → src/selectionFeedback.js
context menu            → src/moduleContextMenu.js
parent persistence      → src/main.js + src/projectStore.js
Raw BOM adapter         → src/rawBomDebug.js
renderer override       → src/scene3d.js
```

## 17. Regression
`test/counterTopsItemContract.test.js`, `test/counterTopDefaultColor.test.js`, `test/lCounter100Contract.test.js` ve `test/rawBomSelectionParser.test.js` parity'yi korur.

## 18. Açık durum / karar
- Intrinsic/default property ownership: **VAR**.
- Canonical BOM consumer cutover: **VAR**.
- L100 Raw BOM bağlantısı: **VAR**.
- Renderer override: **VAR ve izinli**.
- Material: **YOK / doğrulanmış ürün kararı yok**.
- Ayrı leaf behavior/state/persistence: **UYGULANMIYOR**; gerçek owner parent counter'dır.
