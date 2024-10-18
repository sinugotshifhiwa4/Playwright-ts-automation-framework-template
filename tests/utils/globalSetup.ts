import dotenv from "dotenv";
import logger from "./loggerUtil";
import ErrorHandler from "../helpers/errorHandler";

/**
 * Global setup function to load environment variables from a specific file.
 */
async function globalSetup() {
  let envPath = ""; // Declare outside the try block to avoid reference issues in catch

  try {
    // Construct the path to the environment file based on the ENV variable
    envPath = `envs/.env.${process.env.ENV}`;

    // Check if the ENV variable is set
    if (process.env.ENV) {
      // Load environment variables from the specified file
      dotenv.config({ path: envPath, override: true });
      logger.info(`Environment variables loaded from ${envPath}`);
    } else {
      // Log a warning if the ENV variable is not set
      logger.error("ENV variable is not set.");
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'globalSetup', `loading environment variables from ${envPath}`);
  }
}

export default globalSetup;
