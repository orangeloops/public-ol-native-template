import {observer} from "mobx-react";
import * as React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";

import {DataStore} from "../../../core/stores/DataStore";
import {AppConfig} from "../../AppConfig";
import {AppStore} from "../../stores/AppStore";
import {styles} from "./SignIn.styles";

export const SignIn: React.FunctionComponent = observer(() => {
  const {position} = AppConfig.Components.SignIn.options.signInButton;

  const handleSignIn = React.useCallback(async () => {
    const dataStore = new DataStore();
    const appStore = new AppStore();
    const {authenticationState} = dataStore;

    if (authenticationState.loadingSignIn) return;

    appStore.showComponent("loading", {});
    const signInResponse = await dataStore.signIn({email: "email", password: "password"});
    appStore.hideComponent("loading");

    if (signInResponse.success) {
      const {navigationStore} = appStore;
      navigationStore.navigateTo("Home");
    } else alert("Sign in unsuccessful");
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="email" placeholderTextColor="lightgray" />
            <TextInput style={styles.input} placeholder="password" secureTextEntry={true} placeholderTextColor="lightgray" />
          </View>

          <TouchableOpacity style={[styles.button, position === "right" && styles.buttonRight, position === "left" && styles.buttonLeft]} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
