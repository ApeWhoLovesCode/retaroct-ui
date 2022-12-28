/** 等待函数，默认等待一秒 */
export default (time?: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time ?? 1000);
  })
}