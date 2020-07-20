import {storiesOf} from "@storybook/react-native";
import * as React from "react";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

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
