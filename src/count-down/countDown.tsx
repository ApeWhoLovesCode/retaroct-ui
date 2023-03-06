import useCountDown from '../use-count-down';
import { formatRemainTime } from '../utils/format';
import { Text } from '@tarojs/components';
import { useEffect } from 'react';
import React from 'react';
import { CountDownProps } from './type';
import { withNativeProps } from '../utils/native-props';

export default ({
  value,
  total = 2400_000,
  format = 'D天HH时mm分ss秒',
  onChange,
  ...ret
}: CountDownProps) => {
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
  return withNativeProps(
    ret,
    <Text className="retaroct-count-down">{formatRemainTime(countDownNum, format)}</Text>,
  );
};
