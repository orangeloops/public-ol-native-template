import * as _ from "lodash";
import * as uuid from "uuid";
import intl from "react-intl-universal";
import {LocaleKey, LocaleParams} from "../locales/Locale";

// AppConfig, Models, Stores can not be imported!

const base64 = require("base-x")("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

(String.prototype as any).replaceAll = function(search: string, replacement: string) {
  const target = this;

  return target.replace(new RegExp(search, "g"), replacement);
};

(String.prototype as any).trimAll = function() {
  const target = this;

  return target.replaceAll(" ", "");
};

export class CoreHelper {
  static getUUID(short: boolean = true): string {
    if (short) {
      const buf = new Buffer(16);
      const uuidLong = uuid.v4(null, buf);

      let result = base64.encode(uuidLong);
      result = result.replace(/\//g, "_");
      result = result.replace(/\+/g, "-");
      result = result.replace(/=/g, "");

      return result;
    } else return uuid.v4();
  }

  static formatMessage<TLocaleKey extends LocaleKey>(messageId: TLocaleKey, variables: LocaleParams[TLocaleKey] | undefined = undefined, defaultMessage: string | undefined = undefined, parseLineBreaks: boolean = false): string {
    let result = intl.formatMessage(
      {
        id: messageId,
        defaultMessage: !_.isNil(defaultMessage) ? defaultMessage : messageId,
      },
      variables
    );

    if (parseLineBreaks) {
      const lines: string[] = result.split("|");

      result = "";
      lines.forEach(line => (result.length === 0 ? (result = line) : (result = `${result}\n${line}`)));
    }
    return result;
  }

  static validateEmail(email: string): boolean {
    const pattern = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    return pattern.test(email);
  }

  static mergeWith(object: any, values: any, updateObject: boolean = true, customizer?: (value: any, sourceValue: any, key: any) => any): any {
    if (updateObject) {
      return _.mergeWith(object, values, !_.isNil(customizer) ? customizer : this.mergeWithCustomizer);
    } else {
      const clone = _.cloneDeep(object);
      return _.mergeWith(clone, values, !_.isNil(customizer) ? customizer : this.mergeWithCustomizer);
    }
  }

  static mergeWithCustomizer(value: any, sourceValue: any, key: any): any {
    return _.isArray(value) ? sourceValue : undefined;
  }

  static get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  static get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  static get isStorybook(): boolean {
    return !_.isNil(process.env.STORYBOOK_ENV);
  }
}
