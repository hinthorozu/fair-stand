# DECISION-03 — featureContracts

**KONU:** `FEATURE_CONTRACTS` / `getFeatureContract` planner’a bağlansın mı, governance kalsın mı, başka role mi insin?

## MEVCUT GERÇEK DURUM

Kayıt: `automaticDepot`, `automaticWall` (`src/featureContracts.js`). Alanlar: id, owner, trigger, inputs, creates, placement, persistence, tests.regressionFiles.

Consumer zinciri:

```
main.js → planAutomaticDepot (autoDepot.js)
main.js → composeAutomaticStandWall / composeAutomaticBackWallWithDepot (automaticWall.js)
         → wallReflow.planContinuousWallLayout
FEATURE_CONTRACTS / getFeatureContract: okunmaz
```

GitNexus `getFeatureContract`: incoming yalnız `test/systemDevelopmentContract.test.js`; process []. Planner testleri (`test/autoDepot.test.js`, `test/automaticWall.test.js`) registry’yi import etmez; test contract’ı planner çıktısını `creates.contentKinds` ile karşılaştırır.

## NEDEN KARAR GEREKİYOR

§2 “Feature / composition contract = featureContracts.js”. Executable composition `autoDepot`/`automaticWall`. Drift: registry güncellenmeden planner değişebilir (veya tersi); yalnız o bir test yakalar.

---

## OPTION A — Governance contract kalsın (planner okumaz)

**Ne yapılır?** Planner aynı. Docs: registry declaration; owner dosyalar executable.

**Avantajları:** Runtime 0. Planner HIGH-path dokunulmaz.

**Dezavantajları:** §2 executable değil. Drift riski test genişliğine bağlı.

**Runtime / compatibility / migration:** Yok.

**Test etkisi:** Mevcut 1 contract test + planner testleri durur.

## OPTION B — Runtime okusun

**Ne yapılır?** `planAutomaticDepot` / `composeAutomaticStandWall` `getFeatureContract` alanlarını (inputs, creates, trigger) okur; sapınca fail veya contract’tan üretir.

**Avantajları:** Composition drift kapanır. §2 executable.

**Dezavantajları:** Planner davranışını registry’ye kilitler. Yanlış kayıt production depo/duvarı değiştirir. `autoDepot` / `automaticWall` + `main.js` stage create.

**Runtime etkisi:** Stage oluşturma / otomatik duvar.

**Backward compatibility:** Persist: üretilen modüller zaten project state. Eski projeler load’da planner’ı yeniden çalıştırmayabilir; yeni stage etkilenir.

**Test etkisi:** Planner + systemDevelopmentContract + ilgili e2e.

**Migration:** Kod bağlama; veri şeması yok. Orta.

## OPTION C — Rol indirgeme (inventory / test manifest)

**Ne yapılır?** Registry “test manifest + owner pointer” olarak belgelenir; composition kuralı owner dosyada. `tests.regressionFiles` path envanteri (bugün `test/autoDepot.test.js`). Runtime bağ yok.

**Avantajları:** A’nın netleştirilmiş hali. `getFeatureContract` silinmek zorunda değil.

**Dezavantajları:** “Contract” adı spec beklentisi yaratır.

**Runtime / migration:** A ile aynı.

## DO NOTHING

Planner çalışır; registry test-only. Risk: yeni feature UI’ya gömülür (§3 yasağı). MA-003 açık.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A / C |
| En az migration | A / C |
| En az regression | A / C |
| En temiz uzun vadeli model | B (executable composition contract) veya C (manifest, kural owner’da) |

Blok: MA-003. WP-03. DECISION-02 ile aynı “registry vs executable” sınıfı; bağımsız uygulanabilir.
