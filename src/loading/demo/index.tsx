import { View } from '@tarojs/components';
import Loading from '../index';
import React from 'react';
import './index.less';

export default () => {
  return (
    <View className="demo-loading">
      加载中
      <Loading />
    </View>
  );
};
