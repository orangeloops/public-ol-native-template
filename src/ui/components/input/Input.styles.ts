import {DynamicStyleSheet, DynamicTextStyle} from "react-native-dark-mode";

import {variables} from "../../style/variables";

const textInput: DynamicTextStyle = {
  ...variables.body,
  height: 35,
  width: "100%",
  paddingVertical: 0,

  borderWidth: 1,
  borderBottomColor: variables.lightGreyColor,
  borderColor: "transparent",
};

export const themedStyles = new DynamicStyleSheet({
  textInputContainer: {
    position: "relative",
    flexDirection: "row",

    marginTop: 15,
    marginBottom: 5,
  },
  textInput,
  textInputFocused: {
    ...textInput,
    borderBottomColor: variables.lightGreyColor,
  },
  textInputDisabled: {
    ...textInput,
    color: variables.lightGreyColor,
  },
  rightContainer: {
    position: "absolute",
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  symbolContainer: {
    flex: 1,
    justifyContent: "center",

    paddingHorizontal: 5,
  },
  symbol: {
    color: variables.midGreyColor,

    fontSize: 20,
  },
  symbolDisabled: {
    color: variables.lightGreyColor,

    fontSize: 20,
  },
  label: {
    ...variables.headingThree,
    position: "absolute",

    color: variables.primaryColor,
  },
  inputError: {
    ...textInput,
    borderBottomColor: variables.alertColor,
  },
  message: {
    ...variables.subCaption,
    minHeight: 17,
  },
  errorMessage: {
    minHeight: 17,

    color: variables.alertColor,

    fontSize: 12,
  },
  hiddenError: {
    height: 17,

    color: "transparent",
  },
  visiblePassword: {
    color: variables.primaryColor,

    fontSize: 13,
  },
  passwordOption: {
    justifyContent: "center",
    height: "100%",

    marginBottom: 5,
    width: "auto",
    paddingLeft: 0,
  },
  spinner: {
    height: 20,
    width: 20,
  },
});
