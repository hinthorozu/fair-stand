# counter_top_52_60 — Item Contract Definition

Canonical source: `PRODUCTION_PARTS.counter_top_52_60`.

## 1. Canonical Item properties
| Alan | Değer | Durum |
|---|---|---|
| `itemKey` | `counter_top_52_60` | VAR |
| `type` | `counter-top` | VAR |
| `unit` | `adet` | VAR |
| yapı | tekil, parametrik değil | VAR |
| `dimensions.widthCm` | `52` | VAR |
| `dimensions.depthCm` | `60` | VAR |
| `dimensions.thicknessCm` | `1.8` | VAR — doğrulanmış ürün ölçüsü |
| `defaultColor` | `0xf8fafc` | VAR — opsiyonel canonical default |
| `nominalModuleWidthCm` | `100` | VAR |
| `material` | doğrulanmış değer yok | YOK — uydurulmaz |

Canonical default Item'da kalır; project/runtime veya specialized renderer explicit override uygulayabilir.

## 2. Factory / state / persistence
Leaf bağımsız project instance değildir; leaf factory/state/project `id`/ayrı persistence **UYGULANMIYOR**. Parent L100 counter state'i `createCounterModuleState()` ile oluşur ve project `modules` state'inde persist edilir.

## 3. Behavior / interaction mapping
Leaf top bağımsız editor behavior taşımaz. Parent L100: `placement=free`, `moveSnapCm=50`, `rotationStepDeg=90`, `defaultRotationDeg=270`, `collision=footprint`, `magneticSnap=standard`, `connectionEndpoint=logical-fixture`, `boundarySnap=stand-edge`.

Selection/drag/context-menu/delete/duplicate/add işlemleri parent counter module seviyesindedir.

## 4. Parent recipe / BOM
Tek aktif kullanım: `counter-l-100` → `{ itemKey: 'counter_top_52_60', quantity: 1 }`.
Quantity owner parent recipe'dir; expansion canonical Item metadata'sını tüketir.

## 5. Raw BOM / UI
L100 selection feedback → `parseLCounterSelection()` → canonical `counter-l-100` recipe resolver yolu aktiftir. Leaf'e özel UI parser ownership yoktur.

## 6. Renderer / override
L100 specialized renderer ikinci top'u doğrudan `0.52 × 0.60` geometry ile üretir; `topThicknessM=0.04`, `color=0xf8fafc` kullanır. Bunlar specialized render override'dır; canonical `52 × 60 × 1.8 cm` ve defaultColor Item'da kalır.

## 7. Regression
- `test/counterTopsItemContract.test.js`
- `test/counterTopDefaultColor.test.js`
- `test/lCounter100Contract.test.js`
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
Raw BOM L100 path                        VAR
renderer override boundary               VAR
regression                               VAR
```
