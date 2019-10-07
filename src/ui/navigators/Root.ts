import {createAppContainer, createSwitchNavigator} from "react-navigation";

import {Main} from "./Main";
import {Public} from "./Public";

export const Root = createAppContainer(
  createSwitchNavigator({
    Public,
    Main,
  })
);
