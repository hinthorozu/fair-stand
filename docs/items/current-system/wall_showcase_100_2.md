# wall_showcase_100_2

## Canonical Item

- `itemKey`: `wall_showcase_100_2`
- `type`: `showcase-2`
- `unit`: `adet`
- `dimensions.widthCm`: `100`
- `eyeCount`: `2`
- Bileşik Item / Item kümesi; `showcase_2_100` diye arada aggregate Item yoktur.

## BASE composition

- `profile_91 ×4`
- `upright_346_5 ×2`
- `panel_98 ×5`
- `connector_start ×4`
- `connector_single ×9`
- `showcase_side_94_6_30 ×2`
- `showcase_horizontal_87_4_30 ×2`
- `glass_shelf ×1`

Bu migration yalnız doğrulanmış normal/BASE reçeteyi kapatır. Inner-corner varyantı bu committe tanımlı değildir; eksik/yarım bir köşe varyantı çalıştırılmaz.

## Runtime ownership

- Catalog key ve canonical Item identity aynıdır: `wall_showcase_100_2`.
- Shared `WALL_BEHAVIOR` placement/move/rotation/snap/collision/reflow motoru korunur.
- State canonical `itemKey` + `eyeCount` taşır.
- `bodySurface` tek project-instance color override'dır; iki yan + iki yatay sunta birlikte renklenir. Child showcase-board Items ayrı ayrı editable değildir.
- Default body color child Items'dan `0xffffff` gelir.
- `glass_shelf` bu renk override'ından etkilenmez.
- Renderer board ölçülerini canonical child Items'dan okur; öndeki ince beyaz dekoratif/renderer parçaları BOM'a alınmamıştır.
- Legacy persisted showcase state load sırasında canonical `wall_showcase_100_2` identity/bodySurface'a normalize edilir.
