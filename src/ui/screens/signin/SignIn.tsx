import {boundMethod} from "autobind-decorator";
import {observer} from "mobx-react";
import * as React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {AppConfig} from "../../AppConfig";
import {BaseScreen} from "../BaseScreen";
import {styles} from "./SignIn.styles";

@observer
export class SignIn extends BaseScreen {
  @boundMethod
  protected async handleSignIn() {
    const {appStore, dataStore} = this;
    const {authenticationState} = dataStore;

    if (authenticationState.loadingSignIn) return;

    appStore.showComponent("loading", {});
    const signInResponse = await dataStore.signIn({email: "email", password: "password"});
    appStore.hideComponent("loading");

    if (signInResponse.success) {
      const {navigationStore} = this.appStore;
      navigationStore.navigateTo("Home");
    } else alert("Sign in unsuccessful");
  }

  render() {
    const {position} = AppConfig.Components.SignIn.options.signInButton;

    return (
      <View style={styles.wrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="email" placeholderTextColor="lightgray" />
              <TextInput style={styles.input} placeholder="password" secureTextEntry={true} placeholderTextColor="lightgray" />
            </View>

            <TouchableOpacity style={[styles.button, position === "right" && styles.buttonRight, position === "left" && styles.buttonLeft]} onPress={this.handleSignIn}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
