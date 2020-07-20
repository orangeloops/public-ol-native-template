import moment from "moment";

import {User as UserSchema, UserStatus} from "../GraphQLAPIClientSchema.types";

export type User = UserSchema & {password: string};

export const userDefault: User = {
  id: "1",
  name: "Matthew",
  password: "Password01",
  email: "testuser1@orangeloops.com",
  createdDate: moment("2019-05-31T14:07:00").toISOString(),
  modifiedDate: null,
  status: UserStatus.Active,
};
