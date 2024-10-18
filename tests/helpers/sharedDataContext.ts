

/**
 * Interface representing the data for an interceptor response.
 */
interface interceptorData {
  preQualificationId: string;
  applicantId: string;
  coApplicantId?: string;
  authorizationHeader: string;
}

interface token{
  token: string;
}


export default class SharedDataContext {

  private static interceptorData: Map<string, interceptorData> =
    new Map();

    private static storeToken: Map<string, token> = new Map();

  // Store data per test
  static setInterceptorData(
    testId: string,
    key: keyof interceptorData,
    value: string
  ): void {
    if (!this.interceptorData.has(testId)) {
      this.interceptorData.set(testId, {} as interceptorData);
    }
    const testDataForId = this.interceptorData.get(testId);
    if (testDataForId) {
      testDataForId[key] = value;
      //logger.info(`${key} stored for test ${testId}: ${value}`);
    }
  }

  static getInterceptorData(
    testId: string,
    key: keyof interceptorData
  ): string | null {
    const testDataForId = this.interceptorData.get(testId);
    if (!testDataForId || !testDataForId[key]) {
      throw new Error(`${key} is not set for test ${testId}`);
    }
    return testDataForId[key];
  }

  static setToken(
    testId: string,
    key: keyof token,
    value: string
  ): void {
    if (!this.storeToken.has(testId)) {
      this.storeToken.set(testId, {} as token);
    }
    const testDataForId = this.storeToken.get(testId);
    if (testDataForId) {
      testDataForId[key] = value;
      //logger.info(`${key} stored for test ${testId}: ${value}`);
    }
  }

  static getToken(
    testId: string,
    key: keyof token
  ): string | null {
    const testDataForId = this.storeToken.get(testId);
    if (!testDataForId || !testDataForId[key]) {
      throw new Error(`${key} is not set for test ${testId}`);
    }
    return testDataForId[key];
  }

    // Check if test data is available for a given test ID
    static isTestDataAvailable(testId: string): boolean {
      return this.interceptorData.has(testId);
    }
  

  // Clear test data after test completes
  static clearTestDataForTestId(testId: string): void {
    this.interceptorData.delete(testId);
  }


  // Usage example 
  // try {
  //   const monthlySalary = await this.monthlySalaryTextBox.inputValue();

  //   if (monthlySalary) {
  //     SharedDataContext.setData(testId, 'monthlySalaryValue', monthlySalary);
  //   } else {
  //     throw new Error("Monthly salary input is empty.");
  //   }
  // } catch (error) {
  //   logger.error(`Error in storing Monthly Salary Value: ${error}`);
  // }
}
