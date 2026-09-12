# A03 — Depo mimarisi / sahiplik denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde ürün/çalışma zamanı düzeltmesi yok.

## Birincil sahiplik haritası (`src/`)

| Dosya | Birincil sorumluluk | İkincil / bağlanma notları |
|---|---|---|
| `assetStore.js` | kalıcılık / IndexedDB varlıkları | DB şema sabitlerini projectStore ile paylaşır |
| `autoDepot.js` | özellik bileşimi | depo planı/spesifikasyonları üretir |
| `automaticWall.js` | bileşim / duvar planlama | stand geometrisine bağımlı |
| `autosaveController.js` | kalıcılık yaşam döngüsü | yalnızca UI durum geri çağrısı |
| `catalog.js` | katalog kimliği / nominal meta veri | tanımlayıcı çözümleme |
| `colorEditor.css` | UI stil | — |
| `colorEditorController.js` | UI/renk düzenleyici denetleyici | renk dönüşümü/uygula geri çağrısı |
| `colorEditorInputs.js` | UI girdi normalizasyonu | sayısal renk girdileri |
| `colorUtils.js` | renk dönüşüm yardımcısı | düzenleyici desteği |
| `cornerPlacement.js` | yerleştirme geometrisi | köşe mantığı |
| `designState.js` | modül/proje düzenlenebilir durum fabrikaları | şu anda birkaç modül-tip özet yardımcısı da var |
| `featureContracts.js` | özellik sözleşme kaydı | mimari/bileşim meta verisi |
| `groundLayout.js` | sahne/zemin yerleşim yardımcısı | renderer'a dönük |
| `helpGuide.css` | UI stil | — |
| `helpGuide.js` | yardım UI | dinamik katman/kılavuz |
| `horizontalImageLayout.js` | görüntü yerleşim politikası | durum/renderer köprüsü |
| `imageActions.css` | UI stil | görüntü kontrolleri |
| `imageAssetReferences.js` | varlık-referans dolaşımı | kalıcılık temizleme desteği |
| `imageFit.js` | görüntü sığdırma geometrisi | renderer/görüntü desteği |
| `main.js` | uygulama orkestrasyonu | ayrıca modül fabrika yönlendirmesini, proje/arşiv akışlarını, varlık UI, özellik kablolamasını sahiplenir |
| `moduleBehavior.js` | modül davranış kaydı | kanonik davranış kaynağı |
| `moduleContextMenu.js` | modül bağlam UI | katalog/davranış yetenek sunumu |
| `moduleContracts.js` | modül sözleşme kaydı | katalog + davranış + BOM politikasını birleştirir |
| `moduleDragSidebar.js` | katalog sürükleme UI | sunum önizlemeleri gömer |
| `moduleMove.js` | yerleştirme/taşıma planlama | sürekli duvar hareketi |
| `modulePlacement.js` | yerleştirme/snap/çarpışma çekirdeği | tipe özel geometrik/politika dalları içerir |
| `moduleRecipes.js` | BOM reçeteleri | üretim türetimi |
| `placementFeedback.js` | yerleştirme UI geri bildirimi | işaretçi/durum sunumu |
| `productionParts.js` | kanonik üretim parçaları | BOM kaynağı |
| `projectNaming.js` | proje adlandırma UI/politikası | DOM modal/denetleyici |
| `projectStore.js` | kalıcılık / proje IndexedDB | DB sabitlerini/açma mantığını assetStore ile çoğaltır |
| `projectSwitch.js` | proje-değiştirme UI politikası | onay metni + koşul |
| `projectUi.js` | proje UI durumu/yükleme | düğme/katman yardımcısı |
| `rawBomDebug.js` | BOM hata ayıklama yüzeyi | geliştirme/hata ayıklama sahipliği |
| `rectImageLayout.js` | görüntü dikdörtgen yerleşimi | renderer/durum köprüsü |
| `rectSelection.js` | seçim geometrisi | etkileşim yardımcısı |
| `scene3d.js` | renderer + sahne etkileşimi | ayrıca düzenlenebilir durumu değiştirir ve yerleştirme işaretçi/yönlendirme politikası içerir |
| `selectionFeedback.js` | seçim geri bildirimi biçimlendirme | modül yetenek sunumu |
| `sidebarController.js` | kenar çubuğu UI | — |
| `stageFeedback.js` | sahne/duvar UI geri bildirimi | — |
| `standCapacity.js` | stand-sınır doğrulama | yerleştirme/bileşim girdi doğrulama |
| `standSetup.js` | stand kurulum doğrulama/yapılandırma | ayrıca bir sahne-çevre sabiti sahiplenir |
| `style.css` | küresel UI stil | — |
| `systemChangeContract.js` | geliştirme/değişiklik yönetişimi | change-gate şeması + yol eşlemesi |
| `theme.js` | görsel tema sabitleri | renderer/UI paylaşımı |
| `tvConfig.js` | TV kanonik ölçüleri/yapılandırma | katalog/durum paylaşımı |
| `uiFeedback.js` | genel UI durum gözlemcileri | DOM mutasyon gözlemcisi |
| `viewCube.js` | kamera/görünüm-küpü renderer UI | sahne etkileşimi |
| `viewKeyboardShortcuts.js` | klavye komut çözümleme | görünüm/döndürme etkileşimi |
| `wall.js` | düz-duvar bileşim yardımcısı | daha eski/basit bileşim yolu |
| `wallReflow.js` | sürekli duvar yerleştirme/reflow | yerleştirme çekirdeği |

