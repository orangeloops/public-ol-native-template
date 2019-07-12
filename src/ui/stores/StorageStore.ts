import AsyncStorage from "@react-native-community/async-storage";
import {Store} from "./Store";

export type StorageItems = {
  "@ol-authToken": string;
};

export class StorageStore extends Store {
  async getItem<TItem extends keyof StorageItems>(item: TItem): Promise<StorageItems[TItem] | null> {
    return AsyncStorage.getItem(item);
  }

  async setItem<TItem extends keyof StorageItems>(item: TItem, value: StorageItems[TItem]) {
    return AsyncStorage.setItem(item, value);
  }

  async deleteItem<TItem extends keyof StorageItems>(item: TItem) {
    return AsyncStorage.removeItem(item);
  }
}
