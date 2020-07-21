import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {observer} from "mobx-react";
import React from "react";
import {Dimensions, Platform} from "react-native";
import {register} from "react-native-bundle-splitter";
import {useDarkMode} from "react-native-dark-mode";

import {StatusBar} from "../components/statusbar/StatusBar";
import {variables} from "../style/variables";
import {NavigationHelper} from "./NavigationHelper";
import {NavigatorRouteParamList, Routes} from "./Routes";
import {Screens} from "./Screens";

type RootSwitchParamList = NavigatorRouteParamList<Routes>;

const RootStack = createStackNavigator<RootSwitchParamList>();

const darkTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: variables.secondaryColor.dark,
  },
};

const lightTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: variables.secondaryColor.light,
  },
};

const ExampleModal = register({
  name: "ExampleModal",
  require: () => ({default: require("../screens/examplemodal/ExampleModal").ExampleModal}),
});

const SectionModal = register({
  name: "SectionModal",
  require: () => ({default: require("../screens/sectionmodal/SectionModal").SectionModal}),
});

export const Root = observer(() => {
  const {appContainerRef} = NavigationHelper;

  const isDark = useDarkMode();

  const modalOptions = React.useMemo<React.ComponentProps<typeof RootStack.Screen>["options"]>(
    () => ({
      cardStyle: {
        backgroundColor: "transparent",
      },
      gestureResponseDistance: {
        vertical: Dimensions.get("window").height,
      },
      cardShadowEnabled: true,
    }),
    []
  );

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent={true} backgroundColor={Platform.OS === "android" && Platform.Version < 23 ? "rgba(0,0,0,.4)" : "transparent"} />

      <NavigationContainer ref={appContainerRef} theme={isDark ? darkTheme : lightTheme}>
        <RootStack.Navigator headerMode="none" mode="modal">
          <RootStack.Screen name="Screens" component={Screens} />
          <RootStack.Screen name="ExampleModal" component={ExampleModal} options={modalOptions} />
          <RootStack.Screen name="SectionModal" component={SectionModal} options={modalOptions} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
});
