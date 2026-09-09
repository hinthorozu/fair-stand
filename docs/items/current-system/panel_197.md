# panel_197 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_197` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_197`; `name = Panel 197 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = straight`; `nominalModuleWidthCm = 200`. Standalone catalog/project module değildir.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `197 × 47 × 0.8 cm`, straight, nominal `200`. Doğrulanmış material yoktur. `DEFAULT_PANEL_COLOR = '#ffffff'` generic editable-surface başlangıcıdır; product `defaultColor` değildir.

## 3. State / default state
Ayrı project Item state/id yoktur. Parent editable surface state color/image/imageTransform override'larını taşır; production panel adediyle surface state mapping'i tüm parent ailelerinde birebir garanti değildir.

## 4. Factory / creation
`getProductionItem('panel_197')` production resolver'dır. Bağımsız scene factory **UYGULANMIYOR**.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**; parent-owned.

## 6. Move
Bağımsız move **UYGULANMIYOR**; parent ile hareket eder.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**; parent behavior geçerlidir.

## 8. Snap / collision / connection
Bağımsız snap/collision/connection **UYGULANMIYOR**; parent `moduleBehavior.js` owner'dır.

## 9. Selection / sol click / drag
Panel surface interaction parent renderer/state context'indedir; production `panel_197` itemKey mesh/userData identity'si değildir.

## 10. Sağ click / context menu
Module/surface context üzerinden çalışır; ayrı leaf context menu yoktur.

## 11. Delete / duplicate / keyboard
Bağımsız leaf lifecycle **UYGULANMIYOR**.

## 12. Persistence
Parent module/surface state persist edilir; `panel_197` ayrı persisted entity değildir.

## 13. Relationships / reflow
Eşleşen corner Item `panel_corner_192`'dir. Canonical relationship `innerCornerPanelItemKey` + `panelVariant = inner-corner` ile 1:1 replacement yapar; placement/reflow parent/project scope'udur.

## 14. BOM / composition
Aktif parent recipe'ler: `wall-straight-200 ×7`, `shelf-wall-200-2 ×7`, `shelf-wall-200-3 ×7`, `counter-l-200 ×4`, `counter-200 ×2`, `base-wall-200 ×7`, `base-200 ×2`. Expansion canonical Item registry'yi tüketir.

## 15. Renderer / asset / override sınırı
Renderer procedural parent geometry kullanır; specialized render değerleri override olabilir ve BOM/product source-of-truth değildir.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` recipe/variant; `moduleContracts.js` BOM; `designState.js` parent state; `moduleBehavior.js` behavior; `moduleContextMenu.js + main.js` interaction; `main.js + projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/panel197ItemContract.test.js` + corner/recipe testleri identity, `197 × 47 × 0.8`, seven parent recipe quantities, expansion ve corner replacement parity'sini korur.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK — doğrulanmış product değeri yok**; recipe consumer **VAR**; independent leaf behavior/persistence **UYGULANMIYOR — parent-owned**; renderer override **izinli**.
