import moment from "moment";

import {CoreHelper} from "../../../utils/CoreHelper";
import {Resolvers} from "../GraphQLAPIClientSchema.types";
import {UserData} from "./User.resolvers";

export const createAccessToken = (options: {userId: string}) => ({
  token: JSON.stringify({userId: options.userId, createdAt: moment().toISOString()}),
  refreshToken: JSON.stringify({userId: options.userId, createdAt: moment().toISOString()}),
  expiresAt: moment().add("1", "day"),
});

export const parseToken = (options: {token: string}): {userId: string; createdAt: string} => JSON.parse(options.token);

export const parseRefreshToken = (options: {refreshToken: string}): {userId: string; createdAt: string} => JSON.parse(options.refreshToken);

export const authenticationResolvers: Resolvers = {
  Mutation: {
    signIn: async (_, args) => {
      const {users} = UserData;

      await CoreHelper.wait(1000);

      const user = users.find((u) => u.email === args.email.trim().toLowerCase() && u.password === args.password);

      if (user) return createAccessToken({userId: user.id});

      throw new Error();
    },
    refreshTokens: async (_, args) => {
      const {users} = UserData;
      const {userId} = parseRefreshToken({refreshToken: args.token});

      await CoreHelper.wait(1000);

      const user = users.find((u) => u.id === userId);

      if (user) return createAccessToken({userId: user.id});

      throw new Error();
    },
  },
};
