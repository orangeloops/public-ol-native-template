import * as Errors from "../../Errors";
import * as Models from "../../models";

export type APIRequest = {
  authToken?: string;
};

export type SignInRequest = APIRequest & {
  email: string;
  password: string;
};
export type SuccessfulSignInResponse = {
  success: true;
  user: Models.User;
  authToken: string;
};
export type FailedSignInResponse = {
  success: false;
  user?: undefined;
  error: Errors.NetworkError | Errors.GenericError;
};
export type SignInResponse = SuccessfulSignInResponse | FailedSignInResponse;

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
