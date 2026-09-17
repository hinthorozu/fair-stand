# Change Impact Hotspots

Refactor uygulanmadı. Yalnız tespit.

**Kanıt:** GitNexus `impact` + CALLS fan-in + File IMPORTS + dosya sorumluluğu.

**Tuzak:** `createStandScene` impact `risk: LOW` (1 upstream caller). Dosya hotspot’tur. `riskSharedAxes` HIGH/CRITICAL’i iptal etmez — `getItem`/`getModuleBehavior` CRITICAL.

---

## Kritik hub semboller

| Symbol/Module | Reason | Incoming | Outgoing | Risk |
| --- | --- | --- | --- | --- |
| `getItem` (`items.js`) | Tüm Item okuma | impact direct 60, process 79; CALLS 128 (test dahil) | `ITEMS` map | **CRITICAL** |
| `ITEMS` (`items.js`) | 96 satır tek tablo | `getItem` / `listRegisteredItems` | yok | CRITICAL (veri) |
| `getModuleBehavior` | type davranışı | impact direct 21, process 44; CALLS 42 | behavior tabloları, items, stripOccupancy, standDimensions | **CRITICAL** |
| `resolveItemKey` | kimlik çözümü | CALLS 25 | getItem, scene dimensions, shape/modelFile | HIGH |
| `createModuleStateFromDescriptor` | tüm factory giriş | impact CRITICAL, direct 4, process 5 | factories, resolveItemKey | CRITICAL |
| `getCatalogItem` / `listCatalogItems` | UI katalog | CALLS 51 / 14 | getItem | HIGH |
| `createModulePlacement` / `validatePlacementAgainstModules` / `snapPlacementToModules` | yerleşim | CALLS 19 / 14 / 8 | behavior, items, stripOccupancy | HIGH |
| `normalizeModuleRotationZDeg` | hemen her placement | CALLS 26 | — | HIGH |
| `openConfiguratorDb` | persist | CALLS 10 | IndexedDB | HIGH |
| `resolveItemBom` | BOM | CALLS 10 (çoğu test + debug) | recipes, getItem | MEDIUM (prod yüzey dar) |
| `resolveModuleContract` | test hub | CALLS 19, prod 0 | items, getModuleBehavior | LOW runtime / HIGH test |

---

## Kritik dosyalar (fan-out / boyut)

| Symbol/Module | Reason | Incoming | Outgoing | Risk |
| --- | --- | --- | --- | --- |
| `src/scene3d.js` | renderer+input+modül mesh tek dosya | `main.js` `createStandScene` | 20 src import + Three.js | **HIGH** (değişiklik yüzeyi) |
| `src/main.js` | orkestrasyon | HTML | 28 src import | **HIGH** |
| `src/modulePlacement.js` | snap/collision | 21 importer (src+test) | items, behavior, strip, standDimensions | HIGH |
| `src/designState.js` | 45 importer | catalog/test ağır | items, capabilities, strip | HIGH |
| `src/items.js` | 88 importer | her katman | yok | CRITICAL |

---

## Çok feature’a bağlı process girişleri

Aynı sembol birçok GitNexus process’in step 1’i:

`restoreProject`, `onDrop`, `onPointerUp`, `duplicateContextModule`, `changeContextShelfLighting`, `finishPlacementDrag`, `dropCatalogModuleDrag`, `createModuleContextMenu`.

Bunlarda değişiklik geniş e2e ister (`07_TEST_MAP.md`).

---

## Düşük görünümlü yüksek maliyet

| Hedef | Graph risk | Gerçek maliyet |
| --- | --- | --- |
| `createStandScene` | LOW | Tüm sahne API’si; Three.js lifecycle |
| `STAND_AXES` | UNKNOWN 0 caller | İç kullanım; export silmek güvenli olabilir, const silmek `validateStandAxisCapacity` kırar |
| `getRecipeInnerCornerPanelKey` | src export silindi | Test helper composition path; production BOM inline devam eder |

---

## Güvenli görünen TEST_ONLY dosyalar

`groundLayout.js`, `featureContracts.js`, `moduleContracts.js`, `cornerPlacement.js` production bundle’a `main.js` üzerinden girmez.

**Yorum:** Silmek Vite uygulamasını kırmaz; CI contract testlerini ve change-gate path map’ini kırar. Impact `UNKNOWN`/test callers. HIGH runtime risk değil, HIGH governance risk.

---

## Değişiklik önerisi yok

Bu dosya refactor listesi değildir. Yalnız mevcut fan-in/out ve GitNexus risk etiketleri.
