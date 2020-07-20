import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import {boolean, text} from "@storybook/addon-knobs";
import {storiesOf} from "@storybook/react-native";
import * as React from "react";
import {Dimensions, View} from "react-native";

import {StorybookHelper} from "../../../__stories__";
import {useObserverComponent} from "../../../hooks/useObserverComponent";
import {ModalSectionData, SectionModal} from "../../../screens/sectionmodal/SectionModal";
import {DropDown} from "../DropDown";

const Default = () => {
  const Stack = createStackNavigator();

  const label = text("label", "Label");

  const error = boolean("error", false);
  const message = text("errorMessage", "Error message");

  const items = [
    {id: "1", value: "White"},
    {id: "2", value: "Black"},
    {id: "3", value: "Green"},
    {id: "4", value: "Yellow"},
    {id: "5", value: "Blue"},
    {id: "6", value: "Red"},
  ];

  const [selectedItem, setSelectedItem] = React.useState<ModalSectionData>();

  const [isShowingOptions, setIsShowingOptions] = React.useState(false);

  const Screen = useObserverComponent<{navigation: StackNavigationProp<any, "DropDown">}, {isShowingOptions: boolean; selectedItem: ModalSectionData | undefined}>(
    (props) => {
      const {isShowingOptions, selectedItem} = props;

      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", width: "100%"}}>
          <View style={{width: "80%"}}>
            <DropDown
              label={label}
              error={error}
              message={message}
              isShowingOptions={isShowingOptions}
              onPress={() => {
                setIsShowingOptions(true);
                props.navigation.navigate({
                  name: "SectionModal",
                  params: {
                    selected: selectedItem,
                    onSelect: (item: any) => {
                      setIsShowingOptions(false);
                      setSelectedItem(item);
                    },
                    data: items,
                    onClose: () => setIsShowingOptions(false),
                  },
                });
              }}>
              {selectedItem?.value}
            </DropDown>
          </View>
        </View>
      );
    },
    {
      isShowingOptions,
      selectedItem,
    }
  );

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" mode="modal">
        <Stack.Screen name="DropDown" component={Screen} />
        <Stack.Screen
          name="SectionModal"
          component={SectionModal}
          options={{
            cardStyle: {
              backgroundColor: "transparent",
            },
            cardShadowEnabled: false,
            gestureResponseDistance: {
              vertical: Dimensions.get("window").height,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

storiesOf("Components", module)
  .addDecorator(StorybookHelper.withApp())
  .add("DropDown", () => <Default />);
