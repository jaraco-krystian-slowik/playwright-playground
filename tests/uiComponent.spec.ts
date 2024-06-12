import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe("Form layout", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form layouts").click();
  });

  test("should manage input fields correctly", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "using the grid" })
      .getByRole("textbox", { name: "email" });

    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test@test2.com", {
      delay: 100,
    });

    //generic assortion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test@test2.com");

    //locator assortion
    await expect(usingTheGridEmailInput).toHaveValue("test@test2.com");
  });

  test("should toggle radio buttons correctly", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "using the grid",
    });

    // await usingTheGridForm.getByLabel("Option 1").check({ force: true }); //not work as it's visualy-hidden
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    //generic assortion
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();

    expect(radioStatus).toBeTruthy();

    //!locator assortion awaiting expect
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });

    //!generic assortion
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test.describe("checkboxes", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
  });

  test("should toggle checkboxes correctly", async ({ page }) => {
    await page.getByText("Toastr").click();

    // metoda dla debili
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .click({ force: true });

    //check determinates value
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });

    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .check({ force: true });

    const allCheckBoxes = await page.getByRole("checkbox");

    //select
    for (const checkbox of await allCheckBoxes.all()) {
      await checkbox.check({ force: true });
      expect(await checkbox.isChecked()).toBeTruthy();
    }
    //un-select
    for (const checkbox of await allCheckBoxes.all()) {
      await checkbox.uncheck({ force: true });
      expect(await checkbox.isChecked()).toBeFalsy();
    }
  });
});

test.describe("dropdown & menu", async () => {
  test("should handle dropdown selections correctly", async ({ page }) => {
    // const modeButton = await page.getByRole("button", { name: "Light" });
    const modeButton = await page.locator("ngx-header nb-select");
    await modeButton.click();

    const optionList = await page.locator("nb-option-list nb-option");

    await expect(optionList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);

    await optionList.filter({ hasText: "Cosmic" }).click();

    const header = await page.locator("nb-layout-header");
    // optionList.getByText("Cosmic").click();
    await expect(page.locator("body")).toHaveClass(/nb-theme-cosmic/);
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const themes = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };
    await modeButton.click();

    for (const theme in themes) {
      await optionList.filter({ hasText: theme }).click();
      await expect(header).toHaveCSS("background-color", themes[theme]);
      if (theme !== "Corporate") await modeButton.click();
    }
  });
});
test.describe("tooltips", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();

    await page.getByText("Tooltip").click();
  });
  // test("alerts", async ({ page }) => {
  //   const tableTrashIcon = await page
  //     .getByRole("table")
  //     .locator("tr", { hasText: "mdo@gmail.com" })
  //     .locator(".nb-trash");

  //   page.on("dialog", (d) => {
  //     expect(d.message()).toEqual("Are you sure you want to delete?");
  //     d.accept();
  //   });

  //   await tableTrashIcon.click();

  //   await expect(page.locator("table tr").first()).not.toHaveText(
  //     "mdo@gmail.com"
  //   );
  // });
  test("should display tooltips correctly", async ({ page }) => {
    const tooltipCard = await page.locator("nb-card", {
      hasText: "Tooltip placements",
    });

    await tooltipCard.getByRole("button", { name: "Top" }).hover();
    //page.getByRole('tooltip) works if tooltip role is created

    const tooltip = await page.locator("nb-tooltip").textContent();
    expect(tooltip).toEqual("This is a tooltip");
  });
});
test.describe("dialog / smart table", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();
  });

  test("table check / update age / change the page / update email correctly", async ({
    page,
  }) => {
    // get row by any text innit
    const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
    await targetRow.locator(".nb-edit").click();

    await page.locator("input-editor").getByPlaceholder("Age").fill("35");
    await page.locator(".nb-checkmark").click();
    await expect(targetRow.locator("td").nth(6)).toHaveText("35");

    //pagination

    await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
    const targetRowByIdColumn = page
      .getByRole("row", { name: "11" })
      .filter({ has: page.locator("td").nth(1).getByText("11") });
    await targetRowByIdColumn.locator(".nb-edit").click();

    await page
      .locator("input-editor")
      .getByPlaceholder("E-mail")
      .fill("test@test.com");
    await page.locator(".nb-checkmark").click();

    await expect(targetRowByIdColumn.locator("td").nth(5)).toHaveText(
      "test@test.com"
    );
  });
  test("should filter table by age correctly", async ({ page }) => {
    const ages = ["20", "30", "40", "200"];

    for (let age of ages) {
      await page.locator("input-filter").getByPlaceholder("Age").clear();
      await page.locator("input-filter").getByPlaceholder("Age").fill(age);
      await page.waitForTimeout(300);
      const ageRows = page.locator("tbody tr");

      for (let row of await ageRows.all()) {
        const cellValue = await row.locator("td").last().textContent();
        age === "200"
          ? expect(cellValue).toEqual(" No data found ")
          : expect(cellValue).toEqual(age);
      }
    }
  });
});

