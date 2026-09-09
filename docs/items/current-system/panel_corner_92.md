# panel_corner_92 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_corner_92` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_corner_92`; `name = İç Köşe Paneli 92 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = inner-corner`; nominal `100`.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `92 × 47 × 0.8 cm`. Doğrulanmış material/product defaultColor yoktur; generic `DEFAULT_PANEL_COLOR = '#ffffff'` product kararı değildir.

## 3. State / default state
Ayrı project leaf state/id yoktur; relationship/configuration parent/project katmanındadır.

## 4. Factory / creation
`getProductionItem('panel_corner_92')`; bağımsız scene factory **UYGULANMIYOR**.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**.

## 6. Move
Bağımsız move **UYGULANMIYOR**.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**.

## 8. Snap / collision / connection
Bağımsız leaf snap/collision **UYGULANMIYOR**; variant kararı renderer proximity'den türetilmez.

## 9. Selection / sol click / drag
Production corner identity ayrı selectable mesh değildir; parent surface/module interaction geçerlidir.

## 10. Sağ click / context menu
Ayrı leaf context menu yoktur; parent context geçerlidir.

## 11. Delete / duplicate / keyboard
Bağımsız lifecycle **UYGULANMIYOR**.

## 12. Persistence
Ayrı corner entity persist edilmez; parent project state saklanır.

## 13. Relationships / reflow
Canonical kural `panel_98 × N → panel_corner_92 × N` (`panelVariant = inner-corner`). `innerCornerPanelItemKey` 1:1 replacement yapar; quantity korunur, duplicate yoktur. Placement→variant üretimi parent/composite Item relationship scope'udur.

## 14. BOM / composition
Variant referansları: `wall-straight-100 ×7`, `door-100 ×3`, `shelf-wall-100-2 ×7`, `shelf-wall-100-3 ×7`, `showcase-2-100 ×5`, `showcase-3-100 ×4`, `base-wall-100 ×7`.

## 15. Renderer / asset / override sınırı
Renderer ayrı corner itemKey mesh kullanmaz; parent geometry procedural kalır. Specialized override izinlidir.

## 16. Runtime owners
`productionParts.js` metadata; `moduleRecipes.js` variant; `moduleContracts.js` BOM; `designState.js` state; `moduleBehavior.js` behavior; `moduleContextMenu.js + main.js` interaction; `projectStore.js` persistence; `scene3d.js` renderer.

## 17. Regression
`test/cornerPanelsItemContract.test.js` identity, `92 × 47 × 0.8`, seven variant refs ve 1:1 replacement parity'sini kilitler.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical relationship BOM **VAR**; independent leaf lifecycle **UYGULANMIYOR — parent-owned**; project placement→variant parent/composite Item scope; renderer override **izinli**.
