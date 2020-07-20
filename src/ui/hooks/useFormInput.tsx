import * as React from "react";
import {TextInput} from "react-native";

import {InputProps} from "../components/input/Input";

export type UseFormInputOptions = {
  validate?: (value: string) => string[];
  format?: (value: string, oldValue: string) => string;
  onChangeText?: (text: string) => void;
  defaultValue?: string;
};

export const useFormInput = (options: UseFormInputOptions = {}) => {
  const [value, setValue] = React.useState(options.defaultValue || "");
  const [oldValue, setOldValue] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [externalError, setExternalError] = React.useState<string>();

  const validate = React.useCallback(options.validate || (() => []), [options.validate]);

  const errors = React.useMemo(() => {
    const validationErrors = validate(value);

    if (validationErrors.length > 0) return validationErrors;

    return externalError ? [externalError] : [];
  }, [validate, value, showError, externalError]);

  const inputRef = React.useRef<TextInput>(null);
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      newValue = options.format ? options.format(newValue, value) : newValue;
      setShowError(false);
      setValue(newValue);
      setOldValue(value);

      if (options.onChangeText) options.onChangeText(newValue);
    },
    [value, oldValue, options.format]
  );
  const handleBlur = React.useCallback(() => {
    setShowError(validate(value).length !== 0);
    setValue(value.trim());
  }, [value, validate]);

  const inputProps: Required<Pick<InputProps, "inputRef" | "value" | "error" | "onChangeText" | "onBlur">> & Pick<InputProps, "message"> = {
    inputRef,
    value,
    error: showError,
    message: showError ? errors[0] : undefined,
    onChangeText: handleValueChange,
    onBlur: handleBlur,
  };

  const showErrors = React.useCallback(() => {
    const error = validate(value).length !== 0;
    setShowError(error);

    return error;
  }, [validate, value]);

  const addExternalError = React.useCallback(
    (errorMessage: string) => {
      setShowError(true);
      setExternalError(errorMessage);
    },
    [errors]
  );

  return {
    inputProps,
    showErrors,
    addExternalError,
  };
};
