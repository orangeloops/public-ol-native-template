import {ViewStyle} from "react-native";
import {DynamicStyleSheet} from "react-native-dark-mode";

import {variables} from "../../style/variables";

const solidStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 15,
  flex: 1,

  borderRadius: 5,
};

export const themedStyles = new DynamicStyleSheet({
  buttonContainer: {
    height: 40,
    flexDirection: "column",
  },
  button: {
    ...solidStyle,
    backgroundColor: variables.secondaryColor,
  },
  buttonDisabled: {
    ...solidStyle,
    backgroundColor: "grey",
  },
  buttonLoading: {
    ...solidStyle,
    backgroundColor: variables.secondaryColor,
  },
  text: {
    color: "rgb(255,255, 255)",

    fontSize: 17,
  },
});
