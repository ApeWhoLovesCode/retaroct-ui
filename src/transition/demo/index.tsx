import { View } from '@tarojs/components';
import Transition from '../index';
import React, { useRef } from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  return (
    <View className="demo-transition">
      <DemoBlock title="常规使用"></DemoBlock>
    </View>
  );
};
