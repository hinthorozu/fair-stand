> Migration öncesi envanterdir; aktif kanonik tanım `../definitions/VIDEO_WALL_3X3.md` içindedir. Eski kayıt uyumluluğu kullanıcı kararıyla kapsam dışıdır.

# VIDEO_WALL_3X3 — Tarihî envanter profili

Bu belge `VIDEO_WALL_3X3` için migration öncesi `Version2` runtime kodunda çalışan TV / wall-overlay akışını toplar. O dönemde katalog kaydı `TV_55` tabanından türetilip toplam ölçü/panel/grid alanları elle override ediliyordu (`src/catalog.js`).

## Kimlik / state

| Alan | Kod değeri |
|---|---|
| Katalog anahtarı | `VIDEO_WALL_3X3` |
| Etiket | `Video Wall 3×3` |
| Type | `tv` |
| Catalog width | `325.5 cm` |
| Catalog height | `183 cm` |
| State screen width | `325.5 cm` |
| State screen height | `183 cm` |
| State depth | `5 cm` |
| Rows × Cols | `3 × 3` |
| Panel screen | `108.5 × 61 cm` |
| sizeInch | `55` |

Video wall katalog kaydında `heightCm` toplam ekran yüksekliği (183) değeridir; ordinary TV'lerdeki 350 cm mounting height kullanılmaz. Toplam ekran ölçüleri panel `108.5 × 61 cm` × `3 × 3` grid'inden gelir.

## Sözleşme

| Alan | Kod değeri |
|---|---|
| Profile | `wall-media` |
| State sahibi | `src/designState.js` |
| Kalıcılık | `project-state` |
| Color | `fixed` |
| Image | `renderer-managed` |
| Renderer politikası | `specialized-media` |
| Runtime | `static` |
| Bileşim | `standalone` |
| BOM kipi | `decision-required` |
| BOM kaynağı | `None` |

## Davranış / yerleşim

| Alan | Kod değeri |
|---|---|
| Placement contract | `wall-overlay` |
| Move snap | `10 cm` |
| Rotation step | `90°` |
| Default rotation | `0°` |
| Side insert flag | `false` |
| Collision contract | `none` |
| Magnetic snap | `none` |
| Ghost | `silhouette / module-silhouette / opacity 0.38` |

## Renderer

`createTvModule()` procedural black TV box oluşturur ve front face'e `tv-screen.jpg` texture uygular. Bu video wall varyantında `3×3` panel grid'i için 1 cm black seam mesh'leri panel sınırlarına eklenir. Runtime tek instance'tır; N adet ayrı TV_55 değildir.

## BOM

Kodda bu Item için recipe yoktur.

```text
bom.mode = decision-required
bom.source = None
```

## Migration öncesi kod kaynakları

- `src/catalog.js`
- `src/tvConfig.js`
- `src/designState.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/scene3d.js`
