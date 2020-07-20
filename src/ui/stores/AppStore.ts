import AsyncStorage from "@react-native-community/async-storage";
import {Sha} from "@trackforce/react-native-crypto";
import {action, observable, runInAction} from "mobx";
import * as Keychain from "react-native-keychain";

import {DataStore} from "../../core/stores/DataStore";
import {AppConfig} from "../AppConfig";

export enum StorageItem {
  AccessToken = "@ol-accessToken",
  Username = "@ol-username",
}

const securedStorageItems: StorageItem[] = [StorageItem.AccessToken];

export type AppStoreState = {
  initializing: boolean;
  initialized: boolean;
};

export class AppStore {
  private static instance: AppStore;

  dataStore = DataStore.getInstance();

  @observable state: AppStoreState = {
    initializing: false,
    initialized: false,
  };

  private constructor() {
    //
  }

  static getInstance(): AppStore {
    if (!this.instance) this.instance = new AppStore();

    return this.instance;
  }

  @action
  async initialize() {
    const {dataStore, state} = this;

    state.initialized = false;
    state.initializing = true;

    await dataStore.initialize();
    await this.dataStore.setLocale(AppConfig.Settings.Localization.defaultLocale);

    runInAction(() => {
      state.initializing = false;
      state.initialized = true;
    });
  }

  async reset() {
    const {dataStore} = this;

    await this.cleanStorage();

    dataStore.reset();

    this.state = {
      initialized: false,
      initializing: false,
    };
  }

  async getUsernameHash(): Promise<string | null> {
    const {user} = this.dataStore.authenticationState;
    const username = user?.email ?? (await this.getItem(StorageItem.Username));

    return username ? Sha.sha256(username) : null;
  }

  async getItem<TItem extends StorageItem>(item: TItem): Promise<string | null> {
    if (securedStorageItems.includes(item)) {
      const result = await Keychain.getGenericPassword({service: item}).catch(() => null);
      const usernameHash = await this.getUsernameHash();

      if (result) {
        if (!usernameHash || result.username !== usernameHash) {
          await this.deleteItem(item);

          return null;
        } else return result.password;
      }

      return null;
    }

    return AsyncStorage.getItem(item);
  }

  async setItem<TItem extends StorageItem>(item: TItem, value: string) {
    if (securedStorageItems.includes(item)) {
      const usernameHash = await this.getUsernameHash();

      if (usernameHash) await Keychain.setGenericPassword(usernameHash, value, {service: item}).catch(() => null);
    } else await AsyncStorage.setItem(item, value);
  }

  async deleteItem<TItem extends StorageItem>(item: TItem) {
    if (securedStorageItems.includes(item))
      await Keychain.resetGenericPassword({
        service: item,
      }).catch(() => null);
    else await AsyncStorage.removeItem(item);
  }

  async cleanStorage() {
    const storageKeysToDelete = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith("@ol"));
    await AsyncStorage.multiRemove(storageKeysToDelete);

    await Promise.all(securedStorageItems.map((k) => Keychain.resetGenericPassword({service: k}).catch(() => null)));
  }
}
