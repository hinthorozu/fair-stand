# `behavior.stripOccupancyResolved`

**Özellik ID:** `behavior.stripOccupancyResolved`
**İnsan tarafından anlaşılır adı:** Çözülmüş stripOccupancy
**Kategori:** davranis
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `"{""align"":""top"",""stripCount"":2}"` · `"{""align"":""top"",""stripCount"":1}"`

## Ne işe yarar

TYPE_BEHAVIORS / getModuleBehavior alanı. Placement, ghost, collision, insert bu kayıttan okunur.

## Canonical owner

- katman: type davranış tablosu
- dosya: `src/moduleBehavior.js`
- sembol: `TYPE_BEHAVIORS / getModuleBehavior`

## Tanımlandığı yerler

- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :271 [write]

## Okuyan yerler

- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :21 [read]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :58 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :10 [test]

## Yazan / değiştiren yerler

- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :271 [write]
- `src/scene3d.js` `if` :1886 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6967 [write]

## Default değeri

Global: `DEFAULT_BEHAVIOR` = `WALL_BEHAVIOR` (`src/moduleBehavior.js`). Type: `TYPE_BEHAVIORS[type]`. Type kaydı yoksa WALL_BEHAVIOR. Ghost yoksa `DEFAULT_GHOST_BEHAVIOR` (opacity 0.38, renderer module-silhouette). collisionHeight yoksa `full`.

## Override zinciri

DEFAULT_BEHAVIOR (WALL_BEHAVIOR) → TYPE_BEHAVIORS[type] → getModuleBehavior item override (counter L defaultRotation 270; düz banko 100/150/200 rotationStep 45). Persist yok; her çağrıda hesaplanır.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **8** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `flat-panel`
- itemKey: `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **8**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

## BOM / composition etkisi

yok.

## Validation

Yanlış type → DEFAULT_BEHAVIOR. Enum runtime'da sıkı doğrulanmaz.

## Bağımlılıklar

- kök katman: `behavior`
- `type` (+ counter `shape`/`widthCm`).

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/moduleBehavior.js`, `src/scene3d.js`, `src/stripOccupancy.js`

- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :271 [write]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/scene3d.js` `if` :1886 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6967 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :21 [read]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :58 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :10 [test]

- indeks: 107 / 188
