import { View } from '@tarojs/components'
import CountDown from '../index';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import React from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

const curTime = Date.now()

export default () => {
  const [createTime, setCreateTime] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      // 假设：异步获取五分钟前创建的日期
      setCreateTime(Date.now() - 5 * 60_000)
    }, 1000)
  }, [])

  return (
    <View className='demo-countDown'>
      <DemoBlock title='倒计时10秒' padding={10}>
        <CountDown 
          value={curTime} 
          total={10_000} 
          onChange={v => {
            if(v <= 0) Taro.showToast({title: '到时间了', icon: 'none'})
          }} 
        />
      </DemoBlock>
      <DemoBlock title='倒计时50分钟'  padding={10}>
        <CountDown value={curTime} total={50 * 60_000} />
      </DemoBlock>
      <DemoBlock title='倒计时3天'  padding={10}>
        <CountDown value={curTime} total={3 * 86400_000} />
      </DemoBlock>
      <DemoBlock title='异步获取五分钟前创建的日期' padding={10}>
        <CountDown value={createTime} total={50 * 60_000} />
      </DemoBlock>
    </View>
  )
}