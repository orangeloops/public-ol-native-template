import {observer} from "mobx-react";
import * as React from "react";
import {GestureResponderEvent, Keyboard, StyleProp, Text, TouchableHighlightProps, ViewStyle} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";
import {TouchableOpacity} from "react-native-gesture-handler";

import {Spinner} from "../spinner/Spinner";
import {themedStyles} from "./Button.styles";

export type ButtonProps = TouchableHighlightProps & {
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = observer((props) => {
  const {children, style, isLoading, ...rest} = props;

  const handlePress = React.useCallback(
    (e: GestureResponderEvent) => {
      const {onPress} = props;

      Keyboard.dismiss();

      if (onPress) onPress(e);
    },
    [props.onPress]
  );

  const styles = useDynamicStyleSheet(themedStyles);

  const buttonStyles = [styles.button, props.disabled && styles.buttonDisabled, isLoading && styles.buttonLoading, style];
  const textStyles = [styles.text];

  return (
    <TouchableOpacity {...rest} style={buttonStyles} disabled={props.disabled} onPress={handlePress} containerStyle={[styles.buttonContainer, props.containerStyle]}>
      <>
        {isLoading ? (
          <Spinner />
        ) : typeof children === "string" ? (
          <Text style={textStyles} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </>
    </TouchableOpacity>
  );
});
