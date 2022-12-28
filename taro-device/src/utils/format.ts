/** 格式化金钱 isLocale: 钱的整数每三位一个逗号分隔 */
export function priceFormat(price: number = 0, isLocale = true) {
  price = price / 100
  return `￥${isLocale ? price.toLocaleString() : price.toFixed(2)}`
}

/** 格式化日期 yy-mm-dd HH:MM:SS */
export function dateFormat(date?: Date | number, fmt = 'yy-mm-dd HH:MM:SS') {
  if(!(date instanceof Date)) {
    date = new Date(date ?? Date.now())
  }
  let ret;
  const opt = {
    "y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

/** 将时间格式化为英文显示 */
export function dateFormatEnglish(date?: Date | number) {
  if(!(date instanceof Date)) {
    date = new Date(date ?? Date.now())
  }
  // 这里是中国时区, 世界的: date.toUTCString()
  const chinaDate = date.toDateString() //  Wed Sep 07 2022
  const arr = chinaDate.split(' ') // ["Wed", "Sep", "07", "2022"]
  return `${arr[1]} ${arr[2]}, ${arr[0]}`
}

/** 格式化剩余时间 */
export function formatRemainTime(time?: number) {
  // 当初始化时间为 undefined 时返回
  if(time === void 0) return '0'
  const addZero = (n: number) => n >= 10 ? n : ('0' + n)
  const timeArr: {s: string, t: number}[] = [
    {s: '天', t: 86400},
    {s: '时', t: 3600},
    {s: '分', t: 60},
    {s: '秒', t: 1},
  ]
  time = Math.ceil(time / 1000) 
  let res = ''
  for(let i = 0; i < timeArr.length - 1; i++) {
    const item = timeArr[i]
    if(time >= item.t) {
      const tartget = ~~(time / item.t)
      res += (!i ? tartget : addZero(tartget)) + item.s
      time %= item.t
    }
  }
  res += addZero(~~(time)) + timeArr.at(-1)!.s
  return res
}

/**
 * 处理富文本里的图片宽度自适应
 * @param html
 * @returns {string}
 */
 export function formatRichText(html: string = ''){
  let newHtml = html.replace(/<img[^>]*>/gi, (match) => {
    match = match.replace(/width: auto/, 'width:100%')
    return match
  })
  return newHtml;
}