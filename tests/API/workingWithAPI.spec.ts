import { test, expect } from "@playwright/test";
import { table } from "console";
import tags from "./mock-data/tags.json";

enum URL {
  APP = "https://conduit.bondaracademy.com/",
  API = "https://conduit-api.bondaracademy.com/api",
}

enum Credentials {
  username = "slowik",
  password = "slowik_pass",
}

test.beforeEach(async ({ page }) => {
  await page.route(`${URL.API}/tags`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.route(`${URL.API}/articles*`, async (route) => {
    const res = await route.fetch();
    const resBody = await res.json();

    resBody.articles[0].title = "KURWA";
    resBody.articles[0].description = "KURWA DESKTYPSZYN";

    await route.fulfill({
      body: JSON.stringify(resBody),
    });
  });
  await page.goto(URL.APP);
});

test.describe("should mockup data", () => {
  test("should has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Conduit/);
  });
  test("should has header", async ({ page }) => {
    const header = await page.locator(".navbar-brand").textContent();
    await expect(header).toEqual("conduit");
  });
  test("should ... API", async ({ page }) => {
    const header = await page.locator(".navbar-brand").textContent();
    await expect(header).toEqual("conduit");
    await expect(page.locator("app-article-list h1").first()).toContainText(
      "KURWA"
    );
    /* 
    playwright has a bug and MANDATORY NEEDS async locator assortion / page.timeout, otherwise it will crashes. I wasted there 30 mins. 
    */
    //await page.waitForTimeout(1000)
  });
});

test.describe("should mockup data", () => {});
