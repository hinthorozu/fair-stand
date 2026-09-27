import { bridgeBomUnitToCostUnit } from './costUnits.js';

const MONEY_SCALE = 4;
const MONEY_DIVISOR = 10n ** BigInt(MONEY_SCALE);

function parseScaled(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    value = String(value);
  }
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value).trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const [whole, frac = ''] = text.split('.');
  const padded = frac.padEnd(MONEY_SCALE + 1, '0');
  const keep = padded.slice(0, MONEY_SCALE);
  const roundUp = padded[MONEY_SCALE] >= '5';
  let scaled = BigInt(whole + keep);
  if (roundUp) scaled += 1n;
  return scaled;
}

function formatScaled(value) {
  const abs = value < 0n ? -value : value;
  const digits = abs.toString().padStart(MONEY_SCALE + 1, '0');
  const whole = digits.slice(0, -MONEY_SCALE);
  const frac = digits.slice(-MONEY_SCALE);
  return `${value < 0n ? '-' : ''}${whole}.${frac}`;
}

function multiplyMoney(quantity, unitPrice) {
  const left = parseScaled(quantity);
  const right = parseScaled(unitPrice);
  if (left == null || right == null) return null;
  if (left <= 0n) return null;
  const product = left * right;
  const half = MONEY_DIVISOR / 2n;
  return (product + half) / MONEY_DIVISOR;
}

function addMoney(left, right) {
  return left + right;
}

export function isFixedCostProduct(product) {
  const itemKey = product?.itemKey;
  return itemKey == null || String(itemKey).trim() === '';
}

export function normalizeCostProduct(product) {
  if (!product || typeof product !== 'object') return null;
  const id = String(product.id ?? product.productId ?? '').trim();
  if (!id) return null;
  const itemKeyRaw = product.itemKey ?? product.item_key ?? null;
  const itemKey = itemKeyRaw == null || String(itemKeyRaw).trim() === ''
    ? null
    : String(itemKeyRaw).trim();
  const unitPrice = product.unitPrice ?? product.unit_price;
  return Object.freeze({
    id,
    name: String(product.name ?? id),
    unit: product.unit ?? null,
    unitPrice: unitPrice == null || unitPrice === '' ? null : String(unitPrice),
    currency: product.currency ?? null,
    itemKey,
  });
}

function lineShell(fields) {
  return Object.freeze({
    source: fields.source,
    status: fields.status,
    itemKey: fields.itemKey ?? null,
    productId: fields.productId ?? null,
    name: fields.name ?? null,
    quantity: fields.quantity ?? null,
    bomUnit: fields.bomUnit ?? null,
    costUnit: fields.costUnit ?? null,
    unitPrice: fields.unitPrice ?? null,
    currency: fields.currency ?? null,
    lineTotal: fields.lineTotal ?? null,
  });
}

function pricedLine(fields, quantity, product) {
  const unitPrice = product.unitPrice;
  const total = unitPrice == null ? null : multiplyMoney(quantity, unitPrice);
  if (unitPrice == null || total == null || !product.currency) {
    return lineShell({
      ...fields,
      status: 'unpriced',
      productId: product.id,
      costUnit: product.unit ?? null,
      unitPrice: null,
      currency: product.currency ?? null,
      lineTotal: null,
    });
  }
  return lineShell({
    ...fields,
    status: 'priced',
    productId: product.id,
    name: fields.name || product.name,
    costUnit: product.unit,
    unitPrice: formatScaled(parseScaled(unitPrice)),
    currency: product.currency,
    lineTotal: formatScaled(total),
  });
}

function indexProducts(products) {
  const byItemKey = new Map();
  const fixed = [];
  const normalized = [];
  for (const raw of products) {
    const product = normalizeCostProduct(raw);
    if (!product) continue;
    normalized.push(product);
    if (isFixedCostProduct(product)) {
      fixed.push(product);
      continue;
    }
    const list = byItemKey.get(product.itemKey) ?? [];
    list.push(product);
    byItemKey.set(product.itemKey, list);
  }
  return { byItemKey, fixed, normalized };
}

