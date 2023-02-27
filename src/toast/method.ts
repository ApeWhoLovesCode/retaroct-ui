import { isObj } from '../utils/validate';
import { trigger } from './events';
import { ToastProps } from './type';

function parseOptions(message: ToastProps | string) {
  return isObj(message) ? message : { message: message as string };
}

const createMethod = (type: string) => (options: ToastProps | string) =>
  Toast(Object.assign({ type }, parseOptions(options)));

const Toast = function (options: ToastProps | string) {
  trigger('toast_show', options);
};

Toast.loading = createMethod('loading');
Toast.success = createMethod('success');
Toast.fail = createMethod('fail');
Toast.clear = function (options?: ToastProps) {
  trigger('toast_clear', options);
};

export default Toast;
