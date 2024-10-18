import axios, { AxiosError } from "axios";
import logger from "../utils/loggerUtil";

export default class ApiErrorHandler {

  private logErrorDetails(statusCode: number, message: string, error: AxiosError): void {
    logger.error(`Received ${statusCode} ${message}`, {
      errorMessage: error.message,
      errorData: error.response?.data,
      errorHeaders: error.response?.headers
    });
  }

  private handleSuccess(statusCode: number, message: string): void {
    logger.info(`Received ${statusCode} ${message}`);
  }

  private handleError(statusCode: number, message: string, error: AxiosError): void {
    this.logErrorDetails(statusCode, message, error);
    throw new Error(`Received ${statusCode} ${message}: ${error.message}`);
  }

  private handleKnownStatusCodes(statusCode: number, error: AxiosError): void {
    const message = error.response?.statusText || 'Unknown Status';
  
    if (statusCode >= 200 && statusCode < 300) {
      this.handleSuccess(statusCode, message);
    } else if (statusCode === 400) {
      this.handleBadRequest(error);
    } else if (statusCode === 401) {
      this.handleUnAuthorizedError(error);
    } else if (statusCode === 402) {
      this.handlePaymentRequired(error);
    } else if (statusCode === 500) {
      this.handleInternalServerError(error);
    } else if (statusCode === 422) {
      this.handleUnprocessableEntity(error);
    } else {
      this.handleError(statusCode, message, error);
    }
  }
  

  public handleUnAuthorizedError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logger.info("Correctly received 401 Unauthorized for invalid authorization.");
    } else {
      this.handleAxiosError("Error while attempting to give consent with invalid authorization.", error);
    }
  }

  /**
 * Handles a unprocessable entity error (422).
 * @param {unknown} error - The error object to handle.
 */
public handleUnprocessableEntity(error: unknown): void {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    logger.info("Correctly received 422 Unprocessable Entity.");
    this.logErrorDetails(422, "Unprocessable Entity", error); // Log the error details
  } else {
    this.handleAxiosError("Error while attempting to handle unprocessable entity.", error);
  }
}


  public handleBadRequest(error: unknown): void {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      logger.info("Correctly received 400 Bad Request.");
    } else {
      this.handleAxiosError("Error while attempting to handle bad request.", error);
    }
  }

  public handleInternalServerError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      logger.info("Correctly received 500 Internal Server Error.");
    } else {
      this.handleAxiosError("Error while attempting to handle internal server error.", error);
    }
  }

  public handlePaymentRequired(error: unknown): void {
    if (axios.isAxiosError(error) && error.response?.status === 402) {
      logger.info("Correctly received 402 Payment Required.");
    } else {
      this.handleAxiosError("Error while attempting to handle payment required.", error);
    }
  }

  public handleAxiosStatusCodes(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 0;
      this.handleKnownStatusCodes(statusCode, error);
    } else if (error instanceof Error) {
      this.handleGenericError(error);
    } else {
      this.handleAxiosError("An unexpected error occurred.", error);
    }
  }

  private handleGenericError(error: Error): void {
    logger.error("Handling a generic error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Generic Error: ${error.message}`);
  }

  private handleAxiosError(errorMessage: string, error: unknown): void {
    logger.error("Handling error:", {
      errorType: typeof error,
      errorValue: error,
    });

    if (axios.isAxiosError(error)) {
      logger.error(`${errorMessage} - Axios error details:`, {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config,
      });
      throw new Error(`${errorMessage}: ${error.message}`);
    }

    if (error instanceof Error) {
      logger.error("Handling a generic error:", {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Generic Error: ${error.message}`);
    }

    logger.error(`${errorMessage} - Unexpected error details:`, {
      errorType: typeof error,
      errorValue: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    throw new Error("An unexpected error occurred.");
  }
}
