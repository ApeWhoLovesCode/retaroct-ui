import { View } from '@tarojs/components';
import FloatingBall from '../index';
import './index.less';
import React from 'react';

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
    </View>
  )
}