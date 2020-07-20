import moment from "moment";

import {createAccessToken} from "../__mocks__/Authentication.endpoints";
import {createRestAPIClientMock} from "../__mocks__/RestAPIClientMock";
import {userDefault} from "../__mocks__/User.mock";
import {RestAPIClient} from "../RestAPIClient";

describe("APIClient", () => {
  describe("fetchUser", () => {
    test("fetches correctly", async () => {
      expect.assertions(5);

      createRestAPIClientMock({
        initialMockedData: {
          users: [userDefault],
        },
      });

      const accessToken = createAccessToken({userId: userDefault.id});

      const response = await RestAPIClient.fetchUser({
        accessToken,
      });

      expect(response.user).toBeTruthy();
      expect(response.user!.id).toBe(userDefault.id);
      expect(response.user!.name).toBe(userDefault.name);
      expect(moment.isMoment(response.user!.createdAt)).toBeTruthy();
      expect(response.user!.createdAt.isSame(userDefault.createdAt)).toBeTruthy();
    });
  });

  describe("signIn", () => {
    test("fetches correctly", async () => {
      expect.assertions(5);

      const email = userDefault.email;
      const password = userDefault.password;

      createRestAPIClientMock({
        initialMockedData: {
          users: [userDefault],
        },
      });

      const response = await RestAPIClient.signIn({
        email,
        password,
      });

      expect(response.user).toBeTruthy();
      expect(response.user!.id).toBe(userDefault.id);
      expect(response.user!.name).toBe(userDefault.name);
      expect(moment.isMoment(response.user!.createdAt)).toBeTruthy();
      expect(response.user!.createdAt.isSame(userDefault.createdAt)).toBeTruthy();
    });
  });
});
