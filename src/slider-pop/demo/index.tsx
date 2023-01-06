import { View, Button } from '@tarojs/components'
import React, { useRef } from 'react';
import SliderPop, { SliderPopInstance } from '..';
import './index.less';

export default () => {
  const sliderPopRef = useRef<SliderPopInstance>(null)

  const popContent = (
    <View className="popContent">
      弹出层
    </View>
  )

  return (
    <View className='demo-slider-pop'>
      <SliderPop ref={sliderPopRef} popContent={popContent}>
        <View className="content">
          <Button className='btn' onClick={() => {sliderPopRef.current?.popShow()}}>打开弹出层</Button>
          内容区
        </View>
      </SliderPop>
    </View>
  )
}