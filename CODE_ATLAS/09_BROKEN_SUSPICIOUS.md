# Broken / Suspicious

Kanıt ile yorum ayrıldı. Severity: HIGH / MEDIUM / LOW / INFO.

Unresolved import (Knip): yok. Missing module: bu taramada kanıtlanmadı.

---

## 1. `groundLayout.js` renderer’a bağlı değil

| | |
| --- | --- |
| **Finding** | `createGroundLayout` sahne ızgarasını üretmez |
| **File** | `src/groundLayout.js` vs `src/scene3d.js` |
| **Evidence** | GitNexus incoming yalnız test; scene3d’de `createGroundLayout`/`GridHelper` 0; production IMPORTS 0 |
| **Severity** | MEDIUM |
| **Explanation** | Audit MD (`A03_ARCHITECTURE`) dosyayı “sahne/zemin yerleşim yardımcısı” der. Runtime zemin `scene3d` içinde. Consumer’ı olmayan producer (test hariç). |

---

## 2. Feature contract runtime’da okunmuyor

| | |
| --- | --- |
| **Finding** | `FEATURE_CONTRACTS` / `getFeatureContract` production call yok |
| **File** | `src/featureContracts.js` vs `autoDepot.js` / `automaticWall.js` / `main.js` |
| **Evidence** | IMPORTS grafı; context incoming yalnız `systemDevelopmentContract.test.js`; process `[]` |
| **Severity** | LOW (governance sapması, runtime bug değil) |
| **Explanation** | `SYSTEM_DEVELOPMENT_CONTRACT.md` composition kuralının bu dosyada taşınmasını ister. Çalışan kod doğrudan planner fonksiyonları çağırır. Sözleşme ile implementation arasında otomatik bağ yok. |

---

## 3. `moduleContracts.js` ikinci kaynak

| | |
| --- | --- |
| **Finding** | BOM/behavior policy `src/` production tarafından import edilmiyor |
| **File** | `src/moduleContracts.js` |
| **Evidence** | 19 importer, hepsi test; runtime `moduleBehavior.js` + `item.composition` |
| **Severity** | MEDIUM (duplicate source of truth riski) |
| **Explanation** | Testler `resolveModuleContract(itemKey).bom.mode` assert eder. Runtime BOM `itemBom.js`. Sözleşme sapması testte yakalanır, runtime’da contract objesi yoktur. |

---

## 4. `cornerPlacement.js` production insert yolunda yok

| | |
| --- | --- |
| **Finding** | `resolveAdjacentPlacement` main/scene3d import etmiyor |
| **File** | `src/cornerPlacement.js` |
| **Evidence** | callers yalnız 2 test; live insert `wallReflow`/`modulePlacement`/`moduleMove` |
| **Severity** | MEDIUM |
| **Explanation** | Köşe geçiş algoritması testte duruyor. Production farklı planner kullanıyor. Davranış sapması mümkün; bu taramada e2e ile kanıtlanmadı. |

---

## 5. Stale patch script vs güncel catalog

Silindi (`scripts/patch-video-wall-2x2.cjs`, `scripts/patch-video-wall-single-image.cjs`). Bkz. `CODE_ATLAS/CLEANUP_PHASE_1.md`.

---

## 6. `shelfCount` doküman vs runtime

| | |
| --- | --- |
| **Finding** | Runtime Item’da `shelfCount` 0; audit MD hâlâ `static.shelfCount` |
| **File** | `src/items.js` vs `docs/items/audit/properties/properties/static.shelfCount.md` |
| **Evidence** | node: `withShelfCount: 0`; src grep yalnız yorum; `docs/refactor/REFACTOR.md` kaldırma kaydı |
| **Severity** | LOW (docs stale). Runtime tutarlı |
| **Explanation** | Yanlış property yolu tüketicisi runtime’da yok. |

---

## 7. `static.*` doküman namespace

| | |
| --- | --- |
| **Finding** | `static.dimensions` JS path değil |
| **File** | `docs/items/audit` |
| **Evidence** | `src` `static.` 0 |
| **Severity** | INFO |
| **Explanation** | Audit katmanı. Kod okuyucusu `item.static` ararsa boş döner. |

---

## 8. BOM kullanıcı yüzeyi yok; recipe production’da sessiz

| | |
| --- | --- |
| **Finding** | `resolveItemBom` production UX’te yok (DEV `?rawBom`) |
| **File** | `itemBom.js`, `main.js` dinamik import |
| **Evidence** | `if (import.meta.env.DEV && ...has('rawBom'))` |
| **Severity** | INFO/MEDIUM ürün kararı |
| **Explanation** | Recipe/BOM kodu canlı ama normal kullanıcı akışına bağlı değil. “Consumer’ı zayıf producer”. |

---

## 9. Connector BOM export’ları production’da çağrılmıyor

| | |
| --- | --- |
| **Finding** | `resolveConnectorBom` yalnız unit test |
| **File** | `src/items.js` |
| **Evidence** | grep |
| **Severity** | LOW |
| **Explanation** | Connector Item’lar recipe `composition.items` içinde başka itemKey ile BOM’a girebilir. Bu resolver kullanılmadan da recipe satırı genişler. Ölü API vs canlı data. |

---

## 10. GitNexus `createStandScene` impact LOW vs dosya boyutu

| | |
| --- | --- |
| **Finding** | Upstream 1 caller; dosya binlerce satır |
| **Evidence** | impact LOW; `scene3d.js` return façade |
| **Severity** | INFO (analiz tuzak) |
| **Explanation** | Caller sayısı riski düşürmez. Hotspot dosyası. |

---

## 11. İki test kökü

| | |
| --- | --- |
| **Finding** | `test/` ve `tests/` |
| **Evidence** | glob; featureContracts regression path `tests/autoDepot.test.js` |
| **Severity** | LOW |
| **Explanation** | Node `--test` ikisini de alır. Keşif karışıklığı. |

---

## 12. `validateImportedProjectState` main’den doğrudan yok

| | |
| --- | --- |
| **Finding** | Zip yolu `validateProjectArchiveManifest` → içeride project validate |
| **Evidence** | main import listesi; `projectImportValidation.js` |
| **Severity** | INFO |
| **Explanation** | Kopuk değil; iç zincir. Knip export unused yanıltır. |

---

## Olmayanlar (kanıt negatif)

| Arama | Sonuç |
| --- | --- |
| Knip unresolved | `[]` |
| Circular IMPORTS | 0 |
| `new Worker` | 0 |
| `tvConfig.js` (eski audit adı) | bu taramada `src/` dosyası yok — stale doc referansı olası (`A02_F005_CLOSURE.md`) |
