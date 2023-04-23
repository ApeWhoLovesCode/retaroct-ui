/** 验证手机 */
export function validatePhone(val: string) {
  // /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/
  return /^1[3456789]\d{9}$/.test(val);
}
export function isFunction(val: any) {
  return typeof val === 'function';
}
export function isPlainObject(val: any) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}
export function isPromise(val: any) {
  return isPlainObject(val) && isFunction(val.then) && isFunction(val.catch);
}
export function isDef(value: any) {
  return value !== undefined && value !== null;
}
export function isObj(x: any) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}
export function isNumber(value: any) {
  return /^\d+(\.\d+)?$/.test(value);
}
export function isBoolean(value: any) {
  return typeof value === 'boolean';
}
export function isDate(val: Date): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime());
}
