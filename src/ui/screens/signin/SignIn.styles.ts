import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  contentContainer: {
    height: 200,
    maxHeight: "50%",
    width: 300,
    maxWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    maxHeight: "90%",
    maxWidth: "100%",
    height: 180,
    width: 260,
    justifyContent: "center",
  },
  inputContainer: {
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "black",
  },
  button: {
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    height: 30,
    width: 60,
    marginTop: 10,
  },
  buttonRight: {
    marginLeft: "auto",
  },
  buttonLeft: {
    marginRight: "auto",
  },
  signInText: {
    alignSelf: "center",
  },
});
