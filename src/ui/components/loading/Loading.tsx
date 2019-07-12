import {observer} from "mobx-react";
import * as React from "react";
import {Text, View} from "react-native";
import RNModal from "react-native-modal";
import {AppStore} from "../../stores/AppStore";
import {BaseComponent} from "../BaseComponent";
import {styles} from "./Loading.styles";

export type LoadingProps = {
  isVisible: boolean;
  animationOutTiming?: number;
};

type LoadingState = {};

@observer
export class Loading extends BaseComponent<LoadingProps, LoadingState> {
  render() {
    const {props} = this;
    const {isVisible} = this.props;

    let animationOutTiming = typeof props.animationOutTiming === "number" ? props.animationOutTiming : AppStore.DEFAULT_OUT_ANIMATION_TIMING;

    return (
      <RNModal isVisible={isVisible} animationOutTiming={animationOutTiming}>
        <View style={styles.container}>
          <Text>{this.formatMessage("Common-loadingText")}</Text>
        </View>
      </RNModal>
    );
  }
}
