import {AxiosRequestConfig} from "axios";

import {parseToken} from "./Authentication.endpoints";
import {User, userDefault} from "./User.mock";

export const UserData: {users: User[]} = {
  users: [userDefault],
};

type CallbackResponseSpecFunc = (config: AxiosRequestConfig) => any[] | Promise<any[]>;

type MockedRequests = {
  get: {
    user: CallbackResponseSpecFunc;
  };
};

export const userMockedRequests: MockedRequests = {
  get: {
    user: (config) => {
      const {headers} = config;
      const {users} = UserData;

      if (headers && headers["x-token"]) {
        const {userId} = parseToken({token: headers["x-token"]});
        const user = users.find((u) => u.id === userId);

        if (user) return [200, {user: userDefault}];
      }
      return [401, {}];
    },
  },
};
