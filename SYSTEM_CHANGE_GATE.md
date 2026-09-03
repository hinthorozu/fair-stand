# Fair Stand — Universal System Change Gate

> Bu belge `SYSTEM_DEVELOPMENT_CONTRACT.md` üzerindeki üst seviye geliştirme kapısıdır.
>
> Amaç mevcut sistemi bu dosyada denetlemek değildir. Amaç, bundan sonra insan veya AI tarafından yapılan her anlamlı değişikliğin **önce etkisini beyan etmesini**, sonra uygulanmasını ve gate/test/build zinciri tarafından doğrulanmasını sağlamaktır.

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

**Kural:** Guarded sistem dosyaları değişiyorsa `.github/change-contract.json` aynı değişiklik setinde güncellenmeden değişiklik kabul edilmez.

---

# 2. Zorunlu çalışma sırası

İnsan veya AI:

1. `PROJECT_RULES.md` oku.
2. `ARCHITECTURE_RULES.md` oku.
3. `SYSTEM_DEVELOPMENT_CONTRACT.md` oku.
4. Bu `SYSTEM_CHANGE_GATE.md` dosyasını oku.
5. Değişikliği sınıflandır.
6. `.github/change-contract.json` içinde bütün impact domain'leri tek tek `affected` veya `not-applicable` olarak işaretle.
7. `tests` domain'ini her değişiklikte `affected` olarak işaretle.
8. Canonical owner/source-of-truth dosyalarını belirt.
9. Risk, migration ve rollback kararlarını belirt.
10. En az bir non-empty targeted regression test path'i belirt.
11. Ondan sonra implementasyona başla.
12. `npm run contract:verify` çalıştır.
13. Targeted regression testlerini çalıştır.
14. Full `npm test` çalıştır.
15. `npm run build` çalıştır.
16. Change gate + test + build yeşil olmadan tamamlandı deme.

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
| `tests` | Bu değişikliği koruyan regression/test sözleşmesi nedir? |

Bir alan unutulduğu için boş bırakılamaz. Uygulanmıyorsa açıkça `not-applicable` yazılır; **tek istisna `tests` domain'idir ve her change contract için `affected` olmak zorundadır.**

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
- bütün change türleri → `tests: affected`

---

# 5. Path-aware ikinci duvar

Sadece geliştiricinin beyanına güvenilmez.

`scripts/verify-change-contract.mjs`, değişen dosyalardan zorunlu impact domain'lerini ayrıca türetir. Canonical mapping `src/systemChangeContract.js` içindedir.

Kurallar:

- mevcut **51 `src/` dosyasının tamamı** explicit ownership-derived domain mapping taşır; yeni bir `src/` dosyası mapping eklenmeden regression suite geçmez,
- multi-responsibility source dosyaları bilinen bütün kritik domain'lerini zorunlu kılar,
- `public/**` → `assets`,
- `test/**` ve legacy `tests/**` → `tests`,
- `README.md`, `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `SYSTEM_DEVELOPMENT_CONTRACT.md`, `SYSTEM_CHANGE_GATE.md`, `MODULE_BEHAVIOR_STANDARD.md`, `SYSTEM_AUDIT_CHECKLIST.md` → `architecture`,
- `package.json`, `package-lock.json`, `scripts/**`, `.github/workflows/**`, `vite.config*` → `architecture`,
- `index.html` → `ui`.

Dosya yolu bir domain'i zorunlu kılıyorsa change contract bunu `not-applicable` diyerek geçemez.

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
- Universal schema/validator/path map → `src/systemChangeContract.js`

Örneğin yeni çöp kovası eklenirken:

1. Universal change contract açılır.
2. `module` olarak sınıflandırılır.
3. catalog/behavior/state/renderer/persistence/BOM/UI vb. etkiler beyan edilir.
4. `tests: affected` ve targeted regression path'i yazılır.
5. Sonra `moduleContracts.js` içindeki gerçek modül contract'ı oluşturulur.
6. Sonra implementation + targeted regression + full test/build yapılır.

---

# 8. CI ve local verifier davranışı

## CI

PR veya ROG push'unda verifier değişen dosyaları GitHub event SHA'larından çözer ve şunları denetler:

1. Guarded dosya değişmişse `.github/change-contract.json` aynı diff içinde değişmiş mi?
2. Contract schema eksiksiz mi?
3. Bütün impact domain'leri explicit mi?
4. `tests: affected` mı?
5. En az bir targeted regression path'i var mı?
6. Change kind ile zorunlu domain'ler uyumlu mu?
7. Path-aware zorunlu domain'ler `affected` mı?
8. Full-suite ve build policy `true` mu?

Ardından normal `npm test` ve `npm run build` çalışır.

## Local

CI environment değişkenleri yoksa `npm run contract:verify` artık diff enforcement'ı **atlamaz**.

Verifier:

- feature branch'te `ROG` veya `origin/ROG` ile merge-base üzerinden committed farkı bulur,
- mevcut `ROG` branch'inde mümkünse `origin/ROG` ile local commit farkını karşılaştırır,
- staged değişiklikleri ekler,
- unstaged değişiklikleri ekler,
- untracked dosyaları ekler,
- bütün dosya listesini tekilleştirip aynı guarded/path-domain kurallarından geçirir.

Gerekirse base açıkça `CHANGE_GATE_BASE=<git-ref> npm run contract:verify` ile verilebilir.

Local base çözülemiyorsa verifier sessizce schema-only success vermez; **fail-closed** olur ve `CHANGE_GATE_BASE` veya `ROG` ref'i ister.

---

# 9. Bu dosya ne değildir?

Bu dosya:

- mevcut sistemin audit sonucu değildir,
- mevcut bütün UI kontrollerinin envanteri değildir,
- mevcut bütün state alanlarının doğrulandığı anlamına gelmez,
- mevcut bütün renderer/placement/BOM alanlarının temiz olduğu iddiası değildir.

Bu belge yeni değişikliklerin kabul kapısını tanımlar. Mevcut sistemin audit/remediation durumu `SYSTEM_AUDIT_CHECKLIST.md` ve `audit/` kayıtlarında tutulur.

---

# 10. Audit statüleri

Alanlar denetlenirken kullanılan statüler:

- `AUDITED_OK` — contract ve implementation uyumlu.
- `GAP` — eksik veya drift var.
- `DECISION_REQUIRED` — ürün/iş kararı gerekiyor.
- `NOT_APPLICABLE` — bu alan gerçekten uygulanmıyor.
- `NOT_AUDITED` — henüz kontrol edilmedi.

**Kural:** `NOT_AUDITED`, "sorun yok" anlamına gelmez.
