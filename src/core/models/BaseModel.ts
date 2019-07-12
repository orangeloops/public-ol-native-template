import * as _ from "lodash";

export class BaseModel {
  static fixObjectFromJSON(object: any, json: any) {}

  static fromJSON(json: any): any {
    const result = new this();

    _.assign(result, json);
    this.fixObjectFromJSON(result, json);

    return result;
  }
}
