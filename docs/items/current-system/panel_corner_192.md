# panel_corner_192 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_corner_192` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_corner_192`; `name = İç Köşe Paneli 192 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = inner-corner`; nominal `200`.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `192 × 47 × 0.8 cm`. Doğrulanmış material/product defaultColor yoktur; generic `#ffffff` editor surface başlangıcı product kararı değildir.

## 3. State / default state
Ayrı leaf project state/id yoktur; relationship/configuration parent/project katmanındadır.

## 4. Factory / creation
`getProductionItem('panel_corner_192')`; bağımsız scene factory **UYGULANMIYOR**.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**.

## 6. Move
Bağımsız move **UYGULANMIYOR**.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**.

## 8. Snap / collision / connection
Bağımsız leaf snap/collision **UYGULANMIYOR**; corner BOM kararı renderer proximity'den türetilmez.

## 9. Selection / sol click / drag
Production identity ayrı selectable mesh değildir; parent surface/module interaction geçerlidir.

## 10. Sağ click / context menu
Ayrı leaf context menu yoktur; parent context geçerlidir.

## 11. Delete / duplicate / keyboard
Bağımsız lifecycle **UYGULANMIYOR**.

## 12. Persistence
Ayrı corner entity persist edilmez; parent project state saklanır.

## 13. Relationships / reflow
Canonical kural `panel_197 × N → panel_corner_192 × N` (`panelVariant = inner-corner`). `src/moduleRecipes.js` 1:1 replacement yapar; straight+corner duplicate yoktur. Placement→variant üretimi parent/composite Item relationship scope'udur.

## 14. BOM / composition
Variant referansları: `wall-straight-200 ×7`, `shelf-wall-200-2 ×7`, `shelf-wall-200-3 ×7`, `base-wall-200 ×7`.

## 15. Renderer / asset / override sınırı
Renderer ayrı `panel_corner_192` mesh identity'si kullanmaz; parent geometry procedural. Specialized override izinlidir.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` variant/replacement; `moduleContracts.js` BOM; `designState.js` parent state; `moduleBehavior.js` behavior; `moduleContextMenu.js + main.js` interaction; `projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/panelCorner192ItemContract.test.js` identity, `192 × 47 × 0.8`, four variant refs ve 1:1 replacement parity'sini kilitler.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical relationship-derived BOM **VAR**; independent leaf behavior/state/persistence/context-menu **UYGULANMIYOR — parent-owned**; project placement→variant parent/composite Item scope; renderer override **izinli**.
