import fs from 'node:fs';

const path = 'test/modulePlacement.test.js';
let source = fs.readFileSync(path, 'utf8');
const before = `  const cases = [
    [0, 300, 400],
    [90, 300, 200],
    [180, 200, 300],
    [270, 300, 400],
  ];`;
const after = `  const cases = [
    [0, 400, 300],
    [90, 200, 300],
    [180, 200, 300],
    [270, 400, 300],
  ];`;
if (!source.includes(before)) throw new Error('Rotation regression table not found');
source = source.replace(before, after);
fs.writeFileSync(path, source);
