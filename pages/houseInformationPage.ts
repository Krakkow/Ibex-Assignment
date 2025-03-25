import { Page } from "@playwright/test";

export class ListingInformationPage {
  constructor(private newTab: Page) {}
  private popupWindow = this.newTab.getByTestId("modal-container");
  private popupCloseButton = this.newTab.locator('button[aria-label="Close"]');

  async checkIfPopupExists(): Promise<boolean> {
    const isVisible = await this.popupWindow.isVisible();
    console.log(`Popup is visible: ${isVisible}`);
    return isVisible;
    // return await this.popupCloseButton.isVisible();
  }

  async closePopup() {
    if (await this.checkIfPopupExists()) {
      if (await this.popupCloseButton.isVisible()) {
        await this.popupCloseButton.click();
        console.log("Popup closed");
      } else {
        console.log("Close button isn't visible, trying to close the popup by clicking outside");
        await this.newTab.mouse.click(10, 10);
      }

      console.log("Popup closed");
    }
  }
}
