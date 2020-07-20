import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {storiesOf} from "@storybook/react-native";
import * as React from "react";

import {StorybookHelper} from "../../../__stories__/StorybookHelper";
import {createGraphQLAPIClientMock} from "../../../../core/apiclients/graphql/__mocks__/GraphQLAPIClientMock";
import {userDefault} from "../../../../core/apiclients/graphql/__mocks__/User.mock";
import {DataStore} from "../../../../core/stores/DataStore";
import {Home} from "../Home";

const Stack = createStackNavigator();

const HomeContainer = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
);

const Default = () => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const dataStore = DataStore.getInstance();

    createGraphQLAPIClientMock({initialMockedData: {users: [userDefault]}});
    dataStore.signIn({email: userDefault.email, password: userDefault.password}).then(() => setShouldRender(true));
  }, []);

  return shouldRender ? <HomeContainer /> : null;
};

storiesOf("Home", module)
  .addDecorator(StorybookHelper.withApp())
  .add("Default", () => <Default />);
