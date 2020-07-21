import {observer} from "mobx-react";
import * as React from "react";

import {DataStore} from "../../core/stores/DataStore";
import {CoreHelper} from "../../core/utils/CoreHelper";
import {Text} from "../components/text/Text";
import {LocaleKey, LocaleParams} from "../locales";

export abstract class UIHelper {
  static formatMessage<TLocaleKey extends LocaleKey>(messageId: TLocaleKey, variables: LocaleParams[TLocaleKey] | undefined = undefined, defaultMessage: string | undefined = undefined, parseLineBreaks = false): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const {currentLocale} = DataStore.getInstance();

    return CoreHelper.formatMessage(messageId as any, variables, defaultMessage, parseLineBreaks);
  }

  static renderMarkdown(value: string) {
    return value.split("**").map((t, i) =>
      i % 2 === 0 ? (
        t
      ) : (
        <Text key={i} style={{fontFamily: "SourceSansPro-Bold"}}>
          {t}
        </Text>
      )
    );
  }

  static renderObserverComponent<T>(Component: React.FC<T>): React.FC<T> {
    const ObserverComponent = observer(Component);

    return (props) => <ObserverComponent {...props} />;
  }

  static get isStorybook(): boolean {
    return process.env.IS_STORYBOOK === "true";
  }
}
