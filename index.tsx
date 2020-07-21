import "core-js/stable";
import "regenerator-runtime/runtime";
import "./config/env";
import "moment/min/locales";
import "react-native-gesture-handler";
import "./src/ui/AppConfig";
import "mobx-react-lite/batchingForReactNative";

import * as React from "react";
import {AppRegistry, StatusBar, YellowBox} from "react-native";
import DeviceInfo from "react-native-device-info";
import {enableScreens} from "react-native-screens";
import SplashScreen from "react-native-splash-screen";

import {GraphQLAPIClient} from "./src/core/apiclients/graphql/GraphQLAPIClient";
import {App} from "./src/ui/App";

enableScreens();

YellowBox.ignoreWarnings(["Remote debugger", "AsyncStorage has", "Can't perform a React state update", "-[RCTRootView cancelTouches]` is deprecated", "measureLayoutRelativeToContainingList threw an error ", "You should only render"]);

let Component: React.FC;
if (process.env.IS_STORYBOOK === "true") {
  const StorybookUI = require("./storybook").default;
  const Storybook = () => (
    <>
      <StatusBar barStyle="dark-content" />
      <StorybookUI barStyle="dark-content" />
    </>
  );
  Component = Storybook;

  SplashScreen.hide();
} else {
  Component = App;
}

if (!process.env.APP_NAME) throw new Error();

AppRegistry.registerComponent(process.env.APP_NAME, () => () => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useState(async () => {
    if (process.env.IS_SERVER_MOCKED === "true") {
      const {createGraphQLAPIClientMock} = require("./src/core/apiclients/graphql/__mocks__/GraphQLAPIClientMock");
      const {userDefault} = require("./src/core/apiclients/graphql/__mocks__/User.mock");

      createGraphQLAPIClientMock({initialMockedData: {users: [userDefault]}});
    } else
      GraphQLAPIClient.configureClient({
        userAgent: await DeviceInfo.getUserAgent(),
        shouldRefreshToken: () => false,
        onRefreshToken: (accessToken) => {},
      });

    setShouldRender(true);
  });

  return shouldRender ? <Component /> : null;
});
