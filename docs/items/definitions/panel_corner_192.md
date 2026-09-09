# panel_corner_192 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_corner_192`: `itemKey`, `type=panel`, `unit=adet`, `192 × 47 × 0.8 cm`, `panelRole=inner-corner`, nominal `200`; Tekil Item. Doğrulanmış material/product defaultColor yoktur.

## 2. Canonical creation / state
`getProductionItem('panel_corner_192')`; ayrı leaf scene/project factory/state yoktur.

## 3. Behavior / capability ownership
Independent leaf behavior/context-menu lifecycle'ı yoktur; parent module/type behavior ve relationship layer geçerlidir.

## 4. Canonical relationship-derived BOM
`panel_197 ×N` → `panel_corner_192 ×N` 1:1 replacement. Variant refs: wall200 `×7`, shelf200 2/3 `×7`, base-wall200 `×7`. Quantity korunur; duplicate yoktur. Placement→variant parent/composite Item scope'udur.

## 5. Persistence
Leaf ayrı persisted entity değildir.

## 6. Renderer boundary
Renderer ayrı corner production identity kullanmaz; specialized override izinlidir.

## 7. Regression
`test/panelCorner192ItemContract.test.js`.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical variant/replacement **VAR**; independent leaf behavior/state/persistence **UYGULANMIYOR**; renderer override **izinli**; regression **VAR**.
