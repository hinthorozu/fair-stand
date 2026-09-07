`connector_double` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:26`

```js
connector_double: Object.freeze({
  partId: 'connector_double',
  name: 'Çiftli Aparat',
  type: 'connector',
  unit: 'adet',
  connectorType: 'double'
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik `partId = connector_double`'dır.

# 2. Doğrudan runtime referansları

`src/` altında `connector_double` **yalnızca `src/productionParts.js` tanımında** geçer.

Özellikle:

```text
src/moduleRecipes.js    → connector_double yok
src/rawBomDebug.js      → connector_double yok
src/designState.js      → connector_double yok
src/scene3d.js          → connector_double yok
src/modulePlacement.js  → connector_double yok
src/projectStore.js     → connector_double yok
```

Dolayısıyla mevcut çalışan kodda tanım sonrası otomatik çağrı zinciri yoktur.

# 3. Resolver durumu

`getProductionPart('connector_double')` çağrılırsa production kaydı döner:

```text
connector_double
→ getProductionPart(...)
→ PRODUCTION_PARTS.connector_double
→ Çiftli Aparat
```

Ancak mevcut `src/` runtime kodunda bu çağrıyı `connector_double` için yapan bir tüketici bulunmadı.

`listProductionParts()` (`src/productionParts.js:56-58`) genel katalog listesine bu kaydı da dahil eder; mevcut runtime `src/` içinde `listProductionParts()` kullanan bir tüketici yoktur.

# 4. BOM / recipe durumu

`connector_double` hiçbir `recipe.items` listesinde bulunmaz. Bu nedenle:

```text
quantity yok
module recipe ownership yok
getExpandedModuleRecipe() yoluyla aktif BOM satırı yok
Raw BOM UI satırı yok
```

`src/moduleContracts.js` module-level BOM policy olarak recipe source'unu tanımlar, ancak hiçbir recipe `connector_double` kullanmadığı için bu parça herhangi bir module contract assignment üzerinden aktif BOM kalemine dönüşmez.

# 5. State / persistence / renderer

Mevcut runtime kodunda:

```text
connector_double state field yok
connector_double runtime instance yok
connector_double persistence entity yok
connector_double mesh identity yok
```

`src/main.js:1257-1265` module state'lerini persist eder; bu production parça state'te olmadığı için projeye ayrı kayıt olarak girmez.

`src/scene3d.js` bu parçayı okumaz ve ayrı bir connector mesh üretmez.

# 6. Placement ilişki sistemi ayrı

`src/modulePlacement.js` modüller arası snap için `end-to-end`, `corner`, `tee`, `fixture-side`, `corner-face` gibi `snapKind` değerleri kullanır (`:741-815,964-987`).

Bu ilişki sistemi ile `connector_double` arasında mevcut kodda mapping yoktur. Örneğin iki modülün birleşmesi otomatik olarak `connector_double` üretmez; recipe quantity dönüşümü yapan bir ilişki pass'i bulunmaz.

Bu nedenle `connector_double` tanımındaki `connectorType = 'double'` bugün production metadata'dır; placement davranışını sürmez.

# 7. UI/runtime tüketimi

`src/rawBomDebug.js` sadece `recipe.items` elemanlarını gösterir. `connector_double` hiçbir recipe item'ı olmadığı için mevcut Raw BOM Debug üzerinden görünmez.

# 8. Test zinciri

Doğrudan test:

`test/moduleRecipes.test.js:13-18`

```js
assert.equal(getProductionPart('connector_double').name, 'Çiftli Aparat');
```

Bu test production registry tanımını/lookup'ını doğrular. `connector_double` miktarı, recipe entegrasyonu, state, persistence veya renderer bağlantısını test eden mevcut test bulunmadı.

İlgili hedefli test seti çalıştırıldı: **49 pass / 0 fail**.

# Mevcut zincirin özeti

```text
src/productionParts.js
→ PRODUCTION_PARTS.connector_double
→ getProductionPart('connector_double') çağrılırsa metadata döner

moduleRecipes.js   → kullanım yok
rawBomDebug.js     → kullanım yok
designState.js     → kullanım yok
scene3d.js         → kullanım yok
persistence        → kullanım yok
placement mapping  → kullanım yok
```

En kritik mevcut durum: **`connector_double` bugün production registry'de tanımlı bir `partId`dir; fakat mevcut runtime sisteminde hiçbir recipe, BOM tüketicisi, state, renderer, persistence veya placement ilişkisine bağlı değildir.**