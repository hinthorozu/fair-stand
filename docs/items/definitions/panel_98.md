# panel_98 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
Canonical `PRODUCTION_PARTS.panel_98`: `itemKey=panel_98`, `type=panel`, `unit=adet`, `98 × 47 × 0.8 cm`, `panelRole=straight`, nominal `100`. Tekil Item. Doğrulanmış `material`/product `defaultColor` yoktur; generic `DEFAULT_PANEL_COLOR='#ffffff'` product default'u değildir.

## 2. Canonical creation / state / override
`getProductionItem('panel_98')` production resolver'dır. Ayrı leaf scene/project factory yoktur. Parent editable surface state color/image/imageTransform gibi project override'ları taşır.

## 3. Behavior / capability ownership
Independent placement/move/rotation/snap/collision lifecycle'ı yoktur; parent module/type behavior geçerlidir. Surface selection/image/color/context-menu parent/project surface context'indedir.

## 4. BOM / composition
Parent recipe quantity sahibidir: `wall-straight-100 ×7`, `door-100 ×3`, shelf 2/3 `×7`, showcase-2 `×5`, showcase-3 `×4`, L100 `×4`, counter100 `×2`, base-wall100 `×7`, base100 `×2`.

## 5. Straight ↔ inner-corner relationship
Eşleşen `panel_corner_92`; `panel_98 ×N` → `panel_corner_92 ×N` canonical 1:1 replacement.

## 6. Persistence
Leaf ayrı persisted entity değildir; parent state persist edilir.

## 7. Renderer boundary
Procedural parent renderer specialized override kullanabilir; canonical BOM/product metadata Item'dadır.

## 8. Regression
`test/straightPanelsItemContract.test.js` + corner/recipe tests.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical recipe consumer **VAR**; parent override state **VAR**; independent leaf behavior/persistence **UYGULANMIYOR**; corner replacement **VAR**; renderer override **izinli**; regression **VAR**.
