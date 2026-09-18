import { test, expect } from '@playwright/test';

async function createNamedStand(page, standName, projectName, xCm, yCm) {
  await page.goto('/');
  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: standName }).click();
  await page.locator('#stand-size-x').fill(String(xCm));
  await page.locator('#stand-size-y').fill(String(yCm));
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

function wallIds(project) {
  return [...new Set(project.modules.map((moduleState) => moduleState.placement?.wallId).filter(Boolean))];
}

test('U Stand otomatik duvar reflow sağ duvarda 270 derece orientation üretir', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createNamedStand(page, 'U Stand', 'E2E U Reflow', 500, 400);

  const project = await saveAndReadProject(page);
  expect(project.stand.standType).toBe('u-stand');
  expect(project.modules.length).toBeGreaterThan(0);
  expect(project.modules.every((moduleState) => moduleState.type === 'flat-panel')).toBe(true);
  expect(wallIds(project).sort()).toEqual(['back', 'left', 'right']);

  const rightWall = project.modules.filter((moduleState) => moduleState.placement?.wallId === 'right');
  expect(rightWall.length).toBeGreaterThan(0);
  expect(rightWall.every((moduleState) => moduleState.placement.rotationZDeg === 270)).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('L Stand Sağ otomatik inşa sağ duvar orientation’ını 270 tutar', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createNamedStand(page, 'L Stand Sağ', 'E2E L Right Reflow', 500, 400);

  const project = await saveAndReadProject(page);
  expect(project.stand.standType).toBe('l-right');
  expect(wallIds(project).sort()).toEqual(['back', 'right']);
  const rightWall = project.modules.filter((moduleState) => moduleState.placement?.wallId === 'right');
  expect(rightWall.length).toBeGreaterThan(0);
  expect(rightWall.every((moduleState) => moduleState.placement.rotationZDeg === 270)).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('L Stand Sol otomatik inşa sol ve sırt duvar üretir', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createNamedStand(page, 'L Stand Sol', 'E2E L Left Reflow', 500, 400);

  const project = await saveAndReadProject(page);
  expect(project.stand.standType).toBe('l-left');
  expect(wallIds(project).sort()).toEqual(['back', 'left']);
  expect(page.locator('#viewport > canvas')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});
