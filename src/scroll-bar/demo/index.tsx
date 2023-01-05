import { View, Text } from '@tarojs/components'
import React from 'react';
import ScrollBar from '..';
import DemoBlock from '../../demo-block';
import './index.less';

export default () => {

  const newTitle = (
    <View className="newTitle">
      <Text className="left">头-</Text>
      <Text className="center">这里是中间的内容</Text>
      <Text className="right">-尾部</Text>
    </View>
  )

  return (
    <View className='demo-scroll-bar'>
      <DemoBlock title='正常使用'>
        <ScrollBar title='HELLO WORLD' />
      </DemoBlock>
      <DemoBlock title='调整文字间距、颜色、速度'>
        <ScrollBar title='HELLO WORLD' space={100} color={'skyblue'} speed={70} />
      </DemoBlock>
      <DemoBlock title='自定义title'>
        <ScrollBar title={newTitle} />
      </DemoBlock>
    </View>
  )
}