import { View } from '@tarojs/components';
import CountDown from '../index';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import React from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

const curTime = Date.now();
/** 当天0点的毫秒数 */
const zeroV = new Date(new Date().toLocaleDateString().replace(/-/g, '/')).getTime();

export default () => {
  const [createTime, setCreateTime] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      // 假设：异步获取五分钟前创建的日期
      setCreateTime(Date.now() - 5 * 60_000);
    }, 2000);
  }, []);

  return (
    <View className="demo-countDown">
      <DemoBlock title="倒计时10秒" padding={'0 10px'}>
        <CountDown
          value={curTime}
          total={10_000}
          onChange={(v) => {
            if (v <= 0) Taro.showToast({ title: '到时间了', icon: 'none' });
          }}
        />
      </DemoBlock>
      <DemoBlock title="倒计时50分钟" padding={'0 10px'}>
        <CountDown value={curTime} total={50 * 60_000} />
      </DemoBlock>
      <DemoBlock title="倒计时3天" padding={'0 10px'}>
        <CountDown value={curTime} total={3 * 86400_000} />
      </DemoBlock>
      <DemoBlock title="2秒后进行五分钟倒计时" padding={'0 10px'}>
        <CountDown value={createTime} total={50 * 60_000} />
      </DemoBlock>
      <DemoBlock title="18:30下班倒计时" padding={'0 10px'}>
        <CountDown
          value={curTime}
          total={zeroV + 18.5 * 3600_000 - curTime}
          onChange={(v) => {
            if (v <= 0) Taro.showToast({ title: '该下班了~', icon: 'none' });
          }}
        />
      </DemoBlock>
    </View>
  );
};
