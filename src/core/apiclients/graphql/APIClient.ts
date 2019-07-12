import {InMemoryCache} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import {ApolloLink, execute} from "apollo-link";
import {onError} from "apollo-link-error";
import {createUploadLink} from "apollo-upload-client";
import gql from "graphql-tag";
import * as Models from "../../models";
import {FetchUserRequest, FetchUserResponse} from "./APIClient.types";
import {BaseAPIClient, RequestConfig, RequestMethod, RequestOptions} from "./BaseAPIClient";
import {AppConfig} from "../../AppConfig";

export type ConfigureClientOptions = {
  userAgent: string;
};

export type GetHeadersOptions = {
  authToken?: string;
};

export type APIClientContext = {
  requestConfig: RequestConfig<unknown, RequestMethod>;
  requestOptions: RequestOptions;
};

export class APIClient extends BaseAPIClient {
  static client: ApolloClient<unknown>;

  static configureClient(options: ConfigureClientOptions) {
    const defaultConfig = {
      headers: {
        "X-User-Agent": options.userAgent,
      },
      timeout: AppConfig.Settings.Server.graphql.apiClient.timeout,
    };

    this.client = new ApolloClient({
      link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
          if (graphQLErrors) graphQLErrors.map(({message, locations, path}) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new ApolloLink(operation => {
          operation.setContext((context: any = {}) => {
            const headers = {...context.headers};

            if (context.authToken) headers["x-token"] = context.authToken;

            return {
              ...context,
              headers,
            };
          });

          const context = operation.getContext() as APIClientContext;

          const requestConfig = {
            ...context.requestConfig,
            timeout: context.requestConfig.timeout || defaultConfig.timeout,
            headers: context.requestConfig.headers,
          };

          return execute(
            createUploadLink({
              uri: AppConfig.Settings.Server.graphql.apiClient.baseUrl,
              credentials: "same-origin",
              fetch: this.getCustomFetch(requestConfig, context.requestOptions),
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

  static getHeaders(options: GetHeadersOptions): Record<string, string> {
    const headers: Record<string, string> = {};

    if (options.authToken) headers["x-token"] = options.authToken;

    return headers;
  }

  static async fetchUser(request: FetchUserRequest, options: RequestOptions = {}): Promise<FetchUserResponse> {
    const {client} = this;

    const response = await this.request(
      client,
      {
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
        headers: this.getHeaders({authToken: request.authToken}),
        context: {},
      },
      options
    );

    if (response.success) {
      const {data} = response.rawResponse;

      if (data && data.user)
        return {
          success: true,
          user: Models.User.fromJSON(data.user),
        };
    }

    return {
      success: false,
      error: !response.success && this.isNetworkError(response.rawResponse) ? this.networkError() : this.genericError(),
    };
  }
}
