import { useCallback, useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

type TimerType = {
  fn: Function;
  timer?: NodeJS.Timer;
};

/** 节流 */
export default function useThrottle(fn: Function, delay = 350, deps: DependencyList = []) {
  const { current } = useRef<TimerType>({ fn, timer: void 0 });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);
  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = void 0;
      }, delay);
      current.fn(...args);
    }
  }, deps);
}
