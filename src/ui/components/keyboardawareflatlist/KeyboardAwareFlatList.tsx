import {observer} from "mobx-react";
import * as React from "react";
import {KeyboardAwareFlatList as RNKeyboardAwareFlatList, KeyboardAwareFlatListProps as RNKeyboardAwareFlatListProps} from "react-native-keyboard-aware-scroll-view";
import {useSafeArea} from "react-native-safe-area-context";

export type KeyboardAwareFlatListProps<T> = RNKeyboardAwareFlatListProps<T>;

export class KeyboardAwareFlatList<TItem> extends React.Component<KeyboardAwareFlatListProps<TItem>> {
  render() {
    return <KeyboardAwareFlatListFC {...this.props} />;
  }
}

const KeyboardAwareFlatListFC: React.FC<KeyboardAwareFlatListProps<any>> = observer((props) => {
  const safeAreaInsets = useSafeArea();

  return (
    <RNKeyboardAwareFlatList
      {...props}
      extraScrollHeight={typeof props.extraScrollHeight === "number" ? props.extraScrollHeight : -safeAreaInsets.bottom}
      extraHeight={typeof props.extraHeight === "number" ? props.extraHeight : 100}
      keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || "handled"}
    />
  );
});
