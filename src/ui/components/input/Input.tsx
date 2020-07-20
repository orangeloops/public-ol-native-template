import {observer} from "mobx-react";
import * as React from "react";
import {Animated, LayoutChangeEvent, NativeSyntheticEvent, StyleProp, Text, TextInput, TextInputFocusEventData, TextInputProps as RNTextInputProps, TextStyle, TouchableOpacity, TouchableOpacityProps, View} from "react-native";
import {useDarkMode, useDynamicStyleSheet} from "react-native-dark-mode";

import {variables} from "../../style/variables";
import {UIHelper} from "../../utils/UIHelper";
import {Spinner} from "../spinner/Spinner";
import {themedStyles} from "./Input.styles";

export type InputProps = RNTextInputProps & {
  inputRef?: React.MutableRefObject<TextInput | null>;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  value: string;
  error?: boolean;
  message?: string | React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
};

export const Input: React.FC<InputProps> = observer((props) => {
  const {inputStyle, label, value, error, message, disabled, isLoading, style: customStyle, ...inputProps} = props;
  const styles = useDynamicStyleSheet(themedStyles);

  const isDark = useDarkMode();

  const [isFocused, setIsFocused] = React.useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);
  const [showPasswordOption, setShowPasswordOption] = React.useState(false);
  const [rightContainerWidth, setRightContainerWidth] = React.useState(0);
  const [labelSize, setLabelSize] = React.useState({width: 0, height: 0});
  const [inputContainerSize, setInputContainerSize] = React.useState({width: 0, height: 0});

  const showAbove = isFocused || value.length > 0;
  const labelPositionAnimationRef = React.useRef<Animated.Value>();
  if (!labelPositionAnimationRef.current) labelPositionAnimationRef.current = new Animated.Value(showAbove ? 0 : 20);

  const inputRef = React.useRef<TextInput>(null);

  const textInputStyle: StyleProp<TextStyle>[] = [styles.textInput as TextStyle, isFocused && (styles.textInputFocused as TextStyle), error && (styles.inputError as TextStyle), disabled && (styles.textInputDisabled as TextStyle)];

  React.useEffect(() => {
    if (props.inputRef) props.inputRef.current = inputRef.current;
  }, []);

  React.useEffect(() => {
    const animation = Animated.timing(labelPositionAnimationRef.current!, {toValue: showAbove ? 0 : 20, duration: 150, useNativeDriver: false});
    animation.start();

    return () => animation.stop();
  }, [showAbove]);

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const {onFocus} = props;
      setIsFocused(true);
      setShowPasswordOption(true);

      if (onFocus) onFocus(e);
    },
    [props.onFocus]
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const {onBlur} = props;
      setIsFocused(false);
      setShowPasswordOption(false);

      if (onBlur) onBlur(e);
    },
    [props.onBlur]
  );

  const handlePasswordVisibility = React.useCallback<Exclude<TouchableOpacityProps["onPress"], undefined>>(
    (e) => {
      e.preventDefault();
      setIsPasswordHidden(!isPasswordHidden);
    },
    [isPasswordHidden]
  );

  const handleRightContainerLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;

    setRightContainerWidth(width);
  }, []);

  const handleLabelSize = React.useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;

    setLabelSize({width, height});
  }, []);

  const handleInputContainerLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;

    setInputContainerSize({width, height});
  }, []);

  const labelAboveScale = 0.8;

  return (
    <View style={customStyle}>
      <View style={styles.textInputContainer} onLayout={handleInputContainerLayout}>
        {label && (
          <Animated.Text
            onLayout={handleLabelSize}
            style={[
              styles.label,
              {
                color: labelPositionAnimationRef.current.interpolate({
                  inputRange: [0, 20],
                  outputRange: [disabled ? variables.lightGreyColor : variables.midGreyColor, isDark ? variables.primaryColor.dark : variables.primaryColor.light],
                }),
              },
              {
                transform: [
                  {
                    translateY: labelPositionAnimationRef.current.interpolate({
                      inputRange: [0, 20],
                      outputRange: [-labelSize.height * labelAboveScale - 2, (inputContainerSize.height - 10) / 2 - labelSize.height / 2],
                    }),
                  },
                  {
                    translateX: labelPositionAnimationRef.current.interpolate({
                      inputRange: [0, 20],
                      outputRange: [-(labelSize.width - labelSize.width * labelAboveScale) / 2, 0],
                    }),
                  },
                  {
                    scale: labelPositionAnimationRef.current.interpolate({
                      inputRange: [0, 20],
                      outputRange: [labelAboveScale, 1],
                    }),
                  },
                ],
              },
            ]}>
            {label}
          </Animated.Text>
        )}

        <TextInput
          {...inputProps}
          ref={inputRef}
          value={value}
          style={[textInputStyle, {paddingRight: rightContainerWidth}, props.inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={isDark ? variables.primaryColor.dark : variables.primaryColor.light}
          secureTextEntry={props.secureTextEntry && isPasswordHidden}
          editable={!disabled}
        />

        <View style={styles.rightContainer} onLayout={handleRightContainerLayout}>
          {props.secureTextEntry && showPasswordOption && (
            <TouchableOpacity style={styles.passwordOption} onPress={handlePasswordVisibility}>
              <Text style={styles.visiblePassword}>{isPasswordHidden ? UIHelper.formatMessage("Input-show") : UIHelper.formatMessage("Input-hide")}</Text>
            </TouchableOpacity>
          )}

          {isLoading && <Spinner style={styles.spinner} />}
        </View>
      </View>

      {typeof message === "string" || !message ? <Text style={[styles.message as TextStyle, error && styles.errorMessage, !message && styles.hiddenError]}>{message}</Text> : message}
    </View>
  );
});
