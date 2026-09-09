# panel_corner_42_5 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_corner_42_5` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_corner_42_5`; `name = İç Köşe Paneli 42,5 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = inner-corner`; nominal `50`.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `42.5 × 47 × 0.8 cm`. Doğrulanmış `material`/product `defaultColor` yoktur. `DEFAULT_PANEL_COLOR = '#ffffff'` generic editor surface başlangıcıdır.

## 3. State / default state
Ayrı project leaf state/id yoktur. Corner production seçimi parent/project relationship/configuration ile BOM resolver'a verilir.

## 4. Factory / creation
`getProductionItem('panel_corner_42_5')` production resolver'dır; bağımsız scene factory **UYGULANMIYOR**.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**.

## 6. Move
Bağımsız move **UYGULANMIYOR**; parent ile hareket eder.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**.

## 8. Snap / collision / connection
Bağımsız leaf snap/collision **UYGULANMIYOR**; corner BOM kararı renderer yakınlığından türetilmez.

## 9. Selection / sol click / drag
Production corner identity ayrı selectable mesh değildir; parent surface/module interaction geçerlidir.

## 10. Sağ click / context menu
Ayrı leaf context menu **UYGULANMIYOR**; parent context geçerlidir.

## 11. Delete / duplicate / keyboard
Bağımsız lifecycle **UYGULANMIYOR**.

## 12. Persistence
Ayrı corner entity persist edilmez; parent project state saklanır.

## 13. Relationships / reflow
Canonical kural: `panel_48_5 × N -- panelVariant=inner-corner --> panel_corner_42_5 × N`. `src/moduleRecipes.js` `innerCornerPanelItemKey` ile 1:1 replacement yapar; straight+corner duplicate üretmez. Placement'tan variant üretimi parent/composite Item relationship scope'udur.

## 14. BOM / composition
`wall-straight-50` variant referansı `panel_corner_42_5`; replacement quantity `×7`. Quantity parent recipe'den korunur.

## 15. Renderer / asset / override sınırı
Renderer ayrı corner itemKey mesh source-of-truth kullanmaz; parent geometry procedural kalır. Specialized renderer override izinlidir.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` variant/replacement; `moduleContracts.js` BOM; `designState.js` parent state; `moduleBehavior.js` parent behavior; `moduleContextMenu.js + main.js` interaction; `projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/cornerPanelsItemContract.test.js` identity, `42.5 × 47 × 0.8`, variant key ve 1:1 quantity replacement'ı kilitler.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical relationship-derived BOM **VAR**; independent leaf behavior/state/persistence/context-menu **UYGULANMIYOR — parent-owned**; project placement→variant kararı parent/composite Item scope; renderer override **izinli**.
