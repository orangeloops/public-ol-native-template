import {RouteProp} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";

import {ModalSectionData} from "../screens/sectionmodal/SectionModal";

export type RoutesMap = {
  [K in string]: NavigatorRoute<RoutesMap, object> | ScreenRoute;
};

export type NavigatorRoute<TRouteMap extends RoutesMap, TParams extends {} = {}> = {
  type: "NAVIGATOR_ROUTE";
  routes: TRouteMap;
  params: TParams;
};

export type ScreenRoute<TParams extends {} = {}> = {
  type: "SCREEN_ROUTE";
  params: TParams;
};

export type NavigatorRoutes<T extends NavigatorRoute<RoutesMap>> = T["routes"];

export type Routes = NavigatorRoute<{
  Screens: NavigatorRoute<{
    AuthCheck: ScreenRoute;
    Main: NavigatorRoute<{
      Home: ScreenRoute;
    }>;
    Public: NavigatorRoute<{
      Welcome: ScreenRoute;
      SignIn: ScreenRoute;
      SignUp: ScreenRoute;
    }>;
  }>;
  ExampleModal: ScreenRoute;
  SectionModal: ScreenRoute<{
    data: ModalSectionData[];
    selected?: ModalSectionData;
    onSelect: (value: ModalSectionData) => void;
    onClose?: () => void;
  }>;
}>;

export type RouteNavigationOptions<TRoutesMap extends RoutesMap, TRouteKey extends keyof TRoutesMap> = {
  screen: TRouteKey;
} & (TRoutesMap[TRouteKey] extends NavigatorRoute<RoutesMap>
  ? {} extends TRoutesMap[TRouteKey]["params"]
    ? {
        params?: (
          | {screen?: undefined}
          | {
              [TNestedRouteKey in keyof TRoutesMap[TRouteKey]["routes"]]: RouteNavigationOptions<TRoutesMap[TRouteKey]["routes"], TNestedRouteKey>;
            }[keyof TRoutesMap[TRouteKey]["routes"]]
        ) &
          TRoutesMap[TRouteKey]["params"];
      }
    : {
        params: (
          | {screen?: undefined}
          | {
              [TNestedRouteKey in keyof TRoutesMap[TRouteKey]["routes"]]: RouteNavigationOptions<TRoutesMap[TRouteKey]["routes"], TNestedRouteKey>;
            }[keyof TRoutesMap[TRouteKey]["routes"]]
        ) &
          TRoutesMap[TRouteKey]["params"];
      }
  : {} extends TRoutesMap[TRouteKey]["params"]
  ? {params?: TRoutesMap[TRouteKey]["params"]}
  : {params: TRoutesMap[TRouteKey]["params"]});

export type NavigatorRouteParamList<T extends NavigatorRoute<RoutesMap>> = {
  [K in keyof T["routes"]]: T["routes"][K]["params"];
};

export type StackScreenProps<T extends NavigatorRoute<RoutesMap>, K extends keyof NavigatorRouteParamList<T>> = {
  navigation: StackNavigationProp<NavigatorRouteParamList<T>, K>;
  route: RouteProp<NavigatorRouteParamList<T>, K>;
};
