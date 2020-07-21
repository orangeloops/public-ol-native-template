import "./locales";

import {AppConfig as CoreAppConfig, AppConfigType as CoreAppConfigType} from "../core/AppConfig";
import {CoreHelper} from "../core/utils/CoreHelper";

export type UIAppConfig = {};

const UIAppConfig: UIAppConfig = {};

export type AppConfigType = CoreAppConfigType & UIAppConfig;
export const AppConfig: AppConfigType = CoreHelper.mergeWith(CoreAppConfig, UIAppConfig);
