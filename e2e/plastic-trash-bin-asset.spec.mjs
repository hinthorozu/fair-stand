import { test, expect } from '@playwright/test';

test('plastic trash bin GLB asset is served by the application', async ({ request }) => {
  const response = await request.get('/models/plastic_trash_bin.glb');
  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.length).toBeGreaterThanOrEqual(12);
  expect(body.subarray(0, 4).toString('utf8')).toBe('glTF');
  expect(body.readUInt32LE(4)).toBe(2);
  expect(body.readUInt32LE(8)).toBe(body.length);
});
