# wall_showcase_100_3

## Canonical Item

- `itemKey`: `wall_showcase_100_3`
- `type`: `showcase-3`
- `unit`: `adet`
- `dimensions.widthCm`: `100`
- `eyeCount`: `3`
- Bileşik Item / Item kümesi; `showcase_3_100` diye arada aggregate Item yoktur.

## BASE composition

- `profile_91 ×4`
- `upright_346_5 ×2`
- `panel_98 ×4`
- `connector_start ×4`
- `connector_single ×7`
- `showcase_side_143_5_30 ×2`
- `showcase_horizontal_87_4_30 ×2`
- `glass_shelf ×2`

## Inner-corner composition

`panelVariant: 'inner-corner'` recipe context'i verildiğinde doğrulanmış köşe BOM'u canonical recipe üzerinden çözülür:

- `panel_98 ×4 → panel_corner_92 ×4`
- `connector_start ×4` değişmez
- `connector_single ×7 → connector_single ×5 + connector_corner ×4`
- Diğer BASE child Item miktarları değişmez.

Bu varyant `wall_showcase_100_3` canonical parent Item'ının aynı recipe zinciridir; ayrı `showcase_3_100` aggregate Item oluşturulmaz. Relationship bilgisinden `panelVariant` context'inin otomatik üretilmesi bu Item'a özel olarak eklenmemiştir.

## Runtime ownership

- Catalog key ve canonical Item identity aynıdır: `wall_showcase_100_3`.
- Shared `WALL_BEHAVIOR` placement/move/rotation/snap/collision/reflow motoru korunur.
- State canonical `itemKey` + `eyeCount` taşır.
- `bodySurface` tek project-instance color override'dır; iki yan + iki yatay sunta birlikte renklenir. Child showcase-board Items ayrı ayrı editable değildir.
- Default body color child Items'dan `0xffffff` gelir.
- `glass_shelf` bu renk override'ından etkilenmez.
- Renderer board ölçülerini canonical child Items'dan okur; öndeki ince beyaz dekoratif/renderer parçaları BOM'a alınmamıştır.
- Legacy persisted showcase state load sırasında canonical `wall_showcase_100_3` identity/bodySurface'a normalize edilir.
