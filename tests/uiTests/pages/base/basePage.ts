import { Locator, Page, expect, Response } from "@playwright/test";
import logger from "../../../utils/loggerUtil";
import moment from "moment-timezone";
import * as fs from 'fs';
import ErrorHandler from "../../../helpers/errorHandler";


export default class BasePage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Generic action handler that performs an action once.
   * @param action The action to be performed.
   * @param successMessage The success message to be logged.
   * @param errorMessage The error message to be logged.
   * @returns The result of the action.
   */
  async performAction<T>(
    action: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> {
    try {
      const result = await action();
      if (successMessage) logger.info(successMessage);
      return result;
    } catch (error) {
      // Log the stack trace if available
      const stackTrace =
        error instanceof Error ? error.stack : "No stack trace available";
      ErrorHandler.handleError(
        error,
        "performAction",
        `${errorMessage} | Stack Trace: ${stackTrace}`
      );
      throw error;
    }
  }

  /**
   * Generic action handler with retry logic.
   * @param action The action to be performed.
   * @param successMessage The success message to be logged.
   * @param errorMessage The error message to be logged.
   * @param retryCount The number of retries (default is 3).
   * @returns The result of the action.
   */
  async performActionWithRetry<T>(
    action: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string,
    retryCount: number = 3
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retryCount) {
      try {
        return await this.performAction(action, successMessage, errorMessage);
      } catch (error) {
        attempt++;
        if (attempt >= retryCount) {
          throw error; // Rethrow after the last attempt
        }
        logger.warn(`Attempt ${attempt} failed. Retrying...`);
      }
    }

    // Add this line to ensure a return statement is present
    throw new Error(
      `Failed to perform action after ${retryCount} maximum attempts`
    );
  }

  /**
   * Navigation
   * @param url The URL to navigate to.
   * @returns The response object.
   */
  async navigateTo(url: string): Promise<Response | null> {
    return await this.performAction(
      () => this.page.goto(url),
      `Navigated to ${url}`,
      `Failed to navigate to ${url}`
    );
  }

  /**
   * Element Interaction
   * @param element The element locator.
   * @param value The value to fill.
   * @param elementName The name of the element (optional).
   */
  async fillElement(element: Locator, value: string, elementName?: string) {
    const isCredentialField =
      elementName?.toLowerCase().includes("username") ||
      elementName?.toLowerCase().includes("password");

    await this.performAction(
      () => element.fill(value, { force: true }),
      isCredentialField
        ? `Credential ${elementName} filled successfully`
        : `${elementName} filled successfully with value: ${value}`,
      `Error entering text in ${elementName}`
    );
  }

  /**
   * Element Interaction
   * @param element The element locator.
   * @param text The text to enter sequentially.
   * @param elementName The name of the element (optional).
   */
  async enterTextSequentially(
    element: Locator,
    text: string,
    elementName?: string
  ) {
    await this.performAction(
      async () => {
        await element.pressSequentially(text);
        logger.info(`Text entered sequentially in ${elementName}`);
      },
      `Text entered sequentially in ${elementName}`,
      `Error entering text sequentially in ${elementName}`
    );
  }

  /**
   * Element Interaction
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async clickElement(element: Locator, elementName?: string) {
    await this.performAction(
      () => element.click({ force: true }),
      `Clicked on ${elementName}`,
      `Error clicking on ${elementName}`
    );
  }

  /**
   * Element Interaction
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async clearElement(element: Locator, elementName?: string) {
    await this.performAction(
      () => element.clear(),
      `Cleared ${elementName}`,
      `Error clearing ${elementName}`
    );
  }

  /**
   * Get Text
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   * @returns The visible text of the element.
   */
  async getDisplayedTextFromElement(
    element: Locator,
    elementName?: string
  ): Promise<string> {
    return await this.performAction(
      async () => {
        const text = await element.innerText();
        logger.info(`Retrieved visible text from ${elementName}: ${text}`);
        return text;
      },
      `Visible text retrieved from ${elementName}`,
      `Error getting visible text from ${elementName}`
    );
  }

  /**
   * Get Text
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   * @returns The all text of the element.
   */
  async getCompleteTextFromElement(
    element: Locator,
    elementName?: string
  ): Promise<string | null> {
    return await this.performAction(
      async () => {
        const text = await element.textContent();
        logger.info(`Retrieved all text from ${elementName}: ${text}`);
        return text;
      },
      `All text retrieved from ${elementName}`,
      `Error getting all text from ${elementName}`
    );
  }

  /**
   * Get Input Value
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   * @returns The input value of the element.
   */
  async getElementInputValue(element: Locator, elementName?: string): Promise<string> {
    return await this.performAction(
      async () => {
        const value = await element.inputValue();
        logger.info(`Retrieved value from ${elementName}: ${value}`);
        return value;
      },
      `Value retrieved from ${elementName}`,
      `Error getting value from ${elementName}`
    );
  }

  /**
   * Verification
   * @param element The element locator.
   * @param expectedText The expected text.
   * @param elementName The name of the element (optional).
   */
  async verifyElementText(
    element: Locator,
    expectedText: string,
    elementName?: string
  ) {
    const actualText = await this.getDisplayedTextFromElement(element, elementName);
    expect(actualText.trim()).toBe(expectedText.trim());
    logger.info(
      `Verified text for ${elementName}. Expected: "${expectedText}", Actual: "${actualText}"`
    );
  }

  /**
   * Verification
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async verifyElementVisible(element: Locator, elementName?: string) {
    await this.performAction(
      async () => {
        await expect(element).toBeVisible();
        logger.info(`Verified that ${elementName} is visible`);
      },
      `Element ${elementName} is visible`,
      `Failed to verify visibility of ${elementName}`
    );
  }

  /**
   * Verification
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async verifyElementNotVisible(element: Locator, elementName?: string) {
    await this.performAction(
      async () => {
        await expect(element).not.toBeVisible();
        logger.info(`Verified that ${elementName} is not visible`);
      },
      `Element ${elementName} is not visible`,
      `Failed to verify invisibility of ${elementName}`
    );
  }

  /**
   * Wait for Element Visible
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async waitForElementVisible(element: Locator, elementName?: string) {
    await this.performAction(
      async () => {
        await element.waitFor({ state: "visible" });
        logger.info(`Waited for ${elementName} to be visible`);
      },
      `Element ${elementName} is visible`,
      `Error waiting for ${elementName} to be visible`
    );
  }

  /**
   * Wait for Element Hidden
   * @param selector The CSS selector.
   * @param elementName The name of the element (optional).
   */
  async waitForElementHidden(selector: string, elementName?: string) {
    await this.performAction(
      async () => {
        await this.page.waitForSelector(selector, { state: "hidden" });
        logger.info(`Waited for ${elementName} to be hidden`);
      },
      `Element ${elementName} hidden`,
      `Error waiting for ${elementName} to be hidden`
    );
  }

  /**
   * Screenshot
   * @param fileName The file name (optional).
   */
  async takeScreenshot(fileName?: string) {
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    const screenshotPath = fileName || `screenshot_${timestamp}.png`;

    await this.performAction(
      () => this.page.screenshot({ path: screenshotPath }),
      `Screenshot taken: ${screenshotPath}`,
      `Error taking screenshot`
    );
  }

  /**
   * Element State Verification
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async verifyElementEnabled(element: Locator, elementName?: string) {
    await expect(element).toBeEnabled();
    logger.info(`Verified that ${elementName} is enabled`);
  }

  /**
   * Element State Verification
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async verifyElementDisabled(element: Locator, elementName?: string) {
    await expect(element).toBeDisabled();
    logger.info(`Verified that ${elementName} is disabled`);
  }

  /**
   * Element State Verification
   * @param element The element locator.
   * @param elementName The name of the element (optional).
   */
  async verifyElementEditable(element: Locator, elementName?: string) {
    try {
      const isEnabled = await element.isEnabled();
      const isReadOnly = await element.getAttribute("readonly");
      const isDisabled = await element.getAttribute("disabled");

      if (!isEnabled || isReadOnly !== null || isDisabled !== null) {
        logger.warn(`Element ${elementName} is not fully editable`);
      }

      expect(isEnabled).toBe(true);
      expect(isReadOnly).toBe(null);
      expect(isDisabled).toBe(null);

      logger.info(`Verified that ${elementName} is editable`);
    } catch (error) {
      logger.error(`Failed to verify ${elementName}: ${error}`);
      throw error;
    }
  }

  // Utility function can be static if not using instance variables
  static createRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  }

  /**
   * Select Dropdown Option
   * @param element The element locator.
   * @param optionValue The value of the option.
   * @param elementName The name of the element (optional).
   */
  async selectDropdownOption(
    element: Locator,
    optionValue: string,
    elementName?: string
  ) {
    // Remove any extra quotes from the optionValue
    const cleanOptionValue = optionValue.replace(/^"|"$/g, "");

    await this.performAction(
      () => element.selectOption(cleanOptionValue),
      `${elementName} option selected successfully with value: ${optionValue}`,
      `Error selecting option in ${elementName}`
    );
  }

   async verifyDownloadedFile(filePath: string): Promise<void> {
    await this.performAction(
      async () => await fs.promises.access(filePath),
      `File successfully downloaded to: ${filePath}`,
      `File not found after download`
    );
  }

  /**
 * Downloads a file, saves it to a specified directory, and verifies its existence.
 * This method uses the `verifyDownloadedFile` utility to handle file verification.
 *
 * @returns {Promise<string>} The path of the downloaded file.
 *
 * @example
 * // Example usage of the downloadFile method
 * async function exampleUsage() {
 *   const filePath = await this.downloadFile();
 *   console.log(`Downloaded file is located at: ${filePath}`);
 * }
 */
// async downloadFile(): Promise<string> {
//   const downloadPath = path.resolve(process.cwd(), "downloads");

//   // Ensure the download directory exists
//   await fs.promises.mkdir(downloadPath, { recursive: true });

//   // Clean up old files in the download directory
//   await Promise.all(
//     (await fs.promises.readdir(downloadPath)).map((file) =>
//       fs.promises.unlink(path.join(downloadPath, file))
//     )
//   );

//   // Wait for the download event and click the download button
//   const [download] = await Promise.all([
//     this.page.waitForEvent("download"),
//     this.clickElement(this.downloadButton, "Download Button"),
//   ]);

//   // Save the downloaded file to the specified path
//   const filePath = path.join(downloadPath, download.suggestedFilename());
//   await download.saveAs(filePath);

//   // Verify the downloaded file using the verifyDownloadedFile method
//   await this.verifyDownloadedFile(filePath);

//   return filePath;
// }



}
