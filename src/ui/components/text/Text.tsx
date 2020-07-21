import * as React from "react";
import {Text as RNText, TextProps as RNTextProps, TextStyle} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";

import {themedStyles} from "./Text.styles";

export type TextProps = RNTextProps;

export const Text: React.FC<TextProps> = (props) => {
  const styles = useDynamicStyleSheet(themedStyles);

  return <RNText {...props} style={[styles.text as TextStyle, props.style]} />;
};
