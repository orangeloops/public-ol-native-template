import * as _ from "lodash";

export class BaseModel {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static fixObjectFromJSON(object: any, json: any) {}

  static fromJSON(json: any): any {
    const result = new this();

    _.assign(result, json);
    this.fixObjectFromJSON(result, json);

    return result;
  }
}
