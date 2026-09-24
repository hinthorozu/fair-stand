# Fair Stand — performans yol haritası

**Durum:** Backlog (henüz uygulanmadı).  
**Kaynak:** Prod gözlem (2026-09-24, fuar.kyrox.studio) + kod incelemesi.  
**Hedef ölçek:** Eşzamanlı **~100 aktif stand tasarımı** (100 proje / 100 eşzamanlı kullanıcı senaryosu — ikisi de sunucu yükünü artırır).

İlgili audit notu (bundle/render): [`audit/evidence/A17_PERFORMANCE_BUNDLE_RENDER_LIFECYCLE.md`](../../audit/evidence/A17_PERFORMANCE_BUNDLE_RENDER_LIFECYCLE.md).

---

## 1. Gözlemlenen belirtiler

| Belirti | Şiddet | Not |
|---|---|---|
| Site ilk açılış (`fuar.kyrox.studio`) | Normal | CRM SPA + Fair Stand iframe ilk mount |
| **Kayıtlı projeyi sahneye açma** | **5–10 sn** (değişken) | En acil UX sorunu |
| Modül sürükleme | Ara sıra takılma | Snap + placement ana thread |
| Sahneyi döndürme (orbit) | **Genelde takılma** | GPU gölge + render throttle |
| Nedensiz donma | Bazen | Muhtemelen arka planda `rebuildWall` / kayıt / texture |

---

## 2. Kök nedenler (kod)

### 2.1 Proje açma pipeline’ı

Sıra: `openStoredProject` → `loadProject` → `restoreProject` → `loadAssetsForActiveProject` → `createStage` → **`rebuildWall` / `buildWall` (tüm modüller sıfırdan)**.

| Katman | Dosya / fonksiyon | Sorun |
|---|---|---|
| Remote proje + görseller | `projectRemote.js` → `cacheProjectAndAssets` | Her açılışta API; **görseller sıralı HTTP** (`for` + `await`), IndexedDB’de olsa bile yeniden indirme |
| Görsel kayıt | `main.js` → `registerAsset` | Her asset için `createObjectURL` |
| Sahne rebuild | `scene3d.js` → `buildWall` | `disposeWall` + tüm modül fabrikası; modül sayısı ile süre artar |
| Panel texture | `scene3d.js` → `applyStoredImage` / `loadSingleImageOnSurface` | `TextureLoader` + `createFittedCanvas` (cover/contain) **ana thread** |
| GLB | `loadGltfScene` / `loadItemModel` | İlk açılışta parse; cache sonrası daha iyi |

### 2.2 Orbit (kamera döndürme)

| Ayar | Konum | Etki |
|---|---|---|
| PCF shadow, 2048 map | `scene3d.js` renderer + keyLight | GPU maliyeti yüksek |
| Çok mesh `castShadow` / `receiveShadow` | Modül oluşturma | Her frame shadow pass |
| Render cap ~50 fps aktif / ~4 fps idle | `setAnimationLoop` | Yüksek Hz monitörde orbit “atlamalı”; damping ile senkron |
| Antialias + tone mapping | WebGLRenderer | Ek GPU |

### 2.3 Sürükleme ve “ara sıra” spike

- `pointermove`: snap, ghost, duvar hattı (`scene3d.js` drag session).
- Birçok UI aksiyonu `main.js` → **`rebuildWall()`** (tam sahne yeniden kurulumu); orbit/sürükle ile çakışınca donma.

### 2.4 CRM bundle (ikincil)

- Vite uyarısı: `mountFairStand` ~1 MB + `index` ~1 MB — **ilk Fair Stand route** yavaş olabilir; proje açma 5–10 sn’nin ana nedeni değil.
- Stand ayrı **iframe** + ikinci document → bellek baskısı (100 eşzamanlı sekme = 100 iframe).

---

## 3. Ölçek: ~100 eşzamanlı stand tasarımı

**Not:** “100 stand” = 100 kayıtlı proje değil, **aynı anda** tasarım yapan oturum sayısı varsayımı. Her oturum:

| Bileşen | 100× etki | Risk |
|---|---|---|
| Fair Stand API (bootstrap) | 100 oturum × 1 bootstrap/refresh | JSON büyük; CDN/cache yoksa CPU + bant genişliği |
| Proje GET + **N asset GET / açılış** | 100 × (1 + N) istek | **N büyükse sunucu ve disk I/O tıkanır** (bugün sıralı indirme hem client hem sunucuyu yorar) |
| PostgreSQL `fair_stand_projects` | 100 okuma/yazma | Payload JSONB boyutu; index yeterli |
| Disk asset kökü | 100 proje × görsel sayısı | WebP depolama büyür; yedekleme süresi |
| Tarayıcı | 100 WebGL sahne | **İstemci başına** GPU/RAM; sunucu RAM’i değil |
| Core auth / CRM proxy | 100 session | Mevcut stack; izleme gerekir |

