import { View } from '@tarojs/components';
import './index.less';
import DemoBlock from '../../demo-block';
import Slider from '..';
import React from 'react';

export default () => {
  return (
    <View className="demo-slider">
      <DemoBlock title="常规使用" padding="0 10px">
        <Slider />
      </DemoBlock>
    </View>
  );
};
