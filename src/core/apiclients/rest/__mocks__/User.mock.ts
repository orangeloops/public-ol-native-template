import moment from "moment";

export type User = {
  id: string;
  name: string;
  createdAt: string;
  email: string;
  password: string;
};

export const userDefault: User = {
  id: "u12sd-hjs04",
  name: "Rob",
  createdAt: moment("2019-05-31T14:07:00").toISOString(),
  email: "test@orangeloops.com",
  password: "1234567",
};
