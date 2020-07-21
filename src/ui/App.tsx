import "./AppConfig";

import {observer} from "mobx-react";
import * as React from "react";
import {View} from "react-native";
import {useDynamicStyleSheet} from "react-native-dark-mode";
import {initialWindowSafeAreaInsets, SafeAreaProvider} from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import {getTimeSinceStartup} from "react-native-startup-time";

import {themedStyles} from "./App.styles";
import {Root} from "./navigation";
import {AppStore} from "./stores/AppStore";

export const App: React.FC = observer((props) => {
  const {children} = props;
  const styles = useDynamicStyleSheet(themedStyles);

  const appStore = AppStore.getInstance();

  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (appStore.state.initialized) {
      if (!shouldRender) setShouldRender(true);

      return;
    }

    if (appStore.state.initializing) return;

    const initializeAppStore = async () => {
      await appStore.initialize();

      setShouldRender(true);
    };

    initializeAppStore();
  }, [shouldRender, appStore.state.initializing, appStore.state.initialized]);

  React.useEffect(() => {
    SplashScreen.hide();

    (async () => {
      console.log(await getTimeSinceStartup());
    })();
  }, []);

  return shouldRender ? (
    <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
      <View style={styles.wrapper}>{children || <Root />}</View>
    </SafeAreaProvider>
  ) : null;
});
