/**
 * BOM birimi ile Fair CRM maliyet kataloğu birimi arasındaki yazım köprüsü.
 * Katalog birimleri: Adet, Kg, m², Metre, Gün, Saat.
 * Fair Stand leaf birimleri: adet, m2.
 */

const COST_UNITS = Object.freeze(['Adet', 'Kg', 'm²', 'Metre', 'Gün', 'Saat']);

const BOM_UNIT_TO_COST_UNIT = Object.freeze({
  adet: 'Adet',
  kg: 'Kg',
  m2: 'm²',
  'm²': 'm²',
  metre: 'Metre',
  m: 'Metre',
  gun: 'Gün',
  gün: 'Gün',
  saat: 'Saat',
});

function canonicalBomUnit(unit) {
  return String(unit ?? '')
    .trim()
    .toLowerCase()
    .replaceAll('²', '2')
    .replaceAll('^', '');
}

export function bridgeBomUnitToCostUnit(bomUnit) {
  const key = canonicalBomUnit(bomUnit);
  return BOM_UNIT_TO_COST_UNIT[key] ?? null;
}

export function isCostCatalogUnit(unit) {
  return COST_UNITS.includes(unit);
}
