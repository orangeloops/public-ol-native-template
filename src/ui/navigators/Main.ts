import {createStackNavigator} from "react-navigation-stack";

import * as Screens from "../screens/Index";

export const Main = createStackNavigator({
  Home: Screens.Home,
});
