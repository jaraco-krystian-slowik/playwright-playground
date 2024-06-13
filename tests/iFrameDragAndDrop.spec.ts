import { test, expect } from "@playwright/test";

test("drag and drop within an iframe", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  //consent
  const consentBox = await page.locator(".fc-consent-root");
  await consentBox.locator("p.fc-button-label").getByText("Consent").click();

  // const frame = page
  //   .frameLocator('[rel~="iFrame"]')
  //   .frameLocator('[title="Photo Manager"]');

  // await frame.locator("li", { hasText: "High Tatras 2" }).hover();

  // await page.mouse.down();
  // await frame.locator("#trash").hover();
  // await page.mouse.up();

  // const verificationLocator = frame.locator("#trash li h5");
  // await expect(verificationLocator).toHaveText([
  //   "High Tatras 2",
  //   "High Tatras 4",
  // ]);
});
