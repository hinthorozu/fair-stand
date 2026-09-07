`connector_start` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:24`

```js
connector_start: Object.freeze({
  partId: 'connector_start',
  name: 'Başlangıç Aparatı',
  type: 'connector',
  unit: 'adet',
  connectorType: 'start'
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik `partId = connector_start`'tır. Production metadata sahibi `src/productionParts.js` dosyasıdır.

Mevcut runtime kodunda bağımsız `catalogKey`, module `id`, module `type` veya project-state instance'ı yoktur.

# 2. Doğrudan runtime referansları

`src/` altında `connector_start` yalnızca:

```text
src/productionParts.js
src/moduleRecipes.js
```

dosyalarında doğrudan geçer. Renderer, state, persistence ve placement kodu bu `partId`yi doğrudan okumaz.

# 3. Recipe kullanımları

`connector_start`, `src/moduleRecipes.js` içindeki **27 recipe kaydının tamamında** normal `recipe.items` kalemi olarak bulunur.

| Recipe ailesi | Recipe sayısı | `connector_start` miktarı |
|---|---:|---:|
| straight wall 50/100/150/200 (`:3-16`) | 4 | 2 |
| door 100 (`:19-21`) | 1 | 2 |
| shelf 100/150/200 × 2/3 raf (`:23-40`) | 6 | 2 |
| showcase 2/3 göz (`:42-47`) | 2 | 4 |
| separator 50/100 (`:49-54`) | 2 | 2 |
| L counter 100/150/200 (`:56-66`) | 3 | 8 |
| straight counter 100/150/200 (`:68-76`) | 3 | 6 |
| base-wall 100/150/200 (`:78-86`) | 3 | 6 |
| base 100/150/200 (`:88-96`) | 3 | 8 |

Toplam: **27 recipe**.

Katalog tarafında recipe BOM policy kullanan 29 katalog anahtarı vardır; `wall_separator_*_sarmasik` iki ek katalog girdisi olarak aynı `separator:50/100` recipe'lerine çözülür. Bu nedenle recipe sayısı 27, recipe kullanan katalog modülü sayısı 29'dur.

# 4. Resolver / lookup zinciri

`src/moduleRecipes.js:99-130`:

```text
module type + nominal width + options
→ getModuleRecipe(...)
→ recipe item { partId: 'connector_start', quantity: N }
→ expandRecipe(...)
→ getProductionPart('connector_start')
→ PRODUCTION_PARTS.connector_start
→ "Başlangıç Aparatı"
```

`expandRecipe()` `src/moduleRecipes.js:119-122` içinde her recipe item'ını production metadata ile genişletir.

Miktarın source-of-truth'u `src/moduleRecipes.js`; isim/type/unit/connectorType metadata'sının source-of-truth'u `src/productionParts.js`'dir.

# 5. Module contract / BOM ownership

`src/moduleContracts.js:4-7`:

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

`src/moduleContracts.js:94-127` içindeki wall, separator, showcase, shelf, base-wall, door, counter ve base katalog aileleri bu policy'yi kullanır.

Dolayısıyla mevcut module-level BOM owner açıkça `src/moduleRecipes.js` olarak tanımlanmıştır.

# 6. Browser/UI runtime tüketimi

`src/rawBomDebug.js:1,35-56` `getExpandedModuleRecipe()` çağırır ve `recipe.items` listesini ekrana basar.

Örnek çıktı recipe'ye göre:

```text
2 × Başlangıç Aparatı
4 × Başlangıç Aparatı
6 × Başlangıç Aparatı
8 × Başlangıç Aparatı
```

`rawBomDebug.js:58-130` seçili yüzeyin `#selection-info` metnini regex ile parse ederek door, shelf, showcase, separator, straight counter, base-wall, base ve straight-wall recipe'lerine ulaşır.

L counter için mevcut parser yalnız `Köşe Banko 100×100` eşleşmesini özel olarak tanır (`rawBomDebug.js:91-95`). Dolayısıyla L 150/200 recipe'lerinde `connector_start` bulunmasına rağmen bu iki L recipe'ye mevcut Raw BOM selection parser'ından özel erişim yolu yoktur.

# 7. State ve persistence

`src/designState.js` module state'lerinde `connector_start`, `partId`, `connectorType` veya ayrı connector instance'ı bulunmaz. State module düzeyinde `id`, `type`, `widthCm`, `shape`, `strips`, `faces`, `catalogKey`, `placement` vb. alanları taşır.

`src/main.js:1257-1265` proje snapshot'ına `currentModules` state'lerini yazar; `src/projectStore.js:39-56` bunları IndexedDB'ye kaydeder.

Sonuç: `connector_start` ayrı entity/instance olarak persist edilmez; BOM gerektiğinde recipe üzerinden yeniden çözülür.

# 8. Renderer ve placement ile ilişki

`src/scene3d.js` içinde `connector_start` metni yoktur. Renderer bu production parçasına göre ayrı bir mesh üretmez.

`src/modulePlacement.js` modüller arası geometrik bağlantı/snap ilişkileri için `end-to-end`, `corner`, `tee`, `fixture-side`, `corner-face` gibi `snapKind` değerleri üretir. Ancak `connector_start` ile bu placement ilişkileri arasında mevcut kodda hiçbir mapping yoktur.

Bunun sonucu olarak `connector_start` miktarları **yerleşimdeki gerçek komşuluk/corner ilişkisine göre hesaplanmıyor**; recipe içinde sabit miktar olarak bulunuyor.

# 9. Test zinciri

- `test/moduleRecipes.test.js:13-18` production adını `Başlangıç Aparatı` olarak doğrular.
- `test/moduleRecipes.test.js:41-150` wall/door/shelf recipe miktarlarını doğrular.
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
→ connector_start × sabit recipe miktarı
→ expandRecipe()
→ productionParts.js
→ "Başlangıç Aparatı"
→ rawBomDebug.js
→ Raw BOM UI
```

En kritik mevcut durum: **`connector_start` bugün aktif bir production/BOM `partId`dir ve 27 recipe'de sabit miktarla kullanılır; fakat renderer/state/persistence/placement identity'si değildir ve miktarı gerçek module adjacency ilişkilerinden türetilmez.**