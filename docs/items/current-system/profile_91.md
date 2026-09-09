# profile_91 — Current System Inventory

Baseline: `Version2`. Bu envanter `ITEM_CONTRACT_CHECKLIST.md` zorunlu kapsamına göre fresh runtime doğrulamasıdır.

## 1. Identity / type — VAR
`itemKey=profile_91`, `name=Profil 91 cm`, `type=profile`, `unit=adet`; owner `src/productionParts.js`. Legacy `partId`: YOK.

## 2. Intrinsic properties — VAR
`lengthCm=91`, `thicknessCm=8`, `material='alüminyum'`, `defaultColor=0xd0d3d4`. Material kullanıcı ürün kararıdır. Mevcut render default'u `src/theme.js` içindeki `ALUMINUM_PROFILE_COLOR='#D0D3D4'` ile eşdeğerdir.

## 3. Default state — UYGULANMIYOR
Ayrı mutable leaf project state yoktur.

## 4. Factory / creation — UYGULANMIYOR
Bağımsız project-instance factory yoktur; parent recipe içinde production Item olarak çözülür.

## 5. Placement — UYGULANMIYOR
Parent module placement sahibidir.

## 6. Move — UYGULANMIYOR
Parent module/type behavior sahibidir.

## 7. Rotation — UYGULANMIYOR
Bağımsız leaf rotation contract'ı yoktur.

## 8. Snap — UYGULANMIYOR
Bağımsız leaf snap contract'ı yoktur.

## 9. Collision — UYGULANMIYOR
Bağımsız leaf collision contract'ı yoktur.

## 10. Selection — UYGULANMIYOR
Kullanıcı production profile değil parent module'ü seçer.

## 11. Context menu — UYGULANMIYOR
Context-menu parent module seviyesindedir.

## 12. Delete / duplicate / capabilities — UYGULANMIYOR
Leaf production Item bağımsız editor instance değildir.

## 13. Persistence — UYGULANMIYOR
Project snapshot parent module state'ini persist eder; ayrı `profile_91` instance'ı yoktur.

## 14. Relationships / reflow — UYGULANMIYOR
Leaf profile için ayrı spatial relationship/reflow state'i yoktur; kullanım ve quantity parent recipe sahibidir.

## 15. BOM / composition — VAR
Tekil Item. 12 doğrulanmış parent recipe (wall/door/shelf/showcase/separator/counter/L-counter/base/base-wall); recipe satırları canonical `itemKey` kullanır, quantity parent recipe'den gelir ve expansion `getProductionItem()` ile metadata çözer.

## 16. Renderer / asset boundary — VAR
`src/scene3d.js` production profile identity'sini mesh identity olarak tüketmez; bağlama göre 89 / 90.8 / 92 cm gibi procedural geometry üretir. Production length renderer'a zorla bağlanmaz. `ALUMINUM_PROFILE_COLOR` specialized renderer/theme override olarak kalabilir; canonical product default `Item.defaultColor=0xd0d3d4` Item'dadır.

## 17. Runtime owners — VAR
Product metadata `src/productionParts.js`; recipe `src/moduleRecipes.js`; BOM policy `src/moduleContracts.js`; state `src/designState.js`; renderer `src/scene3d.js`; render theme `src/theme.js`; persistence `src/main.js` + `src/projectStore.js`; Raw BOM `src/rawBomDebug.js`.

## 18. Regression — VAR
Profile Item Contract ve recipe testleri identity/dimensions/quantity/expansion parity'yi korur. `test/profileIntrinsicProperties.test.js` dört profile için `material='alüminyum'` ve `defaultColor=0xd0d3d4` değerlerini kilitler.

## Checklist sonucu
```text
identity/type/unit                 VAR
length/thickness                   VAR
material                           VAR (alüminyum)
defaultColor                       VAR (0xd0d3d4)
state/factory                      UYGULANMIYOR
placement/move/rotation/snap       UYGULANMIYOR
collision/selection/context-menu   UYGULANMIYOR
delete/duplicate                   UYGULANMIYOR
persistence                        UYGULANMIYOR
relationships/reflow               UYGULANMIYOR
BOM / parent recipe                VAR (12)
renderer boundary                  VAR
regression                         VAR
```
