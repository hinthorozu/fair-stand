> Migration öncesi envanterdir; aktif kanonik tanım `../definitions/hali.md` içindedir.

# hali — Tarihî envanter profili

Bu belge ITEM_LIST'teki **Hali** girdisinin `Version2` runtime kodundaki gerçek karşılığını toplar.

## Item/module kimliği

Bu floor girdisinin `MODULE_CATALOG` içinde `catalogKey` kaydı ve `module type` state'i yoktur. Floor, module listesine eklenen bir Item state'i değil; `currentStand.floorType` / `floorColor` ve `scene3d` floor renderer üzerinden yönetilir.

```text
catalogKey = yok
module type = yok
runtime floorType = hali
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

Halı renderer üretilmiş halı rengi + bump dokusu kullanır; doku repeat X/Y değerleri stand genişlik/derinliğinin `0.7` metreye bölünmesiyle belirlenir. Material roughness `1`dir. `setFloorColor()` halı için renk değişikliğine izin verir; varsayılan zemin rengi `#8b8f94`dür.

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
