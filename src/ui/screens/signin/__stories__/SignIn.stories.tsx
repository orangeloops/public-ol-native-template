import {storiesOf} from "@storybook/react-native";
import * as React from "react";
import {createAppContainer, createStackNavigator} from "react-navigation";
import {StorybookHelper} from "../../../__stories__/StorybookHelper";
import {SignIn} from "../SignIn";

const SignInContainer = createAppContainer(
  createStackNavigator({
    SignIn,
  })
);

const Default = () => <SignInContainer />;

storiesOf("SignIn", module)
  .addDecorator(StorybookHelper.withApp())
  .add("Default", () => <Default />);
