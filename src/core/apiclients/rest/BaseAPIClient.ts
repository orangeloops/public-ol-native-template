import axios, {AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, Canceler} from "axios";
import * as Errors from "../../Errors";
import {CoreHelper} from "../../utils/CoreHelper";

export type RequestMethod = "head" | "get" | "delete" | "patch" | "post" | "put";

export type RequestConfig<TRequest, TRequestData = {}> = {
  url: string;
  request: TRequest;
  requestMethod: RequestMethod;
  data?: TRequestData;
  timeout?: number;
  headers?: Record<string, string>;
};

export type RequestOptions = {
  cancel?: Canceler;
  onUploadProgress?: (loaded: number, total: number) => void;
  onDownloadProgress?: (loaded: number, total: number) => void;
};

export type SuccessfulResponse<TData> = {
  success: true;
  rawResponse: AxiosResponse<TData>;
};
export type FailedResponse = {
  success: false;
  rawResponse: AxiosError;
};
export type Response<TRequest> =
  | SuccessfulResponse<any>
  | FailedResponse & {
      request: TRequest;
    };

export class BaseAPIClient {
  static async request<TRequest>(client: AxiosInstance, config: RequestConfig<TRequest>, options: RequestOptions = {}): Promise<Response<TRequest>> {
    const {url, request, requestMethod, data} = config;

    const axiosConfig: AxiosRequestConfig = {};

    const source = axios.CancelToken.source();
    axiosConfig.cancelToken = source.token;
    options.cancel = source.cancel;

    if (options.onDownloadProgress) {
      const {onDownloadProgress} = options;

      axiosConfig.onDownloadProgress = e => (e.lengthComputable ? onDownloadProgress(e.loaded, e.total) : onDownloadProgress(1, 1));
    }

    if (options.onUploadProgress) {
      const {onUploadProgress} = options;

      axiosConfig.onDownloadProgress = e => (e.lengthComputable ? onUploadProgress(e.loaded, e.total) : onUploadProgress(1, 1));
    }

    if (config.timeout) axiosConfig.timeout = config.timeout;
    if (config.headers) axiosConfig.headers = config.headers;

    let axiosPromise: AxiosPromise;

    switch (requestMethod) {
      case "delete":
        axiosPromise = client.delete(url, axiosConfig);
        break;
      case "head":
        axiosPromise = client.head(url, axiosConfig);
        break;
      case "patch":
        axiosPromise = client.patch(url, data, axiosConfig);
        break;
      case "post":
        axiosPromise = client.post(url, data, axiosConfig);
        break;
      case "put":
        axiosPromise = client.put(url, data, axiosConfig);
        break;
      case "get":
      default:
        axiosPromise = client.get(url, axiosConfig);
        break;
    }

    return axiosPromise
      .then<Response<TRequest>>(rawResponse => ({
        success: true,
        rawResponse,
        request,
      }))
      .catch(error => ({success: false as false, rawResponse: error, request}));
  }

  static isNetworkError(error: AxiosError): boolean {
    const {response, code} = error;

    return response === undefined && code === "ECONNABORTED";
  }

  static genericError(): Errors.GenericError {
    return {code: "GENERIC_ERROR", message: CoreHelper.formatMessage("Common-genericError")};
  }

  static networkError(): Errors.NetworkError {
    return {code: "NETWORK_ERROR", message: CoreHelper.formatMessage("Common-networkError")};
  }
}
