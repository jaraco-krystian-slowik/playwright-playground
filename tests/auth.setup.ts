import { test as setup } from "@playwright/test";
import { APPURL, CREDENTIALS } from "./API/.config";

const authFile = ".auth/user.json";

setup("should authenticate", async ({ page }) => {
  await page.goto(APPURL.APP);

  await page.getByText("Sign in").click();
  await page.getByRole("textbox", { name: "Email" }).fill(CREDENTIALS.username);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(CREDENTIALS.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForResponse(`${APPURL.API}/users/login`);

  await page.context().storageState({ path: authFile });
});
