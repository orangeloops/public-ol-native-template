import {select} from "@storybook/addon-knobs";
import {DecoratorFunction, StoryFn} from "@storybook/addons";
import * as React from "react";
import {View} from "react-native";

import {Locale} from "../../core/locales/Locale";
import {DataStore} from "../../core/stores/DataStore";
import {App} from "../App";
import {AppConfig} from "../AppConfig";
import {KeyboardAwareScrollView, KeyboardAwareScrollViewProps} from "../components/keyboardawarescrollview/KeyboardAwareScrollView";
import {StoryError} from "./StoryError";
import {StoryErrorBoundary} from "./StoryErrorBoundary";
import {StoryLoading} from "./StoryLoading";
import {UsePrepareStoryOutput} from "./usePrepareStory";

export class StorybookHelper {
  static WithAppComponent = (props: {story: StoryFn<React.ReactNode>}) => {
    const [render, setRender] = React.useState(false);
    const locales = AppConfig.Settings.Localization.locales as Locale[];
    const localeCode = select(
      "locale",
      locales.map((l) => l.code),
      locales[0].code
    );

    React.useEffect(() => {
      const dataStore = DataStore.getInstance();
      if (dataStore.currentLocale && dataStore.currentLocale.code === localeCode) {
        setRender(true);
        return;
      }

      const locale = locales.find((l) => l.code === localeCode)!;

      const loadLocale = async () => {
        await dataStore.setLocale(locale);
        setRender(true);
      };

      loadLocale();
    }, [localeCode]);

    return <App>{render ? props.story() : <View />}</App>;
  };

  static withApp: () => DecoratorFunction<React.ReactNode> = () => (story) => <StorybookHelper.WithAppComponent story={story} />;

  static withCenter: DecoratorFunction<React.ReactNode> = (story) => <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>{story()}</View>;

  static withKeyboardAvoidableView: (props: KeyboardAwareScrollViewProps) => DecoratorFunction<React.ReactNode> = (props) => (story) => <KeyboardAwareScrollView {...props}>{story()}</KeyboardAwareScrollView>;

  static PreparedStory: React.FC<{usePrepareStoryOutput: UsePrepareStoryOutput}> = (props) => {
    const {isLoading, result, onRetry} = props.usePrepareStoryOutput;

    return <StoryErrorBoundary onRetry={onRetry}>{isLoading ? <StoryLoading /> : result && result !== true ? <StoryError error={result} onRetry={onRetry} /> : <>{props.children}</> || null}</StoryErrorBoundary>;
  };
}
