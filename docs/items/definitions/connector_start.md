# connector_start — Item Contract Migration

Bu belge `connector_start` için migration öncesi kod haritasını (`docs/items/current-system/connector_start.md`), Item Contract mapping'ini ve uygulanan runtime cutover durumunu birlikte kaydeder.

Bu migration yeni connector davranışı icat etmez. Mevcut `connector_start` miktarları, adı, `type`, `unit` ve `connectorType` değerleri korunmuştur.

## 1. Canonical kimlik

| Alan | Güncel runtime değeri |
|---|---|
| `itemKey` | `connector_start` |
| Ad | `Başlangıç Aparatı` |
| `type` | `connector` |
| Item yapısı | Tekil Item |
| `unit` | `adet` |
| Metadata | `connectorType = start` |
| Project instance | Uygulanmıyor |
| Renderer / placement | Uygulanmıyor |

Migration öncesinde aynı stabil kimlik `partId = connector_start` olarak kullanılıyordu. Cutover ile `connector_start` için canonical runtime kimliği `itemKey` oldu; yeni ikinci bir ürün kimliği üretilmedi.

`connector_single`, `connector_double`, `connector_corner` ve diğer production parçaları bu migration kapsamında değildir ve mevcut `partId` yolunda kalır.

## 2. Canonical Item definition

Canonical Item kaydı `src/productionParts.js` içinde tutulur:

```js
connector_start: Object.freeze({
  itemKey: 'connector_start',
  name: 'Başlangıç Aparatı',
  type: 'connector',
  unit: 'adet',
  connectorType: 'start'
})
```

Ayrı project-instance factory oluşturulmadı; çünkü mevcut sistemde `connector_start` scene/project instance değildir.

## 3. Item/BOM rolü

`connector_start` başka Item bileşimi içermez; bu nedenle **Tekil Item**dır. `wall_200`, vitrin, banko, baza gibi parent/bileşik Item reçetelerinde kullanıldığında o parent'ın **alt Item'ı** rolündedir.

Miktarın source-of-truth'u bugün parent `moduleRecipes.js` reçetesidir. `unit = adet` production metadata'sından gelir. Bu migration ayrı bir `terminal` sınıfı, `bom.mode = terminal` veya paralel ikinci BOM resolver oluşturmaz.

## 4. Recipe cutover

Migration öncesi:

```js
{ partId: 'connector_start', quantity: N }
```

Migration sonrası:

```js
{ itemKey: 'connector_start', quantity: N }
```

`src/moduleRecipes.js` içindeki 27 `connector_start` recipe satırının tamamı `itemKey` kullanır.

Diğer henüz migrate edilmemiş production parçaları aynı recipe içinde `partId` kullanmaya devam eder. Mixed migration resolver'ı:

```js
getRecipeItemKey(item)
```

şu sırayı kullanır:

```text
item.itemKey
→ yoksa item.partId
```

Bu, `ITEM_MIGRATION_RULES.md` içindeki Item-by-Item geçiş kuralını uygular; diğer Item'ları topluca migrate etmez.

## 5. Runtime resolution zinciri

Güncel zincir:

```text
module type + nominal width + options
→ getModuleRecipe(...)
→ recipe item { itemKey: 'connector_start', quantity: N }
→ expandRecipe(...)
→ getRecipeItemKey(...)
→ getProductionItem('connector_start')
→ production metadata (`unit = adet`)
```

Legacy production lookup:

```js
getProductionPart(partId)
```

paylaşılan eski production parçaları migrate edilirken compatibility için korunmuştur. `connector_start`ın kendi definition kaydında artık `partId` alanı yoktur.

## 6. Mevcut miktarlar korunmuştur

`connector_start` hâlâ 27 parent recipe'de aynı sabit miktarlarla kullanılır:

| Recipe ailesi | Recipe sayısı | Miktar |
|---|---:|---:|
| straight wall 50/100/150/200 | 4 | 2 |
| door 100 | 1 | 2 |
| shelf 100/150/200 × 2/3 raf | 6 | 2 |
| showcase 2/3 göz | 2 | 4 |
| separator 50/100 | 2 | 2 |
| L counter 100/150/200 | 3 | 8 |
| straight counter 100/150/200 | 3 | 6 |
| base-wall 100/150/200 | 3 | 6 |
| base 100/150/200 | 3 | 8 |

