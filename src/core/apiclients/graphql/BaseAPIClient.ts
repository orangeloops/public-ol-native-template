import {ApolloClient, ApolloError, ApolloQueryResult} from "apollo-client";
import {FetchResult} from "apollo-link";
import * as Errors from "../../Errors";
import {CoreHelper} from "../../utils/CoreHelper";

export type RequestMethod = "query" | "mutation";

export type RequestConfig<TRequest, TRequestMethod extends RequestMethod> = {
  request: TRequest;
  requestMethod: TRequestMethod;
  gql: any;
  variables: Record<string, any>;
  timeout?: number;
  headers?: Record<string, string>;
  context: any;
};

export type RequestOptions = {
  cancel?: () => void;
  onUploadProgress?: (loaded: number, total: number) => void;
  onDownloadProgress?: (loaded: number, total: number) => void;
};

export type SuccessfulResponse<TRequestMethod extends RequestMethod> = {
  success: true;
  rawResponse: TRequestMethod extends "query" ? ApolloQueryResult<any> : FetchResult;
};
export type FailedResponse = {
  success: false;
  rawResponse: ApolloError;
};
export type APIResponse<TRequest, TRequestMethod extends RequestMethod> = (SuccessfulResponse<TRequestMethod> | FailedResponse) & {
  request: TRequest;
};

export class BaseAPIClient {
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

  static getCustomFetch(requestConfig: RequestConfig<unknown, RequestMethod>, requestOptions: RequestOptions) {
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

        Object.keys(options.headers!).forEach(key => {
          xhr.setRequestHeader(key, options.headers![key]);
        });

        if (requestOptions.onDownloadProgress) {
          const {onDownloadProgress} = requestOptions;

          xhr.onprogress = e => (e.lengthComputable ? onDownloadProgress(e.loaded, e.total) : onDownloadProgress(1, 1));
        }

        if (xhr.upload && requestOptions.onUploadProgress) {
          const {onUploadProgress} = requestOptions;

          xhr.upload.onprogress = e => (e.lengthComputable ? onUploadProgress(e.loaded, e.total) : onUploadProgress(1, 1));
        }

        requestOptions.cancel = () => {
          xhr.abort();
        };

        xhr.send(options.body);
      });
  }

  static async request<TRequest>(client: ApolloClient<unknown>, config: RequestConfig<TRequest, "query">, options: RequestOptions): Promise<APIResponse<TRequest, "query">>;
  static async request<TRequest>(client: ApolloClient<unknown>, config: RequestConfig<TRequest, "mutation">, options: RequestOptions): Promise<APIResponse<TRequest, "mutation">>;
  static async request<TRequest>(client: ApolloClient<unknown>, config: RequestConfig<TRequest, RequestMethod>, options: RequestOptions = {}): Promise<APIResponse<TRequest, RequestMethod>> {
    const {request, gql, requestMethod, variables, timeout, headers, context} = config;

    if (requestMethod === "query")
      return client
        .query({
          context: {
            ...context,
            timeout,
            headers,
            requestOptions: options,
          },
          variables,
          query: gql,
        })
        .then(async rawResponse => ({success: true as true, request, rawResponse}))
        .catch(async rawResponse => ({success: false as false, request, rawResponse}));
    else
      return client
        .mutate({
          context: {
            ...context,
            timeout,
            headers,
            requestOptions: options,
          },
          variables,
          mutation: gql,
        })
        .then(async rawResponse => {
          return rawResponse instanceof ApolloError
            ? {
                success: false as false,
                rawResponse,
                request,
              }
            : {
                success: true as true,
                rawResponse,
                request,
              };
        })
        .catch(async rawResponse => ({success: false as false, request, rawResponse}));
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
