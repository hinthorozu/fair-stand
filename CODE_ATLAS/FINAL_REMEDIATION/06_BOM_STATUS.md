# 06 — BOM durumu (DECISION-01 C, DECISION-08 STATUS QUO)

## Kullanıcı UI

Production UI yok. Kapı: `import.meta.env.DEV && ?rawBom` → `rawBomDebug.js` → `resolveItemBom`. Vite production’da DEV false.

## MA-011

`test/rawBomDebugEntry.test.js`: main.js gerçek giriş regex; seçim metni → `resolveItemBom('wall_100')` satırları.  
`e2e/visible-ui-b.spec.mjs`: `/ ?rawBom` stand oluşturma + seçim DOM’u üzerinden `li` satır.

## Connector API

DECISION-08: `getConnectorItemKey` / `resolveConnectorBom` değişmedi. Data recipe `itemKey`. Docs STATUS QUO.
