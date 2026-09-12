# base_top_107_50 — Item Contract Definition

## 1. Kanonik kimlik
- `itemKey = base_top_107_50`
- `type = base-top`
- `unit = adet`
- yapı: Tekil Item
- parametrik: hayır

## 2. Kanonik ürüne özgü / varsayılan özellikler
Kanonik source: `src/productionParts.js`.

```text
name                      Baza Üstü 107 × 50 cm
widthCm                   107
depthCm                   50
thicknessCm               1.8
material                  sunta
defaultColor              0xffffff
nominalModuleWidthCm      100
```

Bu değerler Item'ın ürün tanımıdır. `material` ve `defaultColor` genel Item şemasında zorunlu değildir; bu Item için doğrulanmış oldukları için tanımlıdır. Explicit project/runtime veya specialized renderer ezme uygulanabilir; ezme kanonik default'u değiştirmez.

## 3. Oluşturma / katalog / state / kalıcılık
Bağımsız leaf proje örneği oluşturucu, mutable state, project `id` ve kalıcılık entity'si **UYGULANMIYOR**. Parent catalog Item'ları `BASE_100` ve `wall_base_100`'dır. Leaf production identity recipe + `getProductionItem()` üzerinden çözülür.

## 4. Davranış / etkileşim yetenekleri
Leaf top ayrı scene Item örneği olmadığı için yerleşim, move, rotation, snap, collision, selection, drag, context-menu, delete, duplicate ve keyboard yetenek'leri **UYGULANMIYOR**. Bu interaction'lar parent base/base-wall Item/module seviyesindedir.

## 5. İlişkiler
Leaf için ayrı kanonik relationship/reflow state'i **UYGULANMIYOR**. Parent composition sahiplik recipe'dedir.

## 6. BOM / bileşim
Tam iki parent recipe kanonik Item'ı `×1` tüketir:
- `base-100`
- `base-wall-100`

Recipe satırı `{ itemKey: 'base_top_107_50', quantity: 1 }` biçimindedir. Expansion `getRecipeItemKey()` → `getProductionItem()` üzerinden kanonik üstveriyi tüketir. Recursive composition **UYGULANMIYOR**.

## 7. Renderer / ezme politikası
Renderer prosedürel ve specialized temsil kullanabilir. `src/scene3d.js` içindeki render kalınlığı/overhang/rengi kanonik production property değildir. Renderer `defaultColor` veya geometry değerlerini görsel amaçla ezebilir; BOM/business tek kaynak `PRODUCTION_PARTS.base_top_107_50` olarak kalır.

## 8. Regresyon sözleşmesi
`test/baseTopsItemContract.test.js` şu hard gate'leri kilitler:
1. kanonik `itemKey`, `type`, `unit`,
2. `107 × 50 × 1.8 cm`,
3. `material = sunta`,
4. `defaultColor = 0xffffff`,
5. `nominalModuleWidthCm = 100`,
6. tam iki kanonik parent recipe ve `×1` eşyapı,
7. expanded recipe'nin aynı kanonik Item üstverisinı resolve etmesi.

## Tamamlanma
Intrinsic/default property sahiplik **VAR**; kanonik BOM tüketici geçiş **VAR**; renderer ezme sınırı **VAR ve izinli**. Ayrı leaf state/behavior/kalıcılık **UYGULANMIYOR**.
