import {StackNavigationProp} from "@react-navigation/stack";
import * as React from "react";

export type UseModalOnCloseOptions = {
  navigation: StackNavigationProp<Record<string, {}>>;
  onClose: () => void;
};

export const useModalOnClose = (options: UseModalOnCloseOptions) => {
  const {onClose} = options;

  const [routeKey] = React.useState(() => {
    const {routes} = options.navigation.dangerouslyGetState();
    return routes[routes.length - 1].key;
  });

  React.useEffect(() => {
    if (onClose)
      return options.navigation.addListener("state", ({data}) => {
        if (data.state.routes.findIndex((r) => r.key === routeKey) === -1) onClose();
      });

    return undefined;
  }, [onClose]);
};
