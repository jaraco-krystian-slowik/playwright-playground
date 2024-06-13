import { Locator, Page } from "playwright";

export class NavigationPage {
  readonly formLayoutsMenuItem: Locator;
  readonly datePickerMenuItem: Locator;
  readonly smartTableMenuItem: Locator;
  readonly toastrPageMenuItem: Locator;
  readonly tooltipPageMenuItem: Locator;

  constructor(readonly page: Page) {
    this.formLayoutsMenuItem = page.getByText("Form layouts");
    this.datePickerMenuItem = page.getByText("Datepicker");
    this.smartTableMenuItem = page.getByText("Smart Table");
    this.toastrPageMenuItem = page.getByText("Toastr");
    this.tooltipPageMenuItem = page.getByText("Tooltip");
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.formLayoutsMenuItem.click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.datePickerMenuItem.click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.smartTableMenuItem.click();
  }
  async toastPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.toastrPageMenuItem.click();
  }
  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.tooltipPageMenuItem.click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") await groupMenuItem.click();
  }
}
