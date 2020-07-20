import * as React from "react";
import {Text, View} from "react-native";
import {useSafeArea} from "react-native-safe-area-context";

import {Spinner} from "../components/spinner/Spinner";

export const StoryLoading: React.FC = () => {
  const insets = useSafeArea();

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <Spinner style={{width: 40, height: 40}} />

      <Text style={{marginTop: 10}}>Loading story...</Text>
    </View>
  );
};
