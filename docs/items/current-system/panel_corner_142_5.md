# panel_corner_142_5 — Current System Inventory

Bu belge güncel `Version2` sisteminde `panel_corner_142_5` Item'ını güçlendirilmiş Item Contract checklist'ine göre envanterler.

## 1. Kimlik / sınıflandırma
Canonical `itemKey = panel_corner_142_5`; `name = İç Köşe Paneli 142,5 × 47 cm`; `type = panel`; `unit = adet`; Tekil Item; `panelRole = inner-corner`; nominal `150`.

## 2. Intrinsic / default Item properties
Canonical `src/productionParts.js`: `142.5 × 47 × 0.8 cm`. Doğrulanmış material/product defaultColor yoktur; generic `#ffffff` editable-surface başlangıcı product kararı değildir.

## 3. State / default state
Ayrı leaf project state/id yoktur; parent/project relationship/configuration state geçerlidir.

## 4. Factory / creation
`getProductionItem('panel_corner_142_5')`; bağımsız scene factory **UYGULANMIYOR**.

## 5. Placement
Bağımsız placement **UYGULANMIYOR**.

## 6. Move
Bağımsız move **UYGULANMIYOR**.

## 7. Rotation
Bağımsız rotation **UYGULANMIYOR**.

## 8. Snap / collision / connection
Bağımsız leaf snap/collision **UYGULANMIYOR**; BOM variant kararı renderer geometry'den türetilmez.

## 9. Selection / sol click / drag
Production identity ayrı selectable mesh değildir; parent interaction geçerlidir.

## 10. Sağ click / context menu
Ayrı leaf context menu yoktur; parent context geçerlidir.

## 11. Delete / duplicate / keyboard
Bağımsız lifecycle **UYGULANMIYOR**.

## 12. Persistence
Ayrı corner entity persist edilmez.

## 13. Relationships / reflow
Canonical `panel_147_5 × N → panel_corner_142_5 × N` 1:1 replacement'ı `innerCornerPanelItemKey` + `panelVariant = inner-corner` ile çözülür; quantity korunur. Placement→variant parent/composite relationship scope'udur.

## 14. BOM / composition
Variant referansları: `wall-straight-150 ×7`, `shelf-wall-150-2 ×7`, `shelf-wall-150-3 ×7`, `base-wall-150 ×7`.

## 15. Renderer / asset / override sınırı
Renderer ayrı corner production identity kullanmaz; parent geometry procedural. Specialized override izinlidir.

## 16. Runtime owners
`productionParts.js`; `moduleRecipes.js`; `moduleContracts.js`; `designState.js`; `moduleBehavior.js`; `moduleContextMenu.js + main.js`; `projectStore.js`; `scene3d.js`.

## 17. Regression
`test/cornerPanelsItemContract.test.js` identity, `142.5 × 47 × 0.8`, four variant refs ve 1:1 replacement'ı kilitler.

## 18. Açık durum / karar
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical relationship BOM **VAR**; independent leaf lifecycle **UYGULANMIYOR — parent-owned**; placement→variant parent/composite Item scope; renderer override **izinli**.
