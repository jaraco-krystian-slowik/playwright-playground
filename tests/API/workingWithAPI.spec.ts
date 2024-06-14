import { test, expect, request, APIRequestContext } from "@playwright/test";
import { table } from "console";
import tags from "./mock-data/tags.json";
import { AccessToken } from "./getAccessToken";
import { APPURL, CREDENTIALS } from "./.config";

test.beforeEach(async ({ page }) => {
  await page.route(`${APPURL.API}/tags`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.goto(APPURL.APP);

  await page.getByText("Sign in").click();
  await page.getByRole("textbox", { name: "Email" }).fill(CREDENTIALS.username);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(CREDENTIALS.password);
  await page.getByRole("button", { name: "Sign in" }).click();
});

test.describe("should mock data", () => {
  test("should mock article title and description", async ({ page }) => {
    await page.route(`${APPURL.API}/articles*`, async (route) => {
      const res = await route.fetch();
      const resBody = await res.json();

      resBody.articles[0].title = "MOCK DATA";
      resBody.articles[0].description = "MOCK DESCTIPTION";

      await route.fulfill({
        body: JSON.stringify(resBody),
      });
    });

    await page.getByText("Global Feed").click();
    const header = await page.locator(".navbar-brand").textContent();

    await expect(header).toEqual("conduit");
    await expect(page.locator("app-article-list h1").first()).toContainText(
      "MOCK DATA"
    );

    /* 
    playwright has a bug and MANDATORY NEEDS async locator assortion / page.timeout (in that case both, to be sure), otherwise it will crashes. I wasted there 30 mins. 
    */
    await page.waitForTimeout(200);
  });
});

test.describe("CRUD on article", () => {
  let bearerToken: string;

  const createArticle = async (request: APIRequestContext, title: string) => {
    const articlaResponse = await request.post(`${APPURL.API}/articles/`, {
      data: {
        article: {
          title: `${title}`,
          description: "test",
          body: "test",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${bearerToken}`,
      },
    });

    console.log("Created article with title: ", title);
    const resJson = await articlaResponse.json();
    console.log(resJson.article?.slug);
    return [articlaResponse, resJson.article?.slug];
  };

  test.beforeEach(async ({ page }) => {
    const accessToken = new AccessToken(
      CREDENTIALS.username,
      CREDENTIALS.password
    );
    bearerToken = await accessToken.getToken();
  });

  test("should add article via API and remove manually afterwards", async ({
    page,
    request,
  }) => {
    const articleTitle = Date.now().toString();
    const [articlaResponse] = await createArticle(request, articleTitle);
    await expect(articlaResponse.status()).toEqual(201);

    await page.getByText("Global Feed").click();
    await page.getByText(articleTitle).click();
    await page.getByRole("button", { name: "Delete Article" }).first().click();
    await page.getByText("Global Feed").click();

    const lastArticleInGlobalFeed = await page
      .locator("app-article-list h1")
      .first();

    await expect(lastArticleInGlobalFeed).not.toContainText(articleTitle);
  });

  test("should add article and remove via API", async ({ page, request }) => {
    const articleTitle = Date.now().toString();
    console.log("Expected title: ", articleTitle);
    const [articleResponse, slug] = await createArticle(request, articleTitle);
    await expect(articleResponse.status()).toEqual(201);

    await page.getByText("Global Feed").click();
    const lastArticleInGlobalFeed = await page
      .locator("app-article-list h1")
      .first();

    await expect(lastArticleInGlobalFeed).toContainText(articleTitle);

    const deleteArticle = await request.delete(
      `${APPURL.API}/articles/${slug}`,
      {
        headers: {
          Authorization: `Token ${bearerToken}`,
        },
      }
    );
    expect(deleteArticle.status()).toEqual(204);

    await page.getByText("Global Feed").click();
    await expect(lastArticleInGlobalFeed).not.toContainText(articleTitle);
  });
});
