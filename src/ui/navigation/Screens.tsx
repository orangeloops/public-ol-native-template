import React from "react";

import {AuthCheck} from "../screens/authcheck/AuthCheck";
import {createSwitchNavigator} from "./createSwitchNavigator";
import {Main} from "./Main";
import {Public} from "./Public";
import {NavigatorRouteParamList, NavigatorRoutes, Routes} from "./Routes";

type ScreensStackParamList = NavigatorRouteParamList<NavigatorRoutes<Routes>["Screens"]>;

export const ScreensSwitch = createSwitchNavigator<ScreensStackParamList>();

export const Screens: React.FC = () => (
  <ScreensSwitch.Navigator headerMode="none">
    <ScreensSwitch.Screen name="AuthCheck" component={AuthCheck} />
    <ScreensSwitch.Screen name="Public" component={Public} />
    <ScreensSwitch.Screen name="Main" component={Main} />
  </ScreensSwitch.Navigator>
);
