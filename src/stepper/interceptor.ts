export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

export function callInterceptor(options: {
  interceptor?: Function;
  args: any[];
  done: () => void;
  canceled?: () => void;
}) {
  const { interceptor, args, done, canceled } = options;

  if (interceptor) {
    const returnVal = interceptor.apply(null, args || []);
    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) done();
          else if (canceled) canceled();
        })
        .catch(() => {});
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
