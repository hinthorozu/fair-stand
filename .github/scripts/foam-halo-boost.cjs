const fs = require('fs');
const p = 'src/scene3d.js';
let s = fs.readFileSync(p, 'utf8');
const oldBlock = `      const haloLayers = [\n        { scale: 1.018, opacity: 0.44, z: -Math.max(0.002, wallGapM * 0.28) },\n        { scale: 1.045, opacity: 0.22, z: -Math.max(0.003, wallGapM * 0.52) },\n        { scale: 1.085, opacity: 0.09, z: -Math.max(0.004, wallGapM * 0.78) },\n      ];`;
const newBlock = `      const haloLayers = [\n        { scale: 1.016, opacity: 0.78, z: -Math.max(0.002, wallGapM * 0.22) },\n        { scale: 1.040, opacity: 0.46, z: -Math.max(0.003, wallGapM * 0.45) },\n        { scale: 1.080, opacity: 0.24, z: -Math.max(0.004, wallGapM * 0.68) },\n        { scale: 1.135, opacity: 0.10, z: -Math.max(0.005, wallGapM * 0.90) },\n      ];`;
if (!s.includes(oldBlock)) throw new Error('halo block not found');
s = s.replace(oldBlock, newBlock);
fs.writeFileSync(p, s);
