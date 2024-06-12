import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button triggering AJAX").click();
});

test("auto waiting", async ({ page }) => {
  const successElement = await page.getByText("Data loaded with AJAX");
  await successElement.click();

  const text = await successElement.textContent();
  expect(text).toEqual("Data loaded with AJAX get request.");
  await expect(successElement).toHaveText(
    "Data loaded with AJAX get request.",
    {
      timeout: 20000,
    }
  );
});

test("alternative waits", async ({ page }) => {
  const successElement = await page.locator(".bg-success");

  //wait for emelent
  //   await page.waitForSelector(".bg-success");

  //wait for response
  //   await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  //wait for network calls to be completed (not recommended)
  await page.waitForLoadState("networkidle");

  //wait for timeout
  // await page.waitForTimeout(16000);

  const text = await successElement.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});
