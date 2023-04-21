import { addZero } from '../utils/format';

/** 创建一个数字字符串数组 */
export const createNumList = (min: number, max: number) => {
  return Array.from({ length: max - min + 1 }, (_, i) => addZero(min + i));
};
