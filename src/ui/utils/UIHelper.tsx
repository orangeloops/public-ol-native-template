import {CoreHelper} from "../../core/utils/CoreHelper";
import {LocaleKey, LocaleParams} from "../locales";

export abstract class UIHelper {
  static formatMessage<TLocaleKey extends LocaleKey>(messageId: TLocaleKey, variables: LocaleParams[TLocaleKey] | undefined = undefined, defaultMessage: string | undefined = undefined, parseLineBreaks: boolean = false): string {
    return CoreHelper.formatMessage(messageId as any, variables, defaultMessage, parseLineBreaks);
  }
}
