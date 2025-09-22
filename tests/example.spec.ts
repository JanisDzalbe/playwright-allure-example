import { test, expect } from '@playwright/test';
import * as allure from "allure-js-commons";

const BASE_URL = 'https://playwright.dev/';


test('has title', async ({ page }) => {
  await allure.tags("playwright-example", "title");

  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await allure.tags("playwright-example", "link");
  await page.goto(BASE_URL);

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('visual comparisons', async ({ page }) => {
  await allure.tags("playwright-example", "screenshot");
  // await page.goto(BASE_URL);

  // Change URL to force a visual diff
  await page.goto(`${BASE_URL}python/`);

  // Expect the page to have a screenshot that matches the baseline
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
});