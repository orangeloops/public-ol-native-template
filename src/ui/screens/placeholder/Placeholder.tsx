import {observer} from "mobx-react";
import * as React from "react";
import {Text, View} from "react-native";

import {BaseScreen} from "../BaseScreen";
import {styles} from "./Placeholder.styles";

@observer
export class Placeholder extends BaseScreen {
  render() {
    return (
      <View style={styles.container}>
        <Text>Placeholder</Text>
      </View>
    );
  }
}
