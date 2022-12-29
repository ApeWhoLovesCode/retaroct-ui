import { View } from '@tarojs/components';
import Tabs from '../index';
import React, { useState } from 'react';
import './index.less';


export default () => {
  const [tabsList, setTabsList] = useState(['苹果', '香蕉', '菠萝']);

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
