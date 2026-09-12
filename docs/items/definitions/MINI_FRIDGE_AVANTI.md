# MINI_FRIDGE_AVANTI — Kanonik Item

Migration öncesi tam envanter: [current-system/MINI_FRIDGE_AVANTI](../current-system/MINI_FRIDGE_AVANTI.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > COMMERCIAL_ITEMS.MINI_FRIDGE_AVANTI` kanonik itemKey/name/type/dimensions/modelFile sahibidir. Tekil ticari Item; parametrik veya bileşik değildir. Mevcut sistemde doğrulanmış unit YOK; BOM aşamasına geçilmediği için unit tahmin edilmedi. Width/depth/height mevcut katalog/state değerlerinden taşındı; length/thickness/material/defaultColor için doğrulanmış business üstveri YOK, tahmin eklenmedi. Trash modelRotationYDeg/preserveModelScale defaultları aynı Item'dadır.

## Oluşturma, state, ezme, kalıcılık
`src/designState.js > createCommercialModuleState` type üzerinden kanonik Item'ı çözer. Mevcut public oluşturucu girişleri bu tek oluşturma yoluna bağlanır. Örnek `id`, itemKey, type ve ölçüler taşır; yerleşim/autoDepot proje alanlarıdır. Trash tanım ölçü/model ezme'ları açıkça default üzerine uygulanır; diğer üç ürün mevcut sabit oluşturucu davranışını korur.
JSON snapshot/save/load örnek ID ve mevcut ezme'ları korur; duplicate yeni ID üretir. Renderer/ghost/geçici seçim persist edilmez. Kullanıcı kararı: eski DEPOT_ projeleri için alias veya geriye uyumluluk migrationı yok.

## Davranış, yetenekler ve ilişkiler
`src/moduleBehavior.js` type kaynağıdır: serbest yerleşim, move/snap/rotation, `collision: none` (yalnız stand sınırı), ghost ve kettle-fridge overlap aynı ortak motorlarda kalır. Davranış itemKey/model adına göre seçilmez. UI selection, drag, sağ click, silme, sağ/sol duplicate/insert ve klavye yolları ortak modül akışındadır. Fixed-model profile renk/image düzenlemeyi kapalı tutar.
Otomatik depo yeni bir parent Item oluşturmaz; içerik örnek'larını planlar. Persistent host/child/neighbor ilişkisi ve host takip reflow'u yok. Kettle mevcut sabit yükseltilmiş görünümünü fridge Item yüksekliğinden alır; bu migration yeni stacking davranışı eklemez.

## BOM ve tüketiciler
`src/moduleContracts.js` mevcut `decision-required` politikasını ve `source: null` değerini korur. Unit, reçete, resolver, çocuk BOM, Raw BOM veya Final BOM bağlantısı eklenmedi. Bu değişiklik yalnız kanonik Item kimliği, özellikleri, state/oluşturucu ve runtime tüketicilerini kapsar.

## Tüketici geçişi ve renderer sınırı
Catalog tanım, shared oluşturucu ve autoDepot ölçüleri kanonik Item kaynağından gelir. `selectionFeedback.js` gerçek state ölçülerini/defaultları gösterir. `scene3d.js` model path ve ölçü fallbacklarını Item'dan alır. GLB scaling, proxy, sidebar ikon renkleri ve trash gövdesindeki beyaz materyal uygulaması renderer temsilidir; business material/defaultColor değildir.

## Regresyon ve açık kapsam
`test/commercialItemsContract.test.js`: özellikler, değişmeyen `decision-required` BOM politikası, state/save-load/duplicate, seçim metni, otomatik depo, ezme ve diğer Item'ların migration izolasyonu.
`e2e/commercial-items-contract.spec.mjs`: dört katalog drag akışı ve otomatik depo kaydet/yeniden aç. Mevcut ürün/yerleşim testleri korunur.
F-014 bu kapsamda değiştirilmedi; F-019 yalnız bu dört Item için ele alındı ve genel finding/PR/post-merge kapanışı yapılmadı. Doğrulama sonucu değişiklik kaydında tutulur.
