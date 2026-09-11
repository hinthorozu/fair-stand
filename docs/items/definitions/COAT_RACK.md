# COAT_RACK — Canonical Item

Migration öncesi tam envanter: [current-system/COAT_RACK](../current-system/COAT_RACK.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMMERCIAL_ITEMS.COAT_RACK` canonical itemKey/name/type/dimensions/modelFile sahibidir. Tekil ticari Item; parametrik veya bileşik değildir. Mevcut sistemde doğrulanmış unit YOK; BOM aşamasına geçilmediği için unit tahmin edilmedi. Width/depth/height mevcut katalog/state değerlerinden taşındı; length/thickness/material/defaultColor için doğrulanmış business metadata YOK, tahmin eklenmedi. Trash modelRotationYDeg/preserveModelScale defaultları aynı Item'dadır.

## Factory, state, overrides, persistence
`src/designState.js > createCommercialModuleState` type üzerinden canonical Item'ı çözer. Mevcut public factory girişleri bu tek oluşturma yoluna bağlanır. Instance `id`, itemKey, catalogKey, type ve ölçüler taşır; placement/autoDepot proje alanlarıdır. Catalog kimliği itemKey ile aynıdır. Trash descriptor ölçü/model override'ları açıkça default üzerine uygulanır; diğer üç ürün mevcut sabit factory davranışını korur.
JSON snapshot/save/load instance ID ve mevcut override'ları korur; duplicate yeni ID üretir. Renderer/ghost/geçici seçim persist edilmez. Kullanıcı kararı: eski DEPOT_ projeleri için alias veya geriye uyumluluk migrationı yok.

## Behavior, capabilities ve ilişkiler
`src/moduleBehavior.js` type kaynağıdır: free placement, move/snap/rotation/collision/ghost ve kettle-fridge overlap aynı ortak motorlarda kalır. Trash davranışı itemKey/model adına göre seçilmez. UI selection, drag, sağ click, silme, sağ/sol duplicate/insert ve klavye yolları ortak modül akışındadır. Fixed-model profile renk/image düzenlemeyi kapalı tutar.
Otomatik depo yeni bir parent Item oluşturmaz; içerik instance'larını planlar. Persistent host/child/neighbor ilişkisi ve host takip reflow'u yok. Kettle mevcut sabit yükseltilmiş görünümünü fridge Item yüksekliğinden alır; bu migration yeni stacking davranışı eklemez.

## BOM ve tüketiciler
`src/moduleContracts.js` mevcut `decision-required` politikasını ve `source: null` değerini korur. Unit, reçete, resolver, çocuk BOM, Raw BOM veya Final BOM bağlantısı eklenmedi. Bu değişiklik yalnız canonical Item kimliği, özellikleri, state/factory ve runtime tüketicilerini kapsar.

## Consumer cutover ve renderer sınırı
Catalog descriptor, shared factory ve autoDepot ölçüleri canonical Item kaynağından gelir. `selectionFeedback.js` gerçek state ölçülerini/defaultları gösterir. `scene3d.js` model path ve ölçü fallbacklarını Item'dan alır. GLB scaling, proxy, sidebar ikon renkleri ve trash gövdesindeki beyaz materyal uygulaması renderer temsilidir; business material/defaultColor değildir.

## Regression ve açık kapsam
`test/commercialItemsContract.test.js`: properties, değişmeyen `decision-required` BOM politikası, state/save-load/duplicate, seçim metni, otomatik depo, override ve diğer Item'ların migration izolasyonu.
`e2e/commercial-items-contract.spec.mjs`: dört katalog drag akışı ve otomatik depo kaydet/yeniden aç. Mevcut ürün/placement testleri korunur.
F-014 bu kapsamda değiştirilmedi; F-019 yalnız bu dört Item için ele alındı ve genel finding/PR/post-merge kapanışı yapılmadı. Doğrulama sonucu değişiklik kaydında tutulur.
