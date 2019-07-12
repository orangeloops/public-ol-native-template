import {addDecorator, configure, getStorybookUI} from "@storybook/react-native";
import {loadStories} from "./storyLoader";
import {withKnobs} from "@storybook/addon-knobs";
import "./rn-addons";
import * as React from "react";
import {DataStore} from "../src/core/stores/DataStore";

const CommonStoryDecorator = ({story}) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShouldRender(true));

    return () => {
      delete DataStore["instance"];
    };
  }, []);

  return shouldRender ? story() : null;
};

configure(() => {
  addDecorator(withKnobs);
  addDecorator(story => <CommonStoryDecorator story={story} />);

  loadStories();
}, module);

const StorybookUI = getStorybookUI({});

export default StorybookUI;
