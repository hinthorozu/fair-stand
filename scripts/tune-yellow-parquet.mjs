import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const from = "  'parke-sari': '#d5ad79',";
const to = "  'parke-sari': '#ddb24f',";

if (!source.includes(to)) {
  if (!source.includes(from)) throw new Error('Yellow parquet color anchor not found');
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
}
