import DemoBlock from '../../demo-block';
import { View } from '@tarojs/components';
import Loading from '..';
import React from 'react';

export default () => {
  return (
    <View className="demo-switch">
      <DemoBlock title="常规使用" padding="0 10px">
        <Loading />
      </DemoBlock>
    </View>
  );
};
