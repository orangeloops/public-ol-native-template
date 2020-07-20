import * as React from "react";

import {DataStore} from "../../core/stores/DataStore";

export type PrepareStory =
  | (() => Promise<void | boolean | {message: string}>)
  | {
      type: "sign_in";
      email: string;
      password: string;
    };

export type UsePrepareStoryOutput = {
  isLoading: boolean;
  result: boolean | {message: string} | undefined;
  onRetry: () => void;
};

export const usePrepareStory = (...options: PrepareStory[]): UsePrepareStoryOutput => {
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [result, setResult] = React.useState<boolean | {message: string}>();
  const dataStore = DataStore.getInstance();

  const prepare = async () => {
    setIsLoading(true);

    let newResult: boolean | {message: string} | undefined;
    let i = 0;

    try {
      while ((undefined === newResult || true === newResult) && options.length > i) {
        const option = options[i];

        if (typeof option !== "function") {
          const handlers: {
            [K in typeof option["type"]]: (o: Extract<typeof option, {type: K}>) => Promise<typeof newResult>;
          } = {
            sign_in: async ({email, password}) => {
              const signInResponse = await dataStore.signIn({
                email,
                password,
              });

              return (
                signInResponse.success || {
                  message: `There was an error signing in.\nCredentials used: \nemail: ${email}\npassword: ${password}`,
                }
              );
            },
          };

          newResult = await handlers[option.type](option as Extract<typeof option, typeof option["type"]>);
        } else {
          const result = await option();
          newResult = result === undefined ? undefined : result;
        }

        i++;
      }
    } catch (e) {
      newResult = e;
    }

    setResult(newResult === undefined ? true : newResult);
    setIsLoading(false);
  };

  let initLoading = false;
  if (!isLoading && result === undefined) {
    initLoading = true;

    prepare();
  }

  return {
    isLoading: isLoading || initLoading,
    result,
    onRetry: prepare,
  };
};
