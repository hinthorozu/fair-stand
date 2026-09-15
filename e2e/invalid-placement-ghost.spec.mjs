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
  if (!(await group.getAttribute('open'))) {
    await group.locator(':scope > summary').click();
  }
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('aria-disabled', 'false');
  return card;
}

async function previewCatalogDrag(page, itemKey, xRatio, yRatio) {
  await page.evaluate(({ key, xr, yr }) => {
    const card = document.querySelector(`.module-drag-card[data-module-key="${key}"]`);
    const viewport = document.querySelector('#viewport');
    if (!card || !viewport) throw new Error('katalog kartı veya viewport yok');
    const dataTransfer = new DataTransfer();
    card.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    }));
    const rect = viewport.getBoundingClientRect();
    viewport.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
      clientX: rect.left + rect.width * xr,
      clientY: rect.top + rect.height * yr,
    }));
  }, { key: itemKey, xr: xRatio, yr: yRatio });
}

function scenePlacementCanvas(page) {
  // Sahne canvas'ı #viewport'un doğrudan çocuğudur; ViewCube iç içe ikinci canvas'tır.
  return page.locator('#viewport > canvas');
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

test('upright_346_5 keeps a red ghost when short-up-joint snap misses', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createIslandStand(page, 'Invalid Ghost Upright');
  await openCatalogCard(page, 'upright_346_5');

  const viewport = page.locator('#viewport');
  await expect(viewport).toBeVisible();
  await previewCatalogDrag(page, 'upright_346_5', 0.52, 0.72);

  await expect(scenePlacementCanvas(page)).toHaveAttribute('data-placement-ghost', 'invalid');
  await expect(page.locator('body')).toContainText('Yalnız short-up, profil veya banko birleşimine yerleştirilir.');

  const box = await viewport.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.72);
  await page.mouse.up();

  const project = await saveAndReadProject(page);
  expect(project).not.toBeNull();
  expect(project.modules.some((moduleState) => moduleState.itemKey === 'upright_346_5')).toBe(false);
  expect(pageErrors).toEqual([]);
});

test('valid free-floor catalog preview keeps a green ghost', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createIslandStand(page, 'Valid Ghost Fridge');
  await openCatalogCard(page, 'MINI_FRIDGE_AVANTI');
  await previewCatalogDrag(page, 'MINI_FRIDGE_AVANTI', 0.52, 0.82);
  await expect(scenePlacementCanvas(page)).toHaveAttribute('data-placement-ghost', 'valid');
  expect(pageErrors).toEqual([]);
});
