// 【价格格式】转换字符串转换成 价格格式，保留2位小数
export const priceFormat = (num: string) => {
  // 先把非数字的都替换掉，除了数字和.
  num = num.replace(/[^\d.]/g, '');
  // 必须保证第一个为数字而不是.
  num = num.replace(/^\./g, '');
  // 保证只有出现一个.而没有多个.
  num = num.replace(/\.{2,}/g, '.');
  // 保证.只出现一次，而不能出现两次以上
  num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

  if (num.indexOf('.') !== -1) {
    const arr: string[] = num.split('.');
    if (arr[0]) arr[0] = `${parseInt(arr[0], 10)}`;
    if (arr[0].length > 7) arr[0] = parseInt(arr[0].slice(0, 7), 10) + '';
    if (arr[1].length > 2) arr[1] = arr[1].slice(0, 2);

    return arr.join('.');
  }

  return num ? parseInt(num, 10) + '' : '';
};

// 【整数格式】转换字符串转换成 整数格式
export const intFormat = (num: string) => {
  const newValue = num.replace(/[^\d]/g, '');

  // 2位数以上，不能以0开头
  const cleanZero = (str: string): string => {
    if (str.length > 1 && str.substring(0, 1) === '0') {
      str = str.slice(1);
      return cleanZero(str);
    }
    return str;
  };

  return cleanZero(newValue);
};
