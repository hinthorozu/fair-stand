# separator_panel_48_5 — Item Contract Definition

## Canonical identity
| Alan | Değer |
|---|---|
| `itemKey` | `separator_panel_48_5` |
| `name` | `Separatör Paneli 48,5 × 47 cm` |
| `type` | `separator-panel` |
| `unit` | `adet` |
| Yapı | Tekil Item |
| Parametrik | Hayır |

## Canonical intrinsic properties
```text
widthCm = 48.5
heightCm = 47
thicknessCm = 0.8
material = mdf
defaultColor = 0xc79b63
nominalModuleWidthCm = 50
```

`material = mdf` ürün kararı kullanıcı tarafından doğrulanmıştır. `defaultColor = 0xc79b63`, mevcut separator-specific runtime default renginin canonical Item karşılığıdır.

## Default-state consumer
Leaf Item bağımsız project instance değildir. Parent `separator` state'i oluşturulurken `src/designState.js#createSeparatorModuleState(50)` canonical Item `defaultColor` değerini okur ve UI/render state formatı olan `#c79b63` değerine dönüştürür.

Ayrı `DEFAULT_SEPARATOR_COLOR` business constant'ı canonical kaynak değildir ve kullanılmaz.

## Composition / BOM
`separator_panel_48_5` nihai fiziksel BOM Item'ıdır ve başka Item'lardan oluşmaz.

```text
separator:50 → separator_panel_48_5 × 1
```

Quantity owner parent recipe'dir (`src/moduleRecipes.js`). Recipe identity canonical `itemKey` üzerinden çözülür.

## Behavior / state / persistence ownership
Placement, move, rotation, snap, collision, connection, selection, context-menu, delete/duplicate ve persistence leaf Item davranışı değildir. Bunlar parent `separator` module/state katmanında yürür. `separator` mevcut `WALL_BEHAVIOR` sözleşmesini kullanır.

## Renderer / override boundary
`src/scene3d.js#createSeparatorModule()` procedural separator geometrisini üretir ve `surfaceState.color` tüketir. Renderer production ölçülerini geometry source-of-truth olarak okumak zorunda değildir; specialized render geometry ayrı override sınırıdır.

Kullanıcı/runtime renk değişikliği açık state override'ıdır ve canonical `defaultColor` değerini değiştirmez.

## Regression contract
`test/separatorPanelsItemContract.test.js` şunları kilitler:
- canonical `itemKey`, type/unit ve `partId` yokluğu,
- `48.5 × 47 × 0.8 cm`,
- `material = mdf`,
- `defaultColor = 0xc79b63`,
- parent separator state'in canonical Item default rengini tüketmesi,
- `separator:50` quantity `×1`,
- expanded recipe metadata parity.

## Completion
Bu Item için doğrulanmış intrinsic/default property'ler canonical Item içindedir ve mevcut default-state consumer canonical kaynağı kullanır. Renderer/state override sınırı korunur.
