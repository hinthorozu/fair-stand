# PLASTIC_TRASH_BIN — Canonical Item

Migration öncesi tam envanter: [current-system/PLASTIC_TRASH_BIN](../current-system/PLASTIC_TRASH_BIN.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > COMMERCIAL_ITEMS.PLASTIC_TRASH_BIN` canonical itemKey/name/type/dimensions/modelFile sahibidir. Tekil ticari Item; parametrik veya bileşik değildir. Mevcut sistemde doğrulanmış unit YOK; BOM aşamasına geçilmediği için unit tahmin edilmedi. Width/depth/height mevcut katalog/state değerlerinden taşındı; length/thickness/material/defaultColor için doğrulanmış business metadata YOK, tahmin eklenmedi. `modelRotationYDeg`, `visualRotationYDeg=-90` ve `preserveModelScale` defaultları aynı Item'dadır.

## Factory, state ve persistence
`src/designState.js > createCommercialModuleState` type üzerinden canonical Item'ı çözer. Mevcut public factory girişleri bu tek oluşturma yoluna bağlanır. Instance `id`, itemKey, type, canonical ölçüler ve Item'dan kopyalanan başlangıç görsel dönüşünü taşır; placement/autoDepot proje alanlarıdır. Dış descriptor ürün defaultlarını tanımlayamaz. Oluşturulmuş instance'ın `visualRotationYDeg` alanı daha sonra kontrollü bir runtime/editor işlemiyle ezilebilir; renderer alan yoksa Item defaultuna döner.
JSON snapshot/save/load instance ID ve canonical ürün alanlarını korur; duplicate yeni ID üretir. Renderer/ghost/geçici seçim persist edilmez. Kullanıcı kararı: eski DEPOT_ projeleri için alias veya geriye uyumluluk migrationı yok.

## Behavior, capabilities ve ilişkiler
`src/moduleBehavior.js` type kaynağıdır: free placement, move/snap/rotation, `collision: none` (yalnız stand sınırı), ghost ve kettle-fridge overlap aynı ortak motorlarda kalır. Davranış itemKey/model adına göre seçilmez. UI selection, drag, sağ click, silme, sağ/sol duplicate/insert ve klavye yolları ortak modül akışındadır. Fixed-model profile renk/image düzenlemeyi kapalı tutar.
Otomatik depo yeni bir parent Item oluşturmaz; içerik instance'larını planlar. Persistent host/child/neighbor ilişkisi ve host takip reflow'u yok. Kettle mevcut sabit yükseltilmiş görünümünü fridge Item yüksekliğinden alır; bu migration yeni stacking davranışı eklemez.

## BOM ve tüketiciler
`src/moduleContracts.js` mevcut `decision-required` politikasını ve `source: null` değerini korur. Unit, reçete, resolver, çocuk BOM, Raw BOM veya Final BOM bağlantısı eklenmedi. Bu değişiklik yalnız canonical Item kimliği, özellikleri, state/factory ve runtime tüketicilerini kapsar.

## Consumer cutover ve renderer sınırı
Catalog descriptor, shared factory ve autoDepot ölçüleri canonical Item kaynağından gelir. `selectionFeedback.js` gerçek state ölçülerini/defaultları gösterir. Sol katalog ve Add picker kartları `moduleDragSidebar.js` içindeki `module-drag-trash-bin` siluetini paylaşır; wall/panel şerit önizlemesi kullanılmaz. `scene3d.js` model path ve ölçü fallbacklarını Item'dan alır; GLB ile üst etiketi birlikte çevirirken instance `visualRotationYDeg` değerini, alan yoksa Item defaultunu kullanır. GLB scaling, proxy, sidebar ikon renkleri ve trash gövdesindeki beyaz materyal uygulaması renderer temsilidir; business material/defaultColor değildir.

## Regression ve açık kapsam
`test/commercialItemsContract.test.js`: properties, değişmeyen `decision-required` BOM politikası, state/save-load/duplicate, seçim metni, otomatik depo, dış descriptor ürün alanlarının reddi ve diğer Item'ların migration izolasyonu.
`e2e/commercial-items-contract.spec.mjs`: dört katalog drag akışı ve otomatik depo kaydet/yeniden aç. Mevcut ürün/placement testleri korunur.
F-014 bu kapsamda değiştirilmedi; F-019 yalnız bu dört Item için ele alındı ve genel finding/PR/post-merge kapanışı yapılmadı. Doğrulama sonucu değişiklik kaydında tutulur.
