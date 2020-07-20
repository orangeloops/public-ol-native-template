import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import {register} from "react-native-bundle-splitter";

import {NavigatorRouteParamList, NavigatorRoutes, Routes} from "./Routes";

type MainStackParamList = NavigatorRouteParamList<NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>["Main"]>;

export const Stack = createStackNavigator<MainStackParamList>();

export const Home = register({
  name: "Home",
  require: () => ({default: require("../screens/home/Home").Home}),
});

export const Main: React.FC = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);
