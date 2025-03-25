import { Page, expect } from "@playwright/test";
import { getDateButtonLabel } from "../utils/dateHelper";

export class MainSearchPage {
  private searchInputString = this.page.getByTestId("structured-search-input-field-query");
  private checkInDatePickerButton = this.page.getByRole("button", { name: /Check in/ });
  private addAdultButton = this.page.getByTestId("stepper-adults-increase-button");
  private addKidsButton = this.page.getByTestId("stepper-children-increase-button");
  private mainSearchButton = this.page.getByTestId("structured-search-input-search-button");

  private getDateButton(date: string) {
    return this.page.getByRole("button", { name: date });
  }

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://www.airbnb.com/");
    await this.page.waitForLoadState("load");
  }

  async searchDestination(destination: string) {
    await this.searchInputString.click();
    await this.searchInputString.fill(destination);
    await this.page.getByTestId("option-0").click();
  }

  async selectDates(checkinDay: number, checkoutDay: number) {
    const checkinDate = getDateButtonLabel(checkinDay);
    console.log(checkinDate);
    const checkoutDate = getDateButtonLabel(checkoutDay);
    console.log(checkoutDate);
    const checkInDateButton = await this.getDateButton(checkinDate);
    const isCalanderOpen = await checkInDateButton.isVisible().catch(() => false);
    if (!isCalanderOpen) {
      await this.checkInDatePickerButton.click();
    }
    const checkinDateSelectionButton = await this.page.getByRole("button", { name: checkinDate }).isVisible();
    if (checkinDateSelectionButton) {
      await this.getDateButton(checkinDate).click();
    }
    const checkoutDateSelectionButton = await this.page.getByRole("button", { name: checkoutDate }).isVisible();
    if (checkoutDateSelectionButton) {
      await this.getDateButton(checkoutDate).click();
    }
  }

  async setGuests(adults: number, kids: number) {
    await this.page.getByTestId("structured-search-input-field-guests-button").click();
    for (let i = 0; i < adults; i++) {
      if (!(await this.addAdultButton.isVisible()) && !(await this.addAdultButton.isEnabled())) {
        console.log("Button is not visible or not enabled");
      } else {
        await this.addAdultButton.click();
      }
    }
    for (let i = 0; i < kids; i++) {
      if (!(await this.addKidsButton.isVisible()) && !(await this.addKidsButton.isEnabled())) {
        console.log("Button is not visible or not enabled");
      } else {
        await this.addKidsButton.click();
      }
    }
  }

  async search() {
    await this.mainSearchButton.click();
  }
}
