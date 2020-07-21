import "./rn-addons";

import AsyncStorage from "@react-native-community/async-storage";
import {withKnobs} from "@storybook/addon-knobs";
import {DecoratorFunction, StoryFn} from "@storybook/addons";
import {addDecorator, configure, getStorybookUI} from "@storybook/react-native";
import * as React from "react";

import {DataStore} from "../src/core/stores/DataStore";
import {StoryErrorBoundary} from "../src/ui/__stories__";
import {AppStore} from "../src/ui/stores/AppStore";
import {loadStories} from "./storyLoader";

configure(() => {
  addDecorator(withKnobs);

  const CommonStoryDecorator: React.FC<{story: StoryFn<React.ReactNode>}> = ({story}) => {
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setShouldRender(true);
      });

      return () => {
        clearTimeout(timeout);
        delete DataStore["instance"];
        delete AppStore["instance"];
      };
    }, []);

    if (!shouldRender) {
      story();
      return null;
    }

    return <>{story()}</>;
  };
  addDecorator(((story) => <CommonStoryDecorator story={story} />) as DecoratorFunction<React.ReactNode>);
  addDecorator(((story) => <StoryErrorBoundary>{story()}</StoryErrorBoundary>) as DecoratorFunction<React.ReactNode>);

  loadStories();
}, module);

const StorybookUI = getStorybookUI({
  shouldDisableKeyboardAvoidingView: true,
  shouldPersistSelection: true,
  tabOpen: 0,
  asyncStorage: AsyncStorage as any,
});

export default StorybookUI;
