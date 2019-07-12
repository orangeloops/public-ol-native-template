import {createStackNavigator} from "react-navigation";
import * as Screens from "../screens/Index";

export const Public = createStackNavigator({
  SignIn: Screens.SignIn,
});
