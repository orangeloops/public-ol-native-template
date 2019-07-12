import * as _ from "lodash";
import {action, computed, observable, runInAction} from "mobx";
import {APIClient} from "../apiclients/rest/APIClient";
import {FetchUserRequest, FetchUserResponse, SignInRequest, SignInResponse} from "../apiclients/rest/APIClient.types";
import {AppConfig} from "../AppConfig";
import * as Models from "../models";
import {Locale} from "../locales/Locale";
import {CoreHelper} from "../utils/CoreHelper";
import * as moment from "moment";
import intl, {ReactIntlUniversalOptions} from "react-intl-universal";

export type AuthenticationState = {
  user?: Models.User;
  authToken?: string;
  loadingSignIn: boolean;
  loadingUser: boolean;
};

export class DataStore {
  private static instance: DataStore | undefined;

  @observable private initializing: boolean = false;
  @observable private initialized: boolean = false;

  @observable currentLocale: Locale = undefined as any;

  private authenticationInitialState: AuthenticationState = {
    loadingSignIn: false,
    loadingUser: false,
  };

  @observable authenticationState: AuthenticationState = _.cloneDeep(this.authenticationInitialState);

  constructor() {
    if (!DataStore.instance) DataStore.instance = this;

    return DataStore.instance;
  }

  @computed
  get isInitializing(): boolean {
    return this.initializing;
  }

  @computed
  get isInitialized(): boolean {
    return this.initialized;
  }

  @action
  async initialize(): Promise<any> {
    this.initializing = true;

    await this.loadLocale();

    this.initializing = false;
    this.initialized = true;
  }

  @action
  private async loadLocale(locale?: Locale) {
    const {currentLocale} = this;

    const nextLocale = locale || AppConfig.Settings.Localization.defaultLocale;

    if (currentLocale && nextLocale && nextLocale.code === currentLocale.code) return;

    this.currentLocale = nextLocale;
    const momentLocale = moment.locale(nextLocale.code);

    const locales: Record<string, Locale> = {};

    for (const l of AppConfig.Settings.Localization.locales as Locale[]) locales[l.code] = l;

    const intlOptions: ReactIntlUniversalOptions = {
      currentLocale: nextLocale.code,
      locales,
      warningHandler: (warning: string) => {
        if (warning.indexOf("is not supported.") === -1) console.warn(warning);
      },
    };
    await intl.init(intlOptions);

    moment.updateLocale(momentLocale, {
      calendar: {
        lastDay: `[${CoreHelper.formatMessage("Common-yesterday")}]`,
        sameDay: `[${CoreHelper.formatMessage("Common-today")}]`,
        nextDay: `[${CoreHelper.formatMessage("Common-tomorrow")}]`,
        lastWeek: "L",
        nextWeek: "L",
        sameElse: "L",
      },
      relativeTime: {
        future: text => text,
        past: text => text,
        s: `%d ${CoreHelper.formatMessage("Common-second")}`,
        ss: `%d ${CoreHelper.formatMessage("Common-seconds")}`,
        m: `%d ${CoreHelper.formatMessage("Common-minute")}`,
        mm: `%d ${CoreHelper.formatMessage("Common-minutes")}`,
        h: `%d ${CoreHelper.formatMessage("Common-hour")}`,
        hh: `%d ${CoreHelper.formatMessage("Common-hours")}`,
        d: `%d ${CoreHelper.formatMessage("Common-day")}`,
        dd: value => {
          if (value < 7) {
            return `${value} ${nextLocale.Common.days}`;
          } else {
            const weeks = Math.round(value / 7);
            return `${weeks} ${weeks > 1 ? CoreHelper.formatMessage("Common-weeks") : CoreHelper.formatMessage("Common-week")}`;
          }
        },
        M: `%d ${CoreHelper.formatMessage("Common-month")}`,
        MM: `%d ${CoreHelper.formatMessage("Common-months")}`,
        y: `%d ${CoreHelper.formatMessage("Common-year")}`,
        yy: `%d ${CoreHelper.formatMessage("Common-years")}`,
      },
    });
  }

  @action
  async setLocale(locale: Locale) {
    const {currentLocale} = this;

    if (!currentLocale || currentLocale.code !== locale.code) await this.loadLocale(locale);
  }

  @action
  reset() {
    this.authenticationState = _.cloneDeep(this.authenticationInitialState);
  }

  @action
  async signIn(request: SignInRequest): Promise<SignInResponse> {
    this.authenticationState.loadingSignIn = true;

    const response = await APIClient.signIn(request);

    runInAction(() => {
      this.authenticationState.loadingSignIn = false;

      if (response.success) {
        this.authenticationState.user = response.user;
        this.authenticationState.authToken = response.authToken;
      }
    });

    return response;
  }

  @action
  async fetchUser(request: FetchUserRequest): Promise<FetchUserResponse> {
    this.authenticationState.loadingUser = true;

    const response = await APIClient.fetchUser(request);

    runInAction(() => {
      this.authenticationState.loadingUser = false;

      if (response.success) this.authenticationState.user = response.user;
    });

    return response;
  }
}
