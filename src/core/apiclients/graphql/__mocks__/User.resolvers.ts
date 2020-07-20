import {CoreHelper} from "../../../utils/CoreHelper";
import {Resolvers} from "../GraphQLAPIClientSchema.types";
import {parseToken} from "./Authentication.resolvers";
import {User} from "./User.mock";

export const UserData: {users: User[]} = {
  users: [],
};

export const userResolvers: Resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      const {users} = UserData;

      await CoreHelper.wait(1000);

      if (context.headers && context.headers["x-token"]) {
        const {userId} = parseToken({token: context.headers["x-token"]});
        const user = users.find((u) => u.id === userId);

        if (user) return user;
      }

      throw new Error();
    },
  },
};
