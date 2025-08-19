import { test } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

test.beforeAll(() => {
  mkdirSync('screenshots', { recursive: true });
});
test('stage screenshot', async ({ page }) => {
  await page.goto('/'); // your router should redirect to /stage
  await page.waitForLoadState('networkidle');
  // small delay to let CSS effects settle
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/stage.png', fullPage: true });
});

test('backstage screenshot', async ({ page }) => {
  await page.goto('/backstage');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/backstage.png', fullPage: true });
});
