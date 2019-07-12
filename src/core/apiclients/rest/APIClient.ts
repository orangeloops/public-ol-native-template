import axios, {AxiosInstance} from "axios";
import {AppConfig} from "../../AppConfig";
import * as Models from "../../models";
import {FetchUserRequest, FetchUserResponse, SignInRequest, SignInResponse} from "./APIClient.types";
import {BaseAPIClient, RequestOptions} from "./BaseAPIClient";

export type ConfigureClientOptions = {
  userAgent: string;
};

export type GetHeadersOptions = {
  authToken?: string;
};

export class APIClient extends BaseAPIClient {
  static client: AxiosInstance;

  static configureClient(options: ConfigureClientOptions) {
    this.client = axios.create({
      baseURL: AppConfig.Settings.Server.rest.apiClient.baseUrl,
      timeout: AppConfig.Settings.Server.rest.apiClient.timeout,
      headers: {
        "X-User-Agent": options.userAgent,
      },
    });
  }

  static getHeaders(options: GetHeadersOptions): Record<string, string> {
    const result: Record<string, string> = {};

    if (options.authToken) result["x-token"] = options.authToken;

    return result;
  }

  static async signIn(request: SignInRequest, options: RequestOptions = {}): Promise<SignInResponse> {
    const {client} = this;
    const {email, password} = request;

    const requestResponse = await this.request(
      client,
      {
        requestMethod: `post`,
        url: `signIn`,
        headers: this.getHeaders({authToken: request.authToken}),
        data: {
          email,
          password,
        },
        request,
      },
      options
    );

    if (requestResponse.success) {
      const {data, headers = {}} = requestResponse.rawResponse;

      const authToken = headers["x-token"];

      if (data && data.user && typeof authToken === "string")
        return {
          success: true,
          user: Models.User.fromJSON(data.user),
          authToken,
        };
    }

    return {
      success: false,
      error: !requestResponse.success && this.isNetworkError(requestResponse.rawResponse) ? this.networkError() : this.genericError(),
    };
  }

  static async fetchUser(request: FetchUserRequest, options: RequestOptions = {}): Promise<FetchUserResponse> {
    const {client} = this;
    const {authToken} = request;

    const requestResponse = await this.request(
      client,
      {
        requestMethod: `get`,
        url: `user`,
        headers: this.getHeaders({authToken}),
        request,
      },
      options
    );

    if (requestResponse.success) {
      const {data} = requestResponse.rawResponse;

      if (data && data.user)
        return {
          success: true,
          user: Models.User.fromJSON(data.user),
        };
    }

    return {
      success: false,
      error: !requestResponse.success && this.isNetworkError(requestResponse.rawResponse) ? this.networkError() : this.genericError(),
    };
  }
}
