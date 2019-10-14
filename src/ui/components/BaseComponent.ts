import * as React from "react";

import {Locale} from "../../core/locales/Locale";
import {DataStore} from "../../core/stores/DataStore";
import {LocaleKey, LocaleParams} from "../locales";
import {AppStore} from "../stores/AppStore";
import {UIHelper} from "../utils/UIHelper";

export class BaseComponent<P = {}, S = {}> extends React.Component<P, S> {
  state = {} as S;

  dataStore = new DataStore();
  appStore = new AppStore();

  protected formatMessage<TLocaleKey extends LocaleKey>(messageId: TLocaleKey, variables: LocaleParams[TLocaleKey] | undefined = undefined, defaultMessage: string | undefined = undefined, parseLineBreaks = false): string {
    const {currentLocale} = this.dataStore;

    const mobxWorkaround = (workaround: Locale) => {};
    mobxWorkaround(currentLocale);

    return UIHelper.formatMessage(messageId, variables, defaultMessage, parseLineBreaks);
  }
}
