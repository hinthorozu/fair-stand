# counter_top_102_60 — Current System Inventory

Bu belge güncel `Version2` sisteminde `counter_top_102_60` Item'ını Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
- `itemKey = counter_top_102_60`, `type = counter-top`, `unit = adet`.
- Tekil, parametrik olmayan production/BOM leaf Item'dır.
- Standalone catalog/project entity değildir; parent kullanım `desk_banko_150_L` / `counter-l-150` içindedir.

## 2. Intrinsic / default Item properties
Canonical kaynak `src/productionParts.js` → `PRODUCTION_PARTS.counter_top_102_60`.
- `name = Banko Üstü 102 × 60 cm`
- `dimensions.widthCm = 102`
- `dimensions.depthCm = 60`
- `dimensions.thicknessCm = 1.8`
- `defaultColor = 0xf8fafc`
- `nominalModuleWidthCm = 150`
- `material`: doğrulanmış canonical ürün değeri yok; değer uydurulmaz.

`defaultColor` opsiyoneldir ama bu Item için doğrulanmış olduğundan canonical Item'da tutulur. Explicit project/runtime veya specialized renderer override canonical default'u ezebilir; source-of-truth Item'da kalır.

## 3. State / default state
Ayrı leaf project state/id yoktur. Parent L counter state `createCounterModuleState(150,{shape:'L'})` ile `type=counter`, `shape=L`, `widthCm=150`, `depthCm=150`, `heightCm=100` ve editable face state taşır.

## 4. Factory / creation
Bağımsız leaf factory **UYGULANMIYOR**. Leaf `getProductionItem('counter_top_102_60')` ile production metadata olarak resolve edilir; project instance parent counter factory/state yolunda oluşur.

## 5. Placement
Leaf bağımsız placement hedefi değildir: **UYGULANMIYOR**. Parent L counter `placement=free` behavior kullanır.

## 6. Move
Leaf bağımsız move etmez: **UYGULANMIYOR**. Parent L counter hareketi `moveSnapCm=50` ile çözülür; top parent ile birlikte hareket eder.

## 7. Rotation
Leaf rotation capability'si yoktur: **UYGULANMIYOR**. Parent L counter `rotationStepDeg=90`, `defaultRotationDeg=270` kullanır.

## 8. Snap / collision / connection
Leaf için bağımsız snap/collision yoktur. Parent counter: `collision=footprint`, `magneticSnap=standard`, `connectionEndpoint=logical-fixture`, `boundarySnap=stand-edge`.

## 9. Selection / sol click / drag
Leaf top ayrı selectable mesh/entity değildir. Selection/drag counter surface/module seviyesindedir.

## 10. Sağ click / context menu
Leaf için ayrı context menu yoktur. Parent module menu `Sil`, `Çoğalt Sol/Sağ`, `Ekle Sol/Sağ` gibi lifecycle komutlarını counter module üzerinde uygular.

## 11. Delete / duplicate / keyboard
Leaf ayrı instance olmadığı için bağımsız delete/duplicate/keyboard lifecycle **UYGULANMIYOR**; parent module lifecycle geçerlidir.

## 12. Persistence
Leaf ayrı entity olarak persist edilmez. `buildProjectSnapshot()` parent `modules` state'ini saklar; `projectStore` save/load eder. Leaf identity BOM çözümünde recipe + canonical Item üzerinden yeniden resolve edilir.

## 13. Relationships / reflow
Leaf için ayrı host/neighbor/reflow state tutulmaz. Quantity/composition ve parent ilişkisi recipe ownership'idir.

## 14. BOM / composition
Tam 1 aktif parent recipe: `counter-l-150` → `counter_top_102_60 ×1`. Recipe canonical `itemKey` kullanır; expansion `getRecipeItemKey()` → `getProductionItem()` ile Item metadata'sını tüketir. Leaf başka Item'lardan oluşmaz.

## 15. Renderer / asset / override sınırı
`createLCounterModule()` procedural render üretir. L150 renderer `topThicknessM=0.04`, 2 cm overhang ve `color=0xf8fafc` kullanır; bunlar specialized render override'dır. Canonical üretim ölçüsü `102 × 60 × 1.8 cm` ve `defaultColor=0xf8fafc` Item'da kalır. Ayrı asset/model yoktur.

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
`test/counterTopsItemContract.test.js`, `test/counterTopDefaultColor.test.js`, `test/lCounter150Contract.test.js` ve `test/rawBomSelectionParser.test.js` identity/dimensions/defaultColor/recipe/Raw BOM parity'sini korur.

## 18. Açık durum / karar
- Intrinsic/default property ownership: **VAR**.
- Canonical BOM consumer cutover: **VAR**.
- L150 Raw BOM parser bağlantısı: **VAR**; `parseLCounterSelection()` 100/150/200 destekler.
- Renderer override: **VAR ve izinli**.
- Material: **YOK / doğrulanmış ürün kararı yok**.
- Ayrı leaf behavior/state/persistence: **UYGULANMIYOR**; gerçek owner parent counter'dır.
