import ENV from "../../utils/env";
import logger from "../../utils/loggerUtil";
import ErrorHandler from "../../helpers/errorHandler";

export default class Routes {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.initializeBaseUrl();
  }

  /**
   * Initializes the base URL from the environment variable.
   * @returns {string} The base URL.
   * @throws {Error} If the base URL is not set in the environment variable.
   */
  private initializeBaseUrl(): string {
    const url = ENV.API_URL!;

    if (!url) {
      const errorMessage = `API Base URL is not set in the environment variable.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info(`Base URL: ${url}`);

    return url;
  }

  async createUserUrl(): Promise<string> {
    try {

      return this.generateUrl(this.usersEndpoint(), "Create User");
    } catch (error) {
      ErrorHandler.handleError(
        error,
        "createUserUrl",
        "Failed to generate Create User URL"
      );
      throw error;
    }
  }

  async getUserUrl(userId: string): Promise<string> {
    try {

      return this.generateUrl(this.getUserEndpoint(userId), "Get User");
    } catch (error) {
      ErrorHandler.handleError(
        error,
        "getUserUrl",
        "Failed to generate Get User URL"
      );
      throw error;
    }
  }


  async updateUserUrl(userId: string): Promise<string> {
    try {

      return this.generateUrl(this.getUserEndpoint(userId), "Update User");
    } catch (error) {
      ErrorHandler.handleError(
        error,
        "updateUserUrl",
        "Failed to generate Update User URL"
      );
      throw error;
    }
  }

  async patchUserUrl(userId: string): Promise<string> {
    try {

      return this.generateUrl(this.getUserEndpoint(userId), "Patch User");
    } catch (error) {
      ErrorHandler.handleError(
        error,
        "patchUserUrl",
        "Failed to generate Patch User URL"
      );
      throw error;
    }
  }


  async deleteUserUrl(userId: string): Promise<string> {
    try {

      return this.generateUrl(this.getUserEndpoint(userId), "Delete User");
    } catch (error) {
      ErrorHandler.handleError(
        error,
        "deleteUserUrl",
        "Failed to generate Delete User URL"
      );
      throw error;
    }
  }

  /**
   * Generates a full URL by concatenating the base URL and the endpoint.
   *
   * @param endpoint The endpoint to be appended to the base URL.
   * @param type The type of URL being generated.
   * @returns The full URL.
   * @throws Will throw an error if the base URL or endpoint is invalid.
   */
  private generateUrl(endpoint: string, type: string): string {
    try {
      const fullUrl = new URL(endpoint, this.baseUrl).toString();
      logger.info(`${type} URL generated: ${fullUrl}`);
      return fullUrl;
    } catch (error) {
      ErrorHandler.handleError(
        error,
        `generateUrl`,
        `Failed to generate ${type} URL`
      );
      throw error;
    }
  }

  /**
   * Generates the endpoint for a specific user by user ID.
   *
   * @param userId The ID of the user.
   * @returns The user endpoint string.
   */
  private getUserEndpoint(userId: string): string {
    return `/public/v2/users/${userId}`;
  }

  private usersEndpoint(): string {
    return "/public/v2/users";
  }
}
