import { Page, expect } from "@playwright/test";
import Routes from "../endpoints/routes";
import ApiErrorHandler from "../../helpers/apiErrorHandler";
import RestHttpClient from "../core/restHttpClient";
import * as ap from "../../testData/userPayload.json";
import ENV from "../../utils/env";
import logger from "../../utils/loggerUtil";
import { faker } from '@faker-js/faker';


interface UserData {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}



export class GoRestServices {
  readonly page: Page;
  private routes: Routes;
  private apiErrorHandler: ApiErrorHandler;
  private restHttpClient: RestHttpClient;

  constructor(page: Page) {
    this.page = page;
    // new instance routes, apiErrorHandler, restHttpClient
    this.routes = new Routes();
    this.apiErrorHandler = new ApiErrorHandler();
    this.restHttpClient = new RestHttpClient();
  }

  async createNewUser(): Promise<void> {
    try {

  // create user payload
   const payload = {
    ...ap.UserPayload,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(['male', 'female']),
    status: faker.helpers.arrayElement(['active', 'inactive']),
   };

      // send post request
      const response = await this.restHttpClient.sendPostRequest(
        await this.routes.createUserUrl(),
        payload,
        this.bearerTokenHeader(this.getAccessToken())
      );


      // handle response
    expect (response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data as UserData).toHaveProperty('name', payload.name);
    expect(response.data as UserData).toHaveProperty('email', payload.email);
    expect(response.data as UserData).toHaveProperty('gender', payload.gender);
    expect(response.data as UserData).toHaveProperty('status', payload.status);
    logger.info(`User data validated successfully}`);  

    } catch (error) {
      this.apiErrorHandler.handleAxiosStatusCodes(error);
      throw error;
    }
  }

  private bearerTokenHeader(token: string): string {
    return `Bearer ${token}`;
  }

  private getAccessToken(): string {
    const accessToken = ENV.ACCESS_TOKEN!;

    if (!accessToken) {
      const errorMessage = `Access Token is not set in the environment variable.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return accessToken;
  }
}
