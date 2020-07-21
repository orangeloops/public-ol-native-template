import {useFocusEffect} from "@react-navigation/native";
import {observer} from "mobx-react";
import * as React from "react";

import * as Models from "../../../core/models";
import {DataStore} from "../../../core/stores/DataStore";
import {NavigationHelper} from "../../navigation/NavigationHelper";
import {AppStore, StorageItem} from "../../stores/AppStore";

export const AuthCheck: React.FC = observer(() => {
  const initializeAccessTokenFromStorage = async () => {
    const dataStore = DataStore.getInstance();
    const appStore = AppStore.getInstance();

    const accessTokenJSON = await appStore.getItem(StorageItem.AccessToken);

    if (!accessTokenJSON) return undefined;

    let accessToken = Models.AccessToken.fromJSON(JSON.parse(accessTokenJSON));

    if (accessToken?.refreshToken) {
      const refreshTokenResponse = await dataStore.refreshToken({refreshToken: accessToken.refreshToken});

      if (refreshTokenResponse.success) accessToken = refreshTokenResponse.accessToken;
    } else accessToken = undefined;

    return accessToken;
  };

  useFocusEffect(() => {
    (async () => {
      const dataStore = DataStore.getInstance();
      const appStore = AppStore.getInstance();
      const accessToken = await initializeAccessTokenFromStorage();

      if (accessToken) {
        const fetchUserResponse = await dataStore.fetchUser({accessToken});

        if (fetchUserResponse.success) {
          NavigationHelper.navigateTo({screen: "Main", params: {screen: "Home"}});
          return;
        }
      }

      dataStore.authenticationState.accessToken = undefined;
      await appStore.reset();
      await appStore.initialize();
      setTimeout(() => NavigationHelper.navigateTo({screen: "Public"}));
    })();
  });

  return null;
});
