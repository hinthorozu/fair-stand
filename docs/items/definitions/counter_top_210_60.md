# counter_top_210_60 — Item Contract Definition

Canonical source: `PRODUCTION_PARTS.counter_top_210_60`.

## 1. Canonical Item properties
| Alan | Değer | Durum |
|---|---|---|
| `itemKey` | `counter_top_210_60` | VAR |
| `type` | `counter-top` | VAR |
| `unit` | `adet` | VAR |
| yapı | tekil, parametrik değil | VAR |
| `dimensions.widthCm` | `210` | VAR |
| `dimensions.depthCm` | `60` | VAR |
| `dimensions.thicknessCm` | `1.8` | VAR — doğrulanmış ürün ölçüsü |
| `defaultColor` | `0xf8fafc` | VAR — opsiyonel canonical default |
| `nominalModuleWidthCm` | `200` | VAR |
| `material` | doğrulanmış değer yok | YOK — uydurulmaz |

Canonical default Item'da kalır; project/runtime veya specialized renderer explicit override uygulayabilir.

## 2. Factory / state / persistence
Leaf bağımsız project instance değildir; leaf factory/state/project `id`/ayrı persistence **UYGULANMIYOR**. Parent straight/L200 counter state'i `createCounterModuleState()` ile oluşur ve project `modules` state'inde persist edilir.

## 3. Behavior / interaction mapping
Leaf top bağımsız editor behavior taşımaz. Parent straight 200: `placement=free`, `moveSnapCm=50`, `rotationStepDeg=45`, `defaultRotationDeg=0`. Parent L200: `placement=free`, `moveSnapCm=50`, `rotationStepDeg=90`, `defaultRotationDeg=270`. Her ikisi `collision=footprint`, `magneticSnap=standard`, `connectionEndpoint=logical-fixture`, `boundarySnap=stand-edge` kullanır.

Selection/drag/context-menu/delete/duplicate/add işlemleri parent counter module seviyesindedir.

## 4. Parent recipe / BOM
İki aktif kullanım:
- `counter-200` → `{ itemKey: 'counter_top_210_60', quantity: 1 }`
- `counter-l-200` → `{ itemKey: 'counter_top_210_60', quantity: 1 }`

Quantity owner parent recipe'dir; expansion canonical Item metadata'sını tüketir.

## 5. Raw BOM / UI
Straight 200 ve L200 selection akışları canonical counter recipe resolver'a bağlıdır; `parseLCounterSelection()` L200'ü destekler. Leaf'e özel UI parser ownership yoktur.

## 6. Renderer / override
Straight/L renderer `topThicknessM=0.04`, `color=0xf8fafc`; L200 branch'i 2 cm overhang algoritması kullanır. Bunlar specialized render override'dır; canonical `210 × 60 × 1.8 cm` ve defaultColor Item'da kalır.

## 7. Regression
- `test/counterTopsItemContract.test.js`
- `test/counterTopDefaultColor.test.js`
- `test/counterRecipes.test.js`
- `test/lCounter200Contract.test.js`
- `test/rawBomSelectionParser.test.js`

## Checklist sonucu
```text
canonical Item properties               VAR
verified dimensions/thickness           VAR
defaultColor                             VAR
material                                 YOK (doğrulanmış değer yok)
factory / standalone state               UYGULANMIYOR
leaf behavior / context menu             UYGULANMIYOR (parent-owned)
parent behavior mapping                  VAR (straight + L)
persistence mapping                      VAR (parent-owned)
parent recipe / quantity                 VAR (2 ×1)
Raw BOM straight/L200 path               VAR
renderer override boundary               VAR
regression                               VAR
```
