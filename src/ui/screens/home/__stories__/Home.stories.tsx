import {storiesOf} from "@storybook/react-native";
import * as React from "react";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

import {StorybookHelper} from "../../../__stories__/StorybookHelper";
import {Home} from "../Home";

const HomeContainer = createAppContainer(
  createStackNavigator({
    Home,
  })
);

const Default = () => <HomeContainer />;

storiesOf("Home", module)
  .addDecorator(StorybookHelper.withApp())
  .add("Default", () => <Default />);
