import {DynamicStyleSheet} from "react-native-dark-mode";

import {variables} from "../../style/variables";

export const themedStyles = new DynamicStyleSheet({
  wrapper: {
    marginTop: "auto",
    paddingTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: "50%",

    backgroundColor: variables.lightGreyColor,
  },
  handle: {
    alignSelf: "center",
    height: 5,
    width: "10%",

    borderRadius: 10,
    backgroundColor: variables.midGreyColor,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  itemLabel: {
    ...variables.headingTwo,
    marginLeft: 0,

    color: variables.darkGreyColor,
  },
  list: {
    flexGrow: 1,
  },
  separator: {
    alignSelf: "center",
    height: 1,
    width: "100%",

    backgroundColor: variables.midGreyColor,
  },
  selectedItemLabel: {
    color: variables.primaryColor,
  },
});
