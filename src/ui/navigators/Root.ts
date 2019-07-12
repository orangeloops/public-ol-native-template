import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {Public} from "./Public";
import {Main} from "./Main";

export const Root = createAppContainer(
  createSwitchNavigator({
    Public,
    Main,
  })
);
