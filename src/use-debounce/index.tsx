import { useCallback, useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

type TimerType = {
  // fn: (...args: any[]) => void;
  fn: Function;
  timer?: NodeJS.Timer;
};

/** 防抖 */
export default function useDebounce(fn: Function, delay = 350, deps: DependencyList = []) {
  const { current } = useRef<TimerType>({ fn, timer: void 0 });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);
  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
      current.timer = void 0;
    }
    current.timer = setTimeout(() => {
      current.fn(...args);
    }, delay);
  }, deps);
}
