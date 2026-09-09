# panel_147_5 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_147_5`: canonical `itemKey`, `type=panel`, `unit=adet`, `147.5 × 47 × 0.8 cm`, `panelRole=straight`, nominal `150`; Tekil Item. Doğrulanmış material/product defaultColor yoktur; generic `#ffffff` editor default'u product default değildir.

## 2. Canonical creation / state / override
`getProductionItem('panel_147_5')` resolver'dır. Parent editable surface state project color/image/imageTransform override'larını taşır; ayrı leaf factory yoktur.

## 3. Behavior / capability ownership
Independent leaf behavior lifecycle'ı yoktur; parent module/type behavior ve parent surface context geçerlidir.

## 4. BOM / composition
`wall-straight-150 ×7`, shelf150 2/3 `×7`, L150 `×4`, counter150 `×2`, base-wall150 `×7`, base150 `×2`; quantity parent recipe sahibidir.

## 5. Straight ↔ inner-corner relationship
Eşleşen `panel_corner_142_5`; `panel_147_5 ×N` → `panel_corner_142_5 ×N` 1:1 replacement.

## 6. Persistence
Leaf ayrı entity değildir; parent state persist edilir.

## 7. Renderer boundary
Procedural specialized renderer override izinlidir; product/BOM metadata Item'dadır.

## 8. Regression
`test/straightPanelsItemContract.test.js` + corner tests.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; recipe consumer **VAR**; project override state **VAR**; independent behavior/persistence **UYGULANMIYOR**; corner replacement **VAR**; renderer override **izinli**; regression **VAR**.
