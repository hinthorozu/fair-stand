# panel_98 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_98` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_98`; `name = Panel 98 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = straight`; `nominalModuleWidthCm = 100`. Standalone catalog/project module değildir.

## 2. Intrinsic / default Item properties
`src/productionParts.js` canonical kaynaktır: `98 × 47 × 0.8 cm`, `panelRole = straight`, nominal `100`. Doğrulanmış `material` yoktur. `src/designState.js` içindeki `DEFAULT_PANEL_COLOR = '#ffffff'` generic editable-surface başlangıcıdır ve panel dışı yüzeylerde de kullanılır; doğrulanmış product `defaultColor` değildir, bu yüzden Item'a kopyalanmaz.

## 3. State / default state
Ayrı `panel_98` project Item state/id yoktur. Parent module'ler `createEditablePanelState()` ile `color`, `imageAssetId`, `imageTransform` gibi project-surface override state'i taşır; bu state her parent ailesinde production panel adediyle birebir Item-instance mapping garantisi vermez.

## 4. Factory / creation
Production metadata `getProductionItem('panel_98')` ile çözülür. Bağımsız scene factory **UYGULANMIYOR**; parent module factory/state geçerlidir.

## 5. Placement
Bağımsız leaf placement **UYGULANMIYOR**; parent module owner'dır.

## 6. Move
Bağımsız move **UYGULANMIYOR**; parent ile birlikte hareket eder.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**; parent behavior geçerlidir.

## 8. Snap / collision / connection
Bağımsız snap/collision/boundary/side-insert **UYGULANMIYOR**; `src/moduleBehavior.js` parent type contract'ı owner'dır.

## 9. Selection / sol click / drag
Renderer bazı parent'larda yüzeyi `selectionMode = panel`, `acceptsImage = true` ile selectable yapar. Runtime identity `surfaceId/moduleId`'dir; production `panel_98` `itemKey` mesh/userData'ya yazılmaz. Bu interaction parent/project surface katmanıdır.

## 10. Sağ click / context menu
Sil/çoğalt/ekle parent module komutlarıdır; cam/lightbox/mesh gibi surface aksiyonları context capability'ye göre çalışır. Ayrı `panel_98` context-menu instance'ı yoktur.

## 11. Delete / duplicate / keyboard
Bağımsız leaf lifecycle **UYGULANMIYOR**; parent module lifecycle geçerlidir.

## 12. Persistence
Parent `modules` ve editable surface state persist edilir. `panel_98` ayrı entity değildir; production identity recipe + registry üzerinden tekrar çözülür.

## 13. Relationships / reflow
`panel_98` ile `panel_corner_92` ayrı Tekil Item'lardır. Canonical BOM relationship `innerCornerPanelItemKey` + `panelVariant = inner-corner` ile straight satırın 1:1 replacement'ıdır. Placement/reflow parent/project relationship katmanıdır.

## 14. BOM / composition
Parent recipe quantity sahibidir: `wall-straight-100 ×7`, `door-100 ×3`, `shelf-wall-100-2 ×7`, `shelf-wall-100-3 ×7`, `showcase-2-100 ×5`, `showcase-3-100 ×4`, `counter-l-100 ×4`, `counter-100 ×2`, `base-wall-100 ×7`, `base-100 ×2`. Expansion `getRecipeItemKey()` → `getProductionItem()` kullanır.

## 15. Renderer / asset / override sınırı
Renderer parent module geometry/state ile procedural çizer; specialized render ölçü/renk/material değerleri override olabilir. BOM/product source-of-truth Item metadata'sıdır.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` recipe/quantity/variant; `moduleContracts.js` BOM policy; `designState.js` parent state; `moduleBehavior.js` parent behavior; `moduleContextMenu.js + main.js` interaction; `main.js + projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/straightPanelsItemContract.test.js` + corner/recipe testleri canonical identity, `98 × 47 × 0.8`, quantity, expansion ve 1:1 corner replacement parity'sini korur.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material **YOK**; product `defaultColor` **YOK** (`#ffffff` generic surface başlangıcı); recipe consumer **VAR**; independent leaf behavior/persistence **UYGULANMIYOR — parent-owned**; surface color/image/context-menu **VAR — parent/project override katmanı**; renderer override **izinli**.
