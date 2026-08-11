import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const sourcePath = 'scripts/add-table-chair-set.mjs';
let source = fs.readFileSync(sourcePath, 'utf8');
source = source.replace(
  "surfaceId: \\`${moduleState.surface?.id}-\\${index}\\`",
  "surfaceId: moduleState.surface?.id + '-' + index",
);
const tempPath = '/tmp/add-table-chair-set-fixed.mjs';
fs.writeFileSync(tempPath, source);
await import(pathToFileURL(tempPath).href + '?v=' + Date.now());