Toplam: 27 recipe.

Miktarlar project adjacency/corner state'inden türetilmiyor. Bu migration ilişki-temelli connector hesabı eklemez.

## 7. State / behavior / interaction / renderer / persistence

Aşağıdaki alanlar `connector_start` için uygulanmıyor ve migration ile eklenmedi:

- project instance `id`,
- mutable Item state,
- save/load edilen connector instance,
- placement,
- move / rotation,
- collision / snap,
- selection / drag / context menu,
- renderer / mesh / GLB,
- ghost / preview,
- asset / color / image.

`type = connector` production metadata'sıdır; `src/moduleBehavior.js` içinde connector behavior family oluşturulmadı.

## 8. Relationship durumu

`src/modulePlacement.js` içindeki module-level `end-to-end`, `corner`, `tee`, `fixture-side`, `corner-face` ilişkileri ile `connector_start` arasında bugün canonical BOM mapping yoktur.

Dolayısıyla bu migration sonrasında da:

```text
connector_start quantity = parent recipe sabiti
```

olarak kalır.

Relationship-derived connector miktarı ayrı bir ürün/mimari kararı gerektirir; bu migration kapsamında tahmin edilmemiştir.

## 9. Regression / parity

Hedefli test seti:

```text
test/moduleRecipes.test.js
test/showcaseRecipes.test.js
test/separatorRecipes.test.js
test/counterRecipes.test.js
test/lCounter100Contract.test.js
test/lCounter150Contract.test.js
test/lCounter200Contract.test.js
test/baseWallRecipes.test.js
test/baseRecipes.test.js
```

Migration sonrası sonuç:

```text
53 pass
0 fail
```

Yeni regression kontrolleri özellikle şunları doğrular:

1. `connector_start.itemKey === 'connector_start'`.
2. Definition üzerinde legacy `partId` bulunmaması.
3. `connector_start` recipe kimliğinin `itemKey` olması.
4. Aynı recipe'deki migrate edilmemiş parçaların `partId` kullanmaya devam etmesi.
5. 27 recipe kullanımının tamamında yalnız `connector_start`ın migrate edilmiş olması.
6. Expanded recipe'nin canonical production metadata'yı `itemKey` üzerinden çözmesi.
7. Raw BOM debug consumer'ın mixed `itemKey` / `partId` geçişini okuyabilmesi.

Full `node --test` sonucu:

```text
501 test
496 pass
5 fail
```

Fail olan testler migration öncesi baseline ile aynı beş testtir:

- `test/globalSilhouetteGhost.test.js`
- `test/projectDropdownSwitchIntegration.test.js`
- `test/selectedModuleRotationCursor.test.js`
- `test/selectionFeedbackMainIntegration.test.js`
- `test/systemChangeGateCiContract.test.js`

Bu değişiklik yeni bir full-suite fail eklememiştir.

## 10. Migration durumu

```text
1. Current runtime code map      → TAMAM
2. ITEM_CONTRACT mapping         → TAMAM
3. Yeni Item implementasyonu     → TAMAM
4. Parity doğrulaması            → TAMAM (53/53 targeted)
5. Runtime cutover               → TAMAM (`connector_start` recipe identity = itemKey)
6. Eski Item-specific yol sökümü → TAMAM (`connector_start` definition/recipe partId yolu kaldırıldı)
7. Regression doğrulaması        → TARGETED TAMAM; full suite mevcut 5 baseline fail ile aynı durumda
```

## 11. Açık kalan sistem seviyesi doğrulamalar

Bu çalışma ağacında dependency kurulumu tamamlanamadı. `npm run build` `vite: not found` ile; targeted `npm run e2e -- e2e/smoke.spec.mjs` ise Node `@playwright/test` CLI mevcut olmadığı için çalışmadı. Sonuç doğrulanmadan build veya browser E2E'nin başarılı olduğu varsayılmaz.

Change contract lokal git baseline'a karşı çalıştırıldı:

```bash
CHANGE_GATE_BASE=HEAD node scripts/verify-change-contract.mjs
```

Sonuç: `connector-start-item-contract-cutover` kabul edildi; BOM/UI/test domainleri review edildi, targeted E2E zorunluluğu `e2e/smoke.spec.mjs` olarak kaydedildi.
