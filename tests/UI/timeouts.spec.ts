import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button triggering AJAX").click();
});

test("timeouts", async ({ page }) => {
  //   test.setTimeout(10000);
  test.slow;
  const successElement = await page.locator(".bg-success");

  await successElement.click();
  await successElement.click({ timeout: 10000 }); //multiplied x3
});
