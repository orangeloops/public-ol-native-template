import "./AppConfig";

import {observer} from "mobx-react";
import * as React from "react";
import {StatusBar, View} from "react-native";
import SplashScreen from "react-native-splash-screen";

import {styles} from "./App.styles";
import {Loading} from "./components/loading/Loading";
import {Root} from "./navigators";
import {AppStore} from "./stores/AppStore";

export const App: React.FunctionComponent = observer(props => {
  const {children} = props;

  const appStore = new AppStore();
  const {appContainerRef} = appStore.navigationStore;
  const {stateByComponentType} = new AppStore();

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />

      {children ? children : <Root ref={appContainerRef} />}

      {stateByComponentType.loading && stateByComponentType.loading.shouldRender && <Loading {...stateByComponentType.loading.props} />}
    </View>
  );
});
