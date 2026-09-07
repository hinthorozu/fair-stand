`connector_single` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:25`

```js
connector_single: Object.freeze({
  partId: 'connector_single',
  name: 'Tekli Aparat',
  type: 'connector',
  unit: 'adet',
  connectorType: 'single'
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik `partId = connector_single`'dır. Production metadata sahibi `src/productionParts.js` dosyasıdır.

Mevcut runtime kodunda bağımsız `catalogKey`, module `id`, module `type` veya project-state instance'ı yoktur.

# 2. Doğrudan runtime referansları

`src/` altında `connector_single` yalnızca `src/productionParts.js` ve `src/moduleRecipes.js` dosyalarında doğrudan geçer.

Renderer, state, persistence ve placement kodu bu `partId`yi doğrudan okumaz.

# 3. Recipe kullanımları

`connector_single`, `src/moduleRecipes.js` içindeki **27 recipe kaydının tamamında** normal `recipe.items` kalemi olarak bulunur.

| Recipe ailesi | Recipe sayısı | `connector_single` miktarı |
|---|---:|---:|
| straight wall 50/100/150/200 (`:3-16`) | 4 | 13 |
| door 100 (`:19-21`) | 1 | 5 |
| shelf 100/150/200 × 2/3 raf (`:23-40`) | 6 | 13 |
| showcase-2 (`:42-44`) | 1 | 9 |
| showcase-3 (`:45-47`) | 1 | 7 |
| separator 50 (`:49-51`) | 1 | 7 |
| separator 100 (`:52-54`) | 1 | 13 |
| L counter 100/150/200 (`:56-66`) | 3 | 16 |
| straight counter 100/150/200 (`:68-76`) | 3 | 12 |
| base-wall 100/150/200 (`:78-86`) | 3 | 17 |
| base 100/150/200 (`:88-96`) | 3 | 8 |

Toplam: **27 recipe**.

`wall_separator_*_sarmasik` katalog girdileri standart separator type/width ile aynı `separator:50/100` recipe'lerine çözüldüğü için recipe BOM policy kullanan katalog modülü sayısı 29'dur.

# 4. Resolver / lookup zinciri

`src/moduleRecipes.js:99-130`:

```text
module type + nominal width + options
→ getModuleRecipe(...)
→ recipe item { partId: 'connector_single', quantity: N }
→ expandRecipe(...)
→ getProductionPart('connector_single')
→ PRODUCTION_PARTS.connector_single
→ "Tekli Aparat"
```

`expandRecipe()` yalnız recipe miktarını koruyup production metadata'sını `part` alanına ekler.

Ownership ayrımı:

```text
quantity / recipe owner = src/moduleRecipes.js
production metadata     = src/productionParts.js
module BOM policy       = src/moduleRecipes.js (moduleContracts üzerinden)
```

# 5. Browser/UI runtime tüketimi

`src/rawBomDebug.js:35-56` expanded recipe'nin `items` listesini render eder. Dolayısıyla recipe'ye göre örneğin:

```text
5 × Tekli Aparat
7 × Tekli Aparat
8 × Tekli Aparat
9 × Tekli Aparat
12 × Tekli Aparat
13 × Tekli Aparat
16 × Tekli Aparat
17 × Tekli Aparat
```

çıktıları oluşabilir.

UI recipe seçimi `rawBomDebug.js:58-130` içinde `#selection-info` metninin regex ile parse edilmesiyle yapılır. L counter özel parser'ı yalnız `Köşe Banko 100×100` için vardır (`:91-95`); L 150/200 recipe'lerinde `connector_single` bulunmasına rağmen bu iki L recipe için mevcut Raw BOM selection parser'ında özel eşleşme yoktur.

# 6. State / persistence

`src/designState.js` module state'lerinde `connector_single`, `connectorType` veya ayrı connector instance'ı yoktur.

`src/main.js:1257-1265` yalnız module state'lerini snapshot'a koyar; `src/projectStore.js:39-56` bunları IndexedDB'ye yazar. `connector_single` ayrı olarak persist edilmez.

# 7. Renderer / placement paralel sistemi

`src/scene3d.js` içinde `connector_single` anahtarı yoktur ve ayrı connector mesh identity'si üretilmez.

`src/modulePlacement.js` komşuluk için `snapKind` üretir; bu placement sistemi `connector_single` miktarını okumaz veya değiştirmez. Mevcut kodda recipe'deki `connector_single` miktarlarını sahnedeki gerçek adjacency'ye göre birleştiren/düşüren/artıran ilişki pass'i yoktur.

Dolayısıyla bugün `connector_single` sayısı module recipe'sinin sabit BOM miktarıdır.

# 8. Test zinciri

- `test/moduleRecipes.test.js:13-18` production adını `Tekli Aparat` olarak doğrular.
- `test/moduleRecipes.test.js:41-150` wall/door/shelf miktarlarını doğrular.
- `test/showcaseRecipes.test.js:13-38` showcase miktarlarını doğrular.
- `test/separatorRecipes.test.js:12-32` separator miktarlarını doğrular.
- `test/counterRecipes.test.js:14-49` straight counter miktarlarını doğrular.
- `test/lCounter100Contract.test.js:10`, `lCounter150Contract.test.js:33-40`, `lCounter200Contract.test.js:33-40` L counter miktarlarını doğrular.
- `test/baseWallRecipes.test.js:12-28` base-wall miktarını doğrular.
- `test/baseRecipes.test.js:32-45` base miktarını doğrular.

İlgili hedefli test seti çalıştırıldı: **49 pass / 0 fail**.

# Mevcut zincirin özeti

```text
catalog module descriptor
→ module type / width / options
→ moduleRecipes.js
→ connector_single × sabit recipe miktarı
→ expandRecipe()
→ productionParts.js
→ "Tekli Aparat"
→ rawBomDebug.js
→ Raw BOM UI
```

En kritik mevcut durum: **`connector_single` aktif production/BOM `partId`idir ve 27 recipe'de kullanılır; fakat state, persistence, renderer veya placement identity'si değildir. Miktarı mevcut yerleşim ilişkilerinden dinamik olarak hesaplanmaz.**