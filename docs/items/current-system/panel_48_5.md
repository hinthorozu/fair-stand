# panel_48_5 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_48_5` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
- Canonical kimlik: `itemKey = panel_48_5`.
- `name = Panel 48,5 × 47 cm`, `type = panel`, `unit = adet`.
- Tekil production/BOM Item'ıdır; `panelRole = straight`, `nominalModuleWidthCm = 50`.
- Standalone catalog/project module değildir; parent Item/module recipe'lerinde fiziksel üretim kalemidir.

## 2. Intrinsic / default Item properties
Canonical kaynak `src/productionParts.js` → `PRODUCTION_PARTS.panel_48_5`.
- `dimensions.widthCm = 48.5`
- `dimensions.heightCm = 47`
- `dimensions.thicknessCm = 0.8`
- `panelRole = straight`
- `nominalModuleWidthCm = 50`

Doğrulanmış ürün `material` değeri yoktur; uydurulmaz. `src/designState.js` içindeki `DEFAULT_PANEL_COLOR = '#ffffff'` genel editable-surface başlangıç değeridir ve panel dışı yüzeylerde de kullanılır; doğrulanmış intrinsic ürün `defaultColor` kararı değildir. Bu nedenle Item üzerinde `defaultColor` tanımlı değildir.

## 3. State / default state
Ayrı `panel_48_5` project Item state'i veya project `id` yoktur. Parent modüller `createEditablePanelState()` ile `color`, `imageAssetId`, `imageTransform` gibi project-surface override state'i taşır. Bu surface state her parent ailesinde production panel adediyle birebir Item-instance mapping garantisi vermez.

## 4. Factory / creation
Production Item `getProductionItem('panel_48_5')` ile resolve edilir. Bağımsız scene factory **UYGULANMIYOR**; runtime module/state parent factory tarafından oluşturulur.

## 5. Placement
Leaf production panel bağımsız placement hedefi değildir: **UYGULANMIYOR**. Placement parent module davranışıdır.

## 6. Move
Bağımsız move yoktur: **UYGULANMIYOR**. Panel parent module ile birlikte hareket eder.

## 7. Rotation
Bağımsız rotation/rotation-step/default-rotation yoktur: **UYGULANMIYOR**. Parent module behavior geçerlidir.

## 8. Snap / collision / connection
Leaf panel için bağımsız snap/collision/boundary/side-insert contract'ı yoktur: **UYGULANMIYOR**. Parent module `src/moduleBehavior.js` üzerinden davranır.

## 9. Selection / sol click / drag
Renderer bazı parent modüllerde panel yüzeylerini `selectionMode = panel` ve `acceptsImage = true` olarak selectable surface şeklinde temsil eder. Surface `surfaceId/moduleId` taşır; production `panel_48_5` `itemKey` identity'si mesh/userData'ya yazılmaz. Bu interaction parent/project surface katmanıdır.

## 10. Sağ click / context menu
Context menu parent module/surface context üzerinden açılır. Sil/çoğalt/ekle parent module komutlarıdır; cam/lightbox/mesh gibi yüzey aksiyonları uygun surface context capability'sine göre çalışır. `panel_48_5` için bağımsız context-menu instance'ı yoktur.

## 11. Delete / duplicate / keyboard
Leaf production panel ayrı module instance olmadığı için bağımsız delete/duplicate/keyboard lifecycle'ı yoktur: **UYGULANMIYOR**.

## 12. Persistence
Proje snapshot'ında parent `modules` ve editable surface state'leri saklanır. `panel_48_5` ayrı persisted entity olarak yazılmaz; production identity recipe + canonical Item registry üzerinden çözülür.

## 13. Relationships / reflow
`panel_48_5` ile `panel_corner_42_5` ayrı Tekil Item'lardır. Canonical BOM relationship `src/moduleRecipes.js` içinde `innerCornerPanelItemKey` + `panelVariant = inner-corner` ile straight panel satırının 1:1 replacement'ıdır. Placement/reflow parent module/project ilişki katmanının sorumluluğudur.

## 14. BOM / composition
`panel_48_5` başka Item'lardan oluşmaz. Parent recipe quantity sahibidir. Aktif kullanımlar:
- `wall-straight-50` → `×7`
- `counter-l-100` / `counter-l-150` / `counter-l-200` → her biri `×4`
- `counter-100` / `counter-150` / `counter-200` → her biri `×4`
- `base-wall-100` / `base-wall-150` / `base-wall-200` → her biri `×2`
- `base-100` / `base-150` / `base-200` → her biri `×2`

Recipe expansion `getRecipeItemKey()` → `getProductionItem()` ile canonical Item metadata'sını tüketir.

## 15. Renderer / asset / override sınırı
`src/scene3d.js` panel yüzeylerini parent module ölçüsü, `STAND_DIMENSIONS` ve renderer sabitleriyle procedural çizer. Specialized render ölçü/renk/material değerleri override olabilir; BOM/product source-of-truth canonical Item metadata'sıdır.

## 16. Runtime owners
```text
canonical Item metadata → src/productionParts.js
recipe / quantity       → src/moduleRecipes.js
BOM policy              → src/moduleContracts.js
parent state/defaults   → src/designState.js
parent behavior         → src/moduleBehavior.js
context menu            → src/moduleContextMenu.js + src/main.js
persistence             → src/main.js + src/projectStore.js
renderer                → src/scene3d.js
```

## 17. Regression
`test/straightPanelsItemContract.test.js` ve ilgili recipe/corner-panel testleri canonical identity, `48.5 × 47 × 0.8` metadata, quantity, expanded metadata ve 1:1 corner replacement parity'sini korur.

## 18. Açık durum / karar
- Canonical identity / intrinsic dimensions / role: **VAR**.
- Material: **YOK — doğrulanmış ürün değeri bulunmadı**.
- `defaultColor`: **YOK — `#ffffff` generic project-surface başlangıcıdır, doğrulanmış ürün default'u değildir**.
- Canonical recipe/BOM tüketimi: **VAR**.
- Leaf bağımsız placement/move/rotation/persistence: **UYGULANMIYOR — parent-owned**.
- Surface color/image/context-menu: **VAR — parent/project override & interaction katmanı**.
- Renderer override: **VAR ve izinli**.
