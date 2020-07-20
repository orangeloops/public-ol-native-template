import {observable} from "mobx";
import moment from "moment";

import {BaseModel} from "./BaseModel";

export class User extends BaseModel {
  @observable id: string;
  @observable name: string;
  @observable email: string;

  @observable createdAt: moment.Moment;

  static fixObjectFromJSON(object: User, json: any) {
    if (json.createdAt) object.createdAt = moment(json.createdAt);
  }
}
