import {observer} from "mobx-react";
import * as React from "react";
import {Text, View} from "react-native";
import {BaseScreen} from "../BaseScreen";

import {styles} from "./Home.styles";

@observer
export class Home extends BaseScreen {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    );
  }
}
