import "./rn-addons";

import {withKnobs} from "@storybook/addon-knobs";
import {addDecorator, configure, getStorybookUI} from "@storybook/react-native";
import * as React from "react";

import {DataStore} from "../src/core/stores/DataStore";
import {loadStories} from "./storyLoader";

configure(() => {
  addDecorator(withKnobs);

  let lastRender = null;
  const CommonStoryDecorator = ({story}) => {
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setShouldRender(true);
      });

      return () => {
        clearTimeout(timeout);
        delete DataStore["instance"];
      };
    }, []);

    if (!shouldRender) {
      story();
      return lastRender;
    }

    return (lastRender = story());
  };
  addDecorator(story => <CommonStoryDecorator story={story} />);

  loadStories();
}, module);

const StorybookUI = getStorybookUI({});

export default StorybookUI;
