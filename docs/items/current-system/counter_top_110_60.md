# counter_top_110_60 — Current System Inventory

Bu belge güncel `Version2` sisteminde `counter_top_110_60` Item'ını Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
- `itemKey = counter_top_110_60`, `type = counter-top`, `unit = adet`.
- Tekil, parametrik olmayan production/BOM leaf Item'dır.
- Standalone catalog/project entity değildir; parent kullanımlar `desk_banko_100` ve `desk_banko_100_L` içindedir.

## 2. Intrinsic / default Item properties
Canonical kaynak `src/productionParts.js` → `PRODUCTION_PARTS.counter_top_110_60`.
- `name = Banko Üstü 110 × 60 cm`
- `dimensions.widthCm = 110`
- `dimensions.depthCm = 60`
- `dimensions.thicknessCm = 1.8`
- `defaultColor = 0xf8fafc`
- `nominalModuleWidthCm = 100`
- `material`: doğrulanmış canonical ürün değeri yok; değer uydurulmaz.

Canonical default explicit project/runtime veya specialized renderer override ile ezilebilir; canonical sahiplik Item'da kalır.

## 3. State / default state
Leaf için ayrı project state/id yoktur. Parent counter state `createCounterModuleState(100)` veya `{shape:'L'}` ile oluşturulur; type/shape/width/depth/height ve editable face state parent'a aittir.

## 4. Factory / creation
Bağımsız leaf factory **UYGULANMIYOR**. Leaf `getProductionItem('counter_top_110_60')` ile resolve edilir; project instance parent counter yolunda oluşur.

## 5. Placement
Leaf bağımsız placement hedefi değildir. Parent straight/L counter `placement=free` kullanır.

## 6. Move
Leaf bağımsız move etmez. Parent straight/L counter `moveSnapCm=50` ile hareket eder; top parent ile taşınır.

## 7. Rotation
Leaf rotation capability'si yoktur. Parent straight 100 counter `rotationStepDeg=45`, `defaultRotationDeg=0`; L100 counter `rotationStepDeg=90`, `defaultRotationDeg=270` kullanır.

## 8. Snap / collision / connection
Leaf bağımsız snap/collision taşımaz. Parent counter `collision=footprint`, `magneticSnap=standard`, `connectionEndpoint=logical-fixture`, `boundarySnap=stand-edge` kullanır.

## 9. Selection / sol click / drag
Leaf top ayrı selectable scene entity değildir. Selection/drag counter surface/module seviyesindedir.

## 10. Sağ click / context menu
Leaf için ayrı context menu yoktur. Parent menu `Sil`, `Çoğalt Sol/Sağ`, `Ekle Sol/Sağ` lifecycle komutlarını module üzerinde uygular.

## 11. Delete / duplicate / keyboard
Leaf ayrı instance olmadığı için bağımsız lifecycle **UYGULANMIYOR**; parent module lifecycle geçerlidir.

## 12. Persistence
Leaf ayrı persist edilmez. Project snapshot `modules` parent counter state'ini saklar; save/load `projectStore` üzerinden yapılır. Leaf BOM çözümünde recipe + canonical Item ile resolve edilir.

## 13. Relationships / reflow
Leaf için ayrı relationship/reflow state yoktur; quantity/composition parent recipe ownership'idir.

## 14. BOM / composition
Tam 2 aktif parent recipe: `counter-100 ×1` ve `counter-l-100 ×1`. Recipe canonical `itemKey` kullanır; expansion canonical Item metadata'sını tüketir. Leaf tekildir.

## 15. Renderer / asset / override sınırı
Straight/L renderer procedural'dır. Straight render `topThicknessM=0.04`, 2 cm overhang, `color=0xf8fafc`; L100 top A doğrudan `1.10 × 0.60`, aynı render thickness/color kullanır. Bunlar specialized render override'dır; canonical `110 × 60 × 1.8 cm` ve default renk Item'da kalır. Ayrı asset yoktur.

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
`test/counterTopsItemContract.test.js`, `test/counterTopDefaultColor.test.js`, `test/counterRecipes.test.js`, `test/lCounter100Contract.test.js` ve `test/rawBomSelectionParser.test.js` parity'yi korur.

## 18. Açık durum / karar
- Intrinsic/default property ownership: **VAR**.
- Canonical BOM consumer cutover: **VAR**.
- Straight/L100 Raw BOM bağlantısı: **VAR**.
- Renderer override: **VAR ve izinli**.
- Material: **YOK / doğrulanmış ürün kararı yok**.
- Ayrı leaf behavior/state/persistence: **UYGULANMIYOR**; owner parent counter'dır.
