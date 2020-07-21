import "reflect-metadata";

import {configure} from "enzyme";

import {DataStore} from "../stores/DataStore";

const Adapter = require("enzyme-adapter-react-16");

beforeAll((done) => TestHelper.beforeAll(done));
beforeEach((done) => TestHelper.beforeEach(done));

configure({adapter: new Adapter(), disableLifecycleMethods: true});

export abstract class TestHelper {
  static log(message?: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }

  static beforeAll(done: () => void) {
    console.debug = console.log;

    done();
  }

  static beforeEach(done: () => void) {
    delete DataStore["instance"];

    done();
  }

  static async wait(ms = 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
