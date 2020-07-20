import {DefaultNavigatorOptions, StackRouter, StackRouterOptions, TypedNavigator, useNavigationBuilder} from "@react-navigation/native";
import {StackNavigationState} from "@react-navigation/routers";
import {createStackNavigator, StackNavigationOptions, StackView} from "@react-navigation/stack";
import {StackNavigationConfig, StackNavigationEventMap} from "@react-navigation/stack/lib/typescript/src/types";
import * as React from "react";

const SwitchRouter = (options: StackRouterOptions): ReturnType<typeof StackRouter> => {
  const router = StackRouter(options);

  return {
    ...router,
    getStateForAction: (state, action, options): ReturnType<ReturnType<typeof StackRouter>["getStateForAction"]> => {
      if (action.type === "NAVIGATE" || action.type === "PUSH") {
        const newState = router.getStateForAction(state, action, options);

        if (newState) {
          (newState as any).routes = [newState.routes[newState.routes.length - 1]];
          (newState as any).index = 0;
        }

        return newState;
      }

      return router.getStateForAction(state, action, options);
    },
  };
};

export const createSwitchNavigator = <ParamList extends Record<string, object | undefined>>(): TypedNavigator<
  ParamList,
  StackNavigationState,
  StackNavigationOptions,
  StackNavigationEventMap,
  React.ComponentType<DefaultNavigatorOptions<StackNavigationOptions> & StackRouterOptions & StackNavigationConfig>
> => {
  const StackNavigator = createStackNavigator<ParamList>();

  return {
    ...StackNavigator,
    Navigator: (props) => {
      const stackViewProps = useNavigationBuilder(SwitchRouter, {
        children: props.children,
      });

      return <StackView {...props} {...stackViewProps} />;
    },
  };
};
