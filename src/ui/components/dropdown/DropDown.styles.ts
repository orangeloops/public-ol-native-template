import {TextStyle, ViewStyle} from "react-native";
import {DynamicStyleSheet, DynamicTextStyle} from "react-native-dark-mode";

import {variables} from "../../style/variables";

const dropDownContainer: ViewStyle = {
  borderWidth: 1,
  width: "100%",
  marginTop: 15,
  marginBottom: 5,
  height: 35,
  alignContent: "center",
  justifyContent: "space-between",
  borderColor: "transparent",
  borderBottomColor: variables.lightGreyColor,
};

const chevronStyle: DynamicTextStyle = {
  width: 15,
  height: 20,
  color: variables.primaryColor,
  flex: 1,
  alignSelf: "center",
};

const disabledChevron: TextStyle = {
  width: 15,
  height: 20,
  alignSelf: "center",
  color: variables.lightGreyColor,
};

export const themedStyles = new DynamicStyleSheet({
  wrapper: {
    justifyContent: "flex-end",
  },
  label: {
    position: "absolute",
    ...variables.headingThree,
    color: variables.primaryColor,
  },
  labelAbove: {
    ...variables.subCaption,
  },
  default: {
    ...dropDownContainer,
  },
  textContainer: {
    width: "90%",
  },
  dropDown: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  defaultText: {
    ...variables.headingThree,
    letterSpacing: 0,
    color: variables.primaryColor,
  },
  showingOptions: {
    ...dropDownContainer,
    borderBottomColor: variables.primaryColor,
  },
  disabledText: {
    ...variables.headingThree,
    letterSpacing: 0,
    color: variables.lightGreyColor,
  },
  chevronDefault: {
    ...chevronStyle,
  },
  disabledChevron,
  errorMessage: {
    minHeight: 17,
    fontFamily: "SFProText-Medium",
    fontSize: 12,
    color: variables.alertColor,
  },
  hiddenError: {
    height: 17,
    color: "transparent",
  },
  error: {
    ...dropDownContainer,
    borderBottomColor: variables.alertColor,
  },
  message: {
    ...variables.subCaption,
    marginTop: 4,
    minHeight: 17,
  },
});
