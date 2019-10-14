import {createStackNavigator} from "react-navigation-stack";

import * as Screens from "../screens/Index";

export const Public = createStackNavigator({
  SignIn: Screens.SignIn,
});
