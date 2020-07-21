import {createStackNavigator, HeaderBackButton} from "@react-navigation/stack";
import {StackHeaderLeftButtonProps} from "@react-navigation/stack/src/types";
import React from "react";
import {register} from "react-native-bundle-splitter";
import {DynamicStyleSheet, useDynamicStyleSheet} from "react-native-dark-mode";

import {Welcome} from "../screens/welcome/Welcome";
import {variables} from "../style/variables";
import {UIHelper} from "../utils/UIHelper";
import {NavigatorRouteParamList, NavigatorRoutes, Routes} from "./Routes";

type PublicStackParamList = NavigatorRouteParamList<NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>["Public"]>;

export const Stack = createStackNavigator<PublicStackParamList>();

const SignIn = register({
  name: "SignIn",
  require: () => ({default: require("../screens/signin/SignIn").SignIn}),
});

const SignUp = register({
  name: "SignUp",
  require: () => ({default: require("../screens/signup/SignUp").SignUp}),
});

export const Public: React.FC = () => {
  const screenOptions: React.ComponentProps<typeof Stack.Navigator>["screenOptions"] = React.useCallback(
    () => ({
      headerBackTitle: (null as unknown) as string,
      headerTitle: (null as unknown) as string,
      headerTransparent: true,
      headerLeft: UIHelper.renderObserverComponent((props: StackHeaderLeftButtonProps) => {
        const themedStyles = React.useMemo(
          () =>
            new DynamicStyleSheet({
              label: {
                ...variables.link,
              },
            }),
          []
        );
        const styles = useDynamicStyleSheet(themedStyles);

        return props.canGoBack ? <HeaderBackButton {...props} labelStyle={styles.label} /> : null;
      }),
    }),
    []
  );

  return (
    <Stack.Navigator headerMode="screen" screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};
