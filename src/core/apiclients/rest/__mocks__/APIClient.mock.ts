import MockAdapter from "axios-mock-adapter";
import {APIClient} from "../APIClient";
import {userDefault} from "./UserAPI.mock";

export const mockAPIClient = () => {
  const axiosMock = new MockAdapter(APIClient.client, {delayResponse: 1000});

  axiosMock.onGet(`user`).reply(config => {
    return [200, {user: userDefault}];
  });

  axiosMock.onPost(`signIn`).reply(config => {
    return [
      200,
      {
        user: userDefault,
      },
      {
        "x-token": "some auth token",
      },
    ];
  });
};
