import fs from 'node:fs';

function replaceOnce(path, from, to) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(from)) throw new Error(`Pattern not found in ${path}: ${from.slice(0, 80)}`);
  fs.writeFileSync(path, text.replace(from, to));
}

replaceOnce('index.html',
`              <option value="parke">Parke</option>`,
`              <option value="parke-acik">Parke Açık</option>\n              <option value="parke-sari">Parke Sarı</option>\n              <option value="parke-beton">Parke Beton</option>`);

replaceOnce('src/scene3d.js',
`const FLOOR_TYPES = Object.freeze(['karolaj', 'hali', 'parke']);`,
`const FLOOR_TYPES = Object.freeze(['karolaj', 'hali', 'parke-acik', 'parke-sari', 'parke-beton']);\nconst PARQUET_TYPES = new Set(['parke-acik', 'parke-sari', 'parke-beton']);\nconst PARQUET_COLORS = Object.freeze({\n  'parke-acik': '#e8dfd1',\n  'parke-sari': '#d5ad79',\n  'parke-beton': '#9b9993',\n});`);

replaceOnce('src/scene3d.js',
`} else if (floorType === 'parke') {\n      const plankDepthM = 0.20;\n      collectSurfaceCuts(depthM, plankDepthM).forEach((z) => {\n        positions.push(0, topY, z, widthM, topY, z);\n      });\n      let row = 0;\n      for (let z = 0; z < depthM - 0.000001; z += plankDepthM, row += 1) {\n        const rowEnd = Math.min(depthM, z + plankDepthM);\n        const offset = row % 2 === 0 ? 0 : 0.5;\n        for (let x = offset; x < widthM; x += 1) {\n          if (x <= 0.000001) continue;\n          positions.push(x, topY, z, x, topY, rowEnd);\n        }\n      }\n    }`,
`} else if (PARQUET_TYPES.has(floorType)) {\n      // Laminat/parke hissi: ince sıralar, uzun lameller ve 1/3 şaşırtma.\n      const plankDepthM = 0.16;\n      const plankLengthM = 1.40;\n      collectSurfaceCuts(depthM, plankDepthM).forEach((z) => {\n        positions.push(0, topY, z, widthM, topY, z);\n      });\n      let row = 0;\n      for (let z = 0; z < depthM - 0.000001; z += plankDepthM, row += 1) {\n        const rowEnd = Math.min(depthM, z + plankDepthM);\n        const offset = (row % 3) * (plankLengthM / 3);\n        for (let x = -offset; x < widthM; x += plankLengthM) {\n          const seamX = x + plankLengthM;\n          if (seamX <= 0.000001 || seamX >= widthM - 0.000001) continue;\n          positions.push(seamX, topY, z, seamX, topY, rowEnd);\n        }\n      }\n    }`);

replaceOnce('src/scene3d.js',
`      color: floorType === 'parke' ? 0x6f4a2d : 0x9aa0a6,\n      transparent: true,\n      opacity: floorType === 'parke' ? 0.55 : 0.68,`,
`      color: PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6,\n      transparent: true,\n      opacity: PARQUET_TYPES.has(floorType) ? 0.34 : 0.68,`);

replaceOnce('src/scene3d.js',
`} else if (resolved === 'parke') {\n      material.color.set(0xb98252);\n      material.roughness = 0.72;\n      material.metalness = 0;`,
`} else if (PARQUET_TYPES.has(resolved)) {\n      material.color.set(PARQUET_COLORS[resolved]);\n      material.roughness = 0.78;\n      material.metalness = 0;`);

console.log('Parquet variants applied');
