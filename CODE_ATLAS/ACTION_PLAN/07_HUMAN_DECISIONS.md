# 07 — İnsan kararları

Kodla kapanmaz. Teknik tercih yazılmaz.

---

## DECISION-01

**Konu:** BOM kullanıcıya açılsın mı?  
**Mevcut durum:** `resolveItemBom` live. UI yalnız `import.meta.env.DEV && ?rawBom`. Production quote/order yok. E2e panel açılışını doğrular.  
**Seçenek A:** Production’da üretim listesi (veya maliyet) aç.  
**Seçenek B:** DEV-only kalsın; docs/contract’ta bilinçli kapı yaz.  
**Teknik sonuç:** A → `main.js` kapısı, UI, e2e satır assert, change-contract bom+ui. B → kod yok; MA-001 kapanır, MA-011 dar e2e.  
**Karar yoksa:** Resolver ile kullanıcı yüzeyi kopuk kalır; her BOM işi yeniden tartışılır.

## DECISION-02

**Konu:** `moduleContracts` runtime SoT olacak mı?  
**Mevcut:** 19 test okur; production BOM `composition`+`itemBom`; behavior `moduleBehavior`.  
**A:** Planner/BOM/behavior `resolveModuleContract` okusun.  
**B:** Canonical tabloyu “governance/test oracle” diye düzelt; runtime SoT `items.js`+`moduleBehavior`+`itemBom`.  
**Teknik sonuç:** A → ikinci okuma yolu, drift kapanır, blast HIGH. B → docs/test metni değişir, runtime aynı.  
**Karar yoksa:** İki SoT; contract testi runtime’ı korumaz.

## DECISION-03

**Konu:** `featureContracts` planner’a bağlansın mı?  
**Mevcut:** `autoDepot` / `automaticWall` registry okumaz. `getFeatureContract` 1 test.  
**A:** Planner contract alanlarını okusun.  
**B:** Governance-only belgele.  
**Teknik sonuç:** A → composition drift kapanır; planner davranışı contract’a kilitlenir. B → kod aynı.  
**Karar yoksa:** SYSTEM_DEVELOPMENT_CONTRACT §2 executable değil.

## DECISION-04

**Konu:** `groundLayout` sahneye alınsın mı?  
**Mevcut:** TEST_SUPPORT; scene3d 0. Gate map renderer+placement.  
**A:** `createStandScene` grid’i `createGroundLayout` ile üretsin.  
**B:** TEST_SUPPORT diye belgele; sahne mevcut floor/grid’i kullansın.  
**Teknik sonuç:** A → renderer bağ; B → dosya kalır, orphan kapanır belgede.  
**Karar yoksa:** Gate map vs runtime kopuk.

## DECISION-05

**Konu:** `cornerPlacement` live reflow ile birleşsin mi?  
**Mevcut:** Production `wallReflow`. Helper 270° testte eşitlenir.  
**A:** Insert/reflow tek fonksiyon; helper silinir veya ince sarmalayıcı.  
**B:** TEST_SUPPORT / reference model kalsın; production testleri wallReflow’u doğrudan kapsasın.  
**Teknik sonuç:** A → dual model biter. B → production sapması helper testiyle gizlenmez (test hedefi reflow olur).  
**Karar yoksa:** İki planner.

## DECISION-06

**Konu:** `composition.moduleType` / `composition.options` dursun mu?  
**Mevcut:** Yazılı; production okunmaz. L kimliği `item.shape`. Test `moduleType` assert eder.  
**A:** Runtime oku (recipe id / options).  
**B:** Alanları kaldır; testleri `item.type`/`item.shape`/`itemKey`’e çek.  
**Teknik sonuç:** A → schema live. B → 28+3 Item satırı ve contract testleri. `getItem` CRITICAL.  
**Karar yoksa:** SCHEMA_ONLY kalır.

## DECISION-07

**Konu:** F-045 kalan Python yama betikleri.  
**Mevcut:** 3 py; npm/CI yok; elle çalışırsa kaynak değişebilir. 2 cjs silindi.  
**A:** py sil + F-045 kapat.  
**B:** “manuel, çalıştırma” diye dondur; F-045 açık veya waived.  
**Teknik sonuç:** A → hijyen. B → residual risk.  
**Karar yoksa:** F-045 OPEN.

## DECISION-08

**Konu:** Connector BOM API.  
**Mevcut:** Data recipe itemKey ile live. `getConnectorItemKey` test-only.  
**A:** `resolveItemBom` / expand bu API’yi kullansın.  
**B:** API’yi test helper say veya sil; data `composition.items` kalsın.  
**Teknik sonuç:** A → ikinci giriş. B → dead API temizliği (test güncellemesi).  
**Karar yoksa:** Data live, API test.

---

**Adet: 8.**
