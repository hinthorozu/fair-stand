import { test, expect } from '@playwright/test';
import JSZip from 'jszip';

test('geçersiz modül tipli ZIP içe aktarılmaz', async ({ page }) => {
  await page.goto('/');

  const zip = new JSZip();
  zip.file('project.json', JSON.stringify({
    archiveVersion: 1,
    project: {
      id: 'e2e-invalid-import',
      modules: [{ id: 'm1', type: 'not-a-module' }],
    },
  }));
  const buffer = await zip.generateAsync({ type: 'nodebuffer' });

  await page.locator('#import-project-file').setInputFiles({
    name: 'invalid-project.zip',
    mimeType: 'application/zip',
    buffer,
  });

  await expect(page.locator('#project-status')).toContainText('Proje ZIP içe aktarılamadı');
  await expect(page.locator('#project-status')).toContainText('Proje modül tipi geçersiz');
});
