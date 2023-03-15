import { useCallback, useState } from 'react';
import useUnmountedRef from '../use-unmounted-ref';

const useSetState = <T extends Record<string, any>>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const unmountedRef = useUnmountedRef();
  const [state, setState] = useState<T>(initialState);

  const setMergeState = useCallback(
    (patch) => {
      if (unmountedRef.current) return;
      setState((preState) => ({
        ...preState,
        ...(typeof patch === 'function' ? patch(preState) : patch),
      }));
    },
    [unmountedRef],
  );
  return [state, setMergeState];
};

export default useSetState;
