import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

const feedbackPath = 'src/placementFeedback.js';
let feedback = fs.readFileSync(feedbackPath, 'utf8');
if (!feedback.includes('export function hasPlacementFeedbackPointer')) {
  feedback += `\nexport function hasPlacementFeedbackPointer(clientX, clientY) {\n  return clientX !== null\n    && clientX !== undefined\n    && clientY !== null\n    && clientY !== undefined\n    && Number.isFinite(Number(clientX))\n    && Number.isFinite(Number(clientY));\n}\n`;
}
fs.writeFileSync(feedbackPath, feedback);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
scene = replaceOnce(
  scene,
  "import { formatPlacementFeedbackMessage } from './placementFeedback.js';",
  "import { formatPlacementFeedbackMessage, hasPlacementFeedbackPointer } from './placementFeedback.js';",
  'feedback helper import',
);
scene = replaceOnce(
  scene,
  "    const hasPointer = Number.isFinite(Number(clientX)) && Number.isFinite(Number(clientY));\n    const rawX = hasPointer ? Number(clientX) + 18 : rect.left + rect.width / 2;\n    const rawY = hasPointer ? Number(clientY) + 18 : rect.top + 18;",
  "    const hasPointer = hasPlacementFeedbackPointer(clientX, clientY);\n    const rawX = hasPointer ? Number(clientX) + 18 : rect.left + rect.width / 2;\n    const rawY = hasPointer ? Number(clientY) + 18 : rect.top + 72;",
  'feedback pointer detection',
);
fs.writeFileSync(scenePath, scene);

const testPath = 'test/placementFeedback.test.js';
let test = fs.readFileSync(testPath, 'utf8');
test = replaceOnce(
  test,
  "import { formatPlacementFeedbackMessage } from '../src/placementFeedback.js';",
  "import { formatPlacementFeedbackMessage, hasPlacementFeedbackPointer } from '../src/placementFeedback.js';",
  'feedback test import',
);
if (!test.includes("treats null coordinates as no pointer")) {
  test += `\n\ntest('treats null coordinates as no pointer', () => {\n  assert.equal(hasPlacementFeedbackPointer(null, null), false);\n  assert.equal(hasPlacementFeedbackPointer(undefined, undefined), false);\n  assert.equal(hasPlacementFeedbackPointer(null, 120), false);\n});\n\ntest('accepts real pointer coordinates including zero', () => {\n  assert.equal(hasPlacementFeedbackPointer(0, 0), true);\n  assert.equal(hasPlacementFeedbackPointer(320, 180), true);\n});\n`;
}
fs.writeFileSync(testPath, test);
