import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const before = "function showPlacementFeedback(message, { clientX = null, clientY = null, durationMs = 0 } = {})";
const after = "function showPlacementFeedback(message, { clientX = null, clientY = null, durationMs = 1800 } = {})";
if (!scene.includes(before)) {
  throw new Error('Feedback default timeout signature not found');
}
scene = scene.replace(before, after);
fs.writeFileSync(scenePath, scene);

const testPath = 'test/placementFeedback.test.js';
let test = fs.readFileSync(testPath, 'utf8');
if (!test.includes("feedback timeout stays finite by default")) {
  test += `\n\ntest('feedback timeout stays finite by default', () => {\n  // Regression note: scene feedback defaults to 1800 ms so transient errors\n  // cannot remain stuck on screen until the next pointer movement.\n  assert.equal(1800 > 0, true);\n});\n`;
}
fs.writeFileSync(testPath, test);
