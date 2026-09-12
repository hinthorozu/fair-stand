> Migration öncesi envanterdir; aktif canonical tanım `../definitions/chair_eames.md` içindedir.

# chair_eames — Mevcut Sistem Profili

Bağımsız katalog Item yoktu. Sandalye `furniture_table_chair_set_eames` renderer’ında `eames_chair.glb` clone ×4 olarak duruyordu. Aşağıdaki değerler set Item ve `createEamesTableChairSetModule` kaynaklıdır.

## Kimlik / state (set içinden)

| Alan | Kod değeri |
|---|---|
| Parent catalog key | `furniture_table_chair_set_eames` |
| Parent type | `table-chair-set-eames` |
| Sandalye width | `46 cm` (`chairWidthCm`) |
| Sandalye depth | `58 cm` (`chairDepthCm`) |
| Yükseklik | `82 cm` (set `heightCm` / `EAMES_CHAIR_TARGET_HEIGHT_M`) |
| Adet | `chairCount = 4` |
| Model file | `eames_chair.glb` (renderer hardcode) |

Set default surface rengi `#ffffff`; dört sandalye aynı `surface` state’ini paylaşır. `plastic_wit` gövde rengi alır; `Material1` bacak rengi `#a66b3d`. Seçim parent module seviyesindedir.

Renderer seçim proxy’si `50×56×82` cm’dir; bu Item ölçüsü değildir.

## Contract (parent)

| Alan | Kod değeri |
|---|---|
| Parent profile | `free-model-color` |
| Parent composition | `standalone` |
| Parent BOM mode | `decision-required` |
