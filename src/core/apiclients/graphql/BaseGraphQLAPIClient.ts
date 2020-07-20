import {ApolloClient, ApolloError, ApolloQueryResult} from "apollo-client";
import {DocumentNode, FetchResult} from "apollo-link";

import * as Errors from "../../Errors";
import {CoreHelper} from "../../utils/CoreHelper";

export type RequestMethod = "query" | "mutation";

export type BaseGraphQLRequestConfig<TRequest, TRequestMethod extends RequestMethod> = {
  client: ApolloClient<unknown>;
  request: TRequest;
  requestMethod: TRequestMethod;
  gql: DocumentNode;
  variables: Record<string, any>;
  timeout?: number;
  headers?: Record<string, string>;
  context: any;
  options?: RequestOptions;
};

export type RequestOptions = {
  cancel?: () => void;
  onUploadProgress?: (loaded: number, total: number) => void;
  onDownloadProgress?: (loaded: number, total: number) => void;
};

export type BaseGraphQLAPIClientContext<TRequestConfig extends BaseGraphQLRequestConfig<unknown, RequestMethod> = BaseGraphQLRequestConfig<unknown, RequestMethod>> = {
  requestConfig: TRequestConfig;
};

export type BaseGraphQLSuccessfulResponse<TRequestMethod extends RequestMethod> = {
  success: true;
  rawResponse: TRequestMethod extends "query" ? ApolloQueryResult<any> : FetchResult;
};
export type BaseGraphQLFailedResponse = {
  success: false;
  rawResponse: ApolloError;
};
export type BaseGraphQLAPIResponse<TRequest, TRequestMethod extends RequestMethod> = (BaseGraphQLSuccessfulResponse<TRequestMethod> | BaseGraphQLFailedResponse) & {
  request: TRequest;
};

export class BaseGraphQLAPIClient {
  static parseHeaders(rawHeaders: any) {
    // https://github.com/jaydenseric/apollo-upload-client/issues/88#issuecomment-468318261
    const headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
      const parts = line.split(":");
      const key = parts.shift().trim();
      if (key) {
        const value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  static getCustomFetch(requestConfig: BaseGraphQLRequestConfig<unknown, RequestMethod>) {
    return (url: string, options: RequestInit) =>
      new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.timeout = requestConfig.timeout || 3000;

        xhr.onload = () => {
          const opts: any = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: this.parseHeaders(xhr.getAllResponseHeaders() || ""),
          };

          opts.url = "responseURL" in xhr ? xhr.responseURL : opts.headers.get("X-Request-URL");
          const body = "response" in xhr ? xhr.response : (xhr as any).responseText;

          resolve(new Response(body, opts));
        };
        xhr.onerror = () => {
          reject(new TypeError("Network request failed"));
        };
        xhr.ontimeout = () => {
          reject(new TypeError("Network request failed"));
        };

        xhr.open(options.method!, url, true);

        const headers = {...options.headers, ...requestConfig.headers};
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, (headers as {[key: string]: string})[key]);
        });

        const {options: requestOptions = {}} = requestConfig;

        if (requestOptions.onDownloadProgress) {
          const {onDownloadProgress} = requestOptions;

          xhr.onprogress = (e) => (e.lengthComputable ? onDownloadProgress(e.loaded, e.total) : onDownloadProgress(1, 1));
        }

        if (xhr.upload && requestOptions.onUploadProgress) {
          const {onUploadProgress} = requestOptions;

          xhr.upload.onprogress = (e) => (e.lengthComputable ? onUploadProgress(e.loaded, e.total) : onUploadProgress(1, 1));
        }

        requestOptions.cancel = () => {
          xhr.abort();
        };

        xhr.send(options.body);
      });
  }

  static async request<TRequest>(config: BaseGraphQLRequestConfig<TRequest, "query">): Promise<BaseGraphQLAPIResponse<TRequest, "query">>;
  static async request<TRequest>(config: BaseGraphQLRequestConfig<TRequest, "mutation">): Promise<BaseGraphQLAPIResponse<TRequest, "mutation">>;
  static async request<TRequest>(config: BaseGraphQLRequestConfig<TRequest, RequestMethod>): Promise<BaseGraphQLAPIResponse<TRequest, RequestMethod>>;
  static async request<TRequest>(config: BaseGraphQLRequestConfig<TRequest, RequestMethod>): Promise<BaseGraphQLAPIResponse<TRequest, RequestMethod>> {
    const {client, options = {}, request, gql, requestMethod, variables, timeout, headers} = config;

    const context: BaseGraphQLAPIClientContext<BaseGraphQLRequestConfig<TRequest, RequestMethod>> = {
      ...(config.context as {}),
      requestConfig: config,
    };

    if (requestMethod === "query")
      return client
        .query({
          context: {
            ...context,
            timeout,
            headers,
            requestOptions: options,
            requestConfig: config,
          },
          variables,
          query: gql,
        })
        .then(async (rawResponse) => ({success: true as true, request, rawResponse}))
        .catch(async (rawResponse) => ({success: false as false, request, rawResponse}));
    else
      return client
        .mutate({
          context: {
            ...context,
            timeout,
            headers,
            requestOptions: options,
            requestConfig: config,
          },
          variables,
          mutation: gql,
        })
        .then(async (rawResponse) => ({
          success: true as true,
          rawResponse,
          request,
        }))
        .catch(async (rawResponse) => ({success: false as false, request, rawResponse}));
  }

  static isNetworkError(error: ApolloError): boolean {
    return !!error.networkError;
  }

  static genericError(): Errors.GenericError {
    return {code: "GENERIC_ERROR", message: CoreHelper.formatMessage("Common-genericError")};
  }

  static networkError(): Errors.NetworkError {
    return {code: "NETWORK_ERROR", message: CoreHelper.formatMessage("Common-networkError")};
  }
}
