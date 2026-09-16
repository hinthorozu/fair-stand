# Fair Stand — Item mimarisi refactor günlüğü

Bu dosya Item mimarisine geçişin tek merkezi değişiklik kaydıdır. Audit dökümü değildir; yalnız gerçekten uygulanan adımlar ve o adımdan sonra geçerli kurallar yazılır.

---

## 2026-09-16 — Item katalog metadata alanları

### Amaç

Katalog görünürlüğünü ve katalog içi konumu Item'ın kendi verisine taşımak. Bu tur katalog UI'yı yeni alanlardan okutmaz; yalnız 104 Item kaydını hazırlar.

### Yapılan değişiklikler

- Eklenen Item alanları: `catalogVisible`, `catalogCategory`, `catalogItemIndex`
- Değer kaynağı: canlı `MODULE_CATALOG_GROUPS` üyeliği ve `MODULE_CATALOG_KEYS` ile aynı grup içi UI sırası
- Kaldırılan alan yok
- `createCommercialCatalogItem` bu üç alanı katalog descriptor'ına kopyalamaz; MODULE_CATALOG şekli korunur
- Etkilenen dosyalar: `src/items.js`, `src/catalog.js`, `test/itemCatalogFields.test.js`, `test/shelfLegItemContract.test.js`, `docs/REFACTOR.md`

Canonical `catalogCategory` key'leri (mevcut 6 grup, yeni grup yok):

| key | grup label | Item sayısı |
|---|---|---|
| `panel-wall` | Panel & Duvar | 12 |
| `panel-addon` | Panel Ek Modül | 13 |
| `shelf-showcase` | Raf & Vitrin | 8 |
| `counter-base` | Banko & Baza | 9 |
| `extra` | Extra | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 |

`wall_200`: `catalogVisible=true`, `catalogCategory=panel-wall`, `catalogItemIndex=1` (grupta ilk kart).
`panel_197`: `catalogVisible=false`, `catalogCategory=null`, `catalogItemIndex=null`.

### Yeni kural

- `catalogVisible`: Item sol katalogda gösterilecek mi
- `catalogCategory`: Item'ın ait olduğu katalog category key; yalnız UI gruplamasıdır, runtime behavior belirlemez
- `catalogItemIndex`: kendi kategorisi içinde 1 tabanlı sıra
- Bu üç alan type'tan, Item Contract'tan veya registry grubundan türetilmez
- Her Item kendi değerini taşır; ayrı assignment tablosu yoktur
- Katalogda görünmeyen Item: `false / null / null`
- Bu turda katalog UI hâlâ `MODULE_CATALOG_GROUPS` okur

### Doğrulama

- Toplam Item: 104 / 104
- `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanı: 104 / 104
- `catalogVisible=true`: 64 (canlı katalog Item sayısıyla aynı)
- visible=true olup category veya index null: 0
- visible=false olup category veya index dolu: 0
- Aynı kategoride duplicate index: 0
- Her kategoride index 1..N kesintisiz
- Katalog grup sırası, grup içi Item sırası ve görünen Item sayısı değişmedi
- `npm test`: 732 pass / 0 fail
- `npm run build`: geçti
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

Katalog UI'yı `MODULE_CATALOG_GROUPS` yerine Item'daki `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanlarından okutmak. Bu turda yapılmaz.
