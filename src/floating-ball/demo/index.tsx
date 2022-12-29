import { View } from '@tarojs/components';
import FloatingBall from '../index';
import './index.less';
import React from 'react';

export default () => {
  return (
    <View className='demo-floating-ball'>
      <View>demo-floating-ball</View>
      <FloatingBall 
        magnetic='x'
        style={{
          '--initial-position-bottom': '100px',
          '--initial-position-right': '0',
          '--z-index': '1000',
        }}
      >
        <View className='content'>内容</View>
      </FloatingBall>
    </View>
  )
}