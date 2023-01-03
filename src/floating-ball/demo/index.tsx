import { View } from '@tarojs/components';
import FloatingBall from '../index';
import './index.less';
import React, { useState } from 'react';

export default () => {
  return (
    <View className='demo-floating-ball'>
      <FloatingBall 
        style={{
          '--initial-position-bottom': '100px',
          '--initial-position-left': '0',
          '--z-index': '1000',
        }}
      >
        <View className='item'>自由</View>
      </FloatingBall>
      <FloatingBall 
        magnetic='x'
        style={{
          '--initial-position-bottom': '100px',
          '--initial-position-right': '0',
          '--z-index': '1000',
        }}
      >
        <View className='item'>吸边x</View>
      </FloatingBall>
      <FloatingBall 
        axis='y'
        style={{
          '--initial-position-bottom': '200px',
          '--initial-position-right': '0',
          '--z-index': '1000',
        }}
      >
        <View className='item'>仅y动</View>
      </FloatingBall>
      <KefuBall />
    </View>
  )
}

const KefuBall = () => {
  const [status, setStatus] = useState<-1 | 0 | 1>(1);

  return (
    <FloatingBall 
      axis='xy'
      magnetic='x'
      onOffsetChange={() => {
        setStatus(0)
      }}
      onMagnetic={(isLeft) => {
        if(isLeft) {
          setStatus(-1)
        } else {
          setStatus(1)
        }
      }}
      style={{
        '--initial-position-top': '200px',
        '--initial-position-right': '0',
        '--z-index': '1000',
      }}
    >
      <View className={`com-kefu-ball ${status === 0 ? 'com-kefu-ball-active' : status === -1 ? 'com-kefu-ball-left' : ''}`}>
        <View className="kefu-ball">
          客服
        </View>
      </View>
    </FloatingBall>
  )
}