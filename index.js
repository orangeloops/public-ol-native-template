"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "./config/env";
import "moment/min/locales";

import * as React from "react";
import {AppRegistry, StatusBar, YellowBox} from "react-native";
import DeviceInfo from "react-native-device-info";
import SplashScreen from "react-native-splash-screen";

import {mockAPIClient} from "./src/core/apiclients/rest/__mocks__/APIClient.mock";
import {APIClient} from "./src/core/apiclients/rest/APIClient";
import {App} from "./src/ui/App";
import StorybookUI from "./storybook";

YellowBox.ignoreWarnings(["Remote debugger", "Async Storage", "Can't perform a React state update"]);

if (process.env.IS_STORYBOOK === "true") SplashScreen.hide();

APIClient.configureClient({userAgent: DeviceInfo.getUserAgent()});
mockAPIClient();

const storybook = () => (
  <>
    <StatusBar barStyle="dark-content" />

    <StorybookUI />
  </>
);

AppRegistry.registerComponent(process.env.APP_NAME, () => (process.env.IS_STORYBOOK === "true" ? storybook : App));
