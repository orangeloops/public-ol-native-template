import {DynamicStyleSheet} from "react-native-dark-mode";

import {variables} from "../../style/variables";

export const themedStyles = new DynamicStyleSheet({
  text: {
    ...variables.body,
  },
});
