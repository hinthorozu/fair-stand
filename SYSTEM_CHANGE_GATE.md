# Fair Stand — Universal System Change Gate

> Bu belge `SYSTEM_DEVELOPMENT_CONTRACT.md` üzerindeki üst seviye geliştirme kapısıdır.
>
> Amaç mevcut sistemi bu dosyada denetlemek değildir. Amaç, bundan sonra insan veya AI tarafından yapılan her anlamlı değişikliğin **önce etkisini beyan etmesini**, sonra uygulanmasını ve CI tarafından doğrulanmasını sağlamaktır.

---

# 1. Temel kural

Fair Stand'a yeni bir şey eklemek sadece "kod yazmak" değildir.

Aşağıdakilerin tamamı change contract kapsamına girer:

- yeni katalog modülü veya varyantı,
- yeni feature / otomasyon / scene composition,
- yeni UI butonu, input, select, context-menu action veya kısayol,
- yeni state alanı,
- save/load davranışı,
- renderer / GLB / procedural geometri değişikliği,
- placement / move / rotation / collision davranışı,
- BOM / recipe / production part değişikliği,
- asset ekleme veya değiştirme,
- import/export formatı,
- storage / IndexedDB davranışı,
- performans veya accessibility etkisi,
- mimari refactor,
- build / CI / script / dependency değişikliği,
- bugfix.

**Kural:** Guarded sistem dosyaları değişiyorsa `.github/change-contract.json` aynı değişiklik setinde güncellenmeden CI kabul etmez.

---

# 2. Zorunlu çalışma sırası

İnsan veya AI:

1. `PROJECT_RULES.md` oku.
2. `ARCHITECTURE_RULES.md` oku.
3. `SYSTEM_DEVELOPMENT_CONTRACT.md` oku.
4. Bu `SYSTEM_CHANGE_GATE.md` dosyasını oku.
5. Değişikliği sınıflandır.
6. `.github/change-contract.json` içinde bütün impact domain'leri tek tek `affected` veya `not-applicable` olarak işaretle.
7. Canonical owner/source-of-truth dosyalarını belirt.
8. Risk, migration ve rollback kararlarını belirt.
9. Targeted testleri belirt.
10. Ondan sonra implementasyona başla.
11. Targeted regression testlerini çalıştır.
12. Full `npm test` çalıştır.
13. `npm run build` çalıştır.
14. Change gate + test + build yeşil olmadan tamamlandı deme.

---

# 3. Universal impact domain'leri

Her change contract aşağıdaki alanların **tamamı** için karar taşır:

| Domain | Soru |
|---|---|
| `catalog` | Katalog kimliği/descriptörü değişiyor mu? |
| `behavior` | Move/rotation/collision/interaction davranışı değişiyor mu? |
| `state` | Runtime/project state yapısı değişiyor mu? |
| `placement` | Yerleştirme/snap/reflow geometrisi değişiyor mu? |
| `renderer` | Three.js/GLB/procedural render davranışı değişiyor mu? |
| `persistence` | Save/load/autosave/restore etkileniyor mu? |
| `bom` | Recipe/production part/final BOM politikası etkileniyor mu? |
| `ui` | Buton/input/select/menu/feedback/shortcut etkileniyor mu? |
| `composition` | Bir feature birden fazla modül/sistem oluşturuyor veya koordine ediyor mu? |
| `assets` | `public/` asset/model/image tarafı değişiyor mu? |
| `storage` | IndexedDB/asset/project storage etkileniyor mu? |
| `importExport` | ZIP/project schema/import/export etkileniyor mu? |
| `performance` | Render/runtime/bundle maliyeti değişiyor mu? |
| `accessibility` | Keyboard/ARIA/focus/label davranışı etkileniyor mu? |
| `architecture` | Source-of-truth, ownership, dependency veya build mimarisi değişiyor mu? |
| `security` | Yetki, veri sınırı, dış kaynak, input validation veya güvenlik etkisi var mı? |
| `tests` | Test sözleşmesi/regresyon kapsamı değişiyor mu? |

Bir alan "unutuldu" diye boş bırakılamaz. Uygulanmıyorsa açıkça `not-applicable` yazılır.

---

# 4. Change türleri

Makine tarafından tanınan change türleri:

- `module`
- `feature`
- `ui-control`
- `state-change`
- `renderer-change`
- `persistence-change`
- `bom-change`
- `architecture`
- `tooling`
- `bugfix`
- `refactor`

Tür bazı domain kararlarını zorunlu kılar. Örneğin:

