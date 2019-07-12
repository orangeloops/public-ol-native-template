import {en_US} from "./locales/en_US";
import {es_ES} from "./locales/es_ES";

export const AppConfig: {Settings: any; Modules: any; Components: any} = {
  Settings: {
    Localization: {
      defaultLocale: en_US,
      locales: [en_US, es_ES],
    },
    Server: {
      graphql: {
        apiClient: {
          baseUrl: process.env.API_CLIENT_GRAPHQL_SERVER_BASE_URL,
          timeout: 30000,
        },
      },
      rest: {
        apiClient: {
          baseUrl: process.env.API_CLIENT_REST_SERVER_BASE_URL,
          timeout: 30000,
        },
      },
    },
  },
  Modules: {},
  Components: {},
};
