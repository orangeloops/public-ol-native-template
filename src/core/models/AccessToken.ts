import {observable} from "mobx";
import moment from "moment";

import {BaseModel} from "./BaseModel";

export class AccessToken extends BaseModel {
  @observable token: string;
  @observable refreshToken: string;

  @observable expiresAt: moment.Moment | undefined = undefined as any;

  static fixObjectFromJSON(object: AccessToken, json: any) {
    object.expiresAt = json.expiresAt ? moment(json.expiresAt) : undefined;
  }
}
