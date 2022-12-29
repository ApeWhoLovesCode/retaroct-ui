/** 验证手机 */
export function validatePhone(val: string) {
  // /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/
  return /^1[3456789]\d{9}$/.test(val);
}
