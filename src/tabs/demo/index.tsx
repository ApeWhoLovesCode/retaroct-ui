import { View } from '@tarojs/components';
import Tabs from '../index';
import React from 'react';
import './index.less';

const tabsList = ['苹果', '香蕉', '菠萝'];

export default () => {
  return (
    <View className="demo-tabs">
      <Tabs list={tabsList} activeTextClass="tabActive">
        {tabsList.map((item, i) => (
          <Tabs.Tab key={item + i} title={item} />
        ))}
      </Tabs>
    </View>
  );
};
