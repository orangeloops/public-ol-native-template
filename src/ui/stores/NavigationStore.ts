import * as React from "react";
import {NavigationActions, NavigationContainerComponent, NavigationParams} from "react-navigation";

import {Store} from "./Store";

export type NavigationRoute = "Playground" | "Home";

export class NavigationStore extends Store {
  appContainerRef = React.createRef<NavigationContainerComponent>();

  protected navigate(routeName: string, params?: NavigationParams, key?: string) {
    const {appContainerRef} = this;

    if (!appContainerRef.current) return;

    appContainerRef.current.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
        key,
      })
    );
  }

  navigateTo(route: NavigationRoute) {
    this.navigate(route);
  }
}
