import { addZero } from '../utils/format';

/** 创建一个数字字符串数组 */
export const createNumList = (min: number, max: number) => {
  return Array.from({ length: max - min + 1 }, (_, i) => addZero(min + i));
};

/** 获取某年某月有多少天 */
export function getMonthEndDay(year: number, month: number): number {
  return 32 - new Date(year, month - 1, 32).getDate();
}
