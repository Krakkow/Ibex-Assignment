import { Locator, Page, expect } from "@playwright/test";
import { getDateButtonLabel } from "../utils/dateHelper";
import { waitForPageLoad } from "../utils/waitHelper";
import { selectDates } from "../utils/dateUtils";

export class MainSearchPage {
  private searchInputString = this.page.getByTestId("structured-search-input-field-query");
  private checkInDatePickerButton = this.page.getByRole("button", { name: /Check in/ });
  private addAdultButton = this.page.getByTestId("stepper-adults-increase-button");
  private addKidsButton = this.page.getByTestId("stepper-children-increase-button");
  private mainSearchButton = this.page.getByTestId("structured-search-input-search-button");
  private selectedCheckInDate: string = "";
  private selectedCheckOutDate: string = "";
  private selectedGuests: number = 0;

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://www.airbnb.com/");
    await waitForPageLoad(this.page);
  }

  async performSearch(destination: string, checkinDay: number, checkoutDay: number, adults: number, kids: number) {
    await this.searchDestination(destination);
    await selectDates(this.page, checkinDay, checkoutDay, this.checkInDatePickerButton);
    await this.setGuests(adults, kids);
    this.search;
  }

  async searchDestination(destination: string) {
    await this.searchInputString.click();
    await this.searchInputString.fill(destination);
    await this.page.getByTestId("option-0").click();
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
    this.selectedGuests = adults + kids;
  }

  async search() {
    await this.mainSearchButton.click();
    await waitForPageLoad(this.page);
  }

  getCheckInDate(): string {
    return this.selectedCheckInDate;
  }

  getCheckOutDate(): string {
    return this.selectedCheckOutDate;
  }

  getGuestsAmount(): number {
    return this.selectedGuests;
  }

  getCheckInDatePickerButton() {
    return this.checkInDatePickerButton;
  }
}
