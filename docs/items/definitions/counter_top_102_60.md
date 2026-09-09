# counter_top_102_60 — Item Contract Definition

Canonical source: `PRODUCTION_PARTS.counter_top_102_60`.

## 1. Canonical Item properties
| Alan | Değer | Durum |
|---|---|---|
| `itemKey` | `counter_top_102_60` | VAR |
| `type` | `counter-top` | VAR |
| `unit` | `adet` | VAR |
| yapı | tekil, parametrik değil | VAR |
| `dimensions.widthCm` | `102` | VAR |
| `dimensions.depthCm` | `60` | VAR |
| `dimensions.thicknessCm` | `1.8` | VAR — doğrulanmış ürün ölçüsü |
| `defaultColor` | `0xf8fafc` | VAR — opsiyonel canonical default |
| `nominalModuleWidthCm` | `150` | VAR |
| `material` | doğrulanmış değer yok | YOK — uydurulmaz |

Canonical default'lar Item'da kalır. Explicit project/runtime veya specialized renderer override izinlidir; override ikinci product source-of-truth değildir.

## 2. Factory / state / persistence
Bu leaf bağımsız project instance değildir: leaf factory/state/project `id`/ayrı persistence **UYGULANMIYOR**. Parent `counter-l-150` instance state'i `createCounterModuleState()` tarafından oluşturulur ve project `modules` snapshot'ında persist edilir.

## 3. Behavior / interaction mapping
Leaf top bağımsız placement/move/rotation/snap/collision/selection/context-menu capability taşımaz. Gerçek behavior owner parent L counter'dır:
- placement `free`
- move snap `50 cm`
- rotation step `90°`
- default rotation `270°`
- collision `footprint`
- magnetic snap `standard`
- connection endpoint `logical-fixture`
- boundary snap `stand-edge`

Delete/duplicate/add-left/add-right ve selection/drag parent module interaction'ına aittir.

## 4. Parent recipe / BOM
Tek aktif kullanım: `counter-l-150` → `{ itemKey: 'counter_top_102_60', quantity: 1 }`.
Quantity owner parent recipe'dir. Expansion canonical `getProductionItem()` metadata'sını tüketir. Leaf başka Item'lardan oluşmaz.

## 5. Raw BOM / UI
`selectionFeedback` L150 seçim etiketini üretir; `parseLCounterSelection()` 100/150/200 L-counter değerlerini canonical counter recipe resolver'a taşır. Leaf'e özel UI parser ownership yoktur.

## 6. Renderer / override
`createLCounterModule()` specialized procedural renderer'dır. `topThicknessM=0.04`, render overhang ve `color=0xf8fafc` kullanabilir. Bunlar canonical `102 × 60 × 1.8 cm` ve `defaultColor` değerlerini değiştirmez; renderer product/BOM source-of-truth değildir.

## 7. Regression
- `test/counterTopsItemContract.test.js`
- `test/counterTopDefaultColor.test.js`
- `test/lCounter150Contract.test.js`
- `test/rawBomSelectionParser.test.js`

## Checklist sonucu
```text
canonical Item properties               VAR
verified dimensions/thickness           VAR
defaultColor                             VAR
material                                 YOK (doğrulanmış değer yok)
factory / standalone state               UYGULANMIYOR
leaf behavior / context menu             UYGULANMIYOR (parent-owned)
parent behavior mapping                  VAR
persistence mapping                      VAR (parent-owned)
parent recipe / quantity                 VAR (1 ×1)
Raw BOM L150 path                        VAR
renderer override boundary               VAR
regression                               VAR
```
