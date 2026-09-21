# Default / override haritası

Kanıtlı zincir. Yeni mimari önerisi yok.

## Global varsayılanlar

| anahtar | değer | sahip |
|---|---|---|
| `DEFAULT_PANEL_COLOR` | `#ffffff` | `src/designState.js` |
| `STAND_DIMENSIONS.stripCount` | DB seed `7` | `fair_stand_dimensions` → bootstrap → `src/standDimensions.js` |
| `DEFAULT_BEHAVIOR` | `WALL_BEHAVIOR` | `src/moduleBehavior.js` |
| `DEFAULT_GHOST_BEHAVIOR` | kind=silhouette, renderer=module-silhouette, opacity=0.38 | `src/moduleBehavior.js` |
| `NO_SURFACE_CAPABILITIES` | color/image/glass/lightbox/mesh false | `src/itemCapabilities.js` |
| zemin fallback | `karolaj` | `resolveStandFloorItemKey` / `scene3d.setFloorType` |
| persistence | tüm project put, alan şeması yok | `src/projectStore.js` `saveProject` |

## Type ailesi davranış

`TYPE_BEHAVIORS` 27 anahtar. Item-level davranış override yalnız:

1. `counter` + `shape==='L'` → `defaultRotationDeg: 270` — `getModuleBehavior`
2. `counter` + düz + width 100/150/200 → `rotationStepDeg: 45` — `getModuleBehavior`
3. `bar-stool` type kaydı: `rotationStepDeg: 45`, `defaultRotationDeg: 270`, `sideInsertRotation: 'default'`
4. `base-wall` type kaydı: `collisionDepth: 'wall-backbone'`

## Profil sözleşmesi

Item, `MODULE_CONTRACT_ASSIGNMENTS[itemKey].profile` ile profile bağlanır. Appearance/renderer/runtime/tests profile'dan gelir; BOM item assignment'tadır.