test.describe("datepicker", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();
  });

  test("should select date from current month correctly", async ({ page }) => {
    const datePickerForm = await page
      .locator("nb-card-body")
      .getByPlaceholder("Form Picker");

    await datePickerForm.click();
    await page
      .locator("nb-calendar-day-cell:not(.bounding-month)") // exclude past month by class
      .getByText("30", { exact: true }) // avoid duplicates (eg 1, 11, 13, 21)
      .click();
    await expect(datePickerForm).toHaveValue(/30,/);
  });

  test("should select date of tomorrow correctly", async ({ page }) => {
    const datePickerForm = await page
      .locator("nb-card-body")
      .getByPlaceholder("Form Picker");

    await datePickerForm.click();

    let date = new Date();
    date.setDate(date.getDate() + 1);
    const expectedDate = date.getDate().toString();

    const expectedMonthShort = date.toLocaleString("en-US", { month: "short" });
    const expectedYear = date.getFullYear();

    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;
    await page
      .locator("nb-calendar-day-cell:not(.bounding-month)") // exclude past month by class
      .getByText(expectedDate, { exact: true }) // avoid duplicates (eg 1, 11, 13, 21)
      .click();
    await expect(datePickerForm).toHaveValue(dateToAssert);
  });
  test("should select date of futute month correctly", async ({ page }) => {
    const datePickerForm = await page
      .locator("nb-card-body")
      .getByPlaceholder("Form Picker");

    await datePickerForm.click();

    let date = new Date();
    date.setDate(date.getDate() + 100); // 100 days forward
    const expectedDate = date.getDate().toString();

    const expectedMonthShort = date.toLocaleString("en-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("en-US", { month: "long" });
    const expectedYear = date.getFullYear();

    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let pickerMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

    while (!pickerMonthAndYear?.includes(expectedMonthAndYear)) {
      // navigate to month
      await page
        .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        .click();
      pickerMonthAndYear = await page
        .locator("nb-calendar-view-mode")
        .textContent();
    }

    await page
      .locator("nb-calendar-day-cell:not(.bounding-month)") // exclude past month by class
      .getByText(expectedDate, { exact: true }) // avoid duplicates (eg 1, 11, 13, 21)
      .click();
    await expect(datePickerForm).toHaveValue(dateToAssert);
  });
});

test.describe("should change temperature correctly", () => {
  test("should change xy manually", async ({ page }) => {
    const tempGauge = await page.locator('[tabtitle="Temperature"] circle');
    await tempGauge.evaluate((node) => {
      node.setAttribute("cx", "232.63");
      node.setAttribute("cy", "232.63");
    });
    await tempGauge.click();
    const temperatureValue = await page.locator(".value.temperature");
    await expect(temperatureValue).toHaveText("30");
  });
  test("should change xy using mouse movement", async ({ page }) => {
    const tempBox = await page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger'
    );
    await tempBox.scrollIntoViewIfNeeded();

    const boundedBox = await tempBox.boundingBox();
    if (boundedBox) {
      const x = boundedBox.x + boundedBox.width / 2;
      const y = boundedBox.y + boundedBox.height / 2;

      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 200, y);
      await page.mouse.move(x + 100, y + 100);
      await page.mouse.up();
      const temperatureValue = await page.locator(".value.temperature");
      await expect(temperatureValue).toHaveText("30");
    }
  });
});
