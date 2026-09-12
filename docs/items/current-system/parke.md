> Migration öncesi envanterdir; aktif kanonik tanımlar `../definitions/parke-acik.md`, `../definitions/parke-sari.md`, `../definitions/parke-beton.md` içindedir. ITEM_LIST’teki tek “Parke” satırı üç runtime `floorType` idi.

# parke — Mevcut Sistem Profili

Bu belge ITEM_LIST'teki **Parke** girdisinin `Version2` runtime kodundaki gerçek karşılığını toplar.

## Item/module kimliği

Bu floor girdisinin `MODULE_CATALOG` içinde `catalogKey` kaydı ve `module type` state'i yoktur. Floor, module listesine eklenen bir Item state'i değil; `currentStand.floorType` / `floorColor` ve `scene3d` floor renderer üzerinden yönetilir.

```text
catalogKey = yok
module type = yok
runtime floorType = parke-acik | parke-sari | parke-beton
```

## UI / state

`index.html` floor select seçenekleri:

```text
karolaj    → Karolaj · 100 × 100 cm
hali        → Halı
parke-acik  → Beyaz Meşe
parke-sari  → Sarı Meşe
parke-beton → Beton Parke
```

`currentStand` proje state'inde `floorType` ve varsa `floorColor` saklanır. Proje geri yüklemede `scene3d.setFloorType()` ve uygun renk state'i yeniden uygulanır.

## Renderer

Parke tek runtime value değildir; floor type seçenekleri `parke-acik`, `parke-sari`, `parke-beton`dur. Renk sabitleri sırasıyla `#e8dfd1`, `#ddb24f`, `#625f58`dir. Ahşap parke plank ölçüsü 1.40 m × 0.16 m; beton parke 1.12 m × 0.28 m olarak pattern'e girer. Satırlar `row % 3 * length / 3` offset ile stagger edilir. Beton roughness `0.98`, diğer parke `0.78`; beton material'da düşük emissive (`0.06`) vardır. `setFloorColor()` yalnız `karolaj` ve `hali` için renk kabul ettiği için parke type'ları custom color almaz.

## Selection / color

Zemin sahnede ayrı zemin seçim yoluna sahiptir; modül bağlam menüsü kullanmaz. `describeFloorSelection()` / `setFloorColor()` ile zemin type'ına göre boyanabilirlik belirlenir.

`main.applyActiveColorToSelection()` içinde `floorType === 'parke'` kontrolü vardır; gerçek parke değerleri `parke-acik/parke-sari/parke-beton` olduğu için bu tam eşitlik dalı bu üç değeri eşlemez. Sonraki `setFloorColor()` çağrısı parke type'ları için rengi zaten reddeder.

## Kalıcılık

Zemin modül listesinde değil `stand` state'inde saklanır; normal proje kayıt/yükleme/otomatik kayıt ve ZIP `project.json` içinde stand ile taşınır.

## BOM

Bu zemin girdileri için `moduleRecipes.js` içinde recipe, `moduleContracts.js` içinde modül sözleşmesi veya `productionParts.js` içinde bu zemini uç BOM'a çeviren kayıt yoktur. `rawBomDebug.js` zemin seçimi için recipe çizmez.

## Kod kaynakları

- `index.html`
- `src/main.js`
- `src/scene3d.js`
- `src/projectStore.js`
