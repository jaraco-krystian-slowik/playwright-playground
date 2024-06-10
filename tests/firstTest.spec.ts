import { test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByText("Forms").click();
  await page.getByText("Form La").click();
});

test("locator syntax rules", async ({ page }) => {
  //by tag
  await page.locator("input").first().click();
  //by ID
  await page.locator("#inputEmail1").click();

  //by class
  page.locator(".shape-rectangle");

  //by attr
  page.locator('[placeholder="Email"]');

  //by attr
  page.locator('[class="xD ddd"]');

  //by combine selectors
  page.locator('input[placeholder="Email"]');

  //by XPath [not recommended]
  page.locator('//*[@id="inputEmail1"]');

  //by partial text match
  page.locator(':text("Using")');

  //by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("user facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  await page.getByText("Using the Grid").click();
  await page.getByTestId("SignIn").click();
  await page.getByTitle("IoT Dashboard").click();
});
