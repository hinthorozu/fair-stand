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

async function saveAndReadProject(page) {
  const saveButton = page.locator('#save-project');
  await saveButton.click();
  await expect(saveButton).toBeEnabled();

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

test('mini fridge uses the 50x50x66 nominal footprint in the real catalog drag flow', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createIslandStand(page, 'Mini Fridge 50x50');

  const openCatalogButton = page.locator('#open-module-catalog');
  const modulePanel = page.locator('details', { has: openCatalogButton });
  await modulePanel.locator(':scope > summary').click();

  const fridgeCard = page.locator('.module-drag-card[data-module-key="DEPOT_MINI_FRIDGE_AVANTI"]');
  const fridgeGroup = page.locator('.module-drag-group', { has: fridgeCard });
  if (!(await fridgeGroup.getAttribute('open'))) {
    await fridgeGroup.locator(':scope > summary').click();
  }

  await expect(fridgeCard).toBeVisible();
  await expect(fridgeCard).toHaveAttribute('aria-disabled', 'false');

  const viewport = page.locator('#viewport');
  await expect(viewport).toBeVisible();
  const viewportBox = await viewport.boundingBox();
  expect(viewportBox).not.toBeNull();
  await fridgeCard.dragTo(viewport, {
    targetPosition: {
      x: Math.round(viewportBox.width * 0.52),
      y: Math.round(viewportBox.height * 0.82),
    },
  });

  const project = await saveAndReadProject(page);
  expect(project).not.toBeNull();
  const fridge = project.modules.find((moduleState) => moduleState.type === 'mini-fridge');
  expect(fridge).toBeTruthy();
  expect([fridge.widthCm, fridge.depthCm, fridge.heightCm]).toEqual([50, 50, 66]);
  expect(fridge.placement.wallId).toBe('free');
  expect(Number(fridge.placement.xCm) % 10).toBe(0);
  expect(Number(fridge.placement.yCm) % 10).toBe(0);
  expect(pageErrors).toEqual([]);
});
