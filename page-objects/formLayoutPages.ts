import { Locator, Page } from "playwright";

export class FormLayoutsPages {
  constructor(readonly page: Page) {}
  /**
   * This method will fill the "The Grid Form" on "Forms" > "Form Layout" page
   * @param email
   * @param password
   * @param optionText - should be visible text of radio button to choose
   */
  async submitUsingTheGridFormWithCredentialsAndSelectOptions(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "using the grid",
    });

    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);

    await usingTheGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);

    await usingTheGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true });

    await usingTheGridForm.getByRole("button").click();
  }
  /**
   * This method will fill the "Inline Form" on "Forms" > "Form Layout" page
   * @param name
   * @param email
   * @param isCheckboxChecked - determinates the "Remember Me" checkbox state
   */
  async submitInlineFormWithCredentialsAndSelectOptions(
    name: string,
    email: string,
    isCheckboxChecked: boolean
  ) {
    const usingInlineForm = this.page.locator("nb-card", {
      hasText: "inline fo",
    });

    await usingInlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await usingInlineForm.getByRole("textbox", { name: "Email" }).fill(email);

    isCheckboxChecked &&
      (await usingInlineForm.getByRole("checkbox").check({ force: true }));

    await usingInlineForm.getByRole("button").click();
  }
}
