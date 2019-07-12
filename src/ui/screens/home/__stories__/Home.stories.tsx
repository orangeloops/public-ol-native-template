import * as React from "react";
import {createAppContainer, createStackNavigator} from "react-navigation";
import {storiesOf} from "@storybook/react-native";
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
