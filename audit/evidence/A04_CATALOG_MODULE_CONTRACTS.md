# A04 — Katalog + modül sözleşmeleri denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Küresel sözleşme sonuçları

### A04.01 — katalog anahtar/nesne kapsamı

Güncel kaynak 45 hedeflenen katalog anahtarı içerir ve listelenen her anahtar bir `MODULE_CATALOG` tanımlayıcısına çözülür. Güncel eksik tanımlayıcı bulunmadı.

**Denetim durumu:** güncel veri için `AUDITED_OK`.

Test-sertleştirme notu A18'e bırakıldı: güncel testler anahtar listesini güçlü doğrular, ancak `MODULE_CATALOG` içinde kazara ekstra bir nesne özelliğinin imkânsız/görünmez olduğunu bağımsız olarak ileri sürmez.

### A04.02 — gruplar

Beş görünür grup (`Panel & Duvar`, `Raf & Vitrin`, `Banko & Baza`, `Extra`, `Elektronik & Aydınlatma`) geçersiz anahtar olmadan güncel 45-anahtar listesini topluca kapsar.

**Denetim durumu:** `AUDITED_OK`.

### A04.03 / A04.04 / A04.05 / A04.06 — modül sözleşmeleri

`MODULE_CONTRACT_ASSIGNMENTS` her güncel katalog anahtarı için bir atamaya sahiptir ve bayat atama yoktur. `systemDevelopmentContract.test.js` makine-kontrolü:

- eksik/bayat atamalar,
- zorunlu sözleşme bölümleri,
- profil varlığı,
- durum/kalıcılık/görünüm/renderer/çalışma zamanı/bileşim/BOM/test politikası,
- davranış temelleri,
- reçete-destekli sözleşmeler için gerçek reçete çözümlemesi.

Profiller açıktır ve hiçbir katalog modülü bilinmeyen davranış yedeğine dayanmaz.

**Denetim durumu:** sözleşme varlığı/çözümlemesi için `AUDITED_OK`. Çalışma zamanı-kurulum zorlaması ayrı olarak F-010 ile yakalanır.

### A04.07 — katalog-dışı çalışma zamanı kaydı

`NON_CATALOG_MODULE_CONTRACTS` şu anda `illuminated-foam` içerir ve sistem sözleşme testi bunu wall-overlay davranış ve zorunlu görüntü görünümü ile çözer.

Güncel kaynak/katalog denetiminde ikinci aktif katalog-dışı çalışma zamanı modülü saptanmadı.

**Denetim durumu:** `AUDITED_OK`.

### A04.08 — kalıcılıktan sonra katalog kimliği / belirsiz tanımlayıcılar

**Bulgu F-013 — P2 — eski tanımlayıcı kimliği sarmasık ayırıcılar için belirsizdir.**

Güncel katalog-güdümlü oluşturma `catalogKey` ekler, böylece normal güncel kaydet/yükle tam katalog kimliğini korur. Ancak yükleme, `catalogKey` olmayan daha eski durumları `resolveModuleCatalogKey()` ile onarmayı da dener.

Normal ve sarmasık ayırıcılar aynı `type: separator` + genişliği paylaşır ve `modelFile` ile ayrılır. Çözümleyici, normalize edilmiş/eşleşen tanımlayıcısına `modelFile` dahil etmez. Bu nedenle `catalogKey` olmayan eski bir durum benzersiz çözülemez:

- `wall_separator_100` vs `wall_separator_100_sarmasik`,
- `wall_separator_50` vs `wall_separator_50_sarmasik`.

Mevcut katalog tek-kaynak testi açık `catalogKey` çözümlemesini doğrular, ancak bu belirsiz eski tanımlayıcı durumunu kapsamaz.

**Denetim durumu:** `GAP` — F-013.

## BOM karar kök bulgusu

### F-014 — P1 / DECISION_REQUIRED — 17 aktif modül sözleşmesinin nihai BOM sınıflandırması yoktur

Bu **bir çalışma zamanı-render hatası değildir**. Ürün/BOM tamamlama kararıdır.

Güncel `UNRESOLVED_EXISTING_BOM_POLICY` aşağıdaki aktif çalışma zamanı modüllerini, her biri kanonik reçete, ticari kalem veya açık dışlama olarak sınıflandırılana kadar kasıtlı olarak `decision-required` işaretler:

- M030–M045 (16 katalog girdisi),
- M046 `illuminated-foam` (katalog-dışı çalışma zamanı modülü).

Bu kararlar var olana kadar, bu modül satırları tam kimlik→BOM zinciri boyunca `AUDITED_OK` işaretlenemez ve tam bir nihai BOM onlar için açık politika iddia edemez.

Bu tek kök bulgu 17 satırın tümünü temsil eder; modül başına yinelenen bulgu oluşturulmaz.

