# MA-007 — Capability source of truth

**KONU:** `getItemSurfaceCapabilities` ile `mesh.userData.acceptsImage` aynı kavram mı, hangisi canonical, derive mi, ayrı mı?

Seçim yok. GitNexus: `getItemSurfaceCapabilities` CRITICAL (riskSharedAxes LOW); incoming P: `createEditableItemSurfaceState`, `createDoorModule` + 2 test.

## MEVCUT GERÇEK DURUM

### Producer / consumer — itemCapabilities

`ITEM_SURFACE_CAPABILITIES_BY_TYPE` yalnız `'door-leaf'`: `{ color: true, image: true, glass: false, lightbox: false, mesh: false }`. Diğer type `NO_SURFACE_CAPABILITIES` (hepsi false).

| Consumer | Kullanım |
| --- | --- |
| `designState.createEditableItemSurfaceState` | color/image yoksa throw; door leaf `surface` state |
| `scene3d.createDoorModule` | `acceptsImage: doorLeafCapabilities.image` (kapı **kanadı**) |
| Test | `doorLeafItemContract`, `showcaseBodyBoardsItemContract` (board’lar false) |

`glass` / `lightbox` / `mesh` `src/` okuma **0** (map’te false; başka dosya anahtar okumaz).

### Producer / consumer — acceptsImage

Renderer mesh `userData.acceptsImage`. `applyImageAsset` / horizontal / rect: `acceptsImage === false` ise red.

Hardcoded **true** (capability map değil):

- baza yüzeyleri `moduleType: 'base'`
- banko `counter` (düz ve L)
- `flat-panel` şeritleri
- kapı **üst panelleri** `moduleType: 'door'`
- showcase panelleri `moduleState.type`

Hardcoded **false:** TV, GLB proxyler, illuminated-foam hitbox, vb.

Kapı **kanadı** true/false capability’den gelir (bugün true).

### Panel state (üçüncü yol)

`createEditablePanelState` capability **çağırmaz**; her panel `color` + `imageAssetId`. Banko/baza/duvar görseli bu state + `acceptsImage: true` ile çalışır.

### Aynı kavram mı?

**Hayır, birebir değil.**

| | itemCapabilities | acceptsImage |
| --- | --- | --- |
| Katman | Item type registry | Renderer hit-target |
| Boyut | color, image, glass, lightbox, mesh | yalnız image apply |
| Kapsam | 1 type true | birçok mesh true |
| Glass/fabric | map unused | `applyGlassMode` / `applyFabricMode` / `applyMeshMode` ayrı |

Duplicate SoT **image izni** için: kapı kanadı map’ten; duvar/banko/baza scene3d literal. `acceptsImage` capability’den derive **edilebilir** (map genişlerse). Capability registry scene3d’den derive **edilebilir** (true olan type’lar map’e yazılır). Bugün derive yok.

## NEDEN KARAR GEREKİYOR

Docs capabilities geniş. Map dar. Sahne image başka kural. Tek SoT seçilmeden WP-02 kodlanamaz (yanlış birleştirme production image’i kapatır).

---

## OPTION A — itemCapabilities canonical

**Ne yapılır?** scene3d `acceptsImage` (ve ileride glass/fabric) map’ten okur.

**Migration:** Map **genişlemeden** bağlanırsa base/counter/flat-panel/showcase/door-panel image **kapanır** (bugün true, map false). Önce hangi type’ların true olacağı ürün listesi gerekir. `createEditablePanelState` capability’ye çekilmezse state–renderer sapması sürer.

**Runtime:** Tüm görsel uygula. **Regression:** HIGH (`scene3d` + door + panel). **Compatibility:** persist `imageAssetId` durur; apply reddedilebilir.

## OPTION B — scene3d.acceptsImage canonical

**Ne yapılır?** Map “door-leaf leaf state” diye daraltılır veya image bayrağı renderer’a bırakılır.

**Migration:** Docs/test capability genişliği. Door leaf hâlâ map veya scene3d kopyası. glass/lightbox/mesh map’te ölü kalır.

**Runtime:** Image apply aynı kalabilir. **Regression:** düşük (davranış korunursa). **Uzun vade:** type kuralı 7800 satır içinde.

## OPTION C — Biri diğerinden derive

**C1** map ← scene3d true type’lar (kod üretimi veya el tablosu).  
**C2** acceptsImage ← `getItemSurfaceCapabilities(item).image` (A’nın mekaniği; map dolu olmalı).

**Migration:** C2 = A. C1 = envanter + map doldurma, sonra isteğe bağlı C2. Test: door + panel + showcase body false.

## OPTION D — Farklı kavram; açık ayrım

**Ne yapılır?** Kod davranışı aynı. Docs: capabilities = Item leaf editability (bugün door-leaf); `acceptsImage` = mesh hit policy; glass/fabric ayrı. Map’e “tüm yüzeyler” denmez.

**Migration:** Docs/test. Runtime 0. Duplicate image kuralı **bilinçli** kalır.

**Regression:** en düşük.

## DO NOTHING

İki kural + docs sapması. MA-007 açık. Risk: ajan map’i genişletmeden scene3d’ye bağlar → image regress.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | D |
| En az migration | D |
| En az regression | D (A mapsiz bağlanırsa en yüksek) |
| En temiz uzun vadeli model | A veya C (tek image kuralı), map önce production ile doldurulmuş olmalı |

Blok: MA-007. WP-02. Hotspot: `scene3d.js` A/C2.
