/**
 * Remove length_cm / thickness_cm from seed JSON, alembic dump, and catalog_seed_data.py blocks.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function stripRow(row) {
  if (!row || typeof row !== 'object') return;
  delete row.length_cm;
  delete row.thickness_cm;
}

const jsonPath = new URL('../test/fixtures/itemCatalogSeed.json', import.meta.url);
const seed = JSON.parse(readFileSync(jsonPath, 'utf8'));
for (const item of seed.items) stripRow(item.dimensions);
writeFileSync(jsonPath, `${JSON.stringify(seed)}\n`);

const dumpPath = `${root}/backend/alembic/data/0002_fair_stand_catalog_dump.json`;
const dump = JSON.parse(readFileSync(dumpPath, 'utf8'));
for (const row of dump.tables.fair_stand_item_dimensions || []) stripRow(row);
writeFileSync(dumpPath, `${JSON.stringify(dump, null, 2)}\n`);

const pyPath = `${root}/backend/app/modules/fair_stand/infrastructure/catalog_seed_data.py`;
let py = readFileSync(pyPath, 'utf8');
py = py.replace(/\n\s*"length_cm":[^\n]*,/g, '');
py = py.replace(/\n\s*"thickness_cm":[^\n]*,/g, '');
writeFileSync(pyPath, py);

const crmPy = fileURLToPath(new URL('../../fair-crm/backend/app/modules/fair_stand/infrastructure/catalog_seed_data.py', import.meta.url));
try {
  let crm = readFileSync(crmPy, 'utf8');
  crm = crm.replace(/\n\s*"length_cm":[^\n]*,/g, '');
  crm = crm.replace(/\n\s*"thickness_cm":[^\n]*,/g, '');
  writeFileSync(crmPy, crm);
} catch {
  // fair-crm optional in workspace
}

console.log('stripped length_cm/thickness_cm from fixture, dump, catalog_seed_data.py');
