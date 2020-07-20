import {AxiosRequestConfig} from "axios";
import moment from "moment";

import {UserData} from "./User.endpoints";
import {userDefault} from "./User.mock";

type CallbackResponseSpecFunc = (config: AxiosRequestConfig) => any[] | Promise<any[]>;

type MockedRequests = {
  post: {
    signIn: CallbackResponseSpecFunc;
    refreshToken: CallbackResponseSpecFunc;
  };
};

export const createAccessToken = (options: {userId: string}) => ({
  token: JSON.stringify({userId: options.userId, createdAt: moment().toISOString()}),
  refreshToken: JSON.stringify({userId: options.userId, createdAt: moment().toISOString()}),
  expiresAt: moment().add("1", "day"),
});

export const parseToken = (options: {token: string}): {userId: string; createdAt: string} => JSON.parse(options.token);

export const parseRefreshToken = (options: {refreshToken: string}): {userId: string; createdAt: string} => JSON.parse(options.refreshToken);

export const authenticationMockedRequests: MockedRequests = {
  post: {
    signIn: (config) => {
      const data = JSON.parse(config.data);

      if (data?.email && data?.password) {
        const {users} = UserData;
        const user = users.find((u) => u.email === data.email.toLowerCase() && u.password === data.password);

        if (user) {
          return [
            200,
            {
              user: userDefault,
              accessToken: createAccessToken({userId: user.id}),
            },
          ];
        } else return [401, {}];
      }
      return [400, {}];
    },
    refreshToken: (config) => {
      const {data} = config;

      if (data && data.refreshToken) {
        const {users} = UserData;
        const {userId} = parseRefreshToken({refreshToken: data.refreshToken});

        const user = users.find((u) => u.id === userId);

        if (user) return [200, createAccessToken({userId: user.id})];
      }
      return [401, {}];
    },
  },
};
