import {observer} from "mobx-react";
import * as React from "react";
import {Button, View} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";

import {NavigationHelper} from "../../navigation/NavigationHelper";
import {Routes, StackScreenProps} from "../../navigation/Routes";
import {themedStyles} from "./ExampleModal.styles";

export type ExampleModalProps = StackScreenProps<Routes, "ExampleModal">;

export const ExampleModal: React.FC<ExampleModalProps> = observer((props) => {
  const styles = useDynamicStyleSheet(themedStyles);

  return (
    <View style={styles.container}>
      <Button title="Test" onPress={() => NavigationHelper.showModal({screen: "ExampleModal"})} />
    </View>
  );
});