## Modül başına defter için paylaşılan kanıt

- Kimlik/gruplar: `src/catalog.js`
- Durum fabrikaları/varsayılanlar: `src/designState.js`
- Davranış: `src/moduleBehavior.js` + `test/moduleBehaviorContract.test.js`
- Sözleşme/profil/BOM politikası: `src/moduleContracts.js` + `test/systemDevelopmentContract.test.js`
- Reçeteler: `src/moduleRecipes.js` + reçete aile testleri
- Renderer aileleri: `src/scene3d.js`
- Harici model varlıkları: `public/models/`
- Güncel çalışma zamanı kurulum yolu: `main.js:createCatalogModuleState()` (mimari boşluk F-010)
- Kalıcılık kimlik onarımı: `main.js:restoreProject()` + `resolveModuleCatalogKey()`

## Modül başına defter

Açıklama:

- `AUDITED_OK`: incelenen tüm A04 boyutlarının güncel açık politikası vardır ve satırı etkileyen modüle özel A04 engeli yoktur.
- `GAP`: satırı etkileyen gerçek bir katalog/kimlik sözleşme boşluğu vardır.
- `DECISION_REQUIRED`: çalışma zamanı sözleşmesi vardır, ancak nihai BOM sınıflandırması F-014 altında kasıtlı olarak çözülmemiştir.

