import { Page } from "playwright";

export class NavigationPage {
  constructor(readonly page: Page) {}

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form layouts").click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }
  async toastPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
  }
  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");

    await this.page.getByText("Toastr").click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") await groupMenuItem.click();
  }
}