| profil | color | image | renderer | örnek item |
|---|---|---|---|---|
| `wall-editable` | editable | editable | procedural-or-specialized | `door_100`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2` +18 |
| `wall-color-only` | editable | none | procedural-or-model | `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik` |
| `free-editable` | editable | editable | procedural | `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `BASE_100` +8 |
| `free-model-color` | editable | none | model | `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `furniture_bar_stool_classic` +3 |
| `free-model-fixed` | fixed | none | model | `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_coffee_table_classic`, `glass_table` +1 |
| `wall-media` | fixed | renderer-managed | specialized-media | `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3` |
| `top-light` | state-backed | none | procedural | `led_floodlight` |
| `wall-overlay-image` | halo-only | required | specialized-overlay | `illuminated-foam` |

## Item → runtime default kaynakları

| itemKey | renk default kaynağı | ölçü kaynağı | BOM | kullanıcı ezer |
|---|---|---|---|---|
| `upright_346_5` | Item.defaultColor | Item.dimensions | self | color, image, placement_move, rotation |
| `upright_99` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `upright_49_5` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `profile_41_5` | Item.defaultColor | Item.dimensions | self | color, image, placement_move, rotation |
| `profile_91` | Item.defaultColor | Item.dimensions | self | color, image, placement_move, rotation |
| `profile_140_5` | Item.defaultColor | Item.dimensions | self | color, image, placement_move, rotation |
| `profile_190` | Item.defaultColor | Item.dimensions | self | color, image, placement_move, rotation |
| `panel_48_5` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_98` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_147_5` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_197` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_corner_42_5` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_corner_92` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_corner_142_5` | yok | Item.dimensions | resolveItemBom | yok |
| `panel_corner_192` | yok | Item.dimensions | resolveItemBom | yok |
| `separator_panel_48_5` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `separator_panel_98` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `connector_start` | yok | yok | resolveItemBom | yok |
| `connector_single` | yok | yok | resolveItemBom | yok |
| `connector_double` | yok | yok | resolveItemBom | yok |
| `connector_corner` | yok | yok | resolveItemBom | yok |
| `door_leaf_100` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `shelf_100` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `shelf_150` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `shelf_200` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `shelf_leg` | yok | yok | resolveItemBom | yok |
| `showcase_side_94_6_30` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `showcase_side_143_5_30` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `showcase_horizontal_87_4_30` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `glass_shelf` | yok | Item.dimensions | resolveItemBom | yok |
| `counter_top_110_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `counter_top_52_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `counter_top_160_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `counter_top_102_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `counter_top_210_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `counter_top_150_60` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `base_top_107_50` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `base_top_157_50` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `base_top_206_50` | Item.defaultColor | Item.dimensions | resolveItemBom | yok |
| `COAT_RACK` | yok | Item.dimensions | self | placement_move, rotation |
| `KETTLE` | yok | Item.dimensions | self | placement_move, rotation |
| `MINI_FRIDGE_AVANTI` | yok | Item.dimensions | self | placement_move, rotation |
| `PLASTIC_TRASH_BIN` | yok | Item.dimensions | self | placement_move, rotation |
| `furniture_sofa_set_classic` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `furniture_sofa_single_classic` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `furniture_sofa_double_classic` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `furniture_coffee_table_classic` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `furniture_table_chair_set_eames` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `chair_eames` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `glass_table` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `furniture_bar_stool_classic` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `EXTRA_INDOOR_PLANT_1` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `EXTRA_LONG_PLANTER_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `EXTRA_LONG_PLANTER_150` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `EXTRA_LONG_PLANTER_200` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | decision-required | color, placement_move, rotation |
| `TV_42` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `TV_55` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `TV_65` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `VIDEO_WALL_2X2` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `VIDEO_WALL_3X3` | yok | Item.dimensions | decision-required | placement_move, rotation |
| `led_floodlight` | factory hardcode `#17191c` | Item.dimensions | decision-required | color, placement_move, rotation |
| `illuminated-foam` | haloColor default `#ffffff` | Item.dimensions | decision-required | color, image, foam_resize, placement_move, rotation |
| `karolaj` | Item.defaultColor | Item.dimensions | yok/hata | color, floor_select |
| `hali` | Item.defaultColor | yok | yok/hata | color, floor_select |
| `parke-acik` | Item.defaultColor | Item.dimensions | yok/hata | floor_select |
| `parke-sari` | Item.defaultColor | Item.dimensions | yok/hata | floor_select |
| `parke-beton` | Item.defaultColor | Item.dimensions | yok/hata | floor_select |
| `door_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `BASE_100` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `BASE_150` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `BASE_200` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_100` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_150` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_200` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_100_L` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_150_L` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `desk_banko_200_L` | yok | Item.dimensions | recipe | color, image, placement_move, rotation |
| `wall_50` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_150` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_200` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_200_short_up_2` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_150_short_up_2` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_100_short_up_2` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_50_short_up_2` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_200_short_up_1` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_150_short_up_1` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_100_short_up_1` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_50_short_up_1` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_base_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_base_150` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_base_200` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_separator_50` | separator leaf defaultColor (separatorDefaultColor) | Item.dimensions | recipe | color, placement_move, rotation |
| `wall_separator_100` | separator leaf defaultColor (separatorDefaultColor) | Item.dimensions | recipe | color, placement_move, rotation |
| `wall_separator_50_sarmasik` | separator leaf defaultColor (separatorDefaultColor) | Item.dimensions | recipe | color, placement_move, rotation |
| `wall_separator_100_sarmasik` | separator leaf defaultColor (separatorDefaultColor) | Item.dimensions | recipe | color, placement_move, rotation |
| `wall_shelf_2_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_shelf_2_150` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_shelf_2_200` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_shelf_3_100` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_shelf_3_150` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_shelf_3_200` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, shelf_light, placement_move, rotation |
| `wall_showcase_100_2` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
| `wall_showcase_100_3` | DEFAULT_PANEL_COLOR `#ffffff` | Item.dimensions | recipe | color, image, glass, fabric_lightbox, fabric_mesh, placement_move, rotation |
