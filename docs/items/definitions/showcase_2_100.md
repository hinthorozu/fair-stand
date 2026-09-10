# showcase_2_100 — Item Contract Definition

## Canonical identity

- `itemKey`: `showcase_2_100`
- `name`: `2 Gözlü Vitrin 100 cm`
- `type`: `showcase-2`
- `unit`: `adet`
- yapı: **Bileşik Item**
- `dimensions.widthCm = 100`
- `eyeCount = 2`

Eski `wall_showcase_100_2` catalog key aktif ürün kimliği değildir. Restore compatibility resolver eski key'i `showcase_2_100` canonical kimliğine çevirir; yeni state/catalog yalnız canonical key'i yazar.

## Verified body child roles

```text
sideItemKey       = showcase_side_94_6_30
horizontalItemKey = showcase_horizontal_87_4_30
glassShelfItemKey = glass_shelf
```

Role metadata renderer/factory'nin doğru canonical child Item'ı bulması içindir; quantity source-of-truth değildir. Miktarlar yalnız recipe sahibinde tutulur.

## Base composition

```text
profile_91                     ×4
upright_346_5                  ×2
panel_98                       ×5
connector_start                ×4
connector_single               ×9
showcase_side_94_6_30          ×2
showcase_horizontal_87_4_30    ×2
glass_shelf                    ×1
```

## Inner-corner variant

```text
panel_98 ×5 → panel_corner_92 ×5
connector_start ×4 → değişmez
connector_single ×9 → connector_single ×5 + connector_corner ×4
```

Diğer base child Item miktarları değişmez. Variant `src/moduleRecipes.js` içinde tek canonical recipe kaynağından çözülür. `resolveItemBom('showcase_2_100', 1, { panelVariant: 'inner-corner' })` terminal Item satırlarını recursive üretir.

## State / override / persistence

Factory canonical `itemKey`, `type`, `widthCm`, `eyeCount`, 7 surrounding wall-panel strip state'i ve `bodySurface` oluşturur. `bodySurface.color` **iki yan + iki yatay sunta için tek project instance override**'dır. Child board'lar ayrı ayrı editable değildir; image override almaz. Override yoksa renk canonical showcase-board `defaultColor=0xffffff` değerinden başlar.

Save/load parent instance state'i persist eder. Legacy showcase state normalize edilir; mevcut kullanıcı body rengi varsa korunur.

## Behavior / interaction

`showcase-2` mevcut shared `WALL_BEHAVIOR` contract'ını kullanır: wall placement, 50 cm move snap, 90° rotation, segment collision, standard magnetic snap, side insert, wall capacity ve shared ghost/reflow. Migration bu engine'leri yeniden yazmaz.

Çevre `panel_98`/corner panel yüzeyleri mevcut renk+görsel panel davranışını korur. `showcase-body` yüzeyi yalnız grouped color uygular; glass/lightbox/mesh/image panel komutlarına girmez.

## Renderer boundary

`createShowcaseModule()` body role resolver üzerinden canonical side/horizontal Item ölçülerini kullanır. 30 cm depth ve 18 mm thickness renderer'da bağımsız ürün sabiti değildir. Cam raf `glass_shelf` canonical Item ölçü/material'ından gelir; adet `1` ile `eyeCount-1` fiziksel raf düzenine eşittir.

Öndeki ince beyaz post/edge/shelf-front mesh'leri bugün doğrulanmış production Item değildir. Renderer-only detay olarak kalır ve BOM'a dahil edilmez.

## Relationship boundary

Inner-corner recipe doğrulanmış ve canonicaldır. Placement/relationship motorundaki gerçek corner ilişkisinin bu recipe context'ine otomatik taşınması shared Final BOM relationship integration işidir; showcase-specific proximity/renderer detector yazılmaz.
