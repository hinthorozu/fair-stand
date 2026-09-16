# Default / override zincirleri (özellik katmanı)

Tahmin yok. Katman özeti koddan:

| katman | zincir |
|---|---|
| `static.*` / `itemKey` / `name` / `type` | yalnız `src/items.js` dondurulmuş kayıt. Override yok. Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez. Fallback zemin: `resolveStandFloorItemKey` → `karolaj`. |
| `catalog.*` | Item kaydı → `create*CatalogItem` → `MODULE_CATALOG`. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` remap. Kullanıcı katalog alanını ezemaz. |
| `behavior.*` | `DEFAULT_BEHAVIOR` (`WALL_BEHAVIOR`) → `TYPE_BEHAVIORS[type]` → `getModuleBehavior` item override: counter L `defaultRotationDeg` 270; düz banko 100/150/200 `rotationStepDeg` 45. Ghost yoksa `DEFAULT_GHOST_BEHAVIOR`. Persist yok. |
| `contract.*` | `MODULE_CONTRACT_ASSIGNMENTS[itemKey].profile` → `MODULE_CONTRACT_PROFILES`. Runtime override yok. |
| `capabilities.*` | `ITEM_SURFACE_CAPABILITIES_BY_TYPE` (`door-leaf`) → aksi halde `NO_SURFACE_CAPABILITIES`. Cam/kumaş bu tabloda değil. |
| yüzey `state.strips/faces/surface/bodySurface` | `DEFAULT_PANEL_COLOR` `#ffffff` veya `itemDefaultColorHex` → factory yüzey → kullanıcı `applyColor`/`applyImage`/`applyGlassOverride`/fabric → persist `modules[]` → load clone. `normalizeModuleItemState` itemKey düzeltir, yüzey ezmesini silmez. |
| `state.shelfLightingOn` | factory `false` → context menu `toggle-shelf-light` → persist `modules[]` → `createShelfModule` LED `.visible`. |
| `state.haloColor` | factory `#ffffff` (hex regex fallback aynı) → foam UI `moduleState.haloColor` → persist → halo material. |
| `state.imageAssetId` (foam) | factory argümanı → persist → renderer. Yüzey `imageAssetId` strips/faces içinde ayrı. |
| `state.widthCm` / `state.heightCm` | Item dimensions factory kopyası. Kullanıcı ezer: yalnız `illuminated-foam` `resize-foam`. |
| TV `media.*` / `state.screen*` | `resolveWallMediaMetrics` → factory TV state. Kullanıcı inç değiştirmez; ayrı itemKey yerleştirir. |
| persist | `buildProjectSnapshot` stand+modules → `saveProject` IndexedDB put. Alan şeması yok. |

Item bazlı tablo: `docs/items/audit/DEFAULT_OVERRIDE_HARITASI.md`. Her özellik dosyasında Default + Override ayrı başlık.
