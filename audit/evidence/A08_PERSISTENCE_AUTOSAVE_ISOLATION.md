# A08 — Kalıcılık / otomatik kayıt / proje yalıtımı denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Kalıcılık yolu

- Proje anlık görüntüsü: `main.js:buildProjectSnapshot()`
- Proje depolama: `src/projectStore.js`
- Varlık depolama: `src/assetStore.js`
- Otomatik kayıt yaşam döngüsü: `src/autosaveController.js`
- Geri yükleme/değiştirme: `main.js:restoreProject()` / `openStoredProject()`

## Bulgular

### F-020 — P1 — bekleyen otomatik kayıt proje değiştirme/açma sırasında atılabilir

Otomatik kayıt değişiklikleri gözler, 5 saniye bekler, sonra kalıcılaştırır. `restoreProject()` `autosaveController.disable()` çağırarak başlar ve `disable()` bekleyen zaman aşımını temizler.

Proje açılır menü/açma akışı, hedef projeyi açmadan önce o anda aktif projeyi **flush/persist etmez**. Bu nedenle bir kullanıcı:

1. kaydedilmiş bir projeyi düzenleyebilir,
2. otomatik-kayıt-bekleyen bir durum tetikleyebilir,
3. 5-saniye zamanlayıcı ateşlenmeden başka bir projeyi değiştirip/açabilir,
4. bekleyen kaydın `restoreProject()` tarafından iptal edilmesini görebilir.

Değiştirme onayı şu anda yalnızca gezinmeyi onaylar; bekleyen düzenlemelerin kaydedileceğini garanti etmez. Mevcut açılır menü entegrasyon testleri onay/açma kablolamasını kontrol eder, bu dayanıklılık durumunu değil.

Etki: bırakılan projedeki son düzenlemeler kalıcı depolamadan kaybolabilir.

### F-021 — P2 — proje `version` vardır ancak hiçbir şema doğrulama/migrasyon yolu onu tüketmez

Anlık görüntüler `version:1` yazar; `saveProject()` herhangi bir sayısal sürümü korur (veya 1'e varsayar). `restoreProject()` proje sürümünü incelemez ve `stand`/`modules` çalışma zamanı durumuna kopyalanmadan önce migrasyon/normalizasyon hattı yoktur.

Böylece sürüm alanı şu anda zorlanmış bir uyumluluk sözleşmesi değil, meta veri gibi davranır. Eksik/eski alanlar renderer varsayılanları ve `catalogKey` onarımıyla ad hoc ele alınır.

Bu kök bulgu A14'teki proje-şema uyumluluk sorununu da sahiplenir; arşive özel davranış bağımsız olmadıkça orada çoğaltma.

### F-022 — P2 — kalıcılık gidiş-dönüşü tüm özel modül ailelerinde sözleşme-testli değildir

Güncel birim/entegrasyon testleri durum fabrikalarını, proje UI/değiştirmeyi, seçili kalıcılık davranışlarını ve varlık akışlarını kapsar, ancak her 45+1 modül ailesinin şunu yaşadığını kanıtlayan tablo-güdümlü bir sözleşme yoktur:

`fabrika/güncel durum -> kaydet anlık görüntü -> yükle -> geri yükle -> eşdeğer davranış/kimlik`

Risk altındaki özel alanlar arasında model meta verisi, katalog kimliği, raf aydınlatması, video-duvar geometrisi, illuminated-foam varlık/hale durumu, kumaş/cam/görüntü dönüşümleri ve özel yerleştirme meta verisi vardır.

Bu bir test-kapsamı bulgusudur; tüm güncel gidiş-dönüşlerin bozuk olduğunu ileri sürmez.

### F-023 — P2 — proje silme proje ve varlık depoları arasında atomik değildir

Main'deki silme sırası:

1. `deleteProjectImageAssets(projectId)`
2. `deleteProject(projectId)`

Bunlar ayrı IndexedDB işlemleri/açma çağrılarıdır. Varlık silme başarılı olup proje silme başarısız olursa, proje kaydı kalır ancak referans verdiği varlıklar gitmiştir. UI hatayı yakalar ve silme başarısızlığını bildirir, ancak hayatta kalan proje zaten kısmen yok edilmiş olabilir.

Bu bir atomiklik/yalıtım boşluğudur. Tek bir varlık için görüntü silme daha güvenli ters sırayı kullanır (önce referansları kalıcılaştır, sonra blob'u sil), ancak tüm-proje silme her iki depo arasında işlemsel değildir.

## Kontrol listesi sonuçları

- **A08.01 tam hedeflenen durum:** güncel anlık görüntü şekli için `AUDITED_OK`; görüntü blob'ları kasıtlı olarak ayrı varlık deposunda yaşar.
- **A08.02 eşdeğer çalışma zamanı davranışı:** `GAP` — F-021/F-022 ve belirsiz katalog kimliği için F-013.
- **A08.03 otomatik kayıt belirleyici debounce:** denetleyici içinde `AUDITED_OK`: bir izleme aralığı, bir bekleyen zamanlayıcı, açık clear/disable/markSaved yaşam döngüsü.
- **A08.04 yanlış proje üzerine yazma:** `GAP` — F-020 öncelikle kayıp-güncellemedir, eski durumun yeni projeye yazıldığının kanıtı değildir. Denetleyici eski zamanlayıcıyı iptal eder; bu çapraz-proje üzerine yazmayı korur ancak şu anda bekleyen düzenlemeleri feda eder.
- **A08.05 temiz yeni proje:** `AUDITED_OK` — otomatik kayıt kapalı, yeni proje id/zamanı oluşturulur, varlıklar temizlenir, yeni sahne bileşiminden önce modüller sıfırlanır.
- **A08.06 değiştirme geçici temizleme:** incelenen yollar için `AUDITED_OK` — menüler kapanır, varlıklar/object URL'ler sıfırlanır, sahne/sahne yeniden kurulur, otomatik kayıt tabanı sıfırlanır. A09/A10 renderer seçim/odak ayrıntılarını inceler.
- **A08.07 silme davranışı:** `GAP` — F-023.
- **A08.08 her özel modül gidiş-dönüşü:** `GAP` — F-022.
- **A08.09 başarısızlık yolları:** `GAP` — proje silme atomikliği F-023; içe aktarma başarısızlık işleme A14.
- **A08.10 şema/sürüm yükseltme:** `GAP` — F-021.

## Depolama şema notu

Proje ve varlık modülleri IndexedDB veritabanı/sürüm/depo sabitlerini çoğaltır ve her biri kendi `openDb()` uygulamasını yapar. Şu anda uyuşurlar (`fair-stand-configurator`, DB v2), ancak bu bir sapma riskidir. A13, depolama-katmanı çapraz kontrolünden sonra ayrı kaydedilip edilmeyeceğini sahiplenir.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A09 — Renderer / sahne / çalışma-zamanı-türetilmiş davranış**.
