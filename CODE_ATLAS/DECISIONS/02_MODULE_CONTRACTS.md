# DECISION-02 — moduleContracts

**KONU:** `src/moduleContracts.js` `resolveModuleContract` production SoT mu, test/governance oracle mı, yoksa açık spec katmanı olarak mı dursun?

## MEVCUT GERÇEK DURUM

Dosya: `MODULE_CONTRACT_PROFILES` + `MODULE_CONTRACT_ASSIGNMENTS` + `NON_CATALOG_MODULE_CONTRACTS`. `resolveModuleContract` katalog/`illuminated-foam` için profile merge eder; `behavior` alanını **`getModuleBehavior(...)` çağırarak** doldurur.

Production `src/` import: **0**. GitNexus: 19 direct test caller, 0 process, risk HIGH (test fan-in).

Runtime BOM: `item.composition` + `resolveItemBom`. Runtime behavior/placement: `moduleBehavior.js` (GitNexus `getModuleBehavior` tests-off impact 21 direct / 45 process / CRITICAL). Insert/reflow contract objesini okumaz.

`SYSTEM_DEVELOPMENT_CONTRACT.md` §2 tablo `moduleContracts.js` “Modül contract profile” der. §12: “Contract registry runtime davranışının ikinci implementasyonu haline getirilmez.”

Testler `bom.mode === 'recipe'` ise `composition.items` varlığını assert eder (`systemDevelopmentContract.test.js`) — governance, planner değil.

## NEDEN KARAR GEREKİYOR

Docs SoT tablosu executable gibi okunur; executable BOM/behavior başka dosyada. Drift testte yakalanır, runtime’da contract objesi yoktur.

---

## OPTION A — GOVERNANCE / TEST oracle kalsın

**Ne yapılır?** Runtime okumaz. Docs: “oracle / test hub; runtime SoT `items.js` + `moduleBehavior` + `itemBom`.” §2 tablo cümlesi buna çekilir.

**Avantajları:** Runtime 0. `getModuleBehavior` CRITICAL yüzeyi dokunulmaz.

**Dezavantajları:** İki kayıt (profile tablosu vs runtime). Contract testi runtime’ı çalıştırmaz.

**Runtime etkisi:** Yok.

**Backward compatibility:** Yok.

**Test etkisi:** Metin/assert hedefi “oracle” diye işaretlenir; 19 test durabilir.

**Migration:** Hayır.

## OPTION B — Runtime source-of-truth

**Ne yapılır?** `itemBom` / insert / `getModuleBehavior` `resolveModuleContract` okur (veya behavior yalnız oradan).

**Avantajları:** Tek okuma yolu; docs §2 literal executable.

**Dezavantajları:** İkinci implementasyon veya `getModuleBehavior` sarmalayıcı. Blast: behavior CRITICAL 45 process. Drift kapanır ama yanlış contract production’ı kırar. §12 ile çelişir (ikinci implementasyon yasağı — §12 de güncellenmeli).

**Runtime etkisi:** Her catalog insert/BOM/behavior path.

**Backward compatibility:** Persist yok; davranış sapması kullanıcıya görünür.

**Test etkisi:** Tüm module contract + behavior + BOM + e2e placement.

**Migration:** Kod migrasyonu geniş; veri migrasyonu yok. Yüksek.

## OPTION C — Ayrı spec katmanı, açıkça korunur

**Ne yapılır?** A ile kod aynı. Rol: “mimari spec + test oracle; runtime SoT değil.” §2 “canonical executable” değil “canonical declaration” diye ayrılır. §12 korunur.

**Avantajları:** A + yönetişim netliği. B’yi ileride açmaz/kapatmaz; rol yazılıdır.

**Dezavantajları:** A gibi çift kayıt. Spec sapması yalnız testte.

**Runtime / migration:** A ile aynı.

**Test etkisi:** `systemDevelopmentContract` “spec vs runtime” assert’leri güçlendirilebilir (davranış değiştirmeden).

## DO NOTHING

19 test + 0 src import durur. Risk: ajan/insan §2’yi runtime sanır. Teknik borç: MA-002 açık; iki SoT.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A / C |
| En az migration | A / C |
| En az regression | A / C |
| En temiz uzun vadeli model | B (tek executable SoT) — maliyet CRITICAL; veya C (spec/runtime ayrımı kalıcı mimari) |

Blok: MA-002. WP-03. `getModuleBehavior` CRITICAL — B öncesi impact zorunlu.
