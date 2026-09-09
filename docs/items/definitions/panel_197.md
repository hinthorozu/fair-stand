# panel_197 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_197`: canonical `itemKey`, `type=panel`, `unit=adet`, `197 × 47 × 0.8 cm`, `panelRole=straight`, nominal `200`; Tekil Item. Doğrulanmış material/product defaultColor yoktur; generic `#ffffff` project-surface başlangıcı product default değildir.

## 2. Canonical creation / state / override
`getProductionItem('panel_197')` resolver'dır. Parent editable surface state project override'larını taşır; ayrı leaf scene/project factory yoktur.

## 3. Behavior / capability ownership
Independent leaf placement/move/rotation/snap/collision/context-menu lifecycle'ı yoktur; parent module/type behavior ve surface context geçerlidir.

## 4. BOM / composition
`wall-straight-200 ×7`, shelf200 2/3 `×7`, L200 `×4`, counter200 `×2`, base-wall200 `×7`, base200 `×2`. Quantity parent recipe sahibidir.

## 5. Straight ↔ inner-corner relationship
Eşleşen `panel_corner_192`; `panel_197 ×N` → `panel_corner_192 ×N` 1:1 replacement.

## 6. Persistence
Leaf ayrı persisted entity değildir.

## 7. Renderer boundary
Procedural parent renderer override izinlidir; product/BOM source-of-truth Item metadata'sıdır.

## 8. Regression
`test/panel197ItemContract.test.js` + `test/panelCorner192ItemContract.test.js`.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; recipe consumer **VAR**; project override state **VAR**; independent behavior/persistence **UYGULANMIYOR**; corner replacement **VAR**; renderer override **izinli**; regression **VAR**.
