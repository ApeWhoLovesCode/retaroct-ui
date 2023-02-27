export type CountDownProps = {
  /** 起始时间 如果不传就是现在的时间 */
  value?: number;
  /**
   * 倒计时时间
   * @default 40分钟
   */
  total?: number;
  /**
   * 字符串格式化
   * 天:D; 时:H; 分:m; 秒:s; 两个重复就是用0来补齐两位
   * @default D天HH时mm分ss秒
   */
  format?: string;
  onChange?: (val: number) => void;
};
