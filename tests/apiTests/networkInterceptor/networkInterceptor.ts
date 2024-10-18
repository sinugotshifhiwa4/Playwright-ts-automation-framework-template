import { Page, Response } from "@playwright/test";
import logger from "../../utils/loggerUtil";
import SharedDataContext from "../../helpers/sharedDataContext";


/**
 * NetworkInterceptor is a class responsible for intercepting network responses and capturing important values.
 *
 * The NetworkInterceptor is initialized with a unique testId, which is used to identify each test.
 * It listens for response events and captures values such as preQualificationId, applicantId, and authorizationHeader.
 *
 * The captured values are stored in a SharedDataContext, which can be accessed globally.
 *
 * Ensure that each test has a unique testId to prevent data leakage and maintain test independence.
 *
 * When writing API tests, it is recommended to create a new instance of NetworkInterceptor for each test,
 * passing a unique testId to each instance.
 *
 * @example
 * Example usage:
 * const interceptor1 = new NetworkInterceptor(page, "testId1");
 * const interceptor2 = new NetworkInterceptor(page, "testId2");
 * const interceptor3 = new NetworkInterceptor(page, "testId3");
 * const interceptor4 = new NetworkInterceptor(page, "testId4");
 * 
 * To learn how to retrieve data from SharedDataContext, refer to:
 * `tests/apiTests/services/singleConsentService.ts` or any other relevant class within the `services` folder.
 *
 * For the full implementation, refer to:
 * `tests/apiTests/specs/SingleConsentApi.spec.ts` or any other relevant test within the `specs` folder.
 */


// Define an interface for the expected response structure
interface ResponseBody {
  preQualificationId?: string;
  applicants?: Array<{ applicantId: string }>;
}

export default class NetworkInterceptor {
  readonly page: Page;

  private preQualificationId: string | null = null;
  private applicantId: string | null = null;
  private coApplicantId: string | null = null;
  private authorizationHeader: string | null = null;
  private testId: string;


  constructor(page: Page, testId: string) {
    this.page = page;
    this.testId = testId;
    this.initialize();
    logger.info("NetworkInterceptor initialized and response listener set up.");
  }

  // Initialize the interceptor to listen for response events
  private initialize() {
    this.page.on("response", this.handleResponse.bind(this));
    logger.info("Response event listener added to the page.");
  }

  // Handle each response received by the page
  private async handleResponse(response: Response) {
    try {
      if (
        response.status() === 200 &&
        response.headers()["content-type"]?.includes("application/json")
      ) {
        const responseBody: ResponseBody = await response.json();
        logger.info("Response body parsed as JSON.");

        this.capturePreQualificationId(responseBody);
        this.captureApplicantId(responseBody);
        this.captureAuthorizationHeader(response);

         // Store the captured values after processing the response
      await this.storeResponseValues(this.testId);
      }
    } catch (error) {
      logger.error("Failed to parse response", error);
    }
  }

  // Capture preQualificationId if present in the response body
  private capturePreQualificationId(responseBody: ResponseBody) {
    this.preQualificationId =
      responseBody.preQualificationId ?? this.preQualificationId;
    if (this.preQualificationId) {
      logger.info(`preQualificationId captured: ${this.preQualificationId}`);
    }
  }

 // Capture applicantId if present in the response body
private captureApplicantId(responseBody: ResponseBody) {
  if (responseBody.applicants?.length) {
    this.applicantId = responseBody.applicants[0]?.applicantId ?? null;
    if (this.applicantId) {
      logger.info(`applicantId (main) captured: ${this.applicantId}`);
    }
    if (responseBody.applicants.length > 1) {
      const coApplicantId = responseBody.applicants[1]?.applicantId ?? null;
      if (coApplicantId) {
        logger.info(`applicantId (co-applicant) captured: ${coApplicantId}`);
        this.coApplicantId = coApplicantId;
      }
    }
  }
}

  // Capture Authorization header from the request
  private captureAuthorizationHeader(response: Response) {
    const request = response.request();
    this.authorizationHeader = request.headers()["authorization"] ?? null;
    if (this.authorizationHeader) {
      logger.info(`Authorization header captured.`);
    }
  }

  // Get the captured preQualificationId
  private getPreQualificationId() {
    return this.preQualificationId;
  }

  // Get the captured applicantId
  private getApplicantId() {
    return this.applicantId;
  }

  // Get the captured coApplicantId
  private getCoApplicantId() {
    return this.coApplicantId;
  }

  // Get the captured Authorization header
  private getAuthorizationHeader() {
    return this.authorizationHeader;
  }

  // Store preQualificationId, applicantId, and Authorization header in SharedDataContext

  /**
   * Store the captured preQualificationId in SharedDataContext
   * @param {string} testId - The testId to store the data against
   * @throws {Error} If preQualificationId not captured
   */
  public storePreQualificationId(testId: string) {
    try {
      const preQualificationId = this.getPreQualificationId();

      if (!preQualificationId) {
        throw new Error("preQualificationId not captured.");
      }

      SharedDataContext.setInterceptorData(
        testId,
        "preQualificationId",
        preQualificationId
      );
    } catch (error) {
      logger.error(`Error in storing preQualificationId: ${error}`);
    }
  }

  /**
   * Store the captured applicantId in SharedDataContext
   * @param {string} testId - The testId to store the data against
   * @throws {Error} If applicantId not captured
   */
  public storeApplicantId(testId: string) {
    try {
      const applicantId = this.getApplicantId();

      if (!applicantId) {
        throw new Error("applicantId not captured.");
      }

      SharedDataContext.setInterceptorData(testId, "applicantId", applicantId);
    } catch (error) {
      logger.error(`Error in storing applicantId: ${error}`);
    }
  }

  /**
   * Store the captured coApplicantId in SharedDataContext
   * @param {string} testId - The testId to store the data against
   * @throws {Error} If coApplicantId not captured
   */
  public storeCoApplicantId(testId: string) {
    try {
      const coApplicantId = this.getCoApplicantId();

      if (!coApplicantId) {
        throw new Error("coApplicantId not captured.");
      }

      SharedDataContext.setInterceptorData(
        testId,
        "coApplicantId",
        coApplicantId
      );
    } catch (error) {
      logger.error(`Error in storing coApplicantId: ${error}`);
    }
  }

  /**
   * Store the captured Authorization header in SharedDataContext
   * @param {string} testId - The testId to store the data against
   * @throws {Error} If authorizationHeader not captured
   */
  public storeAuthorizationHeader(testId: string) {
    try {
      const authorizationHeader = this.getAuthorizationHeader();

      if (!authorizationHeader) {
        throw new Error("authorizationHeader not captured.");
      }

      SharedDataContext.setInterceptorData(
        testId,
        "authorizationHeader",
        authorizationHeader
      );
    } catch (error) {
      logger.error(`Error in storing authorizationHeader: ${error}`);
    }
  }

  /**
   * Store all the captured values in SharedDataContext
   * @param {string} testId - The testId to store the data against
   * @throws {Error} If any of the values not captured
   */
  async storeResponseValues(testId: string) {
    try {
      this.storePreQualificationId(testId);
      this.storeApplicantId(testId);
      if (this.coApplicantId) {
        this.storeCoApplicantId(testId);
      }
      this.storeAuthorizationHeader(testId);
    } catch (error) {
      logger.error(`Error in storing response values: ${error}`);
    }
  }
}
