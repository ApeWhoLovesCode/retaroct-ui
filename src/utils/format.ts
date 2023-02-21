/** 格式化金钱 isLocale: 钱的整数每三位一个逗号分隔 */
export function priceFormat(price: number = 0, isLocale = true) {
  price = price / 100;
  return `￥${isLocale ? price.toLocaleString() : price.toFixed(2)}`;
}

type OptKey = 'y+' | 'm+' | 'd+' | 'H+' | 'M+' | 'S+';
/** 格式化日期 yy-mm-dd HH:MM:SS */
export function dateFormat(date?: Date | number, fmt = 'yy-mm-dd HH:MM:SS') {
  if (!(date instanceof Date)) {
    date = new Date(date ?? Date.now());
  }
  let ret;
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    const _k = k as OptKey;
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[_k] : opt[_k].padStart(ret[1].length, '0'),
      );
    }
  }
  return fmt;
}

/** 将时间格式化为英文显示 */
export function dateFormatEnglish(date?: Date | number) {
  if (!(date instanceof Date)) {
    date = new Date(date ?? Date.now());
  }
  // 这里是中国时区, 世界的: date.toUTCString()
  const chinaDate = date.toDateString(); //  Wed Sep 07 2022
  const arr = chinaDate.split(' '); // ["Wed", "Sep", "07", "2022"]
  return `${arr[1]} ${arr[2]}, ${arr[0]}`;
}

/** 格式化剩余时间 */
export function formatRemainTime(time?: number, format = 'D天HH时mm分ss秒') {
  // 当初始化时间为 undefined 时返回
  if (time === void 0) return '0';
  const opt = {
    D: 86400,
    H: 3600,
    m: 60,
    s: 1,
  };
  let _time = Math.ceil(time / 1000);
  const arr = Object.keys(opt);
  arr.forEach((k, i) => {
    let time = '';
    if (_time >= opt[k]) {
      time = String(~~(_time / opt[k]));
      _time %= opt[k];
    }
    if (!time && i < arr.length - 1) {
      format = format.slice(format.indexOf(arr[i + 1]));
    } else {
      const ret = new RegExp(`${k}+`).exec(format);
      if (ret) {
        format = format.replace(
          ret[0],
          ret[0].length === 1 ? time : time.padStart(ret[0].length, '0'),
        );
      }
    }
  });
  return format;
}

/**
 * 处理富文本里的图片宽度自适应
 * @param html
 * @returns {string}
 */
export function formatRichText(html: string = '') {
  let newHtml = html.replace(/<img[^>]*>/gi, (match) => {
    match = match.replace(/width: auto/, 'width:100%');
    return match;
  });
  return newHtml;
}

/** 用于比较num 最大和最小不能超过边界值 */
export function range(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/** 字母大写转-加小写 (helloWorld => hello-world) */
export function letterUpperTolower(v: string) {
  return v.replace(/([A-Z])/g, (_: string, $1: string) => {
    return '-' + $1?.toLowerCase();
  });
}
