import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Pattern not found: ${label}`);
  return text.replace(from, to);
}

// scene3d.js
{
  const path = 'src/scene3d.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "  let currentFloorType = 'karolaj';\n",
    "  let currentFloorType = 'karolaj';\n  let currentFloorColor = '#e9edf1';\n",
    'scene currentFloorColor',
  );

  text = replaceOnce(
    text,
    "    } else {\n      material.color.set(FLOOR_COLOR);\n      material.roughness = 0.92;\n      material.metalness = 0;\n    }\n",
    "    } else {\n      material.color.set(currentFloorColor);\n      material.roughness = 0.92;\n      material.metalness = 0;\n    }\n",
    'karolaj material color',
  );

  text = replaceOnce(
    text,
    "    return resolved;\n  }\n\n  function collectGridValues",
    "    if (stageLayout) stageLayout.floorType = resolved;\n    return resolved;\n  }\n\n  function setFloorColor(color) {\n    const normalized = String(color ?? '').trim();\n    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return currentFloorColor;\n    currentFloorColor = normalized.toLowerCase();\n    if (stageLayout) stageLayout.floorColor = currentFloorColor;\n    if (currentFloorType === 'karolaj') {\n      activeFloor.material.color.set(currentFloorColor);\n      activeFloor.material.needsUpdate = true;\n    }\n    return currentFloorColor;\n  }\n\n  function collectGridValues",
    'setFloorColor function',
  );

  text = replaceOnce(
    text,
    "      floorType: currentFloorType,\n    };",
    "      floorType: currentFloorType,\n      floorColor: currentFloorColor,\n    };",
    'stage floorColor state',
  );

  text = replaceOnce(
    text,
    "    setFloorType,\n    buildWall,",
    "    setFloorType,\n    setFloorColor,\n    buildWall,",
    'export setFloorColor',
  );

  fs.writeFileSync(path, text);
}

// index.html
{
  const path = 'index.html';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    `          <label class="stand-size-field" for="floor-type">\n            <span>Zemin Kaplaması</span>\n            <select id="floor-type">\n              <option value="karolaj">Karolaj · 100 × 100 cm</option>\n              <option value="hali">Halı</option>\n              <option value="parke">Parke</option>\n            </select>\n          </label>\n`,
    `          <label class="stand-size-field" for="floor-type">\n            <span>Zemin Kaplaması</span>\n            <select id="floor-type">\n              <option value="karolaj">Karolaj · 100 × 100 cm</option>\n              <option value="hali">Halı</option>\n              <option value="parke">Parke</option>\n            </select>\n          </label>\n\n          <label id="floor-color-field" class="stand-size-field" for="floor-color">\n            <span>Karolaj Rengi</span>\n            <input id="floor-color" type="color" value="#e9edf1" />\n          </label>\n`,
    'floor color control',
  );
  fs.writeFileSync(path, text);
}

// main.js
{
  const path = 'src/main.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "const floorTypeSelect = document.querySelector('#floor-type');\n",
    "const floorTypeSelect = document.querySelector('#floor-type');\nconst floorColorField = document.querySelector('#floor-color-field');\nconst floorColorInput = document.querySelector('#floor-color');\n",
    'floor color DOM refs',
  );

  text = replaceOnce(
    text,
    "  currentStand = { ...setup, floorType: floorTypeSelect.value };\n  scene3d.setFloorType(floorTypeSelect.value);\n",
    "  currentStand = { ...setup, floorType: floorTypeSelect.value, floorColor: floorColorInput.value };\n  scene3d.setFloorType(floorTypeSelect.value);\n  if (floorTypeSelect.value === 'karolaj') scene3d.setFloorColor(floorColorInput.value);\n",
    'create stage floor color',
  );

  text = replaceOnce(
    text,
    "floorTypeSelect.addEventListener('change', () => {\n  if (!currentStand) return;\n  currentStand = { ...currentStand, floorType: floorTypeSelect.value };\n  scene3d.setFloorType(floorTypeSelect.value);\n});\n",
    "function syncFloorColorVisibility() {\n  floorColorField.hidden = floorTypeSelect.value !== 'karolaj';\n}\n\nsyncFloorColorVisibility();\n\nfloorTypeSelect.addEventListener('change', () => {\n  syncFloorColorVisibility();\n  if (!currentStand) return;\n  currentStand = { ...currentStand, floorType: floorTypeSelect.value };\n  scene3d.setFloorType(floorTypeSelect.value);\n  if (floorTypeSelect.value === 'karolaj') {\n    scene3d.setFloorColor(floorColorInput.value);\n    currentStand = { ...currentStand, floorColor: floorColorInput.value };\n  }\n});\n\nfloorColorInput.addEventListener('input', () => {\n  if (floorTypeSelect.value !== 'karolaj') return;\n  if (currentStand) currentStand = { ...currentStand, floorColor: floorColorInput.value };\n  scene3d.setFloorColor(floorColorInput.value);\n});\n",
    'floor color listeners',
  );

  fs.writeFileSync(path, text);
}

// ROADMAP.md — technical decisions only, no false completion status.
{
  const path = 'ROADMAP.md';
  let text = fs.readFileSync(path, 'utf8');
  const marker = '## FAZ 3 — Zemin teknik kararları';
  if (!text.includes(marker)) {
    text += `\n\n## FAZ 3 — Zemin teknik kararları\n\n- Aktif stand platformu **daima 5 cm yüksekliğinde** kalacaktır; zemin tipi, renk ve texture değişiklikleri bu kotu değiştirmeyecektir.\n- **Karolaj:** gerçek ölçekte 100 × 100 cm; aktif alan sonunda kalan ölçü otomatik kırpılır (ör. 450 cm = 100 + 100 + 100 + 100 + 50). Karolaj color picker ile boyanabilir, derz/grid çizgileri renk değişiminde görünür kalır.\n- **Parke:** serbest boyama yerine üç hazır doku seçeneği kullanılacaktır: Açık/Kirli Beyaz, Açık Naturel-Sarı ve Grimsi. Referans görsellerdeki yazı, ölçü, ok, logo veya watermark kullanılmayacaktır; yalnızca renk ve yüzey karakteri referans alınacaktır.\n- **Halı / Halıfleks:** rip halı/halıfleks karakterinde ince dokulu texture kullanılacaktır. Texture sabit kalırken color picker üzerinden renk değiştirilebilecek; renk değişimi doku detayını yok etmeyecektir.\n`;
    fs.writeFileSync(path, text);
  }
}

console.log('Step 1: karolaj color + FAZ 3 floor decisions patched.');
