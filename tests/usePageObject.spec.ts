import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test("navigate to form page", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutsPage();
  await page.waitForTimeout(400);
  await navigateTo.datepickerPage();
  await page.waitForTimeout(400);
  await navigateTo.smartTablePage();
  await page.waitForTimeout(400);
  await navigateTo.toastPage();
  await page.waitForTimeout(400);
  await navigateTo.tooltipPage();
});
