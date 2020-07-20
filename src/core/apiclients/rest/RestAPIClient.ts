import axios, {AxiosInstance} from "axios";

import {AppConfig} from "../../AppConfig";
import * as Errors from "../../Errors";
import * as Models from "../../models";
import {BaseRestAPIClient, BaseRestFailedResponse, BaseRestRequestConfig, BaseRestResponse, BaseRestSuccessfulResponse, RequestOptions} from "./BaseRestAPIClient";
import {AuthenticatedRequest, FetchUserRequest, FetchUserResponse, RefreshTokenRequest, RefreshTokenResponse, SignInRequest, SignInResponse} from "./RestAPIClient.types";

export type RestAPIClientConfigureClientOptions = {
  userAgent: string;
  shouldRefreshToken: () => boolean;
  onRefreshToken: (newAccessToken: Models.AccessToken) => void;
};

export type RestAPIClientGetHeadersOptions = {
  token?: string;
};

export type RestAPIClientRequestConfig<TRequest, TData = any> = Omit<BaseRestRequestConfig<TRequest, TData>, "client" | "headers"> & {
  headers?: RestAPIClientGetHeadersOptions;
};

export class RestAPIClient extends BaseRestAPIClient {
  static client: AxiosInstance;
  static options: RestAPIClientConfigureClientOptions;

  static configureClient(options: RestAPIClientConfigureClientOptions) {
    this.options = options;
    this.client = axios.create({
      baseURL: AppConfig.Settings.Server.rest.apiClient.baseUrl,
      timeout: AppConfig.Settings.Server.rest.apiClient.timeout,
      headers: {
        "X-User-Agent": options.userAgent,
      },
    });
  }

  static getHeaders(options: RestAPIClientGetHeadersOptions): Record<string, string> {
    const result: Record<string, string> = {};

    if (options.token) result["x-token"] = options.token;

    return result;
  }

  static async request<TRequest>(config: RestAPIClientRequestConfig<TRequest>): Promise<BaseRestResponse<TRequest>> {
    const {request} = (config as unknown) as {request: AuthenticatedRequest};

    if (request.accessToken?.refreshToken && this.options.shouldRefreshToken()) {
      const response = await this.refreshToken({refreshToken: request.accessToken.refreshToken});

      if (response.success) {
        this.options.onRefreshToken(response.accessToken);
        request.accessToken = response.accessToken;
      }
    }

    return super.request({
      ...config,
      headers: this.getHeaders(config.headers || {}),
      client: this.client,
    });
  }

  static async signIn(request: SignInRequest, options: RequestOptions = {}): Promise<SignInResponse> {
    const {email, password} = request;

    const requestResponse = await this.request({
      requestMethod: `post`,
      url: `signIn`,
      data: {
        email,
        password,
      },
      request,
      options,
    });

    if (requestResponse.success) {
      const {data} = requestResponse.rawResponse;

      if (data && data.user && data.accessToken)
        return {
          success: true,
          user: Models.User.fromJSON(data.user),
          accessToken: Models.AccessToken.fromJSON(data.accessToken),
        };
    }

    return {
      success: false,
      error: !requestResponse.success && this.isNetworkError(requestResponse.rawResponse) ? this.networkError() : this.genericError(),
    };
  }

  static async refreshToken(request: RefreshTokenRequest, options: RequestOptions = {}): Promise<RefreshTokenResponse> {
    const requestResponse = await this.request({
      url: `refreshToken`,
      request,
      data: {
        refreshToken: request.refreshToken,
      },
      requestMethod: `post`,
      options,
    });

    if (requestResponse.success) {
      const {data = {}} = requestResponse.rawResponse;

      if (typeof data.token === "string" && typeof data.refreshToken === "string") {
        const accessToken = Models.AccessToken.fromJSON(data);

        return {
          success: true,
          accessToken,
        };
      }
    }

    return {
      ...this.getErrorResponse(requestResponse),
      rawResponse: requestResponse.rawResponse,
    };
  }

  static async fetchUser(request: FetchUserRequest, options: RequestOptions = {}): Promise<FetchUserResponse> {
    const {token} = request.accessToken;

    const requestResponse = await this.request({
      requestMethod: `get`,
      url: `user`,
      headers: {token},
      request,
      options,
    });

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

  private static getErrorResponse(response: BaseRestSuccessfulResponse<any> | BaseRestFailedResponse): {success: false; error: Errors.GenericError | Errors.NetworkError} {
    return {
      success: false,
      error: !response.success && this.isNetworkError(response.rawResponse) ? this.networkError() : this.genericError(),
    };
  }
}
