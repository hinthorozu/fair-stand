# `factory.reason`

**Özellik ID:** `factory.reason`
**İnsan tarafından anlaşılır adı:** Factory başarısızlık gerekçesi
**Kategori:** audit-factory
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `createUprightModuleState() sabit getItem('upright_346_5') kullanır; upright_99 üretilmez.` · `createUprightModuleState() sabit getItem('upright_346_5') kullanır; upright_49_5 üretilmez.` · `MODULE_STATE_FACTORIES içinde type yok: panel` · `MODULE_STATE_FACTORIES içinde type yok: separator-panel` · `MODULE_STATE_FACTORIES içinde type yok: connector` · `MODULE_STATE_FACTORIES içinde type yok: door-leaf` · `createModuleStateFromDescriptor null döndü` · `MODULE_STATE_FACTORIES içinde type yok: shelf-accessory` · `MODULE_STATE_FACTORIES içinde type yok: showcase-board` · `MODULE_STATE_FACTORIES içinde type yok: showcase-accessory` · `MODULE_STATE_FACTORIES içinde type yok: counter-top` · `MODULE_STATE_FACTORIES içinde type yok: base-top` (+1)

## Ne işe yarar

Factory audit sütunu.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createUprightModuleState` :478 [read]
- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :653 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]

## Okuyan yerler

- `src/designState.js` `createUprightModuleState` :478 [read]

## Yazan / değiştiren yerler

- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :653 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Override yok (analiz/audit sütunu).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **39** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `floor`
- itemKey: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `factory`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/designState.js`

- `src/designState.js` `createUprightModuleState` :478 [read]
- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :653 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]

- indeks: 115 / 188
