import * as Errors from "../../Errors";
import * as Models from "../../models";

export type AuthenticatedRequest = {
  accessToken: Models.AccessToken;
};

export type FetchUserRequest = AuthenticatedRequest;
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

export type RefreshTokenRequest = {
  refreshToken: string;
};
export type SuccessfulRefreshTokenResponse = {
  success: true;
  accessToken: Models.AccessToken;
};
export type FailedRefreshTokenResponse = {
  success: false;
  error: Errors.NetworkError | Errors.GenericError;
};
export type RefreshTokenResponse = SuccessfulRefreshTokenResponse | FailedRefreshTokenResponse;

export type SignInRequest = {
  email: string;
  password: string;
};
export type SuccessfulSignInResponse = {
  success: true;
  accessToken: Models.AccessToken;
};
export type FailedSignInResponse = {
  success: false;
  error: Errors.NetworkError | Errors.GenericError;
};
export type SignInResponse = SuccessfulSignInResponse | FailedSignInResponse;
