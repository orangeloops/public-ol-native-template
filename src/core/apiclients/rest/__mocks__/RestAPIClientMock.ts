import MockAdapter from "axios-mock-adapter";

import {RestAPIClient, RestAPIClientConfigureClientOptions} from "../RestAPIClient";
import {authenticationMockedRequests} from "./Authentication.endpoints";
import {UserData, userMockedRequests} from "./User.endpoints";
import {User} from "./User.mock";

export const createRestAPIClientMock = (options: Partial<RestAPIClientConfigureClientOptions> & {initialMockedData?: Partial<{users: User[]}>}) => {
  const {initialMockedData} = options;
  if (initialMockedData?.users) UserData.users = initialMockedData.users;

  RestAPIClient.configureClient({
    userAgent: options.userAgent ?? "test-user-agent",
    shouldRefreshToken: options.shouldRefreshToken ?? (() => false),
    onRefreshToken:
      options.onRefreshToken ??
      (() => {
        //
      }),
  });

  const axiosMock = new MockAdapter(RestAPIClient.client, {delayResponse: 1000});

  axiosMock.onGet(`user`).reply(userMockedRequests.get.user);

  axiosMock.onPost(`refreshToken`).reply(authenticationMockedRequests.post.refreshToken);
  axiosMock.onPost(`signIn`).reply(authenticationMockedRequests.post.signIn);
};
