import { test, expect } from '@playwright/test';

test('healthcheck', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('heading', { name: 'Chosen by companies and open' })).toBeVisible();
  await expect(page.locator('h2')).toContainText('Chosen by companies and open source projects');
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
});
