import * as React from "react";
import {createAppContainer, createStackNavigator} from "react-navigation";
import {storiesOf} from "@storybook/react-native";
import {StorybookHelper} from "../../../__stories__/StorybookHelper";
import {Placeholder} from "../Placeholder";

const PlaceholderContainer = createAppContainer(
  createStackNavigator({
    Placeholder,
  })
);

const Default = () => <PlaceholderContainer />;

storiesOf("Placeholder", module)
  .addDecorator(StorybookHelper.withApp())
  .add("Default", () => <Default />);
