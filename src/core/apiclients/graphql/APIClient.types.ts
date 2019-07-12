import * as Errors from "../../Errors";
import * as Models from "../../models";

export type APIRequest = {
  authToken?: string;
};

export type FetchUserRequest = APIRequest & {
  authToken: string;
};
export type SuccessfulFetchUserResponse = {
  success: true;
  user: Models.User;
};
export type FailedFetchUserResponse = {
  success: false;
  user?: undefined;
  error: Errors.NetworkError | Errors.GenericError;
};
export type FetchUserResponse = SuccessfulFetchUserResponse | FailedFetchUserResponse;
