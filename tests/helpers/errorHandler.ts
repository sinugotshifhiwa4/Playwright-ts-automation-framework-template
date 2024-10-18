import logger from "../utils/loggerUtil";

class ErrorHandler {
  /**
   * Handle and log errors in a consistent way.
   * @param error The error object that was caught.
   * @param context Description or context for the error (e.g., which process or file).
   * @param customMessage Additional message to be logged before the error message.
   */
  static handleError(error: unknown, context: string, customMessage?: string) {
    const messagePrefix = customMessage ? `${customMessage}: ` : '';

    if (error instanceof Error) {
      // If it's an instance of Error, log the message
      logger.error(`[${context}] ${messagePrefix}Error occurred: ${error.message}`);
    } else if (typeof error === 'string') {
      // Handle string errors
      logger.error(`[${context}] ${messagePrefix}String error occurred: ${error}`);
    } else if (typeof error === 'number') {
      // Handle number errors
      logger.error(`[${context}] ${messagePrefix}Number error occurred: ${error}`);
    } else if (typeof error === 'boolean') {
      // Handle boolean errors
      logger.error(`[${context}] ${messagePrefix}Boolean error occurred: ${error}`);
    } else if (typeof error === 'object' && error !== null) {
      // Log object details if it's an object but not an instance of Error
      logger.error(`[${context}] ${messagePrefix}Object error occurred: ${JSON.stringify(error)}`);
    } else {
      // Fallback for unknown types or null/undefined
      logger.error(`[${context}] ${messagePrefix}Unknown error occurred.`);
    }
  }
}

export default ErrorHandler;
