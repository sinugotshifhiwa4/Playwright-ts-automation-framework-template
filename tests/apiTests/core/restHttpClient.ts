import axios, { AxiosResponse } from "axios";

export default class RestHttpClient {

  private defaultHeaders: { [key: string]: string };

  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async sendRequest<T>(
    method: "post" | "patch" | "get" | "delete",
    endpoint: string,
    payload?: object,
    headers?: { [key: string]: string }
  ): Promise<AxiosResponse<T>> {
    return await axios[method](endpoint, payload, {
      headers: { ...this.defaultHeaders, ...headers },
    });
  }

  async sendPostRequest<T>(
    endpoint: string,
    payload?: object,
    authorizationHeader?: string
  ): Promise<AxiosResponse<T>> {
    const headers = authorizationHeader ? { Authorization: authorizationHeader } : undefined;
    return this.sendRequest("post", endpoint, payload, headers);
  }

  async sendPatchRequest<T>(
    endpoint: string,
    payload: object,
    authorizationHeader?: string
  ): Promise<AxiosResponse<T>> {
    const headers = authorizationHeader ? { Authorization: authorizationHeader } : undefined;
    return this.sendRequest("patch", endpoint, payload, headers);
  }

  async sendGetRequest<T>(
    endpoint: string,
    authorizationHeader?: string
  ): Promise<AxiosResponse<T>> {
    const headers = authorizationHeader ? { Authorization: authorizationHeader } : undefined;
    return this.sendRequest("get", endpoint, undefined, headers);
  }

  async sendDeleteRequest<T>(
    endpoint: string,
    authorizationHeader?: string
  ): Promise<AxiosResponse<T>> {
    const headers = authorizationHeader ? { Authorization: authorizationHeader } : undefined;
    return this.sendRequest("delete", endpoint, undefined, headers);
  }
}
