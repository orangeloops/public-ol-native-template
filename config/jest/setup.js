"use strict";

// Ensure environment variables are read.

const path = require("path");
const fs = require("fs-extra");
const dotenv = require("dotenv");

process.env = {
  ...process.env,
  ...dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), ".env"))),
};

const fetchPolyfill = require("whatwg-fetch");

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;

const axios = require("axios");
const httpAdapter = require("axios/lib/adapters/http");

axios.defaults.adapter = httpAdapter;

require("moment-timezone");
jest.doMock("moment", () => {
  const moment = jest.requireActual("moment");
  moment.tz.setDefault("America/New_York");
  return moment;
});

const mockAsyncStorage = require("@react-native-community/async-storage/jest/async-storage-mock");
jest.mock("@react-native-community/async-storage", () => mockAsyncStorage);

jest.mock("react-native-device-info", () => {
  const DeviceInfo = jest.requireActual("react-native-device-info");

  return {
    ...DeviceInfo,
    default: {
      ...DeviceInfo.default,
      getUserAgent: () => "test user agent",
    },
  };
});

// React 16: https://gist.github.com/gaearon/9a4d54653ae9c50af6c54b4e0e56b583
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

// TODO: FIX
// jest.mock("react-navigation", () => {
//   return {
//     createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
//       return null;
//     }),
//     createDrawerNavigator: jest.fn(),
//     createMaterialTopTabNavigator: jest.fn(),
//     createStackNavigator: jest.fn(),
//     StackActions: {
//       push: jest.fn().mockImplementation(x => ({...x, type: "Navigation/PUSH"})),
//       replace: jest.fn().mockImplementation(x => ({...x, type: "Navigation/REPLACE"})),
//     },
//     NavigationActions: {
//       navigate: jest.fn().mockImplementation(x => x),
//     },
//   };
// });