| ID | Katalog anahtarı | Durum | A04 sonucu |
|---|---|---|---|
| M001 | `wall_200` | `AUDITED_OK` | açık katalog/sözleşme/davranış/durum/renderer/reçete |
| M002 | `wall_150` | `AUDITED_OK` | aynı düz-panel ailesi, genişliğe özel reçete |
| M003 | `wall_100` | `AUDITED_OK` | aynı düz-panel ailesi, genişliğe özel reçete |
| M004 | `wall_50` | `AUDITED_OK` | aynı düz-panel ailesi, genişliğe özel reçete |
| M005 | `wall_separator_100` | `GAP` | güncel oluşturma OK; eski tanımlayıcı kimliği M007 ile çatışır — F-013 |
| M006 | `wall_separator_50` | `GAP` | güncel oluşturma OK; eski tanımlayıcı kimliği M008 ile çatışır — F-013 |
| M007 | `wall_separator_100_sarmasik` | `GAP` | model varlığı vardır; eski tanımlayıcı modelFile ayırt edemez — F-013 |
| M008 | `wall_separator_50_sarmasik` | `GAP` | model varlığı vardır; eski tanımlayıcı modelFile ayırt edemez — F-013 |
| M009 | `wall_showcase_100_3` | `AUDITED_OK` | açık 3-göz durum/renderer/reçete |
| M010 | `wall_showcase_100_2` | `AUDITED_OK` | açık 2-göz durum/renderer/reçete |
| M011 | `wall_shelf_3_200` | `AUDITED_OK` | shelfCount 3 açık; reçete + renderer aydınlatma durumu |
| M012 | `wall_shelf_3_150` | `AUDITED_OK` | shelfCount 3 açık; reçete |
| M013 | `wall_shelf_3_100` | `AUDITED_OK` | shelfCount 3 açık; reçete |
| M014 | `wall_shelf_2_200` | `AUDITED_OK` | shelfCount 2 açık; reçete |
| M015 | `wall_shelf_2_150` | `AUDITED_OK` | shelfCount 2 açık; reçete |
| M016 | `wall_shelf_2_100` | `AUDITED_OK` | shelfCount 2 açık; reçete |
| M017 | `wall_base_200` | `AUDITED_OK` | açık base-wall durum/renderer/reçete; yerleştirme özel politikası F-011 ile izlenir |
| M018 | `wall_base_150` | `AUDITED_OK` | aynı aile; yerleştirme özel politikası F-011 ile izlenir |
| M019 | `wall_base_100` | `AUDITED_OK` | aynı aile; yerleştirme özel politikası F-011 ile izlenir |
| M020 | `DOOR_100` | `AUDITED_OK` | açık kapı durum/renderer/reçete |
| M021 | `desk_banko_200` | `AUDITED_OK` | düz banko durum/renderer/reçete |
| M022 | `desk_banko_150` | `AUDITED_OK` | düz banko durum/renderer/reçete |
| M023 | `desk_banko_100` | `AUDITED_OK` | düz banko durum/renderer/reçete |
| M024 | `desk_banko_200_L` | `AUDITED_OK` | L şekil katalog/durum/davranış/renderer/reçetede açık |
| M025 | `desk_banko_150_L` | `AUDITED_OK` | L şekil katalog/durum/davranış/renderer/reçetede açık |
| M026 | `desk_banko_100_L` | `AUDITED_OK` | L şekil katalog/durum/davranış/renderer/reçetede açık |
| M027 | `BASE_200` | `AUDITED_OK` | açık baza durum/renderer/reçete; uç nokta özel politikası F-011 ile izlenir |
| M028 | `BASE_150` | `AUDITED_OK` | aynı baza ailesi |
| M029 | `BASE_100` | `AUDITED_OK` | aynı baza ailesi |
| M030 | `furniture_sofa_set_classic` | `DECISION_REQUIRED` | çalışma zamanı/model/renk sözleşmesi vardır; BOM çözülmemiş — F-014 |
| M031 | `furniture_table_chair_set_eames` | `DECISION_REQUIRED` | çalışma zamanı/model/renk sözleşmesi + model varlığı; BOM çözülmemiş — F-014 |
| M032 | `furniture_bar_stool_classic` | `DECISION_REQUIRED` | çalışma zamanı/model/renk sözleşmesi + model varlığı; BOM çözülmemiş — F-014 |
| M033 | `DEPOT_MINI_FRIDGE_AVANTI` | `DECISION_REQUIRED` | çalışma zamanı/model-sabit sözleşme + model varlığı; BOM çözülmemiş — F-014; yerleştirme istisnası F-011 altında |
| M034 | `DEPOT_KETTLE` | `DECISION_REQUIRED` | çalışma zamanı/model-sabit sözleşme + model varlığı; BOM çözülmemiş — F-014; yerleştirme istisnası F-011 altında |
| M035 | `DEPOT_COAT_RACK` | `DECISION_REQUIRED` | çalışma zamanı/model-sabit sözleşme + model varlığı; BOM çözülmemiş — F-014; yerleştirme istisnası F-011 altında |
| M036 | `EXTRA_INDOOR_PLANT_1` | `DECISION_REQUIRED` | çalışma zamanı/model-sabit durum/renderer; BOM çözülmemiş — F-014 |
| M037 | `EXTRA_LONG_PLANTER_100` | `DECISION_REQUIRED` | özel model varlığı + düzenlenebilir-renk profili; BOM çözülmemiş — F-014 |
| M038 | `EXTRA_LONG_PLANTER_150` | `DECISION_REQUIRED` | özel model varlığı + düzenlenebilir-renk profili; BOM çözülmemiş — F-014 |
| M039 | `EXTRA_LONG_PLANTER_200` | `DECISION_REQUIRED` | özel model varlığı + düzenlenebilir-renk profili; BOM çözülmemiş — F-014 |
| M040 | `TV_42` | `DECISION_REQUIRED` | özelleşmiş TV durum/renderer; BOM çözülmemiş — F-014; overlay politikası F-011 altında |
| M041 | `TV_55` | `DECISION_REQUIRED` | paylaşılan kanonik TV yapılandırma/durum/renderer; BOM çözülmemiş — F-014 |
| M042 | `VIDEO_WALL_2X2` | `DECISION_REQUIRED` | açık satır/sütun/panel ekran geometrisi; BOM çözülmemiş — F-014 |
| M043 | `VIDEO_WALL_3X3` | `DECISION_REQUIRED` | açık satır/sütun/panel ekran geometrisi; BOM çözülmemiş — F-014 |
| M044 | `TV_65` | `DECISION_REQUIRED` | paylaşılan kanonik TV yapılandırma/durum/renderer; BOM çözülmemiş — F-014 |
| M045 | `LED_FLOODLIGHT` | `DECISION_REQUIRED` | üst-ışık durum/renderer sözleşmesi; BOM çözülmemiş — F-014; üst-fikstür politikası F-011 altında |
| M046 | `illuminated-foam` | `DECISION_REQUIRED` | açık katalog-dışı sözleşme/durum/renderer/testler; BOM çözülmemiş — F-014; wall-overlay politikası F-011 altında |

## Önemli çapraz-alan notları

- F-010 45 kez tekrarlanmaz. Modül oluşturmanın `main.js` içinde gizli paralel bir kayıt tarafından yönlendirildiği tek mimari risktir.
- F-011 özel yerleştirme modülü başına tekrarlanmaz. A05/A06/A09 somut politika dallarını aynı kök bulgu altında numaralandıracaktır.
- Harici model lisans/atıf bütünlüğü burada kararlaştırılmaz; A13/A21 o denetimi sahiplenir.
- `DECISION_REQUIRED` modülün düzenleyicide bozuk olduğu anlamına gelmez. Nihai BOM politikasının henüz kanonik kararlaştırılmadığı anlamına gelir.

Bölüm denetim durumu: **GAP / DECISION_REQUIRED — A04 için inceleme tamam; düzeltme yapılmadı.**
Sonraki katı denetim bölümü: **A05 — Modül davranışı**.
