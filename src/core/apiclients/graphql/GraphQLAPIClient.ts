import {InMemoryCache} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import {ApolloLink, execute} from "apollo-link";
import {onError} from "apollo-link-error";
import {createUploadLink} from "apollo-upload-client";
import gql from "graphql-tag";

import {AppConfig} from "../../AppConfig";
import * as Models from "../../models";
import {BaseGraphQLAPIClient, BaseGraphQLAPIClientContext, BaseGraphQLAPIResponse, BaseGraphQLRequestConfig, RequestMethod, RequestOptions} from "./BaseGraphQLAPIClient";
import {FetchUserRequest, FetchUserResponse, RefreshTokenRequest, RefreshTokenResponse, SignInRequest, SignInResponse} from "./GraphQLAPIClient.types";

export type GraphQLAPIClientConfigureClientOptions = {
  userAgent: string;
  shouldRefreshToken: () => boolean;
  onRefreshToken: (accessToken: Models.AccessToken) => void;
};

export type GraphQLAPIClientGetHeadersOptions = {
  accessToken?: Models.AccessToken | undefined;
};

export type GraphQLAPIClientRequestConfig<TRequest, TRequestMethod extends RequestMethod> = Omit<BaseGraphQLRequestConfig<TRequest, TRequestMethod>, "headers" | "client"> & {
  headers?: GraphQLAPIClientGetHeadersOptions;
};

export class GraphQLAPIClient extends BaseGraphQLAPIClient {
  static client: ApolloClient<unknown>;
  static options: GraphQLAPIClientConfigureClientOptions;

  static configureClient(options: GraphQLAPIClientConfigureClientOptions) {
    this.options = options;

    this.client = new ApolloClient({
      link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
          if (graphQLErrors) graphQLErrors.map(({message, locations, path}) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new ApolloLink((operation) => {
          const context = operation.getContext() as BaseGraphQLAPIClientContext;

          return execute(
            createUploadLink({
              uri: AppConfig.Settings.Server.graphql.apiClient.baseUrl,
              credentials: "same-origin",
              fetch: this.getCustomFetch(context.requestConfig),
            }),
            operation
          );
        }),
      ]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: "no-cache",
        },
      },
    });
  }

  static getHeaders(options: GraphQLAPIClientGetHeadersOptions): Record<string, string> {
    const headers: Record<string, string> = {
      "X-User-Agent": this.options.userAgent,
    };

    if (options.accessToken) headers["x-token"] = options.accessToken.token;

    return headers;
  }

  static async request<TRequest>(config: GraphQLAPIClientRequestConfig<TRequest, "query">): Promise<BaseGraphQLAPIResponse<TRequest, "query">>;
  static async request<TRequest>(config: GraphQLAPIClientRequestConfig<TRequest, "mutation">): Promise<BaseGraphQLAPIResponse<TRequest, "mutation">>;
  static async request<TRequest>(config: GraphQLAPIClientRequestConfig<TRequest, RequestMethod>): Promise<BaseGraphQLAPIResponse<TRequest, RequestMethod>>;
  static async request<TRequest>(config: GraphQLAPIClientRequestConfig<TRequest, RequestMethod>): Promise<BaseGraphQLAPIResponse<TRequest, RequestMethod>> {
    const {headers = {}, options = {}} = config;

    if (headers.accessToken && this.options.shouldRefreshToken()) {
      const response = await this.refreshToken({refreshToken: headers.accessToken.refreshToken}, options);

      if (response.success) {
        this.options.onRefreshToken(response.accessToken);
        headers.accessToken = response.accessToken;
      }
    }

    config.timeout = config.timeout ?? AppConfig.Settings.Server.graphql.apiClient.timeout;

    const baseRequestConfig: BaseGraphQLRequestConfig<TRequest, RequestMethod> = {
      ...config,
      client: this.client,
      headers: this.getHeaders(headers),
      options,
    };

    const context: BaseGraphQLAPIClientContext<typeof baseRequestConfig> = {
      ...(config.context as {}),
      requestConfig: baseRequestConfig,
    };

    return super.request<TRequest>({
      ...baseRequestConfig,
      context,
    });
  }

  static async fetchUser(request: FetchUserRequest, options: RequestOptions = {}): Promise<FetchUserResponse> {
    const response = await this.request({
      request,
      requestMethod: "query",
      gql: gql`
        query fetchUser {
          me {
            id
            name
          }
        }
      `,
      variables: {},
      headers: {
        accessToken: request.accessToken,
      },
      context: {},
      options,
    });

    if (response.success) {
      const {data} = response.rawResponse;

      if (data && data.me)
        return {
          success: true,
          user: Models.User.fromJSON(data.me),
        };
    }

    return {
      success: false,
      error: !response.success && this.isNetworkError(response.rawResponse) ? this.networkError() : this.genericError(),
    };
  }

  static async signIn(request: SignInRequest, options: RequestOptions = {}): Promise<SignInResponse> {
    const response = await this.request({
      request,
      requestMethod: "mutation",
      gql: gql`
        mutation signIn($email: String!, $password: String!) {
          signIn(email: $email, password: $password) {
            token
            refreshToken
            expiresAt
          }
        }
      `,
      variables: {
        email: request.email,
        password: request.password,
      },
      context: {},
      options,
    });

    if (response.success) {
      const {data} = response.rawResponse;

      if (data && data.signIn) {
        return {
          success: true,
          accessToken: Models.AccessToken.fromJSON(data.signIn),
        };
      }
    }

    return {
      success: false,
      error: !response.success && this.isNetworkError(response.rawResponse) ? this.networkError() : this.genericError(),
    };
  }

  static async refreshToken(request: RefreshTokenRequest, options: RequestOptions = {}): Promise<RefreshTokenResponse> {
    const response = await this.request({
      request,
      requestMethod: "mutation",
      gql: gql`
        mutation refreshTokens($token: String!) {
          refreshTokens(token: $token) {
            token
            refreshToken
            expiresAt
          }
        }
      `,
      variables: {
        token: request.refreshToken,
      },
      context: {},
      options,
    });

    if (response.success) {
      const {data} = response.rawResponse;

      if (data)
        return {
          success: true,
          accessToken: Models.AccessToken.fromJSON(data),
        };
    }

    return {
      success: false,
      error: !response.success && this.isNetworkError(response.rawResponse) ? this.networkError() : this.genericError(),
    };
  }
}
