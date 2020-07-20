import {observer} from "mobx-react";
import * as React from "react";
import {Animated, Text, TextStyle, TouchableHighlightProps, View} from "react-native";
import {useDynamicStyleSheet, useDynamicValue} from "react-native-dark-mode";
import {TouchableOpacity} from "react-native-gesture-handler";

import ChevronDown from "../../assets/chevronDown.svg";
import ChevronUp from "../../assets/chevronUp.svg";
import {variables} from "../../style/variables";
import {themedStyles} from "./DropDown.styles";

export type DropDownInputProps = TouchableHighlightProps & {
  disabled?: boolean;
  isShowingOptions?: boolean;
  error?: boolean;
  message?: string | React.ReactNode;
  label?: string;
  children?: string;
  onFocusStateChange?: (isFocused: boolean) => void;
};

export const DropDown: React.FC<DropDownInputProps> = observer((props) => {
  const styles = useDynamicStyleSheet(themedStyles);
  const MAX_POSITION = 21;

  const {disabled, isShowingOptions, children, style, error, message, label, onFocusStateChange} = props;

  const isFocused = React.useMemo(() => children !== undefined && children.length > 0, [children]);

  if (onFocusStateChange) {
    React.useEffect(() => {
      onFocusStateChange(isFocused);
    }, [isFocused]);
  }

  const buttonStyles = [styles.default, isShowingOptions && styles.showingOptions, disabled && styles.default, error && styles.error, style];
  const textStyles = [styles.defaultText, disabled && styles.disabledText];
  const showAbove = isFocused || (children && children.length > 0);

  const labelPositionAnimationRef = React.useRef<Animated.Value>();
  if (!labelPositionAnimationRef.current) labelPositionAnimationRef.current = new Animated.Value(showAbove ? 0 : MAX_POSITION);

  React.useEffect(() => {
    const animation = Animated.timing(labelPositionAnimationRef.current!, {toValue: showAbove ? 0 : MAX_POSITION, duration: 150, useNativeDriver: false});
    animation.start();

    return animation.stop;
  }, [showAbove]);

  const primaryColor = useDynamicValue(variables.primaryColor);

  return (
    <View style={styles.wrapper}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            showAbove && styles.labelAbove,
            {
              top: labelPositionAnimationRef.current,
              fontSize: labelPositionAnimationRef.current.interpolate({
                inputRange: [0, MAX_POSITION],
                outputRange: [11, 17],
              }),
              color: labelPositionAnimationRef.current.interpolate({
                inputRange: [0, MAX_POSITION],
                outputRange: [disabled ? variables.lightGreyColor : variables.midGreyColor, primaryColor],
              }),
            },
          ]}>
          {label}
        </Animated.Text>
      )}
      <TouchableOpacity {...props} style={buttonStyles} disabled={disabled}>
        <View style={styles.dropDown}>
          <View style={styles.textContainer}>
            <Text style={textStyles as TextStyle} numberOfLines={1}>
              {children}
            </Text>
          </View>

          {isShowingOptions ? <ChevronUp style={styles.chevronDefault as TextStyle} /> : <ChevronDown style={(disabled ? styles.disabledChevron : styles.chevronDefault) as TextStyle} />}
        </View>
      </TouchableOpacity>

      {typeof message === "string" || !message ? <Text style={[styles.message as TextStyle, error && styles.errorMessage, !message && styles.hiddenError]}>{message}</Text> : message}
    </View>
  );
});
