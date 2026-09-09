# base_top_157_50 — Item Contract Definition

## 1. Canonical identity
- `itemKey = base_top_157_50`
- `type = base-top`
- `unit = adet`
- yapı: Tekil Item
- parametrik: hayır

## 2. Canonical intrinsic/default properties
Canonical source: `src/productionParts.js`.

```text
name                      Baza Üstü 157 × 50 cm
widthCm                   157
depthCm                   50
thicknessCm               1.8
material                  sunta
defaultColor              0xffffff
nominalModuleWidthCm      150
```

Bu değerler Item'ın ürün tanımıdır. `material` ve `defaultColor` genel Item şemasında zorunlu değildir; bu Item için doğrulandıkları için tanımlıdır. Explicit project/runtime veya specialized renderer override uygulanabilir; override canonical default'u değiştirmez.

## 3. Factory / catalog / state / persistence
Bağımsız leaf project instance factory, mutable state, project `id` ve persistence entity'si **UYGULANMIYOR**. Parent catalog Item'ları `BASE_150` ve `wall_base_150`'dır. Leaf production identity recipe + `getProductionItem()` üzerinden çözülür.

## 4. Behavior / interaction capabilities
Leaf top ayrı scene Item instance'ı olmadığı için placement, move, rotation, snap, collision, selection, drag, context-menu, delete, duplicate ve keyboard capability'leri **UYGULANMIYOR**. Bu interaction'lar parent base/base-wall seviyesindedir.

## 5. Relationships
Leaf için ayrı canonical relationship/reflow state'i **UYGULANMIYOR**. Parent composition ownership recipe'dedir.

## 6. BOM / composition
Tam iki parent recipe canonical Item'ı `×1` tüketir:
- `base-150`
- `base-wall-150`

Recipe satırı `{ itemKey: 'base_top_157_50', quantity: 1 }` biçimindedir. Expansion `getRecipeItemKey()` → `getProductionItem()` üzerinden canonical metadata'yı tüketir. Recursive composition **UYGULANMIYOR**.

## 7. Renderer / override policy
Renderer procedural ve specialized temsil kullanabilir. `src/scene3d.js` içindeki render kalınlığı/overhang/rengi canonical production property değildir. Renderer görsel amaçla override edebilir; BOM/business source-of-truth `PRODUCTION_PARTS.base_top_157_50` olarak kalır.

## 8. Regression contract
`test/baseTopsItemContract.test.js` şu hard gate'leri kilitler:
1. canonical `itemKey`, `type`, `unit`,
2. `157 × 50 × 1.8 cm`,
3. `material = sunta`,
4. `defaultColor = 0xffffff`,
5. `nominalModuleWidthCm = 150`,
6. tam iki canonical parent recipe ve `×1` parity,
7. expanded recipe'nin aynı canonical Item metadata'sını resolve etmesi.

## Completion
Intrinsic/default property ownership **VAR**; canonical BOM consumer cutover **VAR**; renderer override sınırı **VAR ve izinli**. Ayrı leaf state/behavior/persistence **UYGULANMIYOR**.
