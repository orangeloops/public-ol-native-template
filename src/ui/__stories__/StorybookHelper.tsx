import {select} from "@storybook/addon-knobs";
import {StoryDecorator, RenderFunction} from "@storybook/react";
import * as React from "react";
import {View} from "react-native";
import {App} from "../App";
import {Locale} from "../../core/locales/Locale";
import {DataStore} from "../../core/stores/DataStore";
import {AppConfig} from "../AppConfig";

export class StorybookHelper {
  static withAppComponent = (props: {story: RenderFunction}) => {
    const locales = AppConfig.Settings.Localization.locales as Locale[];
    const localeCode = select("locale", locales.map(l => l.code), locales[0].code);

    React.useEffect(() => {
      const locale = locales.find(l => l.code === localeCode)!;

      const dataStore = new DataStore();
      dataStore.setLocale(locale);
    }, [localeCode]);

    return <App>{props.story()}</App>;
  };

  static withApp: () => StoryDecorator = () => story => <StorybookHelper.withAppComponent story={story} />;

  static withCenter: StoryDecorator = story => <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>{story()}</View>;
}
