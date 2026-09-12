# A23 — Çapraz-alan çatışma matrisi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Amaç

A23, görünürde ayrı A00-A22 bulgularının aslında aynı kök neden olup olmadığını ve bir düzeltmenin ikinci-alan regresyonu yaratıp yaratamayacağını kontrol eder. Daha önceki bir kök çatışmayı zaten sahiplendiğinde yinelenen bulgu açılmaz.

## Çapraz-alan matrisi

| Kök | Kesişen alanlar | Çatışma |
|---|---|---|
| F-005/F-006/F-007 | yönetişim → architecture/docs/tests | change gate her kanonik yönetişim/test değişikliği için bildirim zorlayamaz |
| F-010 | catalog → state → UI/composition | katalog/sözleşme tam olabilirken çalışma zamanı fabrika dağıtıcısı atlanabilir |
| F-011/F-015/F-016 | behavior → placement → UI/renderer | bildirilmiş davranış ile gerçek ekleme/yönelim/özel geometri politikası tek zorlanmış model değildir |
| F-013 | katalog kimliği → persistence → sözleşme/BOM | belirsiz eski tanımlayıcı tam sarmasık-ayırıcı kimliğini kaybedebilir |
| F-017/F-019 | catalog/state → renderer → persistence | çoğaltılmış ölçüler/doğrudan sahne mutasyonu, yeniden düzenleme/katalog değişikliğinden sonra renderer/durum sapmasına izin verir |
| F-020/F-022/F-023/F-032 | UI yaşam döngüsü → otomatik kayıt → IndexedDB | proje değiştirme/silme/şema sahipliği tek işlemsel kalıcılık sınırı değildir |
| F-025/F-030/F-031 | UI → BOM → üretim | hata ayıklama seçili-modül reçete gösterimi, proje/ilişki BOM yokken Final BOM gibi görünebilir |
| F-029 | özellik sözleşmesi → composition → persistence/BOM | otomatik duvar açık özellik sözleşmesi/etki yüzeyi olmadan eşgüdümlü modüller oluşturur |
| F-033/F-034 | assets → dağıtım → performans/hukuk | public-dosya yerleşimi gönderilen yükü kontrol eder; köken envanteri eksiktir |
| F-035/F-036/F-037 | içe aktarma şeması → durum/depolama → güvenlik/kullanılabilirlik | arşiv sürümü/temel manifest kontrolleri alan durumunu doğrulamaz veya kaynak kullanımını sınırlamaz |
| F-039/F-040 | UI/erişilebilirlik → tarayıcı test | odak/klavye sorunları tarayıcı etkileşim testleri olmadan güvenilir korunamaz |
| F-041/F-042 | CI/change gate → depo/dağıtım yönetişimi | CI yeşil olabilirken birleştirme/doğrudan-push/dağıtım yolları aynı kontrolleri gerektirmez |

## Yüksek-risk düzeltme bağımlılıkları

1. **Kalıcılık kümesi:** F-020/F-021/F-022/F-023/F-032/F-035/F-036'yı açık bir proje şema/işlem stratejisi altında birlikte düzelt; yalıtılmış yamalar uyumsuz kayıtlar yaratabilir.
2. **Modül kimliği/fabrika kümesi:** F-010/F-013/F-019 daha fazla katalog ailesi eklemeden önce çözülmelidir; aksi halde yeni modül işi paralel kayıtları artırır.
3. **Yerleştirme/davranış kümesi:** F-011/F-015/F-016 tipe özel UI yamaları yerine tek bir bildirimsel politika uzantısı paylaşmalıdır.
4. **BOM kümesi:** F-014/F-030/F-031 ürün politikası kararlarını algoritma uygulamasından ayırmalıdır; ticari/dışlanmış sınıflandırma uydurulmaz.
5. **Yönetişim kümesi:** F-005/F-006/F-007/F-041/F-042 hizalanmalıdır ki kod kapısı, GitHub birleştirme duvarı ve dağıtım duvarı aynı sözleşmeyi zorlasın.
6. **Tarayıcı doğrulama kümesi:** F-040, yıkıcı eylemler, kalıcılık, içe/dışa aktarma, odak veya model başarısızlığı düzeltmelerinin tam kapandığını iddia etmeden önce inmelidir.

## P0 kontrolü

Acil geri alma gerektiren veya güncel felaket veri bozulması/güvenlik ihlali kanıtı olan P0/kök neden saptanmadı. P1 bulgular çoktur ve temiz bir düzeltme/sürüm onayı engeller.

## Kontrol listesi sonucu

Her A00-A22 bulgusu sahip olduğu alan/köke çapraz bağlandı. Yeni bağımsız A23 bulgusu gerekmedi.

Bölüm denetim durumu: **GAP — çapraz-alan analizi tamam; düzeltme yapılmadı.**