function bomLine(raw, byItemKey) {
  const itemKey = raw?.itemKey ?? null;
  const quantity = raw?.quantity;
  const bomUnit = raw?.unit ?? null;
  const name = raw?.name ?? itemKey;
  const base = {
    source: 'bom',
    itemKey,
    name,
    quantity: quantity == null ? null : String(quantity),
    bomUnit,
  };
  if (!itemKey) {
    return lineShell({ ...base, status: 'unmapped' });
  }
  const matches = byItemKey.get(itemKey) ?? [];
  if (matches.length === 0) {
    return lineShell({ ...base, status: 'unmapped' });
  }
  if (matches.length > 1) {
    return lineShell({ ...base, status: 'ambiguous' });
  }
  const product = matches[0];
  const costUnit = bridgeBomUnitToCostUnit(bomUnit);
  if (!costUnit || costUnit !== product.unit) {
    return lineShell({
      ...base,
      status: 'unit_mismatch',
      productId: product.id,
      costUnit: product.unit ?? null,
    });
  }
  return pricedLine(base, quantity, product);
}

function fixedLine(selection, fixedById) {
  const product = fixedById.get(selection.productId);
  if (!product) return null;
  const quantity = selection.quantity;
  const base = {
    source: 'fixed',
    itemKey: null,
    name: product.name,
    quantity: quantity == null || quantity === '' ? null : String(quantity),
    bomUnit: product.unit,
  };
  const scaled = parseScaled(quantity);
  if (scaled == null || scaled <= 0n) {
    return lineShell({
      ...base,
      status: 'quantity_required',
      productId: product.id,
      costUnit: product.unit,
      currency: product.currency,
    });
  }
  return pricedLine(base, quantity, product);
}

function sumPriced(lines) {
  const totals = new Map();
  for (const line of lines) {
    if (line.status !== 'priced' || line.lineTotal == null || !line.currency) continue;
    const current = totals.get(line.currency) ?? 0n;
    totals.set(line.currency, addMoney(current, parseScaled(line.lineTotal)));
  }
  const totalsByCurrency = {};
  for (const [currency, amount] of totals) {
    totalsByCurrency[currency] = formatScaled(amount);
  }
  const currencies = Object.keys(totalsByCurrency);
  const mixedCurrency = currencies.length > 1;
  const total = currencies.length === 1
    ? Object.freeze({ currency: currencies[0], amount: totalsByCurrency[currencies[0]] })
    : null;
  return { totalsByCurrency: Object.freeze(totalsByCurrency), total, mixedCurrency };
}

/**
 * BOM satırları ve seçilen sabit katalog satırlarından fiyat anlık görüntüsü.
 * Eşleşmeyen ve fiyatsız satırlar toplama 0 olarak girmez.
 * Reçete ve girdi satırları değiştirilmez.
 */
export function buildCostSnapshot({
  bomLines = [],
  costProducts = [],
  selectedFixedLines = [],
  projectId = null,
  projectVersion = null,
  pricedAt,
  unresolved = [],
  printAreas = [],
} = {}) {
  const { byItemKey, fixed } = indexProducts(costProducts);
  const fixedById = new Map(fixed.map((product) => [product.id, product]));
  const lines = [
    ...bomLines.map((line) => bomLine(line, byItemKey)),
    ...selectedFixedLines
      .map((selection) => fixedLine(
        { productId: String(selection?.productId ?? ''), quantity: selection?.quantity },
        fixedById,
      ))
      .filter(Boolean),
  ];
  const money = sumPriced(lines);
  return Object.freeze({
    projectId: projectId == null ? null : String(projectId),
    projectVersion: projectVersion == null ? null : Number(projectVersion),
    pricedAt: pricedAt == null ? null : String(pricedAt),
    lines: Object.freeze(lines),
    totalsByCurrency: money.totalsByCurrency,
    total: money.total,
    mixedCurrency: money.mixedCurrency,
    unresolved: Object.freeze(Array.isArray(unresolved) ? unresolved.map((entry) => ({ ...entry })) : []),
    printAreas: Object.freeze(Array.isArray(printAreas) ? printAreas : []),
    fixedProducts: Object.freeze(fixed),
  });
}
