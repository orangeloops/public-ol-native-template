export type GenericError = {
  code: "GENERIC_ERROR";
  message: string;
};

export type NetworkError = {
  code: "NETWORK_ERROR";
  message: string;
};

export type AuthenticationError = {
  code: "AUTHENTICATION_ERROR";
  message: string;
};

export type FieldValidationError<T extends string> = {
  code: "FIELD_VALIDATION_ERROR";
  field: T;
};

export type FieldRequiredError<T extends string> = {
  code: "FIELD_REQUIRED_ERROR";
  field: T;
};
