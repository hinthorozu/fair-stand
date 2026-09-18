import { test, expect } from '@playwright/test';

async function createIslandStand(page, projectName) {
  await page.goto('/');
  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: 'Ada Stand' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  const projectNameInput = page.locator('form input[name="projectName"]');
  await expect(projectNameInput).toBeVisible();
  await projectNameInput.fill(projectName);
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();
}

async function openCatalogCard(page, itemKey) {
  const openCatalogButton = page.locator('#open-module-catalog');
  const modulePanel = page.locator('details', { has: openCatalogButton });
  await modulePanel.locator(':scope > summary').click();
  const card = page.locator(`.module-drag-card[data-module-key="${itemKey}"]`);
  const group = page.locator('.module-drag-group', { has: card });
  if (!(await group.evaluate((el) => el.open))) {
    await group.locator(':scope > summary').click();
  }
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  return card;
}

async function saveAndReadProject(page) {
  const saveButton = page.locator('#save-project');
  await saveButton.click();
  await expect(page.locator('#project-status')).toContainText('Kaydedildi:');
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('fair-stand-configurator', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const projects = await new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const request = tx.objectStore('projects').getAll();
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return projects.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0] ?? null;
  });
}

test('yerleşik free prop canvas sürüklemede taşınır ve 10 cm grid’e oturur', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createIslandStand(page, 'E2E Module Move');

  const card = await openCatalogCard(page, 'MINI_FRIDGE_AVANTI');
  const viewport = page.locator('#viewport');
  const box = await viewport.boundingBox();
  expect(box).not.toBeNull();
  const start = {
    x: Math.round(box.width * 0.52),
    y: Math.round(box.height * 0.82),
  };
  await card.dragTo(viewport, { targetPosition: start });

  const before = await saveAndReadProject(page);
  const fridgeBefore = before.modules.find((moduleState) => moduleState.itemKey === 'MINI_FRIDGE_AVANTI');
  expect(fridgeBefore).toBeTruthy();
  expect(fridgeBefore.placement.wallId).toBe('free');

  const canvas = page.locator('#viewport > canvas');
  await expect(canvas).toBeVisible();
  const originX = box.x + start.x;
  const originY = box.y + start.y;
  await page.mouse.move(originX, originY);
  await page.mouse.down();
  await page.mouse.move(box.x + Math.round(box.width * 0.68), originY, { steps: 8 });
  await page.mouse.up();

  const after = await saveAndReadProject(page);
  const fridgeAfter = after.modules.find((moduleState) => moduleState.id === fridgeBefore.id);
  expect(fridgeAfter).toBeTruthy();
  expect(fridgeAfter.placement.wallId).toBe('free');
  expect(fridgeAfter.placement.xCm).not.toBe(fridgeBefore.placement.xCm);
  const widthCm = Number(fridgeAfter.widthCm);
  const depthCm = Number(fridgeAfter.depthCm);
  const xMinCm = Number(fridgeAfter.placement.xCm);
  const yCenterCm = Number(fridgeAfter.placement.yCm);
  for (const edgeCm of [xMinCm, xMinCm + widthCm, yCenterCm - depthCm / 2, yCenterCm + depthCm / 2]) {
    expect(edgeCm % 10).toBe(0);
  }
  expect(pageErrors).toEqual([]);
});
