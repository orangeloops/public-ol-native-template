import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {storiesOf} from "@storybook/react-native";
import * as React from "react";

import {StorybookHelper} from "../../../__stories__/StorybookHelper";
import {SignIn} from "../SignIn";

const Stack = createStackNavigator();

const SignInContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Default = () => <SignInContainer />;

storiesOf("SignIn", module)
  .addDecorator(StorybookHelper.withApp())
  .add("Default", () => <Default />);
