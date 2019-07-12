import moment from "moment";
import {TestHelper} from "../../../utils/TestHelper";
import {userDefault} from "../__mocks__/UserAPI.mock";
import {APIClient} from "../APIClient";

const axiosMock = TestHelper.getAxiosMockInstance();

describe("APIClient", () => {
  describe("fetchUser", () => {
    test("fetches correctly", async () => {
      expect.assertions(7);

      const authToken = "some token";

      axiosMock.onGet(`user`).reply(config => {
        expect(config.headers["x-token"]).toBe(authToken);

        return [
          200,
          {
            user: userDefault,
          },
        ];
      });

      const response = await APIClient.fetchUser({
        authToken,
      });

      expect(response.user).toBeTruthy();
      expect(response.user!.id).toBe(userDefault.id);
      expect(response.user!.name).toBe(userDefault.name);
      expect(response.user).toBeTruthy();
      expect(moment.isMoment(response.user!.createdAt)).toBeTruthy();
      expect(response.user!.createdAt.isSame(userDefault.createdAt)).toBeTruthy();
    });
  });

  describe("signIn", () => {
    test("fetches correctly", async () => {
      expect.assertions(8);

      const email = "test@test.com";
      const password = "password";
      const authToken = "some auth token";

      axiosMock.onPost(`signIn`).reply(config => {
        const data = JSON.parse(config.data);

        expect(data.email).toBe(email);
        expect(data.password).toBe(password);

        return [
          200,
          {
            user: userDefault,
          },
          {
            "x-token": authToken,
          },
        ];
      });

      const response = await APIClient.signIn({
        email,
        password,
      });

      expect(response.user).toBeTruthy();
      expect(response.user!.id).toBe(userDefault.id);
      expect(response.user!.name).toBe(userDefault.name);
      expect(response.user).toBeTruthy();
      expect(moment.isMoment(response.user!.createdAt)).toBeTruthy();
      expect(response.user!.createdAt.isSame(userDefault.createdAt)).toBeTruthy();
    });
  });
});
