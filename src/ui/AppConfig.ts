import "./locales";

import {AppConfig as BaseConfig} from "../core/AppConfig";
import {CoreHelper} from "../core/utils/CoreHelper";

CoreHelper.mergeWith(BaseConfig, {
  Components: {
    SignIn: {
      options: {
        signInButton: {
          position: "right",
        },
      },
    },
  },
});

export {BaseConfig as AppConfig};
