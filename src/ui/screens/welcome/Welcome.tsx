import {observer} from "mobx-react";
import * as React from "react";
import {TextStyle, View} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useSafeArea} from "react-native-safe-area-context";

import {Button} from "../../components/button/Button";
import {Text} from "../../components/text/Text";
import {NavigationHelper} from "../../navigation/NavigationHelper";
import {NavigatorRoutes, Routes, StackScreenProps} from "../../navigation/Routes";
import {UIHelper} from "../../utils/UIHelper";
import {themedStyles} from "./Welcome.styles";

export type WelcomeProps = StackScreenProps<NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>["Public"], "Welcome">;

export const Welcome: React.FC<WelcomeProps> = observer((props) => {
  const styles = useDynamicStyleSheet(themedStyles);
  const safeAreaInsets = useSafeArea();

  const handleSignUp = React.useCallback(() => {
    NavigationHelper.navigateTo({
      screen: "Public",
      params: {screen: "SignUp"},
    });
  }, []);

  const handleSignIn = React.useCallback(() => {
    NavigationHelper.navigateTo({
      screen: "Public",
      params: {screen: "SignIn"},
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.title as TextStyle, {marginTop: safeAreaInsets.top}]}>{UIHelper.formatMessage("Welcome-title")}</Text>

      <Button containerStyle={styles.signUpButton} onPress={handleSignUp}>
        {UIHelper.formatMessage("Welcome-signUp")}
      </Button>

      <Text style={styles.signInHeading}>{UIHelper.formatMessage("Welcome-signInHeading")}</Text>

      <TouchableOpacity onPress={handleSignIn} containerStyle={[styles.signInButton, {marginBottom: safeAreaInsets.bottom + 20}]}>
        <Text style={styles.signInText as TextStyle}>{UIHelper.formatMessage("Welcome-signIn")}</Text>
      </TouchableOpacity>
    </View>
  );
});
