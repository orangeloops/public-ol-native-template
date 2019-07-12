import {createStackNavigator} from "react-navigation";
import * as Screens from "../screens/Index";

export const Main = createStackNavigator({
  Home: Screens.Home,
});
