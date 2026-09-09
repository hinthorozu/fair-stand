# panel_147_5 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_147_5` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_147_5`; `name = Panel 147,5 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = straight`; `nominalModuleWidthCm = 150`. Standalone catalog/project module değildir.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `147.5 × 47 × 0.8 cm`, straight, nominal `150`. Doğrulanmış material yoktur. `DEFAULT_PANEL_COLOR = '#ffffff'` generic editable-surface başlangıcıdır; product `defaultColor` kararı değildir.

## 3. State / default state
Ayrı project Item state/id yoktur. Parent module editable surface state'i `color`, `imageAssetId`, `imageTransform` gibi override'ları taşır; production panel instance mapping'i parent ailelerinde birebir garanti değildir.

## 4. Factory / creation
`getProductionItem('panel_147_5')` production resolver'dır. Bağımsız scene factory **UYGULANMIYOR**; parent factory/state geçerlidir.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**; parent-owned.

## 6. Move
Bağımsız move **UYGULANMIYOR**; parent ile hareket eder.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**; parent behavior geçerlidir.

## 8. Snap / collision / connection
Bağımsız snap/collision/connection **UYGULANMIYOR**; parent `moduleBehavior.js` owner'dır.

## 9. Selection / sol click / drag
Bazı parent renderer yüzeyleri `selectionMode = panel`, `acceptsImage = true` taşır; runtime identity surface/module seviyesindedir, production `itemKey` mesh'e yazılmaz.

## 10. Sağ click / context menu
Module/surface context üzerinden çalışır; ayrı leaf context menu yoktur.

## 11. Delete / duplicate / keyboard
Bağımsız leaf lifecycle **UYGULANMIYOR**; parent-owned.

## 12. Persistence
Parent module/surface state persist edilir; `panel_147_5` ayrı entity değildir.

## 13. Relationships / reflow
Eşleşen corner Item `panel_corner_142_5`'dır. `innerCornerPanelItemKey` + `panelVariant = inner-corner` canonical 1:1 BOM replacement yapar; placement/reflow parent/project relationship scope'udur.

## 14. BOM / composition
Aktif parent recipe'ler: `wall-straight-150 ×7`, `shelf-wall-150-2 ×7`, `shelf-wall-150-3 ×7`, `counter-l-150 ×4`, `counter-150 ×2`, `base-wall-150 ×7`, `base-150 ×2`. Quantity parent recipe sahibidir; expansion canonical Item registry'yi tüketir.

## 15. Renderer / asset / override sınırı
Renderer procedural parent geometry kullanır. Specialized render değerleri override olabilir; BOM/product source-of-truth Item metadata'sıdır.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` recipe/variant; `moduleContracts.js` BOM; `designState.js` parent state; `moduleBehavior.js` behavior; `moduleContextMenu.js + main.js` interaction; `main.js + projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/straightPanelsItemContract.test.js` + corner/recipe testleri identity, `147.5 × 47 × 0.8`, quantity, expansion ve corner replacement parity'sini korur.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK — doğrulanmış product değeri yok**; generic `#ffffff` project-surface başlangıcıdır; recipe consumer **VAR**; independent behavior/persistence **UYGULANMIYOR — parent-owned**; renderer override **izinli**.
