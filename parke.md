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

`currentStand` proje state'inde `floorType` ve varsa `floorColor` saklanır. Proje restore sırasında `scene3d.setFloorType()` ve uygun color state tekrar uygulanır.

## Renderer

Parke tek runtime value değildir; floor type seçenekleri `parke-acik`, `parke-sari`, `parke-beton`dur. Renk sabitleri sırasıyla `#e8dfd1`, `#ddb24f`, `#625f58`dir. Ahşap parke plank ölçüsü 1.40 m × 0.16 m; beton parke 1.12 m × 0.28 m olarak pattern'e girer. Satırlar `row % 3 * length / 3` offset ile stagger edilir. Beton roughness `0.98`, diğer parke `0.78`; beton material'da düşük emissive (`0.06`) vardır. `setFloorColor()` yalnız `karolaj` ve `hali` için renk kabul ettiği için parke type'ları custom color almaz.

## Selection / color

Floor scene içinde ayrı floor selection yoluna sahiptir; module context menu kullanmaz. `describeFloorSelection()` / `setFloorColor()` üzerinden floor type'a göre paintability belirlenir.

`main.applyActiveColorToSelection()` içinde `floorType === 'parke'` kontrolü vardır; gerçek parke değerleri `parke-acik/parke-sari/parke-beton` olduğu için bu exact equality branch bu üç değeri eşlemez. Sonraki `setFloorColor()` çağrısı parke type'ları için zaten color değişimini reddeder.

## Persistence

Floor module listesinde değil `stand` state'inde saklanır; normal project save/load/autosave ve ZIP project.json içinde stand ile taşınır.

## BOM

Bu floor girdileri için `moduleRecipes.js` içinde recipe, `moduleContracts.js` içinde module contract veya `productionParts.js` içinde bu floor'u terminal BOM'a dönüştüren kayıt yoktur. `rawBomDebug.js` floor selection için recipe render etmez.

## Kod kaynakları

- `index.html`
- `src/main.js`
- `src/scene3d.js`
- `src/projectStore.js`
