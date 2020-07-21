import {DarkTheme} from "@react-navigation/native";
import {getLuminance, hsl, parseToHsl} from "polished";
import * as React from "react";
import {Platform, StatusBar as RNStatusBar, StatusBarProps as RNStatusBarProps} from "react-native";
import {useDarkMode} from "react-native-dark-mode";
import changeNavigationBarColor from "react-native-navigation-bar-color";

import {UIHelper} from "../../utils/UIHelper";

const isAndroid = Platform.OS === "android";

export type StatusBarProps = RNStatusBarProps;

export const StatusBar: React.FC<StatusBarProps> = (props) => {
  if (isAndroid) {
    const isDark = useDarkMode();

    React.useLayoutEffect(() => {
      const color = hsl(parseToHsl(DarkTheme.colors.background));
      const isLight = getLuminance(color) > 0.179;
      changeNavigationBarColor(color, isLight, false);
    }, [isDark]);
  }

  return !UIHelper.isStorybook ? <RNStatusBar {...props} /> : null;
};
