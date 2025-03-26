import { Page } from "playwright";

export async function waitForPageLoad(page: Page) {
  console.log("Waiting for page to load in full");
  await page.waitForTimeout(2000);
  console.log("Page loaded!");
}
