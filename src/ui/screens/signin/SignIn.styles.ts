import {DynamicStyleSheet} from "react-native-dark-mode";

export const themedStyles = new DynamicStyleSheet({
  wrapper: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputContainer: {
    justifyContent: "center",
  },
  input: {
    alignSelf: "center",
    marginBottom: 10,
    width: "90%",
    paddingHorizontal: 10,

    color: "black",
  },
  buttonContainer: {
    alignSelf: "center",
    marginBottom: 20,
    width: "90%",
  },
  mainLogo: {
    marginTop: 20,
    marginBottom: 40,
    height: 120,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  backLogo: {
    height: 1000,
    width: 1000,
  },
  backLogoContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -220,
    bottom: -150,
    height: 0,
    width: 0,
  },
  scrollViewContainer: {
    alignItems: "center",
  },
});
