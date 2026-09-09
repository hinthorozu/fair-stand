# panel_48_5 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
Canonical `PRODUCTION_PARTS.panel_48_5`: `itemKey=panel_48_5`, `type=panel`, `unit=adet`, `48.5 × 47 × 0.8 cm`, `panelRole=straight`, nominal `50`. Tekil Item.

Doğrulanmış `material`/product `defaultColor` yoktur. `DEFAULT_PANEL_COLOR='#ffffff'` generic project-surface başlangıcıdır ve canonical product default'u olarak kopyalanmaz.

## 2. Canonical creation / state / override
Production definition `getProductionItem('panel_48_5')` ile resolve edilir. Ayrı leaf scene/project factory yoktur. Parent editable surface state color/image/imageTransform gibi project override'ları taşır; canonical product metadata değişmez.

## 3. Behavior / capability ownership
Bağımsız leaf placement/move/rotation/snap/collision lifecycle'ı yoktur; parent module/type behavior geçerlidir. Surface selection/image/color/context-menu yetenekleri parent/project surface context'inde çözülür.

## 4. BOM / composition
Parent recipe quantity sahibidir: `wall-straight-50 ×7`; üç L-counter `×4`; üç straight counter `×4`; üç base-wall `×2`; üç base `×2`. Expansion canonical Item registry'yi tüketir.

## 5. Straight ↔ inner-corner relationship
Eşleşen Item `panel_corner_42_5`. `innerCornerPanelItemKey` + `panelVariant=inner-corner` ile `panel_48_5 ×N` → `panel_corner_42_5 ×N` 1:1 replacement; quantity korunur.

## 6. Persistence
Leaf ayrı persisted entity değildir; parent module/project state saklanır.

## 7. Renderer boundary
Renderer parent geometry'sini procedural üretir; specialized renderer override izinlidir, BOM/product source-of-truth Item metadata'sıdır.

## 8. Regression
`test/straightPanelsItemContract.test.js` + corner testleri identity, dimensions, quantity, expansion ve replacement parity'sini kilitler.

## Checklist sonucu
`itemKey/dimensions/role=VAR`; `material/defaultColor=YOK (doğrulanmış product değeri yok)`; `recipe consumer=VAR`; `project override state=VAR (parent surface)`; `independent leaf behavior/persistence=UYGULANMIYOR`; `corner replacement=VAR`; `renderer override=izinli`; `regression=VAR`.
