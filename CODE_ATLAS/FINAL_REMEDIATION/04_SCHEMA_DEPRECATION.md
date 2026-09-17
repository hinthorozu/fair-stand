# 04 — SCHEMA_ONLY deprecation (DECISION-06)

Fiziksel kaldırma yok. Serialization (proje blob) bu alanları taşımaz; Item master git’te durur.

| Alan | Durum |
| --- | --- |
| `composition.moduleType` | DEPRECATED SCHEMA_ONLY; `src/` okuma 0; test assert durur |
| `composition.options` / `.shape` | DEPRECATED SCHEMA_ONLY; canlı kimlik `item.shape` |
| `composition.options.shelfCount` | STALE + DEPRECATED; Item’da yok |
| `composition.mode` / `items` / `innerCorner` | ACTIVE_RUNTIME; dokunulmadı |

Yeni deprecation API icat edilmedi. Banner: property MD, `PROPERTY_INDEX.md`, `docs/refactor/ITEMS.md`, `ITEM_CAPABILITY_INVENTORY.md`.
