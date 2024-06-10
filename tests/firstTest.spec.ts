import { test, expect } from "@playwright/test";
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

test("locatig child", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  await page.locator("nb-card").nth(4).getByRole("button").click();
});

test("find parent", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
});

test("fill basic form", async ({ page }) => {
  const basicForm = await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" });
  const passField = basicForm.getByRole("textbox", { name: "Password" });
  await basicForm
    .getByRole("textbox", { name: "Email" })
    .fill("email@email.com");
  await passField.fill("somepass");
  await basicForm.getByRole("button").click();

  await expect(passField).toHaveValue("somepass");
});

test("extracting values", async ({ page }) => {
  //single text value
  const basicForm = await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" });

  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");

  //all text values
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");

  //input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("Test@Test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("Test@Test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});
