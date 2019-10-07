import {Omit} from "lodash";
import {action, observable} from "mobx";

import {DataStore} from "../../core/stores/DataStore";
import {AppConfig} from "../AppConfig";
import {LoadingProps} from "../components/loading/Loading";
import {NavigationStore} from "./NavigationStore";
import {StorageStore} from "./StorageStore";

export type ShowComponentState<TComponentProps extends {}> = {
  props: LoadingProps;
  shouldRender: boolean;
};

export type StateByComponent = {
  loading: ShowComponentState<LoadingProps>;
};

export class AppStore {
  static DEFAULT_OUT_ANIMATION_TIMING = 500;

  private static instance: AppStore;

  dataStore = new DataStore();

  navigationStore = new NavigationStore(this);
  storageStore = new StorageStore(this);

  @observable.shallow stateByComponentType: Partial<StateByComponent> = {};
  hideComponentTimeouts: Partial<Record<keyof StateByComponent, any>> = {};

  constructor() {
    if (AppStore.instance) return AppStore.instance;

    AppStore.instance = this;
    this.dataStore.setLocale(AppConfig.Settings.Localization.defaultLocale);
  }

  @action
  showComponent<TComponent extends keyof StateByComponent>(component: TComponent, props: Omit<StateByComponent[TComponent]["props"], "isVisible">) {
    const {stateByComponentType, hideComponentTimeouts} = this;

    const timeout = hideComponentTimeouts[component];
    clearTimeout(timeout);

    stateByComponentType[component] = {
      props: {
        ...props,
        isVisible: true,
      },
      shouldRender: true,
    };
  }

  @action
  hideComponent<TComponent extends keyof StateByComponent>(component: TComponent) {
    const {stateByComponentType, hideComponentTimeouts} = this;

    const prevState = stateByComponentType[component];
    const timeout = hideComponentTimeouts[component];

    if (!prevState) return;
    clearTimeout(timeout);

    stateByComponentType[component] = {
      ...prevState,
      props: {
        ...prevState.props,
        isVisible: false,
      },
    };

    hideComponentTimeouts[component] = setTimeout(() => {
      this.stateByComponentType[component] = {
        ...prevState,
        shouldRender: false,
      };
    }, prevState.props.animationOutTiming || AppStore.DEFAULT_OUT_ANIMATION_TIMING);
  }
}