Sayı: 51 `src/` dosyası eşlendi.

## Bulgular

### F-010 — P1 — `main.js` içinde gizli çalışma zamanı modül-kurulum kaydı

**Alanlar:** architecture, catalog, state, tests, change-gate

`main.js:createCatalogModuleState()` her katalog ailesi için durum fabrikasını seçen uzun bir `module.type` dağıtımı içerir. Bu, aşağıdakilerden bağımsız güncellenmesi gereken ikinci bir kayıttır:

- `MODULE_CATALOG`,
- `MODULE_CONTRACT_ASSIGNMENTS`,
- `moduleBehavior`,
- durum fabrikalarının kendisi.

Genel sistem-geliştirme sözleşme testleri katalog/sözleşme/davranış/BOM sözleşme kapsamını kanıtlar, ancak her katalog girdisinin bu çalışma zamanı kurulum dağıtıcısından geçebildiğini kanıtlamaz. Yeni bir tip bu nedenle sözleşme-tam olabilir yine de bu dağıtıcı atlanırsa örneklendirilemeyebilir.

Otomatik-depo ve otomatik-duvar üretimi de tek bir kanonik modül-durum kurulum kaydı yerine ayrı yollardan doğrudan fabrika çağırır.

**Çapraz-alan kuralı:** Bu aynı paralel kurulum yönlendirmesinden türeyen sonraki A04/A07/A11 oluşumları yinelenen bulgu oluşturmak yerine F-010'a referans vermelidir.

### F-011 — P1 — modüle özel yerleştirme politikası davranış sözleşmesinin ötesinde parçalanmıştır

**Alanlar:** architecture, behavior, placement, renderer, tests

`moduleBehavior.js` yerleştirme kipi, taşıma snap, döndürme adımı/varsayılan, yan ekleme, çarpışma ve ghost stratejisi için bildirilmiş kaynaktır. Ancak ek modüle özel yerleştirme politikası yerleştirme/sahne etkileşim kodunda vardır; örnekler:

- mini-fridge/kettle/coat-rack manyetik-snap istisnaları,
- counter/base mantıksal fikstür uç noktaları,
- base-wall çarpışma-derinliği/bağlanma davranışı,
- indoor-plant uç nokta işleme,
- mini-fridge/kettle yığma istisnası,
- LED floodlight üst-fikstür işleme,
- `scene3d.js` içinde wall-overlay/free-support yönlendirme ve destek-tip listesi.

Bunların bazıları meşru geometrik algoritmalardır, ancak sözleşme şu anda onları seçen politikayı ifade/bildiremez. Bu nedenle bir modül görünürde tam bir davranış sözleşmesine sahipken yine de başka yerdeki gizli tip kontrollerine bağımlı olabilir.

