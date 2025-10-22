import { test, expect } from '@playwright/test';

test('login page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // assert login input
  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();

  // assert login button
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await expect(page.locator('[data-test="login-button"]')).toContainText('Login');

  // assert credentials info
  await expect(page.locator('[data-test="login-credentials"]')).toBeVisible();
  await expect(page.locator('[data-test="login-credentials"]')).toContainText('standard_user');
  await expect(page.locator('[data-test="login-password"]')).toBeVisible();
  await expect(page.locator('[data-test="login-password"]')).toContainText('secret_sauce');
});
