import {DynamicStyleSheet} from "react-native-dark-mode";

import {variables} from "../../style/variables";

export const themedStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...variables.headingOne,
    marginBottom: 100,

    textAlign: "center",
  },
  signUpButton: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "80%",
    width: 200,
  },
  signInHeading: {
    marginTop: 10,

    textAlign: "center",
  },
  signInButton: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  signInText: {
    ...variables.link,
    textAlign: "center",
  },
});