**Sunucu tarafı ilk koruma:** Asset indirmeyi azalt (etag/version cache), paralel limit, bootstrap HTTP cache header (revision hash ile).

---

## 4. Öncelikli iş paketleri

### P0 — Proje açma (hedef: tipik proje &lt; 2–3 sn)

1. **Asset cache sözleşmesi:** Proje `updatedAt` + asset listesi (`id`, `byteSize`, `mimeType`) değişmediyse **sunucudan tekrar indirme yok**; IndexedDB + memory URL kullan.
2. **Paralel asset indirme:** `cacheProjectAndAssets` — sıralı `for` yerine sınırlı concurrency (ör. 4–6).
3. **Aşamalı UI:** Overlay metinleri — “Proje yükleniyor”, “Görseller 3/12”, “Sahne kuruluyor”.
4. **Ölçüm:** `performance.mark` — `loadProject`, `cacheAssets`, `buildWall`, modül sayısı, asset sayısı; prod’da opsiyonel debug flag.

**Kod:** `src/projectRemote.js`, `src/main.js` (`restoreProject`), isteğe bağlı API (asset metadata-only endpoint).

### P1 — Orbit akıcılığı

1. **Kalite profilleri:** `high` (mevcut) / `balanced` (shadow 1024) / `low` (gölge kapalı).
2. Orbit veya damping aktifken **render throttle gevşet** (her rAF render veya 60 fps cap).
3. Modül sayısı &gt; eşik → otomatik `balanced`.

**Kod:** `src/scene3d.js` (renderer, animation loop).

### P2 — Sürükleme ve rebuild

1. **`rebuildWall` debounce** — aynı frame’de birden çok çağrı tek rebuild.
2. Renk / cam / tek yüzey güncellemelerinde **kısmi update** (tam `buildWall` yok) — pilot: renk + glass.
3. Drag sırasında snap hesabını **throttle** (ör. 32 ms) — UX test gerekir.

**Kod:** `src/main.js`, `src/scene3d.js`.

### P3 — Yapısal (uzun vadeli)

1. **Incremental scene graph:** Ekle / sil / taşı = tek modül grubu; `disposeWall` yalnızca stand tipi/zemin değişince.
2. Tekrarlayan panel geometry **instancing**.
3. GLB: meshopt/Draco; paylaşılan geometry clone azaltma.
4. CRM: Fair Stand route **lazy** `import()` — ilk CRM daha hafif.

### P4 — 100 eşzamanlı oturum (ops)

1. Bootstrap: `revision` ile **Cache-Control** / nginx micro-cache (org başına dikkat).
2. Asset download: rate limit + CDN veya nginx `X-Accel-Redirect` static.
3. Fair Stand API worker sayısı / uvicorn workers; Postgres connection pool gözden geçir.
4. İzleme: p95 `GET project`, p95 asset download, bootstrap boyutu.

---

## 5. Doğrulama checklist’i (PR sonrası)

- [ ] Proje 0 görsel: açılış &lt; 1 sn (lokal prod benzeri)
- [ ] Proje 20 görsel (~20 MB toplam): açılış &lt; 3 sn (ikinci açılış cache hit ile &lt; 1.5 sn)
- [ ] 30 modül: `buildWall` &lt; 500 ms (Chrome Performance Long Task)
- [ ] Orbit: 60 fps hissi (balanced profil, orta GPU)
- [ ] Network: ikinci proje açılışında **0 gereksiz asset GET**
- [ ] Yük testi (ops): 50 eşzamanlı bootstrap + 20 eşzamanlı proje açma — p95 &lt; hedef

---

## 6. Bilinçli erteleme

- Vite chunk uyarısı (500 KB): P3 lazy route ile; tek başına sahne takılması çözmez.
- Sunucu kernel reboot: deploy ile ilgili değil; bakım penceresi.

---

## 7. Güncelleme kuralı

Performans PR’ı merge edilince: bu dosyada ilgili P* maddesini **YAPILDI** + tarih + kısa not; `REFACTOR.md` günlüğüne bir satır.