- `ui-control` → `ui: affected`
- `state-change` → `state: affected`
- `renderer-change` → `renderer: affected`
- `persistence-change` → `persistence: affected`
- `bom-change` → `bom: affected`
- `architecture` / `tooling` → `architecture: affected`

---

# 5. Path-aware ikinci duvar

Sadece geliştiricinin beyanına güvenilmez.

`scripts/verify-change-contract.mjs` değişen dosyalardan bazı zorunlu domain'leri ayrıca türetir.

Örnekler:

- `src/catalog.js` → `catalog`
- `src/moduleBehavior.js`, `moduleMove.js`, `modulePlacement.js`, `wallReflow.js`, `cornerPlacement.js` → `behavior + placement`
- `src/designState.js` → `state + persistence`
- `src/scene3d.js`, `viewCube.js` → `renderer`
- `src/projectStore.js`, `assetStore.js`, `imageAssetReferences.js` → `persistence + storage`
- `src/moduleRecipes.js`, `productionParts.js`, `rawBomDebug.js` → `bom`
- `src/autoDepot.js`, `automaticWall.js`, `featureContracts.js` → `composition`
- `public/**` → `assets`
- `index.html` ve belirli UI/controller dosyaları → `ui`
- `package*.json`, `scripts/**`, `.github/workflows/**`, contract altyapısı → `architecture`

Dosya yolu bir domain'i zorunlu kılıyorsa change contract bunu `not-applicable` diyerek geçemez.

Bu path haritası mevcut sistem denetlendikçe genişletilecektir.

---

# 6. UI için özel kural

Yeni bir buton "küçük değişiklik" sayılmaz.

Örneğin yeni bir "Depoyu Temizle" butonu eklenecekse change contract en az şunları cevaplamalıdır:

- UI owner neresi?
- Hangi state/feature çağrısını tetikliyor?
- Persistence etkisi var mı?
- Undo/restore veya project isolation etkisi var mı?
- Keyboard/accessibility davranışı var mı?
- Hangi regression test bunu koruyor?

UI yalnız DOM'a eklenip event handler bağlanarak tamamlanmış sayılmaz.

---

# 7. Modül ve feature contract'larıyla ilişki

Bu gate mevcut contract'ların yerine geçmez.

- Module-level detay → `src/moduleContracts.js`
- Feature/composition detay → `src/featureContracts.js`
- Universal değişiklik etkisi → `.github/change-contract.json`
- Universal schema/validator → `src/systemChangeContract.js`

Örneğin yeni çöp kovası eklenirken:

1. Universal change contract açılır.
2. `module` olarak sınıflandırılır.
3. catalog/behavior/state/renderer/persistence/BOM/UI vb. etkiler beyan edilir.
4. Sonra `moduleContracts.js` içindeki gerçek modül contract'ı oluşturulur.
5. Sonra implementation + tests yapılır.

---

# 8. CI davranışı

PR veya ROG push'unda guarded dosya değişmişse:

1. `.github/change-contract.json` değişmiş mi?
2. Contract schema eksiksiz mi?
3. Bütün impact domain'leri explicit mi?
4. Change kind ile zorunlu domain'ler uyumlu mu?
5. Path-aware zorunlu domain'ler `affected` mı?
6. Full-suite ve build policy açıkça zorunlu mu?

Kontrollerden biri başarısızsa gate kırılır.

Ardından normal `npm test` ve `npm run build` çalışır.

---

# 9. Bu dosya ne değildir?

Bu dosya:

- mevcut sistemin audit sonucu değildir,
- mevcut bütün UI kontrollerinin envanteri değildir,
- mevcut bütün state alanlarının doğrulandığı anlamına gelmez,
- mevcut bütün renderer/placement/BOM alanlarının temiz olduğu iddiası değildir.

Bu turda sadece **denetim yapacağımız çerçeve** kurulmaktadır.

Sonraki ayrı çalışma, bu framework kullanılarak sistemi domain domain tarayacaktır.

---

# 10. Sonraki audit statüleri

İleride alanlar tek tek denetlenirken aşağıdaki statüler kullanılabilir:

- `AUDITED_OK` — contract ve implementation uyumlu.
- `GAP` — eksik veya drift var.
- `DECISION_REQUIRED` — ürün/iş kararı gerekiyor.
- `NOT_APPLICABLE` — bu alan gerçekten uygulanmıyor.
- `NOT_AUDITED` — henüz kontrol edilmedi.

**Kural:** `NOT_AUDITED`, "sorun yok" anlamına gelmez.
