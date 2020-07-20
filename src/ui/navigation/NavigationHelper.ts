import {NavigationContainerRef} from "@react-navigation/core";
import {StackActionType} from "@react-navigation/native";
import * as React from "react";

import {NavigatorRoutes, RouteNavigationOptions, Routes} from "./Routes";

export class NavigationHelper {
  static appContainerRef = React.createRef<NavigationContainerRef>();

  static navigateTo(
    options: {[K in keyof NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>]: RouteNavigationOptions<NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>, K>}[keyof NavigatorRoutes<NavigatorRoutes<Routes>["Screens"]>]
  ): void {
    this.appContainerRef.current?.navigate(options.screen, options.params);
  }

  static showModal(options: {[K in keyof Omit<NavigatorRoutes<Routes>, "Screens">]: RouteNavigationOptions<Omit<NavigatorRoutes<Routes>, "Screens">, K>}[keyof Omit<NavigatorRoutes<Routes>, "Screens">]): void {
    const action: StackActionType = {
      type: "PUSH",
      payload: {
        name: options.screen,
        params: options.params,
      },
    };

    this.appContainerRef.current?.dispatch(action);
  }
}
