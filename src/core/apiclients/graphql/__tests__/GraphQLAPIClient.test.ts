import {createGraphQLAPIClientMock} from "../__mocks__/GraphQLAPIClientMock";
import {userDefault} from "../__mocks__/User.mock";
import {GraphQLAPIClient} from "../GraphQLAPIClient";

describe("APIClient", () => {
  describe("fetchUser", () => {
    test("handles successful response correctly", async () => {
      expect.assertions(1);
      createGraphQLAPIClientMock({
        initialMockedData: {
          users: [userDefault],
        },
      });

      const result = await GraphQLAPIClient.signIn({
        email: "testuser1@orangeloops.com",
        password: "Password01",
      });

      expect(result.success).toBe(true);
    });
  });
});
