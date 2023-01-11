import useCountDown from '../use-count-down';
import { formatRemainTime } from '../utils/format';
import { Text } from '@tarojs/components';
import { useEffect } from 'react';
import './index.less';
import React from 'react';

type PropsType = {
  /** 起始时间 如果不传就是现在的时间 */
  value?: number;
  /** 倒计时时间，默认40min */
  total?: number;
  onChange?: (val: number) => void;
};

export default ({ value, total = 2400_000, onChange }: PropsType) => {
  // 待付款倒计时 待处理-倒计时时间为0退出当前页
  const [countDownNum, setCountDown] = useCountDown();
  useEffect(() => {
    if (value !== void 0) {
      setCountDown(value, total);
    }
  }, [value]);
  useEffect(() => {
    if (countDownNum !== void 0) {
      onChange?.(countDownNum);
    }
  }, [countDownNum]);
  return <Text className="retaroct-count-down">{formatRemainTime(countDownNum)}</Text>;
};