**Çapraz-alan kuralı:** A05/A06/A09 belirli dalları sınıflandırmalı, ancak bağımsız bir çalışma zamanı hatası keşfedilmedikçe kök bulgu olarak F-011 kullanmalıdır.

### F-012 — P2 — stand sahne-çevre kuralı çoğaltılmıştır

**Alanlar:** architecture, state/setup, renderer

`standSetup.js` `STAND_SURROUND_M = 1` sahiplenir ve `sceneWidthM/sceneDepthM` türetir. `scene3d.js` ayrı olarak `STAGE_SURROUND_M = 1` sahiplenir ve bunu sahne çerçeveleme/ızgara/görünüm uzanımları için kullanır. Sayısal olarak şu anda uyuşurlar ancak aynı fiziksel çevre kavramını temsil eden bağımsız sabitlerdir. Tek taraflı bir değişiklik, kurulum/çıktı mesajlaşması ile render edilen sahne çerçevelemesini uyumsuz hale getirebilir.

## Kontrol listesi maddelerine göre mimari sonuçlar

- A03.01: tamamlandı — 51 src dosyasının tümü eşlendi.
- A03.02: GAP — `main.js` ve özellikle `scene3d.js` birden fazla ana sorumluluk taşır; F-010/F-011 tehlikeli kural sahipliğini yakalar, yalnız dosya boyutunu değil.
- A03.03: GAP — main yalnızca orkestrasyon değildir çünkü çalışma zamanı modül fabrika yönlendirmesini sahiplenir; F-010.
- A03.04: GAP — scene3d meşru olarak renderer yönlendirmesini sahiplenir, ancak ayrıca modüle özel yerleştirme/etkileşim politikasını ve doğrudan durum mutasyonunu da sahiplenir; F-011.
- A03.05: GAP — ortak yerleştirme altyapısı vardır, ancak özel geometri/politikaların ürüne özel seçimi parçalanmıştır; F-011.
- A03.06: GAP/yapısal — düzenlenebilir yüzey/modül durumu kasıtlı olarak sahne mesh'lerine geçirilir, ancak renderer metodları düzenlenebilir yüzey/yerleştirme durumunu doğrudan değiştirir. Bu ayrı bir bulgu olarak kaydedilmez çünkü renderer/etkileşim sahiplik yoğunlaşmasının parçasıdır; A09 bağımsız bir doğruluk sorunu yaratıp yaratmadığını belirleyecektir.
- A03.07: mimari düzeyde AUDITED_OK — UI/renderer'dan üretim miktarları türeten bir BOM kaynağı gözlenmedi; BOM-özel kanıt A12'ye bırakıldı.
- A03.08: GAP — tipe özel dallar sınıflandırıldı; renderer dalları render için meşrudur, durum-kurulum ve yerleştirme-politikası dalları F-010/F-011 üretir.
- A03.09: GAP — yinelenen sahne çevre sabiti; F-012. Diğer sayısal çoğaltma, ek kök bulgu oluşturmadan önce A04/A05/A12/A23'te kontrol edilir.
- A03.10: incelenen bağımlılık yönü için AUDITED_OK — kanonik kaynak sahiplik zincirinde import döngüsü saptanmadı; scene3d sürükleme-önizleme yardımcılarını içe aktarır, o yardımcılar scene3d'yi geri içe aktarmaz.
- A03.11: mimari düzeyde AUDITED_OK — proje anlık görüntüleri düz stand/modül durumunu serileştirir; seçimler, sahne nesneleri, object URL'ler ve Three.js çalışma zamanı referansları dahil edilmez. Kalıcılık ayrıntıları A07/A08'de yeniden denetlenir.
- A03.12: GAP — yerleştirme istisnaları vardır ve birkaç yerde tek tek test edilir, ancak her istisnayı bir modül sözleşmesine bağlayan tam bildirimsel bir mimari envanter yoktur; F-011.

Bölüm denetim durumu: **GAP — A03 için inceleme tamam; düzeltme yapılmadı.**
Sonraki katı denetim bölümü: **A04 — Katalog + modül sözleşmeleri**.
