import {lighten} from "polished";
import {DynamicTextStyle, DynamicValue} from "react-native-dark-mode";

const primaryColor = new DynamicValue("#ed7203", lighten(0.1, "#ed7203"));
const secondaryColor = new DynamicValue("rgb(57,10,118)", lighten(0.25, "rgb(57,10,118)"));
const tertiaryColor = "rgb(0,255,207)";
const alertColor = "rgb(238,135,72)";
const successColor = "rgb(19,201,99)";
const backgroundColor = "rgb(247,242,239)";
const blackColor = "rgb(42,45,51)";
const darkGreyColor = "rgb(105,107,112)";
const lightGreyColor = "rgb(206,209,216)";
const midGreyColor = "rgb(133,139,151)";
const whiteColor = "rgb(255,255,255)";

const headingOne: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Bold",
  fontSize: 26,
  color: new DynamicValue(blackColor, lightGreyColor),
};

const headingTwo: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Bold",
  fontSize: 20,
  color: new DynamicValue(blackColor, lightGreyColor),
};

const headingThree: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Regular",
  fontSize: 17,
  color: new DynamicValue(blackColor, lightGreyColor),
};

const body: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Regular",
  fontSize: 16,
  color: new DynamicValue(blackColor, whiteColor),
};

const caption: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Bold",
  fontSize: 13,
  color: new DynamicValue(darkGreyColor, lightGreyColor),
};

const subCaption: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Bold",
  fontSize: 11,
  color: midGreyColor,
};

const link: DynamicTextStyle = {
  fontFamily: "SourceSansPro-Regular",
  fontSize: 18,
  color: secondaryColor,
};

export const variables = {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  alertColor,
  successColor,
  backgroundColor,
  blackColor,
  midGreyColor,
  whiteColor,
  darkGreyColor,
  lightGreyColor,

  headingOne,
  headingTwo,
  headingThree,
  body,
  caption,
  subCaption,
  link,
};
