import useCountDown from '../use-count-down';
import { formatRemainTime } from '../utils/format';
import { Text } from '@tarojs/components';
import { useEffect } from 'react';
import './index.less';
import React from 'react';

type PropsType = {
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

export default ({ value, total = 2400_000, format = 'D天HH时mm分ss秒', onChange }: PropsType) => {
  // 待付款倒计时 待处理-倒计时时间为0退出当前页
  const [countDownNum, setCountDown] = useCountDown();
  useEffect(() => {
    if (value !== void 0) {
      setCountDown(value, total);
    }
  }, [value, total]);
  useEffect(() => {
    if (countDownNum !== void 0) {
      onChange?.(countDownNum);
    }
  }, [countDownNum]);
  return <Text className="retaroct-count-down">{formatRemainTime(countDownNum, format)}</Text>;
};
