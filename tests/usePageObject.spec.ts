import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPages } from "../page-objects/formLayoutPages";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test("should navigate to all menu page", async ({ page }) => {
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

test("should fill Using The Grid and Inline Form on Form Layouts page  (parametrized methods)", async ({
  page,
}) => {
  const navigateTo = new NavigationPage(page);
  const onFormLayoutPage = new FormLayoutsPages(page);

  await navigateTo.formLayoutsPage();
  await onFormLayoutPage.submitUsingTheGridFormWithCredentialsAndSelectOptions(
    "Email@test.com",
    "Password123",
    "Option 2"
  );

  await onFormLayoutPage.submitInlineFormWithCredentialsAndSelectOptions(
    "some name",
    "someemail@o2.pl",
    false
  );
});
