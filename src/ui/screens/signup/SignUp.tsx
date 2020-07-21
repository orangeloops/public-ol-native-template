import {observer} from "mobx-react";
import * as React from "react";
import {View} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";

import {Text} from "../../components/text/Text";
import {NavigatorRoutes, Routes, StackScreenProps} from "../../navigation/Routes";
import {UIHelper} from "../../utils/UIHelper";
import {themedStyles} from "./SignUp.styles";

export type SignUpProps = StackScreenProps<NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>["Public"], "SignUp">;

export const SignUp: React.FC<SignUpProps> = observer((props) => {
  const styles = useDynamicStyleSheet(themedStyles);

  return (
    <View style={styles.container}>
      <Text>{UIHelper.formatMessage("SignUp-title")}</Text>
    </View>
  );
});
