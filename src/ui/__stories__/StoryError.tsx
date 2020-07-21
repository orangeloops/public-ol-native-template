import * as React from "react";
import {TextStyle, View} from "react-native";
import {DynamicStyleSheet, useDynamicStyleSheet} from "react-native-dark-mode";
import {useSafeArea} from "react-native-safe-area-context";

import {Button} from "../components/button/Button";
import {Text} from "../components/text/Text";
import {variables} from "../style/variables";

const themedStyles = new DynamicStyleSheet({
  title: {
    ...variables.headingTwo,
    marginBottom: 10,
    textAlign: "center",
  },
  body: {
    ...variables.body,
    marginBottom: 40,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const StoryError: React.FC<{title?: string; error: false | {message: string}; onRetry: () => void}> = (props) => {
  const insets = useSafeArea();
  const styles = useDynamicStyleSheet(themedStyles);

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <Text style={styles.title as TextStyle}>{props.title ? props.title : "This story could not be loaded"}</Text>

      <Text style={styles.body as TextStyle}>{props.error ? props.error.message : "There was an error trying to prepare the story."}</Text>

      <Button onPress={props.onRetry}>Retry</Button>
    </View>
  );
};
