# Fair Stand — Item Migration Rules

Bu belge, mevcut çalışan sistemden yeni Item mimarisine geçiş sırasında uygulanacak zorunlu migration kurallarını tanımlar.

## 1. Migration Item bazında yapılır

Geçiş bütün sistem için tek seferde yapılmaz.

`ITEM_LIST.md` sırasındaki Item'lar tek tek ele alınır. İlk pilot Item `wall_200`'dür.

```text
wall_200
→ wall_150
→ wall_100
→ wall_50
→ ...
```

Bir Item tamamlanmadan sıradaki Item'ın eski runtime yolu sökülmez.

---

## 2. Çalışan runtime kesintiye uğratılamaz

Bir Item yeni yapıya taşınırken mevcut çalışan Item önce sistemden çıkarılmaz.

Zorunlu sıra:

```text
mevcut çalışan Item
        ↓
yeni Item implementasyonu hazırlanır
        ↓
mevcut davranışlarla parity doğrulanır
        ↓
runtime routing yeni Item yapısına alınır
        ↓
yeni yolun çalıştığı doğrulanır
        ↓
yalnız o Item'a ait eski routing / resolution bağlantıları sökülür
```

Yeni implementasyon hazır ve doğrulanmış olmadan mevcut çalışan yol kesilemez.

---

## 3. Pilot Item `wall_200` tamamen bitirilir

`wall_200` baştan aşağı ele alınır.

Yeni yapıya geçtikten sonra `wall_200` sistemsel olarak çalışmaya devam etmek zorundadır. Mevcut runtime özelliklerinden hiçbiri migration nedeniyle kaybolamaz.

Parity kapsamı yalnız render değildir. `wall_200` için mevcut kodda çalışan bütün davranışlar dikkate alınır; örneğin:

- creation / catalog resolution,
- instance state,
- placement,
- move / rotation,
- magnetic snap,
- collision,
- continuous wall / reflow,
- free placement ve free side insertion,
- automatic wall / depot üretimi,
- renderer,
- selection,
- context menu,
- duplicate / delete,
- color / image,
- glass / Lightbox / Mesh,
- overlay ilişkileri,
- save / load / autosave,
- asset persistence,
- reset akışları,
- BOM / production-part resolution.

Bu liste yeni davranış tanımlamaz; parity kontrolünün kapsamını belirtir. Gerçek davranışın source of truth'u mevcut runtime kodudur.

---

## 4. Eski ve yeni yapı geçiş sırasında eş zamanlı bulunabilir

Migration süresince bazı Item'lar yeni Item mimarisinden, diğer Item'lar mevcut eski akıştan çalışabilir.

Örnek ara durum:

```text
wall_200 → yeni Item yapısı
wall_150 → mevcut yapı
wall_100 → mevcut yapı
wall_50  → mevcut yapı
...      → mevcut yapı
```

Bu durum migration için geçerlidir ve sistemin çalışmasını kesmeden Item-by-Item ilerlemeyi sağlar.

---

## 5. İki ayrı source of truth oluşturulamaz

Eski ve yeni yapı aynı Item state'ini bağımsız biçimde yönetemez.

Yasak:

```text
eski state sistemi ayrı yazar
+
yeni Item state sistemi ayrı yazar
```

Bu nedenle dual-write veya aynı business rule'un iki ayrı canonical kopyası oluşturulmaz.

Geçişte yeni Item katmanı gerektiğinde mevcut canonical motorları kullanır; source of truth tek kalır.

---

## 6. Ortak motorlar Item sökülürken silinmez

Bir Item'ın eski bağlantılarını kaldırmak, diğer Item'ların kullandığı ortak runtime motorlarını kaldırmak anlamına gelmez.

Örneğin aşağıdaki tür ortak altyapılar ihtiyaç devam ettiği sürece korunur:

- behavior engine,
- placement engine,
- collision engine,
- magnetic snap,
- selection,
- reflow,
- persistence,
- shared renderer helpers,
- BOM / production-part ortak resolver altyapıları.

`wall_200` migration'ında yalnız `wall_200`'ün eski identity / routing / resolution bağımlılıkları, yeni Item yolunun tam karşılığı doğrulandıktan sonra kaldırılır.

---

## 7. Cutover için parity zorunludur

Bir Item'ın runtime routing'i yeni sisteme alınmadan önce mevcut Item ile yeni implementasyon arasında davranış parity'si doğrulanmalıdır.

Bir özellik yeni yapıda eksikse Item migration tamamlanmış sayılmaz ve eski çalışan yol sökülmez.

Migration'ın başarı kriteri:

```text
aynı Item
+ aynı proje girdisi
+ aynı kullanıcı işlemi
→ mevcut sistemde çalışan davranışın yeni Item sisteminde de korunması
```

Bilinçli davranış değişiklikleri migration ile aynı işlem içinde gizlice yapılmaz; ayrı ürün/teknik karar olarak ele alınır.

---

## 8. Her Item için önce mevcut kod zinciri çıkarılır

Migration başlamadan önce ilgili Item'ın mevcut runtime zinciri koddan doğrulanır:

```text
dosya
→ fonksiyon
→ çağırdığı fonksiyon
→ okuduğu veri
→ yazdığı veri
→ sonraki dependency
```

Item MD dosyası tahmin, audit yorumu veya roadmap kararıyla değil mevcut runtime koduyla doldurulur.

---

## 9. Tamamlanma sırası

Her Item için zorunlu süreç:

```text
1. Current runtime code map
2. ITEM_CONTRACT ile mapping
3. Yeni Item implementasyonu
4. Parity doğrulaması
5. Runtime cutover
6. Eski Item-specific yolun sökülmesi
7. Regression doğrulaması
8. Sıradaki Item
```

Bu sıra atlanamaz.

---

## 10. Ana migration ilkesi

```text
Yeni Item tam çalışmadan eski Item yolu sökülmez.
```

Amaç refactor sırasında sistemi durdurmak değil, çalışan Item'ları tek tek yeni canonical Item mimarisine taşımaktır.
