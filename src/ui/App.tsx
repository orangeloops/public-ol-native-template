import "./AppConfig";

import {observer} from "mobx-react";
import * as React from "react";
import {StatusBar, View} from "react-native";
import SplashScreen from "react-native-splash-screen";
import {styles} from "./App.styles";
import {BaseComponent} from "./components/BaseComponent";
import {Loading} from "./components/loading/Loading";
import {Root} from "./navigators";

@observer
export class App extends BaseComponent {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const {children} = this.props;
    const {appContainerRef} = this.appStore.navigationStore;
    const {stateByComponentType} = this.appStore;

    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />

        {children ? children : <Root ref={appContainerRef} />}

        {stateByComponentType.loading && stateByComponentType.loading.shouldRender && <Loading {...stateByComponentType.loading.props} />}
      </View>
    );
  }
}
