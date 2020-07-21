import * as _ from "lodash";
import {observer} from "mobx-react";
import * as React from "react";

const useForceRender = () => {
  const [, setBoolean] = React.useState(false);

  return () => setBoolean((b) => !b);
};

export const useObserverComponent = <TResultProps, TDeps = unknown>(Component: React.FC<TResultProps & TDeps>, deps: TDeps): React.FC<Omit<TResultProps, keyof TDeps>> => {
  const depsRef = React.useRef(deps);
  depsRef.current = deps;
  const oldDepsRef = React.useRef(deps);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const forceRenderRef = React.useRef(() => {});

  const resultRef = React.useRef<React.FC<Omit<TResultProps, keyof TDeps>>>();
  if (!resultRef.current) {
    resultRef.current = observer((props: Omit<TResultProps, keyof TDeps>) => {
      forceRenderRef.current = useForceRender();

      return <Component {...(props as TResultProps)} {...depsRef.current} />;
    });
  }

  if (!_.isEqual(Object.values(depsRef.current), Object.values(oldDepsRef.current))) {
    forceRenderRef.current();
    oldDepsRef.current = depsRef.current;
  }

  return resultRef.current;
};
